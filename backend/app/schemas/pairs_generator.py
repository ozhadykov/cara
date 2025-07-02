from pydantic import BaseModel
from typing import List, Dict

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
    modelParams: Dict[str, int]


class CreateSinglePairIn(BaseModel):
    child: Child
    assistant: Assistant
