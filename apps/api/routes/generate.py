from fastapi import APIRouter
import logging
from apps.api.models.payload import GenerationPayload, ArchitecturePayload
from apps.api.services.llm_orchestrator import generate_docs, generate_architecture

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
