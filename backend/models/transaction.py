from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime, date
import uuid

class TransactionCreate(BaseModel):
    transaction_type: Literal['income', 'expense']
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    description: Optional[str] = None

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transaction_type: Literal['income', 'expense']
    amount: float
    category: str
    description: Optional[str] = None
    transaction_date: date = Field(default_factory=date.today)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            date: lambda v: v.isoformat()
        }

class MonthlySummary(BaseModel):
    total_income: float = 0.0
    total_expenses: float = 0.0
    balance: float = 0.0
    month: str