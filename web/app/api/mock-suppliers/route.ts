import { NextResponse } from "next/server";

type Supplier = {
  name: string;
  category: string;
  description: string;
  location: string;
  contact?: string;
  image?: string;
};

const suppliers: Supplier[] = [
  {
    name: "Follo Rørservice",
    category: "Rørlegger",
    description:
      "Service og installasjon av vannbåren varme, bad og kjøkken i hele Follo.",
    location: "Ski",
    contact: "post@follororservice.no • 64 88 12 90",
    image:
      "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Drøbak Snekkerservice",
    category: "Snekker",
    description:
      "Skreddersydde løsninger for terrasse, kjøkken og vindusbytte med lokal oppfølging.",
    location: "Drøbak",
    contact: "post@drobaksnekker.no • 901 22 345",
  },
  {
    name: "Ås Mur & Flis",
    category: "Murer",
    description:
      "Flislegging av bad, murpeis og naturstein med fokus på håndverk og kvalitet.",
    location: "Ås",
    contact: "kontakt@aasmur.no • 917 33 210",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vestby Elektro",
    category: "Elektriker",
    description:
      "Ladestasjoner, sikringsskap og smart-hjem installasjoner for privat og næring.",
    location: "Vestby",
    contact: "firmapost@vestbyelektro.no • 64 95 88 00",
  },
  {
    name: "Nesodden Malerteam",
    category: "Maler",
    description:
      "Innvendig og utvendig maling, sparkling og tapetsering med raske leveranser.",
    location: "Nesodden",
    contact: "post@nesoddenmalerteam.no",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tømrergruppen Nordre Follo",
    category: "Tømrer",
    description:
      "Rehabilitering av eneboliger, påbygg og takjobber med faste prosjektledere.",
    location: "Nordre Follo",
    contact: "prosjekt@tomrergruppen.no • 64 85 52 10",
  },
  {
    name: "Follo Reparatørservice",
    category: "Reparatør",
    description:
      "Hvitevare- og småapparatreparasjoner på stedet, med hurtig responstid.",
    location: "Ski",
    contact: "service@follofix.no • 900 77 445",
  },
  {
    name: "Hageglede Follo",
    category: "Hagearbeid",
    description:
      "Stell av hekk, plen og bed, samt sesongbasert rydding og bortkjøring.",
    location: "Ås",
    contact: "post@hagegledefollo.no",
  },
  {
    name: "Ski Renhold & Service",
    category: "Renhold",
    description:
      "Fast og flyttevask for private og kontorer med miljøvennlige produkter.",
    location: "Ski",
    contact: "booking@skirenhold.no • 64 87 20 50",
  },
  {
    name: "Drøbak Elektrikerpartner",
    category: "Elektriker",
    description:
      "Feilsøking, belysning og smarthus-løsninger tilpasset eldre boliger i kystklima.",
    location: "Drøbak",
    contact: "kontakt@elektrikerpartner.no",
  },
  {
    name: "Vestby Rør og Varme",
    category: "Rørlegger",
    description:
      "Varmeanlegg, vannlekkasjesikring og sanitærarbeid for nye og gamle bygg.",
    location: "Vestby",
  },
  {
    name: "Nordre Follo Murmester",
    category: "Murer",
    description:
      "Puss og mur av grunnmur, tegl og skorsteinsrehabilitering med godkjente fagfolk.",
    location: "Nordre Follo",
    contact: "post@nfmurmester.no",
  },
];

export async function GET() {
  return NextResponse.json({ suppliers });
}
