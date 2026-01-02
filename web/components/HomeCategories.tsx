"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
  name: string;
  slug: string;
};

const emojiMap: Record<string, string> = {
  Rørlegger: "🔧",
  Elektriker: "⚡",
  Snekker: "🪚",
  Tømrer: "🪚",
  Murer: "🧱",
  Flislegger: "🧱",
  Maler: "🎨",
  Taktekker: "🏠",
  Rengjøring: "🧽",
};

export default function HomeCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/meta");
        if (!res.ok) return;
        const data = (await res.json()) as { categories?: Category[] };
        const list = data.categories ?? [];
        list.sort((a, b) => a.name.localeCompare(b.name, "nb"));
        setCategories(list);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    void load();
  }, []);

  const decorated = useMemo(
    () =>
      categories.map((category) => {
        const emoji = emojiMap[category.name] ?? "";
        return {
          ...category,
          label: emoji ? `${emoji} ${category.name}` : category.name,
        };
      }),
    [categories],
  );

  if (decorated.length === 0) {
    return null;
  }

  return (
    <div className="category-grid">
      {decorated.map((category) => (
        <a
          key={category.slug}
          className="category-pill"
          href={`/category/${category.slug}`}
        >
          {category.label}
        </a>
      ))}
    </div>
  );
}
