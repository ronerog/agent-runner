#!/bin/bash
# setup_prd.sh - Converte PRD.md em prd.json (tarefas atômicas)

if [ ! -f "workspace/PRD.md" ]; then
    echo "Erro: workspace/PRD.md não encontrado. Por favor, gere o documento primeiro."
    exit 1
fi

echo "Iniciando conversão do PRD para lista de tarefas atômicas..."
echo "---"
echo "[AGENT-INSTRUCTION] ATENÇÃO AGENTE IA:"
echo "[AGENT-INSTRUCTION] 1. Leia atentamente o conteúdo de 'workspace/PRD.md'."
echo "[AGENT-INSTRUCTION] 2. Quebre a implementação em uma lista de tarefas pequenas e consecutivas."
echo "[AGENT-INSTRUCTION] 3. Crie no arquivo 'workspace/prd.json' um array JSON com as tarefas."
echo "[AGENT-INSTRUCTION] Estrutura esperada de cada objeto no JSON:"
echo '[{"id": 1, "task": "Setup monorepo structure in /apps", "status": "pending"}]'
echo "[AGENT-INSTRUCTION] Por favor, gere ou atualize o 'workspace/prd.json' agora mesmo."
echo "---"
echo "Aguardando o agente criar o prd.json..."
