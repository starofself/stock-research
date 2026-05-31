import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Structured "report-style" HTML produced by the codex reformat pipeline.
// Stored per-post at data/reports/{blog|note}/{key}.json
export type ReportDoc = { title?: string; html?: string };
export type ReportEntry = { ko?: ReportDoc; en?: ReportDoc; sourceHash?: string; generatedAt?: string };

export function noteReportKey(id: string): string {
  return crypto.createHash("sha1").update(id).digest("hex");
}

const _cache = new Map<string, { at: number; v: ReportEntry | null }>();
const TTL = 300_000;

function read(kind: "blog" | "note", key: string): ReportEntry | null {
  const cacheKey = kind + "/" + key;
  const hit = _cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL) return hit.v;
  let v: ReportEntry | null = null;
  try {
    v = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "reports", kind, key + ".json"), "utf8"));
  } catch {
    v = null;
  }
  _cache.set(cacheKey, { at: Date.now(), v });
  return v;
}

// Returns the report doc for the requested locale, falling back to ko.
export function getReport(kind: "blog" | "note", key: string, locale?: string): ReportDoc | null {
  const entry = read(kind, key);
  if (!entry) return null;
  const loc = locale === "en" ? "en" : "ko";
  const doc = entry[loc] || entry.ko || entry.en || null;
  return doc && doc.html ? doc : null;
}
