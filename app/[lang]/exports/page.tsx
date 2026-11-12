import type { Metadata } from "next";
import ExportsView from "@/components/ExportsView";
import { getExportData } from "@/lib/exports";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  return loc === "en"
    ? { title: "Korea Export Tracker", description: "Monthly Korean customs export data by item — value, YoY, ASP, with Excel download." }
    : { title: "주요품목 수출 데이터", description: "관세청 품목별 월간 수출 실적 — 수출액·YoY·판가 차트와 엑셀 다운로드." };
}

const DEFAULT_ITEM = "총수출";

export default async function ExportsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const data = getExportData();
  const meta = data.items.map((it) => ({
    name: it.name,
    hs: it.hs,
    companies: it.companies,
    from: it.rows[0]?.[0] ?? "",
    to: it.rows[it.rows.length - 1]?.[0] ?? "",
  }));
  const initial = data.items.find((it) => it.name === DEFAULT_ITEM) ?? data.items[0] ?? { name: "-", hs: null, companies: null, rows: [] };
  const t = loc === "en"
    ? { title: "Korea Export Tracker", desc: "Korean customs monthly exports by item · published on the 1st/11th/21st (10-day flash) · monthly figures finalized around the 15th of the following month" }
    : { title: "주요품목 수출 데이터", desc: "관세청 품목별 월간 수출 실적 · 매월 1·11·21일 10일 단위 잠정치 발표 · 월간 확정은 익월 15일경" };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{t.desc}</p>
      </div>
      <ExportsView meta={meta} initial={initial} source={data.source} />
    </div>
  );
}
