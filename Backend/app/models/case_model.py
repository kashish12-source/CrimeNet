from sqlalchemy import Column, Integer, String, Float
from datetime import date
from .base import Base
from sqlalchemy.orm import relationship

class Case(Base):
    __tablename__="cases"
    id=Column(Integer, primary_key=True, index=True)

    crime_id=Column(Integer, ForeignKey("crimes.id"))

    officer_id=Column(Integer, ForeignKey("officers.id"))

    case_status=Column(String, default="open")

    remarks=Column(String)

    updated_at=Column(date, default=date.today)

    crime=relationship("Crime",back_populates="cases")

    officer=relationship("Officer",back_populates="cases")

    


