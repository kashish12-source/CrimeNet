from pydantic import BaseModel
from datetime import date

class Notification(BaseModel):
    id:int

    message:str

    is_read:bool

    created_at:date

    class Config:
        from_attributes=True