from typing import List, Optional, Union
from pydantic import BaseModel
from ..schemas.pairs_generator import PairsGeneratorBaseData


class Response(BaseModel):
    success: bool
    message: str
    data: Optional[Union[
        PairsGeneratorBaseData,
        List[Union[str, object]],
        int]] = None
