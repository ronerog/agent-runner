#!/bin/bash
# agent_run.sh - Motor de execução do Agent Runner (RALPH LOOP)
# Busca prd.json em workspace/[projeto]/ (nova estrutura desacoplada)

# Encontrar prd.json em qualquer subdiretório de workspace/
PRD_FILE=$(find workspace/ -maxdepth 2 -name "prd.json" -not -path "workspace/memory/*" 2>/dev/null | head -1)

if [ -z "$PRD_FILE" ]; then
    echo "Erro: Nenhum prd.json encontrado em workspace/*/."
    echo "Execute primeiro o planejamento via /agent-runner ou setup_prd.sh"
    exit 1
fi

PROJECT_DIR=$(dirname "$PRD_FILE")
PROJECT_NAME=$(basename "$PROJECT_DIR")

echo "=== Agent Runner — RALPH LOOP ==="
echo "Projeto: $PROJECT_NAME | prd.json: $PRD_FILE"
echo ""
echo "[AGENT-INSTRUCTION] ATENÇÃO AGENTE IA — RALPH LOOP INICIANDO:"
echo ""
echo "[AGENT-INSTRUCTION] PASSO 0 — CARREGAR CONTEXTO (OBRIGATÓRIO):"
echo "[AGENT-INSTRUCTION] Leia a seção 'meta' do $PRD_FILE para saber a stack e os comandos de verificação."
echo ""
echo "[AGENT-INSTRUCTION] PASSO 0b — CARREGAR MEMÓRIA (OBRIGATÓRIO):"
echo "[AGENT-INSTRUCTION] 1. Leia workspace/memory/agent-brain.md — seção Hot Rules + Anti-Padrões"
echo "[AGENT-INSTRUCTION] 2. Leia workspace/memory/snapshots/latest.md (se existir)"
echo "[AGENT-INSTRUCTION] 3. Leia workspace/memory/global.md"
echo "[AGENT-INSTRUCTION] 4. Leia workspace/memory/$PROJECT_NAME.md (se existir)"
echo ""
echo "[AGENT-INSTRUCTION] LOOP POR TAREFA (repita até não haver mais tarefas pendentes):"
echo "[AGENT-INSTRUCTION] --- EXECUTE ---"
echo "[AGENT-INSTRUCTION] 1. Leia $PRD_FILE e pegue a primeira tarefa com status 'pending'"
echo "[AGENT-INSTRUCTION] 2. Atualize status para 'in_progress'"
echo "[AGENT-INSTRUCTION] 3. Leia task.instructions + task.done_when (auto-suficientes)"
echo "[AGENT-INSTRUCTION] 4. Implemente o arquivo em task.file com autonomia total"
echo "[AGENT-INSTRUCTION] --- VERIFY ---"
echo "[AGENT-INSTRUCTION] 5. Execute meta.check_cmd definido na seção 'meta' do prd.json"
echo "[AGENT-INSTRUCTION]    Se falhar: corrija. Máximo 3 tentativas. Depois marque como 'blocked'."
echo "[AGENT-INSTRUCTION] 6. Verifique se task.done_when foi atendido"
echo "[AGENT-INSTRUCTION] 7. Se task.type = ui-*: execute visual_check_cmd + Visual Validator"
echo "[AGENT-INSTRUCTION] --- COMMIT ---"
echo "[AGENT-INSTRUCTION] 8. Rode: bash agent/scripts/git_commit.sh 'Task [id]: [resumo]'"
echo "[AGENT-INSTRUCTION] 9. Atualize status para 'completed' no prd.json"
echo "[AGENT-INSTRUCTION] --- LEARN ---"
echo "[AGENT-INSTRUCTION] 10. Algo novo a aprender? Se sim: documente. Se não: silêncio (economize tokens)."
echo "[AGENT-INSTRUCTION] → Volte ao passo 1 com a próxima tarefa"
echo "[AGENT-INSTRUCTION] → A cada 5 tasks: releia meta + anti-padrões (prevenir drift)"
echo ""
echo "[AGENT-INSTRUCTION] RELATÓRIO A CADA TAREFA:"
echo "[AGENT-INSTRUCTION] Informe: '✓ Task [id]/[total]: [nome] (type:[type]) — [N] restantes'"
echo ""
echo "[AGENT-INSTRUCTION] AO CONCLUIR TODAS AS TAREFAS:"
echo "[AGENT-INSTRUCTION] Execute Validação Final Integrada (técnica + visual)"
echo "[AGENT-INSTRUCTION] Execute o Ciclo Profundo de agent/prompts/learn.md"
echo "[AGENT-INSTRUCTION] Atualize workspace/memory/agent-brain.md com padrões do projeto"
echo ""
echo "=== INICIE AGORA com o PASSO 0 ==="
