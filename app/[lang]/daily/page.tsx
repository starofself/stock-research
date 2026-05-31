import NoteList from "@/components/NoteList";
import { getNotesByType } from "@/lib/content";
export const dynamic = "force-dynamic";
export default function Page() {
  return <NoteList title="데일리" desc="그날그날의 관찰·캡처 메모" items={getNotesByType("데일리").slice(0, 90)} />;
}
