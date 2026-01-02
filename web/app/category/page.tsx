export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/airtable";
import Link from "next/link";
import HomeSearchBar from "@/components/HomeSearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategorier i Follo – finn lokale håndverkere | Follohjelp",
  description:
    "Velg fagområde og finn lokale håndverkere i Follo. Se rørlegger, elektriker, snekker, murer og flere.",
  alternates: {
    canonical: "/category",
  },
};

export default async function CategoryLandingPage() {
  const categories = await getCategories();
  const emojiMap: Record<string, string> = {
    Rørlegger: "🔧",
    Elektriker: "⚡",
    Snekker: "🪚",
    Tømrer: "🪚",
    Murer: "🧱",
    Flislegger: "🧩",
    Maler: "🎨",
    Reparatør: "🛠️",
  };

  return (
    <main className="container">
      <section className="hero">
        <h1>Kategorier</h1>
        <p className="subtitle">
          Utforsk fagområder og finn lokale håndverkere i Follo.
        </p>
      </section>

      <section className="fh-section">
        <HomeSearchBar placeholder="Søk etter firmanavn, sted eller fagområde" />
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                className="category-pill"
                href={`/category/${category.slug}`}
              >
                {emojiMap[category.name] ? `${emojiMap[category.name]} ${category.name}` : category.name}
              </Link>
            ))}
            {categories.length === 0 ? (
              <p className="fh-lead">Ingen kategorier tilgjengelig ennå.</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
