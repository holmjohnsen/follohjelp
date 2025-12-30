import { NextResponse } from "next/server";
import { z } from "zod";

import { createPendingProvider, getProviderOptions, getProviders } from "@/lib/airtable";
import { sendEmail } from "@/lib/email";

const providerSchema = z
  .object({
    name: z.string().min(1, "Navn er påkrevd"),
    categoryId: z.string().min(1, "Kategori er påkrevd"),
    locationId: z.string().min(1, "Sted er påkrevd"),
    categoryOther: z.string().optional(),
    locationOther: z.string().optional(),
    description: z.string().min(1, "Beskrivelse er påkrevd"),
    email: z.string().email("Ugyldig e-post").optional(),
    phone: z.string().optional(),
    url: z.string().optional(),
  })
  .refine(
    (data) => (data.email && data.email.length > 0) || (data.phone && data.phone.length > 0),
    { message: "Telefon eller e-post er påkrevd" },
  );

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

    const { categories, locations } = await getProviderOptions();
    const categoryMatch = categories.find((c) => c.id === parsed.categoryId);
    const locationMatch = locations.find((l) => l.id === parsed.locationId);

    if (!parsed.categoryId || !parsed.locationId) {
      return NextResponse.json(
        { error: "Kategori og sted er påkrevd" },
        { status: 400 },
      );
    }

    const notes: string[] = [];
    let needReview = false;
    let categoryId: string | undefined;
    let categoryOther: string | undefined;
    let locationId: string | undefined;
    let locationOther: string | undefined;

    if (parsed.categoryId === "OTHER") {
      categoryOther = parsed.categoryOther?.trim();
      if (!categoryOther) {
        return NextResponse.json(
          { error: "Kategori (annet) er påkrevd" },
          { status: 400 },
        );
      }
      needReview = true;
    } else if (categoryMatch) {
      categoryId = categoryMatch.id;
    } else {
      categoryOther = parsed.categoryOther?.trim() || parsed.categoryId;
      needReview = true;
      notes.push(`Ukjent kategori: ${parsed.categoryId}`);
    }

    if (parsed.locationId === "OTHER") {
      locationOther = parsed.locationOther?.trim();
      if (!locationOther) {
        return NextResponse.json(
          { error: "Sted (annet) er påkrevd" },
          { status: 400 },
        );
      }
      needReview = true;
    } else if (locationMatch) {
      locationId = locationMatch.id;
    } else {
      locationOther = parsed.locationOther?.trim() || parsed.locationId;
      needReview = true;
      notes.push(`Ukjent sted: ${parsed.locationId}`);
    }

    let url = parsed.url?.trim();
    if (url) {
      const hasProtocol = /^https?:\/\//i.test(url);
      if (!hasProtocol) {
        url = `https://${url}`;
      }
    }

    await createPendingProvider({
      name: parsed.name,
      categoryId,
      categoryOther,
      locationId,
      locationOther,
      description: parsed.description,
      email: parsed.email ?? "",
      phone: parsed.phone,
      needReview,
      notes: notes.length ? notes.join("; ") : undefined,
      url,
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const subject = `Ny bedrift foreslått: ${parsed.name}`;
      const lines = [
        `Navn: ${parsed.name}`,
        `Kategori ID: ${parsed.categoryId ?? "ikke valgt"}`,
        `Sted ID: ${parsed.locationId ?? "ikke valgt"}`,
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
