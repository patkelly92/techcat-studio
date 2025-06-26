from __future__ import annotations
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field, Relationship

class Document(SQLModel, table=True):
    __tablename__ = "documents"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    project_id: UUID = Field(foreign_key="projects.id")
    type: str
    latest_version_id: Optional[UUID] = Field(default=None, foreign_key="document_versions.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    project: Optional["Project"] = Relationship(back_populates="documents")
    versions: list["DocumentVersion"] = Relationship(back_populates="document")
    latest_version: Optional["DocumentVersion"] = Relationship(sa_relationship_kwargs={"uselist": False}, back_populates="latest_for_document")

    def __repr__(self) -> str:  # pragma: no cover
        return f"Document(id={self.id}, type={self.type})"
