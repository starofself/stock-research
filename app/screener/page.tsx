import { getScreener, getMarketThemes } from "@/lib/content";
import ScreenerView from "@/components/ScreenerView";

export const dynamic = "force-dynamic";

export default function ScreenerPage() {
  const s = getScreener();
  const mt = getMarketThemes();
  const ann = (rows: typeof s.high) => rows.map((r) => ({ ...r, themes: (mt.stockThemes[r.code] || []).slice(0, 8) }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">신고가 · 거래량 · 주도테마</h1>
        <p className="text-sm text-[var(--muted)] mt-1">코스피·코스닥 전체 · 60일 신고가 / 60일 최대거래량 → 어느 테마가 주도하는지 · 평일 밤 10시 자동</p>
      </div>
      <ScreenerView high={ann(s.high)} volume={ann(s.volume)} updated={s.updated} />
    </div>
  );
}
