from fastapi import HTTPException , Depends, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.officer_model import Officer
# from app.schemas.officer_schema import OfficerCreate,OfficerResponse
from app.auth.oauth2 import get_current_user
from app.models.user_model import User
from app.auth.hashing import hash_password,verify_password
from app.auth.jwt_handler import create_access_token
from app.models.crime_model import Crime
from app.schemas.crime_schema import UpdateStatus

from app.database.connection import SessionLocal

router=APIRouter(
    prefix="/officers",
    tags=["Officers"]
)

# database  dependency
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

def officer_required(
        current_user:User=Depends(get_current_user)
):
    if current_user.role!="officer":
        raise HTTPException(status_code=400,detail="only officers are required")
    return current_user

# now officer can see all the crimes assigned to them:
@router.get("/crimes")
def get_crimes(current_user:User=Depends(officer_required),db:Session=Depends(get_db)):
    crimes=db.query(Crime).filter(Crime.assigned_officer_id==current_user.id).all()
    if not crimes:
         raise HTTPException(status_code=400,detail="only officers are required")
    return crimes

# fix the status of crime report by the officer

@router.patch("/crime/{crime_id}")
def update_status( crime_id:int,data:UpdateStatus,current_user:User=Depends(officer_required),db:Session=Depends(get_db),):
    crime=db.query(Crime).filter(Crime.id==crime_id).first()
    if not crime:
        raise HTTPException (status_code=400,detail="the crime ID does not exists")
    crime.status=data.status
    db.commit()
    db.refresh(crime)
    return crime
