# Agent Runner — Agente de Desenvolvimento Autônomo 🚀

**Agent Runner** é um motor de execução agentivo projetado para transformar requisitos de software em aplicações completas e funcionais, simulando o fluxo de trabalho de uma equipe real de engenharia de software — e aprendendo empiricamente com cada projeto construído.

## 🧠 O Conceito: RALPH LOOP

O Agent Runner opera sob o **RALPH LOOP** — um ciclo de aprendizado empírico inspirado na forma como desenvolvedores humanos crescem na carreira:

```
PLAN (1x) → [EXECUTE → VERIFY → LEARN] × N tarefas → LEARN GLOBAL → próximo projeto
```

Diferente de assistentes convencionais, o Agent Runner:
- **Aprende** com cada erro e decisão técnica
- **Persiste** esse conhecimento em uma memória acumulada (`workspace/memory/agent-brain.md`)
- **Melhora** a cada projeto — automaticamente, sem intervenção humana
- **Funciona** mesmo com modelos de IA com menor capacidade, graças a tarefas atômicas e auto-suficientes

## 👥 O Time (Multi-Agent Roles)

| Papel | Arquivo | Responsabilidade |
|-------|---------|-----------------|
| 🤵 Analista | `analyst.md` | Transforma ideias em PRDs detalhados, deduz features implícitas |
| 🏛️ Arquiteto | `architect.md` | Define stack, schema de dados, estrutura de pastas |
| 🎨 Designer | `designer.md` | Cria Design System, paleta, tipografia, layouts |
| 💻 Desenvolvedor | `dev.md` | Implementa features com autonomia extrema |
| 🧪 QA | `qa.md` | Testa após cada feature, garante que nada quebra |
| 📋 Manager | `manager.md` | Consolida contexto quando a janela de contexto satura |
| 🧠 Learner | `learner.md` | Extrai padrões e atualiza a memória do agente |

## 🔄 Como Funciona

### Fase 1: PLAN (única por projeto)
O agente assume os papéis de Analista → Arquiteto → Designer e produz:
- `workspace/PRD.md` — documento completo de requisitos
- `workspace/requirements/[projeto].md` — lista detalhada de RFs/RNFs
- `workspace/prd.json` — tarefas atômicas numeradas, cada uma com instructions auto-suficientes

### Fase 2: EXECUTE → VERIFY → LEARN (loop por tarefa)
Para cada tarefa do `prd.json`:
1. **Dev implementa** seguindo as `instructions` da tarefa
2. **QA verifica** compilação, lint e testes E2E
3. **Learner registra** padrões aprendidos
4. Commit automático e próxima tarefa

### Fase 3: LEARN GLOBAL (fim do projeto)
O Learner faz uma análise completa do projeto e atualiza `workspace/memory/agent-brain.md` — a memória que persiste entre todos os projetos.

## 🚀 Como Usar

### Via comando `/agent-runner`
```text
/agent-runner: Crie um [descreva seu projeto aqui]
```

### Via scripts
```bash
./agent/scripts/agent_run.sh
```

## 📁 Estrutura

```text
agent-runner/
├── agent/
│   ├── roles/              # Papéis do time (analyst, architect, dev, qa, designer, manager, learner)
│   ├── prompts/            # Prompts do RALPH LOOP (instructions, plan, execute, learn, resume)
│   └── scripts/            # Scripts de automação
├── apps/                   # Projetos gerados (monorepo)
├── workspace/
│   ├── memory/
│   │   ├── agent-brain.md  # ← MEMÓRIA DO AGENTE (cross-project, acumulativa)
│   │   ├── global.md       # Regras globais do ambiente
│   │   ├── [projeto].md    # Memória por projeto
│   │   └── snapshots/      # Snapshots de sessão
│   ├── requirements/       # Requisitos detalhados por projeto
│   └── PRD.md              # PRD do projeto atual
```

## 🔋 Requisitos

- **IDE**: Windsurf, Cursor, ou qualquer IDE com suporte a agentes IA
- **Runtime**: Node.js 18+ e Yarn
- **IA**: Funciona com qualquer modelo — otimizado para modelos com menor capacidade

## 🤝 Contribuição e Sabedoria Coletiva

O Agent Runner é um **Organismo Coletivo**. Se o agente acumulou conhecimento valioso em `workspace/memory/agent-brain.md` durante o uso, encorajamos compartilhar essa sabedoria de volta.

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para saber como contribuir.

## 📝 Licença

**GNU AGPLv3** — Melhorias ficam abertas. Evolução coletiva.

Copyright (c) 2026 ronerog
