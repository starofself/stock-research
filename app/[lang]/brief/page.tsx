import StockBrief from "@/components/StockBrief";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function BriefPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const h = loc === "en"
    ? { title: "Stock Brief", desc: "Search a stock → AI synthesizes my research, Naver blog, and latest news" }
    : { title: "종목 브리핑", desc: "종목 검색 → 내 리서치 · 네이버 블로그 · 최신 뉴스를 AI가 종합 요약" };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{h.desc}</p>
      </div>
      <StockBrief />
    </div>
  );
}
