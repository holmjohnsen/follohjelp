import Link from "next/link";
import { fetchProviders } from "@/lib/airtable";
import { getCategory } from "@/lib/categories";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { location?: string };
}) {
  const category = getCategory(params.slug);
  if (!category) {
    return (
      <div className="section">
        <div className="container">
          <h1>Fant ikke kategorien</h1>
          <Link href="/">Tilbake til forsiden</Link>
        </div>
      </div>
    );
  }

  const location = searchParams?.location;
  let providers = [] as Awaited<ReturnType<typeof fetchProviders>>;

  if (
    process.env.AIRTABLE_API_KEY &&
    process.env.AIRTABLE_BASE_ID &&
    process.env.AIRTABLE_PROVIDERS_TABLE
  ) {
    try {
      providers = await fetchProviders({ category: category.name, location });
    } catch (error) {
      console.error("Could not load providers", error);
    }
  }

  return (
    <div className="section">
      <div className="container">
        <div className="tag">{category.name}</div>
        <h1 style={{ marginTop: "0.5rem" }}>{category.description}</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          Filtrer på sted for å finne leverandører nær deg.
        </p>

        <form className="grid grid-2 card" style={{ gap: "1rem", alignItems: "end" }}>
          <div className="field">
            <label htmlFor="location">Sted</label>
            <input
              id="location"
              name="location"
              placeholder="Ski, Ås, Drøbak..."
              defaultValue={location ?? ""}
            />
          </div>
          <div>
            <button className="btn" type="submit" style={{ width: "100%" }}>
              Oppdater listen
            </button>
          </div>
        </form>

        <div className="section" style={{ paddingTop: "1.5rem" }}>
          {providers.length === 0 ? (
            <div className="card">
              <p style={{ color: "var(--muted)" }}>
                Ingen leverandører funnet ennå. Prøv et annet område eller send en
                forespørsel så kobler vi deg manuelt.
              </p>
              <Link className="btn" href="/request" style={{ marginTop: "1rem", display: "inline-flex" }}>
                Send forespørsel
              </Link>
            </div>
          ) : (
            <div className="grid grid-2">
              {providers.map((provider) => (
                <div key={provider.id} className="card">
                  <div className="tag">{provider.location ?? "Follo"}</div>
                  <h3 style={{ margin: "0.5rem 0" }}>{provider.name}</h3>
                  {provider.description ? (
                    <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
                      {provider.description}
                    </p>
                  ) : null}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                    {provider.phone && (
                      <a className="btn" href={`tel:${provider.phone}`}>
                        Ring
                      </a>
                    )}
                    {provider.email && (
                      <a className="btn" href={`mailto:${provider.email}`}>
                        E-post
                      </a>
                    )}
                    <Link className="btn" href="/request">
                      Del behov
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
