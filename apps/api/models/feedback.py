from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field
import sqlalchemy as sa


class Feedback(SQLModel, table=True):
    __tablename__ = "feedback"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(default=None, foreign_key="users.id")
    project_id: Optional[UUID] = Field(default=None, foreign_key="projects.id")
    type: str
    message: str = Field(sa_column=sa.Column(sa.String(length=1000)))
    created_at: datetime = Field(default_factory=datetime.utcnow)
