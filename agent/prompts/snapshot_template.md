# Snapshot de Sessão — Agent Runner

## Metadados
- **Data/Hora**: {{timestamp}}
- **Projeto**: {{project_name}}
- **Sessão**: {{session_number}}
- **Stack**: {{stack}}
- **Workspace Dir**: {{workspace_dir}}
- **App Dir**: {{app_dir}}

---

## Estado Orquestrador

- **Fase atual**: {{fase_atual}}  ← PLAN | EXECUTE_LOOP | VALIDATE | LEARN_GLOBAL
- **Último sinal recebido**: {{ultimo_sinal}}  ← IMPL_READY | QA_PASS | QA_FAIL | VV_PASS | TASK_DONE
- **Escalação pendente**: {{escalacao_pendente}}  ← null ou "Dev→Architect: [motivo]"

---

## Estado das Tarefas

- **Total**: {{total_tasks}}
- **Concluídas**: {{completed_tasks}}
- **Em progresso**: {{in_progress_tasks}}
- **Bloqueadas**: {{blocked_tasks}}
- **Pendentes**: {{pending_tasks}}

---

## Última Ação Realizada

Task {{last_task_id}} (type: {{last_task_type}}): {{last_task_name}} — `{{last_task_status}}`

Pipeline executado: {{pipeline_executado}}  ← ex: "Dev → QA_PASS → VV_PASS → committed"

---

## Próximos Passos (Para a Nova Sessão)

1. **Imediato**: Task {{next_task_id}} (type: {{next_task_type}}): {{next_task_name}}
2. **Em seguida**: {{next_step_2}}
3. **Depois**: {{next_step_3}}

---

## Bloqueios Ativos

{{#if blocked_items}}
| Task ID | Type | Descrição | Erro Exato | Tentativas | Escalada Para | Próxima Ação |
|---------|------|-----------|------------|-----------|--------------|--------------|
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

## Instrução de Retomada (para qualquer modelo, incluindo os mais simples)

Agent Runner: ao iniciar nova conversa, execute EXATAMENTE estes passos:

```
PASSO 1: Leia este snapshot (você já está lendo)
PASSO 2: Leia workspace/memory/agent-brain.md — seção "Hot Rules" apenas
PASSO 3: Leia workspace/[projeto]/prd.json — encontre primeira task com status "pending" ou "in_progress"
PASSO 4: Leia task.type → consulte pipeline em agent/prompts/orchestrator.md
PASSO 5: Execute a tarefa sem fazer perguntas. O contexto acima é completo.
```

Se `escalacao_pendente` não for null: resolva a escalação antes de retomar o loop normal.

> **NÃO faça perguntas ao usuário.** Se algo estiver ambíguo, assuma a interpretação mais razoável e execute.
