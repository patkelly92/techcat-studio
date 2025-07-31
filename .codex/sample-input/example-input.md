# Example Inputs #1

# Product Overview:
I want to build an AI-native developer workspace designed to streamline, manage and automate the early and ongoing phases of building software powered by AI agents. It will be a web app that enables developers that work with OpenAI's Codex Agents to input information about their product and then generate codex optimized infrastructure files like (PRD, TASKS, AGENTS, etc.). These files will speed up the building of MVP software products by enhancing the context fed to Agent based software development tools.

# Target Users:
AI-native developers, Solo founders and indie hackers, Technical product teams, internal tools developers, Codex enthusiasts

# Top 3 User Pain Points:
Creating agent infrastructure files is a time consuming process, there isn't alot of standardization of templates that work well with codex agents yet

# Core Features:
Ability for the user to create and manage various projects, take in user input via a form and generate agent infrastructure files, export/download/edit generated files, github integration

# Tech Stack:
React, Next.JS, FastAPI, Postgres SQL, OpenAI

# Constraints:
Potential cost and scaling with utilization of OpenAI endpoints, must deploy to Azure

# Stretch goals:
Ability to integrate to user's github, user authentication, implementing a feedback form on the site which takes user feedback and automates the generation of an agent task to fix a bug or implement a suggestion.

# Tone / Branding Personality:
The tone of my brand doesn't take itself too seriously. Fun and not too corporate. 

Project Creation Input:
{
  "name": "TechCat Studio",
  "description": "TechCat Studio is an AI-native developer workspace designed to streamline and automate the early and ongoing phases of building software powered by AI agents. It enables developers to define project structure, generate and manage `.codex/` infrastructure files (PRD, TASKS, AGENTS, etc.), and convert user feedback into actionable work.",
  "tech_stack": "Next.js (App Router), React, Tailwind, ShadCN UI, FastAPI, PostgreSQL, Airtable",
  "created_at": "2025-06-23T20:13:39.252Z"
}

# Example Inputs #2

# Product Overview:
I want to build a web-based AI-powered data exploration tool called **"DataSage"**. It allows users to upload CSV or Excel files into a project workspace, then chat with an OpenAI-powered assistant to ask questions, generate insights, create visualizations, and even write transformation code or SQL. This tool turns raw tabular data into actionable answers without the need to code. The backend will convert user questions into structured prompts and execute them on the data behind the scenes.

# Target Users:
Data analysts and citizen data users, AI developers working with tabular data, startup founders with operational datasets, internal business teams, consultants analyzing client data

# Top 3 User Pain Points:
- Non-technical users can’t explore data without writing code
- LLM chat over tabular data is still clunky and not persistent across sessions
- File-based data (CSVs, Excel) still require wrangling before you can get insights

# Core Features:
- Upload CSV or Excel files into a workspace
- Chat interface to ask natural language questions (e.g., “What were the top 5 products by revenue last quarter?”)
- LLM-generated data summaries and visualizations (charts, tables, etc.)
- Auto-detect column types, handle nulls, suggest transformations
- Download/export analysis results (chat logs, generated charts, SQL)

# Tech Stack:
Next.js, React, FastAPI, Azure Blob Storage, Azure OpenAI, PostgreSQL for metadata/session tracking

# Constraints:
- OpenAI token usage must be monitored and optimized to avoid ballooning cost
- Needs to scale to moderately large files (~10MB+)
- Must be Azure-hosted to align with client and enterprise deployment scenarios

# Stretch goals:
- GPT-generated data cleaning pipelines (editable)
- Multi-user collaboration or file sharing
- Chat agents with memory that retain context across datasets
- Plugin system to allow for external data connectors (e.g., Airtable, Google Sheets)

# Tone / Branding Personality:
Friendly, trustworthy, and a little magical — like a data wizard in your browser. Emphasize productivity + empowerment. Modern UX with subtle “AI co-pilot” vibes. Light, minimal, approachable.