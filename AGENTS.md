# AGENTS.md

## Project

Next.js 15 (App Router) + React 19 + TypeScript + shadcn/ui (new-york style) + Tailwind CSS v3.
Deployed on Vercel.
Package manager: **pnpm** (pnpm-lock.yaml present).

## Commands

- `pnpm dev` — Iniciar servidor de desenvolvimento
- `pnpm build` — Build de produção (com validação estrita de TypeScript ativada)
- `pnpm typecheck` — Checagem de tipos estrita (`tsc --noEmit`)
- `pnpm test` — Execução da suíte de testes unitários nativa (`node --test`)
- `pnpm start` — Servir build de produção localmente
- `pnpm lint` — ESLint

## Architecture

- **Domain Types (`types/`)**: Modelos canônicos com discriminated unions e tipos literais:
  - `types/dashboard.ts` — Abas e navegação do dashboard (`DashboardTab`, `NavItem`, `NetworkHealth`)
  - `types/agent.ts` — Entidades de agentes, status e níveis de risco (`Agent`, `AgentStatus`, `RiskLevel`)
  - `types/intelligence.ts` — Relatórios de inteligência, ameaça e classificação (`IntelReport`, `IntelClassification`, `ThreatLevel`)
  - `types/operation.ts` — Operações de campo, status e prioridades (`Operation`, `OperationStatus`, `PriorityLevel`)
  - `types/system.ts` — Nós de infraestrutura, telemetria e tipo (`SystemNode`, `SystemStatus`, `SystemType`)
  - `types/command-center.ts` — Logs de atividade e métricas agregadas
- **Data Layer (`data/`)**: Dados desacoplados dos componentes de apresentação (`INITIAL_AGENTS`, `INITIAL_INTEL_REPORTS`, etc.).
- **Helpers de UI (`lib/status-helpers.ts`)**: Mapeamentos centralizados e tipados de badges, cores e rótulos i18n, eliminando repetição de código.
- **Dashboard Shell & Views (`components/dashboard/`)**:
  - `dashboard-shell.tsx` — Shell unificado com sidebar responsiva, overlay mobile, status de rede e cabeçalho.
  - `views/` — Componentes puros de visualização (`CommandCenterView`, `AgentNetworkView`, `OperationsView`, `IntelligenceView`, `SystemsView`).
  - `*-detail-modal.tsx` — Modais isolados para inspeção detalhada de entidades.
- **App Router Routes (`app/`)**: Rotas diretas (`/`, `/command-center`, `/agent-network`, `/operations`, `/intelligence`, `/systems`) que renderizam dentro do `DashboardShell`, suportando URLs canônicas, prefetching e compartilhamento de links.
- **Testes Automatizados (`tests/`)**: Suíte de testes unitários de alta performance baseada no `node --test` nativo (invariantes de dados, helpers e filtros de domínio).
- **UI Components (`components/ui/`)**: Primitivas do shadcn/ui baseadas em Radix.
- **Path Alias**: `@/*` mapeado para a raiz do projeto em `tsconfig.json`.

## Guidelines de Código

- Sempre rodar `pnpm typecheck` e `pnpm test` antes de submeter alterações.
- Manter o desacoplamento: novos dados ou entidades devem ser tipados em `types/` e inicializados em `data/`.
- Usar `lib/status-helpers.ts` para qualquer novo badge, cor de status ou rótulo traduzido.
- Evitar `any` ou type casts inseguros (`as Type`); priorizar discriminated unions e checagens totais.
