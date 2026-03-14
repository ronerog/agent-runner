# Fase PLAN — Planejamento Completo (Execução Única)

Execute como: **Analista → Arquiteto → Designer → Tradutor de Tarefas**.
Este é o único momento de planejamento. Seja exaustivo aqui para não precisar replanejar depois.

---

## Etapa 1: Analista (`agent/roles/analyst.md`)

Leia o pedido do usuário. Pense como Product Owner sênior que conhece o mercado.

**Crie `workspace/[projeto]/PRD.md` contendo:**
- Resumo Executivo: o que é o produto, problema que resolve, para quem
- Personas: perfis dos usuários reais (nome fictício, cargo, necessidade)
- User Stories: "Como [persona], quero [ação] para [benefício]"
- Requisitos Funcionais: `[RF01]`, `[RF02]`, ... (liste TODOS, inclusive os implícitos)
- Requisitos Não-Funcionais: `[RNF01]`, ... (performance, segurança, acessibilidade)
- Fluxo de Telas (diagrama Mermaid): todas as telas, navegação entre elas
- Critérios de Aceite por RF

**Crie `workspace/[projeto]/requirements.md`** com a lista completa formatada.

> **Regra do Analista**: Nunca faça apenas o mínimo. Deduza features implícitas que o usuário "esqueceu". Pesquise mentalmente o que produtos reais do mesmo nicho oferecem.

---

## Etapa 1b: Data Scientist (`agent/roles/data-scientist.md`) — apenas se projeto de dados

**Invoque após o Analista** quando o projeto envolver análise de dados, estatística, ML, biostatística ou visualização analítica.

O Data Scientist define:
- Metodologia estatística adequada (quais testes, modelos, validações)
- Estratégia de dados (EDA, tratamento de missing, normalização)
- Requisitos de reprodutibilidade (seeds, versioning, relatório)
- Task types de dados no prd.json: `notebook`, `pipeline`, `viz`, `model`, `report`, `r-script`, `r-shiny`

Adicione no PRD.md (seção técnica): "Metodologia Estatística" com os métodos escolhidos e justificativas.

> Se o projeto é puramente de dados (sem web app), o Designer pode ser dispensado (`has_ui: false`).

---

## Etapa 2: Arquiteto (`agent/roles/architect.md`)

Com base no PRD, defina a stack mais adequada para o projeto. **Não existe stack padrão obrigatória** — escolha a melhor ferramenta para o problema. Justifique cada escolha.

Exemplos de decisões válidas:
- App com muita lógica de UI e SEO → Next.js + TypeScript + Prisma
- API REST de alta performance → Go + Chi + PostgreSQL
- App de dados / ML → Python + FastAPI + SQLAlchemy
- App web tradicional com admin rico → Python + Django + SQLite/PostgreSQL
- CLI tool → Rust ou Go
- App mobile → React Native ou Flutter

Documente no `workspace/[projeto]/PRD.md` (seção técnica):
- Stack escolhida (cada camada justificada)
- Estrutura de pastas completa do projeto
- Schema / modelo de dados
- Padrões de código do projeto (naming, estrutura, convenções da linguagem)

**Defina os comandos de verificação da stack escolhida.** Estes comandos serão usados na Fase EXECUTE para garantir qualidade.

> **Atenção**: `app_dir` deve ser o path absoluto fora do agent-runner. Leia `PROJECTS_ROOT` de `workspace/memory/global.md` e use `{PROJECTS_ROOT}/[nome-do-projeto]`. Crie o diretório `workspace/[projeto]/` para os artefatos de planejamento.

Exemplos por stack:

| Stack | check_cmd | test_cmd | lint_cmd | run_cmd |
|-------|-----------|----------|----------|---------|
| Next.js/TS | `yarn tsc --noEmit` | `yarn playwright test` | `yarn lint` | `yarn dev` |
| Python/Django | `python manage.py check` | `python -m pytest` | `flake8 .` | `python manage.py runserver` |
| Python/FastAPI | `python -m py_compile app/main.py` | `python -m pytest` | `flake8 .` | `uvicorn app.main:app --reload` |
| Go | `go build ./...` | `go test ./...` | `golint ./...` | `go run .` |
| Ruby/Rails | `rails db:schema:load` | `rails test` | `rubocop` | `rails server` |
| Rust | `cargo check` | `cargo test` | `cargo clippy` | `cargo run` |

---

## Etapa 3: Designer (`agent/roles/designer.md`)

Com base no PRD e stack, se o projeto tem interface visual (`has_ui: true`):

**Crie `workspace/[projeto]/design-system.md`** — este arquivo é o **contrato visual** do projeto e é obrigatório. Sem ele, nenhuma tarefa de UI pode ser implementada. Siga o template definido em `agent/roles/designer.md`. Deve conter:
- Todas as variáveis CSS com valores concretos (cores, tipografia, espaçamentos, bordas, sombras)
- URL de import das fontes (Google Fonts ou sistema)
- Lista completa de componentes base a criar em `components/ui/`
- Layout descrito para cada tela principal

**Atualize `workspace/[projeto]/PRD.md`** (seção Design) com:
- Referências visuais do nicho (sites reais similares)
- Intenção estética e mood do projeto
- Resumo das decisões de design

**Defina `visual_check_cmd`** para a seção `meta` do `prd.json` — um grep que confirma se as variáveis CSS estão aplicadas no projeto.

> Se o projeto não tem interface visual (API, CLI, daemon): `has_ui: false`, `visual_check_cmd: null`. O Designer documenta apenas: convenções de output no terminal, formato das respostas JSON, mensagens de erro padronizadas.

---

## Etapa 4: Tradução para Tarefas Atômicas

**Gere `workspace/[projeto]/prd.json`.** O arquivo tem duas seções: `meta` (cabeçalho do projeto) e `tasks` (tarefas atômicas).

### Seção `meta` (preenchida pelo Arquiteto + Designer)

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
    "visual_check_cmd": "grep -c 'var(--color-primary)' ~/projects/nome-do-projeto/app/globals.css",
    "use_build_container": false,
    "container_image": null,
    "container_name": null,
    "container_workspace": "/workspace",
    "container_ports": [],
    "container_volumes": []
  },
  "tasks": []
}
```

- `has_ui`: `true` se o projeto tem interface visual (web, mobile). `false` para API pura, CLI, daemon.
- `visual_check_cmd`: comando que verifica se as variáveis CSS do Design System estão aplicadas. Deve retornar > 0. Exemplo: `grep -c "var(--color-primary)" {app_dir}/app/globals.css`. Se `has_ui: false`, use `null`.
- `use_build_container`: `true` quando a stack requer instalação de runtimes/ferramentas que não devem ser instaladas na máquina do usuário (R, Go, Rust, Java, Python com extensões C). `false` para stacks leves (Node.js, Python puro). Veja `agent/roles/architect.md` seção "Docker de Build Temporário" para critérios e imagens recomendadas.
- `container_image`: imagem Docker base (ex: `rocker/tidyverse:4.5`, `python:3.12-slim`, `golang:1.22-alpine`). Obrigatório se `use_build_container: true`.
- `container_name`: nome do container (padrão: `build-[nome-do-projeto]`). Obrigatório se `use_build_container: true`.
- `container_workspace`: diretório de trabalho dentro do container (padrão: `/workspace`).
- `container_ports`: portas para expor ao host (ex: `["8787:8787"]`).
- `container_volumes`: volumes montados. Sempre inclua `["{app_dir}:/workspace"]`.

**O `check_cmd` é crítico**: deve ser um comando rápido que falha se o código tiver erros básicos.
- TypeScript: `cd {app_dir} && yarn tsc --noEmit`
- Python: `cd {app_dir} && python -m py_compile $(find . -name "*.py" | head -20)`
- Go: `cd {app_dir} && go build ./...`
- Rust: `cd {app_dir} && cargo check`
- Ruby: `cd {app_dir} && ruby -c app/**/*.rb`
- Se não houver check rápido disponível: use o `test_cmd` no lugar

### Seção `tasks` — Regras de Atomicidade (CRÍTICO)

- **Uma tarefa = um arquivo OU um comando de terminal**
- O campo `instructions` deve ser **auto-suficiente** — implementável sem ler nenhum outro arquivo
- O campo `done_when` deve ser **testável objetivamente**

```json
{
  "id": 1,
  "role": "dev",
  "type": "backend",
  "task": "Descrição concisa (verbo + objeto)",
  "file": "{app_dir}/caminho/exato/do/arquivo.ext",
  "instructions": "Instrução completa e auto-suficiente: o que criar, qual lógica, quais imports, qual comando. Escreva como se a IA não tivesse lido nada antes.",
  "done_when": "Critério objetivo: 'arquivo existe', 'check_cmd roda sem erro', 'rota /X retorna 200'",
  "rf": ["RF01"],
  "status": "pending"
}
```

**Campo `type` — valores válidos e seus pipelines:**

| `type` | Quando usar | Pipeline |
|--------|------------|---------|
| `setup` | Scaffold, package.json, virtualenv, renv::init(), estrutura de pastas | Dev → commit |
| `config` | .env.example, settings, tsconfig, docker-compose | Dev → QA(check) → commit |
| `schema` | Models, migrations, Prisma schema, entidades | Dev → QA(check) → commit |
| `backend` | Services, controllers, API routes, lógica de negócio | Dev → QA(check+lint) → commit |
| `ui-setup` | globals.css com variáveis CSS do Design System | Dev → QA(check) → VV → commit |
| `ui-component` | Componentes em `components/ui/` | Dev → QA(check+lint) → VV → commit |
| `ui-screen` | Páginas e telas da aplicação | Dev → QA(check+lint) → VV → commit |
| `integration` | Email, pagamento, storage, APIs externas | Dev → QA(check+test) → commit |
| `test` | Testes E2E, unitários, de integração | QA → Dev(se falhar) → commit |
| `docs` | README, documentação | Dev(light) → commit |
| `notebook` | Jupyter notebook ou Quarto/R Markdown | Dev+DS → QA(check) → commit |
| `pipeline` | ETL, transformação de dados, ingestão | Dev → QA(check+test) → commit |
| `viz` | Visualização de dados (matplotlib, ggplot2, plotly) | Dev+DS → QA(check) → commit |
| `model` | Modelo estatístico ou ML (treino, avaliação, salvamento) | Dev+DS → QA(check+test) → commit |
| `report` | Relatório final (quarto render, PDF, HTML exportado) | Dev+DS → QA(check) → commit |
| `r-script` | Script R standalone ou função em pacote R | Dev → QA(check+lint) → commit |
| `r-shiny` | Aplicativo Shiny interativo | Dev → QA(check+lint) → VV → commit |

### Ordem das Tarefas (Sequência Obrigatória)

1. **Setup do projeto** (scaffold inicial, package manager, virtualenv, etc.) — SEMPRE primeira
2. **Dependências** (install de tudo que será usado)
3. **Configurações** (env vars, settings, config files)
4. **Schema / modelo de dados** (migrations, ORM models)
5. **Design System — globals.css** (se `has_ui: true`: OBRIGATÓRIO antes de qualquer tela — cria `app/globals.css` com TODAS as variáveis CSS de `workspace/[projeto]/design-system.md`)
6. **Componentes base** (se `has_ui: true`: cria cada componente listado em `workspace/[projeto]/design-system.md` em `components/ui/`, um por tarefa)
7. **Backend / lógica de negócio** (services, controllers, views, API routes)
8. **Frontend / Interface** (uma tela/página por tarefa — SEMPRE após Design System e Componentes Base)
9. **Integrações externas** (APIs, emails, pagamentos)
10. **Testes** (uma tarefa por fluxo crítico)
11. **Documentação** — SEMPRE última

> **Regra de bloqueio**: nenhuma tarefa de Frontend/Interface pode ser criada antes das tarefas de Design System (globals.css) e Componentes Base. A ordem é lei.

---

## Checklist de Validação do Plano

Antes de finalizar, verifique item por item:

- [ ] Seção `meta` do `prd.json` está completa com `check_cmd` e `test_cmd` válidos para a stack
- [ ] `has_ui` está definido corretamente (`true` para projetos com interface, `false` para API/CLI)
- [ ] Se `has_ui: true`: `visual_check_cmd` está definido e `workspace/[projeto]/design-system.md` foi criado
- [ ] `use_build_container` avaliado: se a stack requer runtime pesado (R, Go, Rust, Java), está `true` com `container_image` definida
- [ ] Se `use_build_container: true`: `check_cmd`/`test_cmd`/`lint_cmd` escritos para execução dentro do container (sem `docker exec` — o script adiciona automaticamente)
- [ ] Se `has_ui: true`: existe tarefa de globals.css ANTES de qualquer tarefa de tela
- [ ] Se `has_ui: true`: existe tarefa para cada componente base de `workspace/[projeto]/design-system.md`
- [ ] Cada RF do PRD tem pelo menos uma tarefa no `prd.json`
- [ ] A primeira tarefa é o setup do projeto
- [ ] A última tarefa inclui testes
- [ ] Cada tarefa tem `instructions` completas (auto-suficiente, sem depender de leitura externa)
- [ ] Cada tarefa tem `done_when` objetivo e testável
- [ ] Diretório `workspace/[projeto]/` foi criado com PRD.md, prd.json e (se `has_ui`) design-system.md
- [ ] `workspace/[projeto]/requirements.md` foi criado
- [ ] `workspace/[projeto]/PRD.md` foi criado com todas as seções

### Guardrails do PLAN (para qualquer modelo)

> **NÃO PULE O PLAN.** Modelos que pulam o planejamento gastam mais tokens em debugging e refatoração do que gastaram planejando. O PLAN é investimento, não custo.

Antes de finalizar o PLAN, verifique:
1. O `prd.json` tem seção `meta` com TODOS os campos preenchidos?
2. Cada task tem `type`, `instructions` (auto-suficiente), e `done_when` (testável)?
3. Se `has_ui: true`: existe task `ui-setup` ANTES de qualquer `ui-screen`?
4. A primeira task é `setup`? A última inclui `test` ou `docs`?

Se qualquer resposta for "não" → corrija ANTES de iniciar EXECUTE.

Ao concluir, informe:
**"Planejamento concluído. Stack: [stack]. [N] tarefas geradas para [nome do projeto]. Iniciando execução da Tarefa 1."**

Em seguida, inicie imediatamente a Fase EXECUTE sem aguardar confirmação.
