import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getNotes, getBlogPosts } from "@/lib/content";
import { locales } from "@/lib/i18n/config";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/research", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/daily", priority: 0.8, changeFrequency: "daily" },
  { path: "/brief", priority: 0.8, changeFrequency: "daily" },
  { path: "/sectors", priority: 0.7, changeFrequency: "weekly" },
  { path: "/themes", priority: 0.7, changeFrequency: "weekly" },
  { path: "/screener", priority: 0.7, changeFrequency: "weekly" },
  { path: "/stocks", priority: 0.7, changeFrequency: "weekly" },
  { path: "/disclosures", priority: 0.6, changeFrequency: "daily" },
  { path: "/chart", priority: 0.5, changeFrequency: "monthly" },
];

function toDate(d: string): Date {
  const t = Date.parse(d);
  return Number.isNaN(t) ? new Date() : new Date(t);
}

// hreflang alternates for a locale-agnostic path (e.g. "/", "/blog/123")
function languages(p: string): Record<string, string> {
  const suffix = p === "/" ? "" : p;
  return {
    ko: `${SITE_URL}/ko${suffix}`,
    en: `${SITE_URL}/en${suffix}`,
    "x-default": `${SITE_URL}/ko${suffix}`,
  };
}

// Emit one entry per locale, each carrying the full hreflang alternate set.
function localized(
  p: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const suffix = p === "/" ? "" : p;
  const langs = languages(p);
  return locales.map((l) => ({
    url: `${SITE_URL}/${l}${suffix}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: langs },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.flatMap((r) => localized(r.path, now, r.changeFrequency, r.priority));

  const noteEntries = getNotes().flatMap((n) =>
    localized(`/note/${encodeURIComponent(n.id)}`, toDate(n.date), "monthly", 0.6),
  );

  const blogEntries = getBlogPosts()
    .filter((p) => p.logno)
    .flatMap((p) => localized(`/blog/${p.logno}`, toDate(p.date), "monthly", 0.6));

  return [...staticEntries, ...noteEntries, ...blogEntries];
}
