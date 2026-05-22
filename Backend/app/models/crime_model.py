from sqlalchemy.orm import relationship 
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database.base import Base
from datetime import date

class Crime(Base):
    __tablename__="crimes"
    id=Column(Integer, primary_key=True, index=True)

    title=Column(String,index=True)

    description=Column(String)

    crime_type=Column(String)

    location=Column(String,nullable=False)

    latitude=Column(String)

    longitude=Column(String)

    status=Column(String,default="reported")

    reported_by=Column(Integer, ForeignKey("users.id"))

    created_at=Column(Date,default=date.today())

    user=relationship("User",back_populates="crimes")

