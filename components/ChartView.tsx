"use client";
import { useState } from "react";
import TradingViewChart from "@/components/TradingViewChart";

type Stock = { ticker: string; name: string };

function toSymbol(input: string): string {
  const s = input.trim();
  if (!s) return "KRX:005930";
  if (s.includes(":")) return s.toUpperCase();
  if (/^\d{6}$/.test(s)) return "KRX:" + s;
  return "KRX:" + s;
}

export default function ChartView({ stocks }: { stocks: Stock[] }) {
  const [symbol, setSymbol] = useState(stocks[0] ? "KRX:" + stocks[0].ticker : "KRX:005930");
  const [input, setInput] = useState("");
  return (
    <div className="space-y-5">
      <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) setSymbol(toSymbol(input)); }} className="flex gap-2 max-w-xl">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="종목코드(예: 005930) 또는 KRX:035720 · NASDAQ:AAPL" className="flex-1 h-10 px-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm outline-none text-[var(--text)] placeholder:text-[var(--muted)]" />
        <button className="px-4 h-10 rounded-xl bg-[var(--ink)] text-white text-sm font-medium">조회</button>
      </form>
      <div className="flex flex-wrap gap-2">
        {stocks.map((s) => (
          <button key={s.ticker + s.name} onClick={() => setSymbol("KRX:" + s.ticker)} className={`text-xs px-3 py-1.5 rounded-full border transition ${symbol === "KRX:" + s.ticker ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>
            {s.name} <span className="mono">{s.ticker}</span>
          </button>
        ))}
      </div>
      <div className="text-xs text-[var(--muted)]">현재 심볼: <span className="mono">{symbol}</span> · TradingView에 없는 종목(상장폐지·일부 소형주)은 안 나올 수 있어요. 차트 안에서 직접 심볼 변경도 가능합니다.</div>
      <div className="glass rounded-3xl p-2 overflow-hidden">
        <TradingViewChart symbol={symbol} key={symbol} />
      </div>
    </div>
  );
}
