#!/usr/bin/env node
// Lists posts that still need a report reformat (missing or stale by sourceHash).
// Usage: node scripts/list-pending-reports.mjs [limit] [--shard i --of K]
// Output: TSV lines  kind \t key \t sourcePath \t id
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const BLOG_DIR = path.join(CONTENT, "네이버블로그");
const NOTE_DIRS = [
  ["oc", path.join(CONTENT, "notes", "oc")],
  ["research", path.join(CONTENT, "notes", "research")],
  ["theme", path.join(CONTENT, "notes", "theme")],
  ["daily", path.join(CONTENT, "notes", "daily")],
];

const args = process.argv.slice(2);
let limit = Infinity, shard = 0, of = 1;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--shard") shard = parseInt(args[++i], 10);
  else if (args[i] === "--of") of = parseInt(args[++i], 10);
  else if (/^\d+$/.test(args[i])) limit = parseInt(args[i], 10);
}

const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex");
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

function listMd(dir) {
  let out = [];
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(listMd(fp));
    else if (e.name.endsWith(".md")) out.push(fp);
  }
  return out;
}

function pending(kind, key, srcPath) {
  const rp = path.join(ROOT, "data", "reports", kind, key + ".json");
  let cur = null;
  try { cur = JSON.parse(fs.readFileSync(rp, "utf8")); } catch { return true; }
  if (!cur || !cur.ko || !cur.ko.html) return true;
  try {
    const h = sha256(fs.readFileSync(srcPath, "utf8"));
    return cur.sourceHash !== h;
  } catch { return false; }
}

const rows = [];
// notes
for (const [prefix, dir] of NOTE_DIRS) {
  for (const fp of listMd(dir)) {
    const id = prefix + ":" + path.basename(fp);
    const key = sha1(id);
    if (pending("note", key, fp)) rows.push(["note", key, path.relative(ROOT, fp), id]);
  }
}
// blog
for (const fp of listMd(BLOG_DIR)) {
  let raw = "";
  try { raw = fs.readFileSync(fp, "utf8"); } catch { continue; }
  const m = raw.match(/naver_logno:\s*([0-9]+)/);
  if (!m) continue;
  const logno = m[1];
  if (pending("blog", logno, fp)) rows.push(["blog", logno, path.relative(ROOT, fp), logno]);
}

const sharded = rows.filter((r) => (parseInt(sha1(r[1]).slice(0, 8), 16) % of) === shard);
let n = 0;
for (const r of sharded) {
  if (n++ >= limit) break;
  process.stdout.write(r.join("\t") + "\n");
}
process.stderr.write(`pending total=${rows.length} shard=${shard}/${of} emitted=${Math.min(sharded.length, limit)}\n`);
