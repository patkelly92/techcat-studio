from pydantic import BaseModel
from crewai.flow import Flow, listen, start, router, and_, or_
from crews.tasksmith_crew.task_smith_crew import TaskSmithCrew
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path
# ── crewai and project root (three and 6 levels up from this file, respectively) ──
CREWAI_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[5]

# TEST CODE TO LOAD PRD TEMPLATE & USER INPUTS. Alternatively, we could use the `FileReadTool` or postgresql to read these files.
from functools import lru_cache
@lru_cache(maxsize=1)
def load_task_template() -> str:
    """Read `.codex/templates/task-template.md` once and cache the result."""
    template_path = f"{PROJECT_ROOT}/.codex/templates/task-template.md"
    return Path(template_path).read_text(encoding="utf-8")

@lru_cache(maxsize=1)
def load_feedback_inputs() -> str:
    """Read `inputs/example-feedback-input.md` once and cache the result."""
    template_path = f"{CREWAI_ROOT}/inputs/example-feedback-input.md"
    return Path(template_path).read_text(encoding="utf-8")

TASK_TEMPLATE = load_task_template()      # constant for quick access
FEEDBACK_INPUTS = load_feedback_inputs()  # constant for quick access


class TaskSmithState(BaseModel):
    feedback_inputs: str = FEEDBACK_INPUTS
    task_template: str = TASK_TEMPLATE
    task: str = ""
    task_score: float = 0.0
    task_assessment: str = ""
    task_rubric: dict = {}
    retry_prompt: str = ""
    retry_counter: int = 0


class TaskSmithFlow(Flow[TaskSmithState]):

    # 1. Pre Kickoff Activity
    @start()
    def pre_kickoff(self):
        print("Initiating PreKickoff Activity")

    # 2. Generate the Task based on user feedback input and template
    @listen(or_(pre_kickoff, "Low Quality"))
    def generate_task(self):
        print("Generating Task")
        result = (
            TaskSmithCrew()
            .crew()
            .kickoff(inputs={"task_template": self.state.task_template, "feedback_inputs": self.state.feedback_inputs, "retry_prompt": self.state.retry_prompt})
        )

        # Extract the `pydantic` TaskOutputs from 'generate_task' and 'evaluate_task'
        generate_task_pydantic = next((task.pydantic for task in result.tasks_output if task.name == 'generate_task'), None)
        evaluate_task_pydantic = next((task.pydantic for task in result.tasks_output if task.name == 'evaluate_task'), None)

        # Update the state of DocForgeFlow with the results
        self.state.task = generate_task_pydantic.markdown
        self.state.task_score = evaluate_task_pydantic.rubric.overall
        self.state.task_assessment = evaluate_task_pydantic.assessment
        self.state.task_rubric = evaluate_task_pydantic.rubric

        print(f"Task Overall Score: {self.state.task_score:.2f}")
        print(f"Assessment: {self.state.task_assessment}")
        print(f"Token Usage: {result.token_usage}")

    # 3. Assess the PRD quality and redo if necessary
    @router(generate_task)
    def assess_task(self):
        print("Assessing Task")
        self.state.task_score = 0.5
        if self.state.task_score < 0.6:
            print("Task quality is below threshold, re-generating...")
            # Set the retry prompt with the assessment feedback. This will be used to guide the next Task generation
            self.state.retry_prompt = f"""IMPORTANT CONTEXT: This is the second time you are generating a Task document for me.
            The Task draft you've previously provided me is insufficient. Please provide more detailed feedback to improve the document's quality.
            Below, enclosed in triple backticks is the Task draft that you have previously provided me:
            ```{self.state.task}```
            Here are some areas of improvement that our PRD quality assurance analyst has noted and identified for you to focus on for this next draft: 
            `{self.state.task_assessment}`
            """
            if self.state.retry_counter <= 3:
                # Increment the retry counter (we'll try 3 times)
                self.state.retry_counter += 1
                # Here we emit "Low Quality" with our router to re-generate the document back to `generate_prd`
                return "Low Quality"
            else:
                print("Maximum retry attempts reached. Please review the Task manually.")

        else:
            print("Task quality is acceptable.")

    # 4. Write the Task and metrics to files
    @listen(assess_task)
    def save_task(self):
        print("Saving Task")
        with open(f"{CREWAI_ROOT}/outputs/task-smith.md", "w") as f:
            f.write(self.state.task)
        print("Saving Metrics")
        with open(f"{CREWAI_ROOT}/outputs/task-smith-metrics.json", "w") as f:
            f.write(self.state.task_rubric.json())


def kickoff():
    task_smith_flow = TaskSmithFlow()
    task_smith_flow.kickoff()


def plot():
    task_smith_flow = TaskSmithFlow()
    task_smith_flow.plot()


if __name__ == "__main__":
    kickoff()
