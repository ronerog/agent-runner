# Snapshot de Sessão — Agent Runner

## Metadados
- **Data/Hora**: {{timestamp}}
- **Projeto**: {{project_name}}
- **Sessão**: {{session_number}}

---

## Estado das Tarefas
- **Total**: {{total_tasks}}
- **Concluídas**: {{completed_tasks}}
- **Bloqueadas**: {{blocked_tasks}}
- **Pendentes**: {{pending_tasks}}

---

## Última Ação Realizada
Task {{last_task_id}}: {{last_task_name}} — `{{last_task_status}}`

---

## Próximos Passos (Para a Nova Sessão)

1. **Imediato**: {{next_step_1}}
2. **Em seguida**: {{next_step_2}}
3. **Depois**: {{next_step_3}}

---

## Bloqueios Ativos

{{#if blocked_items}}
| Task ID | Descrição | Erro | Próxima Ação |
|---------|-----------|------|--------------|
{{blocked_items}}
{{else}}
Nenhum bloqueio ativo.
{{/if}}

---

## Decisões Técnicas desta Sessão

{{decisions}}

---

## Aprendizados desta Sessão (Para agent-brain.md)

{{#if new_learnings}}
{{new_learnings}}
{{else}}
Nenhum novo padrão identificado nesta sessão.
{{/if}}

---

## Instrução de Retomada

Agent Runner: ao iniciar nova conversa, leia este arquivo (`workspace/memory/snapshots/latest.md`) antes de qualquer ação. Identifique a próxima tarefa pendente no `prd.json` e execute sem fazer perguntas. O contexto está completo acima.
