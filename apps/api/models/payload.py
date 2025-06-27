from pydantic import BaseModel, Field
from typing import List, Optional

class GenerationPayload(BaseModel):
    projectSlug: str
    productOverview: str
    targetUsers: Optional[str] = None
    userPainPoints: Optional[str] = None
    coreFeatures: Optional[str] = None
    techStack: List[str]
    constraints: Optional[str] = None
    stretchGoals: Optional[str] = None
    tone: Optional[str] = None

    model_config = {
        "populate_by_name": True
    }


class ArchitecturePayload(BaseModel):
    projectSlug: str = Field(alias="project")

    model_config = {
        "populate_by_name": True
    }


class AgentsPayload(BaseModel):
    slug: str = Field(alias="project")

    model_config = {
        "populate_by_name": True
    }
