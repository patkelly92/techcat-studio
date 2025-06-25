# Architecture Document Template

This template guides the `doc_writer` agent in producing a comprehensive architecture document from upstream information such as the PRD. Expand on sparse details, infer reasonable structures, and write clearly for developers and technical stakeholders.

Respond in markdown format using the following structure:

---

## 🧱 System Overview

Describe the overarching architecture, highlighting the main components, frameworks, and how they integrate. Fill gaps in the source material with plausible implementation notes.

---

## 📦 Directory Structure (Simplified)

Provide a concise directory tree that outlines key folders and files. Use code block formatting and include brief comments to explain each item.

---

## 🧱 Codex Infrastructure Files Explained

List and explain the purpose of each file within the `.codex/` directory so developers understand how the agent system is organized.

---

## 🤖 Agent I/O Conventions

Clarify how agents exchange information using markdown. Mention formatting rules, metadata expectations, and give an example entry for `TASK-LOG.md`.

### Key Conventions

Summarize required output format, single-file targeting, and the need for agent/date/summary metadata.

### Example: `TASK-LOG.md`

Show a short sample of how a task entry should look in the log.

---

## 🧠 Agent Orchestration Principles

Explain the philosophy behind chaining agents, referencing the use of `task_logger` for recording outcomes. Emphasize stateless operation and reliance on the task log for context.

---

## 💃 Storage & Data Flows

### Markdown-First Architecture

Describe the preference for local markdown files and how they serve as the primary source of truth.

### Storage Evolution

Outline potential stages of storage, from simple setups like Airtable or flat files to more advanced databases or sync mechanisms.

---

## 📡 APIs & External Services

### Used APIs

Identify any APIs or third-party services integrated with the system, such as LLM providers or feedback collectors.

### Optional Backend

Note optional backend components that can enhance orchestration or data persistence.

---

## 🖥 Frontend Technology Stack

Present a table summarizing the frontend tools and what they contribute to the project.

---

## 🔄 File Generation Lifecycle

Illustrate the typical flow from initiating a document request to saving the output. Use a mermaid diagram to convey the sequence of steps.

---

## ✅ Best Practices

Bullet out key principles for maintaining clarity and reliability across agent tasks and documentation.

---

## 🚧 Future Engineering Notes

Conclude with forward-looking considerations or improvements that could refine the architecture over time.

---

Keep your tone confident and polished so the resulting document is ready to share with collaborators.
