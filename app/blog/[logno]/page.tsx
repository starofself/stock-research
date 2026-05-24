import { getBlogPost } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Post({ params }: { params: Promise<{ logno: string }> }) {
  const { logno } = await params;
  const post = getBlogPost(logno);
  if (!post) notFound();
  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition">
        <ArrowLeft size={15} /> 블로그
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-5 leading-[1.2]">{post.title}</h1>
      <div className="flex items-center gap-4 mt-4 pb-6 border-b border-[var(--border)] text-sm text-[var(--muted)]">
        <span className="mono">{post.date}</span>
        <a href={post.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--text)] transition">네이버 원문 <ExternalLink size={13} /></a>
      </div>
      {post.summary && (
        <div className="mt-7 rounded-2xl bg-[var(--soft)] p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] mb-3">
            <Sparkles size={13} /> 핵심 요약 · AI
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--text)]">{post.summary}</p>
          {post.points && post.points.length > 0 && (
            <ul className="mt-4 space-y-2">
              {post.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)] leading-relaxed">
                  <span className="text-[var(--text)] font-bold">·</span>{p}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="article mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
