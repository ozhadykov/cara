import pandas as pd
import numpy as np
import amplpy
import json
from amplpy import AMPL
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .schemas.assistants import Assistant
from .schemas.children import Child

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


@app.post("/generate_pairs")
async def generate_pairs(data: GeneratePairsIN):
    print(json.dumps(data.model_dump(), indent=4))
    return 'hello'


@app.get("/ampl", summary="solving dummy model with generated data", response_model=devAMPLResponse)
def read_root():
    # TODO generate dummy data
    # 1. generate children df
    children_df = generate_dummy_children()

    # 2. generate assistant df
    assistants_df = generate_dummy_assistants()

    # 3. generate Qualification table
    qual = assistants_df['qualification'].to_numpy().reshape(-1, 1)  # vertical
    req = children_df['qualification_requirment'].to_numpy().reshape(
        1, -1)  # horizontal

    diff = np.abs(req - qual)  # calculate the difference
    score = np.where(diff == 0, 3, np.where(diff == 1, 2, 1))  # setting scores

    score_df = pd.DataFrame(
        score, index=assistants_df['assistant_id'], columns=children_df['child_id'])

    # 4. generate distance table, just rand in range from 1 to 50km
    distances = np.random.randint(low=1, high=100, size=(20, 20))
    distances_df = pd.DataFrame(
        distances, index=assistants_df['assistant_id'], columns=children_df['child_id'])

    # DEV AND DEBUG ONLY
    print(score_df)
    print("\n distance matrix")
    print(distances_df)

    response = 'hello'

    # 5. use amplpy to calculate best pairs
    try:
        ampl = AMPL()
        ampl.set_option("solver", "highs")

        ampl.eval(
            r"""
            set CHILDREN;
            set ASSISTANTS;

            param qualification_requirment {CHILDREN};
            param hours_requested {CHILDREN};
            param qualification {ASSISTANTS};
            param capacity_hours {ASSISTANTS};
            param QUALIFICATIONS {ASSISTANTS, CHILDREN};
            param DISTANCES {ASSISTANTS, CHILDREN};

            var Assign {i in CHILDREN, j in ASSISTANTS} binary;

            maximize Total_Pairs:
                sum {i in CHILDREN, j in ASSISTANTS} Assign[i, j] * QUALIFICATIONS[i, j];

            subject to CapacityConstraint {j in ASSISTANTS}:
                sum {i in CHILDREN} Assign[i, j] * hours_requested[i] <= capacity_hours[j];

            subject to DistanceConstraint {j in ASSISTANTS}:
                sum {i in CHILDREN} Assign[i, j] * DISTANCES[i, j] <= 50;
        """
        )
        # additionals
        # add constraint about Ci <= Qi if i want to assign assistant to child
        # add discrete timeslots, 2 dimensions: noon, afternoon? time slot lock
        # greede children and time slot matrix for caretakers, 3 matrixes?
        # distance measuring? through possible aasosiations, teacher have to reach the school

        ampl.set_data(children_df[['child_id', 'qualification_requirment',
                                   'hours_requested']].set_index("child_id"), "CHILDREN")
        ampl.set_data(assistants_df[['assistant_id', 'qualification', 'capacity_hours']].set_index(
            "assistant_id"), "ASSISTANTS")
        ampl.get_parameter("QUALIFICATIONS").set_values(score_df)
        ampl.get_parameter("DISTANCES").set_values(distances_df)

        ampl.solve()

        # check if it is solved
        result = ampl.get_value("solve_result")
        if result == "optimal" or "solved":
            assign_df = ampl.get_variable(
                "Assign").get_values().to_pandas().reset_index()
            assign_df = assign_df.rename(
                columns={"index0": "child_id", "index1": "assistant_id", "Assign.val": "assigned"})
            # Filter only rows where assignment happened
            assigned = assign_df[assign_df["assigned"] >= 1]
            total_pairs = len(assigned['child_id'].unique())
            print(assigned)
            response = {
                "status": "success",
                "total_pairs": total_pairs,
                "assignments": assigned.to_json()
            }
        else:
            response = {
                "status": "failure",
                "reason": result
            }

    except amplpy.AMPLException:
        return amplpy.AMPLException.get_message()

    return response


# DEV HELPERS

def generate_dummy_children():
    children_df = pd.DataFrame(
        columns=['child_id', 'name', 'family_name', 'qualification_requirment', 'hours_requested'])

    first_names = [
        "Liam", "Emma", "Noah", "Olivia", "Ava",
        "Elijah", "Sophia", "Lucas", "Isabella", "Mason",
        "Amelia", "Logan", "Mia", "Ethan", "Harper",
        "James", "Evelyn", "Benjamin", "Charlotte", "Alexander"
    ]
    family_names = [
        "Smith", "Johnson", "Williams", "Brown", "Jones",
        "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin"
    ]
    qualification_requirments = np.random.randint(low=1, high=4, size=(20))
    hours_requests = np.random.randint(low=5, high=40, size=(20))

    children_df['child_id'] = range(1, 21)
    children_df['name'] = first_names
    children_df['family_name'] = family_names
    children_df['qualification_requirment'] = qualification_requirments
    children_df['hours_requested'] = hours_requests

    return children_df


def generate_dummy_assistants():
    assistants_df = pd.DataFrame(columns=[
        'assistant_id',
        'name',
        'family_name',
        'qualification',
        'capacity_hours'
    ])

    first_names = [
        "Anya", "Mateo", "Niko", "Aisha", "Ravi",
        "Zara", "Hugo", "Sina", "Kai", "Marek",
        "Leila", "Tariq", "Elina", "Yuki", "Kofi",
        "Soraya", "Jonas", "Noura", "Elias", "Fatima"
    ]

    family_names = [
        "Kowalski", "Nguyen", "Alvarez", "Okafor", "Dubois",
        "Schneider", "Yamamoto", "Rahman", "Petrov", "Ibrahim",
        "Fernandes", "O'Connor", "Mendoza", "Chen", "Singh",
        "Aliyev", "Barros", "Kim", "Nordin", "Jokic"
    ]

    assistants_df['assistant_id'] = range(1, 21)
    assistants_df['name'] = first_names
    assistants_df['family_name'] = family_names
    assistants_df['qualification'] = np.random.randint(
        low=1, high=4, size=(20))
    assistants_df['capacity_hours'] = np.random.randint(
        low=8, high=40, size=(20))

    return assistants_df
