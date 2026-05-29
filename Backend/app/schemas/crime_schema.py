from pydantic import BaseModel
from datetime import date
from typing import Optional

class CrimeCreate(BaseModel):

    
    title: str

    description: str

    location: str
    

class AssignOfficer(BaseModel):

    
    officer_id: int
    

class UpdateStatus(BaseModel):

    status: str

class CrimeResponse(BaseModel):


    id: int

    title: str

    description: str

    location: str

    status: str

    reported_by: int

    assigned_officer_id: Optional[int] = None

    created_at: Optional[date] = None

    class Config:

        from_attributes = True

