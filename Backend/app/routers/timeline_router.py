from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.base import get_db

from app.models.crime_model import Crime
from app.models.investigation_notebook_model import InvestigationBook
from app.models.evidence_model import Evidence
from app.models.activitylogs_model import Activity_logs

router = APIRouter(
    prefix="/timeline",
    tags=["Crime-TimeLine"]
)


@router.get("/{crime_id}")
def get_crime_timeline(
    crime_id: int,
    db: Session = Depends(get_db)
):

    # Check if crime exists
    crime = db.query(Crime).filter(Crime.id == crime_id).first()

    if not crime:
        raise HTTPException(
            status_code=400,
            detail="Enter a valid crime ID"
        )

    timeline = []

    # Crime created event
    timeline.append({
        "event": f"Crime reported: {crime.title}",
        "timestamp": crime.created_at
    })

    # Investigation notes
    notes = db.query(InvestigationBook).filter(
        InvestigationBook.crime_id == crime_id
    ).all()

    for note in notes:
        timeline.append({
            "event": "Investigation note added",
            "timestamp": note.created_at
        })

    # Evidence events
    evidence_list = db.query(Evidence).filter(
        Evidence.crime_id == crime_id
    ).all()

    for evidence in evidence_list:
        timeline.append({
            "event": f"Evidence uploaded: {evidence.file_name}",
            "timestamp": evidence.uploaded_by
        })

    # Activity logs
    logs = db.query(Activity_logs).filter(
        Activity_logs.crime_id == crime_id
    ).all()

    for log in logs:
        timeline.append({
            "event": log.action,
            "timestamp": log.timestamp
        })

    # Sort timeline by timestamp
        # Remove empty timestamps
    timeline = [item for item in timeline if item["timestamp"] is not None]

    # Sort timeline
    timeline.sort(
        key=lambda x: str(x["timestamp"])
    )

    return timeline
