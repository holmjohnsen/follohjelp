export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/airtable";
import HomeSearchBar from "@/components/HomeSearchBar";
import CategoryPills from "@/components/CategoryPills";
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

  return (
    <>
      <main className="container">
        <section className="hero">
          <h1>Kategorier</h1>
          <p className="subtitle">
            Utforsk fagområder og finn lokale håndverkere i Follo.
          </p>
        </section>

        <section className="fh-section">
          <HomeSearchBar source="category" />
        </section>

        <section className="fh-section">
          <div className="fh-card">
            <CategoryPills
              items={categories}
              source="category_landing"
              limit={categories.length || 12}
            />
            {categories.length === 0 ? (
              <p className="fh-lead">Ingen kategorier tilgjengelig ennå.</p>
            ) : null}
          </div>
        </section>
      </main>
      <div className="container microcopy">
        <p>
          Follohjelp er en lokal oversikt over håndverksbedrifter i Follo. Vi
          formidler ikke anbud og videreselger ikke henvendelser – kun en ryddig
          liste over lokale aktører du kan ta direkte kontakt med.
        </p>
      </div>
    </>
  );
}
