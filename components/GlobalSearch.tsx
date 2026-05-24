"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Hit = { title: string; date: string; kind: "blog" | "note"; href: string; tags: string[] };

export default function GlobalSearch() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) { setRes([]); return; }
    const id = setTimeout(async () => {
      try {
        const r = await fetch("/api/search?q=" + encodeURIComponent(q));
        const d = await r.json();
        setRes(d.results || []);
        setOpen(true);
      } catch { setRes([]); }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(href: string) {
    router.push(href);
    setOpen(false);
    setQ("");
  }

  return (
    <div ref={box} className="relative flex-1 max-w-sm">
      <div className="flex items-center gap-2 h-9 px-3 rounded-full bg-[var(--soft)]">
        <Search size={15} strokeWidth={1.8} className="text-[var(--muted)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => res.length > 0 && setOpen(true)}
          placeholder="종목 · 노트 · 블로그 검색"
          className="bg-transparent outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--muted)]"
        />
      </div>
      {open && res.length > 0 && (
        <div className="absolute top-11 left-0 right-0 z-50 glass rounded-2xl p-2 max-h-[460px] overflow-auto">
          {res.map((r, i) => (
            <button key={i} onClick={() => go(r.href)} className="w-full text-left p-3 rounded-xl hover:bg-[var(--soft)] transition flex items-start gap-2">
              <span className={`shrink-0 mt-0.5 text-[10px] px-1.5 py-0.5 rounded font-medium ${r.kind === "note" ? "bg-[var(--ink)] text-white" : "bg-[var(--soft)] text-[var(--muted)] border border-[var(--border)]"}`}>{r.kind === "note" ? "노트" : "블로그"}</span>
              <span className="min-w-0">
                <span className="block text-sm font-medium line-clamp-1">{r.title}</span>
                <span className="block text-xs text-[var(--muted)] mono mt-0.5">{r.date}{r.tags.length > 0 ? " · " + r.tags.map((t) => "#" + t).join(" ") : ""}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
