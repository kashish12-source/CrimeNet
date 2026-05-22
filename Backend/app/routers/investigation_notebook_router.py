from fastapi import APIRouter,HTTPException ,Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database.base import Base,SessionLocal
from app.models.investigation_notebook_model import InvestigationBook
from app.schemas.investigation_notebook_schema import InvestigationBook,InvestigationResponse
from app.models.crime_model import Crime
from app.models.officer_model import Officer
from app.schemas.crime_schema import CrimeResponse
from app.models.user_model import User
from app.models.officer_model import Officer
from app.schemas.officer_schema import OfficerResponse
from app.auth.oauth2 import get_current_user
from app.auth.hashing import verify_password,hash_password
from app.database.base import get_db

router=APIRouter(
    prefix="/investigationbook",
    tags=["Investigation Note Book"]
)

# check that the logedin person is officer:
def officer_only(
        current_user:User=Depends(get_current_user)

):
    if current_user.role!="officer":
        raise HTTPException(status_code=400,detail="only officers are allowed")

    return current_user

# add the notes on book allowing by the is of the officer
@router.post(
    "/investigation/{officer_id}/{crime_id}",
    response_model=InvestigationResponse
)
def addInvestigation(
    officer_id: int,
    crime_id: int,
    notes: InvestigationBook,
    officer: User = Depends(officer_only),
    db: Session = Depends(get_db)
):

    # check officer exists
    current_officer = db.query(User).filter(
        User.id == officer_id,
        User.role == "officer"
    ).first()

    if not current_officer:
        raise HTTPException(
            status_code=404,
            detail="Officer not found"
        )

    # check crime exists
    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    # check assigned officer
    if crime.assigned_officer_id != officer_id:
        raise HTTPException(
            status_code=400,
            detail="Crime not assigned to this officer"
        )

    # create investigation note
    new_note = InvestigationBook(
        note=notes.note,
        crime_id=crime_id,
        officer_id=officer_id
    )

    # save
    db.add(new_note)

    db.commit()

    db.refresh(new_note)

    return new_note