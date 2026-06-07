import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load env from Backend
load_dotenv(dotenv_path="../Backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:root@localhost:5432/CrimeNet")
print("Connecting to:", DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Get users
    from sqlalchemy import text
    users = db.execute(text("SELECT id, username, email, role, specialization, assigned_area FROM users")).fetchall()
    print("\n--- USERS ---")
    for u in users:
        print(f"ID: {u.id} | Name: {u.username} | Email: {u.email} | Role: {u.role} | Spec: {u.specialization} | Area: {u.assigned_area}")
        
    crimes = db.execute(text("SELECT id, title, description, zone, status, assigned_officer_id FROM crimes")).fetchall()
    print("\n--- CRIMES ---")
    for c in crimes:
        print(f"ID: {c.id} | Title: {c.title} | Zone: {c.zone} | Status: {c.status} | Officer ID: {c.assigned_officer_id}")
finally:
    db.close()
