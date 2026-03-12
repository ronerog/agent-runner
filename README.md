# Agent Runner — Agente de Desenvolvimento Autônomo 🚀

**Agent Runner** é um motor de execução agentivo projetado para transformar requisitos de software em aplicações completas e funcionais, simulando o fluxo de trabalho de uma equipe real de engenharia de software de alto nível.

## 🧠 O Conceito: Memória Viva e Multi-Agent Team

Diferente de assistentes de codificação convencionais, o Agent Runner opera sob o conceito de **Memória Viva**. Ele não apenas executa tarefas, mas aprende com cada erro, refatoração e decisão arquitetural, registrando esse conhecimento em uma base de memória persistente que é consultada a cada novo ciclo.

Para garantir a qualidade e robustez dos projetos, o Agent Runner divide sua inteligência em papéis distintos:

| Papel | Responsabilidade |
| :--- | :--- |
| **🤵 Analista de Requisitos** | Transforma ideias em PRDs detalhados, define fluxos de usuário e critérios de aceite. |
| **🏛️ Arquiteto de Software** | Define a stack tecnológica, modelagem de dados (Schema) e estrutura de diretórios. |
| **🎨 Designer UI/UX** | Cria o Design System, define paletas de cores, tipografia e garante layouts modernos e "Premium". |
| **💻 Desenvolvedor Sênior** | Implementa as funcionalidades seguindo rigorosamente o PRD e a arquitetura definida. |
| **🧪 QA Engineer** | Garante que nada quebre através de testes E2E (Playwright) e validação de requisitos. |

---

## 🛠️ Como Funciona o Agent Runner

O ecossistema busca a automação total através de um pipeline estruturado:

1.  **Planejamento**: O agente assume o papel de Analista e Arquiteto para planejar o projeto no diretório `workspace/`.
2.  **Design**: O Designer define o sistema visual em `globals.css` e tokens de design.
3.  **Execução**: O Desenvolvedor implementa a lógica em `apps/[projeto]`.
4.  **Verificação**: O QA executa testes após cada entrega de feature.
5.  **Aprendizado**: Lições aprendidas são salvas em `workspace/memory/` para evitar erros futuros.

---

## 🚀 Como Executar

O agente pode ser invocado através de prompts específicos ou scripts de automação.

### Comando Principal: `/agent-runner`

Dentro do ambiente configurado (ex: Windsurf ou Cursor), use o comando:
```text
/agent-runner: Crie um [descreva seu projeto aqui]
```

### via scripts
Você também pode rodar o motor manualmente:
```bash
./agent/scripts/agent_run.sh
```

---

## 📁 Estrutura do Projeto

```text
agent-runner/
├── agent/                  # Core do Agente
│   ├── roles/             # Definição dos papéis (Analista, Dev, QA, etc.)
│   ├── prompts/           # Prompts base para Planejamento e Execução
│   └── scripts/           # Scripts de automação e checagens
├── apps/                   # Projetos gerados pelo Agent Runner (Monorepo)
├── workspace/              # Inteligência e Documentação de Trabalho
│   ├── requirements/      # Documentos de requisitos específicos por projeto
│   ├── memory/             # Base de conhecimento e lições aprendidas
│   └── PRD.md              # Requisitos do projeto atual
└── .gitignore              # Configurado para compartilhar o motor, protegendo os dados
```

## 🔋 Requisitos Recomendados

- **IDE**: Windsurf, Antigravity.
- **Runtime**: Node.js 18+ e Yarn.

---

## 🤝 Contribuição e Sabedoria Coletiva

O Agent Runner é mais do que código; é um **Organismo Coletivo**. Ele foi projetado para aprender e evoluir. Se você usou o agente e ele acumulou novos conhecimentos em sua "Memória Viva", encorajamos você a compartilhar essa sabedoria de volta.

Veja como colaborar no arquivo [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📝 Licença

Este projeto é licenciado sob a **GNU AGPLv3 (Affero General Public License)**. 

Diferente de licenças comuns, a AGPLv3 garante que:
1.  **Melhorias fiquem abertas**: Se você modificar o motor do Agent Runner e distribuí-lo (mesmo via rede), deve compartilhar o código-fonte.
2.  **Evolução Coletiva**: Incentivamos que tanto o código quanto a "sabedoria" acumulada na memória do agente permaneçam acessíveis à comunidade.

Copyright (c) 2026 ronerog

> **Nota**: O Agent Runner está em constante evolução. Cada projeto concluído, por qualquer usuário, o torna um desenvolvedor mais experiente se a memória for compartilhada.
