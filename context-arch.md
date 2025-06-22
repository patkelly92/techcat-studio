# Architecture Document

This file outlines the technical architecture, schema conventions, input/output formats, and best practices for the TechCat Studio project.

---

## 🧱 System Overview

TechCat Studio is a modular, agent-augmented developer tool that generates and evolves project infrastructure files in the `.codex/` directory. It combines a Next.js frontend, optional FastAPI backend, OpenAI, and markdown-based versioning to streamline AI-native software development workflows, with heavy support for support for OpenAI Codex-based agents.

---

## 📦 Directory Structure (simplified)

```
root/
├── .codex/
│   ├── AGENTS.md
│   ├── PRD.md
│   ├── TASK-LOG.md
│   ├── PROPOSED-TASKS.md
│   ├── ARCHITECTURE.md
│   └── prompts/...
├── techcat-studio/    # Next.js App
├── README.md
└── .git/
```

---

## 🧱 Codex Infrastructure Files Explained

- `AGENTS.md` = team directory + persona intent
- `PRD.md` = product vision + scope
- `TASK-LOG.md` = execution memory
- `PROPOSED-TASKS.md` = planning cache
- `ARCHITECTURE.md` = technical spec for agent grounding and validation

## 🤩 Agent I/O Conventions

All agents work with markdown-based I/O, adhering to clearly scoped responsibilities and a consistent prompt design pattern. Outputs must be:

- Deterministic (where possible)
- Markdown formatted
- Appended to or overwrite specific `.codex/` files
- Accompanied by metadata when relevant (e.g., timestamps, agent name)

### Example Output Format: `TASK-LOG.md`

```markdown
### Task Completed

**Agent:** frontend_specialist  
**Date:** 2025-06-22  
**Summary:** Added reusable button component with Tailwind styling  
**Output Files:** [`/components/ui/Button.tsx`, `/components/ui/Form.tsx`]
```

---

## 🧠 Agent Orchestration Principles

- Agents are *stateless* across sessions but rely on markdown history (e.g., `TASK-LOG.md`) for inferred memory
- Prompts are modular and scoped to one clear task
- Output handoff is encouraged: `Once complete, invoke task_logger`
- Validation agents may be used later to refine structure

---

## 💃 Storage & Data Flows

### Markdown-first Design

- All output is stored as human-readable `.md` files
- These files serve as both *source of truth* and *LLM context documents*
- No database storage required for MVP (Airtable is used only for feedback)

### Planned Storage Evolution

| Stage    | Mechanism                                                    |
| -------- | ------------------------------------------------------------ |
| MVP      | Local markdown, Airtable (feedback)                          |
| Post-MVP | PostgreSQL (feedback + metadata), GitHub sync for versioning |

---

## 📡 API & Services

### External APIs Used

- `OpenAI` / `Codex`: Prompt execution for agents
- `Airtable API`: Feedback submission endpoint

### Backend (Pluggable)

- Optional FastAPI app to serve local API endpoints (e.g., trigger doc generation, feedback processing)

---

## 🕠 Frontend Technology Stack

| Tool                 | Purpose                         |
| -------------------- | ------------------------------- |
| Next.js (App Router) | SPA + routing + SSR             |
| React                | UI component logic              |
| Tailwind CSS         | Design system + utility classes |
| Markdown-to-React    | File preview rendering          |
| ShadCN UI            | Optional component library      |

---

## 🔄 File Generation Lifecycle

1. **User submits intent via UI**
2. `spec_interpreter` parses goal → structured prompt
3. Codex agent (e.g. `doc_writer`, `frontend_specialist`) is invoked
4. Output is:
   - Rendered in UI
   - Written to appropriate `.codex/` file
   - Logged in `TASK-LOG.md` via `task_logger`

---

## ✅ Best Practices

- Agent tasks should be small and scoped to a single narrowly defined task with clear success criteria
- Write deterministic and isolated prompts per agent
- Keep files human-readable and Codex-readable
- Prefer markdown sections over JSON blobs
- Document prompt templates in `/prompts/` directory
- Use `AGENTS.md` to clarify all agent behaviors
- Every output-producing agent should optionally trigger the `task_logger`

---

## 🚧 Future Engineering Notes

- Add support for `.codex/.meta.json` to include per-project metadata
- Add Codex-aware validation agent to scan `.md` files for gaps
- Add file hashing or git integration to support change tracking

