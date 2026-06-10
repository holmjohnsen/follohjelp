import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvernerklæring – Follohjelp.no",
  description:
    "Les om hvordan Follohjelp behandler personopplysninger, hvilke informasjonskapsler vi bruker og dine rettigheter etter GDPR.",
};

export default function PersonvernPage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Personvernerklæring</h1>
        <p className="subtitle">
          Sist oppdatert: juni 2026
        </p>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Behandlingsansvarlig</h2>
          <p className="fh-lead">
            Behandlingsansvarlig for personopplysninger på Follohjelp.no er:
          </p>
          <p className="fh-lead">
            <strong>E12NNI AS</strong>
            <br />
            1444 Drøbak
            <br />
            E-post: <a href="mailto:hei@follohjelp.no">hei@follohjelp.no</a>
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Hvilke personopplysninger samler vi inn?</h2>

          <h3>Henvendelsesskjema (leads)</h3>
          <p className="fh-lead">
            Når du sender inn en forespørsel om håndverkertjenester, samler vi inn:
          </p>
          <ul>
            <li>Navn</li>
            <li>E-postadresse</li>
            <li>Telefonnummer (valgfritt)</li>
            <li>Beskrivelse av oppdraget</li>
            <li>Sted og kategori for tjenesten</li>
          </ul>
          <p className="fh-lead">
            Formålet er å formidle kontakt mellom deg og relevante lokale
            håndverkere. Rettslig grunnlag er ditt samtykke (GDPR artikkel 6 nr. 1 a).
          </p>

          <h3>Registrering som leverandør</h3>
          <p className="fh-lead">
            Bedrifter som registrerer seg på Follohjelp oppgir:
          </p>
          <ul>
            <li>Bedriftsnavn og beskrivelse</li>
            <li>E-postadresse og telefonnummer</li>
            <li>Nettstedadresse (valgfritt)</li>
            <li>Kategori og sted</li>
          </ul>
          <p className="fh-lead">
            Formålet er å vise bedriften i oversikten over lokale håndverkere.
            Rettslig grunnlag er berettiget interesse (GDPR artikkel 6 nr. 1 f) og
            avtale med bedriften (GDPR artikkel 6 nr. 1 b).
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Datalagring og databehandlere</h2>
          <p className="fh-lead">
            Personopplysninger fra skjemaene lagres i <strong>Airtable</strong>{" "}
            (Formagrid Inc., USA), som er vår databehandler. Airtable er underlagt
            databehandleravtale og overholder GDPR via Standard Contractual Clauses (SCC).
          </p>
          <p className="fh-lead">
            Vi lagrer ikke personopplysninger lenger enn nødvendig for formålet.
            Leads slettes når de ikke lenger er aktuelle. Leverandøroppføringer
            slettes på forespørsel.
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Informasjonskapsler (cookies) og statistikk</h2>
          <p className="fh-lead">
            Follohjelp bruker <strong>Google Analytics 4</strong> for å forstå
            hvordan siden brukes. Dette skjer kun dersom du har godtatt cookies.
          </p>
          <p className="fh-lead">
            Vi samler statistikk om:
          </p>
          <ul>
            <li>Sidevisninger og navigasjon</li>
            <li>Søk som gjøres på siden</li>
            <li>Klikk på kategorier og leverandørkort</li>
            <li>Kontaktklikk (telefon, e-post, nettsted) hos leverandører</li>
          </ul>
          <p className="fh-lead">
            Vi samler <strong>ikke</strong> inn navn, e-postadresse eller annen
            identifiserende informasjon via Google Analytics. IP-adresser anonymiseres.
            Google er databehandler og er underlagt databehandleravtale.
          </p>
          <p className="fh-lead">
            Ditt samtykkevalg lagres lokalt i nettleserens <code>localStorage</code>{" "}
            og sendes ikke til noen server.
          </p>
          <p className="fh-lead">
            Du kan når som helst trekke tilbake samtykket ved å slette
            nettleserdata for follohjelp.no. Siden vil da spørre på nytt.
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Dine rettigheter</h2>
          <p className="fh-lead">
            Under GDPR har du rett til å:
          </p>
          <ul>
            <li>
              <strong>Innsyn</strong> – få vite hvilke opplysninger vi har om deg
            </li>
            <li>
              <strong>Retting</strong> – be oss rette feilaktige opplysninger
            </li>
            <li>
              <strong>Sletting</strong> – be om at opplysninger om deg slettes
            </li>
            <li>
              <strong>Begrensning</strong> – be om at behandling av dine data begrenses
            </li>
            <li>
              <strong>Dataportabilitet</strong> – motta dine data i et strukturert format
            </li>
            <li>
              <strong>Innsigelse</strong> – protestere mot behandling basert på berettiget interesse
            </li>
          </ul>
          <p className="fh-lead">
            For å bruke disse rettighetene, ta kontakt på{" "}
            <a href="mailto:hei@follohjelp.no">hei@follohjelp.no</a>. Vi svarer
            innen 30 dager.
          </p>
          <p className="fh-lead">
            Du kan også klage til{" "}
            <a
              href="https://www.datatilsynet.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datatilsynet
            </a>{" "}
            dersom du mener vi behandler personopplysninger i strid med
            personvernregelverket.
          </p>
        </div>
      </section>

      <section className="fh-section">
        <div className="fh-card">
          <h2>Endringer i denne erklæringen</h2>
          <p className="fh-lead">
            Vi kan oppdatere denne personvernerklæringen ved behov. Dato for siste
            oppdatering fremgår øverst på siden.
          </p>
          <div className="fh-pillRow">
            <a className="fh-btn" href="/">
              Til forsiden
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
