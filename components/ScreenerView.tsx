"use client";
import { useState } from "react";
import type { ScreenerRow } from "@/lib/content";
import { RefreshCw } from "lucide-react";

function Table({ rows, kind }: { rows: ScreenerRow[]; kind: "high" | "vol" }) {
  if (rows.length === 0) return <div className="text-sm text-[var(--muted)] p-8 text-center">데이터 없음 (장 마감 후 밤 10시 업데이트)</div>;
  return (
    <table className="w-full text-sm">
      <thead className="text-xs text-[var(--muted)] border-b border-[var(--border)]">
        <tr>
          <th className="text-left font-medium p-3">종목</th>
          <th className="text-left font-medium p-3 hidden sm:table-cell">시장</th>
          <th className="text-right font-medium p-3">현재가</th>
          <th className="text-right font-medium p-3">등락</th>
          <th className="text-right font-medium p-3">거래량</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.code} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--soft)] transition">
            <td className="p-3">
              <a href={`https://finance.naver.com/item/main.naver?code=${r.code}`} target="_blank" rel="noreferrer" className="font-medium hover:underline">{r.name}</a>
              <div className="text-xs mono text-[var(--muted)]">{r.code}</div>
            </td>
            <td className="p-3 hidden sm:table-cell text-[var(--muted)] text-xs">{r.market}</td>
            <td className="p-3 text-right mono">{r.close.toLocaleString()}</td>
            <td className={`p-3 text-right mono ${r.change >= 0 ? "text-[#E5342B]" : "text-[#1E66F0]"}`}>{r.change >= 0 ? "+" : ""}{r.change}%</td>
            <td className="p-3 text-right mono text-[var(--muted)]">{r.volume.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ScreenerView({ high, volume, updated }: { high: ScreenerRow[]; volume: ScreenerRow[]; updated: string }) {
  const [tab, setTab] = useState<"high" | "vol">("high");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    setBusy(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
    } catch {}
    setTimeout(() => location.reload(), 1200);
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button onClick={() => setTab("high")} className={`text-sm px-4 py-2 rounded-xl border transition ${tab === "high" ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>60일 신고가 ({high.length})</button>
          <button onClick={() => setTab("vol")} className={`text-sm px-4 py-2 rounded-xl border transition ${tab === "vol" ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>60일 최대거래량 ({volume.length})</button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">업데이트: {updated ? updated.replace("T", " ") : "-"}</span>
          <button onClick={refresh} disabled={busy} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl bg-[var(--ink)] text-white disabled:opacity-50">
            <RefreshCw size={14} className={busy ? "animate-spin" : ""} />업데이트
          </button>
        </div>
      </div>
      <div className="glass rounded-3xl p-0 overflow-hidden">
        <Table rows={tab === "high" ? high : volume} kind={tab} />
      </div>
    </div>
  );
}
