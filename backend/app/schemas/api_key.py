from pydantic import BaseModel


class ApiKey(BaseModel):
    apiKey: str

class WeightsIn(BaseModel):
    distanceImportance: int
    qualificationImportance: int
