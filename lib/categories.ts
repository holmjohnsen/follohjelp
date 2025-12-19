export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "handyman",
    name: "Håndverker",
    description: "Snekkere, malere, murere og andre håndverkere.",
  },
  {
    slug: "plumber",
    name: "Rørlegger",
    description: "Hjelp med vann, varme og sanitær.",
  },
  {
    slug: "electrician",
    name: "Elektriker",
    description: "Sertifiserte elektrikere for små og store jobber.",
  },
  {
    slug: "cleaning",
    name: "Renhold",
    description: "Rengjøring for hjem, kontor og fellesområder.",
  },
  {
    slug: "outdoor",
    name: "Utearbeid",
    description: "Hagearbeid, snørydding og utendørs vedlikehold.",
  },
  {
    slug: "moving",
    name: "Flytting",
    description: "Flyttehjelp, bærehjelp og transport.",
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
