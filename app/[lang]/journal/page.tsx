import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Journal({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const h = loc === "en"
    ? { title: "Trading Journal", body: ["This is a private section.", "Account and trade records are not part of the public site."] }
    : { title: "거래일지", body: ["거래일지는 비공개 섹션입니다.", "계좌·매매 기록은 공개 사이트에 포함되지 않습니다."] };
  return (
    <div className="max-w-md mx-auto text-center py-24">
      <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
      <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">{h.body[0]}<br />{h.body[1]}</p>
    </div>
  );
}
