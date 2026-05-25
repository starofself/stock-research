"use client";
import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, type IChartApi } from "lightweight-charts";

type Candle = { time: string; open: number; high: number; low: number; close: number; volume: number };

export default function StockChart({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState("불러오는 중…");
  useEffect(() => {
    let chart: IChartApi | null = null;
    let alive = true;
    (async () => {
      const el = ref.current;
      if (!el) return;
      setMsg("불러오는 중…");
      let candles: Candle[] = [];
      try {
        const res = await fetch(`/api/ohlcv?code=${code}`);
        candles = (await res.json()).candles || [];
      } catch { candles = []; }
      if (!alive) return;
      if (candles.length === 0) { setMsg("시세 데이터가 없습니다."); return; }
      setMsg("");
      el.innerHTML = "";
      chart = createChart(el, { autoSize: true, height: 460, layout: { background: { type: ColorType.Solid, color: "#FFFFFF" }, textColor: "#333" }, grid: { vertLines: { color: "#EEE" }, horzLines: { color: "#EEE" } }, rightPriceScale: { borderColor: "#E6E7EC" }, timeScale: { borderColor: "#E6E7EC" } });
      const cs = chart.addCandlestickSeries({ upColor: "#E5342B", downColor: "#1E66F0", borderUpColor: "#E5342B", borderDownColor: "#1E66F0", wickUpColor: "#E5342B", wickDownColor: "#1E66F0" });
      cs.setData(candles.map((c) => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close })));
      const vol = chart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "vol" });
      chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
      vol.setData(candles.map((c) => ({ time: c.time, value: c.volume, color: c.close >= c.open ? "rgba(229,52,43,0.4)" : "rgba(30,102,240,0.4)" })));
      chart.timeScale().fitContent();
    })();
    return () => { alive = false; if (chart) chart.remove(); };
  }, [code]);
  return (
    <div className="relative">
      <div ref={ref} style={{ width: "100%", height: 460 }} />
      {msg && <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--muted)] pointer-events-none">{msg}</div>}
    </div>
  );
}
