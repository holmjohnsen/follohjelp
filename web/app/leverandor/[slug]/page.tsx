import { getLocationNameById, getProviderBySlug } from "@/lib/airtable";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function buildDescription({
  name,
  category,
  location,
  description,
}: {
  name: string;
  category?: string[];
  location?: string;
  description?: string;
}) {
  const trimmed = description?.trim();
  if (trimmed) {
    return trimmed.length > 160 ? `${trimmed.slice(0, 157)}...` : trimmed;
  }

  const categoryText = category?.[0] ?? "håndverker";
  const locationText = location?.trim() || "Follo";
  const fallback = `${name} er en lokal ${categoryText} i ${locationText}.`;
  return fallback.length > 160 ? `${fallback.slice(0, 157)}...` : fallback;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return {
      title: "Leverandør ikke funnet | Follohjelp",
      description: "Bedriften finnes ikke i Follohjelp.",
    };
  }

  const categoryText = provider.category?.[0] ?? "Håndverker";
  const locationName = provider.location
    ? await getLocationNameById(provider.location)
    : null;
  const locationText = locationName?.trim() || "Follo";
  const title = `${provider.name} – ${categoryText} i ${locationText} | Follohjelp`;

  return {
    title,
    description: buildDescription({
      name: provider.name,
      category: provider.category,
      location: locationName ?? undefined,
      description: provider.description,
    }),
  };
}

export default async function ProviderPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return notFound();
  }

  const locationName = provider.location
    ? await getLocationNameById(provider.location)
    : null;

  return (
    <main className="container">
      <section className="hero">
        <h1>{provider.name}</h1>
        {provider.category && provider.category.length > 0 ? (
          <div className="fh-pillRow">
            {provider.category.map((category) => (
              <span className="badge" key={category}>
                {category}
              </span>
            ))}
          </div>
        ) : null}
        {locationName || provider.phone || provider.url ? (
          <div className="provider-meta">
            {locationName ? (
              <span className="provider-meta-item">{locationName}</span>
            ) : null}
            {provider.phone ? (
              <span className="provider-meta-item">
                <a href={`tel:${provider.phone}`}>{provider.phone}</a>
              </span>
            ) : null}
            {provider.url ? (
              <span className="provider-meta-item">
                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nettside
                </a>
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="fh-section">
        <div className="fh-card">
          {provider.description ? (
            <p className="fh-lead">{provider.description}</p>
          ) : null}
        </div>
      </section>

      <section className="fh-section">
        <p className="results-count">
          Denne bedriften er med i Follohjelp sin lokale oversikt over
          håndverkere i Follo. Follohjelp formidler ikke anbud og videreselger
          ikke henvendelser.
        </p>
      </section>
    </main>
  );
}
