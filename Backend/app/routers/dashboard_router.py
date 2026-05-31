from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from sqlalchemy import func
from app.models.investigation_notebook_model import InvestigationBook
from app.models.activitylogs_model import Activity_logs
# importing modesl
from app.models.crime_model import Crime
from app.models.user_model import User

# importing fromauth
from app.auth.oauth2 import get_current_user

router=APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

def admin_only(current_user:User=Depends(get_current_user)):
    if current_user.role!="admin":
        raise HTTPException(
            status_code=400,
            detail="only admins are allowed"
        )
    return current_user

@router.get("/total-crimes")
def get_total_crimes(
    db:Session=Depends(get_db),
    current_user:User=Depends(admin_only)
):
    total=db.query(Crime).all()
    return{
        "total crimes":total
                }
@router.get("/solved_crimes")
def get_solved_crimes(db:Session=Depends(get_db),current_user:User=Depends(admin_only)):
    solved=db.query(Crime).filter(Crime.status=="Solved").count()
    return{
        "solved crimes are ": solved

    }

# getting pending crimes:
@router.get("/pending_crimes")
def get_pending_crimes(db:Session=Depends(get_db),current_user:User=Depends(admin_only)):
    pending=db.query(Crime).filter(Crime.status=="Pending").count()
    return {
        "pending crimes are ": pending
    }

# get total officers:
@router.get("/total_officers")
def get_total_officer(db:Session=Depends(get_db),current_user:User=Depends(admin_only)):
    total=db.query(User).filter(User.role=="officer").count()
    return {
        "total officers are ": total
    }

# total citizens:
@router.get("/total_citizens")
def total_citizens(db:Session=Depends(get_db),current_user:User=Depends(admin_only)):
    total=db.query(User).filter(User.role=="citizen").count()
    return{
        "total citizens are ": total
    }

# crimes by status:
@router.get("/crimes")
def crime_by_status(current_user:User=Depends(admin_only),db:Session=Depends(get_db)):
    crime_by_status=db.query(Crime.status,func.count(Crime.id)).group_by(Crime.status).all()
    data={}
    for status ,count in crime_by_status:
        data[status]=count
    return data
@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ADMIN
    if current_user.role == "admin":

        total_crimes = db.query(Crime).count()

        solved_cases = db.query(Crime).filter(
            Crime.status == "Solved"
        ).count()

        pending_cases = db.query(Crime).filter(
            Crime.status == "Pending"
        ).count()

        officers = db.query(User).filter(
            User.role == "officer"
        ).count()

    # OFFICER
    elif current_user.role == "officer":

        total_crimes = db.query(Crime).filter(
            Crime.assigned_officer_id == current_user.id
        ).count()

        solved_cases = db.query(Crime).filter(
            Crime.assigned_officer_id == current_user.id,
            Crime.status == "Solved"
        ).count()

        pending_cases = db.query(Crime).filter(
            Crime.assigned_officer_id == current_user.id,
            Crime.status == "Pending"
        ).count()

        officers = 1

    # CITIZEN
    else:

        total_crimes = db.query(Crime).filter(
            Crime.reported_by == current_user.id
        ).count()

        solved_cases = db.query(Crime).filter(
            Crime.reported_by == current_user.id,
            Crime.status == "Solved"
        ).count()

        pending_cases = db.query(Crime).filter(
            Crime.reported_by == current_user.id,
            Crime.status == "Pending"
        ).count()

        officers = 0

    return {
        "total_crimes": total_crimes,
        "solved_cases": solved_cases,
        "pending_cases": pending_cases,
        "officers": officers
    }
@router.get("/status-chart")
def status_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = db.query(
        Crime.status,
        func.count(Crime.id)
    ).group_by(Crime.status).all()

    return [
        {
            "name": status,
            "value": count
        }
        for status, count in data
    ]
@router.get("/officer-workload")
def officer_workload(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    officers = db.query(User).filter(
        User.role == "officer"
    ).all()

    result = []

    for officer in officers:

        total = db.query(Crime).filter(
            Crime.assigned_officer_id == officer.id
        ).count()

        result.append({
            "officer": officer.username,
            "cases": total
        })

    return result
from app.models.investigation_notebook_model import InvestigationBook

@router.get("/investigation-progress")
def investigation_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crimes = db.query(Crime).all()

    result = []

    for crime in crimes:

        notes = db.query(
            InvestigationBook
        ).filter(
            InvestigationBook.crime_id == crime.id
        ).count()

        result.append({
    "name": crime.title,
    "count": notes
})

    return result
@router.get("/location-chart")
def location_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = db.query(
        Crime.location,
        func.count(Crime.id)
    ).group_by(
        Crime.location
    ).all()

    return [
        {
            "location": location,
            "count": count
        }
        for location, count in data
    ]
@router.get("/chart-data")
def get_chart_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    solved = db.query(Crime).filter(
        Crime.status == "Solved"
    ).count()

    pending = db.query(Crime).filter(
        Crime.status == "Pending"
    ).count()

    investigating = db.query(Crime).filter(
        Crime.status == "Investigating"
    ).count()

    total_notes = db.query(
        InvestigationBook
    ).count()

    total_logs = db.query(
        Activity_logs
    ).count()

    return {
        "crime_status": [
            {
                "name":"Solved",
                "value": solved
            },
            {
                "name":"Pending",
                "value": pending
            },
            {
                "name":"Investigating",
                "value": investigating
            }
        ],

        "investigation_progress":[
            {
                "name":"Investigation Notes",
                "count": total_notes
            },
            {
                "name":"Activity Logs",
                "count": total_logs
            }
        ]
    }
@router.get("/recent-crimes")
def recent_crimes(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    if current_user.role == "citizen":

        crimes = (
            db.query(Crime)
            .filter(
                Crime.reported_by == current_user.id
            )
            .order_by(Crime.created_at.desc())
            .limit(5)
            .all()
        )
    elif current_user.role == "officer":

        crimes = (
            db.query(Crime)
            .filter(
                Crime.assigned_officer_id ==
                current_user.id
            )
            .order_by(Crime.created_at.desc())
            .limit(5)
            .all()
        )
    else:

        crimes = (
            db.query(Crime)
            .order_by(Crime.created_at.desc())
            .limit(5)
            .all()
        )
    return [
        {
            "id": crime.id,
            "title": crime.title,
            "location": crime.location,
            "status": crime.status,
            "created_at": str(crime.created_at)
        }
        for crime in crimes
    ]
@router.get("/recent-logs")
def recent_logs(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    logs=db.query(Activity_logs).order_by(Activity_logs.timestamp.desc()).limit(5).all()
    if not logs:
        raise HTTPException(
            status_code=404,
            detail="No activity logs found"
        )
    return [
        {
            "id": log.id,
            "action": log.action,
            "timestamp": str(log.timestamp),
            "crime_id": log.crime_id,
            "performed_by": log.performed_by
        }
        for log in logs
    ]