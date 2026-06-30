from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime


# ---------- Auth Schemas ----------

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    department: str


# ---------- Complaint Schemas ----------

ComplaintStatus = Literal["Pending", "In Progress", "Resolved"]


class ComplaintCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=5, max_length=2000)


class ComplaintStatusUpdateRequest(BaseModel):
    status: ComplaintStatus


class ComplaintResponse(BaseModel):
    id: str
    user_id: str
    student_name: str
    department: str
    title: str
    description: str
    status: ComplaintStatus
    created_at: datetime


# Needed because TokenResponse references UserResponse before it's defined
TokenResponse.model_rebuild()
