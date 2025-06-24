from pydantic import BaseModel
from typing import List

class GenerationPayload(BaseModel):
    projectSlug: str
    productOverview: str
    targetUsers: str
    techStack: List[str]
    successCriteria: str
