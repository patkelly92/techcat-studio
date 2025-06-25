from pydantic import BaseModel
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
