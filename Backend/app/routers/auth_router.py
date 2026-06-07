from fastapi import APIRouter,Depends,HTTPException,status 
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.utils.logger import activity_logs

from app.database.connection import SessionLocal, get_db
from app.models.user_model import User
from app.schemas.user_schema import UserCreate,UserResponse
from app.auth.hashing import hash_password,verify_password
from app.auth.jwt_handler import create_access_token
from app.auth.oauth2 import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]

)

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
            "role": db_user.role,
            "specialization": db_user.specialization,
            "assigned_area": db_user.assigned_area
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
    import time
    
    # Generate a random 6-digit number for the OTP
    otp_code = str(random.randint(100000, 999999))
    
    # Store the OTP and the exact time it was created
    # time.time() gives the current time in seconds. We add 600 seconds (10 minutes) for expiry.
    OTP_STORE[current_user.id] = {
        "code": otp_code,
        "expires_at": time.time() + 600
    }
    
    # Simulate sending the OTP via SMS (useful for testing)
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
    import time
    
    # Get the OTP data saved for this user
    otp_data = OTP_STORE.get(current_user.id)
    
    # Check if the user ever requested an OTP
    if not otp_data:
        raise HTTPException(status_code=400, detail="No active OTP request found. Please request a new OTP.")
        
    # Check if the 10-minute time limit has passed
    if time.time() > otp_data["expires_at"]:
        OTP_STORE.pop(current_user.id, None) # Remove the expired OTP
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one (valid for 10 minutes).")
        
    # Finally, check if the entered code matches the stored code
    if otp_data["code"] != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please try again.")
        
    # If everything is correct, verify the user's phone
    current_user.phone_verified = True
    db.commit()
    db.refresh(current_user)
    
    # Remove the OTP from storage since it has been used
    OTP_STORE.pop(current_user.id, None)
    
    # Log this successful action
    activity_logs(
        db=db,
        action="Citizen phone verified via OTP",
        user_id=current_user.id
    )
    
    return {
        "message": "Phone number verified successfully",
        "phone_verified": current_user.phone_verified
    }

import urllib.request
import urllib.parse
import json

@router.get("/address-suggestions")
def get_address_suggestions(q: str):
    if not q or len(q.strip()) < 3:
        return []
    try:
        url = f"https://nominatim.openstreetmap.org/search?format=json&q={urllib.parse.quote(q)}&countrycodes=in&viewbox=74.0,26.9,82.8,21.0&bounded=1&limit=8"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "CrimeNet-MP-App-Backend",
                "Accept-Language": "en-US,en;q=0.9"
            }
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
            
        if not data:
            url_fallback = f"https://nominatim.openstreetmap.org/search?format=json&q={urllib.parse.quote(q)}&countrycodes=in&viewbox=74.0,26.9,82.8,21.0&bounded=0&limit=8"
            req_fallback = urllib.request.Request(
                url_fallback,
                headers={
                    "User-Agent": "CrimeNet-MP-App-Backend",
                    "Accept-Language": "en-US,en;q=0.9"
                }
            )
            with urllib.request.urlopen(req_fallback, timeout=5) as response:
                data = json.loads(response.read().decode("utf-8"))
        return data
    except Exception as e:
        print("Error fetching from Nominatim:", e)
        return []


      





