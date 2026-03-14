# Fase LEARN — Aprendizado Empírico (Learner Role)

Este é o mecanismo que transforma o Agent Runner de um executor em um **ser que aprende**.
Execute após cada tarefa (Ciclo Rápido) e ao final de cada projeto (Ciclo Profundo).

---

## Ciclo Rápido (Após Cada Tarefa)

> **Regra**: Se não aprendeu nada novo → **silêncio total** (zero tokens). Se aprendeu → documente com a profundidade necessária para que o aprendizado seja útil no futuro.

Responda mentalmente estas 3 perguntas (NÃO gere texto para as perguntas — vá direto à ação):

1. **Houve erro inesperado?** → Sim: documente em `workspace/memory/[projeto].md` com problema + causa + solução
2. **Erro é recorrente ou custou > 2 tentativas?** → Sim: crie entrada completa em `agent-brain.md` (Problema, Causa-raiz, Solução, Regra)
3. **Decisão técnica não-óbvia?** → Sim: documente em `workspace/memory/[projeto].md` com decisão + motivo

**Se "não" para todas as 3: NÃO GERE OUTPUT. Silêncio = eficiência. Vá direto para a próxima tarefa.**

> **Qualidade > brevidade**: Quando há algo a documentar, documente com profundidade suficiente para ser útil. Um aprendizado mal documentado é pior do que nenhum — será ignorado nas próximas sessões.

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

### 6. Cleanup de Artefatos Temporários

```bash
rm -rf .claude/worktrees/
```

Worktrees são cópias temporárias criadas por subagentes. Acumulam entre sessões se não removidos.

### 7. Informar Usuário

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
