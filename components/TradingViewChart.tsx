"use client";
import { useEffect, useRef } from "react";

export default function TradingViewChart({ symbol = "KRX:005930", height = 480 }: { symbol?: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const inner = document.createElement("div");
    inner.style.height = "100%";
    el.appendChild(inner);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol,
      interval: "D",
      timezone: "Asia/Seoul",
      theme: "light",
      style: "1",
      locale: "kr",
      autosize: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      backgroundColor: "#FFFFFF",
    });
    inner.appendChild(s);
  }, [symbol]);
  return <div ref={ref} style={{ height }} />;
}
