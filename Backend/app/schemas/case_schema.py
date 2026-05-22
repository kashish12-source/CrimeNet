from pydantic import BaseModel
from datetime import date

class Case(BaseModel):
    id:int 
    crime_id:int
    officer_id:int
    case_status:str
    remarks:str
    updated_at:date

class CaseResponse(BaseModel):
    id:int 
    crime_id:int
    officer_id:int
    case_status:str
    remarks:str
    updated_at:date
    class Config:
        from_attributes=True
        