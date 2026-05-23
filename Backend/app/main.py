from fastapi import FastAPI
from app.database.base import Base,engine

# importing models:

from app.models.user_model import User
from app.models.crime_model import Crime
from app.models.investigation_notebook_model import InvestigationBook


# importing Routes:
from app.routers.auth_router import router as auth_router
from app.routers.admin_router import router as admin_router
from app.routers.crime_router import router as crime_router
from app.routers.officer_router import router as officer_router
from app.routers.investigation_notebook_router import router as investiate_router

Base.metadata.create_all(bind=engine)
app=FastAPI()
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(crime_router)
app.include_router(officer_router)
app.include_router(investiate_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}