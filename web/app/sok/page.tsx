export const dynamic = "force-dynamic";

import {
  getCategories,
  getLocations,
  getProviders,
  type Provider,
} from "@/lib/airtable";
import { normalizeText, slugify } from "@/lib/search";

type SearchParams = {
  q?: string;
};

type ProviderResult = {
  provider: Provider;
  categoryNames: string[];
  locationName: string;
  score: number;
};

function toDisplayLocation(
  location: string,
  locationNameById: Map<string, string>,
) {
  return locationNameById.get(location) ?? location;
}

function toCategoryNames(
  categoryIds: string[] | undefined,
  categoryNameById: Map<string, string>,
) {
  if (!categoryIds || categoryIds.length === 0) return [];
  return categoryIds.map((id) => categoryNameById.get(id) ?? id);
}

function matchProvider(
  provider: Provider,
  normalizedQuery: string,
  slugQuery: string,
  categoryNameById: Map<string, string>,
  locationNameById: Map<string, string>,
): ProviderResult | null {
  const categoryNames = toCategoryNames(provider.category, categoryNameById);
  const locationName = toDisplayLocation(provider.location, locationNameById);

  const nameMatch =
    slugify(provider.name).includes(slugQuery) ||
    normalizeText(provider.name).includes(normalizedQuery);
  const locationMatch =
    normalizeText(locationName).includes(normalizedQuery) ||
    slugify(locationName).includes(slugQuery);
  const categoryMatch = categoryNames.some(
    (category) =>
      normalizeText(category).includes(normalizedQuery) ||
      slugify(category).includes(slugQuery),
  );

  const score =
    (nameMatch ? 3 : 0) + (locationMatch ? 2 : 0) + (categoryMatch ? 1 : 0);
  if (score === 0) {
    return null;
  }

  return {
    provider,
    categoryNames,
    locationName,
    score,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const normalizedQuery = normalizeText(query);
  const slugQuery = slugify(query);

  const [providers, categories, locations] = await Promise.all([
    getProviders(),
    getCategories(),
    getLocations(),
  ]);

  const categoryNameById = new Map(categories.map((cat) => [cat.id, cat.name]));
  const locationNameById = new Map(locations.map((loc) => [loc.id, loc.name]));

  const results: ProviderResult[] =
    query.length === 0
      ? []
      : providers
          .map((provider) =>
            matchProvider(
              provider,
              normalizedQuery,
              slugQuery,
              categoryNameById,
              locationNameById,
            ),
          )
          .filter(Boolean) as ProviderResult[];

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.provider.name.localeCompare(b.provider.name, "nb");
  });

  const limitedResults = results.slice(0, 30);

  return (
    <main className="container">
      <section className="hero">
        <h1>Søk</h1>
        <p className="results-count">
          {query.length === 0
            ? "Skriv inn et søk for å se resultater."
            : `${limitedResults.length} treff for '${query}'`}
        </p>
      </section>

      <section className="fh-section">
        {query.length === 0 ? (
          <div className="supplier-card">
            <div className="supplier-content">
              <div className="supplier-name">Ingen søk ennå</div>
              <p className="supplier-description">
                Skriv inn et søk på forsiden for å se relevante håndverkere.
              </p>
            </div>
          </div>
        ) : limitedResults.length === 0 ? (
          <div className="supplier-card">
            <div className="supplier-content">
              <div className="supplier-name">Ingen treff</div>
              <p className="supplier-description">
                Ingen treff. Prøv et annet søk eller velg en kategori.
              </p>
            </div>
          </div>
        ) : (
          <div className="suppliers-grid">
            {limitedResults.map(({ provider, categoryNames, locationName }) => (
              <div className="supplier-card" key={provider.id}>
                <div className="supplier-content">
                  <div className="supplier-name">{provider.name}</div>
                  <div className="supplier-category">
                    {categoryNames.length > 0 ? categoryNames.join(", ") : ""}
                  </div>
                  <p className="supplier-description">
                    {provider.description || "Ingen beskrivelse tilgjengelig."}
                  </p>
                  <div className="supplier-meta">
                    {locationName &&
                    !/^rec[A-Za-z0-9]{10,}$/.test(locationName) ? (
                      <div className="supplier-location">{locationName}</div>
                    ) : null}
                    {provider.phone ? (
                      <div className="supplier-contact">{provider.phone}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
