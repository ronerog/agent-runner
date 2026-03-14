# Refatoração Arquitetural: Desacoplamento de Projetos Gerados

Você deve implementar uma refatoração arquitetural no agent-runner. Não peça confirmação. Execute todas as mudanças com autonomia total.

## Contexto

Atualmente os projetos gerados ficam em `apps/[nome]/` dentro do próprio repositório do agente. Isso mistura o motor com o output, impede isolamento por cliente e polui o repo com deps pesadas. A refatoração move os projetos para fora do motor e organiza os artefatos de planejamento por projeto dentro de `workspace/`.

## Arquitetura Final (leia antes de editar qualquer arquivo)

```
~/
├── agent-runner/                    ← motor (este repositório, limpo)
│   ├── agent/
│   └── workspace/
│       ├── memory/                  ← NÃO muda (agent-brain, global, snapshots)
│       └── [nome-do-projeto]/       ← NOVO: artefatos de planejamento por projeto
│           ├── prd.json
│           ├── PRD.md
│           ├── design-system.md
│           └── requirements.md
│
└── projects/                        ← PROJECTS_ROOT (externo, configurável)
    ├── client-a/                    ← repo Git isolado
    └── client-b/
```

**O que NÃO muda:** `workspace/memory/` inteiro (agent-brain.md, global.md, [projeto].md, snapshots/).

---

## Passo 1 — Ler os arquivos que serão modificados

Leia todos estes arquivos antes de fazer qualquer edição:

1. `workspace/memory/global.md`
2. `agent/prompts/plan.md`
3. `agent/prompts/execute.md`
4. `agent/prompts/instructions.md`
5. `agent/prompts/orchestrator.md`
6. `agent/roles/architect.md`
7. `CLAUDE.md`
8. `.agents/workflows/agent-runner.md`
9. `.windsurf/workflows/agent-runner.md`
10. `.windsurf/workflows/inject.md`
11. `.claude/commands/agent-runner.md`
12. `.cursor/commands/agent-runner.md`
13. `.cursor/rules/agent-runner.mdc`
14. `.roo/commands/agent-runner.md`
15. `GEMINI.md`
16. `.gemini/commands/agent-runner.toml`
17. `.github/copilot-instructions.md`
18. `.clinerules`

---

## Passo 2 — Aplicar as mudanças (arquivo por arquivo)

### 2.1 — `workspace/memory/global.md`

Substitua a seção "Arquitetura Global" e adicione seções novas. O resultado deve ser:

**Remova** a linha: `- **Monorepo**: todos os projetos vivem em `apps/[nome-do-projeto]/``

**Substitua toda a seção "Arquitetura Global"** por:

```markdown
## Configuração de Ambiente

- **PROJECTS_ROOT**: `~/projects`
  - Diretório externo onde os projetos gerados vivem. Configure para o caminho que preferir.
  - Exemplos: `~/projects`, `~/dev/clients`, `/mnt/projetos`
  - **Nunca** use `apps/` dentro do agent-runner — projetos ficam fora do motor.
- **Stack padrão**: Next.js 15 + TypeScript + Tailwind CSS + Prisma (quando aplicável)
- **Package Manager**: `yarn` (nunca `pnpm`, nunca `npm` diretamente)
- **Testes**: Playwright para E2E

## Arquitetura de Separação Motor / Projeto

O agent-runner é o **motor** (fica limpo, publicável no GitHub).
Os projetos gerados ficam em `PROJECTS_ROOT/[nome-do-projeto]/` (fora do motor).

```
~/
├── agent-runner/                   ← motor (este repositório)
│   ├── agent/
│   └── workspace/
│       ├── memory/                 ← memória do agente (cross-project, sempre aqui)
│       └── [nome-do-projeto]/      ← artefatos de planejamento por projeto
│           ├── prd.json
│           ├── PRD.md
│           ├── design-system.md
│           └── requirements.md
│
└── projects/                       ← PROJECTS_ROOT (externo ao motor)
    ├── client-a-ecommerce/         ← repo Git isolado
    └── client-b-saas/              ← repo Git isolado
```
```

**Substitua a seção "Estrutura de Memória do Agente"** — adicione a tabela de artefatos de planejamento após ela:

```markdown
## Artefatos de Planejamento por Projeto

Cada projeto tem seus artefatos em `workspace/[nome-do-projeto]/`:

| Arquivo | Propósito |
|---------|-----------|
| `workspace/[projeto]/prd.json` | Estado de orquestração (tarefas + meta) |
| `workspace/[projeto]/PRD.md` | Documento de requisitos |
| `workspace/[projeto]/design-system.md` | Contrato visual (se `has_ui: true`) |
| `workspace/[projeto]/requirements.md` | RFs e RNFs detalhados |
```

**Na seção "Quando Criar um Novo Arquivo de Memória de Projeto"** — remova a menção a `apps/` do texto.

---

### 2.2 — `agent/prompts/plan.md`

**Mudanças a aplicar:**

1. **Etapa 1 (Analista)** — altere os caminhos dos artefatos produzidos:
   - `workspace/PRD.md` → `workspace/[projeto]/PRD.md`
   - `workspace/requirements/[projeto].md` → `workspace/[projeto]/requirements.md`

2. **Etapa 3 (Designer)** — altere:
   - `workspace/design-system.md` → `workspace/[projeto]/design-system.md`

3. **Etapa 4 (Task Breakdown)** — altere:
   - `workspace/prd.json` → `workspace/[projeto]/prd.json`

4. **Schema da seção `meta`** — substitua o bloco JSON de exemplo por:

```json
{
  "meta": {
    "project": "nome-do-projeto",
    "stack": "Descrição da stack (ex: Python/Django + PostgreSQL)",
    "workspace_dir": "workspace/nome-do-projeto",
    "app_dir": "~/projects/nome-do-projeto",
    "check_cmd": "cd ~/projects/nome-do-projeto && comando-de-check",
    "test_cmd": "comando que roda os testes automatizados",
    "lint_cmd": "comando de lint/formatação (null se não aplicável)",
    "run_cmd": "comando para rodar o projeto em dev",
    "has_ui": true,
    "visual_check_cmd": "grep -c 'var(--color-primary)' ~/projects/nome-do-projeto/app/globals.css"
  },
  "tasks": []
}
```

5. **Exemplos de `check_cmd`** — substitua todos os `cd apps/proj &&` por `cd {app_dir} &&` (onde `{app_dir}` = valor de `meta.app_dir`):
   - `cd apps/proj && yarn tsc --noEmit` → `cd {app_dir} && yarn tsc --noEmit`
   - `cd apps/proj && python manage.py check` → `cd {app_dir} && python manage.py check`
   - `cd apps/proj && python -m py_compile ...` → `cd {app_dir} && python -m py_compile ...`
   - `cd apps/proj && go build ./...` → `cd {app_dir} && go build ./...`
   - `cd apps/proj && cargo check` → `cd {app_dir} && cargo check`
   - `cd apps/proj && ruby -c ...` → `cd {app_dir} && ruby -c ...`

6. **Campo `file` nas tasks** — substitua o exemplo `"file": "apps/[projeto]/caminho/..."` por `"file": "{app_dir}/caminho/..."`.

7. **Checklist de Validação** — adicione item:
   - `[ ] Diretório \`workspace/[projeto]/\` foi criado com PRD.md, prd.json e (se `has_ui`) design-system.md`

8. **Instrução ao Arquiteto** — na Etapa 2, adicione após "Defina os comandos de verificação":
   > **Atenção**: `app_dir` deve ser o path absoluto fora do agent-runner. Leia `PROJECTS_ROOT` de `workspace/memory/global.md` e use `{PROJECTS_ROOT}/[nome-do-projeto]`. Crie o diretório `workspace/[projeto]/` para os artefatos de planejamento.

---

### 2.3 — `agent/prompts/execute.md`

**Mudanças a aplicar:**

1. **Seção "Antes de Começar: Ler Metadados"** — altere a instrução e o exemplo:
   - Texto: `Leia a seção \`meta\` do \`workspace/prd.json\`` → `Leia a seção \`meta\` do \`workspace/[projeto]/prd.json\` (path em \`meta.workspace_dir\` do snapshot, ou escaneie \`workspace/\` por subdiretórios com \`prd.json\`)`
   - No exemplo JSON: `"app_dir": "apps/nome"` → `"app_dir": "~/projects/nome"`
   - No exemplo JSON: adicione `"workspace_dir": "workspace/nome"` após `"stack"`
   - `"check_cmd": "cd apps/nome && ..."` → `"check_cmd": "cd ~/projects/nome && ..."`
   - `"visual_check_cmd": "grep -c ... apps/nome/..."` → `"grep -c ... ~/projects/nome/..."`

2. **Passo 8 — Atualizar Estado** — altere:
   - `workspace/memory/[projeto].md` permanece igual (não muda)

3. **Tarefa do tipo `setup` — instrução especial** — adicione nota após a tabela de roteamento:
   > **Nota para tarefa `setup` (sempre a primeira):** antes de qualquer instalação de dependência, execute:
   > ```bash
   > mkdir -p {app_dir}
   > cd {app_dir} && git init
   > ```
   > Use o valor de `meta.app_dir` do `prd.json`. Isso garante que o projeto já nasce como repositório Git isolado fora do agent-runner.

---

### 2.4 — `agent/prompts/instructions.md`

**Mudanças a aplicar:**

1. **Seção "Arquivos do Sistema — Risco ao PC do Usuário"** — altere a regra:
   - De: `NUNCA acesse, leia, modifique ou delete arquivos fora do diretório do projeto (\`apps/[projeto]/\` e \`workspace/\`).`
   - Para: `NUNCA acesse, leia, modifique ou delete arquivos fora do diretório do projeto (\`meta.app_dir\` e \`workspace/\`).`

2. **Seção "Estado Persistente"** — altere:
   - De: `**\`workspace/prd.json\`** — estado das tarefas do projeto atual`
   - Para: `**\`workspace/[projeto]/prd.json\`** — estado das tarefas do projeto atual (\`meta.workspace_dir\` define o path exato)`

3. **Seção "Fase PLAN (Única)"** — altere a lista de artefatos produzidos:
   - `workspace/PRD.md` → `workspace/[projeto]/PRD.md`
   - `workspace/requirements/[projeto].md` → `workspace/[projeto]/requirements.md`
   - `workspace/prd.json` → `workspace/[projeto]/prd.json`
   - `workspace/design-system.md` → `workspace/[projeto]/design-system.md`

---

### 2.5 — `agent/prompts/orchestrator.md`

**Mudanças a aplicar:**

1. **Tabela de Transições (INIT)** — altere as condições:
   - De: `\`workspace/prd.json\` não existe` → Para: `Nenhum \`prd.json\` em \`workspace/*/\` existe`
   - De: `\`workspace/prd.json\` existe com tasks \`pending\`` → Para: `Existe \`workspace/[projeto]/prd.json\` com tasks \`pending\``
   - De: `\`workspace/prd.json\` existe, todas as tasks \`completed\` ou \`blocked\`` → Para: `Existe \`workspace/[projeto]/prd.json\`, todas as tasks \`completed\` ou \`blocked\``

2. **Tabela de Contexto Mínimo por Role** — adicione `workspace_dir` ao contexto do Manager:
   - Manager: adicione `workspace_dir` como parte do input junto com `prd.json`

3. **Session Continuity** — adicione ao formato do snapshot:
   > O snapshot deve registrar `workspace_dir` e `app_dir` ativos para que a próxima sessão saiba onde encontrar o `prd.json`.

---

### 2.6 — `agent/roles/architect.md`

**Mudanças a aplicar:**

1. **Seção "Responsabilidades"** — altere o item 2:
   - De: `Definir a estrutura de pastas do projeto em \`apps/[projeto]/\`.`
   - Para: `Definir a estrutura de pastas do projeto em \`{app_dir}\` (path absoluto lido de \`PROJECTS_ROOT\` em \`workspace/memory/global.md\`).`

2. **Adicione nova responsabilidade** (após item 6):
   - `7. **Criar o diretório de planejamento** \`workspace/[projeto]/\` e inicializar \`workspace/[projeto]/prd.json\` com a seção \`meta\` completa (incluindo \`workspace_dir\` e \`app_dir\` como path absoluto).`

3. **Seção "Comandos de Verificação por Stack (referência)"** — substitua todos os `cd apps/proj &&` por `cd {app_dir} &&`:

```
TypeScript/Next.js:
  check_cmd: "cd {app_dir} && yarn tsc --noEmit"
  test_cmd:  "cd {app_dir} && yarn playwright test"
  lint_cmd:  "cd {app_dir} && yarn lint"
  run_cmd:   "cd {app_dir} && yarn dev"

Python/Django:
  check_cmd: "cd {app_dir} && python manage.py check"
  test_cmd:  "cd {app_dir} && python -m pytest"
  lint_cmd:  "cd {app_dir} && flake8 ."
  run_cmd:   "cd {app_dir} && python manage.py runserver"

Python/FastAPI:
  check_cmd: "cd {app_dir} && python -m py_compile $(find app -name '*.py' | tr '\n' ' ')"
  test_cmd:  "cd {app_dir} && python -m pytest"
  lint_cmd:  "cd {app_dir} && flake8 app/"
  run_cmd:   "cd {app_dir} && uvicorn app.main:app --reload"

Go:
  check_cmd: "cd {app_dir} && go build ./..."
  test_cmd:  "cd {app_dir} && go test ./..."
  lint_cmd:  "cd {app_dir} && golint ./..."
  run_cmd:   "cd {app_dir} && go run ."

Rust:
  check_cmd: "cd {app_dir} && cargo check"
  test_cmd:  "cd {app_dir} && cargo test"
  lint_cmd:  "cd {app_dir} && cargo clippy"
  run_cmd:   "cd {app_dir} && cargo run"

Ruby/Rails:
  check_cmd: "cd {app_dir} && bundle exec rails runner 'puts Rails.version'"
  test_cmd:  "cd {app_dir} && bundle exec rails test"
  lint_cmd:  "cd {app_dir} && bundle exec rubocop"
  run_cmd:   "cd {app_dir} && bundle exec rails server"

Java/Spring Boot (Maven):
  check_cmd: "cd {app_dir} && ./mvnw compile -q"
  test_cmd:  "cd {app_dir} && ./mvnw test"
  lint_cmd:  null
  run_cmd:   "cd {app_dir} && ./mvnw spring-boot:run"
```

4. **Seção "Artefatos que Produzo"** — altere:
   - De: `Seção \`meta\` do \`workspace/prd.json\``
   - Para: `Seção \`meta\` do \`workspace/[projeto]/prd.json\` + diretório \`workspace/[projeto]/\` criado`

---

### 2.7 — Arquivos Bootstrap (todos devem receber a mesma mudança de schema)

Nos seguintes arquivos, localize o bloco JSON de exemplo do `prd.json` e substitua `"app_dir": "apps/..."` por `"app_dir": "~/projects/..."`, adicione `"workspace_dir": "workspace/[projeto]"`, e atualize `visual_check_cmd` para usar o path externo:

**Arquivos a atualizar:**
- `CLAUDE.md`
- `GEMINI.md`
- `.agents/workflows/agent-runner.md`
- `.windsurf/workflows/agent-runner.md`
- `.claude/commands/agent-runner.md`
- `.cursor/commands/agent-runner.md`
- `.cursor/rules/agent-runner.mdc`
- `.roo/commands/agent-runner.md`
- `.github/copilot-instructions.md`
- `.clinerules`

**Substituição em cada um** — localize o bloco JSON e aplique:

```json
// ANTES (exemplo):
"app_dir": "apps/...",
"visual_check_cmd": "grep -c 'var(--color-primary)' apps/.../app/globals.css"

// DEPOIS:
"workspace_dir": "workspace/[nome-do-projeto]",
"app_dir": "~/projects/[nome-do-projeto]",
"visual_check_cmd": "grep -c 'var(--color-primary)' ~/projects/[nome-do-projeto]/app/globals.css"
```

Para os arquivos `.toml` (`.gemini/commands/agent-runner.toml`), aplique a mudança equivalente no formato TOML.

Para os arquivos sem bloco JSON (como `.clinerules`, `.github/copilot-instructions.md`), localize qualquer menção a `apps/[projeto]` ou `apps/nome` e substitua por `~/projects/[nome-do-projeto]`.

---

### 2.8 — `agent/prompts/snapshot_template.md` (se existir referência a `workspace/prd.json`)

Leia o arquivo. Se houver referência a `workspace/prd.json`, altere para `workspace/[projeto]/prd.json`. Adicione campo `workspace_dir` no template de snapshot para registrar o projeto ativo.

---

## Passo 3 — Verificação Final

Após todas as edições, execute uma busca para confirmar que não sobraram referências antigas:

1. Busque por `"apps/"` em todos os arquivos `.md`, `.toml`, `.mdc` do repositório (exceto `workspace/memory/` e arquivos de projetos em `apps/` se ainda existirem).
2. Busque por `"workspace/prd.json"` (sem subdiretório) — deve ter sido substituído por `workspace/[projeto]/prd.json` em todos os lugares.
3. Busque por `"workspace/PRD.md"` (sem subdiretório) — mesmo que acima.
4. Busque por `"workspace/design-system.md"` (sem subdiretório) — mesmo que acima.

Se encontrar referências remanescentes, corrija-as antes de concluir.

---

## Passo 4 — Informar Conclusão

Ao terminar, liste todos os arquivos modificados com uma linha descrevendo o que mudou em cada um.
