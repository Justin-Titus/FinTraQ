from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember: bool = True

class RefreshTokenEntry(BaseModel):
    token: str
    expires_at: datetime
    user_agent: Optional[str] = None
    ip: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    hashed_password: str
    role: str = "user"
    refresh_tokens: List[RefreshTokenEntry] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"
    created_at: Optional[datetime] = None
