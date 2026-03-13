# Agent Runner — Autonomous Development Agent

**Agent Runner** is an agentic execution engine that transforms requirements into functional software, operating as a full engineering team — and learning empirically from every project it builds.

Works with **any AI-powered IDE** and **any language model**.

---

## How It Works — RALPH LOOP

```
PLAN (1x) → [EXECUTE → VERIFY (technical + visual) → LEARN] × N tasks → FINAL VALIDATION → LEARN GLOBAL
```

The agent plans once, then executes task by task in a loop, learning with every cycle. Accumulated knowledge persists in `workspace/memory/agent-brain.md` and improves every subsequent project.

| Role | Responsibility |
|------|---------------|
| Analyst | Transforms ideas into PRDs, deduces implicit features |
| Architect | Chooses the right stack, models data, defines structure |
| Designer | Design System, palette, layouts — produces `workspace/design-system.md` |
| Developer | Implements with full autonomy; reads Design System before every UI task |
| QA | Technical validation after each task — never advances with failures |
| Visual Validator | Visual compliance check — ensures UI matches Design System and PRD |
| Learner | Extracts patterns, updates the agent's memory |
| Manager | Consolidates context when the session window saturates |

### Quality Gates (for UI projects)

The agent now enforces three quality layers for any project with a visual interface:

1. **Per-task technical gate** — `check_cmd` must pass before any task is marked complete
2. **Per-task visual gate** — `visual_check_cmd` verifies CSS variables are applied; Visual Validator checks Design System compliance
3. **PRD Compliance checkpoint** — every 3 UI tasks, a cross-check against the full PRD
4. **Final Integrated Validation** — before the project is declared complete, a full sweep of both technical and visual quality

---

## Compatibility

| IDE / Tool | Config file | Native invocation | How |
|-----------|-------------|-------------------|-----|
| **Windsurf** | `.windsurf/workflows/agent-runner.md` | `/agent-runner` | Native slash command via Workflows |
| **Cursor** | `.cursor/rules/agent-runner.mdc` + `.cursor/commands/agent-runner.md` | `/agent-runner` | Commands directory (type `/` in chat) |
| **Claude Code** | `CLAUDE.md` + `.claude/commands/agent-runner.md` | `/agent-runner` | Native slash command |
| **Gemini CLI** | `GEMINI.md` + `.gemini/commands/agent-runner.toml` | `/agent_runner` | Custom slash command via TOML |
| **Cline** | `.clinerules` | — | Context injected automatically |
| **RooCode** | `.clinerules` + `.roo/commands/agent-runner.md` | `/agent-runner` | Custom commands directory |
| **GitHub Copilot** | `.github/copilot-instructions.md` | — | Context injected automatically (no custom slash commands) |
| **Zed** | `CLAUDE.md` (auto-detected) | — | Context via rules file |
| **Any IDE** | `agent/prompts/instructions.md` | — | Paste the content into chat |
| **Terminal** | `agent/scripts/start.sh` | — | See below |

---

## How to Use

### In IDEs (Windsurf, Cursor, Claude Code, etc.)

Open the repository in your IDE and use the command:

```
/agent-runner: Build a [describe your project]
```

To resume a previous session:
```
continue
```

### In the Terminal

`start.sh` generates the bootstrap prompt and can be piped into any AI CLI:

```bash
# Claude Code CLI
claude "$(./agent/scripts/start.sh 'Build a medical scheduling SaaS')"

# Aider
aider --message "$(./agent/scripts/start.sh 'Build a medical scheduling SaaS')"

# Gemini CLI
gemini "$(./agent/scripts/start.sh 'Build a medical scheduling SaaS')"

# Resume a previous session
claude "$(./agent/scripts/start.sh)"
```

Or run directly if prd.json already exists:
```bash
bash agent/scripts/agent_run.sh
```

### In any IDE without workflow support

Paste the contents of `agent/prompts/instructions.md` at the start of the conversation, followed by:
```
Project: [describe what you want to build]
```

---

## Structure

```
agent-runner/
├── CLAUDE.md                  # Bootstrap for Claude Code + Zed
├── GEMINI.md                  # Bootstrap for Gemini CLI
├── .clinerules                # Bootstrap for Cline/RooCode
├── .claude/commands/          # /agent-runner slash command (Claude Code)
├── .cursor/rules/             # Context rules for Cursor
├── .cursor/commands/          # /agent-runner slash command (Cursor)
├── .gemini/commands/          # /agent_runner slash command (Gemini CLI)
├── .roo/commands/             # /agent-runner custom command (RooCode)
├── .windsurf/workflows/       # /agent-runner slash command (Windsurf)
├── .agents/workflows/         # Generic agent workflow
├── .github/copilot-instructions.md  # Bootstrap for GitHub Copilot
│
├── agent/
│   ├── roles/                 # The 8 team roles (incl. visual-validator)
│   ├── prompts/               # RALPH LOOP: instructions, plan, execute, learn, resume
│   └── scripts/               # start.sh (terminal), agent_run.sh, git_commit.sh, run_checks.sh
│
├── apps/                      # Generated projects (monorepo)
│
└── workspace/
    ├── memory/
    │   ├── agent-brain.md     # Agent's cross-project memory (grows with use)
    │   ├── global.md          # Global environment rules
    │   └── snapshots/         # Previous session state
    ├── requirements/          # Detailed requirements per project
    ├── design-system.md       # Visual contract: CSS vars, palette, components (UI projects)
    └── PRD.md                 # Current project PRD
```

---

## Supported Stacks

The Architect chooses the ideal stack for each project. The agent is fluent in any language:

**JavaScript / TypeScript** — Next.js, React, Node.js, NestJS, Bun
**Python** — Django, FastAPI, Flask
**Go** — Chi, Gin, GORM
**Rust** — Axum, Actix
**Ruby** — Rails, Sinatra
**Java / Kotlin** — Spring Boot
**PHP** — Laravel
**C#** — ASP.NET Core
**Mobile** — React Native, Flutter

---

## Requirements

- **Node.js 18+** and **Yarn** (for JS/TS projects)
- **Runtime for the chosen stack** (Python, Go, Rust, etc. — as needed per project)
- **jq** (optional — used by `run_checks.sh` to read `prd.json`)
- **Git**

---

## Contributing

As you use Agent Runner, it accumulates wisdom in `workspace/memory/agent-brain.md`. Share that knowledge back — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

**GNU AGPLv3** — Improvements stay open. Collective evolution.

Copyright (c) 2026 ronerog

---

## Important Notice — Please Read Before Using

Agent Runner is a **learning and experimentation tool**. It was built to help people learn and build projects with AI assistance, but it operates autonomously — which means you, the user, are responsible for supervising everything it does.

**You are the engineer.** The AI is your assistant, not the other way around.

A few things you should always do:

- **Review the generated code** before pushing to production. The agent can make mistakes, use outdated approaches, or misinterpret requirements.
- **Never deploy to production without review.** Especially database operations — migrations, deletions, and resets can be irreversible.
- **Check the installed dependencies.** The agent tries to use well-known and safe packages, but the final responsibility for auditing what goes into your project is yours.
- **Keep backups of your data.** Before any project that interacts with real data, make a backup.
- **Do not use in critical systems without technical supervision** (healthcare, legal, financial, infrastructure).

Agent Runner has built-in security practices (no hardcoded secrets, password hashing, input validation, etc.), but no automated tool replaces human review. Use it with curiosity, learn from the process, and always question what was generated.

**Have fun building — just don't forget to look at what's being built.** 🙂
