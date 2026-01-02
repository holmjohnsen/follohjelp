export const dynamic = "force-dynamic";

import { getCategories, getProvidersByCategorySlug } from "@/lib/airtable";
import HomeSearchBar from "@/components/HomeSearchBar";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = await getCategories();
  const match = categories.find((cat) => cat.slug === category);

  if (!match) {
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
  const nameLower = match.name.toLowerCase();
  const pluralLower = pluralMap[match.name] ?? nameLower;

  return {
    title: `${match.name} i Follo – lokale ${pluralLower} | Follohjelp`,
    description: `Finn lokale ${pluralLower} i Follo. Se bedrifter i Drøbak, Ås, Ski, Vestby, Nesodden og omegn.`,
    alternates: {
      canonical: `/category/${match.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const { category: matchedCategory, providers } =
    await getProvidersByCategorySlug(category);

  if (!matchedCategory) {
    return notFound();
  }

  return (
    <main className="container">
      <section className="hero">
        <h1>{matchedCategory.name} i Follo</h1>
        <p className="results-count">
          {providers.length} treff i kategorien {matchedCategory.name}.
        </p>
      </section>

      <section className="fh-section">
        <HomeSearchBar placeholder="Søk etter firmanavn, sted eller fagområde" />
      </section>

      <section className="fh-section">
        <div className="suppliers-grid">
          {providers.map((provider) => (
            <div className="supplier-card" key={provider.id}>
              <div className="supplier-content">
                <div className="supplier-name">{provider.name}</div>
                <div className="supplier-category">
                  {(provider.category && provider.category.length > 0
                    ? provider.category.join(", ")
                    : "")}
              </div>
              <p className="supplier-description">
                {provider.description || "Ingen beskrivelse tilgjengelig."}
              </p>
              <div className="supplier-meta">
                  {provider.location &&
                  !/^rec[A-Za-z0-9]{10,}$/.test(provider.location) ? (
                    <div className="supplier-location">{provider.location}</div>
                  ) : null}
                  {provider.phone ? (
                    <div className="supplier-contact">{provider.phone}</div>
                  ) : null}
                </div>
              </div>
            </div>
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
    </main>
  );
}
