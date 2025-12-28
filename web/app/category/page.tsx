export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/airtable";
import Link from "next/link";

export default async function CategoryLandingPage() {
  const categories = await getCategories();

  return (
    <main className="container">
      <section className="hero">
        <h1>Kategorier</h1>
        <p className="subtitle">
          Utforsk fagområder og finn lokale håndverkere i Follo.
        </p>
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
                {category.name}
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
