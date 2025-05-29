from pydantic import BaseModel
from typing import List

class Assistant(BaseModel):
    first_name: str
    family_name: str
    qualification: str
    min_capacity: int
    max_capacity: int
    street: str
    street_number: str
    city: str
    zip_code: str

class AssistantIn(BaseModel):
    assistants: List[Assistant]
