from fastapi import APIRouter,Depends,HTTPException,UploadFile,File,Form
from sqlalchemy.orm import Session
from app.database.connection import get_db
import shutil
import os
from app.utils.logger import activity_logs
 
# importing auths:
from app.auth.encryption import encrypt_notes,decrypt_notes
from app.auth.oauth2 import get_current_user


# importing models:
from app.models.crime_model import Crime
from app.models.user_model import User
from app.models.evidence_model import Evidence

# importing schemas:
from app.schemas.crime_schema import CrimeResponse
from app.schemas.officer_schema import OfficerResponse
from app.schemas.evidence_schema import EvidenceResponse

router=APIRouter(
    prefix='/evidence',
    tags=["Evidences"]
)

@router.post("/uploads/{crime_id}")
def post_evidence(crime_id:int ,
                current_user:User=Depends(get_current_user),
                description:str=Form(...) ,
                file:UploadFile=File(...),
                db:Session=Depends(get_db)):
    
    # check current user is officer or not:
    if current_user.role!="officer":
        raise HTTPException(status_code=400,detail='only the officers are allowed to upload evidences')
    
    # check crime_id:
    crime=db.query(Crime).filter(Crime.id==crime_id).first()
    if not crime:
        raise HTTPException (status_code=400,detail="crime does not exists")
    

# create unique file path:
    file_path=f"uploads/{file.filename}"

    # save file:

    with open(file_path,"wb")as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # create evidence entry:
    new_evidence=Evidence(
        file_name=file.filename,
        file_path=file_path,
        description=description,
        crime_id=crime_id,
        uploaded_by=current_user.id
    )
    # save in database:
    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)

    # adding activity logs
    activity_logs(
        db=db,
        action="Evidence uploaded",
        crime_id=crime_id,
        user_id=current_user.id
    )

    return new_evidence

# get evidence by id:
@router.get("/evidence/{evidence_id}")
def getAllEvidence(evidence_id:int,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    
    if current_user.role!="officer":
        raise HTTPException(status_code=400,detail="only officers are allowed to get all the evidences")
    evidence=db.query(Evidence).filter(Evidence.id==evidence_id).first()
    if not evidence:
        raise HTTPException (status_code=400,deatil="id is not correct")
    return evidence




