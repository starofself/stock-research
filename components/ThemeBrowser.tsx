"use client";
import { useState, useMemo } from "react";

type TS = { code: string; name: string };
type TI = { no: string; name: string; count: number; stocks: TS[] };

export default function ThemeBrowser({ themes, updated }: { themes: TI[]; updated: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => {
    const qq = q.trim();
    if (!qq) return themes;
    return themes.filter((t) => t.name.includes(qq) || t.stocks.some((s) => s.name.includes(qq)));
  }, [themes, q]);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-xl">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="테마 · 종목 검색" className="bg-transparent outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--muted)]" />
      </div>
      <div className="text-xs text-[var(--muted)]">{list.length}개 테마 · 업데이트 {updated ? updated.replace("T", " ") : "-"}</div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <div key={t.no} className="glass rounded-2xl p-4">
            <button onClick={() => setOpen(open === t.no ? null : t.no)} className="w-full flex items-center justify-between text-left">
              <span className="font-medium">{t.name}</span>
              <span className="text-xs text-[var(--muted)]">{t.count}</span>
            </button>
            {open === t.no && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.stocks.map((s) => (
                  <a key={s.code} href={`https://finance.naver.com/item/main.naver?code=${s.code}`} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-lg bg-[var(--soft)] hover:bg-[var(--border)] transition">{s.name}</a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
