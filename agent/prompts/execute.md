# Contexto de Execução

Ao executar a lista de tarefas do `workspace/prd.json`, siga este loop.
**Leia os papéis em `agent/roles/` para entender qual chapéu vestir em cada momento.**

## Passos a Seguir por Tarefa:
1. Veja todas as tarefas pendentes (`status: pending`). Pegue a primeira.
2. Atualize o `workspace/prd.json` imediatamente, colocando `status: in_progress`.
3. **Chapéu: Desenvolvedor** (`agent/roles/dev.md`):
   - Leia a memória (`workspace/memory/[projeto].md`), os requisitos (`workspace/requirements/[projeto].md`) e as regras gerais (`workspace/memory/global.md`).
   - Vá para a pasta da tarefa (geralmente `/apps/[Projeto]`).
   - Implemente com **AUTONOMIA EXTREMA**. Instale pacotes, crie arquivos, tome decisões. NÃO PEÇA PERMISSÃO.
   - Se tiver dúvida técnica sobre estrutura, leia `agent/roles/architect.md` e siga as diretrizes.
   - Se encontrar requisito faltando, leia `agent/roles/analyst.md` e complemente o PRD antes de continuar.
4. Rode `yarn tsc --noEmit` para garantir compilação.
   - Se falhar, corrija imediatamente (Self-Healing).
5. **Chapéu: QA** (`agent/roles/qa.md`):
   - Rode `yarn playwright test` (ou equivalente) no diretório do projeto.
   - Se os testes falharem, analise: é bug de código? Corrija como Dev. É teste desatualizado? Atualize o teste.
   - **NUNCA avance para a próxima tarefa com testes falhando.**
6. Atualize a memória (`workspace/memory/[projeto].md`).
7. Commit: `./agent/scripts/git_commit.sh "Task [N]: [Resumo]"`.
8. Atualize `workspace/prd.json` para `status: completed`.
9. Atualize `workspace/state.json`.
10. Mova para a próxima tarefa.

## Notas importantes durante a execução
- Nunca altere configurações globais de bash do usuário.
- Se o usuário pausar, retome da primeira tarefa "in_progress".
- Após TODA implementação, passe pelo QA obrigatoriamente.
