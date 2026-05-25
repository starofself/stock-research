import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get("code") || "").trim();
  if (!/^\d{6}$/.test(code)) return NextResponse.json({ candles: [] });
  const pad = (n: number) => String(n).padStart(2, "0");
  const d2 = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const url = `https://api.finance.naver.com/siseJson.naver?symbol=${code}&requestType=1&startTime=${d2(new Date(Date.now() - 220 * 86400000))}&endTime=${d2(new Date())}&timeframe=day`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://finance.naver.com/" } });
    const txt = await r.text();
    const arr = JSON.parse(txt.replace(/'/g, '"')) as (string | number)[][];
    const candles = arr.slice(1).filter((row) => row && row.length >= 6).map((row) => {
      const dt = String(row[0]);
      return { time: `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)}`, open: +row[1], high: +row[2], low: +row[3], close: +row[4], volume: +row[5] };
    });
    return NextResponse.json({ candles });
  } catch {
    return NextResponse.json({ candles: [] });
  }
}
