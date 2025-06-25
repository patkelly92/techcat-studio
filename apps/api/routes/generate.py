from fastapi import APIRouter
from apps.api.models.payload import GenerationPayload
from apps.api.services.llm_orchestrator import generate_docs, generate_architecture

router = APIRouter()


@router.post("/generate")
async def generate(payload: GenerationPayload):
    """Generate project documentation via OpenAI."""
    return await generate_docs(payload)


@router.post("/generate/architecture")
async def generate_architecture_route(payload: dict):
    """Generate ARCHITECTURE.md using existing PRD for the project."""
    project_slug = payload.get("projectSlug")
    if not project_slug:
        return {"error": "Missing projectSlug"}
    return await generate_architecture(project_slug)
