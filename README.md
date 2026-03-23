# Follohjelp

Local directory for services in the Follo region.

## Tech Stack

- Next.js with App Router
- Airtable as the primary database
- Netlify for hosting and Next.js serverless deployment
- TypeScript

## Architecture Overview

- The active application lives in `web/`.
- Data comes from Airtable.
- `Categories` and `Locations` are separate Airtable tables.
- `Providers` links to `Categories` and `Locations` through linked record fields.
- The frontend does not call Airtable directly.
- All Airtable reads and writes go through Next.js API routes and server-side helpers.
- Netlify builds the app from `/web` and uses the Next.js adapter to handle serverless behavior automatically.

## Airtable Schema

### Providers

- `name`
- `category` (linked to `Categories`)
- `location` (linked to `Locations`)
- `status` (`active` | `pending`)
- `category_other` (text fallback)
- `location_other` (text fallback)

### Categories

- `name`
- `slug`
- `active`

### Locations

- `name`
- `slug`
- `active`

Linked record fields must always be written as arrays of record IDs in Airtable API.

## Development

Run locally:

```bash
cd web
npm install
npm run dev
```

Environment variables required:

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_PROVIDERS_TABLE`
- `AIRTABLE_CATEGORIES_TABLE`
- `AIRTABLE_CATEGORIES_VIEW` (optional)

Current location data also depends on:

- `AIRTABLE_LOCATIONS_TABLE`
- `AIRTABLE_LOCATIONS_VIEW` (optional)

## Deployment

- Deployed on Netlify
- Netlify builds from the `/web` directory
- `@netlify/plugin-nextjs` handles Next.js serverless functions and routing automatically

## Key Rules / Gotchas

- Never write text values into Airtable linked fields; use arrays of Airtable record IDs.
- Category and location filtering is handled with Airtable formulas and linked-record lookups.
- Slugs should come from Airtable; only fall back to slug generation when a slug is missing.
- "Other" values belong in `category_other` and `location_other`, not in linked fields.

## Future Improvements

- Location filtering in the UI
- Search on the homepage
- Admin workflow for handling `other` values
