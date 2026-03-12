# Fase LEARN — Aprendizado Empírico (Learner Role)

Este é o mecanismo que transforma o Agent Runner de um executor em um **ser que aprende**.
Execute após cada tarefa (Ciclo Rápido) e ao final de cada projeto (Ciclo Profundo).

---

## Ciclo Rápido (Após Cada Tarefa — máximo 30 segundos mental)

Responda mentalmente estas 3 perguntas:

1. **Houve algum erro inesperado durante a tarefa?**
   - Sim → Documente em `workspace/memory/[projeto].md` no formato:
     ```
     - [ERRO] Task [id]: [descrição do erro] → [como foi resolvido]
     ```

2. **O erro é recorrente (já vi isso antes) ou impactante (custou muito tempo)?**
   - Sim → Adicione entrada em `workspace/memory/agent-brain.md` (veja formato abaixo).

3. **Tomei alguma decisão técnica significativa não óbvia?**
   - Sim → Documente em `workspace/memory/[projeto].md`:
     ```
     - [DECISÃO] Task [id]: [decisão tomada] | [motivo]
     ```

Se a resposta for "não" para todas as 3: **não gere output**. Continue para a próxima tarefa. Economize tokens.

---

## Ciclo Profundo (Ao Final do Projeto)

Execute quando todas as tarefas do `prd.json` estiverem `completed` ou `blocked`.

### 1. Revisão do Projeto
Leia `workspace/memory/[projeto].md` completo e responda:
- Quantas tarefas foram completadas vs. bloqueadas?
- Quais erros se repetiram mais de uma vez?
- Qual foi o maior obstáculo (mais tempo consumido)?
- O que foi mais simples do que o esperado?
- A granularidade das tarefas foi adequada (nem muito grande, nem muito pequena)?

### 2. Extração de Padrões
Identifique e categorize:
- **Padrões positivos**: o que funcionou bem e deve ser repetido
- **Anti-padrões**: o que causou problemas e deve ser evitado
- **Lacunas de planejamento**: requisitos que faltaram no PRD inicial
- **Dependências de stack**: pacotes que deram conflito ou funcionaram perfeitamente

### 3. Atualizar `workspace/memory/agent-brain.md`

Para cada padrão identificado, adicione entrada no formato:

```markdown
### [Categoria]: [Título do Aprendizado]
- **Problema**: O que aconteceu
- **Causa-raiz**: Por que aconteceu
- **Solução**: O que resolveu o problema
- **Regra**: "Sempre [faça X]" ou "Nunca [faça Y]"
- **Projeto**: [nome-do-projeto] | **Data**: [YYYY-MM-DD]
```

Categorias sugeridas: `Next.js`, `Prisma`, `TypeScript`, `Tailwind`, `Auth`, `Deploy`, `Planejamento`, `QA`, `Arquitetura`.

Atualize também a tabela de **Histórico de Projetos** no `agent-brain.md`.

### 4. Auto-Melhoria dos Papéis (quando aplicável)

Se identificar que um papel (analyst, dev, qa, etc.) precisa de uma regra nova para evitar um erro recorrente:
- Adicione a regra diretamente no arquivo `agent/roles/[papel].md`.
- Registre em `agent-brain.md`:
  ```
  - [MELHORIA] Adicionada regra em agent/roles/[papel].md: [descrição]
  ```

### 5. Snapshot Final do Projeto

Crie `workspace/memory/snapshots/[projeto]-final.md` usando o template em `agent/prompts/snapshot_template.md`.

### 6. Informar Usuário

```
Projeto [nome] concluído.
✓ [N] tarefas completadas | ⚠ [N] bloqueadas
📚 [N] novos padrões registrados no agent-brain.md
```

---

## Regra de Ouro do Learner

**Um agente que não aprende com seus erros está condenado a repeti-los em cada projeto.**

O `agent-brain.md` deve ficar mais rico a cada projeto concluído.
Se após 3 projetos ele ainda estiver vazio: o ciclo de aprendizado está quebrado.
