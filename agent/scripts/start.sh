#!/bin/bash
# start.sh — Ponto de entrada universal do Agent Runner para terminal
#
# Uso:
#   Novo projeto:  ./agent/scripts/start.sh "Crie um app de finanças pessoais"
#   Retomar:       ./agent/scripts/start.sh
#
# Com AI CLIs:
#   claude  "$(./agent/scripts/start.sh 'Crie um app de finanças')"
#   aider   --message "$(./agent/scripts/start.sh 'Crie um app de finanças')"
#   gemini  "$(./agent/scripts/start.sh 'Crie um app de finanças')"

PROJECT_DESC="$*"
INSTRUCTIONS=$(cat agent/prompts/instructions.md 2>/dev/null || echo "[ERRO: agent/prompts/instructions.md não encontrado]")
BRAIN=$(cat workspace/memory/agent-brain.md 2>/dev/null || echo "")
SNAPSHOT=$(cat workspace/memory/snapshots/latest.md 2>/dev/null || echo "")

# --- RESUME ---
if [ -z "$PROJECT_DESC" ] && [ -f "workspace/memory/snapshots/latest.md" ]; then
  RESUME=$(cat agent/prompts/resume.md 2>/dev/null || echo "")
  echo "=== AGENT RUNNER — RETOMAR SESSÃO ==="
  echo ""
  echo "$RESUME"
  echo ""
  echo "--- SNAPSHOT DA ÚLTIMA SESSÃO ---"
  echo "$SNAPSHOT"
  echo ""
  if [ -n "$BRAIN" ]; then
    echo "--- AGENT BRAIN (resumo) ---"
    echo "$BRAIN" | head -60
  fi
  exit 0
fi

# --- NOVO PROJETO ---
echo "=== AGENT RUNNER — NOVO PROJETO ==="
echo ""
echo "$INSTRUCTIONS"
echo ""
if [ -n "$BRAIN" ]; then
  echo "--- AGENT BRAIN ---"
  echo "$BRAIN"
  echo ""
fi
if [ -n "$PROJECT_DESC" ]; then
  echo "--- PROJETO A CONSTRUIR ---"
  echo "$PROJECT_DESC"
else
  echo "[Nenhum projeto descrito. Solicite ao usuário o que deve ser construído.]"
fi
