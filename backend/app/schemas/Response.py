from typing import List, Optional, Union
from pydantic import BaseModel


class Response(BaseModel):
    success: bool
    message: str
    data: Optional[Union[List[Union[str, object]], int]] = None
