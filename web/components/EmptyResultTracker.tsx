"use client";

import { useEffect, useRef } from "react";
import { GA_EVENT_NAMES, track } from "@/lib/ga";

type Props = {
  context: "search" | "category";
  searchTerm?: string;
  category?: string;
};

export default function EmptyResultTracker({
  context,
  searchTerm,
  category,
}: Props) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    track(GA_EVENT_NAMES.emptyResult, {
      context,
      ...(searchTerm ? { search_term: searchTerm } : {}),
      ...(category ? { category } : {}),
    });
    hasFired.current = true;
  }, [context, searchTerm, category]);

  return null;
}
