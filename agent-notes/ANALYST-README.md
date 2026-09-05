# Follohjelp Metrics for analyst-01

Dette dokumentet beskriver hvordan analyst-01 kan hente og følge KPI-er fra Follohjelp via `/api/metrics`.

## Hva `/api/metrics` er

`/api/metrics` er et beskyttet API-endepunkt i Next.js-app-en (`repo/app/api/metrics/route.ts`) som returnerer KPI-er basert på Airtable-data.

Sikring:
- Endepunktet krever `Authorization: Bearer <METRICS_TOKEN>`.
- Hvis token mangler eller er feil returneres `401 Unauthorized`.
- Hvis server mangler `METRICS_TOKEN` returneres `500 METRICS_TOKEN not set`.

## KPI-er som returneres

Responsformat:

```json
{
  "generatedAt": "2026-02-28T22:00:00.000Z",
  "kpis": {
    "leads_created_30d": 0,
    "providers_active": 0,
    "providers_with_email_active": 0,
    "leads_with_assigned_providers_30d": 0,
    "match_rate_30d": 0
  }
}
```

Forklaring:
- `leads_created_30d`: antall leads opprettet siste 30 dager.
- `leads_with_assigned_providers_30d`: antall leads siste 30 dager som har tildelte leverandører.
- `match_rate_30d`: `leads_with_assigned_providers_30d / leads_created_30d` (0 hvis nevner er 0).
- `providers_active`: antall aktive leverandører.
- `providers_with_email_active`: aktive leverandører som har e-post.

## Datakilder (Airtable)

KPI-ene bygges fra Airtable-tabellene for leads og providers via eksisterende app-konfigurasjon (env + helpers i `repo/lib/airtable.ts`).

Feltlogikk på høyt nivå:
- Leads:
  - Opprettelsestid: prøver `created_at` / `Created` / timestamp-varianter, fallback til Airtable `record.createdTime`.
  - Matchfelt: bruker konfigurert assigned providers-felt (med defensive fallback-navn).
- Providers:
  - Status: hvis `status`-felt finnes filtreres på `active`.
  - Hvis status-felt mangler brukes alle providers.
  - E-post teller hvis feltet er ikke-tomt.

## Lokal kjøring (dev)

Forutsetning:
- App kjører lokalt på `http://localhost:3000`.
- Du har gyldig `METRICS_TOKEN`.

Manuell test med curl:

```bash
curl -i http://localhost:3000/api/metrics
curl -i -H "Authorization: Bearer $METRICS_TOKEN" http://localhost:3000/api/metrics
```

Trekk og lagre historikk:

```bash
cd /Users/oyvind/Developer/follohjelp/web
METRICS_URL=http://localhost:3000 \
METRICS_TOKEN='<sett-token>' \
npm run metrics:pull
```

Dette skriver/oppdaterer:
- `/Users/oyvind/Developer/openclaw-work/projects/follohjelp/out/metrics-history.json`

## Kjøring mot prod (Netlify)

1. Finn production URL for nettstedet i Netlify (Site settings / Domains), for eksempel `https://<site>.netlify.app`.
2. Sett `METRICS_TOKEN` som miljøvariabel i Netlify for appen.
3. Kjør scriptet med prod-URL:

```bash
cd /Users/oyvind/Developer/follohjelp/web
METRICS_URL='https://<site>.netlify.app' \
METRICS_TOKEN='<sett-token>' \
npm run metrics:pull
```

## Sikkerhet og secrets

- Ikke lim inn token i chat, tickets eller docs.
- Ikke commit `.env.local`.
- Ikke skriv Airtable-nøkler eller tokens i README/notes.
- Scriptet logger aldri selve tokenet.

## Validering av tall

En enkel valideringsflyt:
1. Opprett en ny lead i Airtable med opprettelsestid nå.
2. Kjør `npm run metrics:pull` igjen.
3. Bekreft at `leads_created_30d` øker i siste snapshot.
4. Sett `assignedProviders` på leaden og kjør scriptet igjen.
5. Bekreft at `leads_with_assigned_providers_30d` og `match_rate_30d` oppdateres.
