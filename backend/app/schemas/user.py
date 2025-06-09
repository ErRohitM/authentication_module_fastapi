from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional
from app.utils.security import validate_password_strength
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    name: str
    password: str
    phone_number: Optional[str] = None
    address: Optional[str] = None

    @validator('password')
    def password_strength(cls, v):
        if not validate_password_strength(v):
            raise ValueError(
                "Password must be at least 12 characters and include uppercase letters, "
                "lowercase letters, numbers, and special characters"
            )
        return v


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None


class UserInDB(UserBase):
    id: int
    name: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserOut(UserBase):
    id: int
    name: str
    phone_number: Optional[str] = None
    address: Optional[str] = None

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str