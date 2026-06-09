import { NextResponse } from "next/server";

import { getCategories, getLocations } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, locations] = await Promise.all([
      getCategories(),
      getLocations(),
    ]);

    const response = NextResponse.json({ categories, locations });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
