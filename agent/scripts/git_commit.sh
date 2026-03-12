#!/bin/bash
# git_commit.sh - Commits automáticos com baseada na tarefa atual

if [ -z "$1" ]; then
    MSG="Automated agent commit"
    echo "Aviso: Nenhuma mensagem recebida. Usando mensagem padrão."
else
    MSG="$1"
fi

echo "Verificando alterações..."
if [[ -z $(git status -s) ]]; then
    echo "Nenhuma alteração detectada para commit."
    exit 0
fi

echo "Adicionando arquivos..."
git add .
git commit -m "[AGENT-RUNNER] $MSG"

if [ $? -eq 0 ]; then
    echo "Commit realizado com sucesso: $MSG"
else
    echo "Erro ao commitar."
    exit 1
fi
exit 0
