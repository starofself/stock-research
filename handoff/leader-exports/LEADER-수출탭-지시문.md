# 지시: leader.starfolio.io 에 "수출" 탭 추가 (기존 화면은 그대로)

> 이 문서를 leader.starfolio.io(주도주 스크리너 PWA)를 관리·배포하는 세션에 그대로 붙여넣어 실행시키세요.
> 다른 세션(stock-research)에서 관세청 품목별 수출 데이터 기능을 만들었고, 그걸 leader에 **탭 하나만 추가**해서
> 붙이는 작업입니다. **기존 파일은 3곳만 "추가"**, 새 파일 2개만 넣습니다.
> 아이콘·스크리너 데이터·법칙 등 기존 것은 **절대 바꾸지 마세요.** 순수 추가 작업입니다.

---

## 작업 개요
- leader는 이미 `./lib/lightweight-charts.standalone.production.js` 와 다크 테마(#0d1117 / 오렌지 #ff9f43)를 씁니다.
- 추가할 `exports.html` 은 그 라이브러리·테마를 그대로 재사용하는 **자체 완결형 페이지**라 새 의존성이 없습니다.
- "수출" 탭을 누르면 `exports.html` 을 iframe으로 띄우는 방식 → 기존 탭 로직(초입/진행/장기/이탈/법칙)은 한 줄도 안 건드립니다.

---

## 1) 새 파일 추가 (2개)

### 1-a. `data/exports.json` — 관세청 품목별 수출 10년치(264품목, 2016~현재)
leader 소스의 `data/` 폴더에 저장. 공개 리포에서 받으면 됩니다:

    curl -L -o data/exports.json \
      "https://raw.githubusercontent.com/starofself/stock-research/refs/heads/claude/starfolio-export-data-graph-8mvz6t/data/exports.json"

(안 되면 stock-research 리포를 clone 후 `data/exports.json` 을 복사. 포맷: `{source, items:[{name,hs,companies,rows:[["YYYY-MM",달러,원화,kg],...]}]}`)

### 1-b. `exports.html` — 사이트 루트(=index.html 과 같은 위치)에 저장
이 문서 맨 아래 **【exports.html 전체 소스】** 를 그대로 복사해 `exports.html` 로 저장하세요.

---

## 2) `index.html` — 탭 버튼 1줄 추가
`<nav class="tabs" id="tabs">` 안에서 `이탈` 버튼과 `📖 법칙` 버튼 **사이**에 한 줄 추가:

    <button class="tab" data-tab="exports">🚢 수출</button>

(탭 전환은 기존 `bindTabs()` 가 `data-tab` 으로 자동 처리하므로 추가 배선 불필요)

## 3) `app.js` — `renderList()` 맨 앞에 3줄 추가
`function renderList() {` 안, `showList();` **바로 다음 줄**에 삽입:

    if (state.tab === "exports") {
      el("list").innerHTML = '<iframe class="exp-frame" src="./exports.html" title="주요품목 수출"></iframe>';
      window.scrollTo(0, 0);
      return;
    }

## 4) `app.js` — `reload()` 한 줄 수정 (시장 전환 시 수출 탭 유지, 권장)
`reload()` 안의

    if (state.tab === "method") { renderList(); return; }

를 이렇게:

    if (state.tab === "method" || state.tab === "exports") { renderList(); return; }

## 5) `styles.css` — 한 블록 추가 (아무 곳이나)

    .exp-frame { width:100%; height:calc(100dvh - 210px); min-height:520px; border:0; background:var(--bg); border-radius:12px; }

## 6) `sw.js` — (선택) 오프라인 지원 + 셸 캐시 갱신
`const CACHE = "leader-screener-v14"` 를 `v15` 로 올리고, `SHELL` 배열에 `"./exports.html"`, `"./data/exports.json"` 두 줄 추가.
(셸을 바꿨으니 캐시 버전을 올려야 기기에서 새 파일이 반영됩니다.)

---

## 7) 배포
평소 방식 그대로 재배포하세요 (예: `vercel --prod`). 변경분은 새 파일 2개 + 기존 3파일의 소소한 추가뿐입니다.

## 8) 검증
- 배포 후 상단 **🚢 수출** 탭 클릭 → 품목 검색(예: "디램", "라면", HS코드) · 수출액/YoY/판가/중량 차트 · 월별표 · CSV 다운로드 동작 확인.
- **기존 초입·진행·장기·이탈·법칙 탭이 그대로인지, 시장(한국/미국/중국) 전환이 정상인지** 꼭 확인.

## 데이터 갱신
`data/exports.json` 은 stock-research 리포의 관세청 자동수집(GitHub Actions, 매월 1·11·15·21일)이 갱신합니다.
최신본이 필요하면 1-a 의 curl 을 다시 실행해 덮어쓰면 됩니다.
(원하면 `exports.html` 이 `https://starfolio.io/api/exports` 를 우선 조회하게 바꿔 자동 최신화 가능 — API에 CORS 허용 필요.)

---

## 【exports.html 전체 소스】
아래 코드블록 안 내용을 그대로 `exports.html` 로 저장:

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>주요품목 수출</title>
<script src="./lib/lightweight-charts.standalone.production.js"></script>
<style>
  :root{
    --bg:#0d1117; --bg-elev:#161b22; --bg-card:#1b2230; --border:#2a3340;
    --text:#e6edf3; --muted:#8b97a7; --accent:#ff9f43; --green:#3fb950; --red:#f85149; --blue:#4aa3ff;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{margin:0;background:var(--bg);color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",Roboto,sans-serif;font-size:15px;line-height:1.45}
  body{padding:12px 12px calc(env(safe-area-inset-bottom) + 40px)}
  .num{font-variant-numeric:tabular-nums}
  .up{color:var(--red)} .down{color:var(--blue)} .flat{color:var(--muted)}
  /* 검색/선택 */
  .picker{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px;margin-bottom:12px}
  .searchbox{position:relative;margin-bottom:8px}
  .searchbox input{width:100%;padding:9px 30px 9px 12px;border-radius:10px;border:1px solid var(--border);
    background:var(--bg);color:var(--text);font-size:14px;outline:none}
  .searchbox input:focus{border-color:#3a4656}
  .searchbox .x{position:absolute;right:8px;top:50%;transform:translateY(-50%);color:var(--muted);
    background:none;border:none;font-size:16px;cursor:pointer}
  .chips{display:flex;gap:6px;flex-wrap:wrap}
  .chip{font-size:12.5px;padding:5px 11px;border-radius:999px;border:1px solid var(--border);
    background:var(--bg);color:var(--muted);cursor:pointer;white-space:nowrap}
  .chip.on{background:var(--accent);color:#0d1117;border-color:var(--accent);font-weight:700}
  .results{max-height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:10px;margin-top:8px}
  .res{display:block;width:100%;text-align:left;padding:9px 12px;border:none;border-bottom:1px solid var(--border);
    background:none;color:var(--text);cursor:pointer}
  .res:last-child{border-bottom:none}
  .res:active,.res.on{background:#222b3a}
  .res .rn{font-weight:600;font-size:14px}
  .res .rm{font-size:11.5px;color:var(--muted)}
  /* 헤더 */
  .head{display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:10px}
  .head h1{font-size:20px;margin:2px 0 2px}
  .head .hs{font-size:11px;color:var(--muted);border:1px solid var(--border);border-radius:6px;padding:1px 6px;
    margin-left:6px;vertical-align:middle;font-variant-numeric:tabular-nums}
  .head .sub{font-size:12.5px;color:var(--muted)}
  .head .dl{margin-left:auto;display:flex;gap:6px}
  .btn{font-size:12px;font-weight:600;padding:7px 11px;border-radius:9px;border:1px solid var(--border);
    background:var(--bg-card);color:var(--text);cursor:pointer}
  .btn:active{background:#222b3a}
  /* 스탯 타일 */
  .tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px}
  @media(min-width:560px){.tiles{grid-template-columns:repeat(4,1fr)}}
  .tile{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:10px 12px}
  .tile .t{font-size:11px;color:var(--muted)} .tile .v{font-size:17px;font-weight:700;margin-top:2px}
  .prov{font-size:11.5px;color:var(--muted);margin:-4px 0 12px}
  /* 지표/기간 */
  .controls{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px}
  .seg{display:flex;gap:4px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:3px}
  .seg button{background:none;border:none;color:var(--muted);font-size:13px;font-weight:600;padding:6px 10px;
    border-radius:8px;cursor:pointer}
  .seg button.on{background:var(--accent);color:#0d1117}
  .rng{margin-left:auto}
  .rng button.on{background:var(--blue);color:#0d1117}
  .desc{font-size:11.5px;color:var(--muted);margin-bottom:6px}
  #chart{width:100%;height:300px;border-radius:10px;overflow:hidden}
  /* 테이블 */
  .tbl-wrap{margin-top:14px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:8px 10px}
  .tbl-h{font-size:13px;font-weight:600;padding:4px 2px 8px}
  table{width:100%;border-collapse:collapse;font-size:12.5px;white-space:nowrap}
  th{color:var(--muted);font-weight:500;font-size:11px;text-align:right;padding:5px 6px;border-bottom:1px solid var(--border)}
  th:first-child{text-align:left}
  td{text-align:right;padding:5px 6px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums}
  td:first-child{text-align:left;color:var(--muted)}
  tr:last-child td{border-bottom:none}
  .tag{font-size:10px;color:var(--muted);border:1px solid var(--border);border-radius:5px;padding:0 4px;margin-left:5px}
  .tbl-scroll{overflow-x:auto}
  .foot{font-size:11.5px;color:var(--muted);line-height:1.6;margin-top:14px}
  .foot b{color:var(--text)}
</style>
</head>
<body>
  <div class="picker">
    <div class="searchbox">
      <input id="q" placeholder="품목 · HS코드 · 종목 검색" autocomplete="off" />
      <button class="x" id="qx" hidden>×</button>
    </div>
    <div class="chips" id="chips"></div>
    <div class="results" id="results" hidden></div>
  </div>

  <div class="head">
    <div style="min-width:0">
      <h1 id="title">—<span class="hs" id="hs" hidden></span></h1>
      <div class="sub" id="sub"></div>
    </div>
    <div class="dl">
      <button class="btn" id="csv">CSV</button>
    </div>
  </div>

  <div class="tiles" id="tiles"></div>
  <div class="prov" id="prov"></div>

  <div class="controls">
    <div class="seg" id="metric">
      <button data-m="usd" class="on">수출액 $</button>
      <button data-m="yoy">YoY %</button>
      <button data-m="price">판가 $/kg</button>
      <button data-m="kg">중량</button>
    </div>
    <div class="seg rng" id="range">
      <button data-r="12">1년</button>
      <button data-r="36" class="on">3년</button>
      <button data-r="all">전체</button>
    </div>
  </div>
  <div class="desc" id="desc"></div>
  <div id="chart"></div>

  <div class="tbl-wrap">
    <div class="tbl-h">월별 상세 <span style="color:var(--muted);font-weight:400">· 최근 36개월</span></div>
    <div class="tbl-scroll"><table id="tbl"></table></div>
  </div>

  <div class="foot">
    관세청 수출입 잠정치는 매월 <b>1일·11일·21일</b>(직전 10일 단위 누계)에 발표되고, 월간 실적은 <b>다음 달 15일경</b> 확정됩니다.
    <span id="src"></span>
  </div>

<script>
"use strict";
var PINNED = ["총수출","디램","HBM","낸드","자동차","미국","중국","라면","김","화장품미백","임플란트","변압기 + 미국","선박","바이오시밀러"];
var UP="#f85149", DOWN="#4aa3ff", BAR="rgba(74,163,255,.8)", BARP="rgba(74,163,255,.32)", INK="#e6edf3";
var nfC=new Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:2});
var nfF=new Intl.NumberFormat("en-US",{maximumFractionDigits:0});
var nfP=new Intl.NumberFormat("en-US",{maximumFractionDigits:2});
var S={items:[],meta:[],cur:null,metric:"usd",range:"36",chart:null,ro:null,source:""};

function el(id){return document.getElementById(id)}
function pct(v){return (v==null||!isFinite(v))?"-":(v>0?"+":"")+(v*100).toFixed(1)+"%"}
function pcls(v){return (v==null||!isFinite(v))?"flat":(v>0?"up":v<0?"down":"flat")}
function ymL(s){return s.slice(0,4)+"."+s.slice(5,7)}
function nowYm(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}

function points(rows){
  var now=nowYm(), by={}; rows.forEach(function(r){by[r[0]]=r});
  var sorted=rows.slice().sort(function(a,b){return a[0]<b[0]?-1:1});
  function prev(ym,back){var y=+ym.slice(0,4),m=+ym.slice(5,7);var t=y*12+(m-1)-back;
    return Math.floor(t/12)+"-"+String((t%12)+1).padStart(2,"0")}
  function rat(a,b){return (a!=null&&b!=null&&b!==0)?a/b-1:null}
  return sorted.map(function(r){
    var ym=r[0],usd=r[1],krw=r[2],kg=r[3];
    var part=ym>=now;
    var m1=by[prev(ym,1)],m12=by[prev(ym,12)];
    var price=(usd!=null&&kg!=null&&kg>0)?usd/kg:null;
    var p12=(m12&&m12[1]!=null&&m12[3]!=null&&m12[3]>0)?m12[1]/m12[3]:null;
    return {ym:ym,usd:usd,krw:krw,kg:kg,price:price,part:part,
      mom:part?null:rat(usd,m1&&m1[1]),yoy:part?null:rat(usd,m12&&m12[1]),
      priceYoy:part?null:rat(price,p12)};
  });
}

function boot(){
  fetch("./data/exports.json",{cache:"no-store"}).then(function(r){return r.json()}).then(function(d){
    S.items=d.items||[]; S.source=d.source||"";
    S.meta=S.items.map(function(it){return {name:it.name,hs:it.hs,companies:it.companies,
      from:it.rows[0]&&it.rows[0][0]||"",to:it.rows.length?it.rows[it.rows.length-1][0]:""}});
    el("src").textContent = S.source?" · 원본: "+S.source:"";
    bindUI();
    select(S.items.some(function(i){return i.name==="총수출"})?"총수출":(S.items[0]&&S.items[0].name));
  }).catch(function(e){ el("desc").textContent="데이터를 불러오지 못했어요. "+e.message; });
}

function bindUI(){
  el("q").addEventListener("input",onSearch);
  el("qx").addEventListener("click",function(){el("q").value="";onSearch()});
  el("csv").addEventListener("click",downloadCsv);
  document.querySelectorAll("#metric button").forEach(function(b){
    b.addEventListener("click",function(){S.metric=b.dataset.m;segOn("metric",b);render()});});
  document.querySelectorAll("#range button").forEach(function(b){
    b.addEventListener("click",function(){S.range=b.dataset.r;segOn("range",b);render()});});
  renderChips();
}
function segOn(id,btn){document.querySelectorAll("#"+id+" button").forEach(function(b){b.classList.toggle("on",b===btn)})}

function renderChips(){
  var host=el("chips"); host.innerHTML="";
  PINNED.filter(function(p){return S.meta.some(function(m){return m.name===p})}).forEach(function(p){
    var b=document.createElement("button"); b.className="chip"+(S.cur===p?" on":""); b.textContent=p;
    b.addEventListener("click",function(){select(p)}); host.appendChild(b);
  });
}

function onSearch(){
  var s=el("q").value.trim().toLowerCase();
  el("qx").hidden=!s;
  var res=el("results");
  if(!s){res.hidden=true;res.innerHTML="";return}
  var list=S.meta.filter(function(m){return m.name.toLowerCase().indexOf(s)>=0
    ||(m.hs||"").indexOf(s)>=0||(m.companies||"").toLowerCase().indexOf(s)>=0}).slice(0,60);
  res.hidden=false;
  res.innerHTML = list.length? "" : '<div class="res rm" style="cursor:default">검색 결과가 없습니다.</div>';
  list.forEach(function(m){
    var b=document.createElement("button"); b.className="res"+(S.cur===m.name?" on":"");
    b.innerHTML='<div class="rn">'+esc(m.name)+'</div><div class="rm">'+esc([m.hs,m.companies].filter(Boolean).join(" · ")||" ")+'</div>';
    b.addEventListener("click",function(){select(m.name)}); res.appendChild(b);
  });
}

function select(name){
  if(!name)return;
  S.cur=name; el("q").value=""; el("qx").hidden=true; el("results").hidden=true;
  renderChips(); render();
}

function curItem(){return S.items.filter(function(i){return i.name===S.cur})[0]}

function render(){
  var it=curItem(); if(!it)return;
  var m=S.meta.filter(function(x){return x.name===S.cur})[0];
  var P=points(it.rows);
  // 헤더
  el("title").innerHTML=esc(it.name)+'<span class="hs" id="hs"'+(it.hs?"":" hidden")+'>'+(it.hs?"HS "+esc(it.hs):"")+'</span>';
  el("sub").innerHTML=(it.companies?"관련: "+esc(it.companies)+" · ":"")+"기간 "+(m?ymL(m.from)+" ~ "+ymL(m.to):"-");
  // 스탯
  var full=null; for(var i=P.length-1;i>=0;i--){if(!P[i].part){full=P[i];break}}
  var partial=(P.length&&P[P.length-1].part)?P[P.length-1]:null;
  var tiles=el("tiles");
  if(full){
    tiles.innerHTML=
      tile(ymL(full.ym)+" 수출액","$"+(full.usd!=null?nfC.format(full.usd):"-"),"")+
      tile("전년 동월 (YoY)",pct(full.yoy),pcls(full.yoy))+
      tile("전월 대비 (MoM)",pct(full.mom),pcls(full.mom))+
      tile("판가 YoY ($/kg)",pct(full.priceYoy),pcls(full.priceYoy));
  } else tiles.innerHTML="";
  el("prov").innerHTML = (partial&&partial.usd!=null)
    ? ymL(partial.ym)+" 잠정 누계(10일 단위 발표 반영): <b style=\"color:var(--text)\">$"+nfC.format(partial.usd)+"</b> — 월간 확정 전이라 증감률 계산에서 제외"
    : "";
  // 차트 설명
  var dm={usd:"월별 수출금액 (달러)",yoy:"전년 동월 대비 증감률",price:"수출단가 = 금액 ÷ 중량",kg:"월별 수출중량 (kg)"};
  el("desc").innerHTML=dm[S.metric]+((S.metric==="usd"&&partial)?" · 옅은 막대 = 진행 중인 달(잠정)":"");
  drawChart(S.range==="all"?P:P.slice(-parseInt(S.range,10)));
  drawTable(P);
}

function tile(t,v,cls){return '<div class="tile"><div class="t">'+t+'</div><div class="v num '+(cls||"")+'">'+v+'</div></div>'}

function drawChart(P){
  var host=el("chart");
  if(S.ro){S.ro.disconnect();S.ro=null}
  if(S.chart){S.chart.remove();S.chart=null}
  host.innerHTML="";
  var LWC=window.LightweightCharts; if(!LWC){host.innerHTML='<div class="desc">차트 라이브러리를 불러오지 못했어요.</div>';return}
  var isPct=S.metric==="yoy";
  var chart=LWC.createChart(host,{
    width:host.clientWidth,height:300,
    layout:{background:{type:"solid",color:"#0d1117"},textColor:"#8b97a7",fontSize:11},
    grid:{vertLines:{color:"#1b2230"},horzLines:{color:"#1b2230"}},
    rightPriceScale:{borderColor:"#2a3340"},timeScale:{borderColor:"#2a3340",fixLeftEdge:true,fixRightEdge:true},
    handleScale:{axisPressedMouseMove:false},
    localization:{priceFormatter:function(v){return isPct?(v*100).toFixed(0)+"%":nfC.format(v)}}
  });
  S.chart=chart;
  var data=[];
  P.forEach(function(p){
    var v=S.metric==="usd"?p.usd:S.metric==="yoy"?p.yoy:S.metric==="price"?p.price:p.kg;
    if(v!=null)data.push({time:p.ym+"-01",value:v,part:p.part});
  });
  if(S.metric==="price"){
    var line=chart.addLineSeries({color:INK,lineWidth:2,priceLineVisible:false,lastValueVisible:false});
    line.setData(data.map(function(d){return {time:d.time,value:d.value}}));
  }else{
    var h=chart.addHistogramSeries({priceLineVisible:false});
    h.setData(data.map(function(d){return {time:d.time,value:d.value,
      color:S.metric==="yoy"?(d.value>=0?UP:DOWN):(d.part?BARP:BAR)}}));
  }
  chart.timeScale().fitContent();
  S.ro=new ResizeObserver(function(){chart.applyOptions({width:host.clientWidth})}); S.ro.observe(host);
}

function drawTable(P){
  var head='<tr><th>년월</th><th>수출액 $</th><th>MoM</th><th>YoY</th><th>중량 kg</th><th>판가 $/kg</th><th>판가YoY</th></tr>';
  var rows=P.slice().reverse().slice(0,36).map(function(p){
    return '<tr><td>'+ymL(p.ym)+(p.part?'<span class="tag">잠정</span>':'')+'</td>'+
      '<td>'+(p.usd!=null?nfF.format(p.usd):"-")+'</td>'+
      '<td class="'+pcls(p.mom)+'">'+pct(p.mom)+'</td>'+
      '<td class="'+pcls(p.yoy)+'">'+pct(p.yoy)+'</td>'+
      '<td>'+(p.kg!=null?nfF.format(p.kg):"-")+'</td>'+
      '<td>'+(p.price!=null?nfP.format(p.price):"-")+'</td>'+
      '<td class="'+pcls(p.priceYoy)+'">'+pct(p.priceYoy)+'</td></tr>';
  }).join("");
  el("tbl").innerHTML=head+rows;
}

function downloadCsv(){
  var it=curItem(); if(!it)return;
  var P=points(it.rows);
  var head="년월,수출금액(달러),금액(원화),중량(kg),판가(달러/kg),MoM,YoY,판가YoY,비고";
  var lines=P.map(function(p){return [p.ym,p.usd==null?"":p.usd,p.krw==null?"":p.krw,p.kg==null?"":p.kg,
    p.price!=null?p.price.toFixed(4):"",p.mom!=null?(p.mom*100).toFixed(2)+"%":"",
    p.yoy!=null?(p.yoy*100).toFixed(2)+"%":"",p.priceYoy!=null?(p.priceYoy*100).toFixed(2)+"%":"",
    p.part?"잠정":""].join(",")});
  var blob=new Blob(["﻿"+[head].concat(lines).join("\n")],{type:"text/csv;charset=utf-8"});
  var url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url; a.download="수출_"+it.name.replace(/[\\/?*[\]:]/g," ")+".csv"; a.click(); URL.revokeObjectURL(url);
}

function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

boot();
</script>
</body>
</html>
```
