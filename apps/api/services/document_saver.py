import logging
import os
from pathlib import Path
from sqlmodel import Session, select
from fastapi import HTTPException

from apps.api.db.database import engine
from apps.api.models.db import Project, Document, DocumentVersion
from apps.api.constants import STATIC_USER_ID

DEBUG_WRITE_FILES = os.getenv("DEBUG_WRITE_FILES") == "true"
logger = logging.getLogger(__name__)


def save_document_to_db(project_slug: str, doc_type: str, markdown_content: str) -> DocumentVersion:
    """Persist markdown content as a new DocumentVersion in the database."""
    with Session(engine) as session:
        project = session.exec(select(Project).where(Project.slug == project_slug)).first()
        if not project:
            logger.error("Project not found for slug=%s", project_slug)
            raise HTTPException(status_code=404, detail="Project not found")

        document = session.exec(
            select(Document).where(Document.project_id == project.id, Document.type == doc_type)
        ).first()
        if document is None:
            document = Document(project_id=project.id, type=doc_type)
            session.add(document)
            session.flush()
            logger.info("Created new Document %s of type %s for project %s", document.id, doc_type, project_slug)

        version = DocumentVersion(
            document_id=document.id,
            content=markdown_content,
            created_by=STATIC_USER_ID,
        )
        session.add(version)
        session.flush()
        logger.info(
            "Inserted DocumentVersion %s for Document %s", version.id, document.id
        )

        document.latest_version_id = version.id
        session.add(document)
        session.commit()
        session.refresh(version)
        if DEBUG_WRITE_FILES:
            try:
                root = Path(__file__).resolve().parents[3]
                dir_path = root / "apps" / "techcat-studio" / "data" / "documents" / project_slug
                dir_path.mkdir(parents=True, exist_ok=True)
                file_path = dir_path / f"{doc_type.upper()}.md"
                file_path.write_text(markdown_content)
            except Exception as exc:  # pragma: no cover
                logger.error("Debug file write failed for %s/%s: %s", project_slug, doc_type, exc)
        return version
