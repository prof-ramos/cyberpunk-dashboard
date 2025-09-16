# 🐳 Docker Setup - Cyberpunk Dashboard

Este guia explica como executar o Cyberpunk Dashboard usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Pelo menos 2GB de RAM disponível
- Pelo menos 5GB de espaço em disco

## 🚀 Configuração Rápida

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cyberpunk-dashboard.git
cd cyberpunk-dashboard
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas configurações
```

### 3. Execute o ambiente de desenvolvimento
```bash
# Desenvolvimento básico
make dev

# Desenvolvimento com ferramentas adicionais (pgAdmin, etc.)
make dev-tools

# Ou usando docker-compose diretamente
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 4. Acesse a aplicação
- **Aplicação**: http://localhost:3000
- **pgAdmin** (se usando dev-tools): http://localhost:5050
  - Email: dev@cyberpunk.dev
  - Senha: dev123

## 🛠️ Comandos Disponíveis

### Desenvolvimento
```bash
# Iniciar ambiente de desenvolvimento
make dev

# Com ferramentas adicionais
make dev-tools

# Ambiente local personalizado
make local

# Ver logs
make logs

# Ver status dos serviços
make status

# Acessar shell do container
make shell
```

### Produção
```bash
# Build da aplicação
make build

# Iniciar em produção
make prod

# Produção com nginx
make prod-full
```

### Manutenção
```bash
# Parar todos os serviços
make down

# Limpar containers e volumes
make clean

# Resetar banco de dados (CUIDADO!)
make db-reset

# Verificar saúde da aplicação
make health
```

## 📁 Estrutura dos Arquivos Docker

```
cyberpunk-dashboard/
├── Dockerfile              # Build de produção
├── Dockerfile.dev          # Build de desenvolvimento
├── docker-compose.yml      # Configuração base
├── docker-compose.dev.yml  # Configuração de desenvolvimento
├── docker-compose.override.yml  # Overrides locais
├── .dockerignore          # Arquivos ignorados no build
├── nginx.conf            # Configuração do nginx
├── Makefile              # Comandos automatizados
└── .env.example          # Exemplo de variáveis de ambiente
```

## 🔧 Configuração das Variáveis de Ambiente

### Arquivo `.env.local`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# API Keys
ADMIN_API_KEY=your_admin_key_32_chars_min
WEBHOOK_SECRET=your_webhook_secret_16_chars_min
WEBHOOK_API_KEY=your_webhook_api_key_32_chars_min

# Opcional
ENABLE_BACKGROUND_JOBS=false
```

### Geração de Chaves Seguras
```bash
# Gerar chave admin (32 caracteres)
openssl rand -hex 32

# Gerar webhook secret (16 caracteres)
openssl rand -hex 16
```

## 🗄️ Banco de Dados

### Configuração Local
O Docker Compose inclui PostgreSQL para desenvolvimento local:
- **Host**: localhost:5432
- **Database**: cyberpunk_dashboard_dev
- **User**: cyberpunk_dev
- **Password**: dev_password

### Scripts de Inicialização
Os scripts SQL em `scripts/` são executados automaticamente:
1. `001_create_webhook_tables.sql`
2. `002_create_request_logs.sql`
3. `003_create_processing_logs.sql`
4. `004_create_helper_functions.sql`

## 🔍 Debugging e Troubleshooting

### Verificar Status dos Serviços
```bash
# Status de todos os serviços
docker-compose ps

# Logs de um serviço específico
docker-compose logs app
docker-compose logs postgres

# Logs em tempo real
docker-compose logs -f
```

### Problemas Comuns

#### Porta 3000 já em uso
```bash
# Parar outros processos na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar porta diferente
PORT=3001 make dev
```

#### Erro de permissão
```bash
# Limpar volumes e rebuild
make clean
make dev
```

#### Banco não inicializa
```bash
# Resetar banco de dados
make db-reset

# Verificar logs do banco
make db-logs
```

#### Build falha
```bash
# Build com cache limpo
docker-compose build --no-cache

# Verificar espaço em disco
df -h
```

## 🚀 Deploy em Produção

### Usando Docker Compose
```bash
# Produção básica
make prod

# Com nginx como reverse proxy
make prod-full
```

### Usando Docker Swarm ou Kubernetes
```bash
# Build da imagem
docker build -t cyberpunk-dashboard:latest .

# Push para registry
docker tag cyberpunk-dashboard:latest your-registry/cyberpunk-dashboard:latest
docker push your-registry/cyberpunk-dashboard:latest
```

### Variáveis de Produção
```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
# ... outras variáveis
```

## 📊 Monitoramento

### Health Checks
- **Aplicação**: `GET /api/health`
- **Banco**: Verificado automaticamente pelo Docker
- **Nginx**: Porta 80/443

### Logs
```bash
# Todos os logs
make logs

# Logs da aplicação
make logs-app

# Logs do banco
make db-logs
```

### Métricas
- Monitoramento via `/api/admin/database-status`
- Health checks automáticos
- Logs estruturados com `lib/request-logger`

## 🔒 Segurança

### Produção
- ✅ Imagens oficiais do Docker
- ✅ Non-root user nos containers
- ✅ Secrets via variáveis de ambiente
- ✅ Rate limiting configurado
- ✅ Headers de segurança no nginx

### Desenvolvimento
- 🔓 Senhas simples para facilitar desenvolvimento
- 🔓 Ferramentas de debug habilitadas
- 🔓 Logs detalhados

## 🎯 Performance

### Otimizações
- **Multi-stage builds**: Imagens menores
- **Layer caching**: Build mais rápido
- **Gzip compression**: Nginx configurado
- **Static file caching**: Cache de 1 ano para assets
- **Health checks**: Detecção automática de falhas

### Recursos Recomendados
- **CPU**: 1-2 cores
- **RAM**: 1-2 GB
- **Disco**: 5-10 GB
- **Rede**: 100 Mbps

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Next.js with Docker](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Nginx Docker](https://hub.docker.com/_/nginx)

## 🆘 Suporte

Para problemas específicos:
1. Verifique os logs: `make logs`
2. Teste a saúde: `make health`
3. Verifique configuração: `docker-compose config`
4. Consulte a documentação em `DEPLOYMENT_GUIDE.md`

---

**🚀 Pronto para produtividade máxima com containers!**