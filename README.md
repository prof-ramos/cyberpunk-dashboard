# 🚀 Cyberpunk Dashboard - Sistema de Produtividade Pessoal

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

Um dashboard pessoal de produtividade com tema cyberpunk, desenvolvido para ajudar você a rastrear hábitos, estudos, exercícios e nutrição de forma elegante e eficiente.

## ✨ Funcionalidades

### 📊 **Visão Geral**
- **Métricas Diárias**: Horas de estudo, hábitos concluídos, calorias consumidas
- **Atividade Recente**: Histórico das últimas ações realizadas
- **Progresso Semanal**: Gráficos de evolução e metas semanais
- **Streak Counter**: Controle de dias consecutivos de produtividade

### 💪 **Sistema de Treino**
- **Rastreamento de Exercícios**: Registre séries, repetições e pesos
- **Histórico de Treinos**: Acompanhe sua evolução ao longo do tempo
- **Volume Total**: Cálculo automático do volume de treino
- **Interface Intuitiva**: Fácil registro de exercícios

### ✅ **Controle de Hábitos**
- **Hábitos Personalizados**: Crie seus próprios hábitos diários
- **Rastreamento Visual**: Status visual de conclusão dos hábitos
- **Histórico Detalhado**: Acompanhe a consistência ao longo do tempo
- **Metas Flexíveis**: Defina metas personalizadas por hábito

### 📚 **Sistema de Estudos**
- **Controle de Tempo**: Registre tempo dedicado por matéria
- **Métodos de Estudo**: Categorize por técnica utilizada
- **Distribuição por Matéria**: Gráficos de distribuição do tempo
- **Análise Semanal**: Evolução dos estudos nos últimos 7 dias

### 🍽️ **Controle Nutricional**
- **Registro de Refeições**: Acompanhe calorias e macronutrientes
- **Totais Automáticos**: Cálculo automático de totais diários
- **Histórico Alimentar**: Rastreamento detalhado da alimentação
- **Metas Nutricionais**: Defina e acompanhe metas calóricas

### 🔧 **API e Integrações**
- **API RESTful**: Endpoints completos para integração
- **Webhooks**: Suporte a webhooks para automação
- **N8N Integration**: Integração nativa com N8N
- **Documentação Interativa**: API docs completa

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Deployment**: Vercel
- **Font**: Geist Mono (fonte cyberpunk)

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado) ou npm
- Conta Supabase

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/cyberpunk-dashboard.git
cd cyberpunk-dashboard
```

### 2. Instale as Dependências
```bash
pnpm install
# ou
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Keys
ADMIN_API_KEY=your_admin_key_min_32_chars
WEBHOOK_SECRET=your_webhook_secret_min_16_chars
WEBHOOK_API_KEY=your_webhook_api_key_min_32_chars

# Opcional
ENABLE_BACKGROUND_JOBS=false
```

### 4. Configure o Banco de Dados
Execute os scripts SQL em ordem no Supabase SQL Editor:
```bash
# Execute em ordem:
1. scripts/001_create_webhook_tables.sql
2. scripts/002_create_request_logs.sql
3. scripts/003_create_processing_logs.sql
4. scripts/004_create_helper_functions.sql
```

### 5. Execute o Projeto
```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar em produção
pnpm start
```

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Servidor de desenvolvimento (porta 3000)
pnpm build        # Build para produção
pnpm start        # Executar build de produção
pnpm lint         # Executar ESLint

# Testes e Deploy
node scripts/test-deployment.js [base-url] [admin-key]  # Teste de deploy
```

## 🔧 Configuração da API

### Endpoints Principais
- `GET /api/health` - Verificação de saúde do sistema
- `POST /api/webhooks/receive` - Receber webhooks
- `POST /api/webhooks/n8n` - Integração N8N
- `GET /api/admin/*` - Endpoints administrativos

### Autenticação
```bash
# Para endpoints admin, use o header:
X-Admin-Key: your_admin_key

# Para webhooks, use o header:
X-API-Key: your_api_key
```

## 🎨 Tema Cyberpunk

O design segue uma estética cyberpunk com:
- **Cores**: Laranja (#f97316) e preto como tons principais
- **Fonte**: Geist Mono para aparência técnica
- **Interface**: Minimalista com elementos futuristas
- **Animações**: Transições suaves e indicadores visuais

## 📊 Estrutura do Projeto

```
cyberpunk-dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── command-center/    # Página principal
│   ├── agent-network/     # Sistema de treino
│   ├── operations/        # Controle de hábitos
│   ├── intelligence/      # Sistema de estudos
│   ├── systems/          # Controle nutricional
│   └── api-docs/         # Documentação da API
├── components/            # Componentes React
│   ├── ui/               # Componentes Shadcn/ui
│   └── theme-provider.tsx
├── lib/                  # Utilitários e configurações
│   ├── supabase/         # Configuração Supabase
│   ├── types.ts          # Tipos TypeScript
│   ├── utils.ts          # Funções utilitárias
│   └── storage.ts        # Gerenciamento de dados
├── scripts/              # Scripts SQL e utilitários
└── public/               # Assets estáticos
```

## 🔒 Segurança

- **Row Level Security (RLS)**: Habilitado em todas as tabelas
- **Autenticação de API**: Chaves de API obrigatórias
- **Validação de Input**: Zod schemas para validação
- **Logs de Segurança**: Rastreamento de tentativas suspeitas
- **Headers de Segurança**: Configurados automaticamente

## 📈 Monitoramento

### Health Checks
- `GET /api/health` - Status geral do sistema
- `GET /api/admin/database-status` - Status do banco
- `GET /api/admin/deployment-check` - Verificação completa

### Logs
- **Request Logs**: Rastreamento de todas as requisições
- **Error Logs**: Logs detalhados de erros
- **Webhook Logs**: Histórico de webhooks processados

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
Compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Convenções de Commit
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Refatoração de código
- `test:` - Testes

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Recharts](https://recharts.org/) - Biblioteca de gráficos

---

**Desenvolvido com ❤️ para maximizar sua produtividade pessoal**
