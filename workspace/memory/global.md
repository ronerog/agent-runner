# Global Memory — Agent Runner

Este é o arquivo raiz de configuração global do ambiente. Leia sempre na inicialização, após o `agent-brain.md`.

## Configuração de Ambiente

- **PROJECTS_ROOT**: `~/projects`
  - Diretório externo onde os projetos gerados vivem. Configure para o caminho que preferir.
  - Exemplos: `~/projects`, `~/dev/clients`, `/mnt/projetos`
  - **Nunca** use `apps/` dentro do agent-runner — projetos ficam fora do motor.
- **Stack padrão**: Next.js 15 + TypeScript + Tailwind CSS + Prisma (quando aplicável)
- **Package Manager**: `yarn` (nunca `pnpm`, nunca `npm` diretamente)
- **Testes**: Playwright para E2E

## Arquitetura de Separação Motor / Projeto

O agent-runner é o **motor** (fica limpo, publicável no GitHub).
Os projetos gerados ficam em `PROJECTS_ROOT/[nome-do-projeto]/` (fora do motor).

```
~/
├── agent-runner/                   ← motor (este repositório)
│   ├── agent/
│   └── workspace/
│       ├── memory/                 ← memória do agente (cross-project, sempre aqui)
│       └── [nome-do-projeto]/      ← artefatos de planejamento por projeto
│           ├── prd.json
│           ├── PRD.md
│           ├── design-system.md
│           └── requirements.md
│
└── projects/                       ← PROJECTS_ROOT (externo ao motor)
    ├── client-a-ecommerce/         ← repo Git isolado
    └── client-b-saas/              ← repo Git isolado
```

## Estrutura de Memória do Agente

| Arquivo | Propósito | Escopo |
|---------|-----------|--------|
| `workspace/memory/agent-brain.md` | Memória acumulada do agente (todos os projetos) | Global / Cross-project |
| `workspace/memory/global.md` | Configurações e regras do ambiente | Global |
| `workspace/memory/[projeto].md` | Decisões, erros e padrões de cada projeto | Por projeto |
| `workspace/memory/snapshots/latest.md` | Estado da última sessão | Por sessão |
| `workspace/memory/snapshots/[projeto]-final.md` | Snapshot de encerramento de projeto | Por projeto |

## Artefatos de Planejamento por Projeto

Cada projeto tem seus artefatos em `workspace/[nome-do-projeto]/`:

| Arquivo | Propósito |
|---------|-----------|
| `workspace/[projeto]/prd.json` | Estado de orquestração (tarefas + meta) |
| `workspace/[projeto]/PRD.md` | Documento de requisitos |
| `workspace/[projeto]/design-system.md` | Contrato visual (se `has_ui: true`) |
| `workspace/[projeto]/requirements.md` | RFs e RNFs detalhados |

## Quando Criar um Novo Arquivo de Memória de Projeto

Ao iniciar trabalho em qualquer projeto, crie `workspace/memory/[nome-do-projeto].md` com:
1. O que aquele projeto faz (resumo em 2 linhas)
2. Stack específica do projeto (se diferir do padrão)
3. Decisões arquiteturais tomadas
4. Bugs assíncronos ou de build já resolvidos (para não repetir)
5. Bibliotecas instaladas ou removidas com motivo

## Leitura Obrigatória em Cada Sessão

1. `workspace/memory/agent-brain.md` (PRIMEIRO — sempre)
2. `workspace/memory/snapshots/latest.md` (se existir)
3. `workspace/memory/global.md` (este arquivo)
4. `workspace/memory/[projeto].md` (se houver projeto ativo)
