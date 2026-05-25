import { watchlist, accName } from "@/lib/mock";
import { getBlogPosts, getNotes, getScreener } from "@/lib/content";
import { Card, Pct } from "@/components/ui";
import Reveal from "@/components/Reveal";
import HeroImage from "@/components/HeroImage";
import MacroBoard from "@/components/MacroBoard";
import Link from "next/link";
import { FileText, ListChecks, Rss, ArrowUpRight, LineChart, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

function imgUrl(p?: string): string | null {
  return p ? "/blog-att/" + p.replace(/^_attachments\//, "") : null;
}

function SectionHead({ title, href, Icon }: { title: string; href: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <Icon size={19} strokeWidth={1.8} className="text-[var(--muted)]" />{title}
      </h2>
      <Link href={href} className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--text)] transition">전체 보기 <ArrowUpRight size={14} /></Link>
    </div>
  );
}

export default function Home() {
  const blog = getBlogPosts(3);
  const notes = getNotes().slice(0, 6);
  const screen = getScreener();
  return (
    <div className="space-y-16 md:space-y-20">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-[var(--ink)] border border-[var(--border)] min-h-[380px] md:min-h-[460px] flex">
        <HeroImage src="/hero.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative px-7 md:px-14 py-14 md:py-20 max-w-2xl self-center">
          <Reveal y={16}><div className="text-white/60 text-sm tracking-wide">개인 투자 리서치 · 시장 모니터</div></Reveal>
          <Reveal y={20} delay={0.08}><h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight mt-3 leading-[1.05]">리서치가<br />곧 나의 알파.</h1></Reveal>
          <Reveal y={20} delay={0.16}><p className="text-white/75 mt-5 text-base md:text-lg max-w-lg leading-relaxed">매크로·원자재·금리부터 종목 리서치까지 한 화면에서.</p></Reveal>
          <Reveal y={20} delay={0.24}>
            <div className="flex gap-3 mt-8">
              <Link href="/stocks" className="bg-white text-black text-sm font-semibold px-5 py-3 rounded-full hover:scale-[1.03] hover:opacity-90 transition">종목 리서치</Link>
              <Link href="/chart" className="text-white text-sm font-semibold px-5 py-3 rounded-full border border-white/25 hover:bg-white/10 transition">차트</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MACRO BOARD */}
      <Reveal>
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <LineChart size={19} strokeWidth={1.8} className="text-[var(--muted)]" />주요 시장
            </h2>
            <span className="text-xs text-[var(--muted)]">실시간 · 매일 자동</span>
          </div>
          <MacroBoard />
        </section>
      </Reveal>

      {/* 60D NEW HIGHS */}
      {screen.high.length > 0 && (
        <Reveal>
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Flame size={19} strokeWidth={1.8} className="text-[var(--muted)]" />60일 신고가
              </h2>
              <Link href="/screener" className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--text)] transition">전체 보기 <ArrowUpRight size={14} /></Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {screen.high.slice(0, 18).map((r) => (
                <a key={r.code} href={`https://finance.naver.com/item/main.naver?code=${r.code}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl glass glow-hover">
                  <span className="font-medium text-sm">{r.name}</span>
                  <span className={`mono text-xs ${r.change >= 0 ? "text-[#E5342B]" : "text-[#1E66F0]"}`}>{r.change >= 0 ? "+" : ""}{r.change}%</span>
                </a>
              ))}
            </div>
            <div className="text-[11px] text-[var(--muted)] mt-3">업데이트: {screen.updated ? screen.updated.replace("T", " ") : "-"}</div>
          </section>
        </Reveal>
      )}

      {/* NOTES */}
      <Reveal>
        <section>
          <SectionHead title="최근 리서치 노트" href="/research" Icon={FileText} />
          <div className="grid gap-5 md:grid-cols-3">
            {notes.map((n) => (
              <Link key={n.id} href={"/note/" + encodeURIComponent(n.id)}>
                <Card className="rounded-3xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--soft)] font-medium">{n.type}</span>
                    <span className="ml-auto mono">{n.date}</span>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug tracking-tight line-clamp-2">{n.title}</h3>
                  {n.summary && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-3">{n.summary}</p>}
                  {n.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{n.tags.slice(0, 4).map((t) => <span key={t} className="text-xs text-[var(--muted)]">#{t}</span>)}</div>}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* WATCHLIST */}
      <Reveal>
        <section>
          <SectionHead title="관심 종목" href="/stocks" Icon={ListChecks} />
          <Card className="rounded-3xl p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left font-medium p-4">종목</th>
                  <th className="text-right font-medium p-4">현재가</th>
                  <th className="text-right font-medium p-4">등락</th>
                  <th className="text-left font-medium p-4 hidden sm:table-cell">메모</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((w) => (
                  <tr key={w.ticker} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--soft)] transition">
                    <td className="p-4"><div className="font-medium">{w.name}</div><div className="text-xs mono text-[var(--muted)]">{w.ticker}</div></td>
                    <td className="p-4 text-right mono">{w.price.toLocaleString()}</td>
                    <td className="p-4 text-right"><Pct v={w.pct} /></td>
                    <td className="p-4 text-[var(--muted)] hidden sm:table-cell">{w.memo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </Reveal>

      {/* BLOG */}
      <Reveal>
        <section>
          <SectionHead title="네이버 블로그 최신글" href="/blog" Icon={Rss} />
          <div className="grid gap-5 md:grid-cols-3">
            {blog.map((b, i) => {
              const img = imgUrl(b.image);
              return (
                <a key={i} href={b.url} target="_blank" rel="noreferrer">
                  <Card className="rounded-3xl p-0 h-full flex flex-col overflow-hidden">
                    {img && (
                      <div className="aspect-[16/9] overflow-hidden bg-[var(--soft)]">
                        <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs mono text-[var(--muted)]">{b.date}</div>
                      <h3 className="mt-1.5 font-semibold leading-snug tracking-tight line-clamp-2">{b.title}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{b.summary}</p>
                      <div className="mt-4 flex items-center gap-1 text-sm text-[var(--text)] font-medium">읽기 <ArrowUpRight size={14} /></div>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
