---
description: Inicia o motor de execução do Agente Autônomo (Agent Runner) para um novo projeto.
---
# Workflow /agent-runner

Ao receber este comando, a IA deve seguir os seguintes passos:

1. Ler o prompt do usuário com a descrição do sistema/produto.
2. Gerar um documento de requisitos detalhado em `workspace/PRD.md`.
// turbo
3. Converter o PRD em uma lista de tarefas atômicas executando o script de setup:
```bash
./agent/scripts/setup_prd.sh
```
// turbo
4. Iniciar o motor de execução do agente:
```bash
./agent/scripts/agent_run.sh
```
