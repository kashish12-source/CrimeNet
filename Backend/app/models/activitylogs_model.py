from sqlalchemy import Column,Integer,String,ForeignKey,DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base
from datetime import date

class Activity_logs(Base):
    __tablename__="activitylog"
    id=Column(Integer,primary_key=True,index=True)

    action=Column(String,nullable=False)

    timestamp= Column(DateTime,default=date.today)

    crime_id=Column(Integer,ForeignKey("crimes.id"))

    performed_by=Column(Integer,ForeignKey("users.id"))

    # relationships:
    crime=relationship("Crime",back_populates="logs")

    user=relationship("User")