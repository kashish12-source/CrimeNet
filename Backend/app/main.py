from fastapi import FastAPI
from app.database.base import Base,engine
from fastapi.staticfiles import StaticFiles

# importing models:

from app.models.user_model import User
from app.models.crime_model import Crime
from app.models.investigation_notebook_model import InvestigationBook
from app.models.evidence_model import Evidence
from app.models.activitylogs_model import Activity_logs


# importing Routes:
from app.routers.auth_router import router as auth_router
from app.routers.admin_router import router as admin_router
from app.routers.crime_router import router as crime_router
from app.routers.officer_router import router as officer_router
from app.routers.investigation_notebook_router import router as investiate_router
from app.routers.evidence_router import router as evidence_router
from app.routers.dashboard_router import router as dashboard_router

Base.metadata.create_all(bind=engine)
app=FastAPI()
app.mount("/uploads",StaticFiles(directory="uploads"),name="uploads")

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(crime_router)
app.include_router(officer_router)
app.include_router(investiate_router)
app.include_router(evidence_router)
app.include_router(dashboard_router)
