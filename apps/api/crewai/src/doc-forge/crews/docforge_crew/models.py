from pydantic import BaseModel, Field, confloat, field_validator, ValidationError, model_validator
from typing import List, Optional
from markdown_it import MarkdownIt

md_parser = MarkdownIt()

# Input Output Validation and Scoring
# - PRD Rubric and Evaluation Report

# reusable 0-1 constrained float
Score = confloat(ge=0.0, le=1.0)

class PRDRubric(BaseModel):
    template_coverage:        Score = Field(..., description="Percent of mandatory sections from prd-template.md that are present and non-empty")
    requirements_clarity:     Score = Field(..., description="Specificity & lack of ambiguity in feature descriptions")
    success_metrics_quality:  Score = Field(..., description="Are success criteria quantifiable and tied to user value?")
    technical_feasibility:    Score = Field(..., description="Realism of scope vs. stated tech stack & constraints")
    timeline_realism:         Score = Field(..., description="Does the implied delivery timeframe match effort?")
    user_alignment:           Score = Field(..., description="Consistency with target-user pains/goals")
    risk_completeness:        Score = Field(..., description="Identification & mitigation of major risks")
    constraint_adherence:     Score = Field(..., description="Respect for stated legal, budget, or tech constraints")
    internal_consistency:     Score = Field(..., description="No contradictions across sections")
    language_quality:         Score = Field(..., description="Grammar, readability, professional tone")

    @property
    def overall(self) -> float:
        """Simple arithmetic mean—tweak if you want weighted scoring."""
        return sum(self.__dict__.values()) / len(self.__dict__)

class EvaluatePRDReport(BaseModel):
    rubric:  PRDRubric
    assessment: str = Field(..., description="Include a detailed comprehensive one-paragraph summary of the top-3 improvement actions for the generated PRD document.")

    # auto-fail if any metric is too low -- **maybe we don't want this, as we'll let the agent decide what to do with the low score?**
    @field_validator("rubric")
    @classmethod
    def ensure_minimum_quality(cls, v: PRDRubric) -> PRDRubric:
        if v.overall < 0.6:
            raise ValueError(f"Overall score {v.overall:.2f} below acceptance threshold")
        return v


# # PRD Document Schema

# ─────────────────────────────────────────────────────────────
# 1.  Structured representation of the PRD (If we want it in JSON Format)
# ─────────────────────────────────────────────────────────────
# class ProductRequirementsDocument(BaseModel):
#     product_requirements_document: str
#     project_name: str
#     product_overview: str
#     core_objectives: List[str]
#     target_users: List[str]
#     core_features: List[str]
#     tech_stack: List[str]
#     success_criteria: List[str]
#     core_features: List[str]
#     stretch_goals: Optional[List[str]] = Field(default_factory=list)
#     tech_stack: List[str]
#     known_constraints: List[str]

#     # quick guard so no list comes in empty
#     @field_validator("*", mode="before")
#     @classmethod
#     def not_blank(cls, v: object, info):
#         if isinstance(v, list) and not v:
#             raise ValueError(f"{info.field_name} must not be empty")
#         if isinstance(v, str) and not v.strip():
#             raise ValueError(f"{info.field_name} must not be blank")
#         return v


# ─────────────────────────────────────────────────────────────
# 2.  Wrapper emitted by your PRD-generation crew
# ─────────────────────────────────────────────────────────────
class PRDGenerationOutput(BaseModel):
    # prd: ProductRequirementsDocument = Field(..., description="Structured PRD object")
    markdown: str = Field(..., description="Full Markdown text exactly as returned by the LLM")

    # ── Field-level: ensure headings exist ──────────────────
    @field_validator("markdown")
    @classmethod
    def check_headings_present(cls, md: str) -> str:
        required = [
            "# Product Requirements Document",
            "## Project Name",
            "## Product Overview",
            "## Core Objectives",
            "## Target Users",
            "## Core Features (MVP)",
            "## Tech Stack (MVP)",
            "## Stretch Goals (Post-MVP)",
            "## Success Criteria",
            "## Known Constraints",
        ]
        missing = [h for h in required if h not in md]
        if missing:
            raise ValueError(f"Markdown missing headings: {missing}")
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

    # # ── Model-level: cross-validate structured vs markdown ──
    # @model_validator(mode="after")
    # def cross_check(self):
    #     # Simple check: make sure the overview text shows up verbatim
    #     if self.prd.project_overview[:30] not in self.markdown:
    #         raise ValueError("Project overview text does not appear in Markdown")

    #     # Another example: every objective bullet appears
    #     for obj in self.prd.objectives:
    #         if obj not in self.markdown:
    #             raise ValueError(f"Objective missing in Markdown: {obj}")

    #     return self