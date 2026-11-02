// Manuell innsending av URL-er til IndexNow.
//   npm run indexnow                 -> hele sitemapen
//   npm run indexnow -- <url> <url>  -> kun angitte URL-er
const BASE_URL = "https://follohjelp.no";
const KEY = "ec3c78729656dafa184022d6c088be7a";

async function sitemapUrls() {
  const response = await fetch(`${BASE_URL}/sitemap.xml?ts=${Date.now()}`);
  if (!response.ok) throw new Error(`Sitemap: ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const args = process.argv.slice(2);
const urlList = args.length > 0 ? args : await sitemapUrls();

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(BASE_URL).host,
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: ${response.status} (${urlList.length} URL-er)`);
if (response.status !== 200 && response.status !== 202) {
  console.error(await response.text());
  process.exit(1);
}
