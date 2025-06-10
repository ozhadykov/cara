from pydantic import BaseModel

class Distance(BaseModel):
    id: int
    origin_address_id: int
    destination_address_id: int
    distance: float
    travel_time: float