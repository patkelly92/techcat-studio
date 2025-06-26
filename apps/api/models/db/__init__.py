from .users import User
from .projects import Project
from .documents import Document
from .document_versions import DocumentVersion

from sqlmodel import SQLModel

__all__ = [
    "User",
    "Project",
    "Document",
    "DocumentVersion",
    "get_sqlmodel_metadata",
]


def get_sqlmodel_metadata():
    """Return shared SQLModel metadata for Alembic."""
    return SQLModel.metadata
