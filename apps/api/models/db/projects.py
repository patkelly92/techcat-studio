from __future__ import annotations
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID, uuid4

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from sqlmodel import SQLModel, Field, Relationship

class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    name: str
    slug: str = Field(index=True, unique=True)
    extra_metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        sa_column=Column(JSONB)
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="projects")
    documents: list["Document"] = Relationship(back_populates="project")

    def __repr__(self) -> str:  # pragma: no cover
        return f"Project(id={self.id}, slug={self.slug})"
