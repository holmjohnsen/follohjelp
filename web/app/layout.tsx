import Analytics from "@/components/Analytics";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { BASE_URL, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Finn lokale håndverkere i Follo | Follohjelp",
  description:
    "Finn lokale rørleggere, elektrikere og snekkere i Follo. Oversikt over håndverkere i Drøbak, Ås, Ski, Vestby og Nesodden – ta kontakt direkte.",
  // NB: canonical settes per side – en canonical her ville blitt arvet av
  // alle undersider som mangler egen.
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="antialiased">
        <SiteHeader />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
