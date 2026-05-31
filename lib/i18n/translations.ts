import fs from "node:fs";
import path from "node:path";

// English overlays produced by the codex translation pipeline (data/i18n/*.en.json).
export type EnEntry = { title?: string; summary?: string; html?: string };
type EnMap = Record<string, EnEntry>;

function load(file: string): EnMap {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "i18n", file), "utf8")) as EnMap;
  } catch {
    return {};
  }
}

let _blog: { at: number; map: EnMap } | null = null;
let _notes: { at: number; map: EnMap } | null = null;
const TTL = 300_000;

export function blogEn(): EnMap {
  if (!_blog || Date.now() - _blog.at > TTL) _blog = { at: Date.now(), map: load("blog.en.json") };
  return _blog.map;
}

export function notesEn(): EnMap {
  if (!_notes || Date.now() - _notes.at > TTL) _notes = { at: Date.now(), map: load("notes.en.json") };
  return _notes.map;
}
