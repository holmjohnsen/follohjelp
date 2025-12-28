type ProviderFilters = {
  category?: string | null;
  location?: string | null;
};

export type Provider = {
  id: string;
  name: string;
  category?: string[];
  location: string;
  description: string;
  phone?: string;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PROVIDERS_TABLE = process.env.AIRTABLE_PROVIDERS_TABLE;
const AIRTABLE_LEADS_TABLE = process.env.AIRTABLE_LEADS_TABLE ?? "Leads";
const AIRTABLE_ASSIGNED_PROVIDERS_FIELD =
  process.env.AIRTABLE_ASSIGNED_PROVIDERS_FIELD ?? "assigned_providers";
const AIRTABLE_CATEGORIES_TABLE = process.env.AIRTABLE_CATEGORIES_TABLE;
const AIRTABLE_CATEGORIES_VIEW = process.env.AIRTABLE_CATEGORIES_VIEW;

function ensureEnv(key: string | undefined, name: string) {
  if (!key) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return key.trim();
}

function escapeFormulaValue(value: string) {
  return value.replace(/"/g, '\\"');
}

function buildFilterFormula(filters: ProviderFilters) {
  const clauses = [`{status}="active"`];
  // NB: category is a linked record; text filter here would return 0 rows. Category filtering is handled elsewhere.

  if (filters.location && filters.location !== "Alle") {
    clauses.push(`{location}="${escapeFormulaValue(filters.location)}"`);
  }

  if (clauses.length === 1) {
    return clauses[0];
  }

  return `AND(${clauses.join(",")})`;
}

type AirtableProvider = Provider & {
  email?: string;
};

type LeadInput = {
  category: string;
  description: string;
  location: string;
  name: string;
  email: string;
  phone?: string;
  assignedProviders?: string;
};

type ProviderInput = {
  name: string;
  category: string;
  location: string;
  description: string;
  email: string;
  phone?: string;
};

export type Lead = {
  id: string;
  category: string;
  description: string;
  location: string;
  name: string;
  email: string;
  phone?: string;
  assignedProviders?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

function slugifyCategory(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchProviders(filters: ProviderFilters, includeEmail = false) {
  const apiKey = ensureEnv(AIRTABLE_API_KEY, "AIRTABLE_API_KEY");
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "AIRTABLE_BASE_ID");
  const table = ensureEnv(
    AIRTABLE_PROVIDERS_TABLE ?? "Providers",
    "AIRTABLE_PROVIDERS_TABLE",
  );

  const providers: AirtableProvider[] = [];
  let offset: string | undefined;

  do {
    const searchParams = new URLSearchParams({
      pageSize: "100",
      filterByFormula: buildFilterFormula(filters),
    });

    if (offset) {
      searchParams.set("offset", offset);
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        table,
      )}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Airtable request failed: ${response.status} ${response.statusText} - ${text}`,
      );
    }

    const data: {
      records?: Array<{
        id: string;
        fields: Record<string, unknown>;
      }>;
      offset?: string;
    } = await response.json();

    (data.records ?? []).forEach((record) => {
      const fields = record.fields ?? {};
      const name = String(fields["name"] ?? "").trim();
const categoryField = fields["category"];
const categoryList = Array.isArray(categoryField)
  ? categoryField.map((c) => String(c).trim()).filter(Boolean)
  : [];
const location = String(fields["location"] ?? "").trim();
const description = String(fields["description"] ?? "").trim();
const status = String(fields["status"] ?? "").trim();

if (status !== "active" || !name) return;

providers.push({
  id: record.id,
  name,
  category: categoryList,
  location,
  description,
  phone: fields["phone"] ? String(fields["phone"]).trim() : undefined,
  email: includeEmail && fields["email"] ? String(fields["email"]).trim() : undefined,
});
    });

    offset = data.offset;
  } while (offset);

  return providers;
}

export async function getProviders(filters: ProviderFilters = {}) {
  const providers = await fetchProviders(filters, false);
  return providers.map((provider) => {
    const { email: _unusedEmail, ...rest } = provider;
    void _unusedEmail;
    return rest;
  });
}

export async function getProvidersWithEmail(filters: ProviderFilters = {}) {
  return fetchProviders(filters, true);
}

export async function getCategories() {
  const apiKey = ensureEnv(AIRTABLE_API_KEY, "AIRTABLE_API_KEY");
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "AIRTABLE_BASE_ID");
  const table = ensureEnv(
    AIRTABLE_CATEGORIES_TABLE ?? "Categories",
    "AIRTABLE_CATEGORIES_TABLE",
  );

  const categories: Category[] = [];
  let offset: string | undefined;

  do {
    const searchParams = new URLSearchParams({
      pageSize: "100",
    });

    if (AIRTABLE_CATEGORIES_VIEW) {
      searchParams.set("view", AIRTABLE_CATEGORIES_VIEW);
    }

    if (offset) {
      searchParams.set("offset", offset);
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        table,
      )}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText} - ${text}`,
      );
    }

    const data: {
      records?: Array<{
        id: string;
        fields: Record<string, unknown>;
      }>;
      offset?: string;
    } = await response.json();

    (data.records ?? []).forEach((record) => {
      const fields = record.fields ?? {};
      const name = String(fields["name"] ?? "").trim();
      if (!name) return;

      const activeField = fields["active"];
      const isActive =
        activeField === undefined ||
        activeField === null ||
        Boolean(activeField);
      if (!isActive) return;

      const slugField = String(fields["slug"] ?? "").trim();
      categories.push({
        id: record.id,
        name,
        slug: slugField || slugifyCategory(name),
      });
    });

    offset = data.offset;
  } while (offset);

  categories.sort((a, b) => a.name.localeCompare(b.name, "nb"));
  return categories;
}

export async function createLead(lead: LeadInput) {
  const apiKey = ensureEnv(AIRTABLE_API_KEY, "AIRTABLE_API_KEY");
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "AIRTABLE_BASE_ID");
  const table = ensureEnv(AIRTABLE_LEADS_TABLE, "AIRTABLE_LEADS_TABLE");
  const assignedField = AIRTABLE_ASSIGNED_PROVIDERS_FIELD.trim();

  const fields: Record<string, string> = {
    category: lead.category,
    description: lead.description,
    location: lead.location,
    name: lead.name,
    email: lead.email,
  };

  if (lead.phone) {
    fields.phone = lead.phone;
  }

  if (lead.assignedProviders) {
    fields[assignedField] = lead.assignedProviders;
  }

  const payload = { fields };

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to create lead: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return response.json() as Promise<unknown>;
}

export async function getLeads(limit = 20) {
  const apiKey = ensureEnv(AIRTABLE_API_KEY, "AIRTABLE_API_KEY");
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "AIRTABLE_BASE_ID");
  const table = ensureEnv(AIRTABLE_LEADS_TABLE, "AIRTABLE_LEADS_TABLE");
  const assignedField = AIRTABLE_ASSIGNED_PROVIDERS_FIELD.trim();

  const searchParams = new URLSearchParams({
    pageSize: String(limit),
    "sort[0][field]": "created_at",
    "sort[0][direction]": "desc",
  });

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      table,
    )}?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch leads: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  const data: {
    records?: Array<{ id: string; fields: Record<string, unknown> }>;
  } = await response.json();

  return (data.records ?? []).map((record) => {
    const fields = record.fields ?? {};
    return {
      id: record.id,
      category: String(fields["category"] ?? ""),
      description: String(fields["description"] ?? ""),
      location: String(fields["location"] ?? ""),
      name: String(fields["name"] ?? ""),
      email: String(fields["email"] ?? ""),
      phone: fields["phone"] ? String(fields["phone"]) : undefined,
      assignedProviders: fields[assignedField]
        ? String(fields[assignedField])
        : undefined,
    } satisfies Lead;
  });
}

async function fetchProvidersByFormula(
  filterByFormula: string,
  includeEmail = false,
) {
  const apiKey = ensureEnv(AIRTABLE_API_KEY, "AIRTABLE_API_KEY");
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "AIRTABLE_BASE_ID");
  const table = ensureEnv(
    AIRTABLE_PROVIDERS_TABLE ?? "Providers",
    "AIRTABLE_PROVIDERS_TABLE",
  );

  const providers: AirtableProvider[] = [];
  let offset: string | undefined;

  do {
    const searchParams = new URLSearchParams({
      pageSize: "100",
      filterByFormula,
    });

    if (offset) {
      searchParams.set("offset", offset);
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        table,
      )}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Airtable request failed: ${response.status} ${response.statusText} - ${text}`,
      );
    }

    const data: {
      records?: Array<{
        id: string;
        fields: Record<string, unknown>;
      }>;
      offset?: string;
    } = await response.json();

    (data.records ?? []).forEach((record) => {
      const fields = record.fields ?? {};
      const name = String(fields["name"] ?? "").trim();
      const categoryField = fields["category"];
      const categoryList = Array.isArray(categoryField)
        ? categoryField.map((c) => String(c).trim()).filter(Boolean)
        : [];
      const location = String(fields["location"] ?? "").trim();
      const description = String(fields["description"] ?? "").trim();
      const status = String(fields["status"] ?? "").trim();

      if (status !== "active" || !name) {
        return;
      }

      providers.push({
        id: record.id,
        name,
        category: categoryList,
        location,
        description,
        phone: fields["phone"] ? String(fields["phone"]).trim() : undefined,
        email: includeEmail && fields["email"] ? String(fields["email"]).trim() : undefined,
      });
    });

    offset = data.offset;
  } while (offset);

  return providers;
}

export async function getProvidersByCategorySlug(slug: string) {
  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) {
    return { category: null, providers: [] as Provider[] };
  }

  const categoryNameEscaped = escapeFormulaValue(category.name);
  const filterFormula = `AND({status}="active", FIND(",${categoryNameEscaped},", "," & ARRAYJOIN({category}, ",") & ",")>0)`;
  const providersByLinked: AirtableProvider[] = await fetchProvidersByFormula(
    filterFormula,
    false,
  );
  console.log(
    "[categories] filter",
    JSON.stringify({
      slug,
      categoryId: category.id,
      categoryName: category.name,
      formula: filterFormula,
      count: providersByLinked.length,
    }),
  );

  const idToName = new Map(categories.map((cat) => [cat.id, cat.name]));
  const providers = providersByLinked
    .map((provider) => {
      if (!provider.category || provider.category.length === 0) {
        return null;
      }
      const hasMatch = provider.category.some((catId) => catId === category.id);
      if (!hasMatch) return null;

      return {
        id: provider.id,
        name: provider.name,
        category: provider.category
          .map((id) => idToName.get(id))
          .filter(Boolean) as string[],
        location: provider.location,
        description: provider.description,
        phone: provider.phone,
      } satisfies Provider;
    })
    .filter(Boolean) as Provider[];

  return {
    category,
    providers,
  };
}

export async function createPendingProvider(provider: ProviderInput) {
  const apiKey = ensureEnv(AIRTABLE_API_KEY, "AIRTABLE_API_KEY");
  const baseId = ensureEnv(AIRTABLE_BASE_ID, "AIRTABLE_BASE_ID");
  const table = ensureEnv(
    AIRTABLE_PROVIDERS_TABLE ?? "Providers",
    "AIRTABLE_PROVIDERS_TABLE",
  );

  const payload = {
    fields: {
      name: provider.name,
      category: provider.category,
      location: provider.location,
      description: provider.description,
      email: provider.email,
      phone: provider.phone ?? "",
      status: "pending",
    },
  };

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to create provider: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return response.json() as Promise<unknown>;
}
