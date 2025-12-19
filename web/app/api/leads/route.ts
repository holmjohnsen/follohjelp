import { createLead, getLeads, getProvidersWithEmail } from "@/lib/airtable";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  category: z.string().min(1, "Kategori er påkrevd"),
  description: z.string().min(1, "Beskrivelse er påkrevd"),
  location: z.string().min(1, "Sted er påkrevd"),
  name: z.string().min(1, "Navn er påkrevd"),
  email: z.string().email("Ugyldig e-post"),
  phone: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Du må samtykke til vilkårene" }),
  }),
});

type LeadPayload = z.infer<typeof leadSchema>;

async function matchProviders(payload: LeadPayload) {
  const primary = await getProvidersWithEmail({
    category: payload.category,
    location: payload.location,
  });

  const fallback =
    primary.length >= 3
      ? []
      : await getProvidersWithEmail({ category: payload.category });

  const combined = [...primary];
  fallback.forEach((provider) => {
    if (!combined.find((p) => p.id === provider.id)) {
      combined.push(provider);
    }
  });

  return combined.slice(0, 3);
}

export async function GET() {
  try {
    const leads = await getLeads(20);
    return NextResponse.json({ leads });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Kunne ikke hente leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildEmailText(payload: LeadPayload) {
  return [
    `Ny henvendelse via Follohjelp:`,
    ``,
    `Kategori: ${payload.category}`,
    `Sted: ${payload.location}`,
    `Navn: ${payload.name}`,
    `E-post: ${payload.email}`,
    payload.phone ? `Telefon: ${payload.phone}` : null,
    ``,
    `Beskrivelse:`,
    payload.description,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  console.log("[leads] POST hit");
  try {
    const json = await request.json();
    const parsed = leadSchema.parse(json);

    const matchedProviders = await matchProviders(parsed);
    console.log(
  "[leads] matched providers:",
  matchedProviders.map((p) => `${p.name} (${p.category}, ${p.location})`),
);
    const assignedProviders = matchedProviders.map((p) => p.name).join(", ");

    await createLead({
      category: parsed.category,
      description: parsed.description,
      location: parsed.location,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      assignedProviders,
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    const emailText = buildEmailText(parsed);

    const providersWithEmail = matchedProviders.filter((p) => p.email);

console.log("[leads] matched providers:", matchedProviders.length);
console.log("[leads] providers with email:", providersWithEmail.length);
console.log(
  "[leads] sending to:",
  providersWithEmail.map((p) => `${p.name} <${p.email}>`),
);

await Promise.all(
  providersWithEmail.map((provider) =>
    sendEmail({
      to: [provider.email!],
      subject: `Nytt oppdrag i ${parsed.category} (${parsed.location})`,
      text: emailText,
    }),
  ),
);

    if (adminEmail) {
      await sendEmail({
        to: [adminEmail],
        subject: `Kopi: nytt oppdrag (${parsed.category})`,
        text: `Tildelt leverandører: ${assignedProviders || "Ingen"}\n\n${emailText}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const message =
      error instanceof Error ? error.message : "Kunne ikke lagre forespørselen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
