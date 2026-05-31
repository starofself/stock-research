#!/usr/bin/env node
// Import research-worthy Hermes Telegram sessions into content/notes/research.
// This keeps Telegram-first research from being missed by the nightly report pass.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const HERMES_DB = process.env.HERMES_DB || "/Users/starofselfhigmail.com/.hermes/state.db";
const OUT_DIR = path.join(ROOT, "content", "notes", "research");

const args = process.argv.slice(2);
let sinceDays = 14;
let dryRun = false;
let limit = Infinity;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--since-days") sinceDays = Number(args[++i] || sinceDays);
  else if (args[i] === "--limit") limit = Number(args[++i] || limit);
  else if (args[i] === "--dry-run") dryRun = true;
}

const includeRe = /(리서치|투자|주식|종목|기업|산업|섹터|테마|보고서|공시|실적|매출|영업이익|수혜주|밸류|밸류에이션|포트|ETF|시장|매크로|반도체|AI|로봇|전력|데이터센터|태양광|원자력|조선|research|investment|stock|equity|earnings|filing|sector|valuation|portfolio|robot|semiconductor|datacenter)/i;
const hardExcludeTitleRe = /(Gmail 새 메일|메일 알림|캘린더|calendar)/i;
const excludeTitleRe = /(Gmail 새 메일|메일 알림|캘린더|calendar|chrome|vercel|cron|launchd|자동화 설정|repository|repo|github)/i;

function sqliteJson(query) {
  if (!fs.existsSync(HERMES_DB)) return [];
  const out = execFileSync("sqlite3", ["-json", HERMES_DB, query], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
  return out ? JSON.parse(out) : [];
}

function kstDate(ts) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Number(ts) * 1000));
}

function kstDateTime(ts) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(Number(ts) * 1000));
}

function cleanInline(s) {
  return String(s || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function yamlString(s) {
  return JSON.stringify(String(s || ""));
}

function slugify(s) {
  return cleanInline(s)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "research";
}

function deriveTitle(row) {
  const explicit = cleanInline(row.title);
  if (explicit) return explicit;
  const h1 = String(row.answer || "").match(/^#\s+(.+)$/m);
  if (h1) return cleanInline(h1[1]).slice(0, 120);
  const firstPrompt = cleanInline(row.prompts).slice(0, 90);
  return firstPrompt ? `Hermes Telegram Research - ${firstPrompt}` : `Hermes Telegram Research ${row.id}`;
}

function tagsFor(text) {
  const tags = new Set(["hermes", "telegram", "investment-research"]);
  const pairs = [
    ["ai", /\bAI\b|인공지능|피지컬AI|agent/i],
    ["robotics", /로봇|robot|humanoid|휴머노이드/i],
    ["semiconductor", /반도체|HBM|메모리|파운드리|semiconductor/i],
    ["infrastructure", /전력|데이터센터|datacenter|infrastructure/i],
    ["energy", /태양광|원자력|에너지|solar|nuclear/i],
    ["shipbuilding", /조선|선박|shipbuilding/i],
  ];
  for (const [tag, re] of pairs) if (re.test(text)) tags.add(tag);
  return [...tags];
}

function existingPathFor(id) {
  let files = [];
  try { files = fs.readdirSync(OUT_DIR); } catch { return null; }
  return files.find((f) => f.includes(id) && f.endsWith(".md"))
    ? path.join(OUT_DIR, files.find((f) => f.includes(id) && f.endsWith(".md")))
    : null;
}

function buildMarkdown(row) {
  const title = deriveTitle(row);
  const date = kstDate(row.started_at);
  const text = `${row.title || ""}\n${row.prompts || ""}\n${row.answer || ""}`;
  const tags = tagsFor(text);
  const prompts = String(row.prompts || "").trim();
  const answer = String(row.answer || "").trim();
  return {
    title,
    date,
    markdown: [
      "---",
      `title: ${yamlString(title)}`,
      `date: ${date}`,
      "type: deep-research",
      `source: ${yamlString(`hermes:telegram:${row.id}`)}`,
      `hermes_session: ${yamlString(row.id)}`,
      `hermes_started_at: ${yamlString(kstDateTime(row.started_at))}`,
      `tags: [${tags.map(yamlString).join(", ")}]`,
      "confidence: medium",
      "---",
      "",
      `# ${title}`,
      "",
      "<!-- hermes-telegram-auto-ingest -->",
      `<!-- hermes-session-id: ${row.id} -->`,
      "",
      "이 노트는 Hermes Telegram 리서치 세션에서 자동 수집되었습니다. 원문 유료/외부 콘텐츠 전문을 복제하지 않고, 세션에서 생성된 리서치 결과만 홈페이지 리포트 변환 파이프라인으로 넘깁니다.",
      "",
      "## Telegram 요청",
      "",
      prompts || "(요청 원문 없음)",
      "",
      "## Hermes 리서치 결과",
      "",
      answer || "(리서치 결과 없음)",
      "",
    ].join("\n"),
  };
}

const since = Math.max(1, Math.floor(sinceDays));
const query = `
SELECT
  s.id,
  COALESCE(s.title, '') AS title,
  s.started_at,
  COALESCE((SELECT group_concat(content, char(10) || char(10)) FROM messages WHERE session_id = s.id AND role = 'user' AND length(COALESCE(content, '')) > 0), '') AS prompts,
  COALESCE((SELECT content FROM messages WHERE session_id = s.id AND role = 'assistant' AND length(COALESCE(content, '')) > 0 ORDER BY length(content) DESC LIMIT 1), '') AS answer
FROM sessions s
WHERE s.source = 'telegram'
  AND s.started_at >= strftime('%s', 'now') - ${since * 86400}
ORDER BY s.started_at DESC
`;

const rows = sqliteJson(query);
const candidates = rows.filter((row) => {
  const title = String(row.title || "");
  const answer = String(row.answer || "");
  const prompts = String(row.prompts || "");
  if (answer.length < 1800) return false;
  if (hardExcludeTitleRe.test(title)) return false;
  const haystack = `${title}\n${prompts}\n${answer.slice(0, 5000)}`;
  if (excludeTitleRe.test(title) && !/투자|주식|리서치|종목|기업|산업|sector|stock|investment/i.test(haystack)) return false;
  return includeRe.test(haystack);
}).slice(0, limit);

let written = 0;
let skipped = 0;
if (!dryRun) fs.mkdirSync(OUT_DIR, { recursive: true });

for (const row of candidates) {
  const { title, date, markdown } = buildMarkdown(row);
  const existing = existingPathFor(row.id);
  const target = existing || path.join(OUT_DIR, `${date}-hermes-telegram-${row.id}-${slugify(title)}.md`);
  if (dryRun) {
    console.log(`${row.id}\t${date}\t${title}`);
    continue;
  }
  let prev = null;
  try { prev = fs.readFileSync(target, "utf8"); } catch {}
  if (prev === markdown) {
    skipped++;
    continue;
  }
  fs.writeFileSync(target, markdown, "utf8");
  written++;
}

console.error(`hermes telegram ingest: scanned=${rows.length} candidates=${candidates.length} written=${written} skipped=${skipped} dryRun=${dryRun}`);
