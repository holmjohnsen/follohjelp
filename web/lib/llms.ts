import {
  getCategories,
  getLocations,
  getProviders,
  type Category,
  type Provider,
} from "@/lib/airtable";

export type DirectoryProvider = Provider & {
  categoryNames: string[];
  locationName?: string;
};

export type DirectoryCategory = Category & {
  providers: DirectoryProvider[];
};

// Henter katalogen fra Airtable i én operasjon for llms.txt/llms-full.txt.
// Kategorier uten leverandører utelates, slik som i sitemapen.
export async function loadDirectory() {
  const [categories, providers, locations] = await Promise.all([
    getCategories(),
    getProviders(),
    getLocations(),
  ]);

  const categoryNameById = new Map(categories.map((cat) => [cat.id, cat.name]));
  const locationNameById = new Map(locations.map((loc) => [loc.id, loc.name]));

  const directoryProviders: DirectoryProvider[] = providers
    .filter((provider) => provider.slug?.trim())
    .map((provider) => ({
      ...provider,
      categoryNames: (provider.category ?? [])
        .map((id) => categoryNameById.get(id))
        .filter((name): name is string => Boolean(name)),
      locationName: locationNameById.get(provider.location),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "nb"));

  const directoryCategories: DirectoryCategory[] = categories
    .map((category) => ({
      ...category,
      providers: directoryProviders.filter((provider) =>
        provider.category?.includes(category.id),
      ),
    }))
    .filter((category) => category.providers.length > 0);

  const locationNames = [
    ...new Set(
      directoryProviders
        .map((provider) => provider.locationName)
        .filter((name): name is string => Boolean(name)),
    ),
  ].sort((a, b) => a.localeCompare(b, "nb"));

  return {
    categories: directoryCategories,
    providers: directoryProviders,
    locationNames,
  };
}

export function normalizeWebsiteUrl(url: string | undefined) {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed)
    ? trimmed.replace(/^https?:/i, (scheme) => scheme.toLowerCase())
    : `https://${trimmed}`;
}

export function textResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
