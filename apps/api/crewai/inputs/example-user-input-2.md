# Example Inputs #2

# Product Overview:
I am developing a new Databricks solution accelerator, called lake-forge. It involves using Databricks' new OLTP Postgres database (Lakebase), Next.js (UI/UX), Databricks Apps (hosting), Python FastAPI (backendAPI), and Databricks model serving endpoints. My idea is an interactive app, hosted and run entirely within Databricks, that can be used to create and manage ingestion of bronze datasets via a metadata framework. So basically a frontend UI will be available to the user where they can view the metadata of their tables and validation rules that might be applied to them, and update their configuration live within the UI without having to update any tables. This product will essentially allow users to use a prebuilt metadata framework, where they can plug and play their own templatized notebooks to this system, and get their ingestion and data products to market faster.


# Target Users:
Data engineers, non-technical business users, databricks developers

# Top 3 User Pain Points:
The biggest problem is needing to use many disparate systems to manage metadata driven ingestion in Databricks. Also the time consuming process of manually or programmatically updating metadata rules for data ingestion. 

# Core Features:
A clean interactive UI that shows details of table configs, data quality rules, table schedules, and costs per table/schema. The UI will feature an interactive table that users can edit, which will update the underlying postgres (lakebase) table on the backend. Users should be able to add and update new records for table configs, data quality rules, and table schedules. Interface should be modern and sleek, with design and aesthetics taken into heavy consideration.

# Tech Stack:
React, Next.js, FastAPI, Databricks Apps, Databricks Lakebase (Postgres)

# Constraints:
At the moment, Databricks apps, is not yet a first class citizen for databricks features. Databricks serverless compute has egress rules blocking Lakebase right now. We're pending a feature update that allows us to natively attach a Lakebase instance to a Databricks app. This feature has not yet rolled out to Azure East US databricks workspaces yet. Another constraint is that all tooling must exist within databricks. The point of this app is that it is a one stop shop for databricks users, so all tools and tech stack must be built natively to databricks. Potential cost and scaling issues.

# Stretch goals:
The ability to programmatically kickoff and create DLT jobs and pipelines from the UI, based on table configs, schedules and data quality rules. Cost and metrics per table/schema/user/group. AI suggestions on what columns may be suitable as a watermark key, etc.

# Tone / Branding Personality:
Professional and somewhat corporate, but having a modern and sleek aesthetic is very important. This app will be marketed to enterprise clients, from mid sized to large businesses. 

Project Creation Input:
{
  "name": "LakeForge",
  "description": "Metadata-driven ingestion, DLT orchestration & governance UI—completely native to the Databricks Lakehouse platform.",
  "tech_stack": "Next.js (App Router), React, FastAPI, Databricks Lakebase (PostgreSQL), Databricks Apps",
  "created_at": "2025-067-05T20:13:39.252Z"
}