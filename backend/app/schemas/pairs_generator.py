from pydantic import BaseModel
from typing import List

from .assistants import Assistant
from .children import Child


class Pair(BaseModel):
    child_id: int
    assistant_id: int


class PairsGeneratorBaseData(BaseModel):
    children: List[Child]
    assistants: List[Assistant]
    pairs: List[Pair]


class GeneratePairsData(BaseModel):
    children: List[Child]
    assistants: List[Assistant]
