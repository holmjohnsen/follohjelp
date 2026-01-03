"use client";

export const GA_EVENT_NAMES = {
  pageView: "page_view",
  searchUsed: "search_used",
  categoryClick: "category_click",
  providerImpression: "provider_impression",
  providerContactClick: "provider_contact_click",
  emptyResult: "empty_result",
};

export function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag("event", eventName, params ?? {});
}
