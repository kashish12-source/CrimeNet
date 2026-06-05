from fastapi import HTTPException, Depends, APIRouter, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional
import json
import shutil

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
from app.utils.blockchain import add_block_to_ledger
from app.services.ai_service import analyze_uploaded_media

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
ADJACENT_ZONES = {
    "Central Zone (Bhopal)": ["Central Zone (Bhopal)", "North Zone (Gwalior)", "South Zone (Narmadapuram)", "East Zone (Jabalpur)", "West Zone (Indore)"],
    "North Zone (Gwalior)": ["North Zone (Gwalior)", "Central Zone (Bhopal)", "East Zone (Jabalpur)", "West Zone (Indore)"],
    "South Zone (Narmadapuram)": ["South Zone (Narmadapuram)", "Central Zone (Bhopal)", "East Zone (Jabalpur)", "West Zone (Indore)"],
    "East Zone (Jabalpur)": ["East Zone (Jabalpur)", "Central Zone (Bhopal)", "North Zone (Gwalior)", "South Zone (Narmadapuram)"],
    "West Zone (Indore)": ["West Zone (Indore)", "Central Zone (Bhopal)", "North Zone (Gwalior)", "South Zone (Narmadapuram)"]
}

@router.post("/crime")
def create_crime(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    zone: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "citizen":
        raise HTTPException(
            status_code=400,
            detail="Only citizens can report crime"
        )

    # Validate input
    if not title or not title.strip():
        raise HTTPException(
            status_code=400,
            detail="Title cannot be empty"
        )

    if not description or not description.strip():
        raise HTTPException(
            status_code=400,
            detail="Description cannot be empty"
        )

    if not location or not location.strip():
        raise HTTPException(
            status_code=400,
            detail="Location cannot be empty"
        )

    # Process media file & run AI analysis
    ai_result_str = None
    if file:
        file_path = f"uploads/report_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Call AI Analysis service
        ai_res = analyze_uploaded_media(file_path, file.filename, description)
        ai_result_str = json.dumps(ai_res)

    # Create crime
    new_crime = Crime(
        title=title.strip(),
        description=description.strip(),
        location=location.strip(),
        latitude=latitude,
        longitude=longitude,
        zone=zone,
        ai_analysis=ai_result_str,
        reported_by=current_user.id
    )

    db.add(new_crime)
    db.flush()

    # Create activity log
    activity_logs(
        db=db,
        action="Crime posted successfully",
        crime_id=new_crime.id,
        user_id=current_user.id
    )

    # BLOCKCHAIN LOGGING
    blockchain_payload = {
        "crime_id": new_crime.id,
        "title": new_crime.title,
        "description": new_crime.description,
        "location": new_crime.location,
        "latitude": new_crime.latitude,
        "longitude": new_crime.longitude,
        "zone": new_crime.zone,
        "reported_by": current_user.username,
        "ai_scan": ai_result_str
    }
    add_block_to_ledger(db, "CRIME_REPORTED", blockchain_payload)

    # Send notifications based on proximity zone
    admins = db.query(User).filter(User.role == "admin").all()
    for admin in admins:
        create_notification(
            db=db,
            user_id=admin.id,
            message=f"New crime reported: {new_crime.title} in {new_crime.zone or 'unknown zone'}",
            link=f"/crime/{new_crime.id}"
        )

    # Find officers in same or adjacent zone
    officer_query = db.query(User).filter(User.role == "officer")
    if zone and zone in ADJACENT_ZONES:
        allowed_areas = ADJACENT_ZONES[zone]
        officers = officer_query.filter(User.assigned_area.in_(allowed_areas)).all()
    else:
        officers = officer_query.all()

    for officer in officers:
        notification = Notification(
            message=f"ALERT: New crime reported in/near your area: {new_crime.title} ({new_crime.zone or 'General'})",
            user_id=officer.id,
            link=f"/crime/{new_crime.id}"
        )
        db.add(notification)

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

    # BLOCKCHAIN LOGGING
    add_block_to_ledger(db, "OFFICER_ASSIGNED", {
        "crime_id": crime.id,
        "crime_title": crime.title,
        "officer_id": officer.id,
        "officer_username": officer.username
    })

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

    # BLOCKCHAIN LOGGING
    add_block_to_ledger(db, "STATUS_UPDATED", {
        "crime_id": crime.id,
        "crime_title": crime.title,
        "status": data.status,
        "updated_by": current_user.username
    })

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

    # BLOCKCHAIN LOGGING
    add_block_to_ledger(db, "CASE_CLOSED", {
        "crime_id": crime.id,
        "crime_title": crime.title,
        "closed_by": current_user.username
    })

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

        "latitude": crime.latitude,

        "longitude": crime.longitude,

        "zone": crime.zone,

        "ai_analysis": crime.ai_analysis,

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

                "description": evidence.description,

                "latitude": evidence.latitude,

                "longitude": evidence.longitude
            }

            for evidence in crime.evidence
        ]
    }

