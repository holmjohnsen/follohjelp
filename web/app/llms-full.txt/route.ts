import { faqItems } from "@/lib/content";
import {
  loadDirectory,
  normalizeWebsiteUrl,
  textResponse,
  type DirectoryProvider,
} from "@/lib/llms";
import { BASE_URL, CONTACT_EMAIL } from "@/lib/site";

export const revalidate = 3600;

function providerBlock(provider: DirectoryProvider) {
  const website = normalizeWebsiteUrl(provider.url);
  const fields = [
    provider.categoryNames.length
      ? `- Fagområde: ${provider.categoryNames.join(", ")}`
      : null,
    provider.locationName ? `- Sted: ${provider.locationName}` : null,
    provider.phone ? `- Telefon: ${provider.phone}` : null,
    provider.email ? `- E-post: ${provider.email}` : null,
    website ? `- Nettside: ${website}` : null,
    `- Side på Follohjelp: ${BASE_URL}/leverandor/${provider.slug}`,
  ].filter(Boolean);

  return [
    `#### ${provider.name}`,
    "",
    ...(provider.description ? [provider.description, ""] : []),
    ...fields,
    "",
  ];
}

export async function GET() {
  const { categories, locationNames } = await loadDirectory();
  const updated = new Date().toISOString().slice(0, 10);

  const lines = [
    "# Follohjelp – full tekstversjon",
    "",
    "> Follohjelp (follohjelp.no) er en lokal oversikt over håndverkere i Follo i Akershus – Drøbak/Frogn, Ås, Ski og Nordre Follo, Vestby og Nesodden. Brukere tar kontakt direkte med bedriften; Follohjelp formidler ikke anbud, tar ikke betaling per henvendelse og videreselger ikke henvendelser.",
    "",
    `Generert: ${updated}. Kortversjon: ${BASE_URL}/llms.txt`,
    "",
    "## Om Follohjelp",
    "",
    "Follohjelp er laget for å gjøre det enklere å finne lokale håndverkere i Follo – uten støy, falske anmeldelser eller markedsplass-preg. Tjenesten ble startet av Øyvind, som flyttet tilbake til Drøbak og savnet en enkel, lokal oversikt over håndverkere i området da familien skulle pusse opp huset.",
    "",
    "- En lokal oversikt over håndverkere og tjenester i Follo",
    "- Folk tar kontakt direkte med bedriften – ingen mellomledd",
    "- Oppføringer gjennomgås manuelt før publisering",
    "- Tjenesten er i oppstartsfase og bygges steg for steg, med kvalitet foran kvantitet",
    "",
    `Drives av E12NNI AS, 1444 Drøbak. Kontakt: ${CONTACT_EMAIL}`,
    "",
    "## Dekningsområde",
    "",
    "Follo-regionen i Akershus: Frogn (Drøbak), Ås, Nordre Follo (Ski, Kolbotn/Oppegård), Vestby og Nesodden.",
    ...(locationNames.length
      ? ["", `Steder med oppførte bedrifter nå: ${locationNames.join(", ")}.`]
      : []),
    "",
    "## Bedrifter etter fagområde",
    "",
    ...categories.flatMap((category) => [
      `### ${category.name} i Follo`,
      "",
      `${category.providers.length} ${category.providers.length === 1 ? "bedrift" : "bedrifter"}. Oversikt: ${BASE_URL}/category/${category.slug}`,
      "",
      ...category.providers.flatMap(providerBlock),
    ]),
    "## For håndverkere",
    "",
    `Håndverkere som holder til og tar oppdrag i Follo kan registrere bedriften på ${BASE_URL}/for-bedrifter. Alle oppføringer gjennomgås før publisering.`,
    "",
    "### Vanlige spørsmål fra bedrifter",
    "",
    ...faqItems.flatMap((item) => [`**${item.question}**`, item.answer, ""]),
    "## Lenker",
    "",
    `- Forside: ${BASE_URL}/`,
    `- Alle fagområder: ${BASE_URL}/category`,
    `- Om Follohjelp: ${BASE_URL}/om-follohjelp`,
    `- For bedrifter: ${BASE_URL}/for-bedrifter`,
    `- Personvern: ${BASE_URL}/personvern`,
    `- Sitemap: ${BASE_URL}/sitemap.xml`,
    "",
  ];

  return textResponse(lines.join("\n"));
}
