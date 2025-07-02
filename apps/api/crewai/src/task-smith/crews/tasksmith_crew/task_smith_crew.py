from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from .models import EvaluateTaskReport, TaskGenerationOutput
from typing import List, Optional
from pathlib import Path
# ── crewai and project root (three and 6 levels up from this file, respectively) ──
CREWAI_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[7]


# import tools
from crewai_tools import (
    DirectoryReadTool,                                         # Facilitates reading and processing of directory structures and their contents.
    FileReadTool,                                              # Enables reading and extracting data from files, supporting various file formats.
    FileWriterTool,                                            # Designed to write content to files
    CodeInterpreterTool                                        # A tool for interpreting python code.
    )

# Instantiate Tools
file_writer_tool = FileWriterTool(filename=f"{CREWAI_ROOT}/outputs/TASK.md")        # type: ignore[index]
# code_interpreter = CodeInterpreterTool(unsafe_mode=True)   

# Define a conditional function for the conditional task
# If false, the task will be skipped, if true, then execute the task.
# def is_passing_score(output: TaskOutput) -> bool:
#     return output.pydantic.rubric.overall < 0.7  

@CrewBase
class TaskSmithCrew:
    """TaskSmith Crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def task_smith(self) -> Agent:
        return Agent(
            config=self.agents_config["task_smith"],  # type: ignore[index]
        )
    
    @agent
    def task_judge(self) -> Agent:
        return Agent(
            config=self.agents_config["task_judge"],  # type: ignore[index]
        )
    
    @task
    def generate_task(self) -> Task:
        return Task(
            config=self.tasks_config["generate_task"],  # type: ignore[index]
            output_pydantic=TaskGenerationOutput
        )
    
    @task
    def evaluate_task(self) -> Task:
        return Task(
            config=self.tasks_config["evaluate_task"],  # type: ignore[index]
            output_pydantic=EvaluateTaskReport
        )

    @crew
    def crew(self) -> Crew:
        """Creates the TaskSmith Crew"""

        return Crew(
            agents=self.agents,  
            tasks=self.tasks,    
            process=Process.sequential,
            verbose=True,
        )
