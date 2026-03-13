# Fase PLAN — Planejamento Completo (Execução Única)

Execute como: **Analista → Arquiteto → Designer → Tradutor de Tarefas**.
Este é o único momento de planejamento. Seja exaustivo aqui para não precisar replanejar depois.

---

## Etapa 1: Analista (`agent/roles/analyst.md`)

Leia o pedido do usuário. Pense como Product Owner sênior que conhece o mercado.

**Crie `workspace/PRD.md` contendo:**
- Resumo Executivo: o que é o produto, problema que resolve, para quem
- Personas: perfis dos usuários reais (nome fictício, cargo, necessidade)
- User Stories: "Como [persona], quero [ação] para [benefício]"
- Requisitos Funcionais: `[RF01]`, `[RF02]`, ... (liste TODOS, inclusive os implícitos)
- Requisitos Não-Funcionais: `[RNF01]`, ... (performance, segurança, acessibilidade)
- Fluxo de Telas (diagrama Mermaid): todas as telas, navegação entre elas
- Critérios de Aceite por RF

**Crie `workspace/requirements/[projeto].md`** com a lista completa formatada.

> **Regra do Analista**: Nunca faça apenas o mínimo. Deduza features implícitas que o usuário "esqueceu". Pesquise mentalmente o que produtos reais do mesmo nicho oferecem.

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

Documente no `workspace/PRD.md` (seção técnica):
- Stack escolhida (cada camada justificada)
- Estrutura de pastas completa do projeto
- Schema / modelo de dados
- Padrões de código do projeto (naming, estrutura, convenções da linguagem)

**Defina os comandos de verificação da stack escolhida.** Estes comandos serão usados na Fase EXECUTE para garantir qualidade. Exemplos por stack:

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

**Crie `workspace/design-system.md`** — este arquivo é o **contrato visual** do projeto e é obrigatório. Sem ele, nenhuma tarefa de UI pode ser implementada. Siga o template definido em `agent/roles/designer.md`. Deve conter:
- Todas as variáveis CSS com valores concretos (cores, tipografia, espaçamentos, bordas, sombras)
- URL de import das fontes (Google Fonts ou sistema)
- Lista completa de componentes base a criar em `components/ui/`
- Layout descrito para cada tela principal

**Atualize `workspace/PRD.md`** (seção Design) com:
- Referências visuais do nicho (sites reais similares)
- Intenção estética e mood do projeto
- Resumo das decisões de design

**Defina `visual_check_cmd`** para a seção `meta` do `prd.json` — um grep que confirma se as variáveis CSS estão aplicadas no projeto.

> Se o projeto não tem interface visual (API, CLI, daemon): `has_ui: false`, `visual_check_cmd: null`. O Designer documenta apenas: convenções de output no terminal, formato das respostas JSON, mensagens de erro padronizadas.

---

## Etapa 4: Tradução para Tarefas Atômicas

**Gere `workspace/prd.json`.** O arquivo tem duas seções: `meta` (cabeçalho do projeto) e `tasks` (tarefas atômicas).

### Seção `meta` (preenchida pelo Arquiteto + Designer)

```json
{
  "meta": {
    "project": "nome-do-projeto",
    "stack": "Descrição da stack (ex: Python/Django + PostgreSQL)",
    "app_dir": "apps/nome-do-projeto",
    "check_cmd": "comando que valida se o código está correto (type check, compile check, etc.)",
    "test_cmd": "comando que roda os testes automatizados",
    "lint_cmd": "comando de lint/formatação (null se não aplicável)",
    "run_cmd": "comando para rodar o projeto em dev",
    "has_ui": true,
    "visual_check_cmd": "grep -c 'var(--color-primary)' apps/nome-do-projeto/app/globals.css"
  },
  "tasks": []
}
```

- `has_ui`: `true` se o projeto tem interface visual (web, mobile). `false` para API pura, CLI, daemon.
- `visual_check_cmd`: comando que verifica se as variáveis CSS do Design System estão aplicadas. Deve retornar > 0. Exemplo: `grep -c "var(--color-primary)" apps/proj/app/globals.css`. Se `has_ui: false`, use `null`.

**O `check_cmd` é crítico**: deve ser um comando rápido que falha se o código tiver erros básicos.
- TypeScript: `cd apps/proj && yarn tsc --noEmit`
- Python: `cd apps/proj && python -m py_compile $(find . -name "*.py" | head -20)`
- Go: `cd apps/proj && go build ./...`
- Rust: `cd apps/proj && cargo check`
- Ruby: `cd apps/proj && ruby -c app/**/*.rb`
- Se não houver check rápido disponível: use o `test_cmd` no lugar

### Seção `tasks` — Regras de Atomicidade (CRÍTICO)

- **Uma tarefa = um arquivo OU um comando de terminal**
- O campo `instructions` deve ser **auto-suficiente** — implementável sem ler nenhum outro arquivo
- O campo `done_when` deve ser **testável objetivamente**

```json
{
  "id": 1,
  "role": "dev",
  "task": "Descrição concisa (verbo + objeto)",
  "file": "apps/[projeto]/caminho/exato/do/arquivo.ext",
  "instructions": "Instrução completa e auto-suficiente: o que criar, qual lógica, quais imports, qual comando. Escreva como se a IA não tivesse lido nada antes.",
  "done_when": "Critério objetivo: 'arquivo existe', 'check_cmd roda sem erro', 'rota /X retorna 200'",
  "rf": ["RF01"],
  "status": "pending"
}
```

### Ordem das Tarefas (Sequência Obrigatória)

1. **Setup do projeto** (scaffold inicial, package manager, virtualenv, etc.) — SEMPRE primeira
2. **Dependências** (install de tudo que será usado)
3. **Configurações** (env vars, settings, config files)
4. **Schema / modelo de dados** (migrations, ORM models)
5. **Design System — globals.css** (se `has_ui: true`: OBRIGATÓRIO antes de qualquer tela — cria `app/globals.css` com TODAS as variáveis CSS de `workspace/design-system.md`)
6. **Componentes base** (se `has_ui: true`: cria cada componente listado em `workspace/design-system.md` em `components/ui/`, um por tarefa)
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
- [ ] Se `has_ui: true`: `visual_check_cmd` está definido e `workspace/design-system.md` foi criado
- [ ] Se `has_ui: true`: existe tarefa de globals.css ANTES de qualquer tarefa de tela
- [ ] Se `has_ui: true`: existe tarefa para cada componente base de `workspace/design-system.md`
- [ ] Cada RF do PRD tem pelo menos uma tarefa no `prd.json`
- [ ] A primeira tarefa é o setup do projeto
- [ ] A última tarefa inclui testes
- [ ] Cada tarefa tem `instructions` completas (auto-suficiente, sem depender de leitura externa)
- [ ] Cada tarefa tem `done_when` objetivo e testável
- [ ] `workspace/requirements/[projeto].md` foi criado
- [ ] `workspace/PRD.md` foi criado com todas as seções

Ao concluir, informe:
**"Planejamento concluído. Stack: [stack]. [N] tarefas geradas para [nome do projeto]. Iniciando execução da Tarefa 1."**

Em seguida, inicie imediatamente a Fase EXECUTE sem aguardar confirmação.
