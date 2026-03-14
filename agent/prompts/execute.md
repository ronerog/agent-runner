# Fase EXECUTE + VERIFY — Loop por Tarefa

Execute este loop para **cada tarefa** do `workspace/[projeto]/prd.json`, uma de cada vez, em ordem crescente de ID.

> Referência de roteamento e escalação: `agent/prompts/orchestrator.md`

---

## Passo 0 — Releitura de Contexto (SEMPRE ao entrar nesta fase)

Antes de executar qualquer tarefa, garanta que você leu:
1. `workspace/memory/agent-brain.md` — leia completo na primeira entrada nesta fase. Nas releituras (re-injeção a cada 5 tasks), foque em: Hot Rules, Anti-Padrões Conhecidos, e seção da stack do projeto.
2. `workspace/memory/snapshots/latest.md` — se existir, estado da sessão anterior
3. `workspace/memory/global.md` — configuração do ambiente (`PROJECTS_ROOT`)

> **ATENÇÃO — todos os modelos**: Sem `agent-brain.md`, você repetirá erros já documentados. Este passo é **obrigatório** e **não pode ser pulado**, mesmo que pareça economizar tempo.

### Checkpoint de Re-Injeção (a cada 5 tasks completadas)

A cada 5 tarefas completadas, execute este refresh:
1. Releia `meta` do `prd.json` (comandos podem ter sido esquecidos)
2. Releia "Anti-Padrões Conhecidos" do `agent-brain.md`
3. Se > 40 trocas na sessão → acione Manager para snapshot

> Isso previne drift de contexto em sessões longas.

---

## Antes de Começar: Ler Metadados

Leia a seção `meta` do `workspace/[projeto]/prd.json` (path em `meta.workspace_dir`, ou escaneie `workspace/` por subdiretórios com `prd.json`):

```json
"meta": {
  "project": "nome",
  "stack": "Python/Django",
  "workspace_dir": "workspace/nome",
  "app_dir": "~/projects/nome",
  "check_cmd": "cd ~/projects/nome && python manage.py check",
  "test_cmd":  "cd ~/projects/nome && python -m pytest",
  "lint_cmd":  "cd ~/projects/nome && flake8 .",
  "run_cmd":   "cd ~/projects/nome && python manage.py runserver",
  "has_ui": true,
  "visual_check_cmd": "grep -c 'var(--color-primary)' ~/projects/nome/app/globals.css"
}
```

Estes são os únicos comandos de verificação desta sessão. Não invente comandos.

---

## Roteamento por Tipo de Tarefa

Antes de executar cada tarefa, leia `task.type` e selecione o pipeline:

| `type` | Pipeline Obrigatório | Passos que PULA |
|--------|---------------------|-----------------|
| `setup` | Dev → commit | lint, visual, test |
| `config` | Dev → QA(check) → commit | lint, visual, test |
| `schema` | Dev → QA(check) → commit | lint, visual, test |
| `backend` | Dev → QA(check + lint) → test(se crítico) → commit | visual |
| `ui-setup` | Dev → QA(check) → VisualValidator → commit | lint, test |
| `ui-component` | Dev → QA(check + lint) → VisualValidator → commit | test |
| `ui-screen` | Dev → QA(check + lint) → VisualValidator → commit | test |
| `integration` | Dev → QA(check + test) → commit | visual |
| `test` | QA → Dev(fix se necessário) → commit | visual, lint |
| `docs` | Dev(light) → commit | check, lint, visual, test |
| `notebook` | Dev + DataScientist → QA(check) → commit | lint, visual, test |
| `pipeline` | Dev → QA(check + test) → commit | visual |
| `viz` | Dev + DataScientist → QA(check) → commit | test |
| `model` | Dev + DataScientist → QA(check + test) → commit | visual |
| `report` | Dev + DataScientist → QA(check) → commit | lint, test |
| `r-script` | Dev → QA(check + lint) → commit | visual |
| `r-shiny` | Dev → QA(check + lint) → VisualValidator → commit | test |

> **Se `task.type` estiver ausente**: trate como `backend` (pipeline completo menos visual).

> **Nota para tarefa `setup` (sempre a primeira):** antes de qualquer instalação de dependência, execute:
> ```bash
> mkdir -p {app_dir}
> cd {app_dir} && git init
> ```
> Use o valor de `meta.app_dir` do `prd.json`. Isso garante que o projeto já nasce como repositório Git isolado fora do agent-runner.
>
> **Se `meta.use_build_container: true`:** após criar o diretório e `git init`, inicie o container de build:
> ```bash
> bash agent/scripts/docker_build_env.sh start {container_name} {container_image} {app_dir} {container_workspace} "{container_ports}" "{container_volumes}"
> ```
> A partir deste ponto, **todos os comandos de execução** (instalação de dependências, check_cmd, test_cmd, lint_cmd) devem ser executados via:
> ```bash
> bash agent/scripts/docker_build_env.sh exec {container_name} "comando aqui"
> ```
> O Dev e o QA usam o script para executar comandos dentro do container — nunca instalam nada na máquina do usuário.

> **Para tipos `notebook`, `viz`, `model`, `report`, `r-script`**: Após `IMPL_READY`, execute o **Gate Estatístico** antes do Gate Técnico do QA:
> 1. Data Scientist executa Protocolo de Validação Estatística (`agent/roles/data-scientist.md` seção "Fase VERIFY")
> 2. Sinal `DS_PASS` → QA executa `check_cmd` normalmente
> 3. Sinal `DS_FAIL:[motivo]` → Dev + DS corrigem → repete validação (máx 2x) → ainda falha: `ESCALADA DS → Architect`

---

## Protocolo por Tarefa

### Passo 1 — Selecionar + Rotear

```
SINAL DE ENTRADA → ORCHESTRATOR
```

- Leia `workspace/[projeto]/prd.json`. Pegue a **primeira tarefa** com `status: "pending"`.
- Se **não houver tarefas pendentes** → vá para a **Fase de Validação Final**.
- Leia `task.type` → selecione o pipeline da tabela acima.
- Atualize para `status: "in_progress"` imediatamente.
- Informe: `⚙ Iniciando Task [id]/[total]: [nome] (type: [type])`

### Passo 2 — Carregar Contexto Mínimo (por tipo)

**Sempre carregue:**
1. `workspace/memory/agent-brain.md` — Hot Rules + seção de anti-padrões + seção da stack do projeto
2. Campo `instructions` da tarefa atual — auto-suficiente

**Adicione se o tipo exigir:**
- Tarefa de `ui-*`: + `workspace/[projeto]/design-system.md`
- Tarefa de `schema`: + modelos existentes (verificar conflitos)
- Tarefa de `backend`: + `workspace/memory/[projeto].md` (decisões técnicas)

**Nunca carregue para economizar tokens:**
- PRD completo a cada tarefa
- Todas as tasks anteriores
- Arquivos que não são `task.file`

### Passo 3 — Implementar

```
ROLE: Desenvolvedor | INPUT: task.instructions + contexto mínimo
```

- Crie ou modifique o arquivo exato em `task.file`.
- Siga `task.instructions` à risca.
- Para tarefas `ui-*`: use **exclusivamente** variáveis CSS de `workspace/[projeto]/design-system.md`. Nunca valores hardcoded de cor, fonte ou espaçamento.
- Instale dependências:
  - Node.js: `yarn add [pacote]`
  - Python: `pip install [pacote]` + `requirements.txt`
  - Go: `go get [módulo]`
  - Rust: `cargo add [crate]`
  - Ruby: `bundle add [gem]`
- **NUNCA** deixe TODOs, placeholders ou imports não utilizados.
- **NUNCA** peça permissão. Decida e implemente.

```
SINAL DE SAÍDA (Dev) → IMPL_READY | arquivo task.file criado/modificado
```

### Passo 4 — Gate Técnico

```
ROLE: QA | INPUT: task.done_when + meta.check_cmd
```

Execute `meta.check_cmd`.

| Resultado | Ação |
|-----------|------|
| ✓ PASS | Continue → Passo 4.5 (se `ui-*`) ou Passo 5 |
| ✗ FAIL (tentativa 1 ou 2) | Leia o erro → Dev corrige → re-execute |
| ✗ FAIL (tentativa 3) | `ESCALADA: Dev → Architect` com erro exato → marque `blocked` → próxima task |

```
SINAL DE SAÍDA (QA) → QA_PASS | QA_FAIL:[erro] | QA_BLOCKED
```

### Passo 4.5 — Gate Visual *(apenas tarefas `ui-*` com `meta.has_ui: true`)*

```
ROLE: QA + Visual Validator | INPUT: design-system.md + arquivo implementado
```

**4.5a — Check de variáveis CSS:**
Execute `meta.visual_check_cmd`.
- Retorna 0 → FAIL: Dev reimplementa com `var(--nome-da-variavel)` (máx 2 tentativas)
- Se após 2 tentativas ainda 0 → `ESCALADA: Dev → Designer` com CSS atual

**4.5b — Checklist Visual Validator** (`agent/roles/visual-validator.md`):
Execute o Checklist de Conformidade Visual completo.
- Falhas → Dev corrige antes de avançar.

```
SINAL DE SAÍDA → VV_PASS | VV_FAIL:[item específico]
```

### Passo 5 — Verificar `done_when`

```
ROLE: QA | INPUT: task.done_when
```

Verifique objetivamente se o critério de conclusão foi atendido.
- **Sim** → continue
- **Não** → volte ao Passo 3

### Passo 6 — Lint *(pula para `setup`, `config`, `schema`, `ui-setup`, `test`, `docs`)*

Execute `meta.lint_cmd`. Erros bloqueiam. Warnings não.

### Passo 7 — Testes *(apenas `backend` com lógica crítica, `integration`, `test`)*

Execute `meta.test_cmd`.

| Resultado | Ação |
|-----------|------|
| ✓ PASS | Continue |
| ✗ Bug de código | Dev corrige → volta Passo 3 |
| ✗ Teste desatualizado | QA atualiza o teste (comportamento mudou legitimamente) |
| ✗ Bug arquitetural | `ESCALADA: QA → Architect` com descrição técnica |

**NUNCA avance com testes falhando** (exceto se a task atual É a criação dos testes).

### Passo 7.5 — Checkpoint PRD *(a cada 3 tasks `ui-*` concluídas — `meta.has_ui: true`)*

Conte tasks de UI concluídas. Se múltiplo de 3:

```
ROLE: QA | Checkpoint de Conformidade PRD
```

- [ ] Cores implementadas correspondem à paleta do Design System?
- [ ] Fontes definidas pelo Designer estão sendo usadas?
- [ ] Componentes base existem em `components/ui/`?
- [ ] Nenhuma tela tem CSS genérico sem Design System?

Falha → crie task de correção com `type: "ui-screen"` e `status: "pending"` no final do `prd.json`.

### Passo 8 — Commit

```bash
bash agent/scripts/git_commit.sh "Task [id]: [task resumida]"
```

### Passo 9 — Atualizar Estado

```
SINAL → prd.json: task.status = "completed"
```

- Marque `status: "completed"`.
- Se tomou decisão técnica relevante → adicione em `workspace/memory/[projeto].md`:
  ```
  - [DECISÃO] Task [id]: [decisão] | [motivo]
  ```

### Passo 10 — LEARN Rápido

```
ROLE: Learner | INPUT: erros e decisões desta task (somente)
```

Execute Ciclo Rápido de `agent/prompts/learn.md`:
- Erro inesperado → `workspace/memory/[projeto].md`
- Padrão recorrente → `workspace/memory/agent-brain.md`
- Nada novo → **silêncio** (não gere output — economize tokens)

### Passo 11 — Informar Progresso

```
✓ Task [id]/[total]: [nome da tarefa] (type: [type]) — [N] restantes
```

**→ Volte ao Passo 1.**

---

## Fase de Validação Final Integrada

Quando **nenhuma tarefa pendente** existir, antes de declarar o projeto finalizado:

### Gate Técnico Final

```
ROLE: QA
```

1. Execute `meta.check_cmd` — deve passar
2. Execute `meta.test_cmd` — todos os testes devem passar
3. Execute Checklist de Segurança Mínima (`agent/roles/qa.md`)

### Gate Visual Final *(apenas se `meta.has_ui: true`)*

```
ROLE: Visual Validator | INPUT: design-system.md + todas as telas implementadas
```

Execute seção "Validação Final Integrada" de `agent/roles/visual-validator.md`:
1. Cada variável CSS de `design-system.md` está em `globals.css`?
2. Cada tela do PRD tem arquivo de implementação?
3. Todas as telas passam no "teste do primeiro olhar"?
4. Consistência visual entre todas as telas?

**Se qualquer gate falhar:**
- Crie tasks de correção no `prd.json` com tipo correto
- Execute essas tasks
- Repita a Validação Final

### Cleanup do Container de Build *(apenas se `meta.use_build_container: true`)*

Antes de declarar o projeto concluído, pare e remova o container de build:
```bash
bash agent/scripts/docker_build_env.sh stop {container_name}
```
Isso remove o container e libera recursos. A imagem base permanece em cache local do Docker para reutilização futura.

### Declarar Projeto Concluído

Só após **ambos os gates passarem** (e cleanup do container, se aplicável) → execute Fase LEARN GLOBAL (`agent/prompts/learn.md` Ciclo Profundo).

---

## Regras de Ferro

> **Para modelos simples**: Se só lembrar 3 regras, lembre: (1) UMA tarefa por vez, (2) execute check_cmd SEMPRE, (3) commite após cada task.

| # | Regra | Detalhe |
|---|-------|---------|
| 1 | **Leia `meta` primeiro** | Comandos de verificação vêm do `prd.json`, nunca hardcoded |
| 2 | **Roteie por `task.type`** | Nunca execute passos irrelevantes para o tipo da tarefa |
| 3 | **Uma tarefa por vez** | Nunca implemente duas simultaneamente |
| 4 | **Não pule tarefas** | Bloqueio → marque `blocked`, documente, continue |
| 5 | **`completed` é permanente** | Nunca altere status de task completada |
| 6 | **Nova tarefa?** | Adicione ao final do `prd.json` com ID maior + `rf` vinculado |
| 7 | **Contexto saturando?** | Acione Manager **ANTES** que a qualidade degrede (> 40 trocas) |
| 8 | **Design System é gate** | Sem `design-system.md`: nenhuma task `ui-*` pode iniciar |
| 9 | **Validação Final obrigatória** | Nunca declare projeto concluído sem ela |
| 10 | **Escalation é do Orchestrator** | Após 3 falhas, siga a Escalation Matrix — não improvise |
| 11 | **Re-injeção a cada 5 tasks** | Releia meta + anti-padrões para prevenir drift |
| 12 | **Releia instructions ANTES de implementar** | 2 campos curtos vs. refazer trabalho errado |
