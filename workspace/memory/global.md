# Global Memory — Agent Runner

Este é o arquivo raiz de configuração global do ambiente. Leia sempre na inicialização, após o `agent-brain.md`.

## Arquitetura Global

- **Monorepo**: todos os projetos vivem em `apps/[nome-do-projeto]/`
- **Stack padrão**: Next.js 15 + TypeScript + Tailwind CSS + Prisma
- **Package Manager**: `yarn` (nunca `pnpm`, nunca `npm` diretamente)
- **Testes**: Playwright para E2E

## Estrutura de Memória do Agente

| Arquivo | Propósito | Escopo |
|---------|-----------|--------|
| `workspace/memory/agent-brain.md` | Memória acumulada do agente (todos os projetos) | Global / Cross-project |
| `workspace/memory/global.md` | Configurações e regras do ambiente | Global |
| `workspace/memory/[projeto].md` | Decisões, erros e padrões de cada projeto | Por projeto |
| `workspace/memory/snapshots/latest.md` | Estado da última sessão | Por sessão |
| `workspace/memory/snapshots/[projeto]-final.md` | Snapshot de encerramento de projeto | Por projeto |

## Quando Criar um Novo Arquivo de Memória de Projeto

Ao iniciar trabalho em qualquer projeto em `apps/`, crie `workspace/memory/[nome-do-projeto].md` com:
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
