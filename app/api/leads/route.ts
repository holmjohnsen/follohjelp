import { NextResponse } from "next/server";
import { createLead } from "@/lib/airtable";

type LeadRequest = {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  location?: string;
  details?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequest;
    if (!body.name) {
      return NextResponse.json(
        { error: "Navn er påkrevd" },
        { status: 400 },
      );
    }

    const record = await createLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      category: body.category,
      location: body.location,
      details: body.details,
    });

    return NextResponse.json({ id: record.id }, { status: 201 });
  } catch (error) {
    console.error("Lead creation failed", error);
    return NextResponse.json(
      { error: "Kunne ikke lagre henvendelsen akkurat nå." },
      { status: 500 },
    );
  }
}
