import pandas as pd
import json
from pathlib import Path
from amplpy import AMPL
from typing import List, Dict
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .schemas.assistants import Assistant
from .schemas.children import Child
from .schemas.distance import Distance

app = FastAPI()

origins = [
    "http://localhost:8080",  # Production Backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class devAMPLResponse(BaseModel):
    status: str
    total_pairs: float
    assignments: object


class GeneratePairsIN(BaseModel):
    children: List[Child]
    assistants: List[Assistant]
    distances: List[Distance]
    model_params: Dict[str, int]


@app.post("/generate_pairs")
async def generate_pairs(data: GeneratePairsIN):
    children = data.children
    assistants = data.assistants
    distances = data.distances

    # 1. --- Extract data into DataFrames ---
    child_df = pd.DataFrame([{
        "child_id": str(c.id),
        "qualification_required": c.required_qualification,
        "requested_hours": c.requested_hours,
        "address_id": c.address_id
    } for c in children])

    assistant_df = pd.DataFrame([{
        "assistant_id": str(a.id),
        "qualification": a.qualification,
        "min_capacity": a.min_capacity,
        "max_capacity": a.max_capacity,
        "has_car": a.has_car,
        "address_id": a.address_id
    } for a in assistants])

    dist_df = pd.DataFrame([{
        "origin": d.origin_address_id,
        "destination": d.destination_address_id,
        "distance": d.distance,
        "travel_time": d.travel_time
    } for d in distances])

    # 2. --- Build travel time matrix ---
    travel_matrix = {}
    for a in assistant_df.itertuples():
        for c in child_df.itertuples():
            match = dist_df[
                (dist_df['origin'] == a.address_id) &
                (dist_df['destination'] == c.address_id)
                ]
            if not match.empty:
                travel_matrix[(str(c.child_id), str(a.assistant_id))] = match.iloc[0]['travel_time']
            else:
                travel_matrix[(str(c.child_id), str(a.assistant_id))] = 9999  # infeasible

    # 3. --- Compute matching score matrix ---
    score_matrix = {}
    valid_matrix = {}
    tau = 900  # 15 min in seconds

    for a in assistant_df.itertuples():
        for c in child_df.itertuples():
            diff = abs(a.qualification - c.qualification_required)
            score = 3 if diff == 0 else (2 if diff == 1 else 1)
            travel = travel_matrix[(str(c.child_id), str(a.assistant_id))]
            score_matrix[(str(c.child_id), str(a.assistant_id))] = score
            valid_matrix[(str(c.child_id), str(a.assistant_id))] = int(
                a.qualification >= c.qualification_required and travel <= tau)

    # 4. --- Start AMPL and model ---
    model_path = Path(__file__).parent / "ampl_models" / "model_v_1_2.mod"
    ampl = AMPL()
    ampl.set_option("solver", "highs")
    ampl.read(str(model_path))  # The model from earlier message

    ampl.set["CHILDREN"] = list(child_df['child_id'])
    ampl.set["CARETAKERS"] = list(assistant_df['assistant_id'])

    ampl.param["D"] = child_df.set_index("child_id")["requested_hours"].to_dict()
    ampl.param["R"] = child_df.set_index("child_id")["qualification_required"].to_dict()
    ampl.param["minH"] = assistant_df.set_index("assistant_id")["min_capacity"].to_dict()
    ampl.param["maxH"] = assistant_df.set_index("assistant_id")["max_capacity"].to_dict()
    ampl.param["Q"] = assistant_df.set_index("assistant_id")["qualification"].to_dict()

    ampl.param["T"] = travel_matrix
    ampl.param["S"] = score_matrix
    ampl.param["valid"] = valid_matrix

    ampl.param["lambda1"] = 0.05
    ampl.param["lambda2"] = 0.001

    ampl.solve()

    # 5. --- Collect solution ---
    assignment_df = ampl.get_variable("x").get_values().to_pandas().reset_index()
    assignment_df = assignment_df[assignment_df["x.val"] > 0.5]
    assignment_df.columns = ["child_id", "assistant_id", "assigned"]

    return {
        "status": "success",
        "assignments": assignment_df.to_dict(orient="records"),
        "total_children_assigned": int(assignment_df["child_id"].nunique())
    }


@app.post("/generate_pairs_2")
async def generate_pairs(data: GeneratePairsIN):
    children = data.children
    assistants = data.assistants
    distances = data.distances
    model_params = data.model_params

    # --- Step 1: Prepare DataFrames ---
    child_df = pd.DataFrame([{
        "child_id": str(c.id),
        "qualification_required": c.required_qualification,
        "requested_hours": c.requested_hours,
        "address_id": c.address_id
    } for c in children])

    assistant_df = pd.DataFrame([{
        "assistant_id": str(a.id),
        "qualification": a.qualification,
        "max_capacity": a.max_capacity,
        "address_id": a.address_id,
        "has_car": a.has_car
    } for a in assistants])

    dist_df = pd.DataFrame([{
        "origin": d.origin_address_id,
        "destination": d.destination_address_id,
        "distance": d.distance,
        "travel_time": d.travel_time
    } for d in distances])

    # --- Step 2: Compute travel times ---
    travel_times = {}
    for a in assistant_df.itertuples():
        for c in child_df.itertuples():
            match = dist_df[
                (dist_df['origin'] == a.address_id) &
                (dist_df['destination'] == c.address_id)
            ]
            time = match.iloc[0]['travel_time'] if not match.empty else 9999
            travel_times[(c.child_id, a.assistant_id)] = time

    # --- Step 3: Reisescoreij calculation ---
    def travel_score(t):
        if t <= 900: return 1.0
        elif t >= 5400: return 0.0
        else: return round(1.0 - (t - 900) / (5400 - 900), 4)

    reisescore = {
        (i, j): travel_score(t) for (i, j), t in travel_times.items()
    }

    # --- Step 4: Qualification bonus (QualiBonusij) ---
    qualibonus = {}
    for a in assistant_df.itertuples():
        for c in child_df.itertuples():
            i, j = c.child_id, a.assistant_id
            rq, aq = c.qualification_required, a.qualification
            if aq < rq:
                qualibonus[(i, j)] = -99999
            elif aq == rq:
                qualibonus[(i, j)] = 100
            elif aq == rq + 1:
                qualibonus[(i, j)] = 66.6
            elif aq == rq + 2:
                qualibonus[(i, j)] = 33.3
            else:
                qualibonus[(i, j)] = 0

    # --- Step 5: Final Nutzenij score ---
    wRS = model_params.get("travelTimeImportance", 10)  # travel score weight, configurable
    nutzen = {}
    for key in travel_times:
        if qualibonus[key] < 0:
            nutzen[key] = qualibonus[key]
        else:
            nutzen[key] = round(wRS * reisescore[key] + qualibonus[key], 2)

    # --- Step 6: MaxBetreueri based on Split_Threshold ---
    split_threshold = model_params.get("splitThreshold", 20)
    max_betreuer = {
        c.child_id: 2 if c.requested_hours >= split_threshold else 1
        for c in child_df.itertuples()
    }

    # --- Step 7: Setup and Solve AMPL model ---
    model_path = Path(__file__).parent / "ampl_models" / "model_alex.mod"
    ampl = AMPL()
    ampl.set_option("solver", "highs")
    ampl.read(str(model_path))

    ampl.set['I'] = list(child_df['child_id'])
    ampl.set['J'] = list(assistant_df['assistant_id'])

    ampl.param['Zeitbedarf'] = child_df.set_index("child_id")["requested_hours"].to_dict()
    ampl.param['Zeitkapazitaet'] = assistant_df.set_index("assistant_id")["max_capacity"].to_dict()
    ampl.param['MaxBetreuer'] = max_betreuer
    ampl.param['Nutzen'] = nutzen

    ampl.param['wTU'] = model_params.get("overtimePenalty", 1.0)
    ampl.param['wTS'] = model_params.get("undertimePenalty", 2.0)
    ampl.param['aOT'] = model_params.get("allowedOvertime", 4)

    ampl.solve()

    # --- Step 8: Extract assignment ---
    x = ampl.get_variable("x").get_values().to_pandas()
    x = x[x["x.val"] > 0.5].reset_index()
    x.columns = ["child_id", "assistant_id", "assigned"]

    return {
        "status": "success",
        "assignments": x.to_dict(orient="records"),
        "total_children_assigned": int(x["child_id"].nunique())
    }

