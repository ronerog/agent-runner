# Agent Runner — Autonomous Development Agent

**Agent Runner** is an agentic execution engine that transforms requirements into functional software, operating as a full engineering team — and learning empirically from every project it builds.

Works with **any AI-powered IDE** and **any language model**.
Supports **new projects** (full RALPH LOOP), **existing systems** (INJECT mode), and **data science / biostatistics** projects (Python + R).

---

## How It Works — RALPH LOOP

```
PLAN (1x) → [EXECUTE(type-routing) → VERIFY → LEARN] × N tasks → FINAL VALIDATION → LEARN GLOBAL
```

The agent plans once, then executes task by task in a loop with an **Orchestrator** layer that routes each task to the correct role pipeline — learning with every cycle. Accumulated knowledge persists in `workspace/memory/agent-brain.md` and improves every subsequent project.

### The Orchestration Layer

A central `orchestrator.md` owns the state machine, routes tasks by type, injects minimal context per role, and enforces a formal escalation matrix. Each role produces explicit handoff signals — no implicit chaining, no improvised escalation.

| Role | Responsibility | Output Signal |
|------|---------------|--------------|
| Analyst | Transforms ideas into PRDs, deduces implicit features | `PRD_READY` |
| Architect | Chooses the right stack, models data, defines structure | `ARCH_READY` |
| **Data Scientist** | Statistical methodology, EDA, model validation, reproducibility gate | `DS_READY` / `DS_PASS` |
| Designer | Design System, palette, layouts — produces `workspace/design-system.md` | `DESIGN_READY` |
| Developer | Implements with full autonomy, reads Design System before every UI task | `IMPL_READY` |
| QA | Technical gate after each task — never advances with failures | `QA_PASS / QA_FAIL` |
| Visual Validator | Visual compliance check — ensures UI matches Design System and PRD | `VV_PASS / VV_FAIL` |
| Learner | Extracts patterns, updates the agent's memory (silent if nothing new) | `LEARNED` |
| Manager | Consolidates context proactively before quality degrades (> 40 exchanges) | `SNAPSHOT_READY` |

### Three Operating Modes

| Mode | Command | When to Use |
|------|---------|-------------|
| **RALPH LOOP** | `/agent-runner <description>` | Build a new project from scratch |
| **INJECT** | `/inject <path> — <tasks>` | Add features to an existing project |
| **RESUME** | `continue` | Resume a previous session from snapshot |

**INJECT mode**: the agent first audits the existing system (README, structure, stack, conventions), then creates a targeted `prd.json` with only the requested tasks, and executes them following the existing project's patterns — without replanning or touching unrelated code.

### Task-Type Routing

Every task in `prd.json` has a `type` field that determines which role pipeline runs:

**Web / Backend tasks:**

| `type` | Pipeline | Notes |
|--------|----------|-------|
| `setup` | Dev → commit | Scaffold, package setup |
| `config` / `schema` | Dev → QA(check) → commit | Config files, DB models |
| `backend` | Dev → QA(check+lint) → commit | Services, APIs, business logic |
| `ui-setup` / `ui-component` / `ui-screen` | Dev → QA → Visual Validator → commit | Full visual gate |
| `integration` | Dev → QA(check+test) → commit | External APIs, payments, email |
| `test` | QA → commit | QA-led, test suite |
| `docs` | Dev(light) → commit | No gates |

**Data Science / Analytics tasks:**

| `type` | Pipeline | Notes |
|--------|----------|-------|
| `notebook` | Dev + DS(validate) → QA(check) → commit | Jupyter / Quarto / R Markdown |
| `pipeline` | Dev → QA(check+test) → commit | ETL, data ingestion, transformation |
| `viz` | Dev + DS(validate) → QA(check) → commit | matplotlib, ggplot2, plotly |
| `model` | Dev + DS(validate) → QA(check+test) → commit | Statistical or ML model with DS gate |
| `report` | Dev + DS(validate) → QA(check) → commit | Quarto render, PDF export |
| `r-script` | Dev → QA(check+lint) → commit | Standalone R script |
| `r-shiny` | Dev → QA → Visual Validator → commit | Interactive Shiny app |

The **DS gate** (Data Scientist validation) runs before QA for data tasks: validates statistical methodology, model assumptions, effect sizes, and reproducibility. `DS_PASS` is required to proceed.

### Quality Gates

1. **Technical gate** — `check_cmd` must pass before any task is marked complete
2. **Statistical gate** — Data Scientist validates methodology for `notebook`, `viz`, `model`, `report` tasks
3. **Visual gate** — `visual_check_cmd` + Visual Validator checklist (UI tasks only)
4. **PRD Compliance checkpoint** — every 3 UI tasks, cross-check against the full PRD
5. **Escalation Matrix** — after 3 failures, the Orchestrator routes to the correct role (not improvised)
6. **Final Integrated Validation** — full technical + statistical + visual sweep before project is declared complete

---

## Data Science & Biostatistics

The agent includes a dedicated **Data Scientist role** that handles:

- **EDA** (Exploratory Data Analysis) — shape, dtypes, missing data, outliers, distributions, correlations
- **Statistical test selection** — t-test, Mann-Whitney, ANOVA, Kruskal-Wallis, Chi-square, Fisher, Pearson, Spearman, survival analysis, mixed effects models
- **Assumption checking** — normality (Shapiro-Wilk), homoscedasticity (Levene), sample size / power
- **Result reporting** — always: test statistic + exact p-value + effect size (Cohen's d, η², HR, OR) + 95% CI + n per group
- **Multiple comparisons correction** — Bonferroni or Benjamini-Hochberg (FDR)
- **Biostatistics patterns** — Kaplan-Meier, Cox proportional hazards, lme4 mixed effects, meta-analysis
- **Reproducibility** — seeds, immutable raw data, `renv`/`pip freeze`, `sessionInfo()`, Quarto echo

**Python stack:** pandas, polars, NumPy, scikit-learn, statsmodels, lifelines, matplotlib, seaborn, Jupyter, papermill

**R stack:** tidyverse, ggplot2, survival, survminer, lme4, lmerTest, tableone, mice, targets, renv, Quarto

### Using Agent Runner in RStudio

Three options — from easiest to most integrated:

1. **GitHub Copilot** (built-in since RStudio 2023.09): *Tools → Global Options → Copilot → Enable*. Then use the Copilot chat panel normally.

2. **Claude Code CLI via Terminal panel**: Open RStudio's Terminal tab and run:
   ```bash
   claude "$(bash agent/scripts/start-r.sh 'Analyze clinical trial survival data')"
   ```

3. **Positron IDE** (new Posit IDE, VS Code-based): supports Cline, Continue, and other AI extensions with full Claude integration.

See `agent/scripts/rstudio-setup.md` for detailed setup instructions.

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
| **RStudio** | Terminal panel | — | `bash agent/scripts/start-r.sh` |
| **Any IDE** | `agent/prompts/instructions.md` | — | Paste the content into chat |
| **Terminal** | `agent/scripts/start.sh` | — | See below |

The `/inject` command is available in all IDEs that support slash commands (Windsurf, Cursor, Claude Code, RooCode, Gemini CLI).

---

## How to Use

### In IDEs (Windsurf, Cursor, Claude Code, etc.)

Open the repository in your IDE and use the command:

```
/agent-runner Build a [describe your project]
```

To add features to an existing project:
```
/inject apps/my-project — add user authentication with JWT and a profile settings page
```

To resume a previous session:
```
continue
```

### In the Terminal

`start.sh` generates the bootstrap prompt and can be piped into any AI CLI:

```bash
# Claude Code CLI
claude "$(bash agent/scripts/start.sh 'Build a medical scheduling SaaS')"

# Aider
aider --message "$(bash agent/scripts/start.sh 'Build a medical scheduling SaaS')"

# Gemini CLI
gemini "$(bash agent/scripts/start.sh 'Build a medical scheduling SaaS')"

# R / RStudio projects
bash agent/scripts/start-r.sh 'Analyze survival data from clinical trial'

# Resume a previous session
claude "$(bash agent/scripts/start.sh)"
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
├── .claude/commands/          # /agent-runner + /inject slash commands (Claude Code)
├── .cursor/rules/             # Context rules for Cursor
├── .cursor/commands/          # /agent-runner + /inject slash commands (Cursor)
├── .gemini/commands/          # /agent_runner + /inject slash commands (Gemini CLI)
├── .roo/commands/             # /agent-runner + /inject custom commands (RooCode)
├── .windsurf/workflows/       # /agent-runner + /inject slash commands (Windsurf)
├── .agents/workflows/         # Generic agent workflow
├── .github/copilot-instructions.md  # Bootstrap for GitHub Copilot
│
├── agent/
│   ├── roles/                 # 9 team roles — each with explicit I/O contracts and output signals
│   │   ├── analyst.md         # PRD creation, feature deduction
│   │   ├── architect.md       # Stack selection, data modeling, folder structure
│   │   ├── data-scientist.md  # Statistical methodology, DS gate for data tasks
│   │   ├── designer.md        # Design System, CSS vars, component specs
│   │   ├── dev.md             # Implementation (polyglot, full autonomy)
│   │   ├── qa.md              # Technical gate, test runner, security checklist
│   │   ├── visual-validator.md # Visual compliance gate for UI tasks
│   │   ├── manager.md         # Context snapshot when quality degrades
│   │   └── learner.md         # Extracts patterns → agent-brain.md
│   ├── prompts/               # RALPH LOOP: orchestrator, instructions, plan, execute, learn, resume, inject
│   └── scripts/               # start.sh, start-r.sh, agent_run.sh, git_commit.sh, run_checks.sh
│                              # rstudio-setup.md — RStudio integration guide
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

**JavaScript / TypeScript** — Next.js 15 (App Router), React, Node.js, NestJS, Bun
**Python** — Django, FastAPI, Flask, pandas, polars, scikit-learn, Streamlit, Jupyter, lifelines
**R** — tidyverse, ggplot2, Shiny, Quarto, survival, lme4, targets, renv (biostatistics & data science)
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
- **Runtime for the chosen stack** (Python, Go, Rust, R, etc. — as needed per project)
- **R 4.1+** and **renv** (for R projects)
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
- **For data science projects: review the statistical methodology.** The agent follows best practices, but domain knowledge and data context matter — a biostatistician should review clinical analyses.
- **Check the installed dependencies.** The agent tries to use well-known and safe packages, but the final responsibility for auditing what goes into your project is yours.
- **Keep backups of your data.** Before any project that interacts with real data, make a backup.
- **Do not use in critical systems without technical supervision** (healthcare, legal, financial, infrastructure).

Agent Runner has built-in security practices (no hardcoded secrets, password hashing, input validation, etc.), but no automated tool replaces human review. Use it with curiosity, learn from the process, and always question what was generated.

**Have fun building — just don't forget to look at what's being built.**
