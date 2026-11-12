import { NextResponse } from "next/server";
import { getExportData } from "@/lib/exports";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = NextResponse.json(getExportData());
  res.headers.set("Cache-Control", "public, max-age=3600");
  return res;
}
