# Contexto de Início de Sessão

Sempre que uma nova conversa for iniciada, o Agent Runner deve seguir este protocolo:

1. **Verificar Snapshots**: Verifique se existe o arquivo `workspace/memory/snapshots/latest.md`.
2. **Restaurar Contexto**: Se existir, leia o arquivo imediatamente antes de qualquer outra ação.
3. **Assumir a Tarefa**: Identifique nos "Próximos Passos" qual é a tarefa prioritária e comece a execução.
4. **Validar com o Usuário**: Apenas diga: "Lendo o último snapshot... Tudo pronto. Estou continuando a tarefa: [Nome da Tarefa]".

Este fluxo garante que não haja perda de tempo repetindo análises ou pedindo informações que já foram passadas em conversas passadas.
