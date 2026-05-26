from sqlalchemy import Column,Integer,String,ForeignKey,Date,Boolean
from sqlalchemy.orm import relationship
from datetime import date

from app.database.base import Base

class Notification(Base):
    __tablename__="notifications"
    id=Column(Integer,primary_key=True ,index=True)

    message= Column(String ,nullable=False)

    is_read=Column(Boolean,default=False)

    created_at=Column(Date,default=date.today)

    # user who recives notification:
    user_id=Column(Integer,ForeignKey("users.id"))

    # relationship:
    user=relationship( "User",back_populates="notifications")