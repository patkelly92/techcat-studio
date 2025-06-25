from pathlib import Path
import os
import logging

from dotenv import load_dotenv
from openai import AsyncOpenAI

from apps.api.models.payload import GenerationPayload

logger = logging.getLogger(__name__)

# Load environment variables from apps/api/.env if present
load_dotenv()

# Default settings for OpenAI calls
_DEFAULT_MODEL = "gpt-4o"
_DEFAULT_TEMPERATURE = 0.2
# Relative path to the templates directory from the project root
_TEMPLATES_DIR = Path(".codex/templates")


def _find_project_root() -> Path:
    """Return repository root containing `.codex`."""
    root = Path(__file__).resolve()
    while not (root / ".codex").exists():
        if root == root.parent:
            raise FileNotFoundError("Could not locate '.codex' directory")
        root = root.parent
    return root


def _load_template(name: str) -> str:
    """Load a markdown template from the `.codex/templates` directory."""
    project_root = _find_project_root()
    template_path = project_root / _TEMPLATES_DIR / name
    return template_path.read_text()


def _openai_client() -> AsyncOpenAI:
    """Return an AsyncOpenAI client using env configuration."""
    return AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


async def generate_docs(payload: GenerationPayload):
    """Generate a PRD.md string using OpenAI and a markdown template."""
    try:
        template_text = _load_template("prd-template.md")
    except Exception as exc:
        return {"error": f"Failed to load template: {exc}"}

    # Build prompt blocks
    system_instructions = (
        "You are a product strategist. Your job is to translate sparse or vague user input "
        "into a comprehensive product requirements document. Infer missing information. "
        "Be confident and strategic."
    )

    # Format user input as key: value pairs
    user_lines = []
    for key, value in payload.model_dump().items():
        if isinstance(value, list):
            value = ", ".join(value)
        user_lines.append(f"{key}: {value}")
    user_block = "\n".join(user_lines)

    user_section = (
        "The following user input may be minimal. Use it as inspiration to complete the PRD.\n"
        + user_block
    )

    messages = [
        {"role": "system", "content": system_instructions},
        {"role": "user", "content": template_text},
        {"role": "user", "content": user_section},
    ]

    client = _openai_client()

    try:
        response = await client.chat.completions.create(
            model=_DEFAULT_MODEL,
            messages=messages,
            temperature=_DEFAULT_TEMPERATURE,
        )
        content = response.choices[0].message.content
        logger.info("OpenAI PRD generation success for %s", payload.projectSlug)
        return {"PRD.md": content}
    except Exception as exc:
        logger.error("OpenAI PRD generation failed: %s", exc)
        return {"error": str(exc)}


async def generate_architecture_content(project_slug: str) -> str | None:
    """Return ARCHITECTURE.md content for the given project slug."""
    try:
        template_text = _load_template("architecture-template.md")
        project_root = _find_project_root()
        prd_path = (
            project_root
            / "apps"
            / "techcat-studio"
            / "data"
            / "documents"
            / project_slug
            / "PRD.md"
        )
        prd_text = prd_path.read_text()
    except Exception as exc:  # pragma: no cover
        logger.error("Failed loading PRD or template for %s: %s", project_slug, exc)
        return None

    system_instructions = (
        "You are a software architect. Use the provided PRD to craft a detailed architecture document."
    )
    messages = [
        {"role": "system", "content": system_instructions},
        {"role": "user", "content": template_text},
        {"role": "user", "content": prd_text},
    ]

    client = _openai_client()
    try:
        response = await client.chat.completions.create(
            model=_DEFAULT_MODEL,
            messages=messages,
            temperature=_DEFAULT_TEMPERATURE,
        )
        logger.info("OpenAI architecture generation success for %s", project_slug)
        return response.choices[0].message.content
    except Exception as exc:  # pragma: no cover
        logger.error("OpenAI architecture generation failed for %s: %s", project_slug, exc)
        return None


async def generate_architecture(project_slug: str):
    """Backward-compatible wrapper returning a mapping."""
    logger.info("Requesting architecture generation for %s", project_slug)
    content = await generate_architecture_content(project_slug)
    if content is None:
        logger.error("Architecture generation failed for %s", project_slug)
        return {"error": "Failed to generate architecture"}
    logger.info("Architecture generation complete for %s", project_slug)
    return {"ARCHITECTURE.md": content}
