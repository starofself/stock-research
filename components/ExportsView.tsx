"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createChart, ColorType, type IChartApi } from "lightweight-charts";
import { Download, Search, X } from "lucide-react";

// [년월(YYYY-MM), 금액(달러), 금액(원화), 중량(kg)]
type Row = [string, number | null, number | null, number | null];
type Item = { name: string; hs: string | null; companies: string | null; rows: Row[] };
type Meta = { name: string; hs: string | null; companies: string | null; from: string; to: string };

type Metric = "usd" | "yoy" | "price" | "kg";
type Range = "all" | "36" | "12";

const PINNED = ["총수출", "디램", "HBM", "낸드", "자동차", "미국", "중국", "라면", "김", "화장품미백", "임플란트", "미용기기(합)", "변압기 + 미국", "전선(미국)", "선박", "바이오시밀러"];

const UP = "#E5342B";
const DOWN = "#1E66F0";
const BAR = "rgba(30,102,240,0.78)";
const BAR_PARTIAL = "rgba(30,102,240,0.30)";
const INK = "#0B0B0F";

const nfUsd = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
const nfFull = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nfPrice = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function pct(v: number | null | undefined): string {
  if (v === null || v === undefined || !isFinite(v)) return "-";
  return `${v > 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
}
function pctCls(v: number | null | undefined): string {
  if (v === null || v === undefined || !isFinite(v)) return "text-[var(--muted)]";
  return v > 0 ? "text-[var(--up)]" : v < 0 ? "text-[var(--down)]" : "text-[var(--muted)]";
}
function ymLabel(ym: string): string {
  return `${ym.slice(0, 4)}.${ym.slice(5, 7)}`;
}
function currentYm(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

type Point = { ym: string; usd: number | null; krw: number | null; kg: number | null; price: number | null; mom: number | null; yoy: number | null; priceYoy: number | null; partial: boolean };

function buildPoints(rows: Row[]): Point[] {
  const nowYm = currentYm();
  const byYm = new Map<string, Row>();
  rows.forEach((r) => byYm.set(r[0], r));
  const sorted = [...rows].sort((a, b) => a[0].localeCompare(b[0]));
  const prevYm = (ym: string, back: number) => {
    const y = +ym.slice(0, 4), m = +ym.slice(5, 7);
    const t = y * 12 + (m - 1) - back;
    return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
  };
  const ratio = (a: number | null | undefined, b: number | null | undefined) => (a != null && b != null && b !== 0 ? a / b - 1 : null);
  return sorted.map((r) => {
    const [ym, usd, krw, kg] = r;
    const partial = ym >= nowYm; // 진행 중인 달 = 10일 단위 잠정 누계
    const m1 = byYm.get(prevYm(ym, 1));
    const m12 = byYm.get(prevYm(ym, 12));
    const price = usd != null && kg != null && kg > 0 ? usd / kg : null;
    const p12 = m12 && m12[1] != null && m12[3] != null && m12[3] > 0 ? m12[1] / m12[3] : null;
    return {
      ym, usd, krw, kg, price,
      mom: partial ? null : ratio(usd, m1?.[1]),
      yoy: partial ? null : ratio(usd, m12?.[1]),
      priceYoy: partial ? null : ratio(price, p12),
      partial,
    };
  });
}

const METRICS: { key: Metric; label: string; desc: string }[] = [
  { key: "usd", label: "수출액 ($)", desc: "월별 수출금액 (달러)" },
  { key: "yoy", label: "YoY %", desc: "전년 동월 대비 증감률" },
  { key: "price", label: "판가 ($/kg)", desc: "수출단가 = 금액 ÷ 중량" },
  { key: "kg", label: "중량 (kg)", desc: "월별 수출중량" },
];

function ExportChart({ points, metric }: { points: Point[]; metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const isPct = metric === "yoy";
    const chart: IChartApi = createChart(el, {
      autoSize: true,
      height: 380,
      layout: { background: { type: ColorType.Solid, color: "#FFFFFF" }, textColor: "#333" },
      grid: { vertLines: { color: "#F1F2F6" }, horzLines: { color: "#F1F2F6" } },
      rightPriceScale: { borderColor: "#E6E7EC" },
      timeScale: { borderColor: "#E6E7EC" },
      localization: {
        priceFormatter: (v: number) => (isPct ? `${(v * 100).toFixed(0)}%` : nfUsd.format(v)),
      },
    });
    const data = points
      .map((p) => {
        const v = metric === "usd" ? p.usd : metric === "yoy" ? p.yoy : metric === "price" ? p.price : p.kg;
        return v === null || v === undefined ? null : { time: `${p.ym}-01`, value: v, partial: p.partial };
      })
      .filter((d): d is { time: string; value: number; partial: boolean } => d !== null);
    if (metric === "price") {
      const line = chart.addLineSeries({ color: INK, lineWidth: 2, priceLineVisible: false });
      line.setData(data.map((d) => ({ time: d.time, value: d.value })));
    } else {
      const hist = chart.addHistogramSeries({ priceFormat: { type: "volume" }, priceLineVisible: false });
      hist.setData(data.map((d) => ({
        time: d.time,
        value: d.value,
        color: metric === "yoy" ? (d.value >= 0 ? UP : DOWN) : d.partial ? BAR_PARTIAL : BAR,
      })));
    }
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [points, metric]);
  return <div ref={ref} style={{ width: "100%", height: 380 }} />;
}

function toCsv(item: Item): string {
  const pts = buildPoints(item.rows);
  const head = "년월,수출금액(달러),금액(원화),중량(kg),판가(달러/kg),MoM,YoY,판가YoY,비고";
  const lines = pts.map((p) =>
    [p.ym, p.usd ?? "", p.krw ?? "", p.kg ?? "", p.price != null ? p.price.toFixed(4) : "", p.mom != null ? (p.mom * 100).toFixed(2) + "%" : "", p.yoy != null ? (p.yoy * 100).toFixed(2) + "%" : "", p.priceYoy != null ? (p.priceYoy * 100).toFixed(2) + "%" : "", p.partial ? "잠정" : ""].join(","),
  );
  return "﻿" + [head, ...lines].join("\n");
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sheetName(name: string, used: Set<string>): string {
  let s = name.replace(/[\\/?*[\]:]/g, " ").trim().slice(0, 28) || "item";
  let out = s, i = 2;
  while (used.has(out)) out = `${s}(${i++})`;
  used.add(out);
  return out;
}

function itemAoA(item: Item): (string | number | null)[][] {
  const pts = buildPoints(item.rows);
  return [
    ["년월", "수출금액(달러)", "금액(원화)", "중량(kg)", "판가(달러/kg)", "MoM", "YoY", "판가YoY", "비고"],
    ...pts.map((p) => [p.ym, p.usd, p.krw, p.kg, p.price, p.mom, p.yoy, p.priceYoy, p.partial ? "잠정" : ""]),
  ];
}

async function downloadXlsx(items: Item[], filename: string) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  if (items.length > 1) {
    const idx = [["품목", "HS코드", "관련 종목", "기간"], ...items.map((it) => {
      const pts = it.rows;
      return [it.name, it.hs || "", it.companies || "", pts.length ? `${pts[0][0]} ~ ${pts[pts.length - 1][0]}` : ""];
    })];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(idx), "목차");
  }
  const used = new Set<string>(["목차"]);
  for (const it of items) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itemAoA(it)), sheetName(it.name, used));
  }
  XLSX.writeFile(wb, filename);
}

export default function ExportsView({ meta, initial, source }: { meta: Meta[]; initial: Item; source: string }) {
  const [cache, setCache] = useState<Record<string, Item>>({ [initial.name]: initial });
  const [all, setAll] = useState<Item[] | null>(null);
  const [selected, setSelected] = useState(initial.name);
  const [metric, setMetric] = useState<Metric>("usd");
  const [range, setRange] = useState<Range>("36");
  const [q, setQ] = useState("");
  const [browse, setBrowse] = useState(false);
  const [busy, setBusy] = useState(false);

  // 전체 데이터는 백그라운드에서 1회 로드 (품목 전환·엑셀 추출용)
  useEffect(() => {
    let alive = true;
    fetch("/api/exports")
      .then((r) => r.json())
      .then((d: { items: Item[] }) => {
        if (!alive || !Array.isArray(d.items)) return;
        setAll(d.items);
        setCache((c) => {
          const next = { ...c };
          d.items.forEach((it) => { next[it.name] = it; });
          return next;
        });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const item = cache[selected];
  const points = useMemo(() => (item ? buildPoints(item.rows) : []), [item]);
  const shown = useMemo(() => (range === "all" ? points : points.slice(-(+range))), [points, range]);

  const latestFull = [...points].reverse().find((p) => !p.partial);
  const latestPartial = points.length && points[points.length - 1].partial ? points[points.length - 1] : null;
  const selMeta = meta.find((m) => m.name === selected);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return meta;
    return meta.filter((m) => m.name.toLowerCase().includes(s) || (m.hs || "").includes(s) || (m.companies || "").toLowerCase().includes(s));
  }, [meta, q]);
  const pinned = useMemo(() => PINNED.filter((p) => meta.some((m) => m.name === p)), [meta]);
  const listOpen = browse || q.trim().length > 0;

  function select(name: string) {
    setSelected(name);
    setQ("");
    setBrowse(false);
  }

  async function exportAll() {
    if (!all) return;
    setBusy(true);
    try { await downloadXlsx(all, `주요품목_수출_전체_${new Date().toISOString().slice(0, 10)}.xlsx`); } finally { setBusy(false); }
  }
  async function exportOne() {
    if (!item) return;
    setBusy(true);
    try { await downloadXlsx([item], `수출_${selected.replace(/[\\/?*[\]:]/g, " ")}_${new Date().toISOString().slice(0, 10)}.xlsx`); } finally { setBusy(false); }
  }
  function exportCsv() {
    if (!item) return;
    download(new Blob([toCsv(item)], { type: "text/csv;charset=utf-8" }), `수출_${selected.replace(/[\\/?*[\]:]/g, " ")}_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  const chip = (on: boolean) => `text-xs px-3 py-1.5 rounded-full border transition ${on ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`;
  const tabBtn = (on: boolean) => `text-sm px-3.5 py-2 rounded-xl border transition ${on ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`;

  return (
    <div className="space-y-5">
      {/* 품목 선택 */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`품목 · HS코드 · 종목 검색 (${meta.length}개)`}
              className="w-full text-sm pl-9 pr-8 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] outline-none focus:border-[#B9BDC9]"
            />
            {q && <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"><X size={14} /></button>}
          </div>
          <button onClick={() => setBrowse(!browse)} className={chip(browse)}>전체 품목 {browse ? "닫기" : "보기"}</button>
        </div>
        {!listOpen && (
          <div className="flex flex-wrap gap-2">
            {pinned.map((p) => (
              <button key={p} onClick={() => select(p)} className={chip(selected === p)}>{p}</button>
            ))}
            {!pinned.includes(selected) && <button className={chip(true)}>{selected}</button>}
          </div>
        )}
        {listOpen && (
          <div className="max-h-72 overflow-y-auto rounded-xl border border-[var(--border)]">
            {filtered.length === 0 && <div className="p-4 text-sm text-[var(--muted)]">검색 결과가 없습니다.</div>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <button key={m.name} onClick={() => select(m.name)}
                  className={`text-left px-3.5 py-2.5 border-b border-r border-[var(--border)] transition hover:bg-[var(--soft)] ${selected === m.name ? "bg-[var(--soft)]" : ""}`}>
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate">{[m.hs, m.companies].filter(Boolean).join(" · ") || " "}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 선택 품목 헤더 + 다운로드 */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-semibold tracking-tight">{selected}</h2>
            {selMeta?.hs && <span className="text-xs mono px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)]">HS {selMeta.hs}</span>}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">
            {selMeta?.companies && <>관련: {selMeta.companies} · </>}
            기간 {selMeta ? `${ymLabel(selMeta.from)} ~ ${ymLabel(selMeta.to)}` : "-"}
          </div>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button onClick={exportCsv} disabled={!item} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--soft)] transition disabled:opacity-50"><Download size={13} />CSV</button>
          <button onClick={exportOne} disabled={!item || busy} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--soft)] transition disabled:opacity-50"><Download size={13} />엑셀 (현재 품목)</button>
          <button onClick={exportAll} disabled={!all || busy} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-[var(--ink)] text-white transition disabled:opacity-50"><Download size={13} />{all ? "엑셀 (전체 품목)" : "전체 데이터 로딩 중…"}</button>
        </div>
      </div>

      {/* 스탯 타일 */}
      {latestFull && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass rounded-2xl p-4">
            <div className="text-[11px] text-[var(--muted)]">{ymLabel(latestFull.ym)} 수출액</div>
            <div className="text-lg font-semibold mono mt-0.5">${latestFull.usd != null ? nfUsd.format(latestFull.usd) : "-"}</div>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="text-[11px] text-[var(--muted)]">전년 동월 대비 (YoY)</div>
            <div className={`text-lg font-semibold mono mt-0.5 ${pctCls(latestFull.yoy)}`}>{pct(latestFull.yoy)}</div>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="text-[11px] text-[var(--muted)]">전월 대비 (MoM)</div>
            <div className={`text-lg font-semibold mono mt-0.5 ${pctCls(latestFull.mom)}`}>{pct(latestFull.mom)}</div>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="text-[11px] text-[var(--muted)]">판가 YoY ($/kg)</div>
            <div className={`text-lg font-semibold mono mt-0.5 ${pctCls(latestFull.priceYoy)}`}>{pct(latestFull.priceYoy)}</div>
          </div>
        </div>
      )}
      {latestPartial && latestPartial.usd != null && (
        <div className="text-xs text-[var(--muted)] -mt-2">
          {ymLabel(latestPartial.ym)} 잠정 누계(10일 단위 발표 반영): <b className="mono text-[var(--text)]">${nfUsd.format(latestPartial.usd)}</b> — 월간 확정 전이라 증감률 계산에서 제외
        </div>
      )}

      {/* 차트 */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {METRICS.map((m) => (
              <button key={m.key} onClick={() => setMetric(m.key)} className={tabBtn(metric === m.key)}>{m.label}</button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            {(["12", "36", "all"] as Range[]).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={chip(range === r)}>{r === "all" ? "전체" : `${+r / 12}년`}</button>
            ))}
          </div>
        </div>
        <div className="text-xs text-[var(--muted)]">{METRICS.find((m) => m.key === metric)?.desc}{metric === "usd" && latestPartial ? " · 옅은 막대 = 진행 중인 달(잠정)" : ""}</div>
        {item ? <ExportChart points={shown} metric={metric} /> : <div className="h-[380px] flex items-center justify-center text-sm text-[var(--muted)]">불러오는 중…</div>}
      </div>

      {/* 월별 테이블 */}
      <div className="glass rounded-2xl p-4">
        <div className="text-sm font-semibold mb-3">월별 상세 <span className="text-xs font-normal text-[var(--muted)]">· 최근 36개월</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="text-[11px] text-[var(--muted)] border-b border-[var(--border)]">
                <th className="text-left py-2 pr-3 font-medium">년월</th>
                <th className="text-right py-2 px-3 font-medium">수출액 ($)</th>
                <th className="text-right py-2 px-3 font-medium">MoM</th>
                <th className="text-right py-2 px-3 font-medium">YoY</th>
                <th className="text-right py-2 px-3 font-medium">중량 (kg)</th>
                <th className="text-right py-2 px-3 font-medium">판가 ($/kg)</th>
                <th className="text-right py-2 pl-3 font-medium">판가 YoY</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().slice(0, 36).map((p) => (
                <tr key={p.ym} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-1.5 pr-3 mono">{ymLabel(p.ym)}{p.partial && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)]">잠정</span>}</td>
                  <td className="py-1.5 px-3 mono text-right">{p.usd != null ? nfFull.format(p.usd) : "-"}</td>
                  <td className={`py-1.5 px-3 mono text-right ${pctCls(p.mom)}`}>{pct(p.mom)}</td>
                  <td className={`py-1.5 px-3 mono text-right ${pctCls(p.yoy)}`}>{pct(p.yoy)}</td>
                  <td className="py-1.5 px-3 mono text-right">{p.kg != null ? nfFull.format(p.kg) : "-"}</td>
                  <td className="py-1.5 px-3 mono text-right">{p.price != null ? nfPrice.format(p.price) : "-"}</td>
                  <td className={`py-1.5 pl-3 mono text-right ${pctCls(p.priceYoy)}`}>{pct(p.priceYoy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-[var(--muted)] leading-relaxed">
        관세청 수출입 잠정치는 매월 <b>1일·11일·21일</b>(직전 10일 단위 누계)에 발표되고, 월간 실적은 <b>다음 달 15일경</b> 확정됩니다.
        {source && <> · 원본: {source}</>}
      </div>
    </div>
  );
}
