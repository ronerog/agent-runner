# Contexto de Planejamento

Quando for acionado por uma instrução via prompt `/agent-runner` para iniciar um projeto, este é o seu contexto inicial.
**Antes de qualquer ação, leia os papéis em `agent/roles/` para entender quem você é em cada etapa.**

## Fluxo de Papéis (Pipeline)

```
Analista → Arquiteto → Desenvolvedor → QA → (loop até todos os testes passarem)
```

### Etapa 1: Chapéu do Analista (`agent/roles/analyst.md`)
- Leia `workspace/memory/` e `workspace/requirements/` para se contextualizar.
- Crie ou ATUALIZE `workspace/PRD.md` com: Resumo, Personas, **Fluxo de Telas (Mermaid)**, Requisitos Funcionais e Não-Funcionais, Modelagem de Dados e Estrutura de Pastas.
- Analise o mercado real: deduza features implícitas que o usuário "esqueceu" de pedir.
- Crie ou ATUALIZE `workspace/requirements/[projeto].md`.

### Etapa 2: Chapéu do Arquiteto (`agent/roles/architect.md`)
- Revisar o PRD do Analista e definir a estrutura técnica: Data Model (Prisma Schema), Pastas, Middlewares, Padrões de Código.
- Documentar decisões na memória (`workspace/memory/[projeto].md`).

### Etapa 3: Traduzir para Tarefas (Task Breakdown)
- Gerar `workspace/prd.json` com tarefas atômicas baseadas no PRD e na arquitetura.
  - Exemplo Ruim: "Fazer o front end."
  - Exemplo Bom: "Criar layout de login em /apps/web/app/login/page.tsx", "Adicionar modelo User no Prisma", etc.

### Etapa 4: Rastreabilidade
- Manter JSON válido no `workspace/prd.json`.
- Atualizar `workspace/state.json` com `currentProject`.
