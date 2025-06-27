from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

# Input Output Validation and Scoring
# - PRD Rubric and Evaluation Report
from typing import Optional
from pydantic import BaseModel, Field, confloat, field_validator

# reusable 0-1 constrained float
Score = confloat(ge=0.0, le=1.0)

class PRDRubric(BaseModel):
    template_coverage:        Score = Field(..., description="Mandatory-section coverage")
    requirements_clarity:     Score = Field(..., description="Specific, unambiguous feature descriptions")
    success_metrics_quality:  Score = Field(..., description="Quantified, user-value-linked success metrics")
    technical_feasibility:    Score = Field(..., description="Realism of scope vs. tech stack")
    timeline_realism:         Score = Field(..., description="Credible delivery timeframe")
    user_alignment:           Score = Field(..., description="Consistency with target-user pains/goals")
    risk_completeness:        Score = Field(..., description="Coverage of major risks + mitigations")
    constraint_adherence:     Score = Field(..., description="Compliance with stated constraints")
    internal_consistency:     Score = Field(..., description="No contradictions across sections")
    language_quality:         Score = Field(..., description="Grammar, readability, professional tone")

    @property
    def overall(self) -> float:
        """Simple arithmetic mean—tweak if you want weighted scoring."""
        return sum(self.__dict__.values()) / len(self.__dict__)

class EvaluatePRDReport(BaseModel):
    rubric:  PRDRubric
    summary: str = Field(..., max_length=120, description="Top-3 improvement actions")

    # Optional helper: auto-fail if any metric is too low
    @field_validator("rubric")
    @classmethod
    def ensure_minimum_quality(cls, v: PRDRubric) -> PRDRubric:
        if v.overall < 0.6:
            raise ValueError(f"Overall score {v.overall:.2f} below acceptance threshold")
        return v



@CrewBase
class DocForgeCrew:
    """DocForge Crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def product_strategist(self) -> Agent:
        return Agent(
            config=self.agents_config["product_strategist"],  # type: ignore[index]
        )
    
    @agent
    def prd_judge(self) -> Agent:
        return Agent(
            config=self.agents_config["prd_judge"],  # type: ignore[index]
        )
    
    @task
    def generate_prd(self) -> Task:
        return Task(
            config=self.tasks_config["generate_prd"],  # type: ignore[index]
        )
    
    @task
    def evaluate_prd(self) -> Task:
        return Task(
            config=self.tasks_config["evaluate_prd"],  # type: ignore[index]
        )


    @crew
    def crew(self) -> Crew:
        """Creates the DocForge Crew"""

        return Crew(
            agents=self.agents,  
            tasks=self.tasks,    
            process=Process.sequential,
            verbose=True,
        )
