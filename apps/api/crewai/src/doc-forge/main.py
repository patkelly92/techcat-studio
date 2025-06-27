#!/usr/bin/env python
from random import randint
from pydantic import BaseModel
from crewai.flow import Flow, listen, start
from crews.docforge_crew.docforge_crew import DocForgeCrew
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path
# ── crewai and project root (three and 6 levels up from this file, respectively) ──
CREWAI_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[5]

# TEST CODE TO LOAD PRD TEMPLATE & USER INPUTS
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
# f"{PROJECT_ROOT}/.codex/templates/prd-template.md"

# # import tools
# from crewai_tools import (
#     DirectoryReadTool,                                         # Facilitates reading and processing of directory structures and their contents.
#     FileReadTool,                                              # Enables reading and extracting data from files, supporting various file formats.
#     FileWriterTool,                                            # Designed to write content to files
#     CodeInterpreterTool                                        # A tool for interpreting python code.
#     )


# # Instantiate Tools
# directory_read_tool = DirectoryReadTool(directory='./')
# schema_read_tool = FileReadTool(file_path='inputs/compliance_document_json_schema.json') 
# content_read_tool = FileReadTool(file_path='inputs/2023-01077-content.xml') 
# content_mapped_read_tool = FileReadTool(file_path='inputs/2023-01077-mapped.json') 
# file_writer_tool = FileWriterTool(filename='2023-01077-content.json', directory='outputs')        # type: ignore[index]
# code_interpreter = CodeInterpreterTool(unsafe_mode=True)   


class DocForgeState(BaseModel):
    prd_template: str = PRD_TEMPLATE
    user_inputs: str = USER_INPUTS
    prd: str = ""
    sentence_count: int = 0


class DocForgeFlow(Flow[DocForgeState]):

    @start()
    def generate_sentence_count(self):
        print("Generating sentence count")
        self.state.sentence_count = randint(1, 5)

    @listen(generate_sentence_count)
    def generate_prd(self):
        print("Generating PRD")
        result = (
            DocForgeCrew()
            .crew()
            .kickoff(inputs={"prd_template": self.state.prd_template, "user_inputs": self.state.user_inputs})
        )

        print("PRD generated", result.raw)
        self.state.prd = result.raw

    @listen(generate_prd)
    def save_prd(self):
        print("Saving PRD")
        with open(f"{CREWAI_ROOT}/outputs/doc-forge-prd.md", "w") as f:
            f.write(self.state.prd)


def kickoff():
    docforge_flow = DocForgeFlow()
    docforge_flow.kickoff()


def plot():
    docforge_flow = DocForgeFlow()
    docforge_flow.plot()


if __name__ == "__main__":
    kickoff()
