import StockBrief from "@/components/StockBrief";

export const dynamic = "force-dynamic";

export default function BriefPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">종목 브리핑</h1>
        <p className="text-sm text-[var(--muted)] mt-1">종목 검색 → 내 리서치 · 네이버 블로그 · 최신 뉴스를 AI가 종합 요약</p>
      </div>
      <StockBrief />
    </div>
  );
}
