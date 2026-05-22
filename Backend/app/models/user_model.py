from sqlalchemy.orm import relationship
from sqlalchemy import Date
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime
from datetime import date
from app.database.base import Base

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)

    username=Column(String,nullable=False)

    email=Column(String,nullable=False)
    
    password=Column(String,nullable=False)

    role=Column(String,nullable=False,default="citizen")

    address=Column(String,nullable=False)

    phone_number=Column(String,nullable=False)

    created_at=Column(Date,default=date.today(),nullable=False)

    crimes=relationship("Crime",back_populates="user")
