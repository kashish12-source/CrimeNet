from pydantic import BaseModel
from datetime import datetime

class TimeLineResponse(BaseModel):
    event:str
    timestamp:datetime
    class Config:
        from_attributes=True
        