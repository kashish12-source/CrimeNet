from pydantic import BaseModel
from datetime import date

class Evidence(BaseModel):
    crime_id: int

    file_path: str

    file_type:str

    created_at:date

class EvidenceResponse(BaseModel):
    id: int

    crime_id: int

    file_path: str

    file_type:str

    created_at:date
    class Config:
        from_attributes=True