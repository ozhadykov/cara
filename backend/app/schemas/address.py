from pydantic import BaseModel

class Address(BaseModel):
    street: str
    street_number: str
    city: str
    zip_code: str
