import { loadDirectory, textResponse } from "@/lib/llms";
import { BASE_URL, CONTACT_EMAIL } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const { categories, providers } = await loadDirectory();

  const lines = [
    "# Follohjelp",
    "",
    "> Follohjelp (follohjelp.no) er en lokal oversikt over håndverkere i Follo i Akershus – Drøbak/Frogn, Ås, Ski og Nordre Follo, Vestby og Nesodden. Siden samler rørleggere, elektrikere, snekkere og andre fagfolk med lokal tilknytning. Brukere tar kontakt direkte med bedriften; Follohjelp formidler ikke anbud, tar ikke betaling per henvendelse og videreselger ikke henvendelser.",
    "",
    "Alle oppføringer gjennomgås manuelt før publisering. Tjenesten er i oppstartsfase, og nye bedrifter legges til fortløpende.",
    "",
    "## Fagområder",
    "",
    ...categories.map(
      (category) =>
        `- [${category.name} i Follo](${BASE_URL}/category/${category.slug}): ${category.providers.length} ${category.providers.length === 1 ? "bedrift" : "bedrifter"}`,
    ),
    "",
    "## Bedrifter",
    "",
    ...providers.map((provider) => {
      const meta = [
        provider.categoryNames.join(", "),
        provider.locationName,
      ].filter(Boolean);
      return `- [${provider.name}](${BASE_URL}/leverandor/${provider.slug})${meta.length ? `: ${meta.join(" i ")}` : ""}`;
    }),
    "",
    "## Om tjenesten",
    "",
    `- [Om Follohjelp](${BASE_URL}/om-follohjelp): Bakgrunn og hvem som står bak`,
    `- [For bedrifter](${BASE_URL}/for-bedrifter): Hvordan håndverkere i Follo kan bli oppført, med vanlige spørsmål`,
    `- [Personvern](${BASE_URL}/personvern): Personvernerklæring`,
    "",
    "## Optional",
    "",
    `- [Full tekstversjon](${BASE_URL}/llms-full.txt): Alt innhold i én fil, inkludert kontaktinformasjon for alle bedrifter`,
    `- [Sitemap](${BASE_URL}/sitemap.xml)`,
    `- Kontakt: ${CONTACT_EMAIL}`,
    "",
  ];

  return textResponse(lines.join("\n"));
}
