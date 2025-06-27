from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

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
    
    @task
    def generate_prd(self) -> Task:
        return Task(
            config=self.tasks_config["generate_prd"],  # type: ignore[index]
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
