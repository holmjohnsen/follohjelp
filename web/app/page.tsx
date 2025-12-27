import CookieBanner from "@/components/CookieBanner";

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
          <p className="results-count">
            Dekker Drøbak, Ås, Ski, Vestby, Nesodden og omegn.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Søk etter håndverker eller fagfelt"
              aria-label="Søk etter håndverker eller fagfelt"
            />
            <button className="search-btn" type="button">
              Søk
            </button>
          </div>

          <p className="results-count">
            🛠️ Follohjelp er i oppstart og bygges steg for steg. Tips oss gjerne
            om en håndverker du mener bør være med.
          </p>
        </section>

        <section className="categories">
          <h2>Kategorier</h2>
          <div className="category-grid">
            <a className="category-pill" href="/kategorier/rorlegger">
              Rørlegger
            </a>
            <a className="category-pill" href="/kategorier/elektriker">
              Elektriker
            </a>
            <a className="category-pill" href="/kategorier/snekker">
              Snekker
            </a>
            <a className="category-pill" href="/kategorier/murer">
              Murer
            </a>
          </div>
        </section>

        <p className="results-count">
          Er du håndverker i Follo? Les mer på{" "}
          <a href="/for-bedrifter">For bedrifter</a>.
        </p>

        <section className="lead-section">
          <div className="lead-card">
            <div className="lead-header">
              <h2>Er du håndverker i Follo?</h2>
              <p>
                Vi tar inn et begrenset antall oppføringer i tidlig fase. Bli
                synlig for folk i nærområdet som faktisk leter etter hjelp.
              </p>
            </div>
            <div className="lead-actions">
              <a
                className="search-btn"
                href="/for-bedrifter"
              >
                Legg til bedrift
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
