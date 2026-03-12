#!/bin/bash
# agent_run.sh - Motor de execução local (Agent Runner)

if [ ! -f "workspace/prd.json" ]; then
    echo "Erro: workspace/prd.json não encontrado. O agente parece não ter convertido o PRD."
    exit 1
fi

echo "Iniciando o motor de execução Agent Runner..."
echo "---"
echo "[AGENT-INSTRUCTION] ATENÇÃO AGENTE IA:"
echo "[AGENT-INSTRUCTION] Inicie o seguinte ciclo autônomo baseado no 'workspace/prd.json':"
echo "[AGENT-INSTRUCTION] Para CADA tarefa que estiver com status 'pending' no json:"
echo "[AGENT-INSTRUCTION] 1. Altere o status no json para 'in_progress'."
echo "[AGENT-INSTRUCTION] 2. Leia as memórias em workspace/memory/ e os prompts em agent/prompts/ (instructions.md, execute.md) para garantir o contexto."
echo "[AGENT-INSTRUCTION] 3. Gere e modifique os arquivos ou rode os comandos bash necessários."
echo "[AGENT-INSTRUCTION] 4. Rode 'bash agent/scripts/run_checks.sh' para garantir a integridade da compilação e testes."
echo "[AGENT-INSTRUCTION] 5. Se houver falha, corrija e re-rode o check AUTONOMAMENTE."
echo "[AGENT-INSTRUCTION] 6. Estando perfeito, rode 'bash agent/scripts/git_commit.sh \"[Task N] <resumo>\"' para comitar no git."
echo "[AGENT-INSTRUCTION] 7. Atualize a tarefa para 'completed' no prd.json."
echo "[AGENT-INSTRUCTION] INICIE AGORA a primeira tarefa pendente."
echo "---"
