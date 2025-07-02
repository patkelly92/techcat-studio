from pydantic import BaseModel, Field, confloat, field_validator, ValidationError, model_validator
from typing import List, Optional
from markdown_it import MarkdownIt

md_parser = MarkdownIt()

# 0-1 constrained float alias
Score = confloat(ge=0.0, le=1.0)

# Structured Task representation
class TaskMetadata(BaseModel):
    task_number: int
    short_title: str
    agent_name: str
    goal: str
    requirements: List[str]
    technical_notes: List[str]
    output_files: List[str]
    prompt_notes: Optional[str] = None
    completion_criteria: List[str]

    model_config = {"extra": "forbid"}  # catch schema drift

# Rubric returned by the task-quality judge
class TaskRubric(BaseModel):
    template_coverage: Score = Field(..., description="Percent of mandatory sections from prd-template.md that are present and non-empty")
    clarity: Score = Field(..., description="Specific, unambiguous wording")
    feasibility: Score = Field(..., description="Realistic given constraints")
    acceptance_criteria_quality: Score = Field(..., description="Testable, measurable")
    effort_realism: Score = Field(..., description="Effort points vs scope")
    language_quality: Score = Field(..., description="Grammar & tone")
    constraint_adherence: Score = Field(..., description="Respects legal/tech limits")

    @property
    def overall(self) -> float:
        return sum(self.__dict__.values()) / len(self.__dict__)

    model_config = {"extra": "forbid"}

# Judge report wrapper
class EvaluateTaskReport(BaseModel):
    rubric: TaskRubric
    assessment: str = Field(..., max_length=1000, description="A paragraph narrative on how to improve this task. Include top-3 actionable recommendations.")

    model_config = {"extra": "forbid"}

    # optional gate: fail fast if quality too low
    @model_validator(mode="after")
    def ensure_quality(cls, v):
        if v.rubric.overall < 0.6:
            raise ValueError(f"Overall quality {v.rubric.overall:.2f} below threshold")
        return v


# Output emitted by the Task-Smith generation agent
class TaskGenerationOutput(BaseModel):
    task: TaskMetadata
    markdown: str = Field(..., description="Full TASK.md text")

    # field-level validator: required headings present
    @field_validator("markdown")
    @classmethod
    def check_headings(cls, md: str) -> str:
        required = [
            "# Task ",
            "## 🧠 Goal",
            "## ✅ Requirements",
            "## 🔍 Technical Notes",
            "## 📁 Output Files",
            "## 📝 Prompt Notes",
            "## ✅ Completion Criteria",
        ]
        missing = [h for h in required if h not in md]
        if missing:
            raise ValueError(f"Markdown missing section headings: {missing}")
        return md

    # ── structural check with markdown-it ──────────
    @field_validator("markdown")
    @classmethod
    def h1_must_be_first(cls, md: str) -> str:
        tokens = md_parser.parse(md)
        # first non-inline token should be <h1>
        for t in tokens:
            if t.type.endswith("_open"):
                if t.tag != "h1":
                    raise ValueError("Document must start with an H1 heading")
                break
        return md

    model_config = {"extra": "forbid"}