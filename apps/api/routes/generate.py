from fastapi import APIRouter
from apps.api.models.payload import GenerationPayload
from apps.api.services.llm_orchestrator import generate_docs

router = APIRouter()


@router.post("/generate")
async def generate(payload: GenerationPayload):
    """Generate project documentation via OpenAI."""
    return await generate_docs(payload)
