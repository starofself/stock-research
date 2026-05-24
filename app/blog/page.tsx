import { getBlogPosts } from "@/lib/content";
import BlogBrowser from "@/components/BlogBrowser";

export const dynamic = "force-dynamic";

export default function Blog() {
  const posts = getBlogPosts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">네이버 블로그</h1>
        <p className="text-sm text-[var(--muted)] mt-1">개인 투자 공부 기록 · 공유 뉴스 제외 · 총 {posts.length.toLocaleString()}개 · 태그 검색</p>
      </div>
      <BlogBrowser posts={posts} />
    </div>
  );
}
