from pathlib import Path
import os
import re
from typing import Any, Dict

from dotenv import load_dotenv
from openai import AsyncOpenAI

from apps.api.models.payload import GenerationPayload

# Load environment variables from apps/api/.env if present
load_dotenv(Path(__file__).resolve().parent / ".env")


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
    template_path = (
        Path(__file__).resolve().parent.parent.parent
        / ".codex"
        / "templates"
        / "prd-template.md"
    )

    try:
        template_text = template_path.read_text()
    except Exception as exc:
        return {"error": f"Failed to load template: {exc}"}

    injected = _inject_template(template_text, payload.model_dump())

    prompt = (
        "Fill in the following PRD markdown template. "
        "Expand on any 'TBD' markers with reasonable detail. "
        "Return only the completed markdown document.\n\n" + injected
    )

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
