import CookieBanner from "@/components/CookieBanner";
import SuppliersBrowser from "@/components/SuppliersBrowser";

const categories = [
  "Rørlegger",
  "Snekker",
  "Murer",
  "Elektriker",
  "Maler",
  "Tømrer",
  "Reparatør",
  "Hagearbeid",
  "Renhold",
];

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function resolveCategory(slug: string) {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");
  const match = categories.find(
    (cat) => normalizeValue(cat) === normalizeValue(decoded),
  );
  return match ?? decoded;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const initialCategory = resolveCategory(category);

  return (
    <>
      <CookieBanner />

      <header>
        <div className="container">
          <nav className="nav">
            <div className="logo">🏡 Follohjelp</div>
            <a className="badge" href="/for-bedrifter">
              List din bedrift
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        <SuppliersBrowser initialCategory={initialCategory} />
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
