import NoteList from "@/components/NoteList";
import { getNotesByType } from "@/lib/content";
export const dynamic = "force-dynamic";
export default function Page() {
  return <NoteList title="딥리서치" desc="종목·공시 심층 분석 노트" items={getNotesByType("딥리서치").slice(0, 90)} />;
}
