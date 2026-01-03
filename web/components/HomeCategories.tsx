"use client";

import { useEffect, useMemo, useState } from "react";
import CategoryPills from "@/components/CategoryPills";

type Category = {
  name: string;
  slug: string;
  id?: string;
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
        return category;
      }),
    [categories],
  );

  if (decorated.length === 0) {
    return null;
  }

  return (
    <CategoryPills
      items={decorated}
      source="home"
      limit={decorated.length || 12}
    />
  );
}
