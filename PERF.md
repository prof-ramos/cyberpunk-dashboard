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

## Experimentos

| Ideia | Baseline → Resultado | Veredito | Por quê |
|---|---|---|---|
| — | — | — | — |