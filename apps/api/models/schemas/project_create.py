from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from apps.api.constants import STATIC_USER_ID


class ProjectCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    user_id: Optional[UUID] = STATIC_USER_ID


class ProjectRead(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
