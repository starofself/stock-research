import NoteList from "@/components/NoteList";
import { getNotesByType } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const t = loc === "en"
    ? { title: "Daily", desc: "Day-by-day observations and capture notes", empty: "No notes" }
    : { title: "데일리", desc: "그날그날의 관찰·캡처 메모", empty: "노트 없음" };
  return <NoteList title={t.title} desc={t.desc} emptyText={t.empty} items={getNotesByType("데일리", loc).slice(0, 90)} />;
}
