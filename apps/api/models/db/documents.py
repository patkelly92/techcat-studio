from __future__ import annotations
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Document(SQLModel, table=True):
    __tablename__ = "documents"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    project_id: UUID = Field(foreign_key="projects.id")
    type: str
    latest_version_id: Optional[UUID] = Field(default=None, foreign_key="document_versions.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    project: Mapped[Optional["Project"]] = Relationship(
        sa_relationship=relationship("Project", back_populates="documents")
    )
    versions: Mapped[list["DocumentVersion"]] = Relationship(
        sa_relationship=relationship(
            "DocumentVersion",
            back_populates="document",
            foreign_keys="[DocumentVersion.document_id]",
        )
    )
    latest_version: Mapped[Optional["DocumentVersion"]] = Relationship(
        sa_relationship=relationship(
            "DocumentVersion",
            back_populates="latest_for_document",
            uselist=False,
            foreign_keys="[Document.latest_version_id]",
        )
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Document(id={self.id}, type={self.type})"
