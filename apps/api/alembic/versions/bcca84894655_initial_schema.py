"""initial schema for users, projects, documents, versions

Revision ID: bcca84894655
Revises: None
Create Date: 2024-06-26
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# ──────────────────────────────────────────────────────────────────────────────
# Alembic identifiers
# ──────────────────────────────────────────────────────────────────────────────
revision: str = "bcca84894655"
down_revision: str | None = None
branch_labels: str | None = None
depends_on: str | None = None


# ──────────────────────────────────────────────────────────────────────────────
# Upgrade
# ──────────────────────────────────────────────────────────────────────────────
def upgrade() -> None:
    """Create initial application schema."""
    # users --------------------------------------------------------------------
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(length=128), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    # projects -----------------------------------------------------------------
    op.create_table(
        "projects",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column(
            "extra_metadata",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("slug", name="uq_projects_slug"),
    )

    # documents ----------------------------------------------------------------
    op.create_table(
        "documents",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("project_id", sa.UUID(), sa.ForeignKey("projects.id")),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("latest_version_id", sa.UUID(), nullable=True),  # FK added later
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    # document_versions --------------------------------------------------------
    op.create_table(
        "document_versions",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column(
            "document_id", sa.UUID(), sa.ForeignKey("documents.id"), nullable=False
        ),
        sa.Column("content", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.UUID(), sa.ForeignKey("users.id")),
    )

    # indexes & deferred FKs ----------------------------------------------------
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)

    op.create_foreign_key(
        None,  # let Alembic autogenerate a name
        "documents",  # source table
        "document_versions",  # target table
        ["latest_version_id"],  # local cols
        ["id"],  # remote cols
    )


# ──────────────────────────────────────────────────────────────────────────────
# Downgrade
# ──────────────────────────────────────────────────────────────────────────────
def downgrade() -> None:
    """Drop all tables in the reverse order of creation."""
    op.drop_constraint(None, "documents", type_="foreignkey")
    op.drop_index("ix_projects_slug", table_name="projects")
    op.drop_index("ix_users_email", table_name="users")

    op.drop_table("document_versions")
    op.drop_table("documents")
    op.drop_table("projects")
    op.drop_table("users")