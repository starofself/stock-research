"use client";
import { useMemo, useState } from "react";
import type { Disclosure } from "@/lib/dart";
import { ExternalLink } from "lucide-react";

const FILTERS = ["전체", "주요사항", "공급계약", "증권신고서", "분기보고서", "사업보고서", "정정", "배당", "자기주식", "합병"];

export default function DisclosureBrowser({ items }: { items: Disclosure[] }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("전체");
  const list = useMemo(() => {
    const qq = q.trim();
    return items.filter((d) => {
      if (f !== "전체" && !d.report.includes(f)) return false;
      if (qq && !(d.corp + " " + d.report + " " + d.flr).includes(qq)) return false;
      return true;
    }).slice(0, 300);
  }, [items, q, f]);
  const fmtDt = (s: string) => (s && s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : s);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-xl">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="회사명 · 보고서 · 제출인 검색" className="bg-transparent outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--muted)]" />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((x) => (
          <button key={x} onClick={() => setF(x)} className={`text-xs px-3 py-1.5 rounded-full border transition ${f === x ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--soft)]"}`}>{x}</button>
        ))}
      </div>
      <div className="text-xs text-[var(--muted)]">{list.length}건 표시 (최근 공시)</div>
      <div className="glass rounded-3xl p-0 overflow-hidden divide-y divide-[var(--border)]">
        {list.map((d) => (
          <a key={d.no} href={`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${d.no}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 hover:bg-[var(--soft)] transition">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{d.corp}</span>
                {d.code && <span className="text-[11px] mono text-[var(--muted)]">{d.code}</span>}
              </div>
              <div className="text-sm text-[var(--muted)] mt-0.5 truncate">{d.report}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs mono text-[var(--muted)]">{fmtDt(d.dt)}</div>
              <div className="text-[11px] text-[var(--muted)]">{d.flr}</div>
            </div>
            <ExternalLink size={14} className="text-[var(--muted)] shrink-0" />
          </a>
        ))}
        {list.length === 0 && <div className="p-8 text-center text-sm text-[var(--muted)]">결과 없음</div>}
      </div>
    </div>
  );
}
