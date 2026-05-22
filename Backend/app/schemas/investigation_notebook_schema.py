from pydantic import BaseModel
from datetime import date

class InvestigationBook(BaseModel):
    note:str


class InvestigationResponse(BaseModel):
    id:int
    note:str
    created_at:date
    crime_id:int
    officer_id:int
    class Config:
        form_attributes=True