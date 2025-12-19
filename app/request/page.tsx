"use client";

import { useState } from "react";
import { categories } from "@/lib/categories";

export default function RequestPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          category: payload.category,
          location: payload.location,
          details: payload.details,
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke sende forespørselen");
      }

      setStatus("success");
      setMessage("Takk! Vi kobler deg med relevante leverandører.");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Noe gikk galt. Prøv igjen om litt.");
    }
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: "720px" }}>
        <h1>Be om tilbud</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          Fortell oss hva du trenger hjelp med, så sender vi forespørselen til
          godkjente leverandører i Follo.
        </p>

        <form className="grid" style={{ gap: "1rem" }} onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Navn *</label>
            <input required id="name" name="name" placeholder="Ditt navn" />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="email">E-post</label>
              <input id="email" name="email" type="email" placeholder="din@epost.no" />
            </div>
            <div className="field">
              <label htmlFor="phone">Telefon</label>
              <input id="phone" name="phone" placeholder="+47 400 00 000" />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="category">Kategori</label>
              <select id="category" name="category" defaultValue="">
                <option value="" disabled>
                  Velg kategori
                </option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Sted</label>
              <input id="location" name="location" placeholder="Ski, Drøbak, Ås..." />
            </div>
          </div>

          <div className="field">
            <label htmlFor="details">Beskriv hva du trenger</label>
            <textarea
              id="details"
              name="details"
              placeholder="Kort beskrivelse av jobben og ønsket tidspunkt"
            />
          </div>

          <button className="btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sender..." : "Send forespørsel"}
          </button>

          {message && (
            <p style={{ color: status === "success" ? "var(--brand)" : "#b91c1c" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
