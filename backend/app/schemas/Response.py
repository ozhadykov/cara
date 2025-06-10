from typing import Optional, Any
from pydantic import BaseModel


class Response(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
