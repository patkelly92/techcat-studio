from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
import logging
from apps.api.models.payload import (
    GenerationPayload,
    ArchitecturePayload,
    AgentsPayload,
)
from apps.api.services.llm_orchestrator import (
    generate_docs,
    generate_architecture,
    generate_agents,
)
from apps.api.services.document_saver import save_document_to_db
from apps.api.db.database import get_session
from apps.api.models.db import Project, Document, DocumentVersion

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate")
async def generate(payload: GenerationPayload):
    """Generate project documentation via OpenAI."""
    logger.info("/generate payload received: %s", payload.model_dump())
    result = await generate_docs(payload)
    logger.info("/generate result keys: %s", list(result.keys()))
    if "PRD.md" in result:
        save_document_to_db(payload.projectSlug, "prd", result["PRD.md"])
    return result


@router.post("/generate/architecture")
async def generate_architecture_route(payload: ArchitecturePayload):
    """Generate ARCHITECTURE.md using existing PRD for the project."""
    logger.info(
        "/generate/architecture payload received for slug=%s", payload.projectSlug
    )
    result = await generate_architecture(payload.projectSlug)
    logger.info("/generate/architecture result keys: %s", list(result.keys()))
    if "ARCHITECTURE.md" in result:
        save_document_to_db(
            payload.projectSlug, "architecture", result["ARCHITECTURE.md"]
        )
    return result


@router.post("/generate/agents")
async def generate_agents_route(payload: AgentsPayload):
    """Generate AGENTS.md using PRD and ARCHITECTURE for the project."""
    slug = payload.slug
    logger.info("/generate/agents payload received for slug=%s", slug)
    result = await generate_agents(slug)
    logger.info("/generate/agents result keys: %s", list(result.keys()))
    content = result.get("AGENTS.md")
    if not content:
        logger.error("OpenAI returned no AGENTS content for %s", slug)
        raise HTTPException(status_code=500, detail="OpenAI generation failed")

    version = save_document_to_db(slug, "agents", content)
    version_id = version.id  # access before object is detached
    logger.info("AGENTS.md version %s stored for %s", version_id, slug)
    result["version_id"] = str(version_id)
    return result


@router.get("/documents")
def list_documents(slug: str, session: Session = Depends(get_session)):
    project = session.exec(select(Project).where(Project.slug == slug)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    docs = session.exec(select(Document).where(Document.project_id == project.id)).all()
    documents = []
    for doc in docs:
        version = session.exec(
            select(DocumentVersion).where(DocumentVersion.id == doc.latest_version_id)
        ).first()
        if version:
            documents.append(
                {
                    "title": f"{doc.type.upper()}.md",
                    "content": version.content,
                    "lastModified": version.created_at.isoformat(),
                }
            )
    return {"documents": documents}

