from pydantic import BaseModel , EmailStr
from datetime import date

class UserCreate(BaseModel):
    email:EmailStr
    username:str
    password:str
    role:str
    address:str
    phone_number:str
    created_at:date

class UserResponse(BaseModel):
    id:int
    email:EmailStr
    username:str
    role:str
    created_at:date
    class Config:
        from_attributes=True