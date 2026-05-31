#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "네이버블로그");
const NOTES_DIR = path.join(ROOT, "content", "notes");
const OUT_DIR = path.join(ROOT, "data", "i18n");
const BLOG_OUT = path.join(OUT_DIR, "blog.en.json");
const NOTES_OUT = path.join(OUT_DIR, "notes.en.json");

const MODEL = "claude-haiku-4-5-20251001";
const API_URL = "https://api.anthropic.com/v1/messages";
const CONCURRENCY = 3;
const MAX_CHUNK_CHARS = 12000;
const INPUT_PRICE_PER_M = 1;
const OUTPUT_PRICE_PER_M = 5;

const SAMPLE_TRANSLATIONS = {
  "2026052601": {
    title: "[Samsung Electro-Mechanics] MLCCs and Silicon Capacitors: The Real Reason They Help AI Servers Use Power More Efficiently",
    summary:
      "This post explains why MLCCs and silicon capacitors matter in AI servers: they do not directly save electricity, but reduce loss, heat, voltage noise, and safety margins. It frames Samsung Electro-Mechanics' MLCCs as essential board-level power-stabilization parts and silicon capacitors as higher-value complements that can sit closer to GPU/HBM packages.",
    html: `<div style="border:1px solid #87d97c;border-radius:14px;padding:14px 16px;margin:0 0 24px;background:#fbfffb;color:#276221;line-height:1.8">
  <strong>Notice</strong> - This is a research-oriented note. It is not a recommendation to buy or sell any specific stock, and all investment decisions are the investor's own responsibility.
</div>
<blockquote>
<p>This is a research note, not investment advice.</p>
</blockquote>
<h2 id="한-줄-결론">One-Line Conclusion</h2>
<p>Samsung Electro-Mechanics' existing <strong>MLCCs</strong> remain core power-stabilization components around AI server boards, power stages, GPUs, and HBM. <strong>Silicon capacitors</strong> are more expensive than MLCCs, but they are high-value complements that suppress ultra-high-frequency power fluctuation at very close range, such as inside GPU/HBM packages.</p>
<p>The phrase "uses less electricity" should be stated more precisely as follows.</p>
<blockquote>
<p>Capacitors do not directly save electricity. They reduce ESR, ESL, leakage, dielectric loss, voltage margin, and power noise, thereby lowering total system loss, heat, errors, and excess voltage headroom.</p>
</blockquote>
<hr />
<h2 id="캐패시터는-전기를-먹는-부품이-아니라-전기를-안정화하는-부품">1. A capacitor does not consume electricity; it stabilizes electricity</h2>
<p>An ideal capacitor does not consume power. It stores energy through an electric field and releases it again.</p>
<pre class="text"><code>Stored energy E = 1/2 * C * V²</code></pre>
<p>Real capacitors are imperfect, so heat and loss occur. In practice, a "more efficient capacitor" means a capacitor with lower power loss, heat, and power-rail noise under the same operating conditions.</p>
<h2 id="mlcc가-ai-서버에서-중요한-이유">2. Why MLCCs matter in AI servers</h2>
<p>MLCC stands for Multi-Layer Ceramic Capacitor. It stacks ceramic dielectric layers and internal electrodes to create high capacitance in a small package.</p>
<ul>
<li>Low ESR</li>
<li>Low ESL</li>
<li>Strong high-frequency decoupling performance</li>
<li>Relatively low leakage current</li>
<li>Small size, allowing dense placement near chips</li>
</ul>
<p>When a GPU or CPU suddenly draws current, the supply voltage can sag. This is voltage droop. MLCCs placed near the chip provide momentary current and help suppress that voltage movement.</p>
<h2 id="실리콘캐패시터는-왜-비싼데-쓰나">3. Why use silicon capacitors even though they are expensive?</h2>
<p>A silicon capacitor is built on a silicon wafer. Its key advantage is proximity: an MLCC usually sits on the board, while a silicon capacitor can move inside the package, near the interposer or directly below or beside the chip. Both help power delivery, but the closer component responds better at the most demanding moments.</p>`,
  },
  "224236248280": {
    title: "[Rothwell] Looking at a China-Linked Telecom Equipment Company Supplying ZTE",
    summary:
      "This post reviews Rothwell as a China-based telecom equipment and automotive electronics company listed on Korea's KOSDAQ. It focuses on the surge in sales from ZTE-related orders, the planned voluntary delisting tender offer, and the risk that revenue growth is coming with weaker margins.",
    html: `<div class="se-main-container">
<div class="se-component se-table se-l-default" id="SE-e1863edd-d735-439c-9982-444755c6b5c2">
<div class="se-component-content">
<div class="se-section se-section-table se-l-default se-section-align-" style="width: 99.0%;">
<div class="se-table-container">
<table class="se-table-content" style="border-style:solid;border-width:2px 0px 0px 2px;border-color:#87d97c;">
<tbody><tr class="se-tr"><td class="se-cell" colspan="1" rowspan="1" style="width: 100.0%; height: 163.0px; border-style:solid;border-width:0px 2px 2px 0px;border-color:#87d97c;">
<div class="se-module se-module-text"><p class="se-text-paragraph se-text-paragraph-align-" id="SE-1e19c688-fa31-499e-acc2-31a1b9fe5cad" style=""><span class="se-fs- se-ff-" id="SE-16d41ee0-df16-11f0-9da0-b136fd92cbe3" style=""><b> </b></span><span class="se-fs- se-ff-nanummyeongjo" id="SE-16d41ee1-df16-11f0-9da0-6d8ffa50494a" style="color:#5ab03e;"><b> Notice :: I am a beginner investor without extensive investment experience. This post is not a recommendation to buy or sell any specific stock. It is a personal study note written only to record what I have learned and to review later. Please do not use it as the basis for investment decisions; final responsibility for all investments rests with the investor.</b></span></p></div>
</td></tr></tbody>
</table>
</div>
</div>
</div>
</div>
<div class="se-component se-text se-l-default" id="SE-2b6e8301-1177-431b-a7a7-900cfa94534d">
<div class="se-component-content">
<div class="se-section se-section-text se-l-default">
<div class="se-module se-module-text">
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-b2f50c17-6814-45ec-a372-d59b1fe997b9" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-90794450-bafc-425c-babc-bad37e7d7e44" style="color:#1d1c1d;">Starting a deep research note on Rothwell (900260). The first step is collecting DART annual and quarterly reports.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-86950b01-c065-453d-8480-2734bc654120" style=""><span class="se-fs-fs19 se-ff-nanumbareunhipi" id="SE-8f660649-7ee4-4ac3-89ca-b105ae07f2ef" style="color:#1d1c1d;"><b>Rothwell (900260) Deep Research Result</b></span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-a95158bb-02e1-4e7d-8ec2-30c23d1520de" style=""><span class="se-fs-fs15 se-ff-nanumbareunhipi" id="SE-5bbeb44e-bccc-4048-b134-98772842d68c" style="color:#1d1c1d;"><b>1. Company identity: a Chinese telecom equipment company listed in Korea</b></span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-ef31453b-45a1-49cb-8320-7008f2918805" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-0bcfc3d5-5040-40de-9fe6-5f0710d8a979" style="color:#1d1c1d;">Rothwell is a telecom equipment manufacturer headquartered in Jiangsu, China. Its two main business pillars are supplying communication antennas and components to ZTE and automotive electronics such as CAN bus control systems and HVAC systems. It is a foreign corporation listed on Korea's KOSDAQ, and the controlling shareholder is China-linked TRILLION LUCK GROUP LIMITED.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-59f84745-5280-440a-8eaf-1e5a4e031dd8" style=""><span class="se-fs- se-ff-" id="SE-831190aa-4bf5-4dd7-a284-074e2221a047" style="color:#616061;"><b>Key event</b></span><span class="se-fs- se-ff-" id="SE-138eb610-d832-4549-8c08-6ab08643eda9" style="color:#616061;">: In December 2025, the largest shareholder conducted a tender offer for the purpose of voluntary delisting, and the change in largest shareholder was completed in January 2026. The stated purpose is delisting.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-484a4c15-934f-4c8f-c8be-b175deadfac2" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-de1a97d7-d0d0-43ac-9607-91ace7d6d653" style="color:#1d1c1d;"><b>Sales quality issue:</b> Revenue has exploded, but operating margin has continued to fall. The structure looks like a low-margin order/EPC-style business where volume grows while margin becomes thinner.</span></p>
</div>
</div>
</div>
</div>
</div>`,
  },
  "224228484464": {
    title: "[Wooriro] The Real Meaning of the 200Gbps Photodetector Technology Transfer: What to Check Before Revenue",
    summary:
      "This post separates confirmed facts from market expectations around ETRI's 200Gbps photodetector technology transfer to Wooriro. The key view is that the transfer is meaningful, but it should be treated as an expanded technology option rather than confirmed revenue, customer wins, or immediate mass production.",
    html: `<div class="se-main-container">
<div class="se-component se-table se-l-default" id="SE-e1863edd-d735-439c-9982-444755c6b5c2">
<div class="se-component-content">
<div class="se-section se-section-table se-l-default se-section-align-" style="width: 99.0%;">
<div class="se-table-container">
<table class="se-table-content" style="border-style:solid;border-width:2px 0px 0px 2px;border-color:#87d97c;">
<tbody><tr class="se-tr"><td class="se-cell" colspan="1" rowspan="1" style="width: 100.0%; height: 163.0px; border-style:solid;border-width:0px 2px 2px 0px;border-color:#87d97c;">
<div class="se-module se-module-text"><p class="se-text-paragraph se-text-paragraph-align-" id="SE-1e19c688-fa31-499e-acc2-31a1b9fe5cad" style=""><span class="se-fs- se-ff-" id="SE-16d41ee0-df16-11f0-9da0-b136fd92cbe3" style=""><b> </b></span><span class="se-fs- se-ff-nanummyeongjo" id="SE-16d41ee1-df16-11f0-9da0-6d8ffa50494a" style="color:#5ab03e;"><b> Notice :: I am a beginner investor without extensive investment experience. This post is not a recommendation to buy or sell any specific stock. It is a personal study note written only to record what I have learned and to review later. Please do not use it as the basis for investment decisions; final responsibility for all investments rests with the investor.</b></span></p></div>
</td></tr></tbody>
</table>
</div>
</div>
</div>
</div>
<div class="se-component se-text se-l-default" id="SE-2b6e8301-1177-431b-a7a7-900cfa94534d">
<div class="se-component-content">
<div class="se-section se-section-text se-l-default">
<div class="se-module se-module-text">
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-76dab12f-12bf-4793-a3df-d82c8bab7d36" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-98da73c7-e8ec-464b-beac-50056e91e45b" style="color:#000000;">One of the recent catalysts that moved Wooriro's share price was news that ETRI transferred 200Gbps-class photodetector technology.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-29f11abb-f5f1-4169-b90a-3bc13c461214" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-e1cde771-bcff-42f7-97bc-6f6bfc9727db" style="color:#000000;">The market quickly attached keywords such as AI data centers, 5G/6G, optical transceivers, quantum, and SPAD to the story.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-fda903e1-b5c1-410a-9f37-c83a31d77215" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-5f4b0a43-2a20-45f7-8869-f567edc0fe57" style="color:#000000;">With this kind of issue, confirmed facts and expectations can easily become mixed together.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-5c650bea-ed6d-4d0b-b36a-4c4be103e2ed" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-d669f0e1-9f33-4ed7-b757-999c07b09c23" style="color:#000000;">1. What is actually confirmed</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-42ecbb52-e921-4154-94d2-0a12a7a849f7" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-0975d165-5097-4f90-8728-0a48329e684c" style="color:#000000;">2. What has not yet been confirmed</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-36d0f135-45de-428b-b6b2-c10b02f41d02" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-64ab14ba-bdaa-49e9-a887-088ab6454255" style="color:#000000;">3. What this technology could mean for Wooriro</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-5b088067-376b-476f-a8fd-641be3da9886" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-f31fc881-1d9d-4e90-abd7-bee26a5f13fd" style="color:#000000;">ETRI developed a 200Gbps-class photodetector per channel, reportedly with bandwidth above 70GHz and responsivity above 0.75A/W. Multiple reports also say the technology transfer to Wooriro has been completed.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-7e12d7bc-9e38-4884-9b2a-165a4d6eabfa" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-21cb4e75-e9eb-4182-9a07-05d664f3df30" style="color:#000000;">However, this does not immediately mean a new major customer has been secured.</span></p>
<p class="se-text-paragraph se-text-paragraph-align-" id="SE-628413d6-442b-4122-84c6-a6e9d8ee3f67" style=""><span class="se-fs- se-ff-nanumbareunhipi" id="SE-8daee431-986e-4160-856c-d8802b1f978d" style="color:#000000;">One-line conclusion: ETRI's 200Gbps photodetector technology transfer is real and meaningful. But at this stage it is closer to an expansion of Wooriro's technology option value than confirmed revenue, so customer wins and actual sales must be verified separately.</span></p>
</div>
</div>
</div>
</div>
</div>`,
  },
};

function parseArgs(argv) {
  const args = { limit: undefined, onlySample: false, ids: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--only-sample") args.onlySample = true;
    else if (arg === "--limit") args.limit = Number(argv[++i]);
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
    else if (arg === "--ids") args.ids = new Set(String(argv[++i] || "").split(",").filter(Boolean));
    else if (arg.startsWith("--ids=")) args.ids = new Set(arg.slice("--ids=".length).split(",").filter(Boolean));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (args.limit !== undefined && (!Number.isInteger(args.limit) || args.limit < 1)) {
    throw new Error("--limit must be a positive integer");
  }
  return args;
}

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`);
  fs.renameSync(tmp, file);
}

function listMd(dir) {
  const out = [];
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMd(fp));
    else if (entry.name.endsWith(".md")) out.push(fp);
  }
  return out;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, body: match[2] };
}

function fmtDate(d) {
  return String(d || "").slice(0, 10);
}

function loadBlogPosts() {
  return listMd(BLOG_DIR)
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const id = data.naver_logno ? String(data.naver_logno) : undefined;
      return {
        kind: "blog",
        id,
        file,
        raw,
        title: data.title || path.basename(file, ".md"),
        date: fmtDate(data.date),
        html: body.replace(/(src=")_attachments\//g, "$1/blog-att/"),
        sourceHash: sha256(raw),
      };
    })
    .filter((p) => p.id)
    .sort((a, b) => b.date.localeCompare(a.date) || a.file.localeCompare(b.file));
}

function noteTitleDate(file, raw) {
  const base = path.basename(file).replace(/\.md$/, "");
  const h = raw.match(/^#\s+(.+)$/m);
  const title = (h ? h[1].trim() : base.replace(/^\d{4}-\d{2}-\d{2}[ -]*/, "")) || base;
  const dm = base.match(/(\d{4})-(\d{1,2})-(\d{1,2})/) || raw.match(/(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
  const date = dm ? `${dm[1]}-${String(dm[2]).padStart(2, "0")}-${String(dm[3]).padStart(2, "0")}` : "";
  return { title, date };
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function markdownToBasicHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let para = [];
  const flushPara = () => {
    if (!para.length) return;
    out.push(`<p>${escapeHtml(para.join(" "))}</p>`);
    para = [];
  };
  for (const line of lines) {
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      flushPara();
      out.push(`<h${h[1].length}>${escapeHtml(h[2].trim())}</h${h[1].length}>`);
    } else if (!line.trim()) {
      flushPara();
    } else {
      para.push(line.trim());
    }
  }
  flushPara();
  return out.join("\n");
}

function loadNotes() {
  const dirs = [
    { prefix: "oc", dir: path.join(NOTES_DIR, "oc") },
    { prefix: "research", dir: path.join(NOTES_DIR, "research") },
    { prefix: "theme", dir: path.join(NOTES_DIR, "theme") },
    { prefix: "daily", dir: path.join(NOTES_DIR, "daily") },
  ];
  const notes = [];
  for (const { prefix, dir } of dirs) {
    for (const file of listMd(dir)) {
      const raw = fs.readFileSync(file, "utf8");
      const id = `${prefix}:${path.basename(file)}`;
      const { title, date } = noteTitleDate(file, raw);
      notes.push({
        kind: "note",
        id,
        file,
        raw,
        title,
        date,
        html: markdownToBasicHtml(raw),
        sourceHash: sha256(raw),
      });
    }
  }
  return notes.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function splitHtml(html, maxChars = MAX_CHUNK_CHARS) {
  const parts = html.split(/(<[^>]+>)/g);
  const chunks = [];
  let current = "";
  for (const part of parts) {
    if (current && current.length + part.length > maxChars) {
      chunks.push(current);
      current = "";
    }
    current += part;
  }
  if (current) chunks.push(current);
  return chunks;
}

function extractTextFromMessage(json) {
  const text = (json.content || [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
  return text.replace(/^```(?:json|html)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function anthropicMessage(messages, maxTokens = 8192) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages }),
  });
  const text = await response.text();
  if (!response.ok) {
    const err = new Error(`Anthropic API ${response.status}: ${text.slice(0, 500)}`);
    err.status = response.status;
    throw err;
  }
  return extractTextFromMessage(JSON.parse(text));
}

async function withRetry(fn, label) {
  let lastErr;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const retryable = err.status === 429 || (err.status >= 500 && err.status < 600) || err.name === "TypeError";
      if (!retryable || attempt === 4) break;
      const waitMs = Math.min(30000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 500);
      console.warn(`[retry] ${label}: ${err.message}; waiting ${waitMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastErr;
}

async function translateMeta(post) {
  const plain = stripHtml(post.html).slice(0, 5000);
  const text = await withRetry(
    () =>
      anthropicMessage(
        [
          {
            role: "user",
            content:
              "Translate this Korean stock-research post metadata into natural English. Return only compact JSON with keys title and summary. The summary must be 1-2 sentences.\n\n" +
              JSON.stringify({ title: post.title, text: plain }),
          },
        ],
        1024,
      ),
    `${post.id} metadata`,
  );
  return JSON.parse(text);
}

async function translateHtmlChunk(chunk, post, index, total) {
  return withRetry(
    () =>
      anthropicMessage(
        [
          {
            role: "user",
            content:
              "Translate this Korean HTML fragment into natural English. Preserve every HTML tag, attribute, comment, URL, image path, class, id, style, and code block exactly. Translate visible Korean text nodes only. Return only the translated HTML fragment, with no Markdown fence.\n\n" +
              `Post title: ${post.title}\nFragment ${index + 1} of ${total}:\n${chunk}`,
          },
        ],
        8192,
      ),
    `${post.id} html ${index + 1}/${total}`,
  );
}

async function translatePost(post) {
  const meta = await translateMeta(post);
  const chunks = splitHtml(post.html);
  const translated = [];
  for (let i = 0; i < chunks.length; i += 1) {
    translated.push(await translateHtmlChunk(chunks[i], post, i, chunks.length));
  }
  return {
    title: meta.title,
    summary: meta.summary,
    html: translated.join(""),
    translatedAt: new Date().toISOString(),
    sourceHash: post.sourceHash,
  };
}

async function runPool(items, worker) {
  let next = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(workers);
}

function estimate(posts) {
  const sourceChars = posts.reduce((sum, p) => sum + p.title.length + p.html.length, 0);
  const inputTokens = Math.ceil(sourceChars / 3.2);
  const outputTokens = Math.ceil(sourceChars / 3.5);
  const cost = (inputTokens / 1_000_000) * INPUT_PRICE_PER_M + (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_M;
  const avgSeconds = 18;
  const minutes = Math.ceil((posts.length * avgSeconds) / CONCURRENCY / 60);
  return { sourceChars, inputTokens, outputTokens, cost, minutes };
}

function formatEstimate(e) {
  return `Estimated full run: ${e.inputTokens.toLocaleString()} input tokens + ${e.outputTokens.toLocaleString()} output tokens, about $${e.cost.toFixed(2)} at $${INPUT_PRICE_PER_M}/M input and $${OUTPUT_PRICE_PER_M}/M output, roughly ${e.minutes}-${Math.ceil(e.minutes * 1.5)} minutes at concurrency ${CONCURRENCY}.`;
}

function writeSamples(blogPosts, blogOut) {
  const newest = blogPosts.slice(0, 3);
  const missing = newest.filter((post) => !SAMPLE_TRANSLATIONS[post.id]).map((post) => `${post.id} (${post.file})`);
  if (missing.length) {
    throw new Error(`Missing hand-written sample translations for newest posts:\n${missing.join("\n")}`);
  }
  for (const post of newest) {
    blogOut[post.id] = {
      ...SAMPLE_TRANSLATIONS[post.id],
      translatedAt: new Date().toISOString(),
      sourceHash: post.sourceHash,
    };
  }
  writeJson(BLOG_OUT, blogOut);
  return newest.map((p) => p.id);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const blogPosts = loadBlogPosts();
  const notes = loadNotes();
  const allPosts = [...blogPosts, ...notes];
  const fullEstimate = estimate(allPosts);

  const blogOut = readJson(BLOG_OUT);
  const notesOut = readJson(NOTES_OUT);

  if (args.onlySample || !process.env.ANTHROPIC_API_KEY) {
    const ids = writeSamples(blogPosts, blogOut);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("ANTHROPIC_API_KEY is not set, so live translation calls were skipped.");
    }
    console.log(`Wrote hand-translated English samples for blog ids: ${ids.join(", ")}`);
    console.log(formatEstimate(fullEstimate));
    return;
  }

  let candidates = allPosts.filter((post) => {
    if (args.ids && !args.ids.has(post.id)) return false;
    const out = post.kind === "blog" ? blogOut : notesOut;
    return out[post.id]?.sourceHash !== post.sourceHash;
  });
  if (args.limit) candidates = candidates.slice(0, args.limit);

  console.log(`Loaded ${blogPosts.length} blog posts and ${notes.length} notes.`);
  console.log(`Translating ${candidates.length} changed/new posts with ${MODEL}.`);
  console.log(formatEstimate(fullEstimate));

  let done = 0;
  await runPool(candidates, async (post) => {
    const translated = await translatePost(post);
    if (post.kind === "blog") {
      blogOut[post.id] = translated;
      writeJson(BLOG_OUT, blogOut);
    } else {
      notesOut[post.id] = translated;
      writeJson(NOTES_OUT, notesOut);
    }
    done += 1;
    console.log(`[${done}/${candidates.length}] wrote ${post.kind}:${post.id}`);
  });
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
