from pydantic import BaseModel

from app.models.entities import RoleEnum


class LoginRequest(BaseModel):
    login_id: str  # email or username
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "AuthUser"


class AuthUser(BaseModel):
    id: int
    username: str
    email: str
    role: RoleEnum

    class Config:
        from_attributes = True
