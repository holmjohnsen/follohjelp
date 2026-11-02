import ProviderSignupForm from "@/components/ProviderSignupForm";
import { faqItems } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For håndverkere i Follo – bli synlig lokalt | Follohjelp",
  description:
    "En lokal oversikt for håndverkere i Follo. Ingen budrunder eller betaling per henvendelse. Registrer bedriften i oppstartsfasen.",
  alternates: {
    canonical: "/for-bedrifter",
  },
};

const heroIntro =
  "Follohjelp er en lokal oversikt over håndverkere i Follo.\nNår folk trenger hjelp, finner de deg – og tar kontakt direkte.";

const whatList = [
  "🏡 En lokal oversikt – laget for folk i Follo",
  "🤝 Ingen anbud, annonser eller budrunder",
  "📞 Direkte kontakt mellom deg og kunden",
  "👀 Personlig gjennomgang før publisering",
];

const howSteps = [
  "📝 Fortell litt om bedriften din i skjemaet under.",
  "🔍 Vi går raskt gjennom og tar kontakt hvis noe er uklart.",
  "📍 Når alt er klart, kan lokale kunder ta kontakt direkte.",
];

const fitList = [
  "Du holder til i Follo og tar oppdrag her.",
  "Du leverer kvalitet og kan ta imot nye oppdrag.",
  "Du ønsker synlighet uten å love noe du ikke kan levere.",
];

export default function ForBedrifterPage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Gjør det lettere for folk i Follo å finne deg</h1>
        <p className="subtitle">{heroIntro}</p>
        <a className="fh-btn fh-btnPrimary" href="#signup">
          👉 Legg inn bedriften din
        </a>
        <p className="fh-note">
          Tar bare et par minutter. Vi ser gjennom alt før noe publiseres.
        </p>
        <p className="results-count">
          🛠️ Vi er i oppstart og tar inn et begrenset antall bedrifter i første
          runde.
        </p>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Slik fungerer det</h2>
          <ol>
            {howSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

        </div>
      </section>

      <section id="signup" className="fh-section">
        <h2>Legg inn bedriften</h2>
        <p className="fh-lead">
          Skjemaet under går rett til oss. Vi kontakter deg før oppføringen
          publiseres.
        </p>
        <ProviderSignupForm />
        <p className="fh-note">
          Vi deler ikke informasjonen din videre og tar kontakt før noe
          publiseres.
        </p>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Hvorfor koster det ingenting å legge seg inn nå?</h2>
          <p className="fh-lead">
            Follohjelp er nylig lansert, og vi starter i det små. Først og
            fremst ønsker vi å bygge en nyttig, lokal oversikt for folk i Follo.
          </p>
          <p className="fh-note">
            Du kan når som helst be oss endre eller fjerne oppføringen din.
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Hvem passer det for?</h2>
          <ul>
            {fitList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Pris i oppstarten (pilot)</h2>
          <p>
            Vi tester konseptet med et begrenset antall bedrifter. Det er
            uforpliktende å registrere seg, og vi avtaler eventuelle kostnader
            før noe publiseres.
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Hva Follohjelp er (og ikke er)</h2>
          <ul>
            {whatList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Ofte stilte spørsmål</h2>
          <div className="fh-pillRow">
            {faqItems.map((item) => (
              <div key={item.question} className="fh-tile">
                <div className="fh-tileTitle">{item.question}</div>
                <div className="fh-tileMeta">
                  {item.question === "Hvem står bak Follohjelp?" ? (
                    <>
                      {item.answer} Les mer på{" "}
                      <a href="/om-follohjelp">Om Follohjelp</a>.
                    </>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
