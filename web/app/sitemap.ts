import { getCategories } from "@/lib/airtable";
import type { MetadataRoute } from "next";

const BASE_URL = "https://follohjelp.no";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories for sitemap", error);
    categories = [];
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

  return [...staticEntries, ...categoryEntries];
}
