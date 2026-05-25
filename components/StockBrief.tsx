"use client";
import { useState } from "react";
import { Sparkles, ExternalLink, ArrowUpRight } from "lucide-react";

type Res = {
  name: string; code: string; summaryHtml: string;
  notes: { title: string; id: string; date: string }[];
  blog: { title: string; url: string; date: string }[];
  news: { title: string; url: string }[];
};

export default function StockBrief() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Res | null>(null);
  async function run() {
    if (!q.trim()) return;
    setBusy(true); setRes(null);
    try {
      const r = await fetch("/api/stock-brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q.trim() }) });
      setRes(await r.json());
    } catch { setRes(null); }
    setBusy(false);
  }
  return (
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex gap-2 max-w-xl">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="종목명 또는 코드 (예: 삼성전자 / 005930)" className="flex-1 h-11 px-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-sm outline-none text-[var(--text)] placeholder:text-[var(--muted)]" />
        <button disabled={busy} className="flex items-center gap-1.5 px-5 h-11 rounded-2xl bg-[var(--ink)] text-white text-sm font-semibold disabled:opacity-50">
          <Sparkles size={15} />{busy ? "분석 중…" : "리서치 요약"}
        </button>
      </form>

      {busy && <div className="text-sm text-[var(--muted)]">내 리서치 · 블로그 · 최신 뉴스를 모아 요약하는 중…</div>}

      {res && (
        <div className="space-y-6">
          <div className="text-lg font-semibold">{res.name}{res.code && <span className="ml-2 text-sm mono text-[var(--muted)]">{res.code}</span>}</div>
          {res.summaryHtml
            ? <div className="glass rounded-3xl p-6"><div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] mb-3"><Sparkles size={13} /> AI 종합 브리핑</div><div className="article" dangerouslySetInnerHTML={{ __html: res.summaryHtml }} /></div>
            : <div className="text-sm text-[var(--muted)]">관련 자료를 찾지 못했어요 (내 리서치·블로그에 해당 종목 기록이 없거나 코드 매칭 실패).</div>}

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold mb-2">내 리서치 ({res.notes.length})</div>
              <div className="space-y-2">{res.notes.map((n) => <a key={n.id} href={`/note/${encodeURIComponent(n.id)}`} className="block text-sm hover:underline">{n.title} <span className="text-xs text-[var(--muted)] mono">{n.date}</span></a>)}{res.notes.length === 0 && <div className="text-xs text-[var(--muted)]">없음</div>}</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">네이버 블로그 ({res.blog.length})</div>
              <div className="space-y-2">{res.blog.map((b, i) => <a key={i} href={b.url} target="_blank" rel="noreferrer" className="block text-sm hover:underline">{b.title} <ArrowUpRight size={11} className="inline" /></a>)}{res.blog.length === 0 && <div className="text-xs text-[var(--muted)]">없음</div>}</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">최신 뉴스 ({res.news.length})</div>
              <div className="space-y-2">{res.news.map((n, i) => <a key={i} href={n.url} target="_blank" rel="noreferrer" className="block text-sm text-[var(--muted)] hover:text-[var(--text)]"><ExternalLink size={11} className="inline mr-1" />{n.title}</a>)}{res.news.length === 0 && <div className="text-xs text-[var(--muted)]">없음</div>}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
