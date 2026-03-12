# Fase EXECUTE + VERIFY — Loop por Tarefa

Execute este loop para **cada tarefa** do `workspace/prd.json`, uma de cada vez, em ordem crescente de ID.

---

## Antes de Começar: Ler os Metadados da Stack

Leia a seção `meta` do `workspace/prd.json`. Ela define os comandos de verificação para a stack deste projeto:

```json
"meta": {
  "project": "nome",
  "stack": "Python/Django",
  "app_dir": "apps/nome",
  "check_cmd": "cd apps/nome && python manage.py check",
  "test_cmd": "cd apps/nome && python -m pytest",
  "lint_cmd": "cd apps/nome && flake8 .",
  "run_cmd": "cd apps/nome && python manage.py runserver"
}
```

Estes são os únicos comandos de verificação que você vai usar nesta sessão. Não invente comandos.

---

## Protocolo por Tarefa (10 Passos)

### Passo 1 — Selecionar Tarefa
- Leia `workspace/prd.json`.
- Pegue a **primeira tarefa** com `status: "pending"`.
- Se não houver tarefas pendentes: **projeto concluído** → execute Fase LEARN GLOBAL (`agent/prompts/learn.md` ciclo profundo).
- Atualize a tarefa selecionada para `status: "in_progress"` no `prd.json` imediatamente.

### Passo 2 — Carregar Contexto Mínimo (Economia de Tokens)
Leia **apenas**:
1. `workspace/memory/agent-brain.md` — anti-padrões globais a evitar
2. `workspace/memory/[projeto].md` — contexto e decisões do projeto (se existir)
3. O campo `instructions` da tarefa atual — é auto-suficiente

> Não releia PRD, requirements ou outros arquivos a menos que `instructions` instrua especificamente.

### Passo 3 — Implementar (Papel: Desenvolvedor)
- Crie ou modifique o arquivo exato em `task.file`.
- Siga `task.instructions` à risca.
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
- `cd apps/proj && python -m py_compile app/main.py` (Python genérico)

**Se passar**: continue para o Passo 5.
**Se falhar**: leia o erro, corrija, repita. Máximo **3 tentativas**.
**Se após 3 tentativas ainda falhar**: marque como `status: "blocked"`, documente o erro exato em `workspace/memory/[projeto].md`, e continue para a próxima tarefa.

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

Informe ao usuário: `✓ Task [id]/[total]: [nome da tarefa] — [N] restantes`

**Volte ao Passo 1.**

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
