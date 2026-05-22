from pydantic import BaseModel
from datetime import date


class CrimeCreate(BaseModel):

    title: str

    description: str

    location:str


class AssignOfficer(BaseModel):
    officer_id:int

class UpdateStatus(BaseModel):
    status:str

class CrimeResponse(BaseModel):

    id: int

    title: str

    description: str

    status: str

    reported_by: int

    class Config:

        from_attributes = True