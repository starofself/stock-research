import GlobalSearch from "@/components/GlobalSearch";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { htmlLang, type Locale } from "@/lib/i18n/config";

export default function Topbar({ locale, searchPlaceholder, marketOpen }: { locale: Locale; searchPlaceholder: string; marketOpen: string }) {
  const today = new Date().toLocaleDateString(htmlLang[locale], { year: "numeric", month: "long", day: "numeric", weekday: "short" });
  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-4 px-4 md:px-10 bg-[var(--bg)]/85 backdrop-blur border-b border-[var(--border)]">
      <GlobalSearch placeholder={searchPlaceholder} />
      <span className="hidden sm:block text-xs text-[var(--muted)] mono">{today}</span>
      <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />{marketOpen}
      </span>
      <LanguageSwitcher />
    </header>
  );
}
