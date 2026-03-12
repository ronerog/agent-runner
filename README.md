# Agent Runner — Agente de Desenvolvimento Autônomo

**Agent Runner** é um motor de execução agentivo que transforma requisitos em software funcional, operando como um time completo de engenharia — e aprendendo empiricamente com cada projeto construído.

Funciona em **qualquer IDE com IA** e **qualquer modelo de linguagem**.

---

## Como Funciona — RALPH LOOP

```
PLAN (1x) → [EXECUTE → VERIFY → LEARN] × N tarefas → LEARN GLOBAL
```

O agente planeja uma única vez, depois executa tarefa por tarefa em loop, aprendendo com cada ciclo. O conhecimento acumulado persiste em `workspace/memory/agent-brain.md` e melhora cada projeto subsequente.

| Papel | Responsabilidade |
|-------|-----------------|
| Analista | Transforma ideias em PRDs, deduz features implícitas |
| Arquiteto | Escolhe a stack certa, modela os dados, define estrutura |
| Designer | Design System, paleta, layouts — adaptado ao nicho |
| Desenvolvedor | Implementa com autonomia total, qualquer linguagem |
| QA | Valida após cada tarefa, nunca avança com falhas |
| Learner | Extrai padrões, atualiza a memória do agente |
| Manager | Consolida contexto quando a sessão satura |

---

## Compatibilidade

| IDE / Ferramenta | Arquivo de config | Comando |
|-----------------|-------------------|---------|
| **Windsurf** | `.windsurf/workflows/agent-runner.md` | `/agent-runner` |
| **Cursor** | `.cursor/rules/agent-runner.mdc` | `/agent-runner` |
| **Claude Code** | `CLAUDE.md` | `/agent-runner` |
| **Gemini CLI** | `GEMINI.md` | `/agent-runner` |
| **Cline / RooCode** | `.clinerules` | `/agent-runner` |
| **GitHub Copilot** | `.github/copilot-instructions.md` | `/agent-runner` |
| **Qualquer IDE** | `agent/prompts/instructions.md` | cole o conteúdo no chat |
| **Terminal** | `agent/scripts/start.sh` | veja abaixo |

---

## Como Usar

### Em IDEs (Windsurf, Cursor, Claude Code, etc.)

Abra o repositório na IDE e use o comando:

```
/agent-runner: Crie um [descreva seu projeto]
```

Para retomar uma sessão anterior:
```
continuar
```

### No Terminal

O `start.sh` gera o prompt de bootstrap e pode ser passado para qualquer AI CLI:

```bash
# Claude Code CLI
claude "$(./agent/scripts/start.sh 'Crie um SaaS de agendamento médico')"

# Aider
aider --message "$(./agent/scripts/start.sh 'Crie um SaaS de agendamento médico')"

# Gemini CLI
gemini "$(./agent/scripts/start.sh 'Crie um SaaS de agendamento médico')"

# Retomar sessão anterior
claude "$(./agent/scripts/start.sh)"
```

Ou rode diretamente se o prd.json já existe:
```bash
bash agent/scripts/agent_run.sh
```

### Em qualquer IDE sem suporte a workflows

Cole o conteúdo de `agent/prompts/instructions.md` no início da conversa, seguido de:
```
Projeto: [descreva o que quer construir]
```

---

## Estrutura

```
agent-runner/
├── CLAUDE.md                  # Bootstrap para Claude Code
├── GEMINI.md                  # Bootstrap para Gemini CLI
├── .clinerules                # Bootstrap para Cline/RooCode
├── .cursor/rules/             # Bootstrap para Cursor
├── .windsurf/workflows/       # Bootstrap para Windsurf
├── .github/copilot-instructions.md  # Bootstrap para GitHub Copilot
│
├── agent/
│   ├── roles/                 # Os 7 papéis do time
│   ├── prompts/               # RALPH LOOP: instructions, plan, execute, learn, resume
│   └── scripts/               # start.sh (terminal), agent_run.sh, git_commit.sh, run_checks.sh
│
├── apps/                      # Projetos gerados (monorepo)
│
└── workspace/
    ├── memory/
    │   ├── agent-brain.md     # Memória cross-project do agente (cresce com o uso)
    │   ├── global.md          # Regras globais do ambiente
    │   └── snapshots/         # Estado de sessões anteriores
    ├── requirements/          # Requisitos detalhados por projeto
    └── PRD.md                 # PRD do projeto atual
```

---

## Stacks Suportadas

O Arquiteto escolhe a stack ideal para cada projeto. O agente domina qualquer linguagem:

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

## Requisitos

- **Node.js 18+** e **Yarn** (para projetos JS/TS)
- **Runtime da stack escolhida** (Python, Go, Rust, etc. — conforme o projeto)
- **jq** (opcional — usado pelo `run_checks.sh` para ler o `prd.json`)
- **Git**

---

## Contribuindo

Ao usar o Agent Runner, ele acumula sabedoria em `workspace/memory/agent-brain.md`. Compartilhe esse conhecimento de volta — veja [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licença

**GNU AGPLv3** — Melhorias ficam abertas. Evolução coletiva.

Copyright (c) 2026 ronerog
