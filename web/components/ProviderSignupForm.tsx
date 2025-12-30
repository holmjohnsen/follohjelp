"use client";

import { useEffect, useState } from "react";

type Option = { id: string; name: string };

type FormState = {
  name: string;
  categoryId: string;
  locationId: string;
  categoryOther: string;
  locationOther: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  categoryId: "",
  locationId: "",
  categoryOther: "",
  locationOther: "",
  description: "",
  email: "",
  phone: "",
  url: "",
  consent: false,
};

export default function ProviderSignupForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);

  const isDisabled = status === "loading";

  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch("/api/providers/options");
        const data = (await res.json()) as {
          categories?: Option[];
          locations?: Option[];
        };
        setCategories([...(data.categories ?? []), { id: "OTHER", name: "Annet" }]);
        setLocations([...(data.locations ?? []), { id: "OTHER", name: "Annet" }]);
      } catch (err) {
        console.error("Failed to load meta", err);
      }
    }
    void loadOptions();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = form.name.trim();
    if (!trimmedName) newErrors.name = "Skriv inn bedriftsnavn.";
    if (!form.categoryId) newErrors.categoryId = "Velg kategori.";
    if (form.categoryId === "OTHER" && !form.categoryOther.trim()) {
      newErrors.categoryOther = "Skriv inn kategori.";
    }
    if (!form.locationId) newErrors.locationId = "Velg sted.";
    if (form.locationId === "OTHER" && !form.locationOther.trim()) {
      newErrors.locationOther = "Skriv inn sted.";
    }
    if (!form.description) newErrors.description = "Beskrivelse er påkrevd";
    const hasEmail = form.email.trim().length > 0;
    const hasPhone = form.phone.trim().length > 0;
    if (!hasEmail && !hasPhone) {
      newErrors.contact = "Fyll inn enten telefon eller e-post.";
    }
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Skriv inn en gyldig e-postadresse.";
    }
    if (!form.consent) newErrors.consent = "Du må samtykke før du kan sende inn.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof FormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Kunne ikke sende skjema");
      }

      setStatus("success");
      setForm(initialState);
      setErrors({});
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Noe gikk galt, prøv igjen.",
      );
    } finally {
      setStatus((prev) => (prev === "loading" ? "idle" : prev));
    }
  };

  return (
    <section className="lead-section">
      <div className="lead-card">
        <div className="lead-header">
          <h2>List din bedrift</h2>
          <p>Send inn bedriften din for gratis synlighet i Follo.</p>
        </div>
        <form className="lead-form" onSubmit={handleSubmit} noValidate>
          <div className="lead-grid">
            <div className="lead-field">
              <label htmlFor="name">Bedriftsnavn *</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isDisabled}
              />
              {errors.name ? (
                <span className="lead-error">{errors.name}</span>
              ) : null}
            </div>
            <div className="lead-field">
              <label htmlFor="category">Kategori *</label>
              <select
                id="category"
                value={form.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                disabled={isDisabled}
              >
                <option value="">Velg kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? (
                <span className="lead-error">{errors.categoryId}</span>
              ) : null}
              {form.categoryId === "OTHER" ? (
                <div className="lead-field">
                  <label htmlFor="categoryOther">Annen kategori *</label>
                  <input
                    id="categoryOther"
                    type="text"
                    value={form.categoryOther}
                    onChange={(e) => handleChange("categoryOther", e.target.value)}
                    disabled={isDisabled}
                  />
                  {errors.categoryOther ? (
                    <span className="lead-error">{errors.categoryOther}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="lead-grid">
            <div className="lead-field">
              <label htmlFor="location">Sted *</label>
              <select
                id="location"
                value={form.locationId}
                onChange={(e) => handleChange("locationId", e.target.value)}
                disabled={isDisabled}
              >
                <option value="">Velg sted</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {errors.locationId ? (
                <span className="lead-error">{errors.locationId}</span>
              ) : null}
              {form.locationId === "OTHER" ? (
                <div className="lead-field">
                  <label htmlFor="locationOther">Annet sted *</label>
                  <input
                    id="locationOther"
                    type="text"
                    value={form.locationOther}
                    onChange={(e) => handleChange("locationOther", e.target.value)}
                    disabled={isDisabled}
                  />
                  {errors.locationOther ? (
                    <span className="lead-error">{errors.locationOther}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="lead-field">
              <label htmlFor="email">E-post *</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isDisabled}
              />
              {errors.email ? (
                <span className="lead-error">{errors.email}</span>
              ) : null}
            </div>
          </div>

          <div className="lead-field">
            <label htmlFor="phone">Telefon (valgfritt)</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={isDisabled}
            />
            {errors.contact ? (
              <span className="lead-error">{errors.contact}</span>
            ) : null}
          </div>

          <div className="lead-field">
            <label htmlFor="url">Nettside (valgfritt)</label>
            <input
              id="url"
              type="text"
              placeholder="https://firma.no"
              value={form.url}
              onChange={(e) => handleChange("url", e.target.value)}
              disabled={isDisabled}
            />
          </div>

          <div className="lead-field">
            <label htmlFor="description">Beskrivelse *</label>
            <textarea
              id="description"
              rows={4}
              placeholder="Fortell kort om tjenestene dine..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isDisabled}
              required
            />
            {errors.description ? (
              <span className="lead-error">{errors.description}</span>
            ) : null}
          </div>

          <div className="lead-consent">
            <label className="lead-checkbox">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => handleChange("consent", e.target.checked)}
                disabled={isDisabled}
              />
              <span>
                Jeg samtykker til at Follohjelp kan lagre opplysningene og kontakte meg ved behov.
              </span>
            </label>
            {errors.consent ? (
              <span className="lead-error">{errors.consent}</span>
            ) : null}
          </div>

          <div className="lead-actions">
            <button className="search-btn" type="submit" disabled={isDisabled}>
              {isDisabled ? "Sender..." : "Send inn"}
            </button>
            {status === "success" ? (
              <span className="lead-success">
                Takk! Vi har mottatt oppføringen din og godkjenner den manuelt.
              </span>
            ) : null}
            {status === "error" && errorMessage ? (
              <span className="lead-error">{errorMessage}</span>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
