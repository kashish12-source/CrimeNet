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
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    activity_logs(
        db=db,
        action="user register successfully",
        user_id=new_user.id
        
    )
    return new_user


# login user:
@router.post("/login")
def loginUser(
    user_data: dict,
    db:Session=Depends(get_db)
):
    email = user_data.get("email")
    password = user_data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    user=db.query(User).filter(User.email==email).first()
    if not user:
        raise HTTPException(status_code=400,detail="invalid credentials")
    if not verify_password(password, user.password):
        raise HTTPException(status_code=400,detail="invalid credentials")   
    access_token=create_access_token(data={"sub":user.email})
    return{"access_token":access_token,"token_type":"bearer","token":access_token}

@router.get("/me",response_model=UserResponse)
def read_users_me(current_user:User=Depends(get_current_user)):
    return current_user

      





