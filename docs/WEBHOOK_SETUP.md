# Configuração do Webhook n8n

## Variáveis de Ambiente

Para que os formulários de contato funcionem corretamente, configure as seguintes variáveis de ambiente:

```bash
# Site Configuration
VITE_SITE_URL=https://huntermussel.com

# Analytics
VITE_GA_ID=G-NENC1CBCTS

# Monitoring
VITE_SENTRY_DSN=

# n8n Webhook Integration
VITE_N8N_WEBHOOK_URL=https://automate.huntermussel.com/webhook/8a534727-8d37-484b-b357-82f33479f291
```

## Como Funciona

### 1. Formulários Integrados

- **Formulário de Contato Principal** (`/contato`) - Envia dados completos de contato
- **Formulário Hero** (página inicial) - Versão simplificada
- **Modal de Projeto** - Para solicitações de desenvolvimento

### 2. Estrutura dos Dados Enviados

#### Formulário de Contato
```json
{
  "type": "contact",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "huntermussel-website",
  "data": {
    "name": "João Silva",
    "email": "joao@email.com", 
    "phone": "(11) 99999-9999",
    "company": "Empresa XYZ",
    "message": "Mensagem do cliente",
    "product": "odontomaster",
    "source": "contact"
  }
}
```

#### Projeto
```json
{
  "type": "project", 
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "huntermussel-website",
  "data": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999", 
    "projectDescription": "Descrição do projeto..."
  }
}
```

### 3. Estados de Loading e Feedback

- Estados de carregamento durante envio
- Mensagens de sucesso/erro via Toast
- Desabilitação de formulários durante processamento
- Reset automático após envio bem-sucedido

### 4. Fallback do Discord

O sistema mantém compatibilidade com webhook do Discord como backup (configurável).

## Resolução de Problemas

### Formulários não enviam
1. Verifique se `VITE_N8N_WEBHOOK_URL` está configurada
2. Confirme se o endpoint está ativo e acessível
3. Verifique logs do console para erros de CORS

### Dados não chegam no n8n
1. Confirme estrutura JSON esperada pelo workflow
2. Verifique se o webhook está configurado para aceitar POST
3. Teste endpoint diretamente com curl/Postman

### Exemplo de teste curl:
```bash
curl -X POST https://automate.huntermussel.com/webhook/8a534727-8d37-484b-b357-82f33479f291 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contact",
    "timestamp": "2024-01-15T10:30:00.000Z", 
    "source": "huntermussel-website",
    "data": {
      "name": "Teste",
      "email": "teste@email.com",
      "message": "Mensagem de teste"
    }
  }'
``` 