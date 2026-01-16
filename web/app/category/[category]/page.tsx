export const dynamic = "force-dynamic";

import { getCategories, getLocations, getProvidersByCategorySlug } from "@/lib/airtable";
import HomeSearchBar from "@/components/HomeSearchBar";
import { notFound } from "next/navigation";
import CategoryPills from "@/components/CategoryPills";
import { ProviderCardTrack } from "@/components/ProviderCardTrack";
import ProviderCard from "@/components/ProviderCard";
import EmptyResultTracker from "@/components/EmptyResultTracker";

const baseUrl = "https://follohjelp.no";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [{ category: matchedCategory, providers }, categories] =
    await Promise.all([
      getProvidersByCategorySlug(category),
      getCategories(),
    ]);

  if (!matchedCategory) {
    return {
      title: "Kategori ikke funnet | Follohjelp",
      description: "Kategorien finnes ikke.",
    };
  }

  const pluralMap: Record<string, string> = {
    Rørlegger: "rørleggere",
    Elektriker: "elektrikere",
    Snekker: "snekkere",
    Tømrer: "tømrere",
    Murer: "murere",
    Maler: "malere",
    Flislegger: "flisleggere",
    Taktekker: "taktekkere",
    Renholder: "renholdere",
    Rengjøring: "renholdere",
  };
  const nameLower = matchedCategory.name.toLowerCase();
  const pluralLower = pluralMap[matchedCategory.name] ?? nameLower;

  const robots =
    providers.length === 0
      ? {
          index: false,
          follow: true,
        }
      : undefined;

  return {
    title: `${matchedCategory.name} i Follo – lokale ${pluralLower} | Follohjelp`,
    description: `Finn lokale ${pluralLower} i Follo. Se bedrifter i Drøbak, Ås, Ski, Vestby, Nesodden og omegn.`,
    robots,
    alternates: {
      canonical: `/category/${matchedCategory.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [{ category: matchedCategory, providers }, categories, locations] =
    await Promise.all([
      getProvidersByCategorySlug(category),
      getCategories(),
      getLocations(),
    ]);

  if (!matchedCategory) {
    return notFound();
  }

  const locationNameById = new Map(locations.map((loc) => [loc.id, loc.name]));
  const otherCategories = categories
    .filter((cat) => cat.slug !== category)
    .slice(0, 12);

  return (
    <main className="container">
      <section className="hero">
        <h1>{matchedCategory.name} i Follo</h1>
        <p className="results-count">
          {providers.length} treff i kategorien {matchedCategory.name}.
        </p>
      </section>

      <section className="fh-section">
        <HomeSearchBar source="category" />
      </section>

      <section className="fh-section">
        <div className="suppliers-grid">
          {providers.map((provider) => (
            <ProviderCardTrack
              key={provider.id}
              providerId={provider.id}
              categorySlug={matchedCategory.slug}
              locationSlugOrName={provider.location}
              pageType="category"
            >
              <ProviderCard
                provider={provider}
                categoryNames={provider.category}
                locationName={
                  locationNameById.get(provider.location) ?? provider.location
                }
                categorySlug={matchedCategory.slug}
              />
            </ProviderCardTrack>
          ))}
          {providers.length === 0 ? (
            <div className="supplier-card">
              <div className="supplier-content">
                <div className="supplier-name">Ingen treff ennå</div>
                <p className="supplier-description">
                  Vi legger til flere håndverkere fortløpende.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {providers.length === 0 ? (
        <EmptyResultTracker context="category" category={matchedCategory.slug} />
      ) : null}

      {providers.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: providers.map((provider, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "LocalBusiness",
                    name: provider.name,
                    ...(provider.description
                      ? { description: provider.description }
                      : {}),
                    ...(provider.phone ? { telephone: provider.phone } : {}),
                    areaServed: "Follo",
                    address: {
                      "@type": "PostalAddress",
                      addressRegion: "Akershus",
                      addressCountry: "NO",
                    },
                    url: `${baseUrl}/category/${matchedCategory.slug}#provider-${provider.id}`,
                  },
                })),
              },
              null,
              2,
            ),
          }}
        />
      ) : null}

      {otherCategories.length ? (
        <section className="fh-section">
          <h2 className="fh-h2">Utforsk flere fagområder</h2>
          <CategoryPills
            items={otherCategories}
            source="category_page"
            activeSlug={matchedCategory.slug}
            limit={12}
          />
        </section>
      ) : null}

      <section className="fh-section">
        <p className="results-count">
          Ser du etter flere håndverkere?{" "}
          <a href="/category">Se alle fagområder</a>
        </p>
      </section>
    </main>
  );
}
