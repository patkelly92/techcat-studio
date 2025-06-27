import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from apps.api.db.database import get_session
from apps.api.models.feedback import Feedback
from apps.api.models.schemas import FeedbackCreate, FeedbackRead
from apps.api.constants import STATIC_USER_ID

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/feedback", response_model=FeedbackRead)
def create_feedback(
    payload: FeedbackCreate, session: Session = Depends(get_session)
):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")
    if len(payload.message.strip()) > 1000:
        raise HTTPException(status_code=400, detail="Message exceeds 1000 characters")
    fb = Feedback(
        user_id=payload.user_id or STATIC_USER_ID,
        project_id=payload.project_id,
        type=payload.type,
        message=payload.message.strip(),
    )
    session.add(fb)
    session.commit()
    session.refresh(fb)
    logger.info("Created feedback %s", fb.id)
    return FeedbackRead.model_validate(fb)


@router.get("/feedback", response_model=list[FeedbackRead])
def list_feedback(session: Session = Depends(get_session)):
    feedback = session.exec(select(Feedback)).all()
    return [FeedbackRead.model_validate(fb) for fb in feedback]
