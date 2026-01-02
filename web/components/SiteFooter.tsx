export default function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            © 2026 Follohjelp.no – Lokale tjenester i Follo
          </div>
          <div className="footer-locations">
            Drøbak • Ås • Ski • Vestby • Nesodden |{" "}
            <a href="/personvern">Personvern</a> |{" "}
            <a href="/om-follohjelp">Om Follohjelp</a>
          </div>
          <div className="footer-locations">
            <a href="mailto:hei@follohjelp.no">hei@follohjelp.no</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
