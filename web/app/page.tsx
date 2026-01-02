import CookieBanner from "@/components/CookieBanner";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeCategories from "@/components/HomeCategories";

export default function Home() {
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

        <HomeSearchBar />

        <p className="results-count">
          🛠️ Follohjelp er i oppstart og bygges steg for steg. Tips oss gjerne
          om en håndverker du mener bør være med.
        </p>
      </section>

        <section className="categories">
          <h2>Populære fagområder</h2>
          <HomeCategories />
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
            <div className="lead-actions" style={{ marginTop: "12px" }}>
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
    </>
  );
}
