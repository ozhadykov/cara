from pydantic import BaseModel
from typing import List, Optional


class Assistant(BaseModel):
    id: Optional[int] = None
    first_name: str
    family_name: str
    qualification: int
    qualification_text: Optional[str] = None
    qualification_value: Optional[int] = None
    min_capacity: float
    max_capacity: float
    has_car: bool
    street: str
    street_number: str
    city: str
    zip_code: str
    address_id: Optional[int] = None


class AssistantIn(BaseModel):
    data: List[Assistant]
