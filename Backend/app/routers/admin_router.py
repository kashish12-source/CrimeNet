from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.auth.oauth2 import get_current_user
from app.models.user_model import User
from app.database.connection import SessionLocal
from app.schemas.user_schema import  UserCreate,UserResponse
from app.auth.hashing import hash_password,verify_password
from app.schemas.crime_schema import CrimeResponse,CrimeCreate,AssignOfficer
from app.models.crime_model import Crime
from app.utils.logger import activity_logs

router=APIRouter(
    prefix="/admin",
    tags=['Admin']

)

# database dependency
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

# check authorization of admin user
def admin_required(
        current_user:User=Depends(get_current_user)
):
    if current_user.role!="admin":
        raise HTTPException(status_code=403,detail="Admin privileges required")
    return current_user

# now admin is able to create a new officer user
@router.post("/officers")
def create_officer(
    officer:UserCreate,
    db:Session=Depends(get_db),
    admin:User=Depends(admin_required)
):
    # check if the email already exists
    existing_user=db.query(User).filter(User.email==officer.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail="email already exists")
    # hash the password
    hashed_password=hash_password(officer.password)

    # create a new officer user
    new_officer=User(
        username=officer.username,
        email=officer.email,
        password=hashed_password,
        role=officer.role,
        address=officer.address,
        phone_number=officer.phone_number

    )
    db.add(new_officer)
    db.commit()
    db.refresh(new_officer)
    activity_logs(
        db=db,
        action="user register successfully",
        user_id=new_officer.id
        
    )
    return new_officer

# admin can see every officer user 
@router.get("/officers")
def get_all_officers(
    db:Session=Depends(get_db),
    admin:User=Depends(admin_required)
):
    officers=db.query(User).filter(User.role=="officer").all()
    if not officers:
        raise HTTPException(status_code=404,detail="no officers found")

    return officers

# now admin can get all the crimes 
@router.get("/crimes")
def get_all_crimes(admin:User=Depends(admin_required),db:Session=Depends(get_db)):
    crimes=db.query(Crime).all()
    if not crimes:
        raise HTTPException (status_code=400,detail="no crime has been registered")
    return crimes

@router.post("/assign_officer/{crime_id}")
def assigne_officer(
    crime_id:int,
    data:AssignOfficer,
    admin:User=Depends(admin_required),
    db:Session=Depends(get_db)
):
    crime=db.query(Crime).filter(Crime.id==crime_id).first()
    if not crime:
        raise HTTPException (status_code=400, detail="enter a valid crime id")
    officer=db.query(User).filter(
        User.id==data.officer_id,
        User.role=="officer"
    ).first()
    if not officer :
         raise HTTPException (status_code=400,detail="no crime has been registered")    
    crime.assigned_officer_id= officer.id

    crime.status="assigned"
    db.commit()
    db.refresh(crime)
    activity_logs(
        db=db,
        action="user register successfully",
        user_id=officer.id,
        crime_id=crime_id
    )
    return {
        "assignment of officer is successfull"
    }