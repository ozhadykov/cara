import pandas as pd
import numpy as np
from amplpy import AMPL
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

    # 2. generate assistant df
    assistants_df = generate_dummy_assistants()

    # 3. generate Qualification table
    qual = assistants_df['qualification'].to_numpy().reshape(-1, 1)  # vertical
    req = children_df['qualification_requirment'].to_numpy().reshape(1, -1)  # horizontal

    diff = np.abs(req - qual)  # calculate the difference
    score = np.where(diff == 0, 3, np.where(diff == 1, 2, 1))  # setting scores

    score_df = pd.DataFrame(score, index=assistants_df['assistant_id'], columns=children_df['child_id'])

    # 4. generate distance table, just rand in range from 1 to 50km
    distances = np.random.randint(low=1, high=100, size=(20, 20))
    distances_df = pd.DataFrame(distances, index=assistants_df['assistant_id'], columns=children_df['child_id'])

    print(score_df)
    print("\n distance matrix")
    print(distances_df)

    # 5. use amplpy to calculate best pairs

    return {"data": "Hello from ampl container"}


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
        'assistant_id'
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
