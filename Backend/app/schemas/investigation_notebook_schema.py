from pydantic import BaseModel
from datetime import date


# REQUEST SCHEMA
class InvestigationCreate(BaseModel):
    note: str


# RESPONSE SCHEMA
class InvestigationResponse(BaseModel):
    id: int
    note: str
    created_at: date
    crime_id: int
    officer_id: int

    class Config:
        from_attributes = True