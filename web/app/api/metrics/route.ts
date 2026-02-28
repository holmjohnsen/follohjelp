import { NextResponse } from "next/server";

import { getMetricsSourceData } from "@/lib/airtable";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) return null;

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

/*
Smoke test:
curl -i http://localhost:3000/api/metrics
curl -i -H "Authorization: Bearer $METRICS_TOKEN" http://localhost:3000/api/metrics
*/
export async function GET(request: Request) {
  const metricsToken = process.env.METRICS_TOKEN?.trim();
  if (!metricsToken) {
    return NextResponse.json({ error: "METRICS_TOKEN not set" }, { status: 500 });
  }

  const bearerToken = getBearerToken(request);
  if (!bearerToken || bearerToken !== metricsToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { leads, providers, providersStatusFieldPresent } = await getMetricsSourceData();
    const cutoff = Date.now() - THIRTY_DAYS_MS;

    const leadsInLast30d = leads.filter((lead) => {
      if (!lead.createdAt) return false;
      const timestamp = Date.parse(lead.createdAt);
      return !Number.isNaN(timestamp) && timestamp >= cutoff;
    });

    const leadsCreated30d = leadsInLast30d.length;
    const leadsWithAssignedProviders30d = leadsInLast30d.filter((lead) => {
      const assigned = lead.assignedProviders?.trim();
      return Boolean(assigned);
    }).length;

    const activeProviders = providersStatusFieldPresent
      ? providers.filter((provider) => provider.status?.toLowerCase() === "active")
      : providers;

    const providersActive = activeProviders.length;
    const providersWithEmailActive = activeProviders.filter((provider) => {
      const email = provider.email?.trim();
      return Boolean(email);
    }).length;

    const matchRate30d = leadsCreated30d
      ? parseFloat((leadsWithAssignedProviders30d / leadsCreated30d).toFixed(4))
      : 0;

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      kpis: {
        leads_created_30d: leadsCreated30d,
        providers_active: providersActive,
        providers_with_email_active: providersWithEmailActive,
        leads_with_assigned_providers_30d: leadsWithAssignedProviders30d,
        match_rate_30d: matchRate30d,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
