import { NextResponse } from "next/server";
import { getNotes, getBlogPosts } from "@/lib/content";
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function codeMap(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "krx_codes.json"), "utf8"));
  } catch {
    return {};
  }
}

async function naverNews(code: string) {
  try {
    const r = await fetch(`https://finance.naver.com/item/news_news.naver?code=${code}&page=1`, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://finance.naver.com/" } });
    const buf = await r.arrayBuffer();
    const html = new TextDecoder("euc-kr").decode(buf);
    const items: { title: string; url: string }[] = [];
    const re = /href="(\/item\/news_read\.naver\?[^"]+)"[^>]*>\s*([^<]{4,})/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && items.length < 10) {
      const t = m[2].replace(/&amp;/g, "&").trim();
      if (t && !items.some((x) => x.title === t)) items.push({ title: t, url: "https://finance.naver.com" + m[1].replace(/&amp;/g, "&") });
    }
    return items;
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const q = String(body.query || "").trim();
  if (!q) return NextResponse.json({ error: "검색어를 입력하세요." });
  const map = codeMap();
  let name = q, code = "";
  if (/^\d{6}$/.test(q)) { code = q; name = Object.keys(map).find((k) => map[k] === q) || q; }
  else { code = map[q] || ""; }

  const notes = getNotes().filter((n) => n.title.includes(name) || n.tags.some((t) => t.includes(name))).slice(0, 6);
  const blog = getBlogPosts().filter((b) => b.title.includes(name) || b.tags.some((t) => t.includes(name))).slice(0, 6);
  const news = code ? await naverNews(code) : [];

  const ctx = [
    "[내 리서치 노트]", ...notes.map((n) => `- ${n.title} (${n.date}): ${n.summary}`),
    "[네이버 블로그]", ...blog.map((b) => `- ${b.title} (${b.date}): ${b.summary}`),
    "[최신 뉴스 헤드라인]", ...news.map((n) => `- ${n.title}`),
  ].join("\n").slice(0, 6000);

  let summaryHtml = "";
  const KEY = process.env.OPENAI_API_KEY || "";
  if (KEY && (notes.length || blog.length || news.length)) {
    const prompt = `종목 "${name}"${code ? `(${code})` : ""}에 대해 아래 내 리서치 노트·블로그·최신 뉴스를 종합해 한국어로 정리해줘. 형식(자료에 근거, 없으면 해당 섹션 생략): \n## 한 줄 요약\n## 투자 포인트\n## 최근 이슈\n## 리스크\n\n${ctx}`;
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 800 }),
      });
      const j = await r.json();
      const md = j.choices?.[0]?.message?.content || "";
      summaryHtml = md ? (marked.parse(md) as string) : "";
    } catch { /* ignore */ }
  }
  return NextResponse.json({
    name, code, summaryHtml,
    notes: notes.map((n) => ({ title: n.title, id: n.id, date: n.date })),
    blog: blog.map((b) => ({ title: b.title, url: b.url, date: b.date })),
    news,
  });
}
