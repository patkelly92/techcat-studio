from pathlib import Path
import os
import re
from typing import Any, Dict
from dotenv import load_dotenv
from openai import AsyncOpenAI

from apps.api.models.payload import GenerationPayload

# Load environment variables from apps/api/.env if present
load_dotenv()


def _inject_template(template: str, data: Dict[str, Any]) -> str:
    """Replace known placeholders in the template with provided data."""

    for key, value in data.items():
        placeholder = f"{{{{{key}}}}}"
        if isinstance(value, list):
            value = ", ".join(value)
        template = template.replace(placeholder, str(value))
    # Replace any leftover placeholders with TBD markers for OpenAI to infer
    template = re.sub(r"\{\{[^}]+\}\}", "TBD", template)
    return template


async def generate_docs(payload: GenerationPayload):
    """Generate a PRD.md string using OpenAI and a markdown template."""
    # This approach is more robust. It finds the project root by looking for a
    # known directory ('.codex') instead of relying on a fixed directory structure.
    # It starts from the current file and walks up the directory tree.
    try:
        project_root = Path(__file__).resolve()
        # Keep going up one level until we find a directory that contains '.codex'
        while not (project_root / ".codex").exists():
            if project_root == project_root.parent:
                # If we've reached the filesystem root and haven't found it, raise an error.
                raise FileNotFoundError("Could not find the '.codex' directory in any parent path.")
            project_root = project_root.parent

        template_path = project_root / ".codex" / "templates" / "prd-template.md"
        template_text = template_path.read_text()
    except FileNotFoundError as exc:
        return {"error": str(exc)}
    except Exception as exc:
        return {"error": f"Failed to load template: {exc}"}

    injected = _inject_template(template_text, payload.model_dump())

    instruction = (
        "You are a product strategist generating a comprehensive PRD. "
        "Use the markdown template below as a guide. If any field is missing, "
        "make a reasonable assumption, suggest improvements when appropriate, "
        "and infer a suitable tech stack based on the project goals and users. "
        "Return only the completed markdown document."
    )

    prompt = instruction + "\n\n" + injected

    client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        content = response.choices[0].message.content
        return {"PRD.md": content}
    except Exception as exc:
        return {"error": str(exc)}
