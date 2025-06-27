import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from apps.api.db.database import get_session
from apps.api.models.db import Project
from apps.api.models.schemas import ProjectCreate, ProjectRead
from apps.api.constants import STATIC_USER_ID

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/projects", response_model=ProjectRead)
def create_project(payload: ProjectCreate, session: Session = Depends(get_session)):
    slug = payload.slug.strip().lower()
    existing = session.exec(select(Project).where(Project.slug == slug)).first()
    if existing:
        logger.error("Project slug conflict: %s", slug)
        raise HTTPException(status_code=400, detail="Project already exists")

    project = Project(
        name=payload.name,
        slug=slug,
        user_id=payload.user_id or STATIC_USER_ID,
        extra_metadata={"description": payload.description} if payload.description else None,
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    logger.info("Created project %s with id %s", project.slug, project.id)
    return ProjectRead(
        id=project.id,
        name=project.name,
        slug=project.slug,
        description=payload.description,
        created_at=project.created_at,
    )


@router.get("/projects", response_model=list[ProjectRead])
def list_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project)).all()
    result = []
    for p in projects:
        description = None
        if p.extra_metadata:
            description = p.extra_metadata.get("description")
        result.append(
            ProjectRead(
                id=p.id,
                name=p.name,
                slug=p.slug,
                description=description,
                created_at=p.created_at,
            )
        )
    return result
