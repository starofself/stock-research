import { fetchDisclosures } from "@/lib/dart";
import DisclosureBrowser from "@/components/DisclosureBrowser";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Disclosures({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const items = await fetchDisclosures(4, 3);
  const h = loc === "en"
    ? { title: "Disclosures (DART)", desc: "Latest DART filings · search by company/keyword · click for the original", empty: "Could not load filings (check DART key env var)." }
    : { title: "전자공시", desc: "DART 최신 공시 · 회사·키워드 검색 · 클릭 시 원문", empty: "공시를 불러올 수 없습니다 (DART 키 환경변수 확인)." };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{h.desc}</p>
      </div>
      {items.length === 0
        ? <div className="text-sm text-[var(--muted)]">{h.empty}</div>
        : <DisclosureBrowser items={items} />}
    </div>
  );
}
