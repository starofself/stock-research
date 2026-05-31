import { getMarketThemes } from "@/lib/content";
import ThemeBrowser from "@/components/ThemeBrowser";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Sectors({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const t = getMarketThemes();
  const h = loc === "en"
    ? { title: "Stocks by Theme", desc: "All stocks indexed by Naver theme · click a theme for its constituents" }
    : { title: "테마별 종목", desc: "네이버 테마 기준 전 종목 인덱싱 · 테마 클릭 시 구성종목" };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{h.desc}</p>
      </div>
      <ThemeBrowser themes={t.themes} updated={t.updated} />
    </div>
  );
}
