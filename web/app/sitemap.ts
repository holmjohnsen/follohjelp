import { getCategories, getProviders } from "@/lib/airtable";
import type { MetadataRoute } from "next";

const BASE_URL = "https://follohjelp.no";
const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

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

  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/for-bedrifter`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/om-follohjelp`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/category`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const providerEntries: MetadataRoute.Sitemap = providers
    .map((provider) => {
      const slug = provider.slug?.trim();
      if (!slug || !VALID_SLUG_PATTERN.test(slug)) {
        return null;
      }

      const providerLastModified = provider.updatedAt?.trim()
        ? new Date(provider.updatedAt)
        : new Date();

      return {
        url: `${BASE_URL}/leverandor/${slug}`,
        lastModified: Number.isNaN(providerLastModified.getTime())
          ? new Date()
          : providerLastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticEntries, ...categoryEntries, ...providerEntries];
}
