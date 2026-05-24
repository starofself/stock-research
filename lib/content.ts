import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const VAULT = process.env.VAULT_PATH || "/Users/starofselfhigmail.com/Documents/Starofself";
// In deploy mode, content is bundled into the repo under content/ (auto-detected).
function detectContent(): string {
  if (process.env.CONTENT_ROOT) return process.env.CONTENT_ROOT;
  const c = path.join(process.cwd(), "content");
  try {
    return fs.existsSync(path.join(c, "네이버블로그")) ? c : "";
  } catch {
    return "";
  }
}
const CONTENT = detectContent();
const BLOG_DIR = CONTENT ? path.join(CONTENT, "네이버블로그") : path.join(VAULT, "네이버블로그");

function fmtDate(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d || "").slice(0, 10);
}

type Summary = { summary: string; points: string[]; stock?: boolean };
function loadSummaries(): Record<string, Summary> {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "summaries.json"), "utf8"));
  } catch {
    return {};
  }
}

export type BlogPost = { title: string; date: string; summary: string; url: string; logno?: string; image?: string; ai?: boolean; tags: string[] };

function clean(s: string): string {
  return s
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBlogPosts(limit?: number): BlogPost[] {
  const dir = BLOG_DIR;
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const SUMM = loadSummaries();
  const posts: BlogPost[] = files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, content } = matter(raw);
    const title = (data.title as string) || f.replace(/\.md$/, "");
    const date = fmtDate(data.date);
    const url = (data.source as string) || "https://blog.naver.com/star_of_self";
    const logno = data.naver_logno ? String(data.naver_logno) : undefined;
    const ai = logno ? SUMM["naver:" + logno] : undefined;
    const summary = ai && ai.summary ? ai.summary : clean(content).slice(0, 100);
    const m = content.match(/src="(_attachments\/[^"]+)"/);
    const image = m ? m[1] : undefined;
    return { title, date, summary, url, logno, image, ai: Boolean(ai && ai.summary), tags: (ai && ai.tags) || [] };
  }).filter((p) => {
    const s = p.logno ? SUMM["naver:" + p.logno] : undefined;
    return !s || s.stock !== false;
  });
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return limit ? posts.slice(0, limit) : posts;
}

export type FullPost = { title: string; date: string; html: string; url: string; summary?: string; points?: string[] };

export function getBlogPost(logno: string): FullPost | null {
  const dir = BLOG_DIR;
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return null;
  }
  const SUMM = loadSummaries();
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, content } = matter(raw);
    if (String(data.naver_logno) === logno) {
      const html = content.replace(/(src=")_attachments\//g, "$1/blog-att/");
      const ai = SUMM["naver:" + logno];
      return {
        title: String(data.title || f.replace(/\.md$/, "")),
        date: fmtDate(data.date),
        html,
        url: String(data.source || "https://blog.naver.com/star_of_self"),
        summary: ai ? ai.summary : undefined,
        points: ai ? ai.points : undefined,
      };
    }
  }
  return null;
}

// ===== Obsidian notes =====

const OC = path.join(VAULT, "OpenClaw - 01 Main");
const OC_COMPANIES = CONTENT ? path.join(CONTENT, "notes", "oc") : path.join(OC, "03_Companies");
const NOTE_DIRS: { prefix: string; dir: string; type: string }[] = CONTENT
  ? [
      { prefix: "oc", dir: path.join(CONTENT, "notes", "oc"), type: "기업노트" },
      { prefix: "research", dir: path.join(CONTENT, "notes", "research"), type: "딥리서치" },
      { prefix: "theme", dir: path.join(CONTENT, "notes", "theme"), type: "테마" },
      { prefix: "daily", dir: path.join(CONTENT, "notes", "daily"), type: "데일리" },
    ]
  : [
      { prefix: "oc", dir: path.join(OC, "03_Companies"), type: "기업노트" },
      { prefix: "research", dir: path.join(VAULT, "Research"), type: "딥리서치" },
      { prefix: "theme", dir: path.join(OC, "02_Themes"), type: "테마" },
      { prefix: "daily", dir: path.join(OC, "01_Daily_Capture"), type: "데일리" },
    ];

export type NoteItem = { id: string; title: string; date: string; type: string; tags: string[]; summary: string };

function listMd(dir: string): string[] {
  let out: string[] = [];
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(listMd(fp));
    else if (e.name.endsWith(".md")) out.push(fp);
  }
  return out;
}

function noteTitleDate(fp: string, raw: string): { title: string; date: string } {
  const base = path.basename(fp).replace(/\.md$/, "");
  const h = raw.match(/^#\s+(.+)$/m);
  const title = (h ? h[1].trim() : base.replace(/^\d{4}-\d{2}-\d{2}[ -]*/, "")) || base;
  const dm = base.match(/(\d{4})-(\d{1,2})-(\d{1,2})/) || raw.match(/(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
  const date = dm ? `${dm[1]}-${String(dm[2]).padStart(2, "0")}-${String(dm[3]).padStart(2, "0")}` : "";
  return { title, date };
}

export function getNotes(): NoteItem[] {
  const SUMM = loadSummaries();
  const items: NoteItem[] = [];
  for (const { prefix, dir, type } of NOTE_DIRS) {
    for (const fp of listMd(dir)) {
      const raw = fs.readFileSync(fp, "utf8");
      const id = prefix + ":" + path.basename(fp);
      const ai = SUMM[id];
      if (ai && ai.stock === false) continue;
      const { title, date } = noteTitleDate(fp, raw);
      items.push({ id, title, date, type, tags: (ai && ai.tags) || [], summary: ai && ai.summary ? ai.summary : "" });
    }
  }
  items.sort((a, b) => b.date.localeCompare(a.date));
  return items;
}

export function getNotesByType(type: string): NoteItem[] {
  return getNotes().filter((n) => n.type === type);
}

export type Stock = { ticker: string; name: string; count: number; date: string; tags: string[]; latestId: string };

export function getStocks(): Stock[] {
  const dir = OC_COMPANIES;
  const SUMM = loadSummaries();
  let subs: fs.Dirent[] = [];
  try {
    subs = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: Stock[] = [];
  for (const s of subs) {
    if (!s.isDirectory() || s.name.startsWith(".")) continue;
    const m = s.name.match(/^(\d{6})[_ ]+(.+)$/);
    const ticker = m ? m[1] : "";
    const name = m ? m[2] : s.name;
    const files = listMd(path.join(dir, s.name));
    if (!files.length) continue;
    const tagset = new Set<string>();
    let date = "";
    let latestId = "";
    for (const fp of files) {
      const id = "oc:" + path.basename(fp);
      const ai = SUMM[id];
      (ai?.tags || []).forEach((t) => tagset.add(t));
      const d = noteTitleDate(fp, fs.readFileSync(fp, "utf8")).date;
      if (d >= date) {
        date = d;
        latestId = id;
      }
    }
    out.push({ ticker, name, count: files.length, date, tags: [...tagset].slice(0, 6), latestId: encodeURIComponent(latestId) });
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out;
}

export type FullNote = { title: string; date: string; type: string; html: string; summary?: string; points?: string[]; tags: string[] };

export function getNote(id: string): FullNote | null {
  const SUMM = loadSummaries();
  for (const { prefix, dir, type } of NOTE_DIRS) {
    if (!id.startsWith(prefix + ":")) continue;
    const base = id.slice(prefix.length + 1);
    for (const fp of listMd(dir)) {
      if (path.basename(fp) === base) {
        const raw = fs.readFileSync(fp, "utf8");
        const { content } = matter(raw);
        const { title, date } = noteTitleDate(fp, raw);
        const ai = SUMM[id];
        return { title, date, type, html: marked.parse(content) as string, summary: ai?.summary, points: ai?.points, tags: (ai && ai.tags) || [] };
      }
    }
  }
  return null;
}

// ===== unified search (cached index) =====

export type SearchHit = { title: string; date: string; kind: "blog" | "note"; href: string; tags: string[] };

let _idx: { at: number; items: { text: string; hit: SearchHit }[] } | null = null;

function buildIndex(): { text: string; hit: SearchHit }[] {
  if (_idx && Date.now() - _idx.at < 300000) return _idx.items;
  const items: { text: string; hit: SearchHit }[] = [];
  for (const p of getBlogPosts()) {
    items.push({
      text: (p.title + " " + p.summary + " " + p.tags.join(" ")).toLowerCase(),
      hit: { title: p.title, date: p.date, kind: "blog", href: p.logno ? "/blog/" + p.logno : p.url, tags: p.tags.slice(0, 3) },
    });
  }
  for (const n of getNotes()) {
    items.push({
      text: (n.title + " " + n.summary + " " + n.tags.join(" ")).toLowerCase(),
      hit: { title: n.title, date: n.date, kind: "note", href: "/note/" + encodeURIComponent(n.id), tags: n.tags.slice(0, 3) },
    });
  }
  items.sort((a, b) => b.hit.date.localeCompare(a.hit.date));
  _idx = { at: Date.now(), items };
  return items;
}

export function searchAll(q: string, limit = 14): SearchHit[] {
  const qq = q.trim().toLowerCase();
  if (!qq) return [];
  return buildIndex().filter((x) => x.text.includes(qq)).map((x) => x.hit).slice(0, limit);
}
