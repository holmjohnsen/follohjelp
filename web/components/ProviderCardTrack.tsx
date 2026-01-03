"use client";

import { useEffect } from "react";
import { GA_EVENT_NAMES, track } from "@/lib/ga";
import type React from "react";

type ProviderCardTrackProps = {
  providerId: string;
  categorySlug?: string;
  locationSlugOrName?: string;
  pageType: "category" | "search";
  children: React.ReactNode;
};

export function ProviderCardTrack({
  providerId,
  categorySlug,
  locationSlugOrName,
  pageType,
  children,
}: ProviderCardTrackProps) {
  useEffect(() => {
    track(GA_EVENT_NAMES.providerImpression, {
      provider_id: providerId,
      category: categorySlug,
      location: locationSlugOrName,
      page_type: pageType,
    });
  }, [providerId, categorySlug, locationSlugOrName, pageType]);

  return <>{children}</>;
}

type ContactType = "phone" | "email";

type TrackedContactLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  providerId: string;
  contactType: ContactType;
  categorySlug?: string;
};

export function TrackedContactLink({
  providerId,
  contactType,
  categorySlug,
  onClick,
  ...rest
}: TrackedContactLinkProps) {
  return (
    <a
      {...rest}
      onClick={(event) => {
        track(GA_EVENT_NAMES.providerContactClick, {
          provider_id: providerId,
          contact_type: contactType,
          category: categorySlug,
        });
        onClick?.(event);
      }}
    />
  );
}
