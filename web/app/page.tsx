import CookieBanner from "@/components/CookieBanner";
import SuppliersBrowser from "@/components/SuppliersBrowser";

export default function Home() {
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
        <SuppliersBrowser />
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
