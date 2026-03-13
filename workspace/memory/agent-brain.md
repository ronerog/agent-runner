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

### Django Models and Migrations
- **Sempre verifique modelos existentes antes de criar novos** - evite conflitos de `related_name`
- Conflito OneToOne: `Reverse accessor 'Guest.rsvp' clashes with reverse accessor for 'rsvp.RSVP.guest'`
- **Configure settings development ativo em __init__.py**: `from .development import *`
- Use `python manage.py showmigrations` para verificar status das migrations
- SQLite em development é seguro; PostgreSQL em production via Docker

### TypeScript Configuration
- **baseUrl is deprecated in TypeScript 7.0** - remova em vez de usar `ignoreDeprecations`
- Use apenas `paths` com "@/*": ["./src/*"] para aliases
- `ignoreDeprecations: "6.0"` não é válido - causa build errors

### Component Architecture (Next.js 15)
- **class-variance-authority (cva)** é o padrão para variantes de componentes
- **forwardRef** obrigatório para todos os componentes UI
- **@radix-ui/react-slot** para composição de componentes (asChild pattern)
- **Utils pattern**: `cn()` function com `clsx` + `tailwind-merge`
- Estrutura: `components/ui/index.ts` para exports centralizados

### Agent Behavior Patterns (Meta-Learning)
- **Agentes de baixo custo pulam etapas críticas**: SWE e modelos similares tendem a pular Fase PLAN, ignorar PRD.json, e ir direto para implementação
- **Resultado**: Entregam projetos incompletos, sem estrutura adequada, e sem seguir o fluxo proposto
- **Padrão identificado**: Agentes sem memória acumulada repetem erros básicos em cada projeto
- **Regra de ouro**: **Sempre execute o RALPH LOOP completo** - Planejamento é mais importante que implementação
- **Verificação**: Se um agente entrega sem passar por PRD → requirements → prd.json, está quebrando o protocolo
- **Custo vs Qualidade**: Agentes mais baratos economizam tokens no planejamento, mas gastam mais em debugging e refatoração

### Project Documentation Patterns
- **README.md é obrigatório**: Sempre crie documentação completa de como rodar o projeto
- **Comando run_cmd do prd.json**: Use `docker-compose up --build` ou equivalente como método principal
- **Estrutura fixa do README**: Pré-requisitos, Como rodar, Comandos úteis, Estrutura do projeto, Docker
- **Sempre inclua**: URLs de acesso (frontend, backend, admin), ports, e comandos de verificação
- **Documentação viva**: Atualize README quando mudar arquitetura ou comandos

---

## Anti-Padrões Conhecidos

### Código/Django: Criar modelos sem verificar existentes
- **Problema**: Conflito de `related_name` causa `SystemCheckError` em runtime
- **Regra**: "Sempre verifique modelos existentes antes de criar novos. Use `python manage.py check` antes de migrar."

### Código/TypeScript: Usar ignoreDeprecations inválido
- **Problema**: `ignoreDeprecations: "6.0"` não funciona no tsconfig.json; causa build errors
- **Regra**: "Remova `baseUrl` em vez de tentar suprimir o warning. Use apenas `paths`."

### Código/Django: Deixar settings development desativado
- **Problema**: `DATABASES improperly configured` sem engine válido
- **Regra**: "Configure `from .development import *` em `__init__.py` do settings."

### Código/Next.js: Hardcode paths em utils
- **Regra**: "Use o padrão `@/lib/utils` com `cn()` function (`clsx` + `tailwind-merge`)."

### Código/React: Criar componentes sem forwardRef
- **Regra**: "Todos os componentes UI devem usar `forwardRef` para preservar composição e ref forwarding."

### Processo: Agente pular Fase PLAN
- **Problema**: Agentes de baixo custo pulam planejamento para economizar tokens, mas causam refatoração excessiva
- **Regra**: "Sempre execute o RALPH LOOP completo. Planejamento economiza mais tokens que debugging."

### Processo: Ignorar prd.json e requirements
- **Regra**: "Nunca implemente sem prd.json. Resultados sem estrutura não seguem o contrato com o usuário."

### UI/Design: Dev implementando páginas sem ler o Design System
- **Problema**: Dev implementa telas usando classes Tailwind genéricas (`bg-gray-800`, `text-white`) em vez das variáveis CSS do Design System. Resultado: interface parece "HTML puro" sem estilização do PRD.
- **Causa-raiz**: Processo linear sem gate visual. Dev avançava para telas sem que `globals.css` com variáveis CSS fosse criado primeiro.
- **Solução**: Ordem obrigatória: globals.css → componentes base → telas. Dev deve ler `workspace/design-system.md` antes de qualquer tarefa de UI. QA bloqueia se `visual_check_cmd` retornar 0.
- **Regra**: "Nunca implemente uma tela antes de `workspace/design-system.md` existir e `globals.css` ter as variáveis CSS declaradas."
- **Projeto**: wedding-platform | **Data**: 2026-03-13

### QA: Verificação superficial de UI (apenas compilação, não aparência)
- **Problema**: QA verificava apenas se o código compilava e se rotas retornavam HTTP 200. Bugs de UI/UX (ausência do Design System, layout incorreto, componentes genéricos) passavam como "aprovados".
- **Causa-raiz**: O QA não tinha critério visual — apenas critério técnico.
- **Solução**: Para projetos com `has_ui: true`, QA executa `visual_check_cmd` + invoca Visual Validator após cada tarefa de UI + Checkpoint de Conformidade a cada 3 tarefas de UI + Validação Final Integrada antes de concluir.
- **Regra**: "Compilar sem erro e ter visual correto são dois gates separados. Ambos são obrigatórios."
- **Projeto**: wedding-platform | **Data**: 2026-03-13

### Processo: Falta de validação holística ao final do projeto
- **Problema**: Projeto declarado "concluído" após a última tarefa, sem verificação integrada do produto final. Discrepâncias acumuladas entre PRD e implementação passavam despercebidas.
- **Causa-raiz**: RALPH LOOP não tinha fase de Validação Final antes do LEARN GLOBAL.
- **Solução**: Fase de Validação Final Integrada obrigatória antes de declarar projeto concluído: validação técnica (check_cmd + testes + segurança) + validação visual (Visual Validator completo).
- **Regra**: "Nunca declare projeto concluído sem a Validação Final Integrada passar em ambas as dimensões: técnica e visual."
- **Projeto**: wedding-platform | **Data**: 2026-03-13

---

## Histórico de Projetos

| Projeto | Stack | Data | Tarefas | Concluídas | Bloqueadas | Aprendizados |
|---------|-------|------|---------|------------|------------|--------------|
| wedding-platform | Next.js 15 + Django 5 + PostgreSQL + Redis + Docker | 2026-03-12 | 33 | 33 | 0 | Multi-tenant subdomain routing via Next.js middleware; Django custom User with email auth; UUID primary keys on all models; JWT in localStorage with axios interceptors |
| wedding-saas | Next.js 15 + Django 4.2 + PostgreSQL + Redis + MinIO | 2026-03-12 | 33 | 11 | 0 | Django models conflict resolution; TypeScript baseUrl deprecation; Component architecture with cva; Multi-environment Django settings; Agent behavior patterns (low-cost shortcuts) |

---

## Notas de Auto-Melhoria

### 2026-03-13 — Round 3: Visual Validation System
Diagnóstico pós-projeto wedding-platform revelou falhas sistêmicas na qualidade visual. Mudanças aplicadas:
- **Novo papel**: `agent/roles/visual-validator.md` — inspetor de conformidade visual
- **Designer**: agora produz `workspace/design-system.md` como artefato obrigatório (contrato visual)
- **Dev**: obrigado a ler `workspace/design-system.md` antes de qualquer tarefa de UI
- **QA**: adicionados gate visual (`visual_check_cmd`), Checkpoint de Conformidade a cada 3 UI tasks, e Checklist de Qualidade Visual na conclusão
- **execute.md**: adicionados Passo 4.5 (visual check), Passo 7.5 (checkpoint PRD), e Fase de Validação Final Integrada
- **plan.md**: `has_ui` e `visual_check_cmd` adicionados ao schema do `meta`; Designer obrigado a criar `design-system.md` antes do task breakdown; ordem das tarefas atualizada com globals.css e componentes base antes de telas
- **instructions.md**: RALPH LOOP atualizado; Visual Validator adicionado ao time; Regras de Ouro 10 e 11 adicionadas

---

> Este arquivo cresce a cada projeto concluído. Se estiver vazio após múltiplos projetos, a Fase LEARN não está sendo executada corretamente.
