from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, field_validator

from apps.api.constants import STATIC_USER_ID


class FeedbackCreate(BaseModel):
    type: str
    message: str
    user_id: Optional[UUID] = STATIC_USER_ID
    project_id: Optional[UUID] = None

    @field_validator("message")
    @classmethod
    def message_length(cls, v: str) -> str:
        if len(v.strip()) > 1000:
            raise ValueError("Message must be 1000 characters or less")
        return v


class FeedbackRead(BaseModel):
    id: UUID
    type: str
    message: str
    created_at: datetime
    user_id: Optional[UUID] = None
    project_id: Optional[UUID] = None

    class Config:
        from_attributes = True
