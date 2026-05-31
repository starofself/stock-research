import { getStocks } from "@/lib/content";
import { Card } from "@/components/ui";
import LocaleLink from "@/components/LocaleLink";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Stocks({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const stocks = getStocks();
  const en = loc === "en";
  const h = en
    ? { title: "Stocks", desc: `Stocks with company notes · ${stocks.length}` }
    : { title: "종목", desc: `기업노트가 있는 종목 · ${stocks.length}개` };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{h.desc}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((s) => (
          <LocaleLink key={s.name + s.ticker} href={s.latestId ? `/note/${s.latestId}` : "/stocks"}>
            <Card className="rounded-3xl p-6 h-full">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{s.name}</div>
                {s.ticker && <span className="mono text-sm text-[var(--muted)]">{s.ticker}</span>}
              </div>
              <div className="mt-2 text-xs text-[var(--muted)]">{en ? `${s.count} notes · latest ${s.date || "-"}` : `노트 ${s.count}개 · 최근 ${s.date || "-"}`}</div>
              {s.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">{s.tags.slice(0, 5).map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)]">#{t}</span>)}</div>
              )}
            </Card>
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}
