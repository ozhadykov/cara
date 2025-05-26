from pydantic import BaseModel


class ApiKey(BaseModel):
    apiKey: str
