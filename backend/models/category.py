from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime
import uuid

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    # frontend must send either "income" or "expense"
    type: Literal['income', 'expense']

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: Literal['income', 'expense']
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
