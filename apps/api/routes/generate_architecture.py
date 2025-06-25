from fastapi import APIRouter, HTTPException
from apps.api.services.llm_orchestrator import generate_architecture_content
from pathlib import Path

router = APIRouter()

@router.post("/generate/architecture")
async def generate_architecture(data: dict):
    """Generate ARCHITECTURE.md from existing PRD."""
    slug = data.get("project")
    if not slug:
        raise HTTPException(status_code=400, detail="Missing project slug")

    repo_root = Path(__file__).resolve().parents[3]
    prd_path = (
        repo_root
        / "apps"
        / "techcat-studio"
        / "data"
        / "documents"
        / slug
        / "PRD.md"
    )
    if not prd_path.exists():
        raise HTTPException(status_code=404, detail="PRD.md not found")

    content = await generate_architecture_content(slug)
    if not content:
        raise HTTPException(status_code=500, detail="OpenAI generation failed")

    arch_path = prd_path.parent / "ARCHITECTURE.md"
    try:
        arch_path.write_text(content)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Failed to write file: {exc}")

    return {
        "status": "success",
        "message": "ARCHITECTURE.md created successfully",
        "path": str(arch_path.relative_to(repo_root)),
    }
