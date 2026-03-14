# Protocolo de Início de Sessão — Resume

Sempre que uma nova conversa for iniciada (usuário disse "continuar", "continue" ou similares):

## Passo 1 — Carregar Memória do Agente

Leia **obrigatoriamente** nesta ordem:
1. `workspace/memory/agent-brain.md` — acumulado de todos os projetos anteriores
2. `workspace/memory/snapshots/latest.md` — estado da última sessão
3. `workspace/memory/global.md` — regras globais do ambiente

## Passo 2 — Restaurar Contexto do Projeto

Do `snapshots/latest.md`, extraia:
- Qual é o projeto ativo?
- Qual tarefa estava `in_progress` ou foi a última `completed`?
- Quais eram os próximos passos?
- Há bloqueios ou erros pendentes?

Leia também:
4. `workspace/[projeto]/prd.json` — estado atual das tarefas
5. `workspace/memory/[projeto].md` — contexto do projeto ativo

## Passo 3 — Retomar Sem Perguntas

Identifique a primeira tarefa com `status: "pending"` ou `"in_progress"` no `prd.json`.

Informe ao usuário em uma linha:
```
Contexto restaurado. Retomando Task [id]: [nome da tarefa].
```

Em seguida, inicie a execução imediatamente.

## Regra

**Nunca faça perguntas redundantes ao retomar.** O snapshot contém todo o contexto necessário. Se algo estiver ambíguo, assuma a interpretação mais razoável e execute. Se houver divergência crítica, mencione em uma linha e continue.
