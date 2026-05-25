export type Disclosure = { corp: string; code: string; report: string; no: string; dt: string; flr: string };

export async function fetchDisclosures(days = 4, pages = 3): Promise<Disclosure[]> {
  const KEY = process.env.DART_API_KEY || "";
  if (!KEY) return [];
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const end = fmt(new Date());
  const bgn = fmt(new Date(Date.now() - days * 86400000));
  const out: Disclosure[] = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const u = `https://opendart.fss.or.kr/api/list.json?crtfc_key=${KEY}&bgn_de=${bgn}&end_de=${end}&page_no=${p}&page_count=100&sort=date&sort_mth=desc`;
      const r = await fetch(u, { cache: "no-store" });
      const d = await r.json();
      if (d.status !== "000" || !Array.isArray(d.list)) break;
      for (const x of d.list) out.push({ corp: x.corp_name, code: x.stock_code || "", report: x.report_nm, no: x.rcept_no, dt: x.rcept_dt, flr: x.flr_nm });
      if (d.list.length < 100) break;
    } catch {
      break;
    }
  }
  return out;
}
