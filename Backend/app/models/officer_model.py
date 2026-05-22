from sqlalchemy import Column, Integer, String 
from datetime import date
from app.database.base import Base
from sqlalchemy.orm import relationship 

class Officer(Base):
    __tablename__="officers"
    id= Column(Integer, primary_key=True, index=True)

    name=Column(String, index=True)

    dadage_number=Column(String, unique=True)

    department=Column(String)

    rank=Column(String)

    assigned_area=Column(String, nullable=False)


