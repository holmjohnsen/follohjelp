import type { Provider } from "@/lib/airtable";
import { TrackedContactLink } from "@/components/ProviderCardTrack";

type ProviderCardProps = {
  provider: Provider;
  categoryNames?: string[];
  locationName?: string;
  categorySlug?: string;
};

function normalizeWebsiteUrl(url: string | undefined) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function ProviderCard({
  provider,
  categoryNames,
  locationName,
  categorySlug,
}: ProviderCardProps) {
  const categories = categoryNames ?? provider.category ?? [];
  const displayLocation = locationName ?? provider.location;
  const websiteUrl = normalizeWebsiteUrl(provider.url);

  return (
    <div className="supplier-card" id={`provider-${provider.id}`}>
      <div className="supplier-content">
        <div className="supplier-name">{provider.name}</div>
        <div className="supplier-category">
          {categories.length > 0 ? categories.join(", ") : ""}
        </div>
        <p className="supplier-description">
          {provider.description || "Ingen beskrivelse tilgjengelig."}
        </p>
        <div className="supplier-meta">
          {displayLocation &&
          !/^rec[A-Za-z0-9]{10,}$/.test(displayLocation) ? (
            <div className="supplier-contact">📍 {displayLocation}</div>
          ) : null}
          {provider.phone ? (
            <TrackedContactLink
              className="supplier-contact"
              href={`tel:${provider.phone}`}
              providerId={provider.id}
              contactType="phone"
              categorySlug={categorySlug}
            >
              📞 {provider.phone}
            </TrackedContactLink>
          ) : null}
          {websiteUrl ? (
            <a
              className="supplier-contact"
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 Nettside
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
