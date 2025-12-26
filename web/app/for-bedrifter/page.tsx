import ProviderSignupForm from "@/components/ProviderSignupForm";

const heroIntro =
  "Follohjelp er en lokal oversikt over håndverkere i Follo. Vi samler fagfolk med lokal tilknytning slik at folk i området finner deg når noe skal fikses, bygges eller pusses opp.";

const whatList = [
  "En lokal oversikt, ikke et annonsebibliotek. Vi vil være relevante for folk i Follo.",
  "Personlig oppfølging. Vi ringer deg før noe publiseres.",
  "Ingen falske anmeldelser eller støy – kun faktiske håndverkere fra regionen.",
];

const howSteps = [
  "Du sender inn bedriften din (nedenfor).",
  "Vi gjør en enkel kontroll og setter status til pending i Airtable.",
  "Når vi har alt vi trenger, publiseres bedriften og du får beskjed.",
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
        <h1>For håndverkere i Follo</h1>
        <p className="subtitle">{heroIntro}</p>
        <p className="results-count">
          🛠️ Vi er i oppstart og tar inn et begrenset antall bedrifter i første
          runde.
        </p>
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
          <h2>Slik fungerer det</h2>
          <ol>
            {howSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
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
        <h2>Legg inn bedriften</h2>
        <p className="fh-lead">
          Skjemaet under går rett til oss. Vi kontakter deg før oppføringen
          publiseres.
        </p>
        <ProviderSignupForm />
      </section>
    </main>
  );
}
