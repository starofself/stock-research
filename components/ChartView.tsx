"use client";
import { useState } from "react";
import StockChart from "@/components/StockChart";
import TradingViewChart from "@/components/TradingViewChart";

type Stock = { ticker: string; name: string };

export default function ChartView({ stocks }: { stocks: Stock[] }) {
  const [code, setCode] = useState(stocks[0]?.ticker || "005930");
  const [tv, setTv] = useState("");
  const [input, setInput] = useState("");
  function go() {
    const s = input.trim();
    if (!s) return;
    if (/^\d{6}$/.test(s)) { setCode(s); setTv(""); }
    else if (s.includes(":")) setTv(s.toUpperCase());
  }
  return (
    <div className="space-y-5">
      <form onSubmit={(e) => { e.preventDefault(); go(); }} className="flex gap-2 max-w-xl">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="종목코드 6자리(예: 005930) · 해외는 NASDAQ:AAPL" className="flex-1 h-10 px-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm outline-none text-[var(--text)] placeholder:text-[var(--muted)]" />
        <button className="px-4 h-10 rounded-xl bg-[var(--ink)] text-white text-sm font-medium">조회</button>
      </form>
      <div className="flex flex-wrap gap-2">
        {stocks.map((s) => (
          <button key={s.ticker + s.name} onClick={() => { setCode(s.ticker); setTv(""); }} className={`text-xs px-3 py-1.5 rounded-full border transition ${!tv && code === s.ticker ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>
            {s.name} <span className="mono">{s.ticker}</span>
          </button>
        ))}
      </div>
      <div className="glass rounded-3xl p-2 overflow-hidden">
        {tv ? <TradingViewChart symbol={tv} key={tv} /> : <StockChart code={code} key={code} />}
      </div>
      <div className="text-xs text-[var(--muted)]">한국 종목 = 네이버 시세 기반 직접 캔들차트(빨강 상승·파랑 하락). 해외는 NASDAQ:AAPL 형식 입력 시 TradingView.</div>
    </div>
  );
}
