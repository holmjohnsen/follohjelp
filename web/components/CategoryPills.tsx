"use client";

import Link from "next/link";
import { formatCategoryLabel } from "@/lib/categoryEmojiMap";
import { track, GA_EVENT_NAMES } from "@/lib/ga";

type CategoryItem = {
  id?: string;
  name: string;
  slug: string;
};

type Props = {
  items: CategoryItem[];
  source: "home" | "category_page" | "category_landing";
  activeSlug?: string;
  limit?: number;
};

export default function CategoryPills({
  items,
  source,
  activeSlug,
  limit = 12,
}: Props) {
  const filtered = activeSlug
    ? items.filter((item) => item.slug !== activeSlug)
    : items;
  const limited =
    typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  return (
    <div className="category-grid">
      {limited.map((item) => (
        <Link
          key={item.id ?? item.slug}
          className="category-pill"
          href={`/category/${item.slug}`}
          onClick={() =>
            track(GA_EVENT_NAMES.categoryClick, {
              category: item.slug,
              source,
            })
          }
        >
          {formatCategoryLabel(item.name)}
        </Link>
      ))}
    </div>
  );
}
