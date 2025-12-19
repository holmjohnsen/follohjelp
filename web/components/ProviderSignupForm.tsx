"use client";

import { useMemo, useState } from "react";

const categoryOptions = [
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

const locationOptions = [
  "Drøbak",
  "Ås",
  "Ski",
  "Vestby",
  "Nesodden",
  "Nordre Follo",
  "Annet",
];

type FormState = {
  name: string;
  category: string;
  location: string;
  description: string;
  email: string;
  phone: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  category: "",
  location: "",
  description: "",
  email: "",
  phone: "",
  consent: false,
};

export default function ProviderSignupForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDisabled = status === "loading";

  const categoryList = useMemo(() => categoryOptions, []);
  const locationList = useMemo(() => locationOptions, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Navn er påkrevd";
    if (!form.category) newErrors.category = "Velg kategori";
    if (!form.location) newErrors.location = "Velg sted";
    if (!form.description) newErrors.description = "Beskrivelse er påkrevd";
    if (!form.email) newErrors.email = "E-post er påkrevd";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Ugyldig e-post";
    }
    if (!form.consent) newErrors.consent = "Du må samtykke";
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
        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="lead-grid">
            <div className="lead-field">
              <label htmlFor="name">Bedriftsnavn *</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isDisabled}
                required
              />
              {errors.name ? (
                <span className="lead-error">{errors.name}</span>
              ) : null}
            </div>
            <div className="lead-field">
              <label htmlFor="category">Kategori *</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                disabled={isDisabled}
                required
              >
                <option value="">Velg kategori</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <span className="lead-error">{errors.category}</span>
              ) : null}
            </div>
          </div>

          <div className="lead-grid">
            <div className="lead-field">
              <label htmlFor="location">Sted *</label>
              <select
                id="location"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                disabled={isDisabled}
                required
              >
                <option value="">Velg sted</option>
                {locationList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.location ? (
                <span className="lead-error">{errors.location}</span>
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
                required
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
                required
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
