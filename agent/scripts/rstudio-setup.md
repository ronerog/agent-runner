# RStudio / Posit — Integração com Agent Runner

## Opção 1: GitHub Copilot (nativo no RStudio)

RStudio 2023.09+ tem suporte nativo ao GitHub Copilot:

1. Abra RStudio → Tools → Global Options → Copilot
2. Faça login com sua conta GitHub
3. O arquivo `.github/copilot-instructions.md` deste repositório é detectado automaticamente
4. Copilot terá contexto do Agent Runner no autocompletar

**Limitação**: Copilot não executa o RALPH LOOP completo — apenas auxilia no autocompletar.

---

## Opção 2: Claude Code CLI (recomendado para execução completa)

Use o Terminal integrado do RStudio (Tools → Terminal → New Terminal):

### Novo projeto de análise:
```bash
claude "$(bash agent/scripts/start-r.sh 'Análise de sobrevivência da coorte XYZ com dados em data/raw/')"
```

### Retomar sessão anterior:
```bash
bash agent/scripts/start-r.sh
```

### Task específica em projeto R existente:
```bash
claude "$(cat agent/prompts/inject.md)

/inject apps/meu-projeto — Adicionar análise de regressão logística para predição de readmissão"
```

---

## Opção 3: Positron (novo IDE do Posit)

Positron é o novo IDE da Posit (substituto do RStudio), baseado em VS Code:
- Suporta extensões VS Code → use Cline, Continue, ou Cursor Copilot
- Arquivo `.clinerules` já está configurado neste repositório
- Abra o repositório no Positron e use as extensões de IA normalmente

---

## Estrutura Recomendada para Projetos R

```
apps/meu-projeto-r/
├── README.md
├── meu-projeto.Rproj       # arquivo de projeto RStudio
├── renv.lock               # lockfile de dependências R
├── renv/                   # ambiente R isolado
├── _targets.R              # pipeline targets (se usado)
├── data/
│   ├── raw/               # dados originais — NUNCA modificar
│   └── processed/         # dados transformados
├── analysis/
│   ├── 01_eda.qmd         # Análise Exploratória (Quarto)
│   ├── 02_model.qmd       # Modelagem
│   └── 03_report.qmd      # Relatório final
├── R/
│   ├── functions.R        # funções auxiliares
│   └── utils.R
├── output/
│   ├── figures/           # gráficos exportados
│   └── tables/            # tabelas exportadas
└── tests/
    └── testthat/          # testes unitários (testthat)
```

---

## Comandos Úteis para Projetos R no Agent Runner

```r
# Inicializar ambiente renv
renv::init()

# Instalar pacotes
renv::install(c("tidyverse", "survival", "survminer", "tableone"))

# Salvar estado do ambiente
renv::snapshot()

# Restaurar ambiente (em nova máquina)
renv::restore()

# Renderizar relatório Quarto
quarto::quarto_render("analysis/03_report.qmd")
```

---

## check_cmd e test_cmd para projetos R no prd.json

```json
{
  "check_cmd": "Rscript -e \"source('R/functions.R'); cat('OK\\n')\"",
  "test_cmd": "Rscript -e \"testthat::test_dir('tests/testthat/')\"",
  "lint_cmd": "Rscript -e \"lintr::lint_dir('R/')\"",
  "run_cmd": "Rscript -e \"quarto::quarto_render('analysis/03_report.qmd')\""
}
```
