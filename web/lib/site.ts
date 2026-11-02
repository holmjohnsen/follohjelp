export const BASE_URL = "https://follohjelp.no";
export const SITE_NAME = "Follohjelp";
export const CONTACT_EMAIL = "hei@follohjelp.no";

// IndexNow-nøkkelen er offentlig: den må også ligge som /<nøkkel>.txt i public/.
export const INDEXNOW_KEY = "ec3c78729656dafa184022d6c088be7a";

export const AREA_SERVED = {
  "@type": "AdministrativeArea",
  name: "Follo",
} as const;

// Mest presise schema.org-type per fagområde. Ukjente kategorier faller
// tilbake til HomeAndConstructionBusiness.
const SCHEMA_TYPE_BY_CATEGORY: Record<string, string> = {
  rørlegger: "Plumber",
  elektriker: "Electrician",
  snekker: "GeneralContractor",
  tømrer: "GeneralContractor",
  murer: "GeneralContractor",
  maler: "HousePainter",
  taktekker: "RoofingContractor",
  låsesmed: "Locksmith",
  renholder: "HousekeepingService",
  rengjøring: "HousekeepingService",
};

export function schemaTypeForCategory(categoryName?: string) {
  if (!categoryName) return "HomeAndConstructionBusiness";
  return (
    SCHEMA_TYPE_BY_CATEGORY[categoryName.trim().toLowerCase()] ??
    "HomeAndConstructionBusiness"
  );
}

// Kutter tekst på ordgrense slik at meta descriptions ikke ender midt i et ord.
export function truncateAtWord(text: string, max = 155) {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,.;:–-]+$/, "")}…`;
}
