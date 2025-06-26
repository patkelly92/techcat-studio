from __future__ import annotations
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.orm import Mapped, mapped_column, relationship

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    projects: Mapped[list["Project"]] = Relationship(
        sa_relationship=relationship("Project", back_populates="user")
    )
    document_versions: Mapped[list["DocumentVersion"]] = Relationship(
        sa_relationship=relationship("DocumentVersion", back_populates="created_by_user")
    )

    def __repr__(self) -> str:  # pragma: no cover - simple repr
        return f"User(id={self.id}, email={self.email})"
