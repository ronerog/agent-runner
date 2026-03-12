#!/bin/bash
# setup_prd.sh - Converte PRD.md em prd.json com tarefas atômicas

if [ ! -f "workspace/PRD.md" ]; then
    echo "Erro: workspace/PRD.md não encontrado. Gere o PRD primeiro."
    exit 1
fi

echo "=== Agent Runner — Convertendo PRD em Tarefas Atômicas ==="
echo ""
echo "[AGENT-INSTRUCTION] ATENÇÃO AGENTE IA:"
echo ""
echo "[AGENT-INSTRUCTION] Leia 'workspace/PRD.md' e 'workspace/requirements/[projeto].md'."
echo "[AGENT-INSTRUCTION] Também leia 'workspace/memory/agent-brain.md' para evitar padrões problemáticos conhecidos."
echo ""
echo "[AGENT-INSTRUCTION] Gere 'workspace/prd.json' com tarefas ATÔMICAS (1 tarefa = 1 arquivo ou 1 comando)."
echo ""
echo "[AGENT-INSTRUCTION] FORMATO OBRIGATÓRIO de cada tarefa:"
echo '[{'
echo '  "id": 1,'
echo '  "role": "dev",'
echo '  "task": "Verbo + objeto conciso",'
echo '  "file": "apps/[projeto]/caminho/exato/arquivo.ext",'
echo '  "instructions": "Instrução COMPLETA e AUTO-SUFICIENTE — inclua o que criar, qual lógica, quais imports, qual comando. Escreva como se a IA não tivesse lido nenhum outro arquivo.",'
echo '  "done_when": "Critério OBJETIVO: arquivo existe / comando roda sem erro / rota retorna 200",'
echo '  "rf": ["RF01"],'
echo '  "status": "pending"'
echo '}]'
echo ""
echo "[AGENT-INSTRUCTION] SEQUÊNCIA OBRIGATÓRIA:"
echo "[AGENT-INSTRUCTION] 1. Setup do projeto (SEMPRE primeira)"
echo "[AGENT-INSTRUCTION] 2. Dependências (yarn add)"
echo "[AGENT-INSTRUCTION] 3. Schema de dados (Prisma)"
echo "[AGENT-INSTRUCTION] 4. Configurações (env, next.config, tailwind)"
echo "[AGENT-INSTRUCTION] 5. Design System (globals.css, layout.tsx, componentes base)"
echo "[AGENT-INSTRUCTION] 6. Backend (server actions, API routes, auth)"
echo "[AGENT-INSTRUCTION] 7. Páginas/telas (uma por tarefa)"
echo "[AGENT-INSTRUCTION] 8. Integrações externas"
echo "[AGENT-INSTRUCTION] 9. Testes E2E"
echo "[AGENT-INSTRUCTION] 10. Documentação (SEMPRE última)"
echo ""
echo "[AGENT-INSTRUCTION] Gere ou atualize 'workspace/prd.json' agora."
echo ""
echo "Aguardando o agente gerar o prd.json..."
