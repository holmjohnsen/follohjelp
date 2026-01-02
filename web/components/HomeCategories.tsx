"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatCategoryLabel } from "@/lib/categoryEmojiMap";

type Category = {
  name: string;
  slug: string;
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
        return {
          ...category,
          label: formatCategoryLabel(category.name),
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
        <Link
          key={category.slug}
          className="category-pill"
          href={`/category/${category.slug}`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
