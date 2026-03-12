---
description: Inicia o motor de execução do Agente Autônomo (Agent Runner) para um novo projeto.
---
# Workflow /agent-runner

Ao receber este comando com a descrição do projeto, execute o RALPH LOOP completo:

## Passo 1 — Carregar Memória do Agente
Leia obrigatoriamente, nesta ordem:
1. `workspace/memory/agent-brain.md`
2. `workspace/memory/snapshots/latest.md` (se existir)
3. `workspace/memory/global.md`

## Passo 2 — Fase PLAN (única)
Leia `agent/prompts/plan.md` e execute como Analista → Arquiteto → Designer → Task Breakdown.

Produza:
- `workspace/PRD.md`
- `workspace/requirements/[projeto].md`
- `workspace/prd.json` (tarefas atômicas com instructions auto-suficientes)

## Passo 3 — Fase EXECUTE + VERIFY + LEARN (loop)
Leia `agent/prompts/execute.md` e execute o loop de tarefas:

```
Para cada tarefa pendente no prd.json:
  1. Selecionar tarefa → status: in_progress
  2. Implementar (Dev)
  3. Verificar compilação (yarn tsc --noEmit)
  4. Verificar critério done_when (QA)
  5. Testes E2E se aplicável (QA)
  6. Commit (git_commit.sh)
  7. status: completed
  8. LEARN rápido (Learner)
  → próxima tarefa
```

## Passo 4 — LEARN Global (final do projeto)
Ao concluir todas as tarefas, leia `agent/prompts/learn.md` (Ciclo Profundo).
Atualize `workspace/memory/agent-brain.md` com os padrões aprendidos.

## Regras
- Não peça confirmação entre etapas — execute com autonomia total
- Uma tarefa por vez, em ordem
- Se o contexto saturar, acione o Manager antes de continuar
