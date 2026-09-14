> [!NOTE]
> **Status do portfólio:** este é o repositório canônico ativo. Predecessor(es) arquivado(s): [dashboard-cyber](https://github.com/prof-ramos/dashboard-cyber). Os históricos permanecem disponíveis somente para leitura.
<!-- PORTFOLIO_STATUS: canonical; predecessors=dashboard-cyber -->

# Cyberpunk Dashboard

Interface de comando e controle em estilo cyberpunk/sci-fi construída com Next.js 15 (App Router), React 19, TypeScript e Tailwind CSS.

## 🚀 Tecnologias e Arquitetura

- **Framework**: Next.js 15 (App Router) + React 19
- **Tipagem**: TypeScript 5 com compilação estrita (sem `ignoreBuildErrors`)
- **Estilização**: Tailwind CSS v3 + CSS custom properties (paleta cyberpunk âmbar/ciano/neon)
- **Componentes**: Primitivas acessíveis baseadas em Radix UI (shadcn/ui new-york)
- **Ícones**: Lucide React
- **Testes**: Suíte unitária nativa em Node.js (`node --test`) de alta velocidade e zero dependências externas
- **Performance & RUM**: `@vercel/speed-insights` integrado e suite de auditoria contínua via Lighthouse CI

## 🛠️ Comandos Disponíveis

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento local
pnpm dev

# Executar checagem estrita de tipos TypeScript
pnpm typecheck

# Executar suíte de testes unitários automatizados
pnpm test

# Gerar build otimizado de produção
pnpm build

# Servir build de produção localmente
pnpm start
```

## 📁 Estrutura do Projeto

```
cyberpunk-dashboard/
├── app/                      # Rotas Next.js App Router (URLs canônicas e views diretas)
│   ├── agent-network/        # Rota direta: /agent-network
│   ├── command-center/       # Rota direta: /command-center
│   ├── intelligence/         # Rota direta: /intelligence
│   ├── operations/           # Rota direta: /operations
│   ├── systems/              # Rota direta: /systems
│   ├── layout.tsx            # Root layout e Speed Insights
│   └── page.tsx              # Dashboard centralizado
├── components/
│   ├── dashboard/            # Shell do dashboard, modais de detalhe e views modulares
│   │   ├── views/            # Componentes de visualização desacoplados
│   │   └── dashboard-shell.tsx # Shell de navegação responsivo
│   └── ui/                   # Primitivas de UI (shadcn/ui)
├── data/                     # Datasets de dados mock desacoplados da apresentação
├── lib/                      # Utilitários gerais e helpers tipados de status/badges
├── tests/                    # Suíte de testes unitários (invariantes, helpers, filtros)
└── types/                    # Modelos canônicos de domínio e discriminated unions
```