# Analyst handoff

- KPI-endepunkt finnes i appen: `repo/app/api/metrics/route.ts`.
- Endepunktet er beskyttet med Bearer-token (`METRICS_TOKEN`).
- Pull-script finnes i app-repo: `repo/scripts/pull-metrics.mjs`.
- Kjøring: `cd repo && METRICS_URL=... METRICS_TOKEN=... npm run metrics:pull`.
- Historikk skrives til: `out/metrics-history.json`.
- Deduplisering: samme `generatedAt` lagres ikke flere ganger.

Første steg for analyst-01:
1. Bekreft at `METRICS_TOKEN` er satt i target-miljø (dev/prod).
2. Kjør curl-test mot `/api/metrics` med og uten token.
3. Kjør `npm run metrics:pull` og bekreft at `out/metrics-history.json` oppdateres.
4. Gjør en liten datavalidering mot Airtable (ny lead + tildeling) og verifiser KPI-endring.
