import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Follohjelp.no - Finn lokale tjenester i Follo",
  description:
    "Marketplace for håndverkere og tjenester i Follo-regionen. Finn fagfolk eller send inn en forespørsel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <header>
          <div className="container nav">
            <Link href="/" className="logo">
              Follohjelp.no
            </Link>
            <nav>
              <ul>
                <li>
                  <Link href="/">Hjem</Link>
                </li>
                <li>
                  <Link href="/request">Be om tilbud</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <p>Follohjelp.no – finn lokale tjenester i Follo-regionen.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
