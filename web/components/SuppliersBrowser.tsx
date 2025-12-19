"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ServiceRequestForm from "./ServiceRequestForm";

type Supplier = {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  phone?: string;
  contact?: string;
  image?: string;
};

type Props = {
  initialCategory?: string;
};

const categoryEmojis: Record<string, string> = {
  Rørlegger: "🔧",
  Snekker: "🪚",
  Murer: "🧱",
  Elektriker: "⚡",
  Maler: "🎨",
  Tømrer: "🪵",
  Reparatør: "🔨",
  Hagearbeid: "🌱",
  Renhold: "🧹",
};

export default function SuppliersBrowser({ initialCategory }: Props) {
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ?? "Alle",
  );
  const [selectedLocation, setSelectedLocation] = useState("Alle");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (selectedCategory !== "Alle") {
          params.set("category", selectedCategory);
        }

        if (selectedLocation !== "Alle") {
          params.set("location", selectedLocation);
        }

        const queryString = params.toString();
        const response = await fetch(
          `/api/providers${queryString ? `?${queryString}` : ""}`,
        );

        if (!response.ok) {
          throw new Error("Kunne ikke hente leverandører");
        }

        const data = (await response.json()) as { providers?: Supplier[] };
        const suppliers = data.providers ?? [];
        setAllSuppliers(suppliers);
        setFilteredSuppliers(suppliers);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError("Feil ved lasting av tjenester.");
        setAllSuppliers([]);
        setFilteredSuppliers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [selectedCategory, selectedLocation]);

  useEffect(() => {
    if (!allSuppliers.length) {
      setFilteredSuppliers([]);
      return;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = allSuppliers.filter((supplier) => {
      const description = supplier.description || "";
      const matchesCategory =
        selectedCategory === "Alle" || supplier.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "Alle" || supplier.location === selectedLocation;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        supplier.name.toLowerCase().includes(normalizedSearch) ||
        description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesLocation && matchesSearch;
    });

    setFilteredSuppliers(filtered);
  }, [allSuppliers, searchTerm, selectedCategory, selectedLocation]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...(initialCategory ? [initialCategory] : []),
            ...allSuppliers.map((supplier) => supplier.category).filter(Boolean),
          ].filter(Boolean),
        ),
      ),
    [allSuppliers, initialCategory],
  );

  const locations = useMemo(
    () =>
      Array.from(
        new Set(allSuppliers.map((supplier) => supplier.location).filter(Boolean))
      ),
    [allSuppliers]
  );

  const resultsCountText = (() => {
    if (isLoading) return "Laster tjenester...";
    if (error) return error;
    const count = filteredSuppliers.length;
    return `${count} ${count === 1 ? "tjeneste" : "tjenester"} funnet`;
  })();

  return (
    <>
      <section className="hero">
        <h1>Finn lokale håndverkere i Follo</h1>
        <p className="subtitle">
          Fra Drøbak til Ski – finn pålitelige tjenestetilbydere i ditt
          nærområde. Gratis og enkelt.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Søk etter tjeneste eller firma..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button
            type="button"
            className="search-btn"
            onClick={() => undefined}
            aria-label="Søk"
          >
            Søk
          </button>
        </div>
      </section>

      <ServiceRequestForm defaultCategory={initialCategory} />

      <section className="categories">
        <h2>Populære kategorier</h2>
        <div className="category-grid">
          <button
            type="button"
            className={`category-pill ${
              selectedCategory === "Alle" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Alle")}
          >
            🔍 Alle
          </button>
          {categories.map((category) => {
            const emoji = categoryEmojis[category] ?? "📋";
            return (
              <button
                key={category}
                type="button"
                className={`category-pill ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {emoji} {category}
              </button>
            );
          })}
        </div>
      </section>

      <div className="filters">
        <span className="filter-label">Filtrer etter:</span>
        <select
          value={selectedLocation}
          onChange={(event) => setSelectedLocation(event.target.value)}
        >
          <option value="Alle">📍 Alle steder</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="results-header">
        <div className="results-count">{resultsCountText}</div>
      </div>

      <div className="suppliers-grid">
        {!isLoading &&
          !error &&
          filteredSuppliers.map((supplier) => (
            <article key={supplier.id || supplier.name} className="supplier-card">
              {supplier.image ? (
                <Image
                  src={supplier.image}
                  alt={supplier.name}
                  className="supplier-image"
                  width={800}
                  height={200}
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              ) : null}
              <div className="supplier-content">
                <span className="supplier-category">{supplier.category}</span>
                <h3 className="supplier-name">{supplier.name}</h3>
                <p className="supplier-description">{supplier.description}</p>
                <div className="supplier-meta">
                  <div className="supplier-location">
                    📍 <span>{supplier.location}</span>
                  </div>
                  {supplier.phone || supplier.contact ? (
                    <div className="supplier-contact">
                      {supplier.phone ?? supplier.contact}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
      </div>

      {!isLoading && !error && filteredSuppliers.length === 0 ? (
        <div className="empty-state">
          <h3>Ingen tjenester funnet</h3>
          <p>Prøv å justere søket eller filteret</p>
        </div>
      ) : null}
    </>
  );
}
