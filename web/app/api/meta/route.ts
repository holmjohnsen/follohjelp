import { NextResponse } from "next/server";

import { getCategories, getLocations } from "@/lib/airtable";

export async function GET() {
  try {
    const [categories, locations] = await Promise.all([
      getCategories(),
      getLocations(),
    ]);

    return NextResponse.json({ categories, locations });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
