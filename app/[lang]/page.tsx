import { getNotes, getNotesByType, getScreener } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import HeroImage from "@/components/HeroImage";
import LocaleLink from "@/components/LocaleLink";
import { FileText, ArrowUpRight, Flame, FlaskConical, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

function SectionHead({ title, desc, href, viewAll, Icon }: { title: string; desc?: string; href?: string; viewAll: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Icon size={19} strokeWidth={1.8} className="text-[var(--muted)]" />{title}
        </h2>
        {desc && <p className="mt-1.5 text-sm text-[var(--muted)]">{desc}</p>}
      </div>
      {href && <LocaleLink href={href} className="shrink-0 flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--text)] transition">{viewAll} <ArrowUpRight size={14} /></LocaleLink>}
    </div>
  );
}

function NoteCard({ n }: { n: { id: string; title: string; date: string; type: string; tags: string[]; summary: string } }) {
  return (
    <LocaleLink href={"/note/" + encodeURIComponent(n.id)}>
      <Card className="rounded-3xl p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="px-2 py-0.5 rounded-full bg-[var(--soft)] font-medium">{n.type}</span>
          <span className="ml-auto mono">{n.date}</span>
        </div>
        <h3 className="mt-3 font-semibold leading-snug tracking-tight line-clamp-2">{n.title}</h3>
        {n.summary && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed line-clamp-3">{n.summary}</p>}
        {n.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{n.tags.slice(0, 4).map((t) => <span key={t} className="text-xs text-[var(--muted)]">#{t}</span>)}</div>}
      </Card>
    </LocaleLink>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ko";
  const dict = await getDictionary(locale);
  const t = dict.home;

  const notes = getNotes(locale);
  const recent = notes.slice(0, 6);
  const deep = getNotesByType("딥리서치", locale).slice(0, 3);
  const screen = getScreener();

  // Leading stocks = union of new-high + top-volume, deduped, stocks in both ranked first
  const leaderMap = new Map<string, { code: string; name: string; change: number; both: boolean }>();
  for (const r of screen.high) leaderMap.set(r.code, { code: r.code, name: r.name, change: r.change, both: false });
  for (const r of screen.volume) {
    const ex = leaderMap.get(r.code);
    if (ex) ex.both = true;
    else leaderMap.set(r.code, { code: r.code, name: r.name, change: r.change, both: false });
  }
  const leaders = [...leaderMap.values()].sort((a, b) => Number(b.both) - Number(a.both)).slice(0, 24);

  // Leading-stock research = notes whose (Korean) title mentions a leader's name
  const koNotes = getNotes();
  const leaderNames = [...new Set(leaders.map((l) => l.name))].filter((n) => n.length >= 2);
  const matchIds = new Set(koNotes.filter((n) => leaderNames.some((nm) => n.title.includes(nm))).map((n) => n.id));
  const leaderResearch = notes.filter((n) => matchIds.has(n.id)).slice(0, 6);

  return (
    <div className="space-y-16 md:space-y-20">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-[var(--ink)] border border-[var(--border)] min-h-[360px] md:min-h-[440px] flex">
        <HeroImage src="/hero.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative px-7 md:px-14 py-14 md:py-20 max-w-2xl self-center">
          <Reveal y={16}><div className="text-white/60 text-sm tracking-wide">{t.heroKicker}</div></Reveal>
          <Reveal y={20} delay={0.08}><h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight mt-3 leading-[1.05]">{t.heroTitleLine1}<br />{t.heroTitleLine2}</h1></Reveal>
          <Reveal y={20} delay={0.16}><p className="text-white/75 mt-5 text-base md:text-lg max-w-lg leading-relaxed">{t.heroLead}</p></Reveal>
          <Reveal y={20} delay={0.24}>
            <div className="flex gap-3 mt-8">
              <LocaleLink href="/research" className="bg-white text-black text-sm font-semibold px-5 py-3 rounded-full hover:scale-[1.03] hover:opacity-90 transition">{t.ctaResearch}</LocaleLink>
              <LocaleLink href="/stocks" className="text-white text-sm font-semibold px-5 py-3 rounded-full border border-white/25 hover:bg-white/10 transition">{t.ctaStocks}</LocaleLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RECENT RESEARCH */}
      {recent.length > 0 && (
        <Reveal>
          <section>
            <SectionHead title={t.recentResearch} href="/research" viewAll={t.viewAll} Icon={FileText} />
            <div className="grid gap-5 md:grid-cols-3">
              {recent.map((n) => <NoteCard key={n.id} n={n} />)}
            </div>
          </section>
        </Reveal>
      )}

      {/* LEADING STOCKS */}
      {leaders.length > 0 && (
        <Reveal>
          <section>
            <SectionHead title={t.leadingStocks} desc={t.leadingStocksDesc} href="/screener" viewAll={t.viewAll} Icon={Flame} />
            <div className="flex flex-wrap gap-2">
              {leaders.map((r) => (
                <a key={r.code} href={`https://finance.naver.com/item/main.naver?code=${r.code}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl glass glow-hover">
                  {r.both && <TrendingUp size={13} className="text-[var(--muted)]" />}
                  <span className="font-medium text-sm">{r.name}</span>
                  <span className={`mono text-xs ${r.change >= 0 ? "text-[#E5342B]" : "text-[#1E66F0]"}`}>{r.change >= 0 ? "+" : ""}{r.change}%</span>
                </a>
              ))}
            </div>
            {screen.updated && <div className="text-[11px] text-[var(--muted)] mt-3">{t.updated}: {screen.updated.replace("T", " ")}</div>}
          </section>
        </Reveal>
      )}

      {/* LEADING-STOCK RESEARCH */}
      <Reveal>
        <section>
          <SectionHead title={t.leadingStocksResearch} desc={t.leadingStocksResearchDesc} viewAll={t.viewAll} Icon={TrendingUp} />
          {leaderResearch.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {leaderResearch.map((n) => <NoteCard key={n.id} n={n} />)}
            </div>
          ) : (
            <Card className="rounded-3xl p-8 text-sm text-[var(--muted)]">{t.noResearch}</Card>
          )}
        </section>
      </Reveal>

      {/* DEEP RESEARCH HIGHLIGHTS */}
      {deep.length > 0 && (
        <Reveal>
          <section>
            <SectionHead title={t.deepResearch} href="/research" viewAll={t.viewAll} Icon={FlaskConical} />
            <div className="grid gap-5 md:grid-cols-3">
              {deep.map((n) => <NoteCard key={n.id} n={n} />)}
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
}
