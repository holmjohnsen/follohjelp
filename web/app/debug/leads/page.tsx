export const dynamic = "force-dynamic";

import { getLeads } from "@/lib/airtable";

export default async function LeadsDebugPage() {
  let data: unknown;
  let error: string | null = null;

  try {
    data = { leads: await getLeads(20) };
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Ukjent feil";
  }

  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <h1 style={{ marginBottom: "12px" }}>Leads debug</h1>
      <pre
        style={{
          background: "#f5f5f5",
          border: "1px solid #e6e8eb",
          padding: "16px",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(error ? { error } : data, null, 2)}
      </pre>
    </main>
  );
}
