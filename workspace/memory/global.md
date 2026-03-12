# Global Memory - Ralph Loop Agent

Este é o arquivo raiz da "Memória Viva" do agente autônomo. 
O principal objetivo desta pasta `/workspace/memory/` é garantir rastreabilidade nas decisões arquiteturais e técnicas que a IA tomou ao longo de diferentes execuções.

## Regras Fundamentais de Arquitetura Global
- A Stack Preferencial do repositório gira em torno de ecossistema JavaScript/TypeScript moderno.
- Quando o agente trabalhar em um projeto específico dentro de `/apps/[projeto]`, ele criará ou editará o arquivo `[projeto].md` nesta pasta contendo:
  1. O que aquele projeto faz.
  2. Quais bibliotecas foram instaladas ou removidas.
  3. Quais bugs assíncronos de build/runtime difíceis o agente já resolveu para não repetir no futuro.
- O Agente DEVE ler este arquivo e o arquivo específico do projeto TODAS as vezes antes de mexer no código ou instalar bibliotecas conflitantes.
