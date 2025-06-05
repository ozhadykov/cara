from pydantic import BaseModel
from typing import List, Optional

class Child(BaseModel):
    id: Optional[int] = None
    first_name: str
    family_name: str
    required_qualification: str
    requested_hours: int
    street: str
    street_number: str
    city: str
    zip_code: str

class ChildrenIn(BaseModel):
    data: List[Child]
