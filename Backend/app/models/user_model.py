from sqlalchemy.orm import relationship
from sqlalchemy import Column,Integer,String,Date,ForeignKey
from datetime import date

from app.database.base import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, nullable=False)

    email = Column(String, nullable=False)

    password = Column(String, nullable=False)

    role = Column(String, default="citizen")

    address = Column(String, nullable=False)

    phone_number = Column(String, nullable=False)

    created_at = Column(Date, default=date.today)

    crimes = relationship(
        "Crime",
        back_populates="reporter",
        foreign_keys="Crime.reported_by"
    )