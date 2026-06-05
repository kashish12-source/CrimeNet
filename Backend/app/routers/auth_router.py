from fastapi import APIRouter,Depends,HTTPException,status 
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.utils.logger import activity_logs

from app.database.connection import SessionLocal
from app.models.user_model import User
from app.schemas.user_schema import UserCreate,UserResponse
from app.auth.hashing import hash_password,verify_password
from app.auth.jwt_handler import create_access_token
from app.auth.oauth2 import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]

)

# database dependency
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register a new user
@router.post("/register")
def registerUser(
    user:UserCreate,
    db:Session=Depends(get_db)
):
    # check the existig user
    existing_user=db.query(User).filter(User.email==user.email).first()
    print(user.email)
    print(existing_user)
    if existing_user:
        raise HTTPException(status_code=400,detail="email already exists")
    # hash the password
    hashed_password=hash_password(user.password)

    # create a new user instance
    new_user=User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role,
        address=user.address,
        phone_number=user.phone_number,
       
    )
    print("REGISTER API HIT")
    db.add(new_user)
    
    print("BEFORE COMMIT")
    db.commit()
    print("AFTER COMMIT")
    db.refresh(new_user)
    print("USER ID:", new_user.id)
    activity_logs(
        db=db,
        action="user register successfully",
        user_id=new_user.id
        
    )
    return new_user

from app.schemas.user_schema import UserLogin
# login user:
@router.post("/login")
def loginUser(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    email = user.email
    password = user.password

    db_user = db.query(User).filter(User.email == email).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    if not verify_password(password, db_user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }
    }

@router.get("/me",response_model=UserResponse)
def read_users_me(current_user:User=Depends(get_current_user)):
    return current_user

from fastapi import UploadFile, File, Form
import shutil
import random

OTP_STORE = {}

@router.post("/citizen/verify-id")
def verify_citizen_id(
    id_proof_type: str = Form(...),
    id_proof_number: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "citizen":
        raise HTTPException(status_code=400, detail="Only citizens can verify their ID")
        
    if len(id_proof_number.strip()) < 5:
        raise HTTPException(status_code=400, detail="Invalid ID Proof Number length")
        
    file_path = f"uploads/id_{current_user.id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    current_user.is_verified = True
    current_user.id_proof_type = id_proof_type
    current_user.id_proof_number = id_proof_number
    current_user.id_proof_url = file_path
    
    db.commit()
    db.refresh(current_user)
    
    activity_logs(
        db=db,
        action=f"Citizen ID verified ({id_proof_type})",
        user_id=current_user.id
    )
    
    return {
        "message": "ID verified successfully with Government Portal",
        "user": {
            "id": current_user.id,
            "is_verified": current_user.is_verified,
            "id_proof_type": current_user.id_proof_type,
            "id_proof_number": current_user.id_proof_number,
            "id_proof_url": current_user.id_proof_url
        }
    }

@router.post("/citizen/send-otp")
def send_phone_otp(
    phone_number: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    otp_code = str(random.randint(100000, 999999))
    OTP_STORE[current_user.id] = otp_code
    
    print(f"\n==========================================")
    print(f"SMS GATEWAY: Sending OTP {otp_code} to {phone_number}")
    print(f"==========================================\n")
    
    return {
        "message": "OTP sent successfully to your phone number",
        "otp_code": otp_code
    }

@router.post("/citizen/verify-otp")
def verify_phone_otp(
    otp_code: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stored_code = OTP_STORE.get(current_user.id)
    if not stored_code or stored_code != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code or OTP expired")
        
    current_user.phone_verified = True
    db.commit()
    db.refresh(current_user)
    
    OTP_STORE.pop(current_user.id, None)
    
    activity_logs(
        db=db,
        action="Citizen phone verified via OTP",
        user_id=current_user.id
    )
    
    return {
        "message": "Phone number verified successfully",
        "phone_verified": current_user.phone_verified
    }

      





