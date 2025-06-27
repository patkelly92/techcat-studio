from fastapi import APIRouter, HTTPException
import logging
from apps.api.models.payload import GenerationPayload, ArchitecturePayload, AgentsPayload
from apps.api.services.llm_orchestrator import (
    generate_docs,
    generate_architecture,
    generate_agents_content,
)
from apps.api.services.document_saver import save_document_to_db

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
        save_document_to_db(payload.projectSlug, "architecture", result["ARCHITECTURE.md"])
    return result


@router.post("/generate/agents")
async def generate_agents_route(payload: AgentsPayload):
    """Generate AGENTS.md using PRD and ARCHITECTURE for the project."""
    slug = payload.slug
    logger.info("/generate/agents payload received for slug=%s", slug)
    content = await generate_agents_content(slug)
    if not content:
        logger.error("OpenAI returned no AGENTS content for %s", slug)
        raise HTTPException(status_code=500, detail="OpenAI generation failed")

    version = save_document_to_db(slug, "agents", content)
    version_id = version.id  # access before object is detached
    logger.info("AGENTS.md version %s stored for %s", version_id, slug)
    return {"status": "success", "version_id": str(version_id)}

