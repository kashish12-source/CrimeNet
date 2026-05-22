from fastapi import FastAPI
from app.database.base import Base,engine

# importing models:

from app.models.user_model import User
from app.models.crime_model import Crime

# importing Routes:
from app.routers.auth_router import router as auth_router

Base.metadata.create_all(bind=engine)
app=FastAPI()
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}