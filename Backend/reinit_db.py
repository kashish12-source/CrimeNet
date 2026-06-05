from sqlalchemy import create_engine
from app.database.base import Base, engine
from app.database.connection import SessionLocal
from app.models.user_model import User
from app.models.crime_model import Crime
from app.models.blockchain_model import BlockchainBlock
from app.models.evidence_model import Evidence
from app.models.activitylogs_model import Activity_logs
from app.models.investigation_notebook_model import InvestigationBook
from app.models.notification_model import Notification
from app.auth.hashing import hash_password
from app.utils.blockchain import add_block_to_ledger

print("Dropping all existing database tables...")
Base.metadata.drop_all(bind=engine)

print("Creating database tables based on new models...")
Base.metadata.create_all(bind=engine)

print("Seeding database with the SINGLE Admin account...")
db = SessionLocal()

try:
    # Seed Admin only - NO OFFICERS, NO CITIZENS, NO CASES
    admin_pw = hash_password("adminpassword")
    admin = User(
        username="admin_user",
        email="admin@crimenet.gov",
        password=admin_pw,
        role="admin",
        address="Police HQ, Bhopal, Madhya Pradesh",
        phone_number="+919999999999"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print("Admin seeded successfully!")
    
    # Initialize blockchain with a genesis block
    add_block_to_ledger(db, "GENESIS", {"message": "CrimeNet Madhya Pradesh Blockchain Ledger Initialized"})
    print("Blockchain ledger initialized with Genesis block!")
    
    print("Database re-initialization and seeding completed successfully! Only 1 user (Admin) exists.")
    
except Exception as e:
    db.rollback()
    print("An error occurred during database seeding:", e)
finally:
    db.close()
