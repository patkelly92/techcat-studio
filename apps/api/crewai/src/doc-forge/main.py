#!/usr/bin/env python
from random import randint
from pydantic import BaseModel
from crewai.flow import Flow, listen, start
from crews.docforge_crew.prd_gen_crew import PRDGenCrew
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path
# ── crewai and project root (three and 6 levels up from this file, respectively) ──
CREWAI_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[5]

# TEST CODE TO LOAD PRD TEMPLATE & USER INPUTS. Alternatively, we could use the `FileReadTool` or postgresql to read these files.
from functools import lru_cache
@lru_cache(maxsize=1)
def load_prd_template() -> str:
    """Read `.codex/templates/prd-template.md` once and cache the result."""
    template_path = f"{PROJECT_ROOT}/.codex/templates/prd-template.md"
    return Path(template_path).read_text(encoding="utf-8")

@lru_cache(maxsize=1)
def load_user_inputs() -> str:
    """Read `.codex/templates/prd-template.md` once and cache the result."""
    template_path = f"{PROJECT_ROOT}/example-input.md"
    return Path(template_path).read_text(encoding="utf-8")

PRD_TEMPLATE = load_prd_template()  # constant for quick access
USER_INPUTS = load_user_inputs()  # constant for quick access


class DocForgeState(BaseModel):
    user_inputs: str = USER_INPUTS
    prd_template: str = PRD_TEMPLATE
    prd: str = ""
    prd_score: float = 0.0
    prd_assessment: str = ""
    prd_rubric: dict = {}


class DocForgeFlow(Flow[DocForgeState]):

    # 1. Pre Kickoff Activity
    @start()
    def pre_kickoff(self):
        print("Initiating PreKickoff Activity")

    # 2. Generate the PRD based on user input and template
    @listen(pre_kickoff)
    def generate_prd(self):
        print("Generating PRD")
        result = (
            PRDGenCrew()
            .crew()
            .kickoff(inputs={"prd_template": self.state.prd_template, "user_inputs": self.state.user_inputs})
        )

        # Extract the `pydantic` TaskOutputs from 'generate_prd' and 'evaluate_prd'
        generate_prd_pydantic = next((task.pydantic for task in result.tasks_output if task.name == 'generate_prd'), None)
        evaluate_prd_pydantic = next((task.pydantic for task in result.tasks_output if task.name == 'evaluate_prd'), None)

        # Update the state of DocForgeFlow with the results
        self.state.prd = generate_prd_pydantic.markdown
        self.state.prd_score = evaluate_prd_pydantic.rubric.overall
        self.state.prd_assessment = evaluate_prd_pydantic.assessment
        self.state.prd_rubric = evaluate_prd_pydantic.rubric
        
        print(f"PRD Overall Score: {self.state.prd_score:.2f}")
        print(f"Assessment: {self.state.prd_assessment}")
        print(f"Token Usage: {result.token_usage}")

    # 3. Assess the PRD quality and redo if necessary
    @listen(generate_prd)
    def assess_prd(self):
        print("Assess PRD")

    # 4. Write the PRD and metrics to files
    @listen(generate_prd)
    def save_prd(self):
        print("Saving PRD")
        with open(f"{CREWAI_ROOT}/outputs/doc-forge-prd.md", "w") as f:
            f.write(self.state.prd)
        print("Saving Metrics")
        with open(f"{CREWAI_ROOT}/outputs/doc-forge-prd-metrics.json", "w") as f:
            f.write(self.state.prd_rubric.json())

    # 5. Run the ARCHITECTURE.md generation


def kickoff():
    docforge_flow = DocForgeFlow()
    docforge_flow.kickoff()


def plot():
    docforge_flow = DocForgeFlow()
    docforge_flow.plot()


if __name__ == "__main__":
    kickoff()
