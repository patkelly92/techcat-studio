from __future__ import annotations
from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Column, Text
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional

class DocumentVersion(SQLModel, table=True):
    __tablename__ = "document_versions"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    document_id: UUID = Field(foreign_key="documents.id")
    content: str = Field(sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: UUID = Field(foreign_key="users.id")

    document: Mapped[Optional["Document"]] = Relationship(
        sa_relationship=relationship(
            "Document",
            back_populates="versions",
            foreign_keys="[DocumentVersion.document_id]",
        )
    )
    created_by_user: Mapped[Optional["User"]] = Relationship(
        sa_relationship=relationship("User", back_populates="document_versions")
    )
    latest_for_document: Mapped[Optional["Document"]] = Relationship(
        sa_relationship=relationship(
            "Document",
            back_populates="latest_version",
            foreign_keys="[Document.latest_version_id]",
        )
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"DocumentVersion(id={self.id}, document_id={self.document_id})"
