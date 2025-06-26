from fastapi import APIRouter, HTTPException
import logging
from pathlib import Path
from apps.api.models.payload import GenerationPayload, ArchitecturePayload, AgentsPayload
from apps.api.services.llm_orchestrator import (
    generate_docs,
    generate_architecture,
    generate_agents_content,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate")
async def generate(payload: GenerationPayload):
    """Generate project documentation via OpenAI."""
    logger.info("/generate payload received: %s", payload.model_dump())
    result = await generate_docs(payload)
    logger.info("/generate result keys: %s", list(result.keys()))
    return result


@router.post("/generate/architecture")
async def generate_architecture_route(payload: ArchitecturePayload):
    """Generate ARCHITECTURE.md using existing PRD for the project."""
    logger.info(
        "/generate/architecture payload received for slug=%s", payload.projectSlug
    )
    result = await generate_architecture(payload.projectSlug)
    logger.info("/generate/architecture result keys: %s", list(result.keys()))
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

    repo_root = Path(__file__).resolve().parents[3]
    file_path = (
        repo_root
        / "apps"
        / "techcat-studio"
        / "data"
        / "documents"
        / slug
        / "AGENTS.md"
    )
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content)
    except Exception as exc:  # pragma: no cover
        logger.error("Failed writing AGENTS.md for %s: %s", slug, exc)
        raise HTTPException(status_code=500, detail=f"Failed to write file: {exc}")

    rel_path = file_path.relative_to(repo_root)
    logger.info("AGENTS.md written to %s", rel_path)
    return {"status": "success", "filename": str(rel_path)}
