const introText =
  "Follohjelp er laget for å gjøre det enklere å finne lokale håndverkere i Follo – uten støy, falske anmeldelser eller “markedsplass-følelse”.";

const aboutPoints = [
  "En lokal oversikt over håndverkere og tjenester i Follo",
  "Folk tar kontakt direkte med bedriften",
  "Bygget steg for steg, med kvalitet foran kvantitet",
];

export default function OmFollohjelpPage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Om Follohjelp</h1>
        <p className="subtitle">{introText}</p>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Historien</h2>
          <p className="fh-lead">
            Jeg flyttet tilbake til Drøbak etter å ha bodd andre steder i nesten
            25 år. Selv om jeg vokste opp her, var det overraskende mye som
            hadde endret seg: nye bedrifter, nye folk og mye mer å velge mellom.
          </p>
          <p className="fh-lead">
            Da jeg og partneren min (med to små barn) skulle i gang med å pusse
            opp huset vårt – barndomshjemmet mitt – merket jeg hvor vanskelig det
            kunne være å vite hvor man skulle begynne. Vi trengte rørlegger,
            elektriker og snekker til små (og etter hvert større) oppgaver, og
            senere kanskje også maler.
          </p>
          <p className="fh-lead">
            Jeg savnet en enkel, lokal oversikt over håndverkere som faktisk
            jobber her i området – gjerne små og uavhengige, med sterk lokal
            tilknytning. Et sted der folk i Follo kan finne fagfolk uten å måtte
            lete overalt.
          </p>
          <p className="fh-lead">Det ble starten på Follohjelp.</p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Hva Follohjelp er</h2>
          <ul>
            {aboutPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Hvorfor kvalitetssjekk?</h2>
          <p className="fh-lead">
            Follohjelp er i tidlig fase, og derfor går vi gjennom oppføringene
            før publisering. Målet er å holde oversikten ryddig og relevant –
            både for innbyggere og håndverkere.
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Kontakt</h2>
          <p className="fh-lead">
            Har du innspill, tips om en håndverker, eller vil være med?
            <br />
            Ta kontakt på{" "}
            <a href="mailto:hei@follohjelp.no">hei@follohjelp.no</a> – eller
            registrer bedriften din på{" "}
            <a href="/for-bedrifter">For bedrifter</a>.
          </p>
          <div className="fh-pillRow">
            <a className="fh-btnPrimary fh-btn" href="/for-bedrifter">
              For bedrifter
            </a>
            <a className="fh-btn" href="/">
              Til forsiden
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
