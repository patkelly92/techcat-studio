from pydantic import BaseModel
from crewai.flow import Flow, listen, start, router, and_, or_
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
    """Read `inputs/example-input.md` once and cache the result."""
    template_path = f"{CREWAI_ROOT}/inputs/example-user-input.md"
    return Path(template_path).read_text(encoding="utf-8")

PRD_TEMPLATE = load_prd_template()  # constant for quick access
USER_INPUTS = load_user_inputs()    # constant for quick access


class DocForgeState(BaseModel):
    user_inputs: str = USER_INPUTS
    prd_template: str = PRD_TEMPLATE
    prd: str = ""
    prd_score: float = 0.0
    prd_assessment: str = ""
    prd_rubric: dict = {}
    retry_prompt: str = ""
    retry_counter: int = 0


class DocForgeFlow(Flow[DocForgeState]):

    # 1. Pre Kickoff Activity
    @start()
    def pre_kickoff(self):
        print("Initiating PreKickoff Activity")

    # 2. Generate the PRD based on user input and template
    @listen(or_(pre_kickoff, "Low Quality"))
    def generate_prd(self):
        print("Generating PRD")
        result = (
            PRDGenCrew()
            .crew()
            .kickoff(inputs={"prd_template": self.state.prd_template, "user_inputs": self.state.user_inputs, "retry_prompt": self.state.retry_prompt})
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
    # @listen(generate_prd)
    @router(generate_prd)
    def assess_prd(self):
        print("Assessing PRD")
        # self.state.prd_score = 0.5 # Simulating a low score for testing purposes
        if self.state.prd_score < 0.6:
            print("PRD quality is below threshold, re-generating...")
            # Set the retry prompt with the assessment feedback. This will be used to guide the next PRD generation
            self.state.retry_prompt = f"""IMPORTANT CONTEXT: This is the second time you are generating a PRD document for me.
            The PRD draft you've previously provided me is insufficient. Please provide more detailed feedback to improve the document's quality.
            Below, enclosed in triple backticks is the PRD draft that you have previously provided me:
            ```{self.state.prd}```
            Here are some areas of improvement that our PRD quality assurance analyst has noted and identified for you to focus on for this next draft: 
            `{self.state.prd_assessment}`
            """
            if self.state.retry_counter <= 3:
                # Increment the retry counter (we'll try 3 times)
                self.state.retry_counter += 1
                # Here we emit "Low Quality" with our router to re-generate the document back to `generate_prd`
                return "Low Quality"
            else:
                print("Maximum retry attempts reached. Please review the PRD manually.")

        else:
            print("PRD quality is acceptable.")

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
