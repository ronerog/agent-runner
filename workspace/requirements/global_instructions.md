# Instruções de Requisitos - Analista de Requisitos Sênior

A pasta `workspace/requirements/` é onde o agente atua como "Analista/PM/PO" do projeto, guardando o detalhamento profundo do escopo.

## O Que Esperar Desta Pasta:
Sempre que o agente iniciar as atividades do Agent Runner por um `/agent-runner` para iniciar um projeto zero, ele deve pensar se o PRD original gerado é raso.

O Agente DEVE criar um arquivo `workspace/requirements/[nome-do-projeto].md` para cada projeto em `apps/` documentando a lista extensa de RFCs (Requisitos Funcionais) enumerados, RNFs (Requisitos não-funcionais) enumerados e um pequeno Backlog do Futuro, baseado no escopo e no objetivo geral do software.

**Exemplo Prático**: Se o projeto for um "Saas de Clínica Médica", o agente logo de cara criará na pasta requirements:
- `[RF01] O sistema deve permitir o cadastro de médicos`.
- `[RF02] O sistema deve enviar email no agendamento.`
- `[RNF01] O sistema deve ter banco de dados relacional PostgreSQL`.

Isso serve para que no futuro, ao criar o Plano (`prd.json`), o Agent Runner já extraia as tarefas detalhistas não apenas do PRD inicial (que pode ser raso), mas deste escopo corporativo. 

Leia o `global.md` e os arquivos de requirements do projeto ANTES de qualquer alteração de feature na codebase do projeto alvo.
