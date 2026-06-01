from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import Optional

from app.utils.notifications import create_notification
from app.utils.logger import activity_logs

from app.database.connection import SessionLocal

from app.models.crime_model import Crime
from app.models.user_model import User
from app.models.notification_model import Notification

from app.schemas.crime_schema import (
CrimeCreate,
UpdateStatus
)

from app.auth.oauth2 import get_current_user
from app.auth.encryption import decrypt_notes

router = APIRouter(
prefix="/crime",
tags=["Crime"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================

# CREATE CRIME

# =========================================
@router.post("/crime")
def create_crime(
    crime: CrimeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "citizen":
        raise HTTPException(
            status_code=400,
            detail="Only citizens can report crime"
        )

    # Validate input
    if not crime.title or not crime.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Title cannot be empty"
        )

    if not crime.description or not crime.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Description cannot be empty"
        )

    if not crime.location or not crime.location.strip():
        raise HTTPException(
            status_code=400,
            detail="Location cannot be empty"
        )

    # Create crime
    new_crime = Crime(
        title=crime.title.strip(),
        description=crime.description.strip(),
        location=crime.location.strip(),
        reported_by=current_user.id
    )

    db.add(new_crime)

    # Generate ID without committing
    db.flush()

    # Create activity log
    activity_logs(
        db=db,
        action="Crime posted successfully",
        crime_id=new_crime.id,
        user_id=current_user.id
    )

    # Send notifications to all officers
    officers = db.query(User).filter(
        User.role == "officer"
    ).all()
    admins = db.query(User).filter(
    User.role == "admin"
    ).all()

    for admin in admins:
        create_notification(
            db=db,
            user_id=admin.id,
            message=f"New crime reported: {new_crime.title}",
            link=f"/crime/{new_crime.id}"
        )
    for officer in officers:
        notification = Notification(
            message=f"New crime reported: {new_crime.title}",
            user_id=officer.id
        )

        db.add(notification)

    # Save everything together
    db.commit()

    db.refresh(new_crime)

    return new_crime
@router.put("/assign/{crime_id}")
def assign_officer(
    crime_id: int,
    officer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ONLY ADMIN CAN ASSIGN
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can assign officers"
        )

    # FIND CRIME
    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    # FIND OFFICER
    officer = db.query(User).filter(
        User.id == officer_id,
        User.role == "officer"
    ).first()

    if not officer:
        raise HTTPException(
            status_code=404,
            detail="Officer not found"
        )

    # ASSIGN OFFICER
    crime.assigned_officer_id = officer.id
    create_notification(
    db=db,
    user_id=crime.reported_by,
    message=f"Officer {officer.username} has been assigned to your case",
    link=f"/officer/{officer.id}"
)
    db.commit()

    db.refresh(crime)

    # SEND NOTIFICATION
    notification = Notification(
        message=f"You have been assigned to crime: {crime.title}",
        user_id=officer.id
    )

    db.add(notification)

    db.commit()

    # ACTIVITY LOG
    activity_logs(
        db=db,
        action="Officer assigned to crime",
        crime_id=crime.id,
        user_id=current_user.id
    )

    return {
        "message": "Officer assigned successfully",
        "crime": crime
    }

@router.get("/all")
def get_all_crime(
    status: Optional[str] = None,
    location: Optional[str] = None,
    officer_id: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):


    query = db.query(Crime)

    # citizen
    if current_user.role == "citizen":

        query = query.filter(
            Crime.reported_by == current_user.id
        )

    # officer
    elif current_user.role == "officer":

        query = query.filter(
            Crime.assigned_officer_id == current_user.id
        )

    skip = (page - 1) * limit

    crimes = query.offset(skip).limit(limit).all()

    return {
        "page": page,
        "limit": limit,
        "total_records": query.count(),
        "data": crimes
    }


@router.put("/update-status/{crime_id}")
def update_crime_status(
crime_id: int,
data: UpdateStatus,
db: Session = Depends(get_db),
current_user: User = Depends(get_current_user)
):


    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    if crime.assigned_officer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned"
        )

    crime.status = data.status
    create_notification(
    db=db,
    user_id=crime.reported_by,
    message=f"Your crime status has been updated to {data.status}",
    link=f"/crime/{crime.id}"
)
    admins = db.query(User).filter(
    User.role == "admin"
).all()

    for admin in admins:
        create_notification(
            db=db,
            user_id=admin.id,
            message=f"Crime '{crime.title}' status updated to {data.status}",
            link=f"/crime/{crime.id}"
        )

    db.commit()

    db.refresh(crime)

    activity_logs(
        db=db,
        action=f"Crime status updated to {data.status}",
        crime_id=crime.id,
        user_id=current_user.id
    )

    return {
        "message": "Status updated",
        "crime": crime
    }



@router.put("/close/{crime_id}")
def close_case(
crime_id: int,
db: Session = Depends(get_db),
current_user: User = Depends(get_current_user)
):


    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    if crime.assigned_officer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not assigned officer"
        )

    crime.status = "Closed"

    db.commit()

    activity_logs(
        db=db,
        action="Crime case closed",
        crime_id=crime.id,
        user_id=current_user.id
    )

    return {
        "message": "Case closed successfully"
    }


@router.get("/{crime_id}")
def get_crime_by_id(
crime_id: int,
db: Session = Depends(get_db)
):


    crime = db.query(Crime).filter(
        Crime.id == crime_id
    ).first()

    if not crime:
        raise HTTPException(
            status_code=404,
            detail="Crime not found"
        )

    return {

        "id": crime.id,

        "title": crime.title,

        "description": crime.description,

        "location": crime.location,

        "status": crime.status,

        "created_at": crime.created_at,

        "investigations": [

            {
                "id": note.id,

                "note": decrypt_notes(note.note),

                "created_at": note.created_at,

                "officer_id": note.officer_id
            }

            for note in crime.investigations
        ],

        "evidence": [

            {
                "id": evidence.id,

                "file_name": evidence.file_name,

                "file_path": evidence.file_path,

                "description": evidence.description
            }

            for evidence in crime.evidence
        ]
    }

