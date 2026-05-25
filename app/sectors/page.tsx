import { getMarketThemes } from "@/lib/content";
import ThemeBrowser from "@/components/ThemeBrowser";

export const dynamic = "force-dynamic";

export default function Sectors() {
  const t = getMarketThemes();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">테마별 종목</h1>
        <p className="text-sm text-[var(--muted)] mt-1">네이버 테마 기준 전 종목 인덱싱 · 테마 클릭 시 구성종목</p>
      </div>
      <ThemeBrowser themes={t.themes} updated={t.updated} />
    </div>
  );
}
