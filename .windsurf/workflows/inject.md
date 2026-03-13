---
description: Modo INJECT — trabalha em projeto existente executando apenas as tasks solicitadas. Uso: /inject <caminho> — <tasks>
---
# Workflow /inject

Ao receber o caminho/nome do projeto e descrição das tasks, execute o Modo INJECT do Agent Runner.

Leia e execute `agent/prompts/inject.md` imediatamente.

Passo 0: Carregar contexto (agent-brain.md + global.md + snapshot se existir)
Fase 1 — AUDIT: Entender o sistema existente (README, estrutura, stack, padrões)
Fase 2 — TASK SYNTHESIS: Criar prd.json com apenas as tasks solicitadas
Fase 3 — EXECUTE: Executar usando agent/prompts/execute.md
