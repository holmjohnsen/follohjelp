import { fetchSitemapEntries, submitToIndexNow } from "../../lib/indexnow";

// Netlify kaller funksjoner med dette navnet automatisk etter hver vellykket
// deploy. Vi sender hele sitemapen til IndexNow, men kun for produksjon.
const deploySucceeded = async (req: Request) => {
  let context: string | undefined;
  try {
    const body = await req.json();
    context = body?.payload?.context;
  } catch {
    context = undefined;
  }

  if (context && context !== "production") {
    return new Response(`Hopper over IndexNow for ${context}`, { status: 200 });
  }

  try {
    const entries = await fetchSitemapEntries();
    const result = await submitToIndexNow(entries.map((entry) => entry.url));
    console.log("[indexnow] deploy", JSON.stringify(result));
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // En feil her skal aldri påvirke selve deployen.
    console.error("[indexnow] deploy failed", error);
    return new Response("IndexNow feilet", { status: 200 });
  }
};

export default deploySucceeded;
