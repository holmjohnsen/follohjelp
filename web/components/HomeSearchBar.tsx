"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeText, slugify } from "@/lib/search";
import { GA_EVENT_NAMES, track } from "@/lib/ga";

type Category = {
  name: string;
  slug: string;
};

type Props = {
  initialQuery?: string;
  placeholder?: string;
  source?: "home" | "search" | "category";
};

export default function HomeSearchBar({
  initialQuery = "",
  placeholder,
  source = "home",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateIsMobile);
      return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }

    mediaQuery.addListener(updateIsMobile);
    return () => mediaQuery.removeListener(updateIsMobile);
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

    track(GA_EVENT_NAMES.searchUsed, {
      search_term: trimmed,
      source,
    });

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
        placeholder={
          placeholder ??
          (isMobile
            ? "Søk (navn, sted, fag)"
            : "Søk etter firmanavn, sted eller fagområde")
        }
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
