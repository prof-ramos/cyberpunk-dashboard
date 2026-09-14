# PERF.md — Ledger de performance

## Baseline — 2026-09-13

**Setup:** `pnpm build` + `pnpm start` (porta 3100), Chrome local, Lighthouse CLI (synthetic), rota `/` (SPA principal). 2 execuções.

| Métrica | Run 1 | Run 2 | Alvo "Good" |
|---|---|---|---|
| Lighthouse Performance | 0.99 | 0.99 | ≥ 0.90 |
| FCP | 0.8 s | 0.8 s | ≤ 1.8 s |
| LCP | 2.1 s | 2.0 s | ≤ 2.5 s |
| TBT | 30 ms | 10 ms | ≤ 200 ms |
| CLS | 0 | 0 | ≤ 0.1 |
| Speed Index | 1.1 s | 0.8 s | ≤ 3.4 s |
| TTI | 2.1 s | — | ≤ 3.5 s |
| Server response (TTFB) | 20 ms | — | — |

**Peso:** 175 KiB total transferido, ~131 kB JS (12 chunks), 16 requests. Todas as rotas são estáticas (prerenderizadas).

**Veredito:** todas as métricas dentro de "Good". Sem otimização necessária — sem evidência de problema.

## RUM — 2026-09-14

`@vercel/speed-insights` adicionado ao `app/layout.tsx` (Speed Insights = Core Web Vitals reais no dashboard do Vercel). Coleta apenas em produção. LCP/INP/CLS reais ficam disponíveis no Vercel após o próximo deploy.

## Guard — 2026-09-14

Lighthouse CI configurado: `lighthouserc.js` + `.github/workflows/lighthouse.yml` (GitHub Actions, pnpm 12, `lhci autorun` em PRs e push na main).

- **Asserts:** performance ≥ 0.9, LCP ≤ 2500 ms, CLS ≤ 0.1 — 3 runs, mediana.
- **TBT removido do gate:** proxy ruidoso (não é Core Web Vital); INP real vem do RUM.
- Gate validado localmente em 2026-09-14: **passou** (3 runs, mediana).

## Experimentos

| Ideia | Baseline → Resultado | Veredito | Por quê |
|---|---|---|---|
| SpeedInsights causa TBT? | com SI: TBT 120–410 ms; sem SI: TBT 20–1120 ms | mantido | Diferença dentro do ruído da máquina — TBT oscila muito mais sem SI do que com. SpeedInsights (0.5 kB) não é atribuível. |
| Gate com TBT ≤ 200 ms | falhou 410 ms em run única | revertido | TBT é ruidoso; com 3 runs + mediana ainda flakya. Substituído por asserts nos CWVs reais (LCP/CLS) + score. |