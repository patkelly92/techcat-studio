from fastapi import APIRouter
from apps.api.models.payload import GenerationPayload

router = APIRouter()

@router.post("/api/generate")
async def generate(payload: GenerationPayload):
    """Echo the provided payload for now."""
    return payload
