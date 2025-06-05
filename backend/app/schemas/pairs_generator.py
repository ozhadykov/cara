from pydantic import BaseModel
from typing import List
from ..schemas import children, assistants

class Pair(BaseModel):
    child_id: int
    assistant_id: int

class PairsGeneratorBaseData(BaseModel):
    children: List[children.Child]
    assistants: List[assistants.Assistant]
    pairs: List[Pair]