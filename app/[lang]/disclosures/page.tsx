import { fetchDisclosures } from "@/lib/dart";
import DisclosureBrowser from "@/components/DisclosureBrowser";

export const dynamic = "force-dynamic";

export default async function Disclosures() {
  const items = await fetchDisclosures(4, 3);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">전자공시</h1>
        <p className="text-sm text-[var(--muted)] mt-1">DART 최신 공시 · 회사·키워드 검색 · 클릭 시 원문</p>
      </div>
      {items.length === 0
        ? <div className="text-sm text-[var(--muted)]">공시를 불러올 수 없습니다 (DART 키 환경변수 확인).</div>
        : <DisclosureBrowser items={items} />}
    </div>
  );
}
