# Follohjelp.no

En Next.js-app (App Router) for lokale tjenester i Follo-regionen. Siden viser kategorier, leverandører og lar besøkende sende inn tjenesteforespørsler som lagres i Airtable.

## Kom i gang

1. Installer avhengigheter:
   ```bash
   npm install
   ```
2. Kopier `.env.example` til `.env.local` og legg inn Airtable-nøkler og tabellnavn.
3. Kjør utviklingsserveren:
   ```bash
   npm run dev
   ```
4. Åpne `http://localhost:3000` i nettleseren.

## Miljøvariabler

| Variabel | Beskrivelse |
| --- | --- |
| `AIRTABLE_API_KEY` | API-nøkkelen fra Airtable (hold den på serversiden). |
| `AIRTABLE_BASE_ID` | Base-ID for databasen. |
| `AIRTABLE_LEADS_TABLE` | Tabellnavn for henvendelser/forespørsler. |
| `AIRTABLE_PROVIDERS_TABLE` | Tabellnavn for leverandører/listinger. |

## Struktur

- `app/` – Next.js App Router-sider og API-ruter
  - `page.tsx` – Hjemmeside med kategorier og utvalgte leverandører
  - `category/[slug]/page.tsx` – Kategorivisning med filtrering på sted
  - `request/page.tsx` – Skjema for tjenesteforespørsler
  - `api/leads` – POST-endepunkt som lagrer forespørsler i Airtable
  - `api/providers` – GET-endepunkt som henter aktive leverandører fra Airtable
- `lib/airtable.ts` – Enkle helper-funksjoner mot Airtable API
- `lib/categories.ts` – Statiske kategorier brukt på nettsiden

## Viktig

- Airtable-nøkkelen sendes aldri til klienten. All kommunikasjon skjer via server-side API-ruter.
- Denne koden er optimalisert for en MVP uten pålogging, betaling eller dashbord.
