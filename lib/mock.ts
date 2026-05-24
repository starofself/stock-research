export type AccId = "mirae" | "kis";

export const accounts = [
  { id:"mirae" as AccId, name:"미래에셋증권", short:"미래에셋", color:"#22D3EE", auto:false,
    value:48230000, dayPnl:-318000, dayPct:-0.66, totalPct:12.4,
    spark:[31,33,32,35,34,37,36,38,37,39,38,40,39,41] },
  { id:"kis" as AccId, name:"한국투자증권", short:"한국투자", color:"#818CF8", auto:true,
    value:31540000, dayPnl:415000, dayPct:1.33, totalPct:8.7,
    spark:[22,21,23,22,24,23,25,26,25,27,28,27,29,31] },
];

export const totals = { value:79770000, dayPnl:97000, dayPct:0.12, totalPct:10.8,
  spark:[53,54,55,57,58,60,61,64,62,66,66,67,68,72] };

export function won(n:number){ return n.toLocaleString("ko-KR")+"원"; }
export function accName(id:AccId){ return accounts.find(a=>a.id===id)!.short; }

export type NoteType = "딥리서치" | "기업메모" | "테마" | "데일리";
export type Note = { id:string; title:string; ticker?:string; name?:string; type:NoteType; date:string; tags:string[]; thesis:string; };

export const notes: Note[] = [
  { id:"1", title:"우리로 — 현금엔진 SI, 미래 스토리 광소자·SPAD", ticker:"046970", name:"우리로", type:"기업메모", date:"2026-03-24",
    tags:["광통신","SPAD","양자","LiDAR"], thesis:"현재 현금 엔진(WD 저장장치 유통)과 미래 스토리 엔진(광소자/SPAD)이 다른 회사다." },
  { id:"2", title:"유니퀘스트 HPC 서버장비 1,288억 공급계약 딥리서치", ticker:"077500", name:"유니퀘스트", type:"딥리서치", date:"2026-05-04",
    tags:["반도체유통","HPC","서버","GPU"], thesis:"없던 사업 진입이 아니라 24~25년 준비한 서버 유통이 대형 PO로 터진 사건. 2025 매출의 17.6% 규모." },
  { id:"3", title:"스피어 — 조금 더 알아보기", name:"스피어", type:"데일리", date:"2026-04-30",
    tags:["로봇","액추에이터"], thesis:"휴머노이드 액추에이터 밸류체인에서의 위치 점검." },
  { id:"4", title:"온디바이스 AI 테마 정리", type:"테마", date:"2026-04-18",
    tags:["온디바이스AI","NPU","엣지"], thesis:"클라우드 추론 비용 상승 → 엣지 추론 수요. 수혜 밸류체인 1차 정리." },
  { id:"5", title:"에이치브이엠 — 특수합금 공급망 점검", name:"에이치브이엠", type:"기업메모", date:"2026-05-14",
    tags:["특수합금","방산","항공"], thesis:"방산·항공 특수합금 국산화 수혜, 수주잔고 추세 확인 필요." },
  { id:"6", title:"양자컴퓨팅 국내 밸류체인 딥리서치", type:"딥리서치", date:"2026-05-02",
    tags:["양자","SPAD","극저온"], thesis:"국내 양자 테마는 부품(검출·극저온)에 실체. 시스템보다 소부장이 먼저." },
];

export type Trade = { id:string; date:string; ticker:string; name:string; side:"buy"|"sell"; qty:number; price:number; account:AccId; auto:boolean; memo?:string; };
export const trades: Trade[] = [
  { id:"t1", date:"2026-05-23 14:32", ticker:"046970", name:"우리로", side:"buy", qty:120, price:8120, account:"kis", auto:true, memo:"봇 조건진입 (모멘텀)" },
  { id:"t2", date:"2026-05-22 09:15", ticker:"077500", name:"유니퀘스트", side:"buy", qty:30, price:30800, account:"mirae", auto:false, memo:"공급계약 공시 후 분할매수 1차" },
  { id:"t3", date:"2026-05-21 15:01", ticker:"046970", name:"우리로", side:"sell", qty:80, price:8450, account:"kis", auto:true, memo:"봇 익절 (목표 +4%)" },
  { id:"t4", date:"2026-05-20 10:48", ticker:"402030", name:"에이치브이엠", side:"buy", qty:60, price:18300, account:"mirae", auto:false },
];

export const watchlist = [
  { ticker:"046970", name:"우리로", price:8240, pct:3.21, account:"kis" as AccId, memo:"광소자·SPAD 모멘텀" },
  { ticker:"077500", name:"유니퀘스트", price:31250, pct:-1.12, account:"mirae" as AccId, memo:"HPC 서버 공급계약" },
  { ticker:"402030", name:"에이치브이엠", price:18600, pct:0.86, account:"mirae" as AccId, memo:"특수합금 수주" },
  { ticker:"900140", name:"엘브이엠씨", price:3290, pct:1.54, account:"mirae" as AccId, memo:"배당·실적" },
];

export const blog = [
  { title:"스피어 조금 더 알아보기", date:"2025-12-14", summary:"휴머노이드 액추에이터 관련 메모. 밸류체인 내 위치와 리스크 정리.", url:"https://blog.naver.com/star_of_self" },
  { title:"에이치브이엠 조금 더 알아보기", date:"2025-12-14", summary:"특수합금 국산화와 방산 수요 관점에서의 관찰 기록.", url:"https://blog.naver.com/star_of_self" },
  { title:"매크로 코멘트 — 금리와 코스닥 수급", date:"2026-01-08", summary:"외국인 순매도 흐름과 코스닥 중소형주 수급 점검.", url:"https://blog.naver.com/star_of_self" },
];
