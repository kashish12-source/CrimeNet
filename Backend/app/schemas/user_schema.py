from pydantic import BaseModel , EmailStr
from typing import Optional
from datetime import date

class UserLogin(BaseModel):
    email:EmailStr
    password:str
class UserCreate(BaseModel):
    email:EmailStr
    username:str
    password:str
    role:str
    address:str
    phone_number:str
    specialization:Optional[str]=None
    assigned_area:Optional[str]=None
    created_at:Optional[date]=None

class UserResponse(BaseModel):
    id:int
    email:EmailStr
    username:str
    role:str
    address:str
    phone_number:str
    specialization:Optional[str]=None
    assigned_area:Optional[str]=None
    is_verified:bool
    phone_verified:bool
    id_proof_type:Optional[str]=None
    id_proof_number:Optional[str]=None
    id_proof_url:Optional[str]=None
    created_at:date
    class Config:
        from_attributes=True