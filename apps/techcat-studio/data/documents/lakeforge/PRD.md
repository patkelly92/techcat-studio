# Product Requirements Document Template

## Project Name
`LakeForge`

---

## 🧭 Product Overview
`LakeForge` is a cutting-edge, UI-based metadata-driven ingestion and orchestration framework designed specifically for the Databricks Lakehouse environment. It empowers data teams to seamlessly manage complex data ingestion processes by abstracting the intricacies of pipeline creation and execution. Users simply define their data ingestion requirements—such as source systems, paths, schemas, and schedules—and `LakeForge` automates the generation and execution of robust data pipelines. These pipelines efficiently move data through the stages of Source, Raw, Bronze, Silver, and Gold, ensuring a streamlined and auditable data flow. The intuitive web UI facilitates the registration of data sources, configuration authoring, run monitoring, and data-quality rule review. By materializing deterministic jobs, Delta Live Tables pipelines, and comprehensive logging tables, `LakeForge` guarantees reproducibility and auditability for every data batch processed.

---

## Core Objectives
1. **Simplify Data Ingestion**: Enable teams to easily define and manage data ingestion processes without deep technical expertise in pipeline orchestration.
2. **Enhance Data Pipeline Automation**: Automatically generate and execute data pipelines, reducing manual intervention and potential for human error.
3. **Ensure Data Quality and Auditability**: Provide robust data-quality rules and logging mechanisms to ensure data integrity and traceability.
4. **Optimize Resource Utilization**: Standardize compute profiles and scheduling to efficiently manage resources and control costs.
5. **Facilitate User-Friendly Interaction**: Offer a clean, minimalistic UI that enhances user experience and productivity.

---

## 🧑‍🎯 Target Users
`LakeForge` is tailored for data engineers, data scientists, and data analysts who operate within the Databricks ecosystem. These users typically face challenges in managing large-scale data ingestion and orchestration tasks. They require a solution that simplifies the complexity of pipeline management, ensures data quality, and provides comprehensive observability. The product is also suitable for any professional involved in data management and ingestion activities who seeks to leverage the power of the Databricks Lakehouse.

---

## 🧩 Core Features (MVP)
- **Declarative Metadata Tables**: Utilize `raw_config`, `bronze_config`, and other tables stored in Lakebase Postgres to define ingestion parameters.
- **Intuitive UI**: Built with Next.js and Tailwind CSS, the UI supports CRUD operations for sources, groups, schedules, and data-quality rules.
- **Automated Pipeline Generation**: Automatically create Databricks Jobs and Delta Live Tables pipelines with idempotent synchronization logic.
- **Pluggable Notebooks**: Source-to-Raw and Raw-to-Bronze notebooks with customizable extractors and writers.
- **Comprehensive Logging**: Implement a built-in logging schema for full data lineage and observability, covering batch, zone, table, step, and data-quality runs.
- **Standardized Compute Profiles**: Abstract compute profiles to standardize cluster specifications and libraries.
- **Efficient Scheduling**: Use Quartz-cron scheduling via a single `SyncJobs` notebook to automate job execution without manual intervention.

---

## 🔧 Tech Stack

| Component         | Technology                        |
|-------------------|-----------------------------------|
| Front-end         | Next.js (+ React), Tailwind CSS v4|
| Back-end          | FastAPI                           |
| Orchestration     | Databricks Workflows & DLT        |
| Metadata Storage  | Lakebase (Databricks Postgres)    |

---

## 💡 Stretch Goals (Post-MVP)
- **Synthetic Data Generator**: Develop a tool to generate synthetic data for populating development environments and testing incremental loads.
- **Automated DQ-Rule Recommendations**: Implement machine learning algorithms to suggest data-quality rules based on historical data patterns.

---

## ✅ Success Criteria
- **User Adoption**: Achieve a 70% adoption rate among target users within the first six months post-launch.
- **Pipeline Efficiency**: Reduce manual pipeline management efforts by 50% through automation.
- **Data Quality Improvement**: Enhance data quality metrics by 30% through robust rule implementation and monitoring.
- **Cost Management**: Maintain operational costs within budget by optimizing resource utilization and defaulting to single-node clusters.

---

## 🪵 Known Constraints
- **Platform Dependency**: `LakeForge` must operate entirely within the Databricks platform, leveraging both Lakehouse and Lakebase.
- **Cost Control**: Default to single-node clusters to manage and control operational costs effectively.

---

This document outlines a strategic vision for `LakeForge`, ensuring it meets the needs of its users while aligning with the capabilities of the Databricks ecosystem.