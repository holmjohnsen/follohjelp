export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCategories } from "@/lib/airtable";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to load search options", error);
    return NextResponse.json(
      { error: "Kunne ikke hente søkevalg" },
      { status: 500 },
    );
  }
}
