# Orchestrator — Cérebro de Roteamento do Agent Runner

O Orchestrator **não é um papel** — é a camada de controle que decide:
- Em qual fase entrar baseado no estado atual
- Qual pipeline de roles invocar por tipo de tarefa
- Qual contexto mínimo injetar em cada invocação
- O que aceitar como output válido (postcondições)
- Como rotear falhas e escaladas

> Este documento é lido pelo `execute.md` e pelo `instructions.md`. Não precisa ser relido a cada tarefa.

---

## Máquina de Estados do RALPH LOOP

```
                    ┌──────────────────────────────────────┐
                    │        AGENT RUNNER STATE MACHINE     │
                    └──────────────────────────────────────┘

 [START]
    │
    ▼
[INIT] ── Lê: agent-brain.md → snapshots/latest.md → global.md → [projeto].md
    │
    ├─── modo /inject ────────────▶ [AUDIT] ──▶ [TASK_SYNTHESIS] ──▶ [EXECUTE_LOOP]
    │                                                                      │
    ├─── prd.json NÃO existe ──▶ [PLAN]                                    │
    │                                │                                     │
    │                         Analista ──▶ Arquiteto ──▶ [Data Scientist?] ──▶ Designer
    │                                │
    │                         prd.json criado, todas tasks "pending"
    │                                │
    └─── prd.json existe ────────────┘
                                     │
                                     ▼
                              [EXECUTE_LOOP] ◀──────────────────┐
                                     │                           │
                              tarefa "pending"?                  │
                             /               \                   │
                           SIM               NÃO                │
                            │                │                   │
                            ▼                ▼                   │
                       [EXECUTE]       [VALIDATE]                │
                            │                │                   │
                      task.type-routing    PASS?                 │
                            │             /   \                  │
                            ▼           SIM   NÃO               │
                    pipeline-específico   │     │                │
                            │            ▼     ▼                 │
                            ▼         [LEARN  [FIX_TASKS]       │
                    [LEARN_RÁPIDO]    _GLOBAL]     │             │
                            │            │         └─────────────┘
                            └────────────┘
                                     │
                                   [END]
```

### Transições Explícitas

| De | Para | Condição |
|----|------|----------|
| INIT | PLAN | Nenhum `prd.json` em `workspace/*/` existe |
| INIT | EXECUTE_LOOP | Existe `workspace/[projeto]/prd.json` com tasks `pending` |
| INIT | VALIDATE | Existe `workspace/[projeto]/prd.json`, todas as tasks `completed` ou `blocked` |
| PLAN | EXECUTE_LOOP | `prd.json` criado + todas tasks `pending` + `design-system.md` criado (se `has_ui: true`) |
| EXECUTE | LEARN_RÁPIDO | Task marcada `completed` |
| EXECUTE | EXECUTE (mesma task) | QA retorna `FAIL` + tentativas < 3 |
| EXECUTE | BLOCKED + próxima | QA retorna `FAIL` após 3 tentativas |
| EXECUTE_LOOP | VALIDATE | Nenhuma task `pending` |
| VALIDATE | LEARN_GLOBAL | Todos os gates técnico e visual passaram |
| VALIDATE | FIX_TASKS | Algum gate falhou → cria tasks de correção |
| FIX_TASKS | EXECUTE_LOOP | Tasks de correção adicionadas ao `prd.json` |

---

## Task Type → Role Pipeline (Roteamento por Tipo)

O campo `type` da tarefa determina qual pipeline de roles é executado.
**Nunca execute Visual Validator em tasks sem UI. Nunca execute lint em tasks de docs.**

| `type` | Descrição | Pipeline | Visual Gate | Test Gate |
|--------|-----------|----------|------------|-----------|
| `setup` | Scaffold, instalação, configuração inicial | Dev | ✗ | ✗ |
| `config` | Arquivos de configuração (.env, settings, tsconfig) | Dev → QA(check) | ✗ | ✗ |
| `schema` | Models, migrations, entidades de banco | Dev → QA(check) | ✗ | ✗ |
| `backend` | Serviços, controllers, API routes, lógica de negócio | Dev → QA(check + lint) | ✗ | se crítico |
| `ui-setup` | globals.css, variáveis CSS, Design System | Dev → QA(check) → VisualValidator | ✓ | ✗ |
| `ui-component` | Componentes base em `components/ui/` | Dev → QA(check + lint) → VisualValidator | ✓ | ✗ |
| `ui-screen` | Páginas e telas da aplicação | Dev → QA(check + lint) → VisualValidator | ✓ | ✗ |
| `integration` | Integrações externas (email, pagamento, storage) | Dev → QA(check + test) | ✗ | ✓ |
| `test` | Testes automatizados | QA principal → Dev (se necessário) | ✗ | ✓ |
| `docs` | README, documentação, comentários | Dev (light) | ✗ | ✗ |
| `notebook` | Jupyter notebook ou Quarto (.qmd) / R Markdown | Dev + DataScientist → QA(check) | ✗ | ✗ |
| `pipeline` | Pipeline de dados (ETL, transformação, ingestão) | Dev → QA(check + test) | ✗ | ✓ |
| `viz` | Visualização de dados (estática ou interativa) | Dev + DataScientist → QA(check) | ✗ | ✗ |
| `model` | Modelo estatístico ou ML | Dev + DataScientist → QA(check + test) | ✗ | ✓ |
| `report` | Relatório final (Quarto render, PDF, HTML) | Dev + DataScientist → QA(check) | ✗ | ✗ |
| `r-script` | Script R standalone | Dev → QA(check + lint) | ✗ | se crítico |
| `r-shiny` | Aplicativo Shiny | Dev → QA(check + lint) → VisualValidator | ✓ | ✗ |

**Como usar no execute.md**: antes do Passo 3, leia `task.type` e selecione o pipeline correto. Passos do pipeline que não se aplicam ao tipo são pulados.

---

## Role Invocation Protocol (RIP)

Ao "invocar" um papel, injete **exatamente** o contexto listado — nada mais.
Contexto extra aumenta custo e não melhora qualidade.

### Tabela de Contexto Mínimo por Role

| Role | Contexto Injetado | Output Esperado | Sinal de Conclusão |
|------|------------------|-----------------|-------------------|
| **Analista** | Pedido do usuário | `workspace/[projeto]/PRD.md` + `workspace/[projeto]/requirements.md` | `PRD_READY` |
| **Arquiteto** | PRD.md (seção funcional) + agent-brain (stack expertise) | Stack + folder structure + schema + meta | `ARCH_READY` |
| **Data Scientist** | PLAN: PRD.md (seção dados) + stack | Metodologia estatística + tasks de análise no prd.json | `DS_READY` |
| **Data Scientist** (VERIFY) | arquivo implementado (notebook/model/viz/report) + task.done_when | Validação estatística: metodologia, assunções, reporting | `DS_PASS` / `DS_FAIL:[motivo]` |
| **Designer** | PRD.md (seção UI/nicho) + stack | `workspace/[projeto]/design-system.md` + tasks de UI no prd.json | `DESIGN_READY` |
| **Dev** | `task.instructions` + agent-brain.md + design-system.md (se UI) | Arquivo em `task.file` criado/modificado | `IMPL_READY` |
| **QA** | `task.done_when` + `meta.check_cmd` + arquivo implementado | `PASS` ou `FAIL:[motivo]` | `QA_PASS` / `QA_FAIL` |
| **Visual Validator** | `design-system.md` + arquivo CSS/tela implementado | `VISUAL_PASS` ou `VISUAL_FAIL:[item]` | `VV_PASS` / `VV_FAIL` |
| **Learner** | Erros e decisões da task atual (somente) | Entrada em agent-brain.md (ou silêncio) | silêncio ou `LEARNED` |
| **Manager** | `prd.json` + `[projeto].md` + `workspace_dir` | `workspace/memory/snapshots/latest.md` | `SNAPSHOT_READY` |

### Regra de Contexto

```
Se você está lendo mais do que o budget acima → PARE.
Provavelmente está relendo o PRD inteiro ou todas as tasks.
Use agent-brain.md (já tem o knowledge comprimido) em vez de reler arquivos grandes.
```

---

## Escalation Matrix

Quando uma role falha, o Orchestrator roteia a escalada **com contexto estruturado**.
Nunca deixe a role decidir sozinha o próximo passo após 3 falhas.

| Condição | Role Atual | Escala Para | Contexto a Injetar | Ação Esperada |
|----------|-----------|------------|-------------------|---------------|
| `check_cmd` falha 3x no mesmo erro | Dev | **Architect** | Erro exato + arquivo + 3 tentativas | Redesenhar abordagem técnica, adicionar task de correção |
| `visual_check_cmd` falha 3x | Dev | **Designer** | Variável CSS ausente + CSS atual | Corrigir `design-system.md` + regenerar `globals.css` |
| `task.instructions` é ambígua | Dev | **Analyst** | Trecho ambíguo + dúvida específica | Reescrever `task.instructions` da task afetada |
| Race condition / N+1 detectado | QA | **Architect** | Descrição técnica do bug | Criar task de correção arquitetural |
| `design-system.md` não existe | QA | **Designer** | Task de UI bloqueada sem Design System | Criar `design-system.md` como task de prioridade máxima |
| Teste falha após refactor | QA | **Dev** | Teste + comportamento esperado + diff | Corrigir lógica ou atualizar teste com justificativa |
| Requisito descoberto durante impl | Dev | **Analyst** | Feature implícita identificada | Adicionar RF + task ao `prd.json` |
| Mesmo erro em 3 tasks diferentes | QA/Dev | **Learner** | Padrão de erro + 3 ocorrências | Documentar anti-padrão no `agent-brain.md` |
| Metodologia estatística inválida | QA | **Data Scientist** | Resultado suspeito + tipo de análise + dados | Revisar teste, assunções, reportar corretamente |
| `DS_FAIL` após 2 iterações | Dev+DS | **Architect** | Problema metodológico + stack atual | Avaliar se stack é adequada para a análise |

### Formato de Escalada

Ao escalar, sempre formate assim (para o contexto ser claro):
```
ESCALADA: [Role Atual] → [Role Destino]
MOTIVO: [condição exata que disparou]
CONTEXTO: [o mínimo necessário para o destino resolver]
ESPERADO: [o que o destino deve produzir]
```

---

## Modo INJECT — Projeto Existente

Quando invocado via `/inject <caminho> — <tasks>`:

1. **Não execute PLAN** — o projeto já existe.
2. Execute **Fase AUDIT** (`agent/prompts/inject.md` Fase 1): leia README, estrutura, stack, padrões.
3. Execute **TASK SYNTHESIS** (`agent/prompts/inject.md` Fase 2): crie `prd.json` com apenas as tasks solicitadas, `mode: "inject"`.
4. Execute normalmente via **EXECUTE loop** (`agent/prompts/execute.md`).

**Regras extras do INJECT:**
- Preserve padrões do projeto existente — naming, estrutura, estilo de código.
- Minimize blast radius — altere apenas arquivos necessários.
- Testes existentes devem continuar passando — se quebrar, consertar é parte da task.

## Projetos de Dados — Quando Invocar Data Scientist

Invoque `agent/roles/data-scientist.md` durante PLAN quando o projeto envolver:
- Análise estatística, biostatística, epidemiologia, ensaios clínicos
- Machine learning (classificação, regressão, clustering)
- Pipelines de dados (ETL, ingestão, transformação)
- Dashboards/relatórios analíticos
- Qualquer task com `type: notebook | pipeline | viz | model | report`

**Posição no PLAN**: Analista → Arquiteto → **Data Scientist** → Designer (se has_ui) → Task Breakdown

## Session Continuity

### Quando Acionar o Manager (Proativo, não Reativo)

| Sinal | Ação |
|-------|------|
| > 40 trocas de mensagens na sessão | Gerar snapshot proativamente |
| Começou a contradizer decisão anterior | Gerar snapshot imediatamente |
| Mesmo erro em tasks distintas (context drift) | Gerar snapshot + atualizar agent-brain |
| Usuário reportou esquecimento | Gerar snapshot, ler agent-brain, retomar |

### O Snapshot É o Contrato de Continuidade

Um snapshot bem feito deve permitir que a próxima sessão **execute imediatamente sem perguntas**.
Se a nova sessão precisar perguntar algo → o snapshot falhou.

> O snapshot deve registrar `workspace_dir` e `app_dir` ativos para que a próxima sessão saiba onde encontrar o `prd.json`.

---

## Anti-Patterns de Orquestração (Nunca Faça)

| Anti-Pattern | Sintoma | Correção |
|-------------|---------|---------|
| **Role contamination** | Dev toma decisão arquitetural | Escale ao Architeto com contexto estruturado |
| **Phantom handoff** | Role "termina" sem produzir output esperado | Orchest. bloqueia avanço até output produzido |
| **Pipeline inflation** | Todo task passa por todos os passos | Use task.type para rotear — pulando passos irrelevantes |
| **Context overflow silencioso** | Qualidade degrada gradualmente | Acionar Manager proativamente (> 40 trocas) |
| **Cascading failure** | QA falha → Dev corrige → QA falha diferente → loop | Após 3 falhas distintas → Escalation Matrix |
| **Orphaned task** | Nova task adicionada sem `rf` vinculado | Toda nova task no prd.json deve ter `rf` |
| **Plan drift** | Replanejar tarefas durante execute | prd.json é imutável (só adiciona, nunca altera ou deleta) |
