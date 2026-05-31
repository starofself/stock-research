import { getStocks } from "@/lib/content";
import ChartView from "@/components/ChartView";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function ChartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const stocks = getStocks().map((s) => ({ ticker: s.ticker, name: s.name })).filter((s) => s.ticker);
  const h = loc === "en"
    ? { title: "Chart", desc: "TradingView live charts · search/select a stock (KRX)" }
    : { title: "차트", desc: "TradingView 실시간 차트 · 종목 검색/선택 (KRX 기준)" };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{h.desc}</p>
      </div>
      <ChartView stocks={stocks} />
    </div>
  );
}
