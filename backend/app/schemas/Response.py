from typing import Optional, Any
from pydantic import BaseModel


class Response(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    status: Optional[str] = None
