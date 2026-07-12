#!/usr/bin/env node
/**
 * 관세청 수출입 실적(공공데이터포털 data.go.kr)에서 품목별 월간 데이터를 수집해
 * data/exports.json 을 갱신한다.
 *
 * 사용 API (모두 활용신청 필요, serviceKey 공용):
 *  - 품목별:          apis.data.go.kr/1220000/Itemtrade/getItemtradeList
 *  - 품목별·국가별:   apis.data.go.kr/1220000/nitemtrade/getNitemtradeList
 *  - 국가별:          apis.data.go.kr/1220000/nationtrade/getNationtradeList
 *
 * 사용법:
 *   DATA_GO_KR_KEY=발급키 node scripts/fetch-exports-customs.mjs [옵션]
 *     --start 201601     이 시점부터 강제 재수집(백필)
 *     --items "디램,낸드" 일부 품목만
 *     --dry              exports.json 을 쓰지 않고 리포트만
 *
 * 동작:
 *  - 품목 정의는 data/export-items.json (name/hs/country/flow/type)
 *  - 기본 모드: 저장된 데이터가 config.start 이전을 못 덮으면 전체 백필,
 *    아니면 최근 14개월만 갱신
 *  - 엑셀 유래 기존 값과 겹치는 구간을 비교해 단위(달러/천달러, kg/톤)를
 *    자동 보정하고, 일치율이 낮은 품목은 API 값을 버리고 기존 값을 유지
 *  - 결과 요약은 data/exports-report.json 에 기록
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const KEY = process.env.DATA_GO_KR_KEY || "";
const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}
const DRY = args.includes("--dry");
const FORCE_START = arg("--start");
const ONLY = arg("--items") ? new Set(arg("--items").split(",").map((s) => s.trim())) : null;

if (!KEY) {
  console.log("DATA_GO_KR_KEY 가 설정되지 않아 건너뜁니다 (repo secret 등록 필요).");
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "export-items.json"), "utf8"));
const dataPath = path.join(ROOT, "data", "exports.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const byName = new Map(data.items.map((it) => [it.name, it]));

const now = new Date();
const nowYm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
const CONFIG_START = config.start || "201601";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// KEY 는 공공데이터포털의 "Decoding" 키를 사용할 것 (URLSearchParams 가 인코딩함)
async function apiGet(base, params, tries = 3) {
  const qs = new URLSearchParams({ serviceKey: KEY, numOfRows: "5000", ...params });
  const url = `${base}?${qs}`;
  for (let t = 1; t <= tries; t++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const txt = await res.text();
      const code = (txt.match(/<resultCode>\s*(\w+)\s*<\/resultCode>/) || [])[1];
      if (code && code !== "00" && code !== "0000") {
        const msg = (txt.match(/<resultMsg>\s*([^<]*)\s*<\/resultMsg>/) || [])[1] || "";
        // 쿼터 초과 등은 재시도 무의미
        throw new ApiError(`resultCode=${code} ${msg.trim()}`, /22|30|31/.test(code));
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return txt;
    } catch (e) {
      if (e instanceof ApiError && e.fatal) throw e;
      if (t === tries) throw e;
      await sleep(1500 * t);
    }
  }
}
class ApiError extends Error {
  constructor(msg, fatal) { super(msg); this.fatal = fatal; }
}

function parseItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) =>
    Object.fromEntries([...m[1].matchAll(/<(\w+)[^>]*>([^<]*)<\/\1>/g)].map((x) => [x[1], x[2].trim()])),
  );
}

const num = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  const f = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(f) ? f : 0;
};

// (base, 고정 파라미터)로 연 단위 조회를 돌려 월별 usd/wgt 누적
async function fetchMonthly(base, fixed, flow, startYymm, acc) {
  const y0 = +startYymm.slice(0, 4);
  const y1 = +nowYm.slice(0, 4);
  for (let y = y0; y <= y1; y++) {
    const strt = y === y0 ? startYymm : `${y}01`;
    const end = y === y1 ? nowYm : `${y}12`;
    let page = 1, got = 0, total = Infinity;
    while (got < total) {
      const xml = await apiGet(base, { strtYymm: strt, endYymm: end, pageNo: String(page), ...fixed });
      total = num((xml.match(/<totalCount>\s*(\d+)\s*<\/totalCount>/) || [])[1]) || 0;
      const list = parseItems(xml);
      if (!list.length) break;
      got += list.length;
      for (const it of list) {
        const m = String(it.year || "").match(/^(\d{4})\.(\d{2})$/);
        if (!m) continue; // '총계' 등 합계 행 제외
        const ym = `${m[1]}-${m[2]}`;
        const usd = flow === "imp" ? num(it.impDlr) : num(it.expDlr);
        const wgt = flow === "imp" ? num(it.impWgt) : num(it.expWgt);
        const cur = acc.get(ym) || { usd: 0, wgt: 0 };
        cur.usd += usd;
        cur.wgt += wgt;
        acc.set(ym, cur);
      }
      page++;
      await sleep(250);
    }
  }
}

const IT = "https://apis.data.go.kr/1220000/Itemtrade/getItemtradeList";
const NIT = "https://apis.data.go.kr/1220000/nitemtrade/getNitemtradeList";
const NAT = "https://apis.data.go.kr/1220000/nationtrade/getNationtradeList";

async function fetchItem(spec, startYymm) {
  const acc = new Map();
  if (spec.type === "nation") {
    const cnty = spec.name === "미국" ? "US" : "CN";
    await fetchMonthly(NAT, { cntyCd: cnty }, spec.flow, startYymm, acc);
  } else if (spec.type === "total") {
    // 국가별 전체를 받아 월별 합산 → 총수출
    await fetchMonthly(NAT, {}, spec.flow, startYymm, acc);
  } else {
    const codes = (spec.hs || "").split(",").filter(Boolean);
    const countries = (spec.country || "").split(",").filter(Boolean);
    for (const hs of codes) {
      if (countries.length) {
        for (const c of countries) await fetchMonthly(NIT, { hsSgn: hs, cntyCd: c }, spec.flow, startYymm, acc);
      } else {
        await fetchMonthly(IT, { hsSgn: hs }, spec.flow, startYymm, acc);
      }
    }
  }
  return acc;
}

function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

// 기존(엑셀 유래) 값과 비교해 [단위 스케일 보정, 신뢰 여부] 결정
function calibrate(fetched, existingRows) {
  const exUsd = new Map(existingRows.filter((r) => r[1]).map((r) => [r[0], r[1]]));
  const exKg = new Map(existingRows.filter((r) => r[3]).map((r) => [r[0], r[3]]));
  const usdRatios = [], kgRatios = [];
  for (const [ym, v] of fetched) {
    if (v.usd > 0 && exUsd.has(ym)) usdRatios.push(exUsd.get(ym) / v.usd);
    if (v.wgt > 0 && exKg.has(ym)) kgRatios.push(exKg.get(ym) / v.wgt);
  }
  const snap = (r) => {
    if (r === null) return 1;
    for (const s of [0.001, 1, 1000]) if (r > s * 0.9 && r < s * 1.1) return s;
    return null; // 어떤 단위로도 설명 안 됨
  };
  const usdScale = snap(median(usdRatios));
  const kgScale = snap(median(kgRatios));
  if (usdScale === null) return { trusted: false, overlap: usdRatios.length, reason: `usd ratio median=${median(usdRatios)?.toFixed(4)}` };
  const scaleU = usdScale, scaleK = kgScale === null ? 1 : kgScale;
  // 스케일 적용 후 월별 일치율
  let ok = 0;
  for (const [ym, v] of fetched) {
    if (!(v.usd > 0) || !exUsd.has(ym)) continue;
    if (Math.abs(v.usd * scaleU / exUsd.get(ym) - 1) <= 0.03) ok++;
  }
  const agree = usdRatios.length ? ok / usdRatios.length : 0;
  return { trusted: usdRatios.length >= 6 && agree >= 0.8, overlap: usdRatios.length, agree, usdScale: scaleU, kgScale: scaleK };
}

const report = { updated: new Date().toISOString(), items: {} };
let quotaHit = false;

for (const spec of config.items) {
  if (ONLY && !ONLY.has(spec.name)) continue;
  const cur = byName.get(spec.name);
  const rows = cur ? cur.rows : [];
  if (spec.type === "item" && !spec.hs) {
    report.items[spec.name] = { status: "no-hs", note: "HS코드 미지정 — 기존 데이터 유지" };
    continue;
  }
  if (quotaHit) { report.items[spec.name] = { status: "skipped-quota" }; continue; }

  const earliest = rows[0]?.[0]?.replace("-", "") || "999999";
  let start = FORCE_START || (earliest > CONFIG_START ? CONFIG_START : yymmMinus(nowYm, 14));
  try {
    const fetched = await fetchItem(spec, start);
    if (!fetched.size) { report.items[spec.name] = { status: "empty" }; continue; }
    const cal = calibrate(fetched, rows);
    if (!cal.trusted && cal.overlap > 0) {
      report.items[spec.name] = { status: "mismatch", ...cal, note: "API 값이 기존 값과 달라 기존 데이터 유지 — HS/국가 설정 확인 필요" };
      continue;
    }
    // overlap 0 (기존 데이터 없음)이면 스케일 1로 그대로 수용
    const scaleU = cal.usdScale ?? 1, scaleK = cal.kgScale ?? 1;
    const krwByYm = new Map(rows.filter((r) => r[2]).map((r) => [r[0], r[2]]));
    const merged = new Map(rows.map((r) => [r[0], r]));
    for (const [ym, v] of [...fetched.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (!(v.usd > 0)) continue;
      merged.set(ym, [ym, v.usd * scaleU, krwByYm.get(ym) ?? null, v.wgt > 0 ? v.wgt * scaleK : null]);
    }
    const out = [...merged.values()].sort((a, b) => a[0].localeCompare(b[0]));
    if (cur) cur.rows = out;
    else data.items.push({ name: spec.name, hs: spec.hs, companies: spec.companies, rows: out });
    report.items[spec.name] = { status: "ok", months: out.length, from: out[0][0], to: out[out.length - 1][0], overlap: cal.overlap, agree: cal.agree, usdScale: scaleU, kgScale: scaleK };
    console.log(`ok ${spec.name}: ${out[0][0]}~${out[out.length - 1][0]} (${out.length}개월, 일치율 ${cal.agree === undefined ? "-" : Math.round((cal.agree || 0) * 100) + "%"})`);
  } catch (e) {
    if (e instanceof ApiError && e.fatal) {
      quotaHit = true;
      report.items[spec.name] = { status: "quota", error: String(e.message) };
      console.error(`쿼터/정책 오류 — 이후 품목 중단: ${e.message}`);
    } else {
      report.items[spec.name] = { status: "error", error: String(e.message || e) };
      console.error(`err ${spec.name}: ${e.message || e}`);
    }
  }
}

function yymmMinus(yymm, months) {
  const t = +yymm.slice(0, 4) * 12 + (+yymm.slice(4, 6) - 1) - months;
  return `${Math.floor(t / 12)}${String((t % 12) + 1).padStart(2, "0")}`;
}

const counts = {};
for (const r of Object.values(report.items)) counts[r.status] = (counts[r.status] || 0) + 1;
report.summary = counts;
console.log("요약:", JSON.stringify(counts));

if (!DRY) {
  data.updated = new Date().toISOString().slice(0, 10);
  data.source = "관세청 수출입무역통계 (data.go.kr API)" + (data.source && !data.source.includes("data.go.kr") ? ` + ${data.source}` : "");
  fs.writeFileSync(dataPath, JSON.stringify(data), "utf8");
  fs.writeFileSync(path.join(ROOT, "data", "exports-report.json"), JSON.stringify(report, null, 1), "utf8");
  console.log("data/exports.json 갱신 완료");
}
