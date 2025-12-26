"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-T02QR9E3T9";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.gtag) return;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  return (
    <>
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
