import fs from "node:fs";
import path from "node:path";

// [년월(YYYY-MM), 금액(달러), 금액(원화), 중량(kg)]
export type ExportRow = [string, number | null, number | null, number | null];
export type ExportItem = { name: string; hs: string | null; companies: string | null; rows: ExportRow[] };
export type ExportData = { source: string; items: ExportItem[] };

export function getExportData(): ExportData {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "exports.json"), "utf8"));
  } catch {
    return { source: "", items: [] };
  }
}
