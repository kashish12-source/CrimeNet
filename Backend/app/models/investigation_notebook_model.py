from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey, Date
from datetime import date

from app.database.base import Base


class InvestigationBook(Base):

    __tablename__ = "investigation"

    id = Column(Integer, primary_key=True, index=True)

    note = Column(String, nullable=False)

    # FIXED NAME
    created_at = Column(Date, default=date.today)

    crime_id = Column(Integer, ForeignKey("crimes.id"))

    officer_id = Column(Integer, ForeignKey("users.id"))

    # RELATIONSHIPS
    crime = relationship(
        "Crime",
        back_populates="investigations"
    )

    officer = relationship("User")