import { NextResponse } from "next/server";
import { getNotes, getNoteSources } from "@/lib/content";

export const dynamic = "force-dynamic";

// 주도주 스크리너(public/leader)의 "리서치" 탭이 읽는 엔드포인트.
// content/notes/** 에 올린 산업·종목 리서치 노트 목록 + 폴더별 적재 현황을 함께 내려준다.
export async function GET() {
  const items = getNotes().map((n) => ({
    id: n.id,
    title: n.title,
    date: n.date,
    type: n.type,
    tags: n.tags,
    summary: n.summary,
  }));
  return NextResponse.json({ items, sources: getNoteSources() });
}
