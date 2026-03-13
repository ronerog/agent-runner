# Fase EXECUTE + VERIFY — Loop por Tarefa

Execute este loop para **cada tarefa** do `workspace/prd.json`, uma de cada vez, em ordem crescente de ID.

---

## Antes de Começar: Ler os Metadados da Stack

Leia a seção `meta` do `workspace/prd.json`. Ela define os comandos de verificação e flags do projeto:

```json
"meta": {
  "project": "nome",
  "stack": "Python/Django",
  "app_dir": "apps/nome",
  "check_cmd": "cd apps/nome && python manage.py check",
  "test_cmd": "cd apps/nome && python -m pytest",
  "lint_cmd": "cd apps/nome && flake8 .",
  "run_cmd": "cd apps/nome && python manage.py runserver",
  "has_ui": true,
  "visual_check_cmd": "grep -c 'var(--color-primary)' apps/nome/app/globals.css"
}
```

- `has_ui`: se `true`, ativa verificações visuais nas tarefas de UI
- `visual_check_cmd`: comando para confirmar se as variáveis CSS do Design System estão aplicadas

Estes são os únicos comandos de verificação que você vai usar nesta sessão. Não invente comandos.

---

## Protocolo por Tarefa (11 Passos)

### Passo 1 — Selecionar Tarefa
- Leia `workspace/prd.json`.
- Pegue a **primeira tarefa** com `status: "pending"`.
- Se não houver tarefas pendentes: **projeto concluído** → vá para a **Fase de Validação Final** (abaixo) antes da Fase LEARN GLOBAL.
- Atualize a tarefa selecionada para `status: "in_progress"` no `prd.json` imediatamente.

### Passo 2 — Carregar Contexto Mínimo (Economia de Tokens)
Leia **apenas**:
1. `workspace/memory/agent-brain.md` — anti-padrões globais a evitar
2. `workspace/memory/[projeto].md` — contexto e decisões do projeto (se existir)
3. O campo `instructions` da tarefa atual — é auto-suficiente

**Exceção para tarefas de UI** (quando `meta.has_ui: true` e a tarefa cria/modifica telas ou componentes):
- Leia também `workspace/design-system.md` — variáveis CSS e componentes definidos pelo Designer
- Se `workspace/design-system.md` não existir: **bloqueie** a tarefa, escale ao Designer para criá-lo e crie uma tarefa de prioridade máxima no prd.json para produzir esse arquivo.

### Passo 3 — Implementar (Papel: Desenvolvedor)
- Crie ou modifique o arquivo exato em `task.file`.
- Siga `task.instructions` à risca.
- Para tarefas de UI: implemente usando exclusivamente as variáveis CSS e componentes de `workspace/design-system.md`. Nunca use valores hardcoded de cor, fonte ou espaçamento.
- Instale dependências conforme a stack:
  - Node.js: `yarn add [pacote]`
  - Python: `pip install [pacote]` e atualize `requirements.txt`
  - Go: `go get [módulo]`
  - Rust: `cargo add [crate]`
  - Ruby: `bundle add [gem]`
- **NUNCA deixe TODOs, placeholders ou código comentado inacabado.**
- **NUNCA peça permissão ao usuário.** Tome a decisão e implemente.

### Passo 4 — Verificar Código (Papel: QA)
Execute o `meta.check_cmd` definido na seção `meta` do `prd.json`.

Exemplos do que pode ser:
- `cd apps/proj && yarn tsc --noEmit` (TypeScript)
- `cd apps/proj && python manage.py check` (Django)
- `cd apps/proj && go build ./...` (Go)
- `cd apps/proj && cargo check` (Rust)

**Se passar**: continue para o Passo 4.5 (se UI) ou Passo 5.
**Se falhar**: leia o erro, corrija, repita. Máximo **3 tentativas**.
**Se após 3 tentativas ainda falhar**: marque como `status: "blocked"`, documente o erro exato em `workspace/memory/[projeto].md`, e continue para a próxima tarefa.

### Passo 4.5 — Verificar Design System (Papel: QA + Visual Validator) — apenas se `meta.has_ui: true` e tarefa é de UI

Execute `meta.visual_check_cmd`. Se retornar 0 ou falhar:
- A tarefa não aplicou o Design System corretamente
- Volte ao Dev (Passo 3): reimplemente usando `var(--nome-da-variavel)` em vez de valores hardcoded
- Máximo 2 tentativas de correção

Se passou: invoque `agent/roles/visual-validator.md` — execute o **Checklist de Conformidade Visual** para esta tarefa.

Se qualquer item do checklist falhar: volte ao Dev para correção antes de continuar.

### Passo 5 — Verificar Critério de Conclusão (Papel: QA)
Verifique se `task.done_when` foi atendido objetivamente.
- **Se sim**: continue para o Passo 6.
- **Se não**: volte ao Passo 3.

### Passo 6 — Lint (Papel: QA) — se `meta.lint_cmd` não for null
Execute `meta.lint_cmd`. Se houver erros (não apenas warnings): corrija antes de continuar.

### Passo 7 — Testes (Papel: QA) — se aplicável
Execute `meta.test_cmd` apenas se:
- A tarefa atual é uma tarefa de teste OU
- A tarefa anterior modificou lógica de negócio crítica

Se falhar:
- Bug de código → corrija como Dev, volte ao Passo 3
- Teste desatualizado → atualize o teste para refletir o comportamento correto
- Bug arquitetural → documente em `workspace/memory/[projeto].md`, escale na próxima sessão

**NUNCA avance com testes falhando** (exceto se a tarefa atual é a criação dos próprios testes).

### Passo 7.5 — Checkpoint de Conformidade PRD (a cada 3 tarefas de UI) — apenas se `meta.has_ui: true`

Conte as tarefas de UI concluídas nesta sessão. Se for múltiplo de 3 (3, 6, 9...):

Execute o **Checkpoint PRD** do `agent/roles/qa.md`:
- [ ] Cores implementadas correspondem à paleta do PRD?
- [ ] Fontes definidas pelo Designer estão sendo usadas?
- [ ] Componentes base listados foram criados em `components/ui/`?
- [ ] Nenhuma tela tem CSS genérico sem o Design System?

Se houver falha: crie uma tarefa de correção no `prd.json` com ID maior e execute antes de prosseguir.

### Passo 8 — Commit
```bash
bash agent/scripts/git_commit.sh "Task [id]: [task resumida]"
```

### Passo 9 — Atualizar Estado
- Marque a tarefa como `status: "completed"` no `prd.json`.
- Se tomou decisão técnica relevante: adicione em `workspace/memory/[projeto].md`:
  ```
  - [DECISÃO] Task [id]: [o que foi decidido e por quê]
  ```

### Passo 10 — LEARN Rápido (Papel: Learner)
Execute o **Ciclo Rápido** de `agent/prompts/learn.md`:
- Erro inesperado? → documente em `workspace/memory/[projeto].md`
- Padrão recorrente? → adicione em `workspace/memory/agent-brain.md`
- Nada novo? → **não gere output**. Continue.

### Passo 11 — Informar Progresso
Informe ao usuário: `✓ Task [id]/[total]: [nome da tarefa] — [N] restantes`

**Volte ao Passo 1.**

---

## Fase de Validação Final Integrada (antes da Fase LEARN GLOBAL)

Quando todas as tarefas pendentes estiverem concluídas, **antes** de declarar o projeto finalizado:

### Validação Técnica Final
1. Execute `meta.check_cmd` — deve passar sem erros
2. Execute `meta.test_cmd` — todos os testes devem passar
3. Execute o **Checklist de Segurança Mínima** de `agent/roles/qa.md`

### Validação Visual Final (apenas se `meta.has_ui: true`)
Invoque `agent/roles/visual-validator.md` — execute a seção **"Validação Final Integrada"** completa:
1. Leia `workspace/design-system.md` — extraia todas as variáveis CSS
2. Confirme que cada variável está declarada em `globals.css`
3. Liste todas as telas do PRD — confirme que cada uma tem arquivo de implementação
4. Verifique se todas as telas passam no "teste do primeiro olhar"
5. Confirme consistência visual entre todas as telas

Se a Validação Visual Final encontrar falhas:
- Crie tarefas de correção no `prd.json`
- Execute essas tarefas antes de concluir
- Repita a Validação Visual Final

### Declarar Projeto Concluído
Só após aprovação em **ambas** as validações (técnica + visual), execute a Fase LEARN GLOBAL.

---

## Regras de Ferro

| Regra | Detalhe |
|-------|---------|
| Leia `meta` primeiro | Os comandos de verificação vêm do `prd.json`, nunca hardcoded |
| Uma tarefa por vez | Nunca implemente duas tarefas simultaneamente |
| Não pule tarefas | Bloqueio → marque `blocked`, documente, continue |
| Nunca altere `completed` | É permanente |
| Nova tarefa necessária? | Adicione ao final do `prd.json` com ID maior, nunca altere tarefas existentes |
| Contexto saturando | Acione Manager ANTES que a qualidade degrede |
| Design System é gate | Para projetos com UI: sem `workspace/design-system.md`, nenhuma tela pode ser implementada |
| Validação Final é obrigatória | Nunca declare projeto concluído sem a Validação Final Integrada |
