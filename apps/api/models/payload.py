from pydantic import BaseModel, Field, AliasChoices, ConfigDict
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

    model_config = ConfigDict(populate_by_name=True)


class ArchitecturePayload(BaseModel):
    projectSlug: str = Field(validation_alias=AliasChoices("projectSlug", "project"))

    model_config = ConfigDict(populate_by_name=True)
