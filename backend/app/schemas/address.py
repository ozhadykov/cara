from pydantic import BaseModel
from typing import Optional

class Address(BaseModel):
    id: Optional[int] = None
    street: str
    street_number: str
    city: str
    zip_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DistanceMatrixAddress(BaseModel):
    id: int
    latitude: float
    longitude: float