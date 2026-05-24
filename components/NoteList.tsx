import { Card } from "@/components/ui";
import Link from "next/link";
import type { NoteItem } from "@/lib/content";

export default function NoteList({ title, desc, items }: { title: string; desc: string; items: NoteItem[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{desc}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <Link key={n.id} href={"/note/" + encodeURIComponent(n.id)}>
            <Card className="rounded-3xl p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="px-2 py-0.5 rounded-full bg-[var(--soft)] font-medium">{n.type}</span>
                <span className="ml-auto mono">{n.date}</span>
              </div>
              <h3 className="mt-3 font-semibold leading-snug tracking-tight line-clamp-2">{n.title}</h3>
              {n.summary && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-3">{n.summary}</p>}
              {n.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">{n.tags.slice(0, 4).map((t) => <span key={t} className="text-[11px] text-[var(--muted)]">#{t}</span>)}</div>
              )}
            </Card>
          </Link>
        ))}
        {items.length === 0 && <div className="text-sm text-[var(--muted)]">노트 없음</div>}
      </div>
    </div>
  );
}
