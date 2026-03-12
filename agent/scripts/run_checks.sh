#!/bin/bash
# run_checks.sh - Verificações de integridade do Agent Runner
# Os comandos são lidos da seção "meta" do workspace/prd.json
# Não há nenhum comando hardcoded — tudo vem da stack definida pelo Arquiteto

echo "=== Agent Runner — Verificações de Integridade ==="

if [ ! -f "workspace/prd.json" ]; then
    echo "Aviso: workspace/prd.json não encontrado. Verificação ignorada."
    exit 0
fi

# Lê os comandos da seção meta do prd.json (requer jq)
if ! command -v jq &> /dev/null; then
    echo "Aviso: 'jq' não encontrado. Não é possível ler os comandos do prd.json automaticamente."
    echo "Instale jq ou execute os comandos manualmente conforme definido em workspace/prd.json > meta"
    exit 0
fi

CHECK_CMD=$(jq -r '.meta.check_cmd // empty' workspace/prd.json)
TEST_CMD=$(jq -r '.meta.test_cmd // empty' workspace/prd.json)
LINT_CMD=$(jq -r '.meta.lint_cmd // empty' workspace/prd.json)

# Check principal (type check, compile check, etc.)
if [ -n "$CHECK_CMD" ]; then
    echo "[CHECK] Rodando verificação de código: $CHECK_CMD"
    eval "$CHECK_CMD"
    if [ $? -ne 0 ]; then
        echo "ERRO CRÍTICO no check de código!"
        echo "Comando: $CHECK_CMD"
        echo "O agente deve intervir para corrigir antes de continuar."
        exit 1
    fi
    echo "[CHECK] ✓ Código válido"
else
    echo "[CHECK] Nenhum check_cmd definido em prd.json > meta. Pulando."
fi

# Lint
if [ -n "$LINT_CMD" ] && [ "$LINT_CMD" != "null" ]; then
    echo "[LINT] Rodando lint: $LINT_CMD"
    eval "$LINT_CMD"
    LINT_EXIT=$?
    if [ $LINT_EXIT -ne 0 ]; then
        echo "AVISO: Erros de lint encontrados. Corrija antes de continuar."
        # Lint não é fatal por padrão — ajuste se necessário
    else
        echo "[LINT] ✓ Lint passou"
    fi
fi

# Testes (opcional — só roda se TEST_CMD estiver definido e for solicitado explicitamente)
if [ "$1" == "--with-tests" ] && [ -n "$TEST_CMD" ]; then
    echo "[TESTES] Rodando testes: $TEST_CMD"
    eval "$TEST_CMD"
    if [ $? -ne 0 ]; then
        echo "ERRO CRÍTICO nos testes!"
        echo "Comando: $TEST_CMD"
        echo "O agente deve intervir para corrigir."
        exit 1
    fi
    echo "[TESTES] ✓ Testes passaram"
fi

echo ""
echo "=== Verificações concluídas com sucesso ==="
exit 0
