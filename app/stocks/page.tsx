import { getStocks } from "@/lib/content";
import { Card } from "@/components/ui";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default function Stocks() {
  const stocks = getStocks();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">종목</h1>
        <p className="text-sm text-[var(--muted)] mt-1">기업노트가 있는 종목 · {stocks.length}개</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((s) => (
          <Link key={s.name + s.ticker} href={s.latestId ? `/note/${s.latestId}` : "/stocks"}>
            <Card className="rounded-3xl p-6 h-full">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{s.name}</div>
                {s.ticker && <span className="mono text-sm text-[var(--muted)]">{s.ticker}</span>}
              </div>
              <div className="mt-2 text-xs text-[var(--muted)]">노트 {s.count}개 · 최근 {s.date || "-"}</div>
              {s.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">{s.tags.slice(0, 5).map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)]">#{t}</span>)}</div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
