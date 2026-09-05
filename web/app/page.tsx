import CookieBanner from "@/components/CookieBanner";
import HomeSearchBar from "@/components/HomeSearchBar";
import CategoryPills from "@/components/CategoryPills";
import { getCategories } from "@/lib/airtable";

// Cache the rendered homepage (incl. the Airtable category fetch) for 5
// minutes instead of re-hitting Airtable on every single request. Without
// this, moving the category fetch server-side (see below) forced Airtable's
// round-trip onto the critical path of every page load, which is what
// caused the mobile regression (TTFB/FCP delayed, pushing GTM's script
// execution into the FCP→TTI window and inflating Total Blocking Time).
export const revalidate = 300;

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <CookieBanner />

      <main className="container">
      <section className="hero">
        <h1>Finn lokale håndverkere i Follo</h1>
        <p className="subtitle">
          Follohjelp gjør det enklere å finne lokale håndverkere i Follo. Her
          samler vi rørleggere, elektrikere, snekkere og andre fagfolk med
          lokal tilknytning – slik at du slipper å lete overalt når noe skal
          fikses, bygges eller pusses opp.
        </p>
        <p className="subtitle">
          Follohjelp dekker Drøbak, Ås, Ski, Vestby, Nesodden og omegn.
        </p>

        <HomeSearchBar initialCategories={categories} />

        <p className="results-count">
          🛠️ Follohjelp er i oppstart og bygges steg for steg. Tips oss gjerne
          om en håndverker du mener bør være med.
        </p>
      </section>

        <section className="categories">
          <h2>Populære fagområder</h2>
          {categories.length > 0 ? (
            <CategoryPills
              items={categories}
              source="home"
              limit={categories.length || 12}
            />
          ) : null}
        </section>

        <section className="lead-section">
          <div className="lead-card">
            <div className="lead-header">
              <h2>Er du håndverker i Follo?</h2>
              <p>
                Vi tar inn et begrenset antall oppføringer i tidlig fase. Bli
                synlig for folk i nærområdet som faktisk leter etter hjelp.
              </p>
            </div>
            <div className="hero-cta">
              <a
                className="search-btn"
                href="/for-bedrifter"
              >
                Legg til din bedrift
              </a>
            </div>
          </div>
        </section>
      </main>
      <div className="microcopy">
        <div className="container">
          <p>
            Follohjelp er en lokal oversikt over håndverksbedrifter i Follo. Vi
            formidler ikke anbud og videreselger ikke henvendelser – kun en ryddig
            liste over lokale aktører du kan ta direkte kontakt med.
          </p>
        </div>
      </div>
    </>
  );
}
