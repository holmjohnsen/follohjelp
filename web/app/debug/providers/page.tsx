import { getProviders } from "@/lib/airtable";

export default async function DebugProvidersPage() {
  let providers: unknown;
  let error: string | null = null;

  try {
    providers = await getProviders({});
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Ukjent feil";
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Providers (Airtable)</h1>
      <pre>{JSON.stringify(error ? { error } : { providers }, null, 2)}</pre>
    </main>
  );
}
