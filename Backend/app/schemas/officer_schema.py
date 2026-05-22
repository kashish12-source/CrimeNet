from pydantic import BaseModel
from datetime import date

class Officer(BaseModel):
    name:str

    dadage_number:str

    department:str

    rank:str

class OfficerResponse(BaseModel):
    id:int

    name:str

    dadage_number:str

    department:str

    rank:str
    class Config:
        from_attributes=True