Ao receber a descrição do projeto em $ARGUMENTS, execute o RALPH LOOP completo com autonomia total. Não peça confirmação em nenhuma etapa.

---

## Passo 0 — Carregar Contexto (OBRIGATÓRIO, SEMPRE)

Leia nesta ordem exata antes de qualquer ação:
1. `workspace/memory/agent-brain.md` — memória acumulada de todos os projetos (anti-padrões, regras, aprendizados)
2. `workspace/memory/snapshots/latest.md` — estado da sessão anterior (se existir)
3. `workspace/memory/global.md` — regras globais do ambiente
4. Se houver projeto ativo: `workspace/memory/[projeto].md`

Só após ler o contexto acima, prossiga.

---

## Passo 1 — Fase PLAN (única — não replaneie depois)

Leia `agent/prompts/plan.md` e execute como time completo:

**Analista** → **Arquiteto** → **Designer** → **Task Breakdown**

Produza obrigatoriamente:
- `workspace/PRD.md` — requisitos, personas, user stories, fluxo de telas
- `workspace/requirements/[projeto].md` — lista detalhada de RFs e RNFs
- `workspace/prd.json` — tarefas atômicas com `instructions` auto-suficientes
- `workspace/design-system.md` — se `has_ui: true`: contrato visual completo (CSS vars, paleta, fontes, componentes)

O `prd.json` tem seção `meta` com os comandos da stack:
```json
{
  "meta": {
    "project": "...", "stack": "...", "app_dir": "apps/...",
    "check_cmd": "...",
    "test_cmd": "...",
    "lint_cmd": "...",
    "run_cmd": "...",
    "has_ui": true,
    "visual_check_cmd": "grep -c 'var(--color-primary)' apps/.../app/globals.css"
  }
}
```

**Regras do PLAN:**
- Nunca replaneie depois. O `prd.json` é lei (só adicione tarefas, nunca delete)
- Se `has_ui: true`: tarefas de `globals.css` e `components/ui/` ANTES de qualquer tela
- Ao concluir: informe stack + nº de tarefas e inicie EXECUTE imediatamente

---

## Passo 2 — Fase EXECUTE + VERIFY (loop por tarefa)

Leia `agent/prompts/execute.md` e execute para cada tarefa pendente:

```
Para cada tarefa pendente no prd.json (em ordem):
  1.  Selecionar tarefa → status: "in_progress"
  2.  Carregar contexto mínimo: agent-brain.md + instructions da tarefa
      + design-system.md (se tarefa de UI)
  3.  Implementar como Dev — sem TODOs, sem placeholders
  4.  Verificar: executar meta.check_cmd
      → falha: corrigir e repetir (máx 3x) → ainda falha: marcar "blocked", continuar
  5.  [SE tarefa de UI e has_ui: true]
      → executar meta.visual_check_cmd
      → invocar agent/roles/visual-validator.md — checar conformidade com design-system.md
      → falha: Dev reimplementa com variáveis CSS corretas
  6.  Verificar task.done_when objetivamente
  7.  Executar meta.lint_cmd (se não for null)
  8.  Executar meta.test_cmd (se tarefa de teste ou lógica crítica modificada)
  9.  [A cada 3 tarefas de UI concluídas]
      → Checkpoint PRD: cores, fontes, componentes base — tudo conforme o PRD?
 10.  Commit: bash agent/scripts/git_commit.sh "Task [id]: [nome]"
 11.  Marcar status: "completed" no prd.json
 12.  LEARN rápido: erro novo → agent-brain.md | padrão novo → agent-brain.md | nada → silêncio
      → Informar: ✓ Task [id]/[total]: [nome] — [N] restantes
      → Próxima tarefa
```

**Regras de ferro:**
- Uma tarefa por vez — nunca implemente duas simultaneamente
- `completed` é permanente — nunca altere
- Nova tarefa necessária? → adicione ao final do `prd.json` com ID maior
- Contexto saturando? → acione Manager (`agent/roles/manager.md`) antes de degradar

---

## Passo 3 — Validação Final Integrada (antes de concluir)

Quando todas as tarefas estiverem concluídas, antes do LEARN GLOBAL:

**Validação Técnica:**
- Execute `meta.check_cmd` — deve passar
- Execute `meta.test_cmd` — todos os testes devem passar
- Execute Checklist de Segurança de `agent/roles/qa.md`

**Validação Visual** (apenas se `has_ui: true`):
- Invoque `agent/roles/visual-validator.md` — seção "Validação Final Integrada"
- Todas as variáveis CSS declaradas em `globals.css`?
- Todas as telas do PRD implementadas?
- Todas as telas passam no "teste do primeiro olhar"?
- Se falha: crie tarefas de correção e execute antes de concluir

---

## Passo 4 — LEARN Global (final do projeto)

Leia `agent/prompts/learn.md` — Ciclo Profundo.
Atualize `workspace/memory/agent-brain.md` com padrões, anti-padrões e aprendizados do projeto.

---

## Time de 8 Papéis

| Papel | Arquivo | Quando |
|-------|---------|--------|
| Analista | `agent/roles/analyst.md` | PLAN — PRD |
| Arquiteto | `agent/roles/architect.md` | PLAN — stack e estrutura |
| Designer | `agent/roles/designer.md` | PLAN — design-system.md |
| Desenvolvedor | `agent/roles/dev.md` | EXECUTE — implementação |
| QA | `agent/roles/qa.md` | VERIFY — gate técnico |
| Visual Validator | `agent/roles/visual-validator.md` | VERIFY — gate visual (UI) |
| Manager | `agent/roles/manager.md` | Contexto saturando |
| Learner | `agent/roles/learner.md` | LEARN — memória |

---

## Para retomar sessão anterior

Leia `agent/prompts/resume.md` e `workspace/memory/snapshots/latest.md`, depois continue do ponto onde parou.
