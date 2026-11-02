import { BASE_URL, INDEXNOW_KEY } from "./site";

// IndexNow varsler Bing, Yandex, Seznam m.fl. om nye/endrede URL-er.
// https://www.indexnow.org/documentation
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10_000;

export type SitemapEntry = { url: string; lastModified?: Date };

export async function fetchSitemapEntries(): Promise<SitemapEntry[]> {
  // Cache-buster sikrer at vi leser nyeste versjon og ikke en CDN-kopi.
  const response = await fetch(`${BASE_URL}/sitemap.xml?ts=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Kunne ikke hente sitemap: ${response.status}`);
  }

  const xml = await response.text();
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];

  return blocks.flatMap((block) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) return [];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();
    const date = lastmod ? new Date(lastmod) : undefined;
    return [
      {
        url: loc,
        lastModified:
          date && !Number.isNaN(date.getTime()) ? date : undefined,
      },
    ];
  });
}

export async function submitToIndexNow(urls: string[]) {
  const host = new URL(BASE_URL).host;
  const unique = [...new Set(urls)].filter(
    (url) => new URL(url).host === host,
  );

  if (unique.length === 0) {
    return { submitted: 0, status: null as number | null };
  }

  let lastStatus: number | null = null;

  for (let i = 0; i < unique.length; i += MAX_URLS_PER_REQUEST) {
    const batch = unique.slice(i, i + MAX_URLS_PER_REQUEST);
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });

    lastStatus = response.status;
    // 200 = mottatt, 202 = mottatt men nøkkel ikke verifisert ennå.
    if (response.status !== 200 && response.status !== 202) {
      const text = await response.text();
      throw new Error(`IndexNow svarte ${response.status}: ${text}`);
    }
  }

  return { submitted: unique.length, status: lastStatus };
}
