from sqlalchemy.orm import relationship
from sqlalchemy import Column,Integer,String,ForeignKey,Date
from datetime import date

from app.database.base import Base

class Crime(Base):

    __tablename__ = "crimes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    location = Column(String, nullable=False)

    status = Column(String, default="Pending")

    created_at = Column(Date, default=date.today)

    reported_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    assigned_officer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    reporter = relationship(
        "User",
        back_populates="crimes",
        foreign_keys=[reported_by]
    )
    assigned_officer= relationship(
        "User",
        foreign_keys=[assigned_officer_id]
    )

    investigations=relationship(
        "InvestigationBook",
        back_populates="crime"
    )

    evidence = relationship(
    "Evidence",
    back_populates="crime",
    cascade="all, delete"
)
    
    logs=relationship("Activity_logs",
                      back_populates="crime")
                      