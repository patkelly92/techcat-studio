"""add feedback table

Revision ID: 2aaae72b1743
Revises: bcca84894655
Create Date: 2024-06-27
"""

from alembic import op
import sqlalchemy as sa

# Alembic identifiers
revision = "2aaae72b1743"
down_revision = "bcca84894655"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "feedback",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("project_id", sa.UUID(), sa.ForeignKey("projects.id"), nullable=True),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("feedback")
