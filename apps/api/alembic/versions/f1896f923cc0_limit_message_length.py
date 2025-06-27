"""limit feedback message length to 1000

Revision ID: f1896f923cc0
Revises: 2aaae72b1743
Create Date: 2024-06-27
"""

from alembic import op
import sqlalchemy as sa

revision = "f1896f923cc0"
down_revision = "2aaae72b1743"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "feedback",
        "message",
        type_=sa.String(length=1000),
        existing_type=sa.Text(),
    )


def downgrade() -> None:
    op.alter_column(
        "feedback",
        "message",
        type_=sa.Text(),
        existing_type=sa.String(length=1000),
    )
