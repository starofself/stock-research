import { accounts, totals, won, trades, watchlist, accName } from "@/lib/mock";
import { getBlogPosts, getNotes } from "@/lib/content";
import { Card, Pct, Sparkline } from "@/components/ui";
import Reveal from "@/components/Reveal";
import HeroImage from "@/components/HeroImage";
import Link from "next/link";
import { FileText, ListChecks, ArrowLeftRight, Rss, ArrowUpRight } from "lucide-react";

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
  return (
    <div className="space-y-16 md:space-y-24">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-[var(--ink)] border border-[var(--border)] min-h-[440px] md:min-h-[540px] flex">
        <HeroImage src="/hero.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative px-7 md:px-14 py-16 md:py-24 max-w-2xl self-center">
          <Reveal y={16}><div className="text-white/60 text-sm tracking-wide">개인 투자 리서치 · 거래일지</div></Reveal>
          <Reveal y={20} delay={0.08}><h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight mt-3 leading-[1.05]">리서치가<br />곧 나의 알파.</h1></Reveal>
          <Reveal y={20} delay={0.16}><p className="text-white/75 mt-5 text-base md:text-lg max-w-lg leading-relaxed">미래에셋과 한국투자, 두 계좌를 한 화면에서. 옵시디언 노트와 자동매매봇 기록까지 한 흐름으로.</p></Reveal>
          <Reveal y={20} delay={0.24}>
            <div className="flex gap-3 mt-8">
              <Link href="/stocks" className="bg-white text-black text-sm font-semibold px-5 py-3 rounded-full hover:scale-[1.03] hover:opacity-90 transition">종목 리서치 보기</Link>
              <Link href="/journal" className="text-white text-sm font-semibold px-5 py-3 rounded-full border border-white/25 hover:bg-white/10 transition">거래일지</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUMMARY */}
      <Reveal>
        <section>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="rounded-3xl p-6">
              <div className="text-sm text-[var(--muted)]">총 평가금액</div>
              <div className="text-3xl font-bold mono mt-2 tracking-tight">{won(totals.value)}</div>
              <div className="flex items-end justify-between mt-4">
                <div className="text-sm text-[var(--muted)]">오늘 <Pct v={totals.dayPct} /> · 누적 <Pct v={totals.totalPct} /></div>
                <Sparkline data={totals.spark} color="#0B0B0F" />
              </div>
            </Card>
            {accounts.map((a) => (
              <Card key={a.id} className="rounded-3xl p-6">
                <div className="flex items-start justify-between">
                  <div className="text-sm text-[var(--muted)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />{a.name}
                  </div>
                  {a.auto
                    ? <span className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--ink)] text-white font-medium">자동매매봇</span>
                    : <span className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--soft)] text-[var(--muted)] font-medium">수동</span>}
                </div>
                <div className="text-3xl font-bold mono mt-2 tracking-tight">{won(a.value)}</div>
                <div className="flex items-end justify-between mt-4">
                  <div className="text-sm text-[var(--muted)]">오늘 <Pct v={a.dayPct} /> · 누적 <Pct v={a.totalPct} /></div>
                  <Sparkline data={a.spark} color="#0B0B0F" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

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
                  <th className="text-right font-medium p-4">계좌</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((w) => (
                  <tr key={w.ticker} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--soft)] transition">
                    <td className="p-4"><div className="font-medium">{w.name}</div><div className="text-xs mono text-[var(--muted)]">{w.ticker}</div></td>
                    <td className="p-4 text-right mono">{w.price.toLocaleString()}</td>
                    <td className="p-4 text-right"><Pct v={w.pct} /></td>
                    <td className="p-4 text-[var(--muted)] hidden sm:table-cell">{w.memo}</td>
                    <td className="p-4 text-right text-xs text-[var(--muted)]">{accName(w.account)}</td>
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
                      <div className="mt-4 flex items-center gap-1 text-sm text-[var(--text)] font-medium">원문 보기 <ArrowUpRight size={14} /></div>
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
