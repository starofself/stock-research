"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Flame, Tags, TrendingUp, CandlestickChart, Newspaper, Layers, FlaskConical, CalendarDays, PenLine, type LucideIcon } from "lucide-react";
import { withLocale, type Locale } from "@/lib/i18n/config";

type NavKey = "home" | "brief" | "screener" | "sectors" | "stocks" | "chart" | "disclosures" | "themes" | "research" | "daily" | "blog";

const nav: { key: NavKey; href: string; Icon: LucideIcon }[] = [
  { key: "home", href: "/", Icon: Home },
  { key: "brief", href: "/brief", Icon: Sparkles },
  { key: "screener", href: "/screener", Icon: Flame },
  { key: "sectors", href: "/sectors", Icon: Tags },
  { key: "stocks", href: "/stocks", Icon: TrendingUp },
  { key: "chart", href: "/chart", Icon: CandlestickChart },
  { key: "disclosures", href: "/disclosures", Icon: Newspaper },
  { key: "themes", href: "/themes", Icon: Layers },
  { key: "research", href: "/research", Icon: FlaskConical },
  { key: "daily", href: "/daily", Icon: CalendarDays },
  { key: "blog", href: "/blog", Icon: PenLine },
];

function isActive(path: string, full: string) {
  return full.endsWith("/") ? path === full.slice(0, -1) || path === full : path === full || path.startsWith(full + "/");
}

export default function Sidebar({ locale, labels }: { locale: Locale; labels: Record<NavKey, string> }) {
  const path = usePathname();
  const items = nav.map((n) => ({ ...n, full: withLocale(locale, n.href), label: labels[n.key] }));
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[84px] flex-col items-center py-5 gap-1 bg-[var(--surface)] border-r border-[var(--border)] z-30 overflow-y-auto">
        <Link href={withLocale(locale, "/")} className="w-9 h-9 rounded-2xl bg-[var(--ink)] mb-3 flex items-center justify-center text-white font-semibold shrink-0">S</Link>
        {items.map((n) => {
          const active = isActive(path, n.full);
          return (
            <Link key={n.key} href={n.full}
              className={`relative w-16 rounded-2xl flex flex-col items-center justify-center gap-1 py-2.5 transition shrink-0 ${active ? "bg-[var(--soft)] text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--text)]"}`}>
              <n.Icon size={18} strokeWidth={1.6} />
              <span className="text-[10px] font-medium">{n.label}</span>
            </Link>
          );
        })}
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] flex overflow-x-auto px-1 py-2 gap-1">
        {items.map((n) => {
          const active = isActive(path, n.full);
          return (
            <Link key={n.key} href={n.full} className={`flex flex-col items-center gap-0.5 text-[10px] font-medium shrink-0 px-2 ${active ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>
              <n.Icon size={18} strokeWidth={1.6} />{n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
