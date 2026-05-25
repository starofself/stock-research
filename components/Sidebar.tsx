"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, Tags, TrendingUp, CandlestickChart, Newspaper, Layers, FlaskConical, CalendarDays, PenLine, type LucideIcon } from "lucide-react";

const nav: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/screener", label: "신고가", Icon: Flame },
  { href: "/sectors", label: "테마주", Icon: Tags },
  { href: "/stocks", label: "종목", Icon: TrendingUp },
  { href: "/chart", label: "차트", Icon: CandlestickChart },
  { href: "/disclosures", label: "공시", Icon: Newspaper },
  { href: "/themes", label: "테마", Icon: Layers },
  { href: "/research", label: "딥리서치", Icon: FlaskConical },
  { href: "/daily", label: "데일리", Icon: CalendarDays },
  { href: "/blog", label: "블로그", Icon: PenLine },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

export default function Sidebar() {
  const path = usePathname();
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[84px] flex-col items-center py-5 gap-1 bg-[var(--surface)] border-r border-[var(--border)] z-30 overflow-y-auto">
        <div className="w-9 h-9 rounded-2xl bg-[var(--ink)] mb-3 flex items-center justify-center text-white font-semibold shrink-0">S</div>
        {nav.map((n) => {
          const active = isActive(path, n.href);
          return (
            <Link key={n.href} href={n.href}
              className={`relative w-16 rounded-2xl flex flex-col items-center justify-center gap-1 py-2.5 transition shrink-0 ${active ? "bg-[var(--soft)] text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--text)]"}`}>
              <n.Icon size={18} strokeWidth={1.6} />
              <span className="text-[10px] font-medium">{n.label}</span>
            </Link>
          );
        })}
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] flex overflow-x-auto px-1 py-2 gap-1">
        {nav.map((n) => {
          const active = isActive(path, n.href);
          return (
            <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-0.5 text-[10px] font-medium shrink-0 px-2 ${active ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>
              <n.Icon size={18} strokeWidth={1.6} />{n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
