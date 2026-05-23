from sqlalchemy.orm import relationship
from sqlalchemy import Column,Integer , String, ForeignKey, DateTime
from database.base import Base
from datetime import date

class Evidence(Base):
    __tablename__="evidence"
    id=Column(Integer,primary_key=True,index=True)

    crime_id=Column(Integer,ForeignKey("crimes.id"))

    uploaded_by=Column(Integer,ForeignKey("officer.id"))
    
    officer_name=Column(String,ForeignKey("officer.name"))

    file_type=Column(String)
    
    file_path=Column(String)

    uploaded_at=Column(DateTime,default=date.today)

    description=Column(String,nullable=False)

    crime=relationship("Crime",back_populates="evidence")

    officer=relationship("Officer",back_populates="evidence")

