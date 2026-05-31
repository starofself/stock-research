"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

const LABEL: Record<Locale, string> = { ko: "KO", en: "EN" };

export default function LanguageSwitcher() {
  const path = usePathname() || "/";
  const router = useRouter();
  const seg = path.split("/")[1];
  const current: Locale = (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;

  function switchTo(next: Locale) {
    if (next === current) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    const rest = (locales as readonly string[]).includes(seg) ? "/" + path.split("/").slice(2).join("/") : path;
    const target = `/${next}${rest === "/" ? "" : rest}`;
    router.push(target || `/${next}`);
    router.refresh();
  }

  return (
    <div className="ml-auto flex items-center rounded-full border border-[var(--border)] overflow-hidden text-xs font-medium">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={current === l}
          className={`px-2.5 py-1 transition ${current === l ? "bg-[var(--ink)] text-white" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}
