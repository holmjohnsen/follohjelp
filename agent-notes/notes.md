# Follohjelp Notes

## Project Overview
- **Type:** Local service marketplace / lead generation
- **Market:** Norwegian (Follo region)
- **Tech:** Next.js + Airtable
- **Repo:** `~/Developer/follohjelp/web` (symlinked as `projects/follohjelp/repo`)

## Airtable Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| Providers | Service providers | name, category, location, status, email |
| Leads | Customer henvendelser | category, location, name, email, assignedProviders |
| Categories | Service categories | name, slug, active |
| Locations | Geographic areas | name, active |

## KPI Implementation Plan

### Option A: Server-side `/api/metrics` endpoint

**Pros:**
- Real-time data
- No external scripts
- Uses existing auth/env

**Cons:**
- Requires code changes
- Adds API overhead

**Implementation:**
```typescript
// app/api/metrics/route.ts
import { getProviders, getLeads } from "@/lib/airtable";

export async function GET() {
  const [providers, leads] = await Promise.all([
    getProviders({}), // filtered by status=active in lib
    getLeads(1000)
  ]);
  
  const activeProviders = providers.length;
  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.assignedProviders).length;
  
  return Response.json({
    activeProviders,
    totalLeads,
    contactedLeads,
    conversionRate: (contactedLeads / totalLeads) * 100
  });
}
```

### Option B: Standalone script (pulls Airtable + outputs JSON)

**Pros:**
- No production code changes
- Can run as cron job
- Easy to modify/debug

**Cons:**
- External dependency
- Needs API key access

**Implementation:**
```bash
# scripts/metrics.ts
# Uses Airtable API directly
# Outputs JSON to stdout or file
# Can be run: npx tsx scripts/metrics.ts > metrics.json
```

### Recommended: Option A (API endpoint)

Fits better with existing Next.js app. Use Option B only if you need offline metrics.

---

## Next Steps

1. **Add `/api/metrics` endpoint** to repo (Option A)
2. **Connect to analytics** (GA4, GSC) for organic sessions + indexed pages
3. **Add tracking** to existing routes for conversion events
4. **Set up monitoring** (cron to daily)

---

## Recent pull metrics Tasks
- TASK-005: Connected KPIs to Airtable (in progress)

---

*Updated: 2026-02-28 | Portfolio Manager*

---

## Analyst-01 Task: run-metrics.js

**Date:** 2026-02-28

### Created
- `projects/follohjelp/run-metrics.js` — Metrics fetcher script

### Usage
```bash
# Local (requires running dev server)
cd /Users/oyvind/Developer/openclaw-work
METRICS_TOKEN=7298da7096d11dc9738fce8c83bf5177d659b2f0eb847fff8229bbc8dba3413b node projects/follohjelp/run-metrics.js

# Production (set METRICS_URL)
METRICS_URL=https://your-deploy.railway.app/api/metrics METRICS_TOKEN=xxx node projects/follohjelp/run-metrics.js
```

### Output
- Snapshot: `projects/follohjelp/out/YYYY-MM-DD.json`
- Summary appended to: `projects/follohjelp/notes.md`

### API Response Structure
```json
{
  "generatedAt": "2026-02-28T...",
  "kpis": {
    "leads_created_30d": 0,
    "providers_active": 0,
    "providers_with_email_active": 0,
    "leads_with_assigned_providers_30d": 0,
    "match_rate_30d": 0
  }
}
```

### Status
- ✅ Script created
- ✅ API structure mapped
- ⏳ Awaiting live server to run first fetch

### Notes
- Local dev server not running - test when deployed
- Token found in web/.env.local
- No METRICS_URL set in .env.local - user must provide in production

---
## Metrics Snapshot: 2026-02-28

- **Leads Created (30d):** 1
- **Active Providers:** 5
- **Active Providers with Email:** 5
- **Leads with Assigned Providers (30d):** 1
- **Match Rate (30d):** 100.0%
- **API Timestamp:** 2026-02-28T22:46:28.969Z

*Fetched: 2026-02-28T22:46:29.153Z*
