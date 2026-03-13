# Modo INJECT — Trabalhar em Sistema Existente

Use este modo quando o projeto já existe e você quer executar apenas tarefas específicas — sem criar um novo projeto do zero.

**Invocação**: `/inject <caminho-ou-nome-do-projeto> — <descrição das tasks>`

---

## Diferença do RALPH LOOP Completo

| RALPH LOOP | Modo INJECT |
|-----------|-------------|
| Cria projeto do zero | Trabalha em projeto existente |
| Fase PLAN completa (Analista → Arquiteto → Designer) | Fase AUDIT (entender o sistema atual) |
| prd.json com todos os requisitos | prd.json com apenas as tasks solicitadas |
| Ideal para novos projetos | Ideal para features, bugs, melhorias |

---

## Fase 0 — Carregar Contexto (obrigatório)

Leia antes de qualquer ação:
1. `workspace/memory/agent-brain.md`
2. `workspace/memory/snapshots/latest.md` (se existir)
3. `workspace/memory/global.md`

---

## Fase 1 — AUDIT (Entender o Sistema)

```
ROLE: Arquiteto (leitura) + Analista (leitura)
INPUT: caminho do projeto
OUTPUT: workspace/memory/[projeto]-audit.md
SINAL: AUDIT_READY
```

Execute nesta ordem. Não implemente nada ainda — apenas leia e mapeie.

### 1.1 — Ler Documentação
- `README.md` do projeto (se existir) — entenda o propósito, como rodar, arquitetura descrita
- `CHANGELOG.md`, `CONTRIBUTING.md` — padrões do projeto
- Documentação em `docs/` (se existir)

### 1.2 — Mapear Estrutura
- Leia a estrutura de pastas (2 níveis de profundidade)
- Identifique: onde está o entry point, onde estão os modelos, onde estão as rotas/controllers
- Identifique: arquivos de configuração principais (package.json, requirements.txt, go.mod, Gemfile, pom.xml, etc.)

### 1.3 — Identificar Stack e Padrões
- Leia o arquivo de dependências principal (package.json, requirements.txt, go.mod, etc.)
- Leia o entry point principal (main.py, index.ts, main.go, app.rb, etc.)
- Identifique: linguagem, framework principal, banco de dados, autenticação, testes
- Identifique: convenções do projeto (naming, estrutura de pastas, padrões de código)

### 1.4 — Ler Arquivos Relevantes para as Tasks Solicitadas
- Baseado nas tasks que o usuário pediu, identifique os arquivos mais relevantes
- Leia esses arquivos para entender o contexto local da mudança
- Procure por padrões estabelecidos que a nova task deve seguir

### 1.5 — Produzir Audit Summary

Crie `workspace/memory/[projeto]-audit.md`:

```markdown
# Audit: [nome do projeto]

## Stack
- Linguagem: ...
- Framework: ...
- Banco: ...
- Auth: ...
- Testes: ...
- Package manager: ...

## Comandos
- check_cmd: ...
- test_cmd: ...
- lint_cmd: ...
- run_cmd: ...

## Estrutura
[pasta-principal]/
  [descrição das principais pastas e seus propósitos]

## Padrões Identificados
- [padrão 1 que as novas tasks devem seguir]
- [padrão 2]
...

## Arquivos Relevantes para as Tasks Solicitadas
- [arquivo]: [o que faz e por que é relevante]
...

## Observações
[qualquer coisa importante que o Dev precisa saber]
```

---

## Fase 2 — TASK SYNTHESIS (Converter Request em Tasks)

```
ROLE: Arquiteto + Analista
INPUT: tasks solicitadas + audit summary
OUTPUT: workspace/prd.json (apenas as tasks pedidas)
SINAL: TASKS_READY
```

Crie `workspace/prd.json` com:
- `meta` preenchido com os dados do projeto auditado
- `tasks` com APENAS as tasks que o usuário solicitou (não invente tasks extras)
- Cada task com `type` correto e `instructions` auto-suficientes

```json
{
  "meta": {
    "project": "[nome do projeto existente]",
    "stack": "[stack identificada no audit]",
    "app_dir": "[caminho do projeto]",
    "check_cmd": "[comando de verificação da stack]",
    "test_cmd": "[comando de testes]",
    "lint_cmd": "[comando de lint ou null]",
    "run_cmd": "[comando de run]",
    "has_ui": false,
    "visual_check_cmd": null,
    "mode": "inject",
    "audit_file": "workspace/memory/[projeto]-audit.md"
  },
  "tasks": [
    {
      "id": 1,
      "type": "[tipo correto]",
      "task": "[descrição da task solicitada]",
      "file": "[arquivo a criar/modificar]",
      "instructions": "[instrução auto-suficiente: o que fazer, como seguir os padrões do projeto]",
      "done_when": "[critério objetivo]",
      "rf": ["USER_REQUEST"],
      "status": "pending"
    }
  ]
}
```

**Regras críticas do INJECT:**
- As `instructions` devem referenciar os padrões identificados no audit (ex: "siga o padrão de services em services/user.service.ts")
- O campo `file` deve usar o caminho exato dentro do projeto existente
- Nunca crie estrutura de pastas nova se o projeto já tem uma convenção clara
- Se a task solicita mudança em arquivo existente, leia o arquivo antes de escrever as instructions

---

## Fase 3 — EXECUTE (Normal)

Leia `agent/prompts/execute.md` e execute para cada task pendente.

O contexto já carregado inclui o audit — não releia tudo. Apenas consulte `workspace/memory/[projeto]-audit.md` quando precisar de contexto específico do projeto.

---

## Regras do Modo INJECT

- **Nunca destrua padrões existentes** — se o projeto usa classes, use classes. Se usa funções, use funções.
- **Minimize blast radius** — altere apenas os arquivos necessários para as tasks solicitadas
- **Preserve convenções** — naming, estrutura de pastas, estilo de código devem ser consistentes com o projeto
- **Não adicione dependências sem necessidade** — prefira usar o que o projeto já tem
- **Se encontrar problema existente** — documente em `workspace/memory/[projeto]-audit.md`, mas não conserte o que não foi pedido
- **Testes existentes devem continuar passando** — se uma task quebrar um teste existente que não estava no escopo, conserte antes de marcar como completed
