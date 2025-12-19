import Link from "next/link";
import { categories } from "@/lib/categories";
import { fetchProviders, type Provider } from "@/lib/airtable";

async function loadFeaturedProviders(): Promise<Provider[]> {
  if (
    !process.env.AIRTABLE_API_KEY ||
    !process.env.AIRTABLE_BASE_ID ||
    !process.env.AIRTABLE_PROVIDERS_TABLE
  ) {
    return [];
  }

  try {
    const providers = await fetchProviders({});
    return providers.slice(0, 6);
  } catch (error) {
    console.error("Could not fetch providers", error);
    return [];
  }
}

export default async function HomePage() {
  const featured = await loadFeaturedProviders();

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="tag">Follo-regionen</div>
          <h1>Finn lokale tjenester – raskt og trygt</h1>
          <p>
            Follohjelp.no kobler deg med håndverkere og tjenesteleverandører i
            Drøbak, Ås, Ski, Vestby, Nesodden og Nordre Follo.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link className="btn" href="/request">
              Be om tilbud
            </Link>
            <Link className="btn" href="/category/handyman" style={{ background: "var(--surface)", color: "var(--text)" }}>
              Utforsk kategorier
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Populære kategorier</h2>
          <div className="grid grid-2">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.slug} className="card">
                <h3>{category.name}</h3>
                <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <h2>Utvalgte leverandører</h2>
          {featured.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>
              Leverandørene lastes inn når Airtable-nøklene er konfigurert.
            </p>
          ) : (
            <div className="grid grid-2">
              {featured.map((provider) => (
                <div key={provider.id} className="card">
                  <div className="tag">{provider.category ?? "Tjeneste"}</div>
                  <h3 style={{ margin: "0.5rem 0" }}>{provider.name}</h3>
                  <p style={{ color: "var(--muted)", margin: "0.25rem 0" }}>
                    {provider.location ?? "Follo"}
                  </p>
                  {provider.description ? (
                    <p style={{ marginTop: "0.5rem" }}>{provider.description}</p>
                  ) : null}
                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {provider.phone && (
                      <a className="btn" href={`tel:${provider.phone}`}>
                        Ring
                      </a>
                    )}
                    <Link className="btn" href="/request">
                      Be om tilbud
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container card">
          <h2>Hvordan fungerer det?</h2>
          <div className="grid grid-2" style={{ marginTop: "1rem" }}>
            <div>
              <h3>1. Velg kategori</h3>
              <p>Finn riktig tjeneste eller gå rett til tilbudsskjemaet.</p>
            </div>
            <div>
              <h3>2. Vi kobler deg med leverandører</h3>
              <p>Forespørselen sendes til aktuelle aktører i ditt område.</p>
            </div>
            <div>
              <h3>3. Få raske svar</h3>
              <p>Leverandørene kontakter deg direkte med forslag og priser.</p>
            </div>
            <div>
              <h3>4. Velg den som passer best</h3>
              <p>Du velger leverandør etter pris, tilgjengelighet og erfaring.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
