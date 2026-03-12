#!/bin/bash
# run_checks.sh - Garante que a aplicação está íntegra

echo "Iniciando verificações de integridade (Agent Runner)..."

if [ ! -d "apps" ]; then
    echo "Nenhuma pasta /apps encontrada. Verificação ignorada."
    exit 0
fi

cd apps || exit 1

for D in */; do
    if [ -d "${D}" ]; then
        # Remove trailing slash
        DIR_NAME=${D%/}
        echo "Verificando projeto: ${DIR_NAME}..."
        
        cd "${DIR_NAME}" || continue
        
        if [ -f "package.json" ]; then
            # Verifica se build existe no package.json
            if grep -q '"build"' package.json; then
                echo "[CHECK] Rodando npm run build em ${DIR_NAME}..."
                npm run build
                if [ $? -ne 0 ]; then
                    echo "ERRO CRÍTICO no build de ${DIR_NAME}!"
                    echo "O agente deve intervir para corrigir o código."
                    exit 1
                fi
            fi

            # Verifica se test existe no package.json
            if grep -q '"test"' package.json; then
                # Algum pacote padrao diz test script run explicitly, ignora se for "echo"
                if ! grep -q '"test".*echo \"Error: no test specified\"' package.json; then
                    echo "[CHECK] Rodando npm test em ${DIR_NAME}..."
                    npm test
                    if [ $? -ne 0 ]; then
                        echo "ERRO CRÍTICO nos testes de ${DIR_NAME}!"
                        echo "O agente deve intervir para corrigir."
                        exit 1
                    fi
                fi
            fi
        fi

        # Playwright Test
        if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
            echo "[CHECK] Rodando Playwright E2E em ${DIR_NAME}..."
            npx playwright test
            if [ $? -ne 0 ]; then
                echo "ERRO CRÍTICO no Playwright E2E em ${DIR_NAME}!"
                echo "O agente deve intervir para corrigir."
                exit 1
            fi
        fi

        cd ..
    fi
done

echo "Todas as verificações concluídas com sucesso!"
exit 0
