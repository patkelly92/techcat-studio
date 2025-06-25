from fastapi import APIRouter
from apps.api.models.payload import GenerationPayload, ArchitecturePayload
from apps.api.services.llm_orchestrator import generate_docs, generate_architecture

router = APIRouter()


@router.post("/generate")
async def generate(payload: GenerationPayload):
    """Generate project documentation via OpenAI."""
    return await generate_docs(payload)


@router.post("/generate/architecture")
async def generate_architecture_route(payload: ArchitecturePayload):
    """Generate ARCHITECTURE.md using existing PRD for the project."""
    return await generate_architecture(payload.projectSlug)
