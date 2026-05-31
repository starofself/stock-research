import NoteList from "@/components/NoteList";
import { getNotesByType } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const t = loc === "en"
    ? { title: "Topics", desc: "Sector and theme summary notes", empty: "No notes" }
    : { title: "테마", desc: "섹터·테마 단위 정리 노트", empty: "노트 없음" };
  return <NoteList title={t.title} desc={t.desc} emptyText={t.empty} items={getNotesByType("테마", loc).slice(0, 90)} />;
}
