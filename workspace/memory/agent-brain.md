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

## Stack Expertise — Conhecimento Especializado

> Este bloco contém padrões avançados que uma IA genérica erraria ou deixaria desatualizados.
> Leia a seção relevante **antes de qualquer decisão técnica** naquela stack.

---

### Next.js 15 — App Router

**Server vs Client Components:**
- Default: tudo é Server Component. `'use client'` apenas quando necessário: hooks, eventos, state, browser APIs.
- `'use server'` marca Server Actions (mutations em forms). Nunca em layout.tsx — quebra streaming de toda a árvore.
- Componentes Server podem importar Client, mas não o contrário. Passe Server Components como `children` para Client Components quando necessário.

**Data Fetching:**
- `fetch()` em Server Components → cache automático por padrão.
  - `{ cache: 'no-store' }` → dinâmico (sem cache, equivale a SSR).
  - `{ next: { revalidate: 60 } }` → ISR (revalida a cada N segundos).
  - `{ next: { tags: ['products'] } }` → revalidação por tag.
- `revalidateTag('products')` em Server Action → invalida por tag (mais preciso que `revalidatePath`).
- **TanStack Query** para client-side fetching, mutations, refetch, retry, e optimistic updates.
- Nunca `useEffect + fetch` em Client Components — use TanStack Query.

**Roteamento Avançado:**
- `(group)/` → Route Group: organiza sem afetar URL.
- `@slot/` → Parallel Routes: dashboards com seções independentes ou modais com URL própria.
- `(.)route/` → Intercepting Route: exibe rota como modal sem sair da página atual.
- `loading.tsx` → Suspense automático + skeleton. `error.tsx` → Error Boundary. `not-found.tsx` → 404.
- `route.ts` → Route Handler (substitui API Routes do pages router).

**SEO e Metadata:**
- `export async function generateMetadata({ params }): Promise<Metadata>` em cada page.tsx.
- `generateStaticParams()` para pre-render de rotas dinâmicas em build.
- Nunca `<Head>` do pages router no App Router.

**Fontes e Imagens:**
- Sempre `next/font/google` em `layout.tsx` root — nunca `<link>` do Google Fonts (performance + CLS).
- Sempre `next/image` com `alt`, `width`+`height` ou `fill`. `priority` no LCP. `sizes` para responsividade.

**Auth (Auth.js v5 / NextAuth):**
- `auth()` do `@auth/nextjs` para sessão em Server Components sem prop drilling.
- `middleware.ts`: `export { auth as middleware } from '@/auth'` para proteger rotas.
- Nunca JWT em localStorage — Auth.js usa httpOnly cookies por padrão (seguro contra XSS).
- `session.strategy: 'jwt'` para edge runtime; `'database'` para sessões persistentes.

**Erros comuns de IAs genéricas com Next.js:**
- Usar `getServerSideProps`/`getStaticProps` — são do pages router, não do App Router.
- Colocar `'use client'` no layout.tsx — quebra SSR de toda a árvore.
- Usar `useEffect + fetch` para buscar dados — use Server Components ou TanStack Query.
- Ignorar `loading.tsx` e `error.tsx` — são convenções automáticas do App Router.
- Usar `<img>` em vez de `next/image` — sem otimização automática.

---

### React — Estado e Composição

**Regra de Estado por Tipo:**
- **Server state** (dados do servidor): **TanStack Query** — cache, stale-while-revalidate, retry, mutations.
- **Global client state** (tema, auth, carrinho): **Zustand** — stores simples, colocáveis, sem boilerplate.
- **Local UI state** (modal aberto, tab ativa): `useState`.
- **URL state** (filtros, paginação, busca): `useSearchParams` + `router.push/replace`.
- **Form state**: **React Hook Form** + **Zod** para validação tipada.
- Redux apenas em sistemas corporativos com times grandes e middleware complexo.

**Hooks Avançados:**
- `useDeferredValue(value)` → adia re-render de resultado pesado durante digitação (sem lag no input).
- `useOptimistic(state, updateFn)` → UI otimista para Server Actions (Next.js 15+).
- `useId()` → gera ID único para labels/inputs acessíveis (seguro no SSR).
- `useTransition()` → marca updates como não-urgentes, mantém UI responsiva.
- `useSyncExternalStore` → para integrações com stores externos (localStorage, WebSocket).

**Composição:**
- `children` e `renderProp` em vez de prop drilling além de 2 níveis.
- Context apenas para dados globais estáveis (tema, locale, auth). Para dados dinâmicos → Zustand.
- `asChild` (Radix UI Slot) para componentes polimórficos sem wrappers desnecessários.
- `forwardRef` obrigatório em todos componentes UI que precisam de ref.
- `cva` (class-variance-authority) para variantes de componentes com Tailwind.

---

### NestJS — Módulos e Pipeline

**Estrutura de Módulos:**
- `AppModule` → raiz, importa todos os feature modules.
- `CoreModule` → global (`isGlobal: true`): Logger, Config, HTTP clients. Importado uma vez.
- `SharedModule` → serviços reutilizáveis; re-exports o que outros módulos precisam.
- Feature modules (`UserModule`, `AuthModule`) → autocontidos: controller, service, repository, DTOs.
- **Regra**: nunca injete serviço de módulo A em B sem `exports` no módulo A.

**Pipeline de Requisição (ordem exata):**
```
Middleware → Guard → Interceptor(pre) → Pipe → Controller → Service → Interceptor(post) → ExceptionFilter
```
- **Middleware**: logging, cors, rate limiting, helmet.
- **Guard** (`canActivate`): auth e autorização. Lança `ForbiddenException` ou `UnauthorizedException`.
- **Interceptor**: transformar response, medir tempo, cache por rota.
- **Pipe**: validar e transformar input. Use `ValidationPipe` globalmente com `whitelist: true, forbidNonWhitelisted: true`.
- **Exception Filter**: padronizar responses de erro. `HttpExceptionFilter` global.

**Validação com DTOs:**
- `class-validator` + `class-transformer` nos DTOs. `@IsEmail()`, `@IsString()`, `@MinLength(8)`.
- `@Transform(({ value }) => value?.trim())` para sanitizar strings.
- `@Type(() => Number)` para converter query params string → number.
- `PartialType(CreateDto)` para DTOs de update (todos os campos opcionais).

**Auth JWT:**
- `@nestjs/jwt` + `@nestjs/passport`. `PassportStrategy` com `JwtStrategy`.
- Access token: Bearer header, curto (15min). Refresh token: httpOnly cookie, longo (7d).
- `@UseGuards(JwtAuthGuard)` por controller ou `APP_GUARD` global.
- `@Roles('admin')` + `RolesGuard` para RBAC.

**Config:**
- `@nestjs/config` com `ConfigModule.forRoot({ isGlobal: true, validate: (config) => plainToInstance(EnvSchema, config) })`.
- Nunca `process.env.VAR` — sempre `this.configService.get<string>('DATABASE_URL')`.

**Banco (TypeORM):**
- `@InjectRepository(Entity)` para injeção do repository.
- `QueryBuilder` para queries complexas com JOINs e subqueries.
- `DataSource.transaction(async (manager) => { ... })` para operações atômicas.
- `synchronize: false` em produção — sempre migrations explícitas.

---

### FastAPI — Async e Estrutura

**Estrutura de Projeto:**
```
app/
  core/         # config.py, security.py, dependencies.py
  db/           # session.py (AsyncSession), base.py (Base declarativa)
  models/       # SQLAlchemy models (tabelas)
  schemas/      # Pydantic schemas (request/response)
  crud/         # funções de DB por entidade
  routers/      # APIRouter por domínio
  main.py       # lifespan + FastAPI() factory
```

**Lifespan (padrão moderno — FastAPI 0.95+):**
```python
from contextlib import asynccontextmanager
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()       # startup
    yield
    await disconnect_db()    # shutdown
app = FastAPI(lifespan=lifespan)
```
Nunca `@app.on_event("startup")` — deprecated.

**Async com SQLAlchemy 2.0:**
- `AsyncSession` + `asyncpg` driver. Nunca ORM síncrono em handler `async def`.
- `async with AsyncSession(engine) as session: async with session.begin(): ...`
- `await session.execute(select(User).where(User.id == id))` com `.scalar_one_or_none()`.
- `AsyncEngine` via `create_async_engine("postgresql+asyncpg://...")`.

**Pydantic v2:**
- `model_config = ConfigDict(from_attributes=True)` substitui `orm_mode = True`.
- `@field_validator('email', mode='before')` para sanitização antes da validação.
- `@model_validator(mode='after')` para validações cross-field após parsing.
- `model.model_dump(exclude_unset=True)` para PATCH (envia só campos alterados).
- `model.model_dump(mode='json')` para serialização JSON-safe.

**Dependency Injection:**
- `Depends(get_db)` → session de banco injetada e fechada automaticamente.
- `Depends(get_current_user)` → verifica JWT, retorna User ou lança 401.
- `Annotated[AsyncSession, Depends(get_db)]` → estilo moderno (FastAPI 0.95+).
- Composição: `admin_user: Annotated[User, Depends(require_admin)]`.

**Background Tasks vs Celery:**
- `BackgroundTasks.add_task(send_email, to=email)` → tarefas leves pós-response (no mesmo processo).
- **Celery + Redis/RabbitMQ** → tarefas pesadas, retry, scheduled, alta confiabilidade.

**Alembic:**
- `alembic revision --autogenerate -m "add users table"` → gera migration.
- Sempre revisar o SQL gerado antes de `alembic upgrade head`.
- `alembic downgrade -1` para reverter última migration.
- Async migrations: `run_async_migrations()` com `AsyncEngine`.

---

### Django + DRF — Otimização e Padrões

**ORM — Regras de Performance (crítico):**
- `select_related('author', 'category')` → JOIN SQL para FK/OneToOne. Uma query.
- `prefetch_related('tags', 'comments')` → query separada para ManyToMany/reverse FK. Duas queries.
- `only('id', 'title', 'slug')` → traz só os campos necessários. Evita select *.
- `values('id', 'name')` → retorna dicts. `values_list('id', flat=True)` → lista de IDs.
- `bulk_create(objs, batch_size=500)` → insere N registros em poucos INSERTs.
- `bulk_update(objs, ['status', 'updated_at'])` → atualiza em batch.
- `annotate(comment_count=Count('comments'))` → agrega sem N queries extras.
- `F('views') + 1` → operação atômica no banco, evita race condition.
- `transaction.atomic()` → garante que múltiplas operações são atomicamente commitadas ou revertidas.
- Nunca `for obj in queryset: obj.field` sem `only()` ou `values()` — causa N+1.

**DRF — Padrões:**
- `ModelViewSet` + `DefaultRouter` para CRUD completo (5 linhas, 5 endpoints automáticos).
- `permission_classes = [IsAuthenticated, IsOwner]` por view.
- `filterset_class` com `django-filter` para filtros URL declarativos (`?status=active&author=1`).
- `pagination_class = PageNumberPagination` no `DEFAULT_PAGINATION_CLASS` dos settings.
- `SerializerMethodField` para campos calculados sem lógica no model.
- `read_only_fields = ['created_at', 'created_by']` nos serializers.
- Nested serializers: use `depth=1` para leitura simples; serializer explícito para escrever.
- `to_representation()` override para customizar output sem perder validação de input.

**Settings Split (obrigatório):**
```
config/settings/
  base.py          # DEBUG=False, apps, middleware, DRF config, tempo e locale
  development.py   # DEBUG=True, SQLite, email console, CORS permissivo
  production.py    # PostgreSQL, email SMTP, ALLOWED_HOSTS, SECURE_SSL_REDIRECT
  __init__.py      # from .development import *  ← ativo por padrão
```

**Django Signals (para side effects desacoplados):**
```python
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
```
Signals são síncronos — use Celery para side effects pesados.

**Cache com Redis:**
- `@cache_page(60 * 15)` para views HTML completas.
- `cache.set('user:1:profile', data, timeout=3600)` para fragmentos.
- `django-redis` + `CACHES = {'default': {'BACKEND': 'django_redis.cache.RedisCache', 'LOCATION': 'redis://...'}}`.

---

### Go — Idiomas e Padrões

**Error Handling (crítico):**
- `fmt.Errorf("operation failed: %w", err)` → wrapping com contexto.
- `errors.Is(err, ErrNotFound)` → comparação por valor (funciona através de wraps).
- `errors.As(err, &target)` → extrai tipo de erro customizado de dentro do wrap.
- `var ErrNotFound = errors.New("not found")` → sentinela de erro por package.
- Nunca `panic` para erros esperados. `panic` apenas para invariantes do programa (bugs).

**Logging (slog — Go 1.21+):**
- `slog.Info("user created", "id", userID, "email", email)` → structured logging.
- `slog.Error("db query failed", "err", err, "query", q)` → nunca `fmt.Println` em produção.
- `slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))` na `main()`.

**Context (propagação obrigatória):**
- Primeiro parâmetro de toda função I/O: `ctx context.Context`.
- `ctx.Done()` → canal fechado ao cancelar. Verifique antes de operações longas.
- `context.WithTimeout(ctx, 5*time.Second)` para HTTP calls externas e queries.
- Nunca guarde context em struct — passe como parâmetro sempre.

**Concorrência:**
```go
// Fan-out com error handling
g, ctx := errgroup.WithContext(ctx)
g.Go(func() error { return doA(ctx) })
g.Go(func() error { return doB(ctx) })
if err := g.Wait(); err != nil { ... }
```
- `sync.WaitGroup` para fan-out sem return de erro.
- `sync.Mutex` para proteger estado compartilhado. `sync.RWMutex` quando leituras dominam.
- Channels para comunicação entre goroutines. Mutex para proteção de dados.

**Estrutura de Pacotes (Clean Architecture em Go):**
```
cmd/api/main.go       # entry point: cria dependências, injeta, inicia server
internal/
  domain/             # entidades + interfaces (zero deps externas)
  service/            # lógica de negócio (depende de domain)
  repository/         # implementações de DB (depende de domain)
  handler/            # HTTP handlers (depende de service)
pkg/                  # utilitários exportáveis (logger, validator, etc.)
```

**Functional Options Pattern:**
```go
type Server struct{ port int; timeout time.Duration }
type Option func(*Server)
func WithPort(p int) Option        { return func(s *Server) { s.port = p } }
func WithTimeout(t time.Duration) Option { return func(s *Server) { s.timeout = t } }
func NewServer(opts ...Option) *Server { s := &Server{port: 8080, timeout: 30*time.Second}; for _, o := range opts { o(s) }; return s }
```

**Testes:**
- Table-driven: `tests := []struct{ name, input string; want int }{}; for _, tt := range tests { t.Run(tt.name, func(t *testing.T) {...}) }`.
- `httptest.NewRecorder()` + `httptest.NewRequest()` para handlers HTTP.
- Interfaces para mocking (sem frameworks): `type UserRepo interface { FindByID(ctx, id) (*User, error) }`.
- `testify/assert` para assertions legíveis.

---

### React Native / Flutter — Mobile

**React Native:**
- `@react-navigation/native` com `Stack.Navigator` + `Tab.Navigator` para estrutura de navegação.
- `FlatList` com `keyExtractor` e `getItemLayout` para listas performáticas. Nunca `ScrollView` para listas longas.
- `MMKV` (`react-native-mmkv`) para armazenamento local rápido (10x mais rápido que AsyncStorage).
- Zustand + `persist` middleware para estado global persistente.
- `Platform.select({ ios: {}, android: {} })` para diferenças de plataforma.
- Imagens: `@shopify/flash-list` é mais performático que FlatList para listas grandes.

**Flutter:**
- `Riverpod` para state management (type-safe, testável, sem BuildContext nos providers).
- `GoRouter` para navegação declarativa com deep linking.
- `const` em widgets sempre que possível — evita rebuilds desnecessários.
- `ListView.builder` para listas dinâmicas. `SliverList` para efeitos de scroll avançados.
- Isolates (`compute()`) para JSON parsing pesado ou criptografia — libera main thread.

---

### Python — Data Science / Análise de Dados

**Manipulação de Dados (pandas):**
- Especifique `dtype` no `read_csv` upfront — mais rápido e menos memória.
- `df['col'].astype('category')` para colunas de baixa cardinalidade (string) — reduz memória 10x.
- Nunca itere linha a linha (`iterrows`) — use operações vetorizadas, `apply` com axis, ou `np.where`.
- `df.pipe(func)` para encadeamento limpo de transformações.
- `groupby().agg({'col': ['mean', 'std', 'count']})` para agregações complexas em um passo.
- `pd.merge` vs `pd.concat`: merge para JOIN por coluna, concat para empilhar DataFrames.
- `df.memory_usage(deep=True).sum()` para checar memória antes de operações grandes.
- **Polars** para datasets grandes (>1M linhas): lazy evaluation, Rust backend, 10x mais rápido.
- **DuckDB** para SQL em DataFrames: `duckdb.query("SELECT * FROM df WHERE...").df()` — mais rápido que pandas filter para queries complexas.

**Estrutura de Projeto de Dados:**
```
{app_dir}/
  data/raw/          # NUNCA modificar — dados originais imutáveis
  data/processed/    # transformações intermediárias
  notebooks/         # exploração (não produção)
  src/               # código modular e testável
    ingestion.py, transform.py, model.py, viz.py
  tests/
  reports/           # outputs finais (PDF, HTML)
  requirements.txt + pyproject.toml
```

**scikit-learn — ML:**
- `Pipeline([('scaler', StandardScaler()), ('model', LogisticRegression())])` — preprocessing + model juntos, evita data leakage.
- `StratifiedKFold` para classificação desbalanceada. `TimeSeriesSplit` para dados temporais.
- `cross_val_score` com `scoring='roc_auc'` para avaliação robusta.
- Sempre `random_state=42` em modelos e splits.
- `joblib.dump(pipeline, 'model.pkl')` para salvar; `joblib.load()` para carregar.

**Reprodutibilidade obrigatória:**
- `np.random.seed(42)` no topo de todo script.
- `nbstripout` no git pre-commit hook para não commitar outputs de notebooks.
- `papermill` para executar notebooks parametrizados em produção.
- `pip freeze > requirements.txt` ou `conda env export > environment.yml` antes de commitar.

**Visualização:**
- `matplotlib.rcParams['figure.dpi'] = 150` e `figsize=(8, 5)` como padrão.
- `sns.set_palette("colorblind")` para acessibilidade.
- Plotly para interatividade. Matplotlib/Seaborn para publicação estática.
- Streamlit para dashboards rápidos (`st.dataframe`, `st.plotly_chart`, `st.slider`).

---

### R — Data Science / Biostatística

**Tidyverse — O Padrão Moderno:**
- Use `|>` (pipe nativo R 4.1+) em vez de `%>%`. Em R < 4.1: `%>%` do magrittr.
- `dplyr::across(where(is.numeric), mean)` para aplicar função em múltiplas colunas.
- `tidyr::pivot_longer` / `pivot_wider` — não `melt`/`cast` (deprecated).
- `forcats::fct_reorder(col, outro_col)` para ordenar fatores por valor numérico em ggplot.
- `lubridate::ymd()`, `mdy()`, `dmy()` para parsear datas automaticamente.
- `stringr::str_detect`, `str_extract`, `str_replace_all` para strings.

**ggplot2 — Gramática Correta:**
- `aes()` dentro de `ggplot()` para estética global; dentro de `geom_*()` para estética local.
- `theme_minimal()` ou `theme_classic()` para publicações científicas.
- `scale_color_viridis_d()` / `scale_fill_viridis_c()` para acessibilidade daltonismo.
- `patchwork::wrap_plots()` para compor múltiplos gráficos.
- `ggsave('fig.pdf', width=6, height=4, dpi=300)` para exportação.

**Gerenciamento de Ambiente:**
- `renv::init()` ao criar projeto — isola dependências.
- `renv::install('pacote')` e `renv::snapshot()` após instalar.
- `renv::restore()` para reproduzir em outra máquina. `renv.lock` deve ser commitado.

**Quarto (Relatórios Reprodutíveis):**
- `.qmd` substitui `.Rmd` — suporte a R, Python, Julia no mesmo documento.
- `#| echo: false` para ocultar código; `#| warning: false` para suprimir warnings.
- `quarto::quarto_render('analysis.qmd')` para renderizar programaticamente.
- `params:` no YAML header para parametrizar relatórios.

**targets (Pipeline de Dados):**
```r
# _targets.R
tar_plan(
  tar_target(raw_data, read_csv("data/raw/data.csv")),
  tar_target(clean_data, clean(raw_data)),
  tar_target(model, fit_model(clean_data)),
  tar_target(report, render_report(model))
)
# tar_make() executa só o que mudou (como Make)
```

**Biostatística — Padrões:**
- Sempre reportar: estatística do teste + p-valor EXATO + effect size + IC 95% + n por grupo.
- `shapiro.test(x)` para normalidade (n<50). Q-Q plot para diagnóstico visual.
- `leveneTest(y ~ group, data)` do `car` package para homocedasticidade.
- Sobrevivência: `survival::survfit` + `survminer::ggsurvplot` com `pval=TRUE, conf.int=TRUE, risk.table=TRUE`.
- Dados longitudinais/agrupados: `lme4::lmer` (contínuo) ou `lme4::glmer` (binário).
- Múltiplas comparações: `p.adjust(p_values, method='BH')` para Benjamini-Hochberg.
- Tabela 1 clínica: `tableone::CreateTableOne(vars, strata='group', data=df)`.

**Comandos check/test para prd.json (R):**
```
check_cmd: "Rscript -e \"source('R/functions.R'); cat('syntax OK\\n')\""
test_cmd:  "Rscript -e \"testthat::test_dir('tests/testthat/')\""
lint_cmd:  "Rscript -e \"lintr::lint_dir('R/')\""
run_cmd:   "Rscript -e \"quarto::quarto_render('analysis/report.qmd')\""
```

---

## Arquitetura — Padrões e Decisões

### Monolito vs Microsserviços
- **Regra de ouro**: comece com monolito. Microsserviços são a resposta para problemas de escala que um monolito JÁ manifestou.
- **Microsserviços quando**: times independentes por serviço, escala diferenciada por componente, falhas precisam ser isoladas por contrato de negócio.
- **Anti-padrão crítico**: microsserviços para projeto novo de time pequeno — distribui complexidade sem ganho.

### Clean Architecture / Hexagonal
- **Quando**: projetos complexos, múltiplas integrações externas, necessidade de trocar banco ou framework no futuro.
- **Camadas** (dependência sempre de fora para dentro): Frameworks → Interface Adapters → Use Cases → Entities.
- **Regra de dependência**: nada no core (Use Cases, Entities) pode importar algo externo (framework, DB driver).
- Aplica em qualquer stack: NestJS modules, FastAPI routers, Go packages, Django apps.

### CQRS (Command Query Responsibility Segregation)
- **Quando**: leitura e escrita têm modelos muito diferentes; carga de leitura muito maior; auditoria detalhada é requisito.
- **Commands**: mudam estado (retornam void ou ID criado). **Queries**: leem estado (retornam DTO, nunca entidade de domínio).
- Em NestJS: `@nestjs/cqrs` com `CommandBus.execute(new CreateOrderCommand(...))`.
- Não precisa de Event Sourcing para ser útil — pode ser CQRS simples.

### Repository Pattern
- **Use sempre** que a lógica de negócio não deve conhecer SQL ou o ORM.
- Interface no domínio, implementação na camada de infra. Facilita mocks em testes.
- Django: custom `Manager` é o repository. Go: interface com métodos + struct. NestJS: classe com `@InjectRepository`.

### BFF (Backend for Frontend)
- **Quando**: app mobile e web consomem a mesma API mas com payloads muito diferentes.
- Um BFF por cliente. Agrega chamadas de APIs internas, adapta payload. Não contém lógica de negócio.

### Event-Driven (assíncrono)
- **Quando**: processos que não precisam de resposta imediata: email, notificação, relatório, cache warm-up.
- Nunca para operações que precisam de response síncrona (ex: auth, checkout em tempo real).
- **Ferramentas**: Redis Pub/Sub (simples, baixo volume), RabbitMQ (garantia de entrega, DLQ), Kafka (stream de alta vazão).

### Database Design — Decisões Críticas

**UUID vs BIGINT:**
- UUID: seguro para APIs públicas (não vaza volume), bom para IDs de entidades de negócio.
- BIGINT auto-increment: menor, mais rápido em JOINs, melhor para tabelas de log/evento com bilhões de registros.
- **Recomendação**: UUID para entidades expostas na API; BIGINT para tabelas internas de alto volume.

**Soft Delete:**
- Adicione `deleted_at TIMESTAMP NULL` quando: auditoria é requisito, LGPD exige histórico, relações dependem do registro.
- Crie índice parcial `WHERE deleted_at IS NULL` para não degradar performance de queries normais.

**Indexes (regras):**
- Automático: PKs e FKs.
- Manual obrigatório: colunas em `WHERE`, `ORDER BY`, `JOIN` com alta cardinalidade.
- Composto: quando queries filtram por dois campos juntos — ex: `(user_id, created_at)` para "posts do usuário por data".
- Nunca em colunas de baixa cardinalidade (boolean, status com 2-3 valores).

**Audit Trail:**
- Tabela `_audit_log`: `entity`, `entity_id`, `action (CREATE/UPDATE/DELETE)`, `actor_id`, `timestamp`, `old_values JSONB`, `new_values JSONB`.
- Django: `django-simple-history`. Prisma: middleware. Go: interceptor de repository.

### Performance — Padrões Transversais

**N+1 Query (anti-padrão universal):**
- Sintoma: `for item in list: item.related_object` dentro de loop.
- Django: `select_related` / `prefetch_related`. Prisma: `include`. SQLAlchemy: `joinedload` / `selectinload`. Go: batch query com `IN (ids)`.

**Caching Strategy:**
- Cache primeiro para: sessões de usuário, dados de configuração, resultados de queries caras.
- Padrão Cache-Aside: tenta cache → miss → busca DB → popula cache → retorna.
- TTL baseado em frequência de mudança: configurações (1h), perfis (5min), feed (30s).
- Invalidação por tag quando múltiplas chaves dependem de uma entidade.

**Paginação:**
- Cursor-based (`WHERE id > $last_id LIMIT N`) → escala melhor que offset para tabelas grandes.
- Offset (`LIMIT N OFFSET M`) → ok para páginas pequenas e tabelas < 1M registros.

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

### Stack/Next.js: Usar patterns do Pages Router no App Router
- **Problema**: `getServerSideProps`, `getStaticProps`, `<Head>` do `next/head`, `useRouter` do `next/router` — tudo do pages router. No App Router não funcionam ou são deprecated.
- **Regra**: App Router usa Server Components + `fetch()` para data fetching, `export async function generateMetadata()` para SEO, `useRouter` do `next/navigation`, `loading.tsx`/`error.tsx` para estados automáticos.

### Stack/Next.js: 'use client' no layout.tsx
- **Problema**: Colocar `'use client'` no `layout.tsx` quebra Server-Side Rendering de toda a árvore abaixo. Nenhum componente filho pode ser Server Component.
- **Regra**: Layout é Server Component por padrão. Para estado global no layout, use Context wrapped em Client Component importado como filho.

### Stack/React: useEffect para buscar dados do servidor
- **Problema**: `useEffect(() => { fetch('/api/data').then(setData) }, [])` — causa loading flicker, sem cache, sem refetch automático, sem error handling robusto.
- **Regra**: Use TanStack Query (`useQuery`) para client-side fetching. Use Server Components para server-side fetching. Nunca useEffect + fetch para dados do servidor.

### Stack/NestJS: synchronize: true em produção
- **Problema**: `synchronize: true` no TypeORM faz o banco sincronizar automaticamente com as entidades — pode DROPAR colunas/tabelas em produção.
- **Regra**: `synchronize: false` sempre em produção. Migrations explícitas via `typeorm migration:generate` + `migration:run`.

### Stack/FastAPI: handler async com ORM síncrono
- **Problema**: `async def get_users(db: Session = Depends(get_db)):` — usando Session síncrona do SQLAlchemy dentro de handler async bloqueia o event loop.
- **Regra**: Handlers async usam `AsyncSession` + `asyncpg`. Ou usar handlers síncronos (`def`, não `async def`) com Session síncrona.

### Stack/Django: N+1 em querysets
- **Problema**: `for post in Post.objects.all(): print(post.author.name)` — dispara uma query por post para buscar o autor.
- **Regra**: `Post.objects.select_related('author').all()` — uma query com JOIN. Audite N+1 com `django-debug-toolbar` ou `connection.queries`.

### Stack/Go: não propagar context
- **Problema**: `func GetUser(id int) (*User, error) { db.Query("SELECT...") }` — sem ctx, não é possível cancelar a operação ou propagar timeouts.
- **Regra**: `func GetUser(ctx context.Context, id int) (*User, error) { db.QueryContext(ctx, "SELECT...") }` — ctx sempre como primeiro parâmetro.

### Arquitetura: microsserviços prematuro
- **Problema**: criar 5 microsserviços para um MVP que poderia ser um monolito. Distribuição traz complexidade de rede, observabilidade, deploy, e consistência eventual antes de existir problema real de escala.
- **Regra**: comece com monolito modular. Extraia serviços quando houver problema real de escala ou times independentes por domínio.

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
- **Solução**: Ordem obrigatória: globals.css → componentes base → telas. Dev deve ler `workspace/[projeto]/design-system.md` antes de qualquer tarefa de UI. QA bloqueia se `visual_check_cmd` retornar 0.
- **Regra**: "Nunca implemente uma tela antes de `workspace/[projeto]/design-system.md` existir e `globals.css` ter as variáveis CSS declaradas."
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
