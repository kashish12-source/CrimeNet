from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database.base import Base

class BlockchainBlock(Base):
    __tablename__ = "blockchain_blocks"

    id = Column(Integer, primary_key=True, index=True)
    block_index = Column(Integer, unique=True, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    action = Column(String, nullable=False)
    data = Column(Text, nullable=False) # JSON-serialized data
    previous_hash = Column(String, nullable=False)
    hash = Column(String, nullable=False)
