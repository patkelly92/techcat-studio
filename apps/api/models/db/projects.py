from __future__ import annotations
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID, uuid4

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.orm import Mapped, mapped_column, relationship

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

    user: Mapped[Optional["User"]] = Relationship(
        sa_relationship=relationship("User", back_populates="projects")
    )
    documents: Mapped[list["Document"]] = Relationship(
        sa_relationship=relationship("Document", back_populates="project")
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Project(id={self.id}, slug={self.slug})"
