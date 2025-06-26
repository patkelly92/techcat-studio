from __future__ import annotations
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID | None = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    projects: list["Project"] = Relationship(back_populates="user")
    document_versions: list["DocumentVersion"] = Relationship(back_populates="created_by_user")

    def __repr__(self) -> str:  # pragma: no cover - simple repr
        return f"User(id={self.id}, email={self.email})"
