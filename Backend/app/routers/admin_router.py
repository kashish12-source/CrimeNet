from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.auth.oauth2 import get_current_user
from app.models.user_model import User
from app.models.crime_model import Crime

from app.schemas.user_schema import UserCreate
from app.schemas.crime_schema import AssignOfficer

from app.auth.hashing import hash_password

from app.utils.logger import activity_logs

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# DATABASE
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ADMIN CHECK
def admin_required(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )

    return current_user


# CREATE OFFICER
@router.post("/officers")
def create_officer(
    officer: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    existing_user = db.query(User).filter(
        User.email == officer.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = hash_password(
        officer.password
    )

    new_officer = User(
        username=officer.username,
        email=officer.email,
        password=hashed_password,
        role="officer",
        address=officer.address,
        phone_number=officer.phone_number
    )

    db.add(new_officer)

    db.commit()

    db.refresh(new_officer)

    return new_officer


# GET ALL OFFICERS
@router.get("/officers")
def get_all_officers(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    officers = db.query(User).filter(
        User.role == "officer"
    ).all()

    return officers


# GET ALL CRIMES
@router.get("/crimes")
def get_all_crimes(
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    crimes = db.query(Crime).all()

    return crimes


# ASSIGN OFFICER
@router.post("/assign-officer/{crime_id}")
def assign_officer(
    crime_id: int,
    data: AssignOfficer,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):

    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    officer = db.query(User).filter(
        User.id == data.officer_id,
        User.role == "officer"
    ).first()

    if not officer:
        raise HTTPException(
            status_code=404,
            detail="Officer not found"
        )

    crime.assigned_officer_id = officer.id

    crime.status = "Assigned"

    activity_logs(
        db=db,
        action="Officer assigned to crime",
        user_id=admin.id,
        crime_id=crime.id
    )

    db.commit()

    db.refresh(crime)

    return {
        "message": "Officer assigned successfully"
    }