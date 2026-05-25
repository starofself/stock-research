"use client";
import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

type Row = { code: string; name: string; market: string; close: number; change: number; volume: number; themes?: string[] };

function leaders(rows: Row[]) {
  const m = new Map<string, Row[]>();
  rows.forEach((r) => (r.themes || []).forEach((t) => {
    if (!m.has(t)) m.set(t, []);
    m.get(t)!.push(r);
  }));
  return [...m.entries()].map(([name, rs]) => ({ name, count: rs.length })).sort((a, b) => b.count - a.count);
}

export default function ScreenerView({ high, volume, updated }: { high: Row[]; volume: Row[]; updated: string }) {
  const [tab, setTab] = useState<"high" | "vol">("high");
  const [theme, setTheme] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const rows = tab === "high" ? high : volume;
  const lead = useMemo(() => leaders(rows).slice(0, 16), [rows]);
  const shown = useMemo(() => (theme ? rows.filter((r) => (r.themes || []).includes(theme)) : rows), [rows, theme]);

  function switchTab(t: "high" | "vol") { setTab(t); setTheme(null); }
  async function refresh() { setBusy(true); try { await fetch("/api/refresh", { method: "POST" }); } catch {} setTimeout(() => location.reload(), 1200); }
  const chip = (on: boolean) => `text-xs px-3 py-1.5 rounded-full border transition ${on ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button onClick={() => switchTab("high")} className={`text-sm px-4 py-2 rounded-xl border transition ${tab === "high" ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>60일 신고가 ({high.length})</button>
          <button onClick={() => switchTab("vol")} className={`text-sm px-4 py-2 rounded-xl border transition ${tab === "vol" ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>60일 최대거래량 ({volume.length})</button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">업데이트: {updated ? updated.replace("T", " ") : "-"}</span>
          <button onClick={refresh} disabled={busy} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl bg-[var(--ink)] text-white disabled:opacity-50"><RefreshCw size={14} className={busy ? "animate-spin" : ""} />업데이트</button>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">주도 테마 <span className="text-xs font-normal text-[var(--muted)]">· {tab === "high" ? "신고가" : "거래량"} 종목이 속한 테마 (종목수 순)</span></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTheme(null)} className={chip(!theme)}>전체 {rows.length}</button>
          {lead.map((l) => (
            <button key={l.name} onClick={() => setTheme(theme === l.name ? null : l.name)} className={chip(theme === l.name)}>{l.name} <b className="ml-0.5">{l.count}</b></button>
          ))}
          {lead.length === 0 && <span className="text-xs text-[var(--muted)]">테마 매핑 데이터 준비 중</span>}
        </div>
      </div>

      <div className="text-xs text-[var(--muted)]">{shown.length}개 표시{theme ? ` · 테마: ${theme}` : ""}</div>
      <div className="glass rounded-3xl p-0 overflow-hidden">
        {shown.length === 0 ? <div className="text-sm text-[var(--muted)] p-8 text-center">데이터 없음 (장 마감 후 밤 10시 업데이트)</div> : (
          <table className="w-full text-sm">
            <thead className="text-xs text-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left font-medium p-3">종목 / 테마</th>
                <th className="text-right font-medium p-3">현재가</th>
                <th className="text-right font-medium p-3">등락</th>
                <th className="text-right font-medium p-3">거래량</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.code} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--soft)] transition align-top">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <a href={`https://finance.naver.com/item/main.naver?code=${r.code}`} target="_blank" rel="noreferrer" className="font-medium hover:underline">{r.name}</a>
                      <span className="text-[11px] mono text-[var(--muted)]">{r.code}</span>
                    </div>
                    {r.themes && r.themes.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">{r.themes.slice(0, 4).map((t) => (
                        <button key={t} onClick={() => setTheme(t)} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--text)]">{t}</button>
                      ))}</div>
                    )}
                  </td>
                  <td className="p-3 text-right mono whitespace-nowrap">{r.close.toLocaleString()}</td>
                  <td className={`p-3 text-right mono whitespace-nowrap ${r.change >= 0 ? "text-[#E5342B]" : "text-[#1E66F0]"}`}>{r.change >= 0 ? "+" : ""}{r.change}%</td>
                  <td className="p-3 text-right mono text-[var(--muted)] whitespace-nowrap">{r.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
