from sqlalchemy.orm import relationship
from sqlalchemy import Column,Integer,String,Date,ForeignKey,Boolean
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
    
    specialization = Column(String, nullable=True)


    crimes = relationship(
        "Crime",
        back_populates="reporter",
        foreign_keys="Crime.reported_by"
    )

    evidence = relationship(
    "Evidence",
    back_populates="officer"
    )
    
    notifications = relationship(
    "Notification",
    back_populates="user",
    cascade="all, delete-orphan"
    )
  
    assigned_area = Column(
        String,
        nullable=True
    )

    is_verified = Column(
        Boolean,
        default=False
    )

    id_proof_type = Column(
        String,
        nullable=True
    )

    id_proof_number = Column(
        String,
        nullable=True
    )

    id_proof_url = Column(
        String,
        nullable=True
    )

    phone_verified = Column(
        Boolean,
        default=False
    )