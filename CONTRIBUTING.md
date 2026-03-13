# Contributing to Agent Runner 🧠

Welcome! Agent Runner is a **Collective Organism** — the more people use it and share what the agent learned, the smarter it gets for everyone.

There are two ways to contribute: sharing **Wisdom** (the most valuable) or improving the **Engine**.

---

## 🧠 1. Sharing Wisdom (Agent Brain)

### What is the Agent Brain?

When you use Agent Runner to build a project, the agent learns empirically: errors it encountered, patterns that worked, stack configurations that caused problems, architectural decisions that proved correct.

All of this is recorded in **`workspace/memory/agent-brain.md`** — the agent's accumulated memory.

This file **is already tracked by git** in your repository. Contributing wisdom is essentially opening a PR with what the agent learned during your use.

### What is worth contributing?

Valuable contributions to `agent-brain.md` include:

- **Resolved stack errors**: "In Next.js 15 with App Router, Server Actions cannot return `undefined` directly — use `null`"
- **Installation patterns**: "Django + Channels requires `daphne` as the ASGI server, not the default server"
- **Discovered anti-patterns**: "Never use `prisma.$executeRaw` in loops — causes N+1 queries"
- **Critical configurations**: "Go modules with workspaces (`go.work`) resolve version conflicts in monorepos"
- **Sequences that work**: "In FastAPI, always initialize the database before routers in `lifespan`"

### How to contribute

**Step 1 — Use Agent Runner on a project**
```bash
# In your project, via IDE (Windsurf, Cursor, etc.):
/agent-runner: Build a [your project]
```

**Step 2 — See what the agent learned**

After completing the project, the `workspace/memory/agent-brain.md` file will have been automatically updated by the Learner role. Review the new entries — especially in the "Learned Patterns" and "Known Anti-Patterns" sections.

**Step 3 — Fork and open a PR**

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/agent-runner.git
cd agent-runner
git checkout -b brain/[stack-or-topic]
```

**Step 4 — Copy the relevant entries**

Open your local `workspace/memory/agent-brain.md` and copy the new entries into the `workspace/memory/agent-brain.md` of the forked repository.

Use the standard format:

```markdown
### [Category]: [Learning Title]
- **Problem**: What happened
- **Root cause**: Why it happened
- **Solution**: What solved the problem
- **Rule**: "Always [do X]" or "Never [do Y]"
- **Project**: [project type — no need for the real name] | **Date**: [YYYY-MM-DD]
```

Accepted categories: `Next.js`, `Python`, `Django`, `FastAPI`, `Go`, `Rust`, `Ruby/Rails`, `Prisma`, `TypeScript`, `Auth`, `Deploy`, `Planning`, `QA`, `Architecture`, `Docker`, `Database`.

**Step 5 — Open the Pull Request**

```bash
git add workspace/memory/agent-brain.md
git commit -m "brain: add [category] learnings from [project type]"
git push origin brain/[stack-or-topic]
```

Open the PR with the title: `brain: [what was learned in a few words]`

### What NOT to contribute

- Information from private projects (client names, sensitive data)
- Opinions without practical evidence ("I think X is better than Y")
- Duplicates of entries that already exist in `agent-brain.md`
- Entries without the `Rule` field — what is learned must become an actionable rule

---

## 💻 2. Improving the Engine

If you found a problem in the agent's flow or want to add capability:

### Where each thing lives

| What to improve | Where to edit |
|----------------|---------------|
| The overall pipeline (RALPH LOOP) | `agent/prompts/instructions.md` |
| Planning phase | `agent/prompts/plan.md` |
| Per-task execution phase | `agent/prompts/execute.md` |
| Learning phase | `agent/prompts/learn.md` |
| Session resume | `agent/prompts/resume.md` |
| Analyst role | `agent/roles/analyst.md` |
| Architect role | `agent/roles/architect.md` |
| Designer role | `agent/roles/designer.md` |
| Developer role | `agent/roles/dev.md` |
| QA role | `agent/roles/qa.md` |
| Learner role | `agent/roles/learner.md` |
| Manager role | `agent/roles/manager.md` |
| Automation scripts | `agent/scripts/` |
| New role (e.g. SRE, Security) | `agent/roles/[new-role].md` |

### Contribution flow

```bash
git checkout -b feat/my-improvement
# make your changes
git commit -m "feat: [description]"
git push origin feat/my-improvement
# open Pull Request
```

Commit conventions:
- `feat:` new feature in the engine
- `fix:` bug fix in the flow
- `brain:` wisdom contribution to agent-brain
- `role:` improvement to a specific role
- `chore:` general maintenance

---

## ⚖️ License

By contributing — whether code or wisdom — you agree that your contribution will be licensed under the **GNU AGPLv3**. This ensures that Agent Runner and all its accumulated intelligence remain free and accessible forever.

**Thank you for making the agent smarter for everyone.**
