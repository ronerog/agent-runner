# Contribuindo para o Agent Runner 🧠

Bem-vindo! O Agent Runner é um **Organismo Coletivo** — quanto mais pessoas usam e compartilham o que o agente aprendeu, mais inteligente ele fica para todo mundo.

Existem duas formas de contribuir: compartilhando **Sabedoria** (o mais valioso) ou melhorando o **Motor**.

---

## 🧠 1. Compartilhando Sabedoria (Agent Brain)

### O que é o Agent Brain?

Quando você usa o Agent Runner para construir um projeto, o agente aprende empiricamente: erros que encontrou, padrões que funcionaram, configurações de stack que deram problema, decisões arquiteturais que se mostraram corretas.

Tudo isso fica registrado em **`workspace/memory/agent-brain.md`** — a memória acumulada do agente.

Esse arquivo **já é versionado pelo git** do seu repositório. Contribuir com sabedoria é basicamente abrir um PR com o que o agente aprendeu no seu uso.

### O que vale a pena contribuir?

Contribuições valiosas para o `agent-brain.md` incluem:

- **Erros de stack resolvidos**: "No Next.js 15 com App Router, Server Actions não podem retornar `undefined` diretamente — use `null`"
- **Padrões de instalação**: "Django + Channels requer `daphne` como ASGI server, não o servidor padrão"
- **Anti-padrões descobertos**: "Nunca usar `prisma.$executeRaw` em loops — causa N+1 de queries"
- **Configurações críticas**: "Go modules com workspaces (`go.work`) resolvem conflitos de versão em monorepos"
- **Sequências que funcionam**: "Em FastAPI, sempre inicializar o banco antes dos routers no `lifespan`"

### Como contribuir

**Passo 1 — Use o Agent Runner em um projeto**
```bash
# No seu projeto, via IDE (Windsurf, Cursor, etc.):
/agent-runner: Crie um [seu projeto]
```

**Passo 2 — Veja o que o agente aprendeu**

Após concluir o projeto, o arquivo `workspace/memory/agent-brain.md` terá sido atualizado automaticamente pelo papel Learner. Revise as entradas novas — especialmente nas seções "Padrões Aprendidos" e "Anti-Padrões Conhecidos".

**Passo 3 — Faça Fork e abra um PR**

```bash
# Fork o repositório no GitHub, depois:
git clone https://github.com/SEU-USUARIO/agent-runner.git
cd agent-runner
git checkout -b brain/[stack-ou-tema]
```

**Passo 4 — Copie as entradas relevantes**

Abra seu `workspace/memory/agent-brain.md` local e copie as entradas novas para o `workspace/memory/agent-brain.md` do repositório forkado.

Use o formato padrão:

```markdown
### [Categoria]: [Título do Aprendizado]
- **Problema**: O que aconteceu
- **Causa-raiz**: Por que aconteceu
- **Solução**: O que resolveu o problema
- **Regra**: "Sempre [faça X]" ou "Nunca [faça Y]"
- **Projeto**: [tipo de projeto — não precisa ser o nome real] | **Data**: [YYYY-MM-DD]
```

Categorias aceitas: `Next.js`, `Python`, `Django`, `FastAPI`, `Go`, `Rust`, `Ruby/Rails`, `Prisma`, `TypeScript`, `Auth`, `Deploy`, `Planejamento`, `QA`, `Arquitetura`, `Docker`, `Banco de Dados`.

**Passo 5 — Abra o Pull Request**

```bash
git add workspace/memory/agent-brain.md
git commit -m "brain: add [categoria] learnings from [tipo de projeto]"
git push origin brain/[stack-ou-tema]
```

Abra o PR com o título: `brain: [o que foi aprendido em poucas palavras]`

### O que NÃO contribuir

- Informações de projetos privados (nomes de clientes, dados sensíveis)
- Opiniões sem evidência prática ("acho que X é melhor que Y")
- Duplicatas de entradas que já existem no `agent-brain.md`
- Entradas sem o campo `Regra` — o que aprende deve virar regra acionável

---

## 💻 2. Melhorando o Motor (Engine)

Se encontrou um problema no fluxo do agente ou quer adicionar capacidade:

### Onde cada coisa fica

| O que melhorar | Onde mexer |
|----------------|-----------|
| O pipeline geral (RALPH LOOP) | `agent/prompts/instructions.md` |
| Fase de planejamento | `agent/prompts/plan.md` |
| Fase de execução por tarefa | `agent/prompts/execute.md` |
| Fase de aprendizado | `agent/prompts/learn.md` |
| Retomada de sessão | `agent/prompts/resume.md` |
| Papel do Analista | `agent/roles/analyst.md` |
| Papel do Arquiteto | `agent/roles/architect.md` |
| Papel do Designer | `agent/roles/designer.md` |
| Papel do Desenvolvedor | `agent/roles/dev.md` |
| Papel do QA | `agent/roles/qa.md` |
| Papel do Learner | `agent/roles/learner.md` |
| Papel do Manager | `agent/roles/manager.md` |
| Scripts de automação | `agent/scripts/` |
| Novo papel (ex: SRE, Security) | `agent/roles/[novo-papel].md` |

### Fluxo de contribuição

```bash
git checkout -b feat/minha-melhoria
# faça suas alterações
git commit -m "feat: [descrição]"
git push origin feat/minha-melhoria
# abra Pull Request
```

Padrão de commits:
- `feat:` nova funcionalidade no motor
- `fix:` correção de bug no fluxo
- `brain:` contribuição de sabedoria ao agent-brain
- `role:` melhoria em um papel específico
- `chore:` manutenção geral

---

## ⚖️ Licença

Ao contribuir — seja código ou sabedoria — você concorda que sua contribuição será licenciada sob a **GNU AGPLv3**. Isso garante que o Agent Runner e toda a inteligência acumulada permaneçam livres e acessíveis para sempre.

**Obrigado por tornar o agente mais inteligente para todo mundo.**
