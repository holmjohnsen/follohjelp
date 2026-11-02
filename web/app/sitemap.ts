import { getCategories, getProviders } from "@/lib/airtable";
import { BASE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

// Regenerer sitemap jevnlig, slik at nye leverandører i Airtable kommer med
// uten at det må deployes på nytt.
export const revalidate = 3600;

const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function toDate(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function latest(dates: Array<Date | undefined>) {
  const valid = dates.filter((date): date is Date => Boolean(date));
  if (valid.length === 0) return undefined;
  return new Date(Math.max(...valid.map((date) => date.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let providers: Awaited<ReturnType<typeof getProviders>> = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories for sitemap", error);
    categories = [];
  }

  try {
    providers = await getProviders();
  } catch (error) {
    console.error("Failed to load providers for sitemap", error);
    providers = [];
  }

  // lastmod skal gjenspeile faktisk endret innhold. Settes den til "nå" ved
  // hver generering, slutter søkemotorene å stole på feltet.
  const allProvidersModified = latest(
    providers.map((provider) => toDate(provider.updatedAt)),
  );

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: allProvidersModified },
    { url: `${BASE_URL}/category`, lastModified: allProvidersModified },
    { url: `${BASE_URL}/for-bedrifter` },
    { url: `${BASE_URL}/om-follohjelp` },
    { url: `${BASE_URL}/personvern` },
  ];

  // Kategorier uten leverandører er noindex, og hører derfor ikke hjemme her.
  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap(
    (category) => {
      const categoryProviders = providers.filter((provider) =>
        provider.category?.includes(category.id),
      );
      if (categoryProviders.length === 0) return [];
      return [
        {
          url: `${BASE_URL}/category/${category.slug}`,
          lastModified: latest(
            categoryProviders.map((provider) => toDate(provider.updatedAt)),
          ),
        },
      ];
    },
  );

  const providerEntries: MetadataRoute.Sitemap = providers.flatMap(
    (provider) => {
      const slug = provider.slug?.trim();
      if (!slug || !VALID_SLUG_PATTERN.test(slug)) return [];
      return [
        {
          url: `${BASE_URL}/leverandor/${slug}`,
          lastModified: toDate(provider.updatedAt),
        },
      ];
    },
  );

  return [...staticEntries, ...categoryEntries, ...providerEntries];
}
