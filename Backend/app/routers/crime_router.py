from fastapi import HTTPException , Depends, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional 
from app.utils.logger import activity_logs

from app.database.connection import SessionLocal
from app.models.crime_model import Crime
from app.schemas.crime_schema import CrimeCreate,CrimeResponse
from app.models.user_model import User

from app.auth.oauth2 import get_current_user

router=APIRouter(
    prefix="/crime",
    tags=['Crime']
)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

# create crime route
@router.post("/crime")
def create_crime(crime : CrimeCreate, db:Session=Depends(get_db), current_user:User=Depends(get_current_user)):
        # only citizens  can report :
        if current_user.role!="citizen":
             raise HTTPException(status_code=400,detail="only citizens are allow to report crime")
        new_crime=Crime(
             title=crime.title,
             description=crime.description,
             location=crime.location,
             reported_by=current_user.id
        )
        db.add(new_crime)
        db.commit()
        db.refresh(new_crime)
        activity_logs(
             db=db,
             action="Crime is posted succesfully",
             crime_id=new_crime.id,
             user_id=current_user.id
        )
        return new_crime

@router.get("/all")
def get_all_crime(
     status:Optional[str]=None,
     location:Optional[str]=None,
     officer_id:Optional[str]=None,
     page:int=1,
     limit:int=5,
     sort:str="latest",
     db:Session=Depends(get_db),
     current_user:User=Depends(get_current_user)
):
    query=db.query(Crime)
    if status:
       query=query.filter(Crime.status==status)
    if location:
        query=query.filter(
            Crime.location.ilike(f"%{location}%")
        )
    if officer_id:
        query=query.filter(Crime.assigned_officer_id==officer_id)
    if sort=="latest":
        query=query.order_by(
            Crime.id.desc()
        )
    elif sort == "oldest":
        query=query.order_by(
            Crime.id.asc()

        )

# this is for PAGINATION:

    skip=(page-1)*limit
    crimes=query.offset(skip).limit(limit).all()
    return{
        "pages":page,
        "limit":limit,
        "total_records":query.count(),
        "data":crimes

    }


