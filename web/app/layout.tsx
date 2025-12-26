import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        <Analytics />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
