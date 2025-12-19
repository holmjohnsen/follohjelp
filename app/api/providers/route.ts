import { NextResponse } from "next/server";
import { fetchProviders } from "@/lib/airtable";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;

    const providers = await fetchProviders({ category, location });
    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Provider lookup failed", error);
    return NextResponse.json(
      { error: "Kunne ikke hente leverandører" },
      { status: 500 },
    );
  }
}
