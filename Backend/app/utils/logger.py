from sqlalchemy.orm import Session
from app.models.activitylogs_model import Activity_logs

def activity_logs(
    db:Session,
    action:str,
    crime_id:int=None,
    user_id:int=None
):
    log=Activity_logs(
        action=action,
        crime_id=crime_id,
        performed_by=user_id
    )
    db.add(log)
    db.commit()