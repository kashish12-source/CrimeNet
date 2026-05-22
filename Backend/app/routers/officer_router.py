from fastapi import HTTPException , Depends, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.officer_model import Officer
from app.schemas.officer_schema import OfficerCreate,OfficerResponse
from app.auth.oauth2 import get_current_user
from app.models.user_model import User
from app.auth.hashing import hash_password,verify_password
from app.auth.jwt_handler import create_access_token
from app.database.connection import SessionLocal

router=APIRouter(
    prefix=["/officers"],
    tags=["Officers"]
)

# database  dependency
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


