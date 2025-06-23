from pydantic import BaseModel
from typing import List

class GenerationPayload(BaseModel):
    projectSlug: str
    overview: str
    intendedUsers: str
    techStack: List[str]
    successCriteria: str
