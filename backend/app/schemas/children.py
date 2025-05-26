from pydantic import BaseModel
from typing import List, Optional, Union

class Child(BaseModel):
    first_name: str
    family_name: str
    required_qualification: str
    requested_hours: int
    street: str
    street_number: str
    city: str
    zip_code: str

class ChildrenIn(BaseModel):
    children: List[Child]
