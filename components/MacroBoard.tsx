"use client";
import { useEffect, useRef } from "react";

function Mini({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol, width: "100%", height: "100%", locale: "kr", dateRange: "3M",
      colorTheme: "light", isTransparent: true, autosize: true,
    });
    el.appendChild(s);
  }, [symbol]);
  return <div ref={ref} style={{ height: 130 }} />;
}

const GROUPS: { title: string; items: { label: string; sym: string }[] }[] = [
  { title: "지수", items: [
    { label: "미국 S&P500", sym: "FOREXCOM:SPXUSD" },
    { label: "중국 상하이", sym: "TVC:SHCOMP" },
    { label: "일본 닛케이", sym: "TVC:NI225" },
  ]},
  { title: "금리 (미국채)", items: [
    { label: "2년", sym: "TVC:US02Y" },
    { label: "10년", sym: "TVC:US10Y" },
    { label: "30년", sym: "TVC:US30Y" },
  ]},
  { title: "금속·에너지", items: [
    { label: "금", sym: "TVC:GOLD" },
    { label: "은", sym: "TVC:SILVER" },
    { label: "구리", sym: "COMEX:HG1!" },
    { label: "WTI 유가", sym: "TVC:USOIL" },
    { label: "알루미늄", sym: "COMEX:ALI1!" },
  ]},
  { title: "농산물·테마", items: [
    { label: "농산물(식료품)", sym: "AMEX:DBA" },
    { label: "태양광(TAN)", sym: "AMEX:TAN" },
  ]},
  { title: "코인", items: [
    { label: "비트코인", sym: "BINANCE:BTCUSDT" },
    { label: "이더리움", sym: "BINANCE:ETHUSDT" },
  ]},
];

export default function MacroBoard() {
  return (
    <div className="space-y-6">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <div className="text-xs font-semibold text-[var(--muted)] mb-2">{g.title}</div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {g.items.map((it) => (
              <div key={it.sym} className="glass rounded-2xl overflow-hidden">
                <div className="text-[11px] font-medium px-3 pt-2 text-[var(--text)]">{it.label}</div>
                <Mini symbol={it.sym} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="text-[11px] text-[var(--muted)]">실시간 시세(TradingView). 일부 심볼(알루미늄·구리 선물 등)은 거래소에 따라 안 보일 수 있어요. 태양광 모듈가격은 공개 차트가 없어 태양광 ETF(TAN)로 대체.</div>
    </div>
  );
}
