import { fetchSitemapEntries, submitToIndexNow } from "../../lib/indexnow";

// Fanger opp endringer i Airtable (nye/oppdaterte leverandører) som skjer
// uten ny deploy. Sender kun URL-er med lastmod siste døgn, slik IndexNow
// anbefaler – ikke hele sitemapen hver dag.
const WINDOW_MS = 25 * 60 * 60 * 1000;

const indexNowDaily = async () => {
  try {
    const since = Date.now() - WINDOW_MS;
    const entries = await fetchSitemapEntries();
    const changed = entries
      .filter((entry) => (entry.lastModified?.getTime() ?? 0) >= since)
      .map((entry) => entry.url);

    const result = await submitToIndexNow(changed);
    console.log("[indexnow] daily", JSON.stringify(result));
  } catch (error) {
    console.error("[indexnow] daily failed", error);
  }
};

export default indexNowDaily;

export const config = {
  schedule: "@daily",
};
