from sqlalchemy.orm import relationship
from datetime import date
from sqlalchemy import Column,Integer,String,ForeignKey,DateTime

from database.base import Base

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)

    username=Column(String,nullable=False)

    email=Column(String,nullable=False)
    
    password=Column(String,nullable=False)

    role=Column(String,nullable=False)

    created_at=Column(DateTime,default=date.today,nullable=False)
