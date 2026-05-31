from os import link

from sqlalchemy.orm import Session
from app.models.notification_model import Notification

def create_notification(
        db:Session,
        user_id:int,message:str,link=None
):
    notification=Notification(
        user_id=user_id,
        message=message,
        link=link
    )
    db.add(notification)
    db.commit()

    return notification
