# Agent Brain — Memória Acumulada do Agent Runner

Este arquivo é a **memória viva do agente**, acumulada ao longo de TODOS os projetos executados.
É diferente da memória de projeto (`workspace/memory/[projeto].md`), que é específica por projeto.

**LEIA ESTE ARQUIVO ANTES DE QUALQUER AÇÃO.** É aqui que vive a sabedoria empírica do agente.

---

## Regras Absolutas (Gravadas em Pedra)

- **Stack é decisão do Arquiteto** — não existe stack padrão obrigatória. Use a melhor ferramenta para o problema.
- Os **comandos de verificação** (`check_cmd`, `test_cmd`, etc.) são definidos na seção `meta` do `prd.json` pelo Arquiteto. Nunca hardcode comandos no execute.
- Manter `node_modules`, `__pycache__`, `target/`, `vendor/`, `.venv` no `.gitignore`
- Planejar UMA VEZ, executar linearmente — nunca replanejar a meio caminho
- Uma tarefa por vez — nunca implementar múltiplas tarefas simultaneamente
- Commitar após cada tarefa concluída — progresso incremental e reversível
- **Se travar 3x no mesmo erro**: documente em `agent-brain.md` e siga em frente

---

## Regras por Linguagem (acumuladas com o uso)

### Node.js / TypeScript
- Usar `yarn` — nunca `pnpm` ou `npm` diretamente
- TypeScript strict — `any` só com comentário explicativo
- `'use server'` em Server Actions, `'use client'` apenas para interatividade

### Python
- Sempre usar ambiente virtual (`python -m venv .venv` ou `virtualenv`)
- Type hints em todas as funções públicas
- `requirements.txt` deve estar sempre atualizado após `pip install`
- Nunca hardcode secrets — usar variáveis de ambiente

### Go
- Tratar todos os erros explicitamente (`if err != nil`)
- `go.sum` deve ser commitado junto com `go.mod`

*(Esta seção cresce com o uso — o Learner adiciona regras por linguagem conforme aprende)*

---

## Padrões Aprendidos

*(Populado automaticamente pelo Learner após cada projeto.)*

---

## Anti-Padrões Conhecidos

*(Erros que o agente já cometeu e não deve repetir. Populado automaticamente.)*

---

## Histórico de Projetos

| Projeto | Stack | Data | Tarefas | Concluídas | Bloqueadas | Aprendizados |
|---------|-------|------|---------|------------|------------|--------------|
| *(nenhum ainda)* | — | — | — | — | — | — |

---

## Notas de Auto-Melhoria

*(O agente registra aqui quando atualiza seus próprios papéis ou fluxos.)*

---

> Este arquivo cresce a cada projeto concluído. Se estiver vazio após múltiplos projetos, a Fase LEARN não está sendo executada corretamente.
