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

### Multi-Tenant SaaS (Subdomain Routing)
- Next.js middleware is the right place to handle subdomain → path rewriting
- Pattern: extract subdomain from `request.headers.get('host')`, rewrite to `/[tenant-path]/[slug]/*`
- Always use `NEXT_PUBLIC_PLATFORM_DOMAIN` env var for the root domain to support both dev and prod
- Public pages (gifts, RSVP, wedding home) need `AllowAny` permission on DRF views

### Django with Email Auth
- Always create `CustomUserManager` with `create_user` (normalizes email) and `create_superuser`
- Set `USERNAME_FIELD = 'email'` and `REQUIRED_FIELDS = ['name']`
- Register with `BaseUserAdmin` using custom `fieldsets` and `add_fieldsets`
- `AUTH_USER_MODEL = 'accounts.User'` in base settings before any migration

### Django App Structure
- Use `apps/` prefix for all Django apps in `INSTALLED_APPS`: `'apps.accounts'`, etc.
- Each app needs `__init__.py` and `apps.py` with `AppConfig`
- `config/settings/base.py` + `config/settings/dev.py` split is clean and reliable
- Always declare `DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'` in base settings

### Next.js Auth with JWT
- Store access + refresh tokens in `localStorage` (keys: `access_token`, `refresh_token`)
- Axios request interceptor: attach `Authorization: Bearer` header
- Axios response interceptor: catch 401, try refresh, retry request, redirect on failure
- `AuthContext` with `useAuth()` hook; wrap only necessary subtrees (not global root) with `AuthProvider`

---

## Anti-Padrões Conhecidos

*(Erros que o agente já cometeu e não deve repetir. Populado automaticamente.)*

---

## Histórico de Projetos

| Projeto | Stack | Data | Tarefas | Concluídas | Bloqueadas | Aprendizados |
|---------|-------|------|---------|------------|------------|--------------|
| wedding-platform | Next.js 15 + Django 5 + PostgreSQL + Redis + Docker | 2026-03-12 | 33 | 33 | 0 | Multi-tenant subdomain routing via Next.js middleware; Django custom User with email auth; UUID primary keys on all models; JWT in localStorage with axios interceptors |

---

## Notas de Auto-Melhoria

*(O agente registra aqui quando atualiza seus próprios papéis ou fluxos.)*

---

> Este arquivo cresce a cada projeto concluído. Se estiver vazio após múltiplos projetos, a Fase LEARN não está sendo executada corretamente.
