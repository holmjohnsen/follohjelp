import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultHistoryPath = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "openclaw-work",
  "projects",
  "follohjelp",
  "out",
  "metrics-history.json",
);

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function normalizeMetricsUrl(rawUrl) {
  const trimmed = rawUrl.trim();
  return trimmed.endsWith("/api/metrics")
    ? trimmed
    : `${trimmed.replace(/\/$/, "")}/api/metrics`;
}

async function readHistory(historyFilePath) {
  try {
    const content = await readFile(historyFilePath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw new Error("Failed to read metrics history file");
  }
}

async function main() {
  const metricsUrl = normalizeMetricsUrl(requiredEnv("METRICS_URL"));
  const metricsToken = requiredEnv("METRICS_TOKEN");
  const historyFilePath = process.env.METRICS_HISTORY_FILE?.trim() || defaultHistoryPath;

  const response = await fetch(metricsUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${metricsToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Metrics request failed (${response.status}): ${responseText}`);
  }

  const payload = await response.json();
  const generatedAt =
    payload && typeof payload.generatedAt === "string" ? payload.generatedAt.trim() : "";

  if (!generatedAt) {
    throw new Error("Metrics payload missing generatedAt");
  }

  const history = await readHistory(historyFilePath);
  const duplicate = history.some(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      "generatedAt" in entry &&
      entry.generatedAt === generatedAt,
  );

  if (duplicate) {
    console.log(`No change: generatedAt ${generatedAt} already exists in history.`);
    return;
  }

  history.push({
    pulledAt: new Date().toISOString(),
    generatedAt,
    payload,
  });

  await mkdir(path.dirname(historyFilePath), { recursive: true });
  await writeFile(historyFilePath, `${JSON.stringify(history, null, 2)}\n`, "utf8");

  console.log(`Saved metrics snapshot (${generatedAt}) to ${historyFilePath}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`metrics:pull failed: ${message}`);
  process.exit(1);
});
