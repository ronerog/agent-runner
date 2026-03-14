Ao receber este comando com o caminho/nome do projeto e descrição das tasks em $ARGUMENTS, execute o Modo INJECT do Agent Runner.

Formato esperado: `<caminho-ou-nome> — <descrição das tasks>`
Exemplo: `~/projects/meu-projeto — Adicionar endpoint de estatísticas de usuário e corrigir bug no login`

Leia e execute `agent/prompts/inject.md` imediatamente.

Passo 0: Carregar contexto (agent-brain.md + global.md + snapshot se existir)
Fase 1 — AUDIT: Entender o sistema existente (README, estrutura, stack, padrões)
Fase 2 — TASK SYNTHESIS: Criar prd.json com apenas as tasks solicitadas
Fase 3 — EXECUTE: Executar usando agent/prompts/execute.md
