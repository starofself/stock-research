import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

function pickLocale(req: NextRequest): string {
  // 1) explicit cookie (set when the user toggles language)
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie;

  // 2) Accept-Language header — foreigners get English, Koreans stay Korean
  const header = req.headers.get("accept-language");
  if (header) {
    const wanted = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);
    for (const { tag } of wanted) {
      if (tag.startsWith("ko")) return "ko";
      if (tag.startsWith("en")) return "en";
    }
    // any non-Korean preference → English
    if (wanted.length && !wanted[0].tag.startsWith("ko")) return "en";
  }
  return defaultLocale;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 루트는 주도주 스크리너(public/leader)로 rewrite 된다 — 로케일 리다이렉트에서 제외.
  if (pathname === "/") return;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const locale = pickLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  // Run on everything except API, the leader screener app, Next internals,
  // metadata files, and any path containing a dot (static assets like
  // /hero.png, /blog-att/*).
  matcher: [
    "/((?!api|leader|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|.*\\.).*)",
  ],
};
