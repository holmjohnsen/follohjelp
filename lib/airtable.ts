const API_URL = "https://api.airtable.com/v0";

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function escapeValue(value: string) {
  return value.replace(/'/g, "\\'");
}

type AirtableRecord<T> = {
  id: string;
  fields: T;
};

type LeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  category?: string;
  location?: string;
  details?: string;
};

export type Provider = {
  id: string;
  name: string;
  category?: string;
  location?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
};

async function airtableRequest<T>(
  table: string,
  options: RequestInit & { searchParams?: URLSearchParams } = {},
) {
  const base = getEnv("AIRTABLE_BASE_ID");
  const apiKey = getEnv("AIRTABLE_API_KEY");
  const url = new URL(`${API_URL}/${base}/${table}`);

  if (options.searchParams) {
    options.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable request failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as T;
}

export async function createLead(payload: LeadPayload) {
  const table = getEnv("AIRTABLE_LEADS_TABLE");
  const fields = {
    Name: payload.name,
    Email: payload.email,
    Phone: payload.phone,
    Category: payload.category,
    Location: payload.location,
    Details: payload.details,
    Source: "Follohjelp.no",
  };

  const body = JSON.stringify({
    records: [{ fields }],
  });

  const data = await airtableRequest<{ records: AirtableRecord<typeof fields>[] }>(
    table,
    {
      method: "POST",
      body,
    },
  );

  return data.records[0];
}

export async function fetchProviders({
  category,
  location,
}: {
  category?: string;
  location?: string;
}) {
  const table = getEnv("AIRTABLE_PROVIDERS_TABLE");
  const filters = ["{Status}='Active'"];

  if (category) {
    filters.push(`SEARCH('${escapeValue(category.toLowerCase())}', LOWER({Category}))`);
  }

  if (location) {
    filters.push(`SEARCH('${escapeValue(location.toLowerCase())}', LOWER({Location}))`);
  }

  const filterByFormula = filters.length > 1 ? `AND(${filters.join(",")})` : filters[0];

  const params = new URLSearchParams({
    filterByFormula,
    maxRecords: "50",
  });

  const data = await airtableRequest<{
    records: AirtableRecord<{
      Name?: string;
      Category?: string;
      Location?: string;
      Description?: string;
      Phone?: string;
      Email?: string;
      Website?: string;
    }>[],
  }>(table, { searchParams: params, cache: "no-store" });

  return data.records.map((record) => ({
    id: record.id,
    name: record.fields.Name ?? "Ukjent leverandør",
    category: record.fields.Category,
    location: record.fields.Location,
    description: record.fields.Description,
    phone: record.fields.Phone,
    email: record.fields.Email,
    website: record.fields.Website,
  } satisfies Provider));
}
