from fastapi import HTTPException,status,Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.models.user_model import User
from app.auth.jwt_handler import SECRET_KEY,ALGORITHM

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")

# Database dependency

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

# verify token and get current user
def get_current_user(
        token:str=Depends(oauth2_scheme),
        db:Session=Depends(get_db)
):
    credentials_exception= HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate":"Bearer"}

    )
    try:
        # decode the jwt token
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        email   =payload.get("sub")

        if email is None:
            raise credentials_exception
    
        
    except JWTError:
        raise credentials_exception

    
    
    # fetching user from the database
    user=db.query(User).filter(User.email==email).first()
    if user is None:
        raise credentials_exception
    return user
