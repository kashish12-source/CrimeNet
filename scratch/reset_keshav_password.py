import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load env from Backend
load_dotenv(dotenv_path="../Backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:root@localhost:5432/CrimeNet")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    from app.models.user_model import User
    from app.models.crime_model import Crime
    from app.models.blockchain_model import BlockchainBlock
    from app.models.evidence_model import Evidence
    from app.models.activitylogs_model import Activity_logs
    from app.models.investigation_notebook_model import InvestigationBook
    from app.models.notification_model import Notification
    from app.auth.hashing import hash_password
    
    keshav = db.query(User).filter(User.email == "keshav@gmail.com").first()
    if keshav:
        keshav.password = hash_password("password123")
        db.commit()
        print("Keshav's password successfully reset to 'password123'")
    else:
        print("Keshav not found")
finally:
    db.close()
