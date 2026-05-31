import NoteList from "@/components/NoteList";
import { getNotesByType } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const t = loc === "en"
    ? { title: "Deep Research", desc: "In-depth equity and disclosure analysis notes", empty: "No notes" }
    : { title: "딥리서치", desc: "종목·공시 심층 분석 노트", empty: "노트 없음" };
  return <NoteList title={t.title} desc={t.desc} emptyText={t.empty} items={getNotesByType("딥리서치", loc).slice(0, 90)} />;
}
