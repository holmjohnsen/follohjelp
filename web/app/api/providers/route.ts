import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createPendingProvider,
  getProviders,
} from "@/lib/airtable";
import { sendEmail } from "@/lib/email";

const providerSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  categoryId: z.string().min(1, "Kategori er påkrevd"),
  locationId: z.string().min(1, "Sted er påkrevd"),
  description: z.string().min(1, "Beskrivelse er påkrevd"),
  email: z.string().email("Ugyldig e-post"),
  phone: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") ?? undefined;
    const location = url.searchParams.get("location") ?? undefined;

    const providers = await getProviders({ category, location });
    return NextResponse.json({ providers });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load providers";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = providerSchema.parse(body);

    await createPendingProvider(parsed);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const subject = `Ny bedrift foreslått: ${parsed.name}`;
      const lines = [
        `Navn: ${parsed.name}`,
        `Kategori ID: ${parsed.categoryId}`,
        `Sted ID: ${parsed.locationId}`,
        `E-post: ${parsed.email}`,
        parsed.phone ? `Telefon: ${parsed.phone}` : null,
        "",
        "Beskrivelse:",
        parsed.description,
      ]
        .filter(Boolean)
        .join("\n");

      await sendEmail({
        to: [adminEmail],
        subject,
        text: lines,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const message =
      err instanceof Error ? err.message : "Kunne ikke opprette bedrift";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
