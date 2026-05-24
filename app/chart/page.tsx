"use client";
import { useState } from "react";
import { watchlist } from "@/lib/mock";
import TradingViewChart from "@/components/TradingViewChart";

export default function ChartPage() {
  const [sym, setSym] = useState(watchlist[0].ticker);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">차트</h1>
        <p className="text-sm text-[var(--muted)] mt-1">TradingView 실시간 차트 · 관심종목 (API 키 불필요)</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {watchlist.map((w) => (
          <button key={w.ticker} onClick={() => setSym(w.ticker)}
            className={`text-sm px-3.5 py-1.5 rounded-3xl border transition ${sym === w.ticker ? "bg-[var(--soft)] text-[var(--text)] border-[var(--border)]" : "text-[var(--muted)] border-transparent hover:bg-[var(--soft)]"}`}>
            {w.name} <span className="mono text-xs">{w.ticker}</span>
          </button>
        ))}
      </div>
      <div className="glass rounded-3xl p-2 overflow-hidden">
        <TradingViewChart symbol={`KRX:${sym}`} key={sym} />
      </div>
      <p className="text-xs text-[var(--muted)]">※ TradingView 무료 임베드 위젯. KRX 종목코드 기준. 데이터 출처: TradingView.</p>
    </div>
  );
}
