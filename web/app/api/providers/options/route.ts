import { NextResponse } from "next/server";

import { getProviderOptions } from "@/lib/airtable";

export async function GET() {
  try {
    const options = await getProviderOptions();
    return NextResponse.json(options);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load options";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
