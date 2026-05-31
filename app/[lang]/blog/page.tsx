import { getBlogPosts } from "@/lib/content";
import BlogBrowser from "@/components/BlogBrowser";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Blog({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const posts = getBlogPosts(undefined, loc);
  const t = loc === "en"
    ? { title: "Blog", desc: `Personal investing study log · shared news excluded · ${posts.length.toLocaleString()} posts · tag search` }
    : { title: "네이버 블로그", desc: `개인 투자 공부 기록 · 공유 뉴스 제외 · 총 ${posts.length.toLocaleString()}개 · 태그 검색` };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{t.desc}</p>
      </div>
      <BlogBrowser posts={posts} />
    </div>
  );
}
