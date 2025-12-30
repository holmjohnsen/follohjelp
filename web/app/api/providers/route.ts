import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createPendingProvider,
  getCategories,
  getLocations,
  getProviders,
} from "@/lib/airtable";
import { sendEmail } from "@/lib/email";

const providerSchema = z
  .object({
    name: z.string().min(1, "Navn er påkrevd"),
    categoryId: z.string().optional(),
    locationId: z.string().optional(),
    description: z.string().min(1, "Beskrivelse er påkrevd"),
    email: z.string().email("Ugyldig e-post").optional(),
    phone: z.string().optional(),
    url: z.string().optional(),
  })
  .refine(
    (data) => (data.email && data.email.length > 0) || (data.phone && data.phone.length > 0),
    { message: "Telefon eller e-post er påkrevd" },
  );

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

    const { categories, locations } = await getOptionsWithCache();
    const categoryMatch = parsed.categoryId
      ? categories.find((c) => c.id === parsed.categoryId)
      : undefined;
    const locationMatch = parsed.locationId
      ? locations.find((l) => l.id === parsed.locationId)
      : undefined;

    const needReview =
      !parsed.categoryId ||
      !parsed.locationId ||
      parsed.categoryId === "OTHER" ||
      parsed.locationId === "OTHER" ||
      !categoryMatch ||
      !locationMatch;

    const notes: string[] = [];
    if (!categoryMatch && parsed.categoryId) {
      notes.push(`Ukjent kategori: ${parsed.categoryId}`);
    }
    if (!locationMatch && parsed.locationId) {
      notes.push(`Ukjent sted: ${parsed.locationId}`);
    }
    if (!parsed.categoryId) {
      notes.push("Kategori ikke valgt");
    }
    if (!parsed.locationId) {
      notes.push("Sted ikke valgt");
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
      categoryId: categoryMatch ? categoryMatch.id : parsed.categoryId,
      categoryOther: !categoryMatch ? "ikke valgt" : undefined,
      locationId: locationMatch ? locationMatch.id : parsed.locationId,
      locationOther: !locationMatch ? "ikke valgt" : undefined,
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
