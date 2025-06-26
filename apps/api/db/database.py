from __future__ import annotations
import os
from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./techcat.db")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, class_=Session, autocommit=False, autoflush=False)


def init_db() -> None:
    """Create database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    """Yield a SQLModel session."""
    with SessionLocal() as session:
        yield session
