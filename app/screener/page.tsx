import { getScreener } from "@/lib/content";
import ScreenerView from "@/components/ScreenerView";

export const dynamic = "force-dynamic";

export default function ScreenerPage() {
  const s = getScreener();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">신고가 · 거래량</h1>
        <p className="text-sm text-[var(--muted)] mt-1">코스피·코스닥 전체 · 60일 신고가 / 60일 최대거래량 · 평일 밤 10시 자동 업데이트</p>
      </div>
      <ScreenerView high={s.high} volume={s.volume} updated={s.updated} />
    </div>
  );
}
