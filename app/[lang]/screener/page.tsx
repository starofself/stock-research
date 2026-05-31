import { getScreener, getMarketThemes } from "@/lib/content";
import ScreenerView from "@/components/ScreenerView";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function ScreenerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const s = getScreener();
  const mt = getMarketThemes();
  const ann = (rows: typeof s.high) => rows.map((r) => ({ ...r, themes: (mt.stockThemes[r.code] || []).slice(0, 8) }));
  const t = loc === "en"
    ? { title: "New Highs · Volume · Leading Themes", desc: "All KOSPI/KOSDAQ · 60-day new highs / 60-day peak volume → which theme is leading · auto 10pm KST weekdays" }
    : { title: "신고가 · 거래량 · 주도테마", desc: "코스피·코스닥 전체 · 60일 신고가 / 60일 최대거래량 → 어느 테마가 주도하는지 · 평일 밤 10시 자동" };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{t.desc}</p>
      </div>
      <ScreenerView high={ann(s.high)} volume={ann(s.volume)} updated={s.updated} />
    </div>
  );
}
