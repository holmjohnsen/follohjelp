import { NextResponse } from "next/server";

import { getCategories, getLocations } from "@/lib/airtable";

type CachedOptions = {
  categories: { id: string; name: string }[];
  locations: { id: string; name: string }[];
  expires: number;
};

let cachedOptions: CachedOptions | null = null;
const OPTIONS_TTL_MS = 10 * 60 * 1000;

async function getOptionsWithCache() {
  const now = Date.now();
  if (cachedOptions && cachedOptions.expires > now) {
    return cachedOptions;
  }

  const [categories, locations] = await Promise.all([getCategories(), getLocations()]);
  const result: CachedOptions = {
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
    locations: locations.map((l) => ({ id: l.id, name: l.name })),
    expires: now + OPTIONS_TTL_MS,
  };
  cachedOptions = result;
  return result;
}

export async function GET() {
  try {
    const options = await getOptionsWithCache();
    return NextResponse.json(options);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load options";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
