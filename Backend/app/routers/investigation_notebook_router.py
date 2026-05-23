from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db

# MODELS
from app.models.investigation_notebook_model import InvestigationBook
from app.models.crime_model import Crime
from app.models.user_model import User

# SCHEMAS
from app.schemas.investigation_notebook_schema import (
    InvestigationCreate,
    InvestigationResponse
)

# AUTH
from app.auth.oauth2 import get_current_user
from app.auth.encryption import encrypt_notes

router = APIRouter(
    prefix="/investigationbook",
    tags=["Investigation Note Book"]
)


# ==========================================
# OFFICER AUTHORIZATION CHECK
# ==========================================
def officer_only(
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "officer":
        raise HTTPException(
            status_code=403,
            detail="Only officers are allowed"
        )

    return current_user


# ==========================================
# ADD INVESTIGATION NOTE
# ==========================================
@router.post(
    "/investigation/{officer_id}/{crime_id}",
    response_model=InvestigationResponse
)
def add_investigation(
    officer_id: int,
    crime_id: int,
    notes: InvestigationCreate,
    officer: User = Depends(officer_only),
    db: Session = Depends(get_db)
):

    # CHECK OFFICER EXISTS
    current_officer = db.query(User).filter(
        User.id == officer_id,
        User.role == "officer"
    ).first()

    if not current_officer:
        raise HTTPException(
            status_code=404,
            detail="Officer not found"
        )

    # CHECK CRIME EXISTS
    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    # CHECK ASSIGNED OFFICER
    if crime.assigned_officer_id != officer_id:
        raise HTTPException(
            status_code=400,
            detail="Crime not assigned to this officer"
        )

    # CREATE NOTE
    new_note = InvestigationBook(
        note=encrypt_notes(notes.note),
        crime_id=crime_id,
        officer_id=officer_id
    )

    # SAVE
    db.add(new_note)

    db.commit()

    db.refresh(new_note)

    return new_note
from app.auth.encryption import decrypt_notes


# VIEW INVESTIGATION NOTE
@router.get("/investigation/{note_id}")
def get_all_the_investigation(
    note_id: int,
    db: Session = Depends(get_db)
):

    note = db.query(
        InvestigationBook
    ).filter(
        InvestigationBook.id == note_id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Enter valid note id"
        )

    return {

        "note_id": note.id,

        # DECRYPT HERE
        "note": decrypt_notes(note.note),

        "crime_id": note.crime_id,

        "officer_id": note.officer_id,

        "created_at": note.created_at
    }