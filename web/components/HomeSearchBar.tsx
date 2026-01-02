"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeText, slugify } from "@/lib/search";

type Category = {
  name: string;
  slug: string;
};

type Props = {
  initialQuery?: string;
  placeholder?: string;
};

export default function HomeSearchBar({ initialQuery = "", placeholder }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/meta/search-options");
        if (!response.ok) return;
        const data = (await response.json()) as { categories?: Category[] };
        setCategories(data.categories ?? []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    void loadCategories();
  }, []);

  const normalizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        normalizedName: normalizeText(category.name),
        slugValue: slugify(category.slug || category.name),
      })),
    [categories],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Skriv inn et søk.");
      return;
    }

    setError(null);
    const slugQuery = slugify(trimmed);
    const normalizedQuery = normalizeText(trimmed);

    const match = normalizedCategories.find(
      (category) =>
        category.slugValue === slugQuery ||
        category.normalizedName === normalizedQuery,
    );

    if (match) {
      router.push(`/category/${match.slug}`);
      return;
    }

    router.push(`/sok?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className="search-bar" style={{ marginTop: "16px" }} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder ?? "Søk etter rørlegger, snekker eller firmanavn"}
        aria-label="Søk etter håndverker eller fagfelt"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button className="search-btn" type="submit">
        Søk
      </button>
      {error ? <p className="lead-error">{error}</p> : null}
    </form>
  );
}
