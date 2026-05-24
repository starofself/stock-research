"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Search, ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/content";

function imgUrl(p?: string): string | null {
  return p ? "/blog-att/" + p.replace(/^_attachments\//, "") : null;
}

export default function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const allTags = useMemo(() => {
    const c = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => c.set(t, (c.get(t) || 0) + 1)));
    return [...c.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const visibleTags = showAll ? allTags : allTags.slice(0, 40);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      if (!qq) return true;
      return (p.title + " " + p.summary + " " + p.tags.join(" ")).toLowerCase().includes(qq);
    }).slice(0, 120);
  }, [posts, q, tag]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-xl">
        <Search size={16} className="text-[var(--muted)]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="제목 · 요약 · 태그 검색" className="bg-transparent outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--muted)]" />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={() => setTag(null)} className={`text-xs px-3 py-1.5 rounded-full border transition ${!tag ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>전체</button>
        {visibleTags.map(([t, n]) => (
          <button key={t} onClick={() => setTag(t === tag ? null : t)} className={`text-xs px-3 py-1.5 rounded-full border transition ${t === tag ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>#{t}<span className="ml-1 opacity-50">{n}</span></button>
        ))}
        {allTags.length > 40 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs px-3 py-1.5 rounded-full text-[var(--text)] font-medium hover:bg-[var(--soft)] transition">
            {showAll ? "접기" : `+${allTags.length - 40}개 더`}
          </button>
        )}
      </div>
      <div className="text-xs text-[var(--muted)]">{filtered.length}개 표시{tag ? ` · #${tag}` : ""} · 전체 태그 {allTags.length.toLocaleString()}종</div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => {
          const img = imgUrl(b.image);
          const href = b.logno ? `/blog/${b.logno}` : b.url;
          return (
            <Link key={b.url} href={href}>
              <Card className="rounded-3xl p-0 h-full flex flex-col overflow-hidden">
                {img && (
                  <div className="aspect-[16/9] overflow-hidden bg-[var(--soft)]">
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs mono text-[var(--muted)]">{b.date}</div>
                  <h3 className="mt-1.5 font-semibold leading-snug tracking-tight line-clamp-2">{b.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{b.summary}</p>
                  {b.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">{b.tags.slice(0, 3).map((t) => <span key={t} className="text-[11px] text-[var(--muted)]">#{t}</span>)}</div>
                  )}
                  <div className="mt-auto pt-3 flex items-center gap-1 text-sm text-[var(--text)] font-medium">읽기 <ArrowUpRight size={14} /></div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
