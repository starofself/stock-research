import NoteList from "@/components/NoteList";
import { getNotesByType } from "@/lib/content";
export const dynamic = "force-dynamic";
export default function Page() {
  return <NoteList title="테마" desc="섹터·테마 단위 정리 노트" items={getNotesByType("테마").slice(0, 90)} />;
}
