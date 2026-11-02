import {
  getCategories,
  getLocationNameById,
  getProviderBySlug,
} from "@/lib/airtable";
import {
  AREA_SERVED,
  BASE_URL,
  schemaTypeForCategory,
  truncateAtWord,
} from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
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
  const categoryText = (category?.[0] ?? "håndverker").toLowerCase();
  const locationText = location?.trim() || "Follo";
  const context = `${category?.[0] ?? "Håndverker"} i ${locationText} – se kontaktinfo på Follohjelp.`;
  const trimmed = description?.trim();

  if (!trimmed) {
    return truncateAtWord(
      `${name} er en lokal ${categoryText} i ${locationText}. Se telefon, e-post og nettside, og ta kontakt direkte.`,
    );
  }

  // Korte beskrivelser utvides med fagområde og sted, så de treffer bedre
  // på lokale søk og nærmer seg anbefalt lengde (~120–155 tegn).
  if (trimmed.length < 110) {
    const joined = `${trimmed.replace(/[.\s]+$/, "")}. ${context}`;
    if (joined.length <= 155) return joined;
  }

  return truncateAtWord(trimmed);
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
    alternates: {
      canonical: `/leverandor/${provider.slug ?? slug}`,
    },
  };
}

export default async function ProviderPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return notFound();
  }

  const [locationName, categories] = await Promise.all([
    provider.location ? getLocationNameById(provider.location) : null,
    getCategories(),
  ]);
  const primaryCategory = provider.category?.[0]
    ? categories.find((cat) => cat.name === provider.category?.[0])
    : undefined;
  const pageUrl = `${BASE_URL}/leverandor/${provider.slug ?? slug}`;
  const websiteUrl = provider.url
    ? /^https?:\/\//i.test(provider.url)
      ? provider.url
      : `https://${provider.url}`
    : null;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": schemaTypeForCategory(provider.category?.[0]),
        "@id": `${pageUrl}#business`,
        name: provider.name,
        ...(provider.description ? { description: provider.description } : {}),
        ...(provider.phone ? { telephone: provider.phone } : {}),
        ...(provider.email ? { email: provider.email } : {}),
        url: pageUrl,
        ...(websiteUrl ? { sameAs: [websiteUrl] } : {}),
        areaServed: AREA_SERVED,
        address: {
          "@type": "PostalAddress",
          ...(locationName ? { addressLocality: locationName } : {}),
          addressRegion: "Akershus",
          addressCountry: "NO",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Follohjelp",
            item: `${BASE_URL}/`,
          },
          ...(primaryCategory
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: primaryCategory.name,
                  item: `${BASE_URL}/category/${primaryCategory.slug}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: primaryCategory ? 3 : 2,
            name: provider.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };
  const emailSubject = encodeURIComponent(
    "Forespørsel sendt via follohjelp.no",
  );
  const websiteLabel = provider.url
    ? provider.url.replace(/^https?:\/\//i, "")
    : null;

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav className="results-count" aria-label="Brødsmulesti">
        <Link href="/">Follohjelp</Link>
        {primaryCategory ? (
          <>
            {" › "}
            <Link href={`/category/${primaryCategory.slug}`}>
              {primaryCategory.name} i Follo
            </Link>
          </>
        ) : null}
        {" › "}
        <span aria-current="page">{provider.name}</span>
      </nav>
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
        {locationName || provider.phone || provider.url || provider.email ? (
          <div className="provider-contact">
            {locationName ? (
              <div className="provider-contactItem">
                <span aria-hidden="true">📍</span>
                <span>Sted:</span>
                <span>{locationName}</span>
              </div>
            ) : null}
            {provider.phone ? (
              <div className="provider-contactItem">
                <span aria-hidden="true">📞</span>
                <span>Telefon:</span>
                <a href={`tel:${provider.phone}`}>{provider.phone}</a>
              </div>
            ) : null}
            {provider.url ? (
              <div className="provider-contactItem">
                <span aria-hidden="true">🌐</span>
                <span>Nettside:</span>
                <a
                  href={websiteUrl ?? provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="provider-contactLink"
                >
                  {websiteLabel}
                </a>
              </div>
            ) : null}
            {provider.email ? (
              <div className="provider-contactItem">
                <span aria-hidden="true">✉️</span>
                <span>E-post:</span>
                <a href={`mailto:${provider.email}?subject=${emailSubject}`}>
                  {provider.email}
                </a>
              </div>
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
