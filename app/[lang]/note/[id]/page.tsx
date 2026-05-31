import { getNote } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LocaleLink from "@/components/LocaleLink";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const note = getNote(decodeURIComponent(id), loc);
  if (!note) return {};
  const enc = encodeURIComponent(id);
  return {
    title: note.title,
    description: note.summary,
    alternates: {
      canonical: `/${loc}/note/${enc}`,
      languages: { ko: `/ko/note/${enc}`, en: `/en/note/${enc}`, "x-default": `/ko/note/${enc}` },
    },
  };
}

export default async function NotePage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const note = getNote(decodeURIComponent(id), locale);
  if (!note) notFound();
  const L = locale === "en" ? { back: "Back", summary: "Key summary · AI" } : { back: "돌아가기", summary: "핵심 요약 · AI" };
  return (
    <article className="max-w-3xl mx-auto">
      <LocaleLink href="/research" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition">
        <ArrowLeft size={15} /> {L.back}
      </LocaleLink>
      <div className="mt-5 flex items-center gap-2">
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)] font-medium">{note.type}</span>
        {note.tags.slice(0, 4).map((t) => <span key={t} className="text-xs text-[var(--muted)]">#{t}</span>)}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-[1.2]">{note.title}</h1>
      <div className="mt-3 pb-6 border-b border-[var(--border)] text-sm text-[var(--muted)] mono">{note.date}</div>
      {note.summary && (
        <div className="mt-7 rounded-2xl bg-[var(--soft)] p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] mb-3"><Sparkles size={13} /> {L.summary}</div>
          <p className="text-[15px] leading-relaxed text-[var(--text)]">{note.summary}</p>
          {note.points && note.points.length > 0 && (
            <ul className="mt-4 space-y-2">{note.points.map((p, i) => <li key={i} className="flex gap-2 text-sm text-[var(--muted)] leading-relaxed"><span className="text-[var(--text)] font-bold">·</span>{p}</li>)}</ul>
          )}
        </div>
      )}
      <div className="article mt-8" dangerouslySetInnerHTML={{ __html: note.html }} />
    </article>
  );
}
