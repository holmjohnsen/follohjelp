import CookieBanner from "@/components/CookieBanner";
import ProviderSignupForm from "@/components/ProviderSignupForm";

export default function ListDinBedriftPage() {
  return (
    <>
      <CookieBanner />

      <header>
        <div className="container">
          <nav className="nav">
            <div className="logo">🏡 Follohjelp</div>
            <a className="badge" href="/list-din-bedrift">
              List din bedrift
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>List din bedrift</h1>
          <p className="subtitle">
            Send inn bedriften din for gratis synlighet. Vi godkjenner
            oppføringer manuelt.
          </p>
        </section>

        <ProviderSignupForm />
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-text">
              © 2025 Follohjelp.no – Lokale tjenester i Follo
            </div>
            <div className="footer-locations">
              Drøbak • Ås • Ski • Vestby • Nesodden • Nordre Follo |{" "}
              <a href="/personvern">Personvern</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
