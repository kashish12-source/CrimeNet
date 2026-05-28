from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.base import Base,SessionLocal
from app.database.connection import get_db
from sqlalchemy import func

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
    solved=db.query(Crime).filter(Crime.status=="solved").count()
    return{
        "solved crimes are ": solved

    }

# getting pending crimes:
@router.get("/pending_crimes")
def get_pending_crimes(db:Session=Depends(get_db),current_user:User=Depends(admin_only)):
    pending=db.query(Crime).filter(Crime.status=="pending").count()
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