from pydantic import BaseModel
from typing import List, Optional


class Child(BaseModel):
    id: Optional[int] = None
    first_name: str
    family_name: str
    required_qualification: int
    requested_hours: int
    street: str
    street_number: str
    city: str
    zip_code: str


class ChildrenIn(BaseModel):
    data: List[Child]


class ChildForDistanceMatrix(BaseModel):
    child_id: int
    address_id: int
    required_qualification_int: int
    latitude: float
    longitude: float
