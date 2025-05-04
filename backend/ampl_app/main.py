import pandas as pd
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/ampl")
def read_root():
    # TODO generate dummy data
    # 1. generate children df
    children_df = generate_dummy_children()

    print(children_df.head())
    # 2. generate assistant df
    # 3. generate Qualification table
    # 4. generate distance table, just rand in range from 1 to 50km

    return {"data": "Hello from ampl container"}


# DEV HELPERS

def generate_dummy_children():
    children_df = pd.DataFrame(
        columns=['name', 'family_name', 'qualification_requirment', 'hours_requested'])

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
    qualification_requirments = np.random.randint(low=1, high=3, size=(20))
    hours_requests = np.random.randint(low=5, high=40, size=(20))

    children_df['name'] = first_names
    children_df['family_name'] = family_names
    children_df['qualification_requirment'] = qualification_requirments
    children_df['hours_requested'] = hours_requests

    return children_df
