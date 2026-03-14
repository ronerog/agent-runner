#!/bin/bash
# setup_prd.sh - Converte PRD.md em prd.json com tarefas atômicas
# Suporta nova estrutura workspace/[projeto]/

PROJECT_NAME="${1:-}"

if [ -z "$PROJECT_NAME" ]; then
    echo "Uso: bash agent/scripts/setup_prd.sh <nome-do-projeto>"
    echo "Exemplo: bash agent/scripts/setup_prd.sh meu-saas"
    exit 1
fi

PROJECT_DIR="workspace/$PROJECT_NAME"

if [ ! -f "$PROJECT_DIR/PRD.md" ]; then
    echo "Erro: $PROJECT_DIR/PRD.md não encontrado. Gere o PRD primeiro."
    echo "O Analista cria o PRD.md em workspace/[projeto]/ durante a Fase PLAN."
    exit 1
fi

echo "=== Agent Runner — Convertendo PRD em Tarefas Atômicas ==="
echo "Projeto: $PROJECT_NAME | Dir: $PROJECT_DIR"
echo ""
echo "[AGENT-INSTRUCTION] ATENÇÃO AGENTE IA:"
echo ""
echo "[AGENT-INSTRUCTION] Leia '$PROJECT_DIR/PRD.md' e '$PROJECT_DIR/requirements.md'."
echo "[AGENT-INSTRUCTION] Também leia 'workspace/memory/agent-brain.md' seção Hot Rules."
echo ""
echo "[AGENT-INSTRUCTION] Gere '$PROJECT_DIR/prd.json' com tarefas ATÔMICAS (1 tarefa = 1 arquivo ou 1 comando)."
echo ""
echo "[AGENT-INSTRUCTION] FORMATO OBRIGATÓRIO de cada tarefa:"
echo '{'
echo '  "meta": {'
echo "    \"project\": \"$PROJECT_NAME\","
echo '    "stack": "...",'
echo "    \"workspace_dir\": \"workspace/$PROJECT_NAME\","
echo "    \"app_dir\": \"~/projects/$PROJECT_NAME\","
echo '    "check_cmd": "...", "test_cmd": "...", "lint_cmd": "...", "run_cmd": "...",'
echo '    "has_ui": true,'
echo '    "visual_check_cmd": "..."'
echo '  },'
echo '  "tasks": [{'
echo '    "id": 1, "type": "setup",'
echo '    "task": "Verbo + objeto conciso",'
echo "    \"file\": \"~/projects/$PROJECT_NAME/caminho/arquivo.ext\","
echo '    "instructions": "Instrução COMPLETA e AUTO-SUFICIENTE",'
echo '    "done_when": "Critério OBJETIVO",'
echo '    "rf": ["RF01"], "status": "pending"'
echo '  }]'
echo '}'
echo ""
echo "[AGENT-INSTRUCTION] SEQUÊNCIA OBRIGATÓRIA:"
echo "[AGENT-INSTRUCTION] 1. Setup do projeto (SEMPRE primeira) — mkdir + git init em app_dir"
echo "[AGENT-INSTRUCTION] 2. Dependências"
echo "[AGENT-INSTRUCTION] 3. Schema de dados"
echo "[AGENT-INSTRUCTION] 4. Configurações"
echo "[AGENT-INSTRUCTION] 5. Design System (se has_ui: true — globals.css + componentes base)"
echo "[AGENT-INSTRUCTION] 6. Backend / lógica de negócio"
echo "[AGENT-INSTRUCTION] 7. Páginas/telas (uma por tarefa — APÓS Design System)"
echo "[AGENT-INSTRUCTION] 8. Integrações externas"
echo "[AGENT-INSTRUCTION] 9. Testes"
echo "[AGENT-INSTRUCTION] 10. Documentação (SEMPRE última)"
echo ""
echo "[AGENT-INSTRUCTION] Gere ou atualize '$PROJECT_DIR/prd.json' agora."
echo ""
echo "Aguardando o agente gerar o prd.json..."
