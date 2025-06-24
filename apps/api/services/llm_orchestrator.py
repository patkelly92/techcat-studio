from pathlib import Path
import os

from dotenv import load_dotenv
from openai import AsyncOpenAI

from apps.api.models.payload import GenerationPayload

# Load environment variables from apps/api/.env if present
load_dotenv()


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

    # Build prompt blocks
    system_instructions = (
        "You are a Product Strategist tasked with writing a professional PRD. "
        "Fill every {{}} placeholder in the template. If the user omits a field, "
        "infer reasonable details or propose suggestions. Return only the final "
        "markdown document exactly following the template's formatting."
    )

    # Format user input as key: value pairs
    user_lines = []
    for key, value in payload.model_dump().items():
        if isinstance(value, list):
            value = ", ".join(value)
        user_lines.append(f"{key}: {value}")
    user_block = "\n".join(user_lines)

    template_section = "### Template\n" + template_text
    user_section = "### User Input\n" + user_block

    messages = [
        {"role": "system", "content": system_instructions},
        {"role": "user", "content": template_section},
        {"role": "user", "content": user_section},
    ]

    client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.2,
        )
        content = response.choices[0].message.content
        return {"PRD.md": content}
    except Exception as exc:
        return {"error": str(exc)}
