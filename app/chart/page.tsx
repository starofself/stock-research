import { getStocks } from "@/lib/content";
import ChartView from "@/components/ChartView";

export const dynamic = "force-dynamic";

export default function ChartPage() {
  const stocks = getStocks().map((s) => ({ ticker: s.ticker, name: s.name })).filter((s) => s.ticker);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">차트</h1>
        <p className="text-sm text-[var(--muted)] mt-1">TradingView 실시간 차트 · 종목 검색/선택 (KRX 기준)</p>
      </div>
      <ChartView stocks={stocks} />
    </div>
  );
}
