import Analytics from "@/components/Analytics";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Follohjelp.no - Finn lokale håndverkere i Follo",
  description:
    "Finn lokale håndverkere og tjenester i Follo-regionen. Drøbak, Ås, Ski, Vestby, Nesodden og Nordre Follo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className="antialiased">
        <SiteHeader />
        <Analytics />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
