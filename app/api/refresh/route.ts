import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// On-demand recompute requires the always-on Mac (star2). If a trigger URL is
// configured, forward to it; otherwise this is a no-op (nightly cron updates data).
export async function POST() {
  const hook = process.env.REFRESH_HOOK_URL;
  if (!hook) return NextResponse.json({ ok: false, msg: "nightly-only" });
  try {
    await fetch(hook, { method: "POST" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
