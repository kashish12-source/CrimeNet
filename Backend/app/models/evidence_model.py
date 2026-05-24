from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Evidence(Base):

    __tablename__ = "evidence"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    file_name = Column(
        String,
        nullable=False
    )

    file_path = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    crime_id = Column(
        Integer,
        ForeignKey("crimes.id")
    )

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    # RELATIONSHIPS

    crime = relationship(
        "Crime",
        back_populates="evidence"
    )

    officer = relationship(
        "User",
        back_populates="evidence"
    )