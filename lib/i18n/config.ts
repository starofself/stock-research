export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

// Prefix a path with the locale (idempotent). Used for internal links.
export function withLocale(locale: string, path: string): string {
  const p = path.startsWith("/") ? path : "/" + path;
  return `/${locale}${p === "/" ? "" : p}`;
}

// OG / html locale codes
export const htmlLang: Record<Locale, string> = { ko: "ko-KR", en: "en-US" };
export const ogLocale: Record<Locale, string> = { ko: "ko_KR", en: "en_US" };
