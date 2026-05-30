from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.notification_model import Notification
from app.models.user_model import User
from app.schemas.notification_schema import Notification as NotificationSchema

from app.auth.oauth2 import get_current_user

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# GET USER NOTIFICATIONS
@router.get("/", response_model=List[NotificationSchema])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return notifications


# MARK NOTIFICATION AS READ
@router.patch("/{notification_id}")
def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if not notification:
        return {
            "message": "Notification not found"
        }

    notification.is_read = True

    db.commit()

    return {
        "message": "Notification marked as read"
    }