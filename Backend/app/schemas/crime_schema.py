from pydantic import BaseModel
from datetime import date

class Crime(BaseModel):
    title: str

    description: str

    crime_type: str

    location: str

    latitude: str

    longitude: str

    evidence: str

    created_at:date

class CrimeResponse(BaseModel):
    id: int

    title: str

    description: str

    crime_type: str

    location: str

    latitude: str

    longitude: str

    status: str

    reported_by: int

    created_at:date
    class Config:
        from_attributes=True