#!/bin/bash
# start-r.sh — Inicializador do Agent Runner para projetos R / RStudio
#
# Uso no terminal do RStudio (ou qualquer terminal):
#   bash agent/scripts/start-r.sh "Construir análise de sobrevivência com os dados em data/clinical.csv"
#   bash agent/scripts/start-r.sh  ← sem argumento, retoma sessão anterior
#
# Requer: Claude Code CLI instalado (npm install -g @anthropic-ai/claude-code)

set -e

PROJECT_DESC="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Verificar se R está disponível
if command -v Rscript &> /dev/null; then
  R_VERSION=$(Rscript --version 2>&1 | head -1)
  echo "R disponível: $R_VERSION"
else
  echo "Aviso: R não encontrado no PATH. Análises R não serão executáveis."
fi

# Verificar se renv está disponível no projeto atual (se em subdir de R)
if [ -f "renv.lock" ]; then
  echo "renv.lock encontrado. Restaurando ambiente R..."
  Rscript -e "if (!requireNamespace('renv', quietly=TRUE)) install.packages('renv'); renv::restore()"
fi

# Gerar prompt de contexto
if [ -z "$PROJECT_DESC" ] && [ -f "${AGENT_ROOT}/workspace/memory/snapshots/latest.md" ]; then
  # Modo retomada
  PROMPT=$(cat <<EOF
Leia agent/prompts/resume.md e workspace/memory/snapshots/latest.md.
Retome a sessão anterior sem fazer perguntas.
Stack: R/Python para análise de dados. Terminal ativo: RStudio.
EOF
)
elif [ -n "$PROJECT_DESC" ]; then
  PROMPT=$(cat <<EOF
$(cat "${AGENT_ROOT}/agent/prompts/instructions.md")

---

Projeto: ${PROJECT_DESC}

Contexto de ambiente:
- Terminal: RStudio Terminal panel (ou terminal standalone)
- R disponível: $(command -v Rscript &>/dev/null && echo "sim" || echo "não")
- Python disponível: $(command -v python3 &>/dev/null && echo "sim" || echo "não")
- Diretório de trabalho: $(pwd)

Se o projeto usa R: use renv para gerenciamento de pacotes (renv::init(), renv::install(), renv::snapshot()).
Se o projeto usa Python: use venv ou conda.
Projetos de análise de dados devem usar Quarto (.qmd) para relatórios reprodutíveis.
EOF
)
else
  echo "Uso: bash agent/scripts/start-r.sh 'descrição do projeto'"
  echo "       bash agent/scripts/start-r.sh   (para retomar sessão)"
  exit 1
fi

echo ""
echo "Agent Runner — Modo R/Data Science"
echo "===================================="
echo "$PROMPT"
