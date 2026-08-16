"use strict";

// 주도주 스크리너 — leader.starfolio.io 앱을 이 저장소로 이식한 버전.
// 스냅샷 데이터(data/*.json)는 여전히 로컬 파이프라인이 leader.starfolio.io 로 퍼블리시한다.
// 데이터까지 이 저장소로 옮기면 DATA_BASE 를 "" 로 바꾸면 된다(그러면 /leader/data/* 를 읽는다).
const DATA_BASE = "https://leader.starfolio.io";

const MARKET_META = {
  kr: { label: "🇰🇷 한국", currency: "KRW" },
  us: { label: "🇺🇸 미국", currency: "USD" },
  cn: { label: "🇨🇳 중국", currency: "CNY" },
};
const dataUrl = (m) => `${DATA_BASE}/data/latest_${m}.json`;
const MA = [
  { key: "ma4", label: "4주", color: "#f7c948" },
  { key: "ma13", label: "13주", color: "#ff9f43" },
  { key: "ma26", label: "26주", color: "#4aa3ff" },
  { key: "ma52", label: "52주", color: "#b388ff" },
];

// 시장(한국·미국·중국)과 무관한 탭 — 코인은 글로벌 24시간 시장이라 국가 스위치에 종속되지 않고,
// 리서치는 내가 쓴 노트라 시장 구분이 없다. 이 탭에선 시장 스위치·기준일 배지를 숨긴다.
const MARKET_FREE_TABS = ["coins", "research"];
function isMarketFree(tab) { return MARKET_FREE_TABS.indexOf(tab) !== -1; }
// 데이터 로드에 실패해도 자체 데이터로 그려지는 탭(스크리너 스냅샷이 필요 없음).
function isStandaloneTab(tab) { return isMarketFree(tab) || tab === "method" || tab === "exports" || tab === "credit"; }

const el = (id) => document.getElementById(id);
const state = { data: null, market: loadMarket(), tab: "entries", chart: null, ro: null, finChart: null, finRo: null, detailItem: null, logScale: loadLogScale(), research: null, researchFilter: "전체", credit: null, creditChart: null, creditRo: null };

// 통화: 데이터에 있으면 그것을, 없으면(US 미적재 등) 선택된 시장 기준. 머니 포맷·법칙 임계값에 사용.
function currency() { return (state.data && state.data.currency) || MARKET_META[state.market].currency; }
function isUSD() { return currency() === "USD"; }

function loadMarket() {
  try { const m = localStorage.getItem("ls-market"); return (m === "us" || m === "cn") ? m : "kr"; } catch (_e) { return "kr"; }
}
function saveMarket(m) { try { localStorage.setItem("ls-market", m); } catch (_e) {} }
function loadLogScale() { try { return localStorage.getItem("ls-logscale") === "1"; } catch (_e) { return false; } }
function saveLogScale(on) { try { localStorage.setItem("ls-logscale", on ? "1" : "0"); } catch (_e) {} }

// ── 부팅 ──
init();

function init() {
  syncMarketButtons();
  bindMarketSwitch();
  bindTabs();
  syncExportTab();
  syncMarketChrome();
  el("back").addEventListener("click", showList);
  el("scale-toggle").addEventListener("click", toggleLogScale);
  syncScaleButton();
  reload();
}

// 수출(관세청 품목별)은 한국 전용 데이터 → US/CN 시장에선 탭 숨김.
// 숨기는 순간 활성 탭이 수출이면 초입으로 되돌린다.
function syncExportTab() {
  const btn = el("tab-exports");
  if (!btn) return;
  const krOnly = state.market !== "kr";
  btn.style.display = krOnly ? "none" : "";
  if (krOnly && state.tab === "exports") {
    state.tab = "entries";
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === "entries"));
  }
}

// 시장과 무관한 탭에선 국가 스위치와 시장 기준일/배지를 감춘다.
function syncMarketChrome() {
  const free = isMarketFree(state.tab);
  const sw = el("market-switch");
  if (sw) sw.hidden = free;
  const asOf = el("as-of");
  if (asOf) asOf.hidden = free;
  const badges = el("badges");
  if (badges) badges.hidden = free;
}

// ── 차트 가격축 스케일 (로그 ↔ 선형). localStorage 유지, 종목 전환에도 보존. ──
function scaleMode() {
  const M = (window.LightweightCharts && window.LightweightCharts.PriceScaleMode) || { Normal: 0, Logarithmic: 1 };
  return state.logScale ? M.Logarithmic : M.Normal;
}
function syncScaleButton() {
  const b = el("scale-toggle");
  if (!b) return;
  b.classList.toggle("on", state.logScale);
  b.setAttribute("aria-pressed", String(state.logScale));
}
function toggleLogScale() {
  state.logScale = !state.logScale;
  saveLogScale(state.logScale);
  if (state.chart) state.chart.priceScale("right").applyOptions({ mode: scaleMode() });
  syncScaleButton();
}

async function reload() {
  showList();
  const host = el("list");
  host.innerHTML = `<p class="empty">불러오는 중…</p>`;
  try {
    const res = await fetch(dataUrl(state.market), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    state.data = await res.json();
  } catch (e) {
    state.data = null;
    renderHeader();
    if (isStandaloneTab(state.tab)) { renderList(); return; }
    host.innerHTML = `<p class="empty">${state.market !== "kr" ? MARKET_META[state.market].label.split(" ")[1] + " 데이터를 아직 준비 중이에요." : "데이터를 불러오지 못했어요."}<br/>${esc(e.message)}</p>`;
    return;
  }
  renderHeader();
  renderList();
}

function syncMarketButtons() {
  document.querySelectorAll(".mkt").forEach((b) => {
    const on = b.dataset.market === state.market;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", String(on));
  });
}

function bindMarketSwitch() {
  document.querySelectorAll(".mkt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.dataset.market;
      if (m === state.market) return;
      state.market = m;
      saveMarket(m);
      syncMarketButtons();
      syncExportTab();
      reload();
    });
  });
}

function renderHeader() {
  const d = state.data;
  if (!d) {
    el("as-of").textContent = "";
    ["n-entries", "n-leading", "n-longrun", "n-exits"].forEach((id) => (el(id).textContent = ""));
    el("badges").innerHTML = "";
    return;
  }
  el("as-of").textContent = d.as_of;
  el("n-entries").textContent = `(${d.entries.length})`;
  el("n-leading").textContent = `(${(d.leading || []).length})`;
  el("n-longrun").textContent = `(${(d.longrun || []).length})`;
  el("n-exits").textContent = `(${d.exits.length})`;
  const b = [];
  if (!d.weekly_confirmed) b.push(`<span class="badge warn">잠정(주중)</span>`);
  if (d.data_quality && d.data_quality !== "ok") b.push(`<span class="badge warn">데이터 ${d.data_quality}</span>`);
  if (d.baseline) b.push(`<span class="badge">기준선</span>`);
  const ageDays = Math.floor((Date.now() - new Date(d.as_of).getTime()) / 864e5);
  if (ageDays > 3) b.push(`<span class="badge warn">${ageDays}일 지난 데이터</span>`);
  else b.push(`<span class="badge ok">최신</span>`);
  el("badges").innerHTML = b.join("");
}

function bindTabs() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t === btn));
      syncMarketChrome();
      renderList();
    });
  });
}

// ── 리스트 ──
const EMPTY_MSG = {
  entries: "오늘 초입 후보가 없어요.",
  leading: "진행 중인 주도주가 없어요.",
  longrun: "장기 주도주가 없어요.",
  exits: "이탈 신호가 없어요.",
};
const CARD_FN = { entries: entryCard, leading: leadingCard, longrun: leadingCard, exits: exitCard };

function renderList() {
  showList();
  syncMarketChrome();
  const host = el("list");
  if (state.tab === "exports") {
    host.innerHTML = `<iframe class="exp-frame" src="${DATA_BASE}/exports.html" title="주요품목 수출"></iframe>`;
    window.scrollTo(0, 0);
    return;
  }
  if (state.tab === "coins") {
    host.innerHTML = '<iframe class="exp-frame" src="./coins.html" title="주요 코인 점검"></iframe>';
    window.scrollTo(0, 0);
    return;
  }
  if (state.tab === "research") {
    renderResearch();
    window.scrollTo(0, 0);
    return;
  }
  if (state.tab === "credit") {
    renderCredit();
    window.scrollTo(0, 0);
    return;
  }
  if (state.tab === "method") {
    host.innerHTML = methodView();
    window.scrollTo(0, 0);
    return;
  }
  if (!state.data) {
    host.innerHTML = `<p class="empty">${state.market !== "kr" ? MARKET_META[state.market].label.split(" ")[1] + " 데이터를 아직 준비 중이에요." : "데이터가 없어요."}</p>`;
    return;
  }
  const items = state.data[state.tab] || [];
  if (!items.length) {
    host.innerHTML = `<p class="empty">${EMPTY_MSG[state.tab] || "데이터가 없어요."}</p>`;
    return;
  }
  host.innerHTML = "";
  const fn = CARD_FN[state.tab] || entryCard;
  items.forEach((it, i) => host.appendChild(fn(it, i, state.tab)));
}

// ── 리서치 탭 — 내가 올린 산업·종목 리서치 노트 + 업로드 점검 ──
// 노트 원본은 content/notes/** (git). /api/research 가 파일시스템을 읽어 JSON으로 내려준다.
function renderResearch() {
  const host = el("list");
  if (!state.research) {
    host.innerHTML = `<p class="empty">리서치 불러오는 중…</p>`;
    fetch("/api/research", { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((d) => { state.research = d; if (state.tab === "research") renderResearch(); })
      .catch((e) => { state.research = { error: e.message, items: [], sources: [] }; if (state.tab === "research") renderResearch(); });
    return;
  }
  const d = state.research;
  const kinds = ["전체"].concat((d.sources || []).map((s) => s.type));
  const items = state.researchFilter === "전체" ? d.items : d.items.filter((it) => it.type === state.researchFilter);
  const filters = kinds.map((k) => {
    const n = k === "전체" ? d.items.length : (d.sources.find((s) => s.type === k) || {}).count || 0;
    return `<button class="rs-filter${state.researchFilter === k ? " is-active" : ""}" data-kind="${esc(k)}">${esc(k)} ${n}</button>`;
  }).join("");

  host.innerHTML = `<div class="research">
    <div class="rs-head">
      <h2>🔬 산업 · 종목 리서치</h2>
      <p>내가 쓴 산업/섹터·종목 리서치 노트. <code>content/notes/</code> 에 올린 마크다운을 그대로 읽는다.</p>
    </div>
    ${researchCheck(d)}
    <div class="rs-filters">${filters}</div>
    ${items.length
      ? items.map(researchItem).join("")
      : `<p class="empty">${d.error ? "리서치 목록을 불러오지 못했어요. " + esc(d.error) : "아직 올라온 노트가 없어요."}</p>`}
  </div>`;

  host.querySelectorAll(".rs-filter").forEach((b) => b.addEventListener("click", () => {
    state.researchFilter = b.dataset.kind;
    renderResearch();
  }));
}

// 업로드 점검 — 폴더별 노트 수/최근 날짜, 요약 누락 건수. "제대로 올라갔는지" 한눈에.
function researchCheck(d) {
  const rows = (d.sources || []).map((s) => {
    const cls = s.count === 0 ? "bad" : s.missingSummary > 0 ? "warn" : "ok";
    const detail = s.count === 0
      ? "폴더 없음/비어 있음"
      : `${s.count}개 · 최근 ${s.latest || "-"}${s.missingSummary > 0 ? ` · 요약 없음 ${s.missingSummary}` : ""}`;
    return `<div class="rs-row"><span class="rs-k">${esc(s.type)} <span class="muted">${esc(s.dir)}</span></span><span class="rs-v ${cls}">${esc(detail)}</span></div>`;
  }).join("");
  const total = `<div class="rs-row"><span class="rs-k">합계</span><span class="rs-v ${d.items.length ? "ok" : "bad"}">${d.items.length}개</span></div>`;
  return `<div class="rs-check">
    <div class="rs-check-h">업로드 점검</div>
    ${rows || `<div class="rs-row"><span class="rs-k">소스</span><span class="rs-v bad">확인 불가</span></div>`}
    ${total}
  </div>`;
}

function researchItem(it) {
  const tags = (it.tags || []).slice(0, 5).map((t) => `<span class="chip">#${esc(t)}</span>`).join("");
  return `<a class="rs-item" href="/ko/note/${encodeURIComponent(it.id)}">
    <div class="rs-top">
      <span class="rs-kind">${esc(it.type)}</span>
      <span class="rs-date num">${esc(it.date || "-")}</span>
    </div>
    <div class="rs-title">${esc(it.title)}</div>
    ${it.summary ? `<div class="rs-sum">${esc(it.summary)}</div>` : ""}
    ${tags ? `<div class="rs-tags">${tags}</div>` : ""}
  </a>`;
}

// ── 신용잔고 탭 — 한국·미국·중국을 시장 스위치로 갈아끼우며 1년치 잔고 추이만 본다. ──
// 예전 "체온" 탭(여러 지표를 섞은 종합 온도)을 걷어내고 신용잔고 하나만 남긴 화면.
function destroyCreditChart() {
  if (state.creditRo) { state.creditRo.disconnect(); state.creditRo = null; }
  if (state.creditChart) { state.creditChart.remove(); state.creditChart = null; }
}

function renderCredit() {
  const host = el("list");
  if (!state.credit) {
    host.innerHTML = `<p class="empty">신용잔고 불러오는 중…</p>`;
    fetch("./data/credit.json", { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((d) => { state.credit = d; if (state.tab === "credit") renderCredit(); })
      .catch((e) => { state.credit = { error: e.message, markets: {} }; if (state.tab === "credit") renderCredit(); });
    return;
  }
  destroyCreditChart();
  const d = state.credit;
  const m = (d.markets || {})[state.market];
  if (!m || !m.series || !m.series.length) {
    host.innerHTML = `<p class="empty">${d.error ? "신용잔고를 불러오지 못했어요. " + esc(d.error) : MARKET_META[state.market].label.split(" ")[1] + " 신용잔고 데이터가 아직 없어요."}</p>`;
    return;
  }

  const s = m.series;
  const last = s[s.length - 1], first = s[0];
  const prev4 = s[Math.max(0, s.length - 5)];
  const yoy = first.v ? (last.v - first.v) / first.v : null;
  const m4 = prev4.v ? (last.v - prev4.v) / prev4.v : null;
  const dec = m.decimals == null ? 2 : m.decimals;
  const fmt = (v) => Number(v).toLocaleString("ko-KR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const delta = (x) => x == null ? "—" : `<span class="cr-delta ${x >= 0 ? "up" : "down"}">${x >= 0 ? "+" : "−"}${Math.abs(x * 100).toFixed(1)}%</span>`;

  host.innerHTML = `<div class="credit">
    ${d.sample ? `<div class="cr-warn">⚠ <b>샘플 데이터</b> — UI 확인용 자리표시자입니다. 실제 수치가 아니며, 수집 소스를 붙이면 교체됩니다.</div>` : ""}
    <div class="cr-head">
      <div class="cr-title">${esc(MARKET_META[state.market].label)} · ${esc(m.name)}</div>
      <div class="cr-value num">${fmt(last.v)} <span class="cr-unit">${esc(m.unit)}</span></div>
      <div class="cr-sub">기준일 <b class="num">${esc(last.t)}</b> · 최근 4주 ${delta(m4)} · 1년 ${delta(yoy)}</div>
    </div>
    <div class="cr-stats">
      <div class="cr-stat"><span class="cr-k">1년 전</span><span class="cr-v num">${fmt(first.v)}</span></div>
      <div class="cr-stat"><span class="cr-k">1년 최고</span><span class="cr-v num">${fmt(Math.max(...s.map((p) => p.v)))}</span></div>
      <div class="cr-stat"><span class="cr-k">1년 최저</span><span class="cr-v num">${fmt(Math.min(...s.map((p) => p.v)))}</span></div>
    </div>
    <div id="cr-chart" class="cr-chart"></div>
    <div class="cr-foot">최근 1년 주간 추이 · ${esc(m.source || "-")}</div>
  </div>`;

  drawCreditChart(s, m);
}

function drawCreditChart(series, meta) {
  const host = el("cr-chart");
  if (!host || !window.LightweightCharts) return;
  const LWC = window.LightweightCharts;
  const chart = LWC.createChart(host, {
    width: host.clientWidth,
    height: 300,
    layout: { background: { type: "solid", color: "#0d1117" }, textColor: "#8b97a7", fontSize: 11 },
    grid: { vertLines: { visible: false }, horzLines: { color: "#1b2230" } },
    rightPriceScale: { borderColor: "#2a3340" },
    timeScale: { borderColor: "#2a3340", fixLeftEdge: true, fixRightEdge: true },
    crosshair: { mode: LWC.CrosshairMode.Normal },
    handleScale: { axisPressedMouseMove: false },
    localization: {
      // 로케일 고정 — 안 주면 차트가 navigator.language 를 쓰는데, 방문자 OS 로케일이
      // 이상하면 시간축 포매터가 통째로 throw 한다.
      locale: "ko-KR",
      priceFormatter: (v) => Number(v).toLocaleString("ko-KR", {
        minimumFractionDigits: meta.decimals == null ? 2 : meta.decimals,
        maximumFractionDigits: meta.decimals == null ? 2 : meta.decimals,
      }),
    },
  });
  const area = chart.addAreaSeries({
    lineColor: "#ff9f43", topColor: "rgba(255,159,67,.30)", bottomColor: "rgba(255,159,67,.02)",
    lineWidth: 2, priceLineVisible: false,
  });
  area.setData(series.map((p) => ({ time: p.t, value: p.v })));
  chart.timeScale().fitContent();
  state.creditChart = chart;
  state.creditRo = new ResizeObserver(() => {
    const w = host.clientWidth;
    if (state.creditChart && w > 0) state.creditChart.applyOptions({ width: w });
  });
  state.creditRo.observe(host);
}

// ── 법칙(방법론) 탭 — 스크리너가 실제로 쓰는 규칙. 다른 봇 리서치 참고용. ──
// 임계값은 config.py·scoring.py·lifecycle.py 실측치와 일치시킬 것.
function methodView() {
  const cur = currency();
  const usd = cur === "USD", cny = cur === "CNY";
  const TH = usd
    ? { recover: "$2M", floorAmt: "$2M", bonusAmt: "$10M", floorCap: "$370M", bonusCap: "$1B" }
    : cny
    ? { recover: "¥8M", floorAmt: "¥8M", bonusAmt: "¥26M", floorCap: "¥2.6B", bonusCap: "¥7B" }
    : { recover: "15억", floorAmt: "15억", bonusAmt: "50억", floorCap: "500억", bonusCap: "1000억" };
  const sectorRule = (usd || cny) ? "FDR 업종코드(GICS류) → 그룹으로 정리" : "KSIC 코드 → 읽기 쉬운 그룹으로 롤업";
  const themeRule = usd ? "미국은 테마 미제공 — 섹터 분류만 사용"
    : cny ? "중국은 테마 미제공 — 섹터 분류만 사용(상하이·선전 + 과창판·성장판)"
    : "네이버 금융 ~280개 테마 매핑 — 태그용, 점수 미반영";
  const capRule = `시총 ≥ ${TH.floorCap}(&gt;${TH.bonusCap} 가점)`;
  return `<div class="method">
    <section class="m-sec">
      <h2 class="m-h">📖 주도주란?</h2>
      <p class="m-p">주도주(主導株)는 시장·섹터를 이끄는 대장주다. 이 스크리너는 책 <b>《주도주 사이클 절대 법칙》</b>(한규범, 2026)의 <b>생애주기(life-cycle)</b> 관점을 따른다.</p>
      <div class="m-cycle">
        <div class="m-stage"><span class="m-num">①</span> 탄생·가속 <span class="pill g-B">초입</span></div>
        <div class="m-stage"><span class="m-num">②</span> 공세종말점 (Culmination Point) <span class="pill lead">진행</span></div>
        <div class="m-stage"><span class="m-num">③</span> 종말·이탈 <span class="pill EXIT">이탈</span></div>
      </div>
      <p class="m-p">핵심 공식 = <b>정배열(기술적 추세) + 실적 가속도(펀더멘털 방향)</b>. 모든 판정은 <b>주봉(週足)</b> 기준이며 4·13·26·52주 이동평균선을 쓴다.</p>
      <div class="m-malist">
        <span><i style="background:var(--ma4)"></i><b>4주</b> 단기 수급</span>
        <span><i style="background:var(--ma13)"></i><b>13주</b> 실적 방향성</span>
        <span><i style="background:var(--ma26)"></i><b>26주</b> 주류 인정</span>
        <span><i style="background:var(--ma52)"></i><b>52주</b> 장기 펀더멘털</span>
      </div>
    </section>

    <section class="m-sec">
      <h2 class="m-h">🟢 초입 — 신규 주도 후보</h2>
      <div class="m-rule"><span class="m-k">정배열 (필수)</span><span class="m-v"><code>ma4 ≥ ma13 ≥ ma26 ≥ ma52</code></span></div>
      <div class="m-rule"><span class="m-k">돌파 경과 (onset)</span><span class="m-v">≤6주 = 초입 후보 · 7~10주 = 관찰 · &gt;10주 = 진행 트랙으로</span></div>
      <div class="m-rule"><span class="m-k">준비기간</span><span class="m-v">정배열 직전 52주 저점→onset. ≥20주 = 통과 (이상적 25~45) · 15~19주 = 관찰</span></div>
      <div class="m-rule"><span class="m-k">과열 아님</span><span class="m-v">종가 ≤ ma13×1.35 <b>且</b> ≤ ma26×1.60</span></div>
      <div class="m-rule"><span class="m-k">거래대금 회복</span><span class="m-v">최근 4주 평균 ≥ 직전 26주 중앙값×1.2 <b>且</b> ≥ ${TH.recover}</span></div>
      <div class="m-rule"><span class="m-k">변동성 수축</span><span class="m-v">직전 12주 CV &lt; 그 이전 12주 CV</span></div>
      <p class="m-sub">하드 필터 (탈락)</p>
      <p class="m-p">우선주·스팩·리츠·관리종목 제외 · 상장 ≥ 60주 · 20일 평균 거래대금 ≥ ${TH.floorAmt}(&gt;${TH.bonusAmt} 가점) · ${capRule} · 최근 20일 중 ≥ 18 거래일.</p>
      <p class="m-sub">점수 (최대 11.5점 — 등급 내 랭킹용)</p>
      <div class="m-score">
        <span>정배열 초입(≤6주) <b>3.0</b></span>
        <span>준비기간 <b>3.0</b></span>
        <span>주도 섹터 <b>2.0</b></span>
        <span>변동성 수축 <b>1.0</b></span>
        <span>거래대금 회복 <b>1.0</b></span>
        <span>과열 아님 <b>1.0</b></span>
        <span>필터 보너스 <b>+0.5</b></span>
      </div>
      <p class="m-sub">등급</p>
      <div class="m-rule"><span class="pill g-B">B</span><span class="m-v">초입(≤6주) + 준비 통과(≥20주) + 과열 아님 = 정통 초입</span></div>
      <div class="m-rule"><span class="pill g-W">W</span><span class="m-v">준비 통과/관찰 + 과열 아님 = 관찰 대상 (전환시점 미관측 시도 W)</span></div>
      <div class="m-rule"><span class="pill">X</span><span class="m-v">그 외 / 하드 필터 탈락</span></div>
      <p class="m-fine">A·B+ 등급은 실적 연동(P2) 후 부여. 현재 빌드는 가격 전용(P1)이라 B/W/X만.</p>
    </section>

    <section class="m-sec">
      <h2 class="m-h">🟠 진행 — 상승 중 주도주</h2>
      <div class="m-rule"><span class="m-k">조건</span><span class="m-v">정배열 유지 · onset 10주 초과 ~ 52주 이하 · MDD(고점대비 낙폭) ≤ 15% · 하드 필터 통과</span></div>
      <div class="m-rule"><span class="m-k">정렬</span><span class="m-v">주도 섹터 → 낮은 MDD → 짧은 경과주수, 상위 40종목</span></div>
    </section>

    <section class="m-sec">
      <h2 class="m-h">🟣 장기 주도 — 52주 초과 잔존강세</h2>
      <div class="m-rule"><span class="m-k">조건</span><span class="m-v">onset <b>52주 초과</b> · 정배열 유지 · MDD ≤ 15% · 이탈 신호 없음(HOLD) · 하드 필터 통과</span></div>
      <div class="m-rule"><span class="m-k">정렬</span><span class="m-v">주도 섹터 → 낮은 MDD → 오래된 순, 상위 40종목</span></div>
      <p class="m-fine">진행(≤52주) 창을 졸업했지만 추세가 안 꺾인 장기 주도주(예: 다년 반도체 대장). 책의 진행 정의는 52주까지라 분리하되, 이탈에도 안 잡히는 사각지대를 별도 노출. 시간 경과는 라벨(위험/종결임박)일 뿐 매도 신호가 아님.</p>
    </section>

    <section class="m-sec">
      <h2 class="m-h">🔴 이탈 — 추세 꺾임 신호</h2>
      <div class="m-note warn">⚠ <b>시간 경과만으로는 절대 이탈 판정 안 함.</b> 실제 가격·거래 신호가 나와야 한다 (오탐 방어).</div>
      <p class="m-sub">신호</p>
      <div class="m-rule"><span class="m-k">연성 붕괴</span><span class="m-v">ma4 &lt; ma13 (ma13≥26≥52는 유지)</span></div>
      <div class="m-rule"><span class="m-k">경성 붕괴</span><span class="m-v">ma13 &lt; ma26 또는 ma26 &lt; ma52 (2주 연속)</span></div>
      <div class="m-rule"><span class="m-k">4-13 데드크로스</span><span class="m-v">ma4 &lt; ma13×0.99 (2주, onset ≥38주)</span></div>
      <div class="m-rule"><span class="m-k">4-26 데드크로스</span><span class="m-v">ma4 &lt; ma26×0.985 (2주) 또는 종가 &lt; ma26−5% + MDD≥20%</span></div>
      <div class="m-rule"><span class="m-k">거래대금 DC</span><span class="m-v">거래대금 13주MA &lt; 26주MA×0.9 (3주 연속)</span></div>
      <div class="m-rule"><span class="m-k">MDD</span><span class="m-v">≥15% 증거 · ≥20%+2주 WATCH · ≥25% EXIT</span></div>
      <div class="m-rule"><span class="m-k">신고가 정체</span><span class="m-v">≥ 8주 미경신</span></div>
      <p class="m-sub">종합 판정</p>
      <div class="m-rule"><span class="pill EXIT">EXIT</span><span class="m-v">경성 붕괴 OR MDD≥25% OR (4-26 DC + 보강신호 ≥1)</span></div>
      <div class="m-rule"><span class="pill WATCH">WATCH</span><span class="m-v">동반 신호 ≥ 2개 (시간 제외)</span></div>
      <div class="m-rule"><span class="pill">HOLD</span><span class="m-v">신호 ≤ 1개 — 진행 유지</span></div>
      <p class="m-fine">생애주기 라벨(시간, 참고용): 확산 ≤38주 · 후기확산 ≤52주 · 위험 ≤104주 · 종결임박 &gt;104주.</p>
    </section>

    <section class="m-sec">
      <h2 class="m-h">🗂️ 섹터 · 테마</h2>
      <div class="m-rule"><span class="m-k">섹터 점수</span><span class="m-v">13주 수익률×0.5 + 26주×0.3 + 4주×0.2 (시총 가중)</span></div>
      <div class="m-rule"><span class="m-k">주도 섹터</span><span class="m-v">상위 20% (섹터 ≥40개면 Top10) → 초입·진행 +2.0점</span></div>
      <div class="m-rule"><span class="m-k">섹터 분류</span><span class="m-v">${sectorRule}</span></div>
      <div class="m-rule"><span class="m-k">테마</span><span class="m-v">${themeRule}</span></div>
    </section>

    <section class="m-sec m-caveat">
      <h2 class="m-h">⚠️ 리서치 시 주의</h2>
      <ul class="m-ul">
        <li><b>실적(DART)은 점수·필터·이탈 판정에 들어가지 않는다.</b> 12분기 추이는 사람이 한눈에 보는 참고용일 뿐, 자동 매수/매도 신호가 아니다.</li>
        <li>모든 임계값은 <b>시작값</b>이다 — P4 백테스트로 보정 예정. 절대 기준이 아니다.</li>
        <li>현재 빌드 = <b>P1 (가격 전용)</b>. 실적 가속도 연동은 P2.</li>
        <li>이 스크리너는 <b>후보 발굴 도구</b>다. 최종 판단은 사람이 한다.</li>
      </ul>
      <p class="m-fine">출처: 《주도주 사이클 절대 법칙》(한규범, 2026) · leader.starfolio.io</p>
    </section>
  </div>`;
}

function entryCard(e, i) {
  const c = card();
  c.innerHTML = `
    <div class="card-top">
      <span class="card-name">${esc(e.name)}</span>
      <span class="card-ticker">${e.ticker}·${e.market}</span>
      ${chgBadge(e.change_pct)}
      <span class="card-spacer"></span>
      <span class="pill g-${e.grade}">${e.grade}</span>
    </div>
    <div class="card-meta">
      <span class="sector">${esc(e.sector_group)}</span> ·
      정배열 <b class="num">${e.weeks_since_onset ?? "?"}</b>주 · 준비 <b class="num">${e.prep_weeks ?? "?"}</b>주 ·
      점수 <b class="num">${e.score}</b>${e.sector_rank ? ` · 섹터#${e.sector_rank}` : ""}
    </div>
    ${mktcapRow(e)}
    ${chipsRow(e)}`;
  c.addEventListener("click", () => showDetail("entries", i));
  return c;
}

function exitCard(x, i) {
  const c = card();
  c.innerHTML = `
    <div class="card-top">
      <span class="card-name">${esc(x.name)}</span>
      <span class="card-ticker">${x.ticker}·${x.market}</span>
      ${chgBadge(x.change_pct)}
      <span class="card-spacer"></span>
      <span class="pill ${x.exit_signal}">${x.exit_signal}</span>
    </div>
    <div class="card-meta">
      <span class="sector">${esc(x.sector_group)}</span> ·
      MDD <b class="num">${pct(x.mdd)}</b> · ${esc(x.stage || "")} · 정배열 <b class="num">${x.weeks_since_onset ?? "?"}</b>주
    </div>
    <div class="card-meta">${esc(x.note || "")}</div>
    ${mktcapRow(x)}
    ${chipsRow(x)}`;
  c.addEventListener("click", () => showDetail("exits", i));
  return c;
}

function leadingCard(x, i, tab) {
  const lr = tab === "longrun";
  const c = card();
  c.innerHTML = `
    <div class="card-top">
      <span class="card-name">${esc(x.name)}</span>
      <span class="card-ticker">${x.ticker}·${x.market}</span>
      ${chgBadge(x.change_pct)}
      <span class="card-spacer"></span>
      <span class="pill ${lr ? "longrun" : "lead"}">${esc(x.stage || (lr ? "장기" : "진행"))}</span>
    </div>
    <div class="card-meta">
      <span class="sector">${esc(x.sector_group)}</span> ·
      정배열 <b class="num">${x.weeks_since_onset ?? "?"}</b>주 · ${mddLabel(x.mdd)}${x.sector_rank ? ` · 섹터#${x.sector_rank}` : ""}${x.sector_top ? ` <span class="lead-top">주도</span>` : ""}
    </div>
    ${mktcapRow(x)}
    ${chipsRow(x)}`;
  c.addEventListener("click", () => showDetail(lr ? "longrun" : "leading", i));
  return c;
}

function mddLabel(mdd) {
  if (mdd == null) return "—";
  return mdd < 0.005 ? `<b class="up">신고가</b>` : `고점 <b class="num">−${pct(mdd)}</b>`;
}

// 금일 등락율 — 데이터 기준일의 전일 대비 일봉 변동(%). 이미 %단위(예: 2.35).
function chgHtml(v) {
  if (v == null) return "";
  const cls = v > 0 ? "up" : v < 0 ? "down" : "flat";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  return `<span class="chg ${cls}">${sign}${Math.abs(v).toFixed(1)}%</span>`;
}
// 카드 상단용 강조 배지 — 클릭 전 목록에서 금일 등락을 한눈에(색+화살표).
function chgBadge(v) {
  if (v == null) return "";
  const cls = v > 0 ? "up" : v < 0 ? "down" : "flat";
  const arrow = v > 0 ? "▲" : v < 0 ? "▼" : "–";
  return `<span class="chg-badge ${cls}">${arrow}${Math.abs(v).toFixed(1)}%</span>`;
}
// 카드 한줄: 시총(통화별 포맷). 금일 등락은 카드 상단 배지로 분리 표기.
function mktcapRow(it) {
  if (it.marcap == null) return "";
  return `<div class="card-meta card-mkt">시총 <b class="num">${fmtMoney(it.marcap)}</b></div>`;
}
function mktcapInline(it) {
  const parts = [];
  if (it.marcap != null) parts.push(`시총 ${fmtMoney(it.marcap)}`);
  if (it.change_pct != null) parts.push(`금일 ${chgHtml(it.change_pct)}`);
  return parts.length ? ` · ${parts.join(" · ")}` : "";
}

// ── 상세 + 차트 ──
function showList() {
  destroyChart();
  destroyCreditChart();
  el("detail").hidden = true;
  el("list").hidden = false;
  document.querySelector(".tabs").hidden = false;
}

function showDetail(tab, i) {
  const it = state.data[tab][i];
  state.detailItem = it;
  el("list").hidden = true;
  document.querySelector(".tabs").hidden = true;
  el("detail").hidden = false;
  window.scrollTo(0, 0);

  const isEntry = tab === "entries";
  const isLongrun = tab === "longrun";
  const isLeading = tab === "leading" || isLongrun;
  const hasBreakdown = isEntry && it.score_breakdown && it.score_breakdown.length;
  const scoreCell = hasBreakdown
    ? `<span class="score-toggle" role="button" tabindex="0" aria-expanded="false">점수 <b class="num">${it.score}</b> <span class="caret">▾</span></span>`
    : `<span>점수 <b class="num">${it.score}</b></span>`;
  let meta;
  if (isEntry) {
    meta = `<span>등급 <b>${it.grade}</b></span>${scoreCell}
       <span>정배열 <b class="num">${it.weeks_since_onset ?? "?"}</b>주</span>
       <span>준비 <b class="num">${it.prep_weeks ?? "?"}</b>주</span>
       <span>onset <b>${it.onset_date}</b></span>${it.sector_rank ? `<span>섹터 <b>#${it.sector_rank}</b></span>` : ""}`;
  } else if (isLeading) {
    meta = `<span class="pill ${isLongrun ? "longrun" : "lead"}">${esc(it.stage || (isLongrun ? "장기" : "진행"))}</span>
       <span>${mddLabel(it.mdd)}</span>
       <span>정배열 <b class="num">${it.weeks_since_onset ?? "?"}</b>주</span>
       <span>onset <b>${it.onset_date}</b></span>${it.sector_rank ? `<span>섹터 <b>#${it.sector_rank}</b>${it.sector_top ? " 주도" : ""}</span>` : ""}`;
  } else {
    meta = `<span class="pill ${it.exit_signal}">${it.exit_signal}</span>
       <span>MDD <b class="num">${pct(it.mdd)}</b></span><span>단계 <b>${esc(it.stage || "-")}</b></span>
       <span>정배열 <b class="num">${it.weeks_since_onset ?? "?"}</b>주</span>`;
  }
  el("detail-head").innerHTML = `
    <h2>${esc(it.name)} <span class="card-ticker">${it.ticker}</span></h2>
    <div class="sub"><span class="sector">${esc(it.sector_group)}</span> · ${esc(it.sector)} · ${it.market}${mktcapInline(it)}</div>
    <div class="metaline">${meta}</div>
    ${hasBreakdown ? scorePanel(it) : ""}
    ${chips(it.themes)}
    ${finPanel(it)}`;
  if (hasBreakdown) bindScoreToggle();
  bindFinToggle();

  el("legend").innerHTML =
    MA.map((m) => `<span><i style="background:${m.color}"></i>${m.label}MA</span>`).join("") +
    `<span><i style="background:var(--green)"></i>돌파(onset)</span>` +
    (tab === "exits" ? `<span><i style="background:var(--red)"></i>이탈신호</span>` : "");

  el("detail-note").innerHTML = isEntry
    ? `<b>판정</b> ${esc(it.note || "")}`
    : isLeading
    ? `<b>상태</b> ${esc(it.note || "")} <span class="muted">— ${isLongrun ? "52주 초과·정배열 유지(이탈 신호 없음)" : "이탈 신호 없이 진행 중"}</span>`
    : `<b>이탈 신호</b> ${esc((it.signals || []).join(" · ") || it.note || "")}`;

  renderChart(it.chart);
}

function renderChart(chartData) {
  destroyChart();
  const host = el("chart");
  if (!chartData || !chartData.weekly || !chartData.weekly.length) {
    host.innerHTML = `<p class="empty">차트 데이터가 없어요.</p>`;
    return;
  }
  const LWC = window.LightweightCharts;
  const chart = LWC.createChart(host, {
    width: host.clientWidth,
    height: host.clientHeight,
    layout: { background: { type: "solid", color: "#0d1117" }, textColor: "#8b97a7", fontSize: 11 },
    grid: { vertLines: { color: "#1b2230" }, horzLines: { color: "#1b2230" } },
    rightPriceScale: { borderColor: "#2a3340", mode: scaleMode() },
    timeScale: { borderColor: "#2a3340", fixLeftEdge: true, fixRightEdge: true },
    crosshair: { mode: LWC.CrosshairMode.Normal },
    handleScale: { axisPressedMouseMove: false },
  });
  state.chart = chart;

  const candle = chart.addCandlestickSeries({
    upColor: "#3fb950", downColor: "#f85149",
    borderUpColor: "#3fb950", borderDownColor: "#f85149",
    wickUpColor: "#3fb950", wickDownColor: "#f85149",
    priceLineVisible: false, lastValueVisible: false,
  });
  candle.setData(chartData.weekly.map((b) => ({ time: b.t, open: b.o, high: b.h, low: b.l, close: b.c })));

  MA.forEach((m) => {
    const line = chart.addLineSeries({ color: m.color, lineWidth: 2, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
    line.setData(chartData.weekly.filter((b) => b[m.key] != null).map((b) => ({ time: b.t, value: b[m.key] })));
  });

  const vol = chart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "vol" });
  chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
  vol.setData(chartData.weekly.map((b) => ({
    time: b.t, value: b.v || 0, color: b.c >= b.o ? "rgba(63,185,80,.4)" : "rgba(248,81,73,.4)",
  })));

  candle.setMarkers((chartData.markers || []).map(markerOf).sort((a, b) => (a.time < b.time ? -1 : 1)));
  chart.timeScale().fitContent();

  state.ro = new ResizeObserver(() => chart.applyOptions({ width: host.clientWidth }));
  state.ro.observe(host);
}

function markerOf(m) {
  if (m.kind === "onset")
    return { time: m.t, position: "belowBar", color: "#3fb950", shape: "arrowUp", text: "돌파" };
  if (m.kind === "exit")
    return { time: m.t, position: "aboveBar", color: "#f85149", shape: "arrowDown", text: "EXIT" };
  return { time: m.t, position: "aboveBar", color: "#f0c14b", shape: "arrowDown", text: "WATCH" };
}

function destroyChart() {
  if (state.ro) { state.ro.disconnect(); state.ro = null; }
  if (state.chart) { state.chart.remove(); state.chart = null; }
  el("chart").innerHTML = "";
  destroyFinChart();
}

function destroyFinChart() {
  if (state.finRo) { state.finRo.disconnect(); state.finRo = null; }
  if (state.finChart) { state.finChart.remove(); state.finChart = null; }
}

// ── 점수 근거(누르면 펼침) ──
function scorePanel(it) {
  const bd = it.score_breakdown || [];
  const maxTotal = bd.reduce((s, r) => s + (r.max || 0), 0);
  const rows = bd.map((r) => {
    const got = r.points > 0;
    return `<div class="score-row${got ? "" : " miss"}">
      <span class="score-label">${got ? "✓" : "·"} ${esc(r.label)}</span>
      <span class="score-pts num">${r.points}<span class="score-max">/${r.max}</span></span>
    </div>`;
  }).join("");
  return `<div class="score-panel" hidden>
    <div class="score-panel-head">점수 근거 — 정배열·준비기간·거래대금·섹터·과열 기준</div>
    ${rows}
    <div class="score-row score-total">
      <span class="score-label">합계</span>
      <span class="score-pts num">${it.score}<span class="score-max">/${n1(maxTotal)}</span></span>
    </div>
  </div>`;
}

function bindScoreToggle() {
  const head = el("detail-head");
  const tgl = head.querySelector(".score-toggle");
  const panel = head.querySelector(".score-panel");
  if (!tgl || !panel) return;
  const toggle = () => {
    panel.hidden = !panel.hidden;
    tgl.classList.toggle("open", !panel.hidden);
    tgl.setAttribute("aria-expanded", String(!panel.hidden));
  };
  tgl.addEventListener("click", toggle);
  tgl.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggle(); }
  });
}

// ── 실적(DART, 누르면 펼침) ──
function finPanel(it) {
  const f = it.financials;
  if (!f || !f.items || !f.items.length) return "";
  const fsLabel = f.fs_div === "CFS" ? "연결" : "개별";
  const sig = finSignal(it);
  const sigHtml = sig ? ` · <span class="yoy ${sig.cls}">${sig.html}</span>` : "";
  const rows = f.items.map((r) => `<div class="fin-row">
      <span class="fin-label">${esc(r.label)}</span>
      <span class="fin-val num">${fmtMoney(r.value)}</span>
      <span class="fin-yoy">${yoyBadge(r)}</span>
    </div>`).join("");
  const conf = f.low_confidence
    ? `<div class="fin-foot warn">⚠ 개별재무 기준 — 연결 미제공, YoY 비교 주의</div>` : "";
  const note = f.note ? `<div class="fin-foot warn">${esc(f.note)}</div>` : "";
  return `<div class="fin-block">
    <button class="fin-head" type="button" aria-expanded="false">
      <span>실적 <b>${esc(f.period)}</b>${sigHtml} <span class="fin-fs">${fsLabel}</span></span>
      <span class="caret">▾</span>
    </button>
    <div class="fin-body" hidden>
      <div class="fin-row fin-hrow">
        <span class="fin-label">계정</span><span class="fin-val">분기(단순)</span><span class="fin-yoy">전년동기</span>
      </div>
      ${rows}
      ${finQuarters(f)}
      ${conf}${note}
      <div class="fin-foot fin-src">${esc(f.source)} · 단위 ${isUSD() ? "백만$" : currency() === "CNY" ? "억¥" : "억원"} · YoY=전년동기</div>
    </div>
  </div>`;
}

// 12분기(단순분기) 추이 — 차트(매출 막대+영익·순익 선) + 표. 사용자 판단 참고용.
function finQuarters(f) {
  const qs = f.quarters;
  if (!qs || !qs.length) return "";
  const rows = qs.slice().reverse().map((q) => {
    const lc = q.low_confidence ? ` <span class="fin-weak">개별</span>` : "";
    return `<div class="finq-row">
      <span class="finq-q num">${esc(q.label)}${lc}</span>
      <span class="finq-v num">${fmtMoney(q.revenue)}</span>
      <span class="finq-v num ${signCls(q.op)}">${fmtMoney(q.op)}</span>
      <span class="finq-v num ${signCls(q.net)}">${fmtMoney(q.net)}</span>
    </div>`;
  }).join("");
  return `<div class="finq">
    <div class="finq-title">12분기 추이 <span class="muted">(단순분기, 좌→우 과거→최근)</span></div>
    <div id="fin-chart" class="fin-chart"></div>
    <div class="fin-legend">
      <span><i class="lg-bar"></i>매출</span><span><i class="lg-op"></i>영업이익</span><span><i class="lg-net"></i>순이익</span>
    </div>
    <div class="finq-row finq-hrow">
      <span class="finq-q">분기</span><span class="finq-v">매출</span><span class="finq-v">영익</span><span class="finq-v">순익</span>
    </div>
    ${rows}
  </div>`;
}

function signCls(v) { return v != null && v < 0 ? "down" : ""; }

function yoyBadge(r) {
  if (r.yoy != null) {
    const up = r.yoy >= 0;
    const v = Math.abs(Math.round(r.yoy * 1000) / 10);
    const wb = r.weak_base ? ` <span class="fin-weak">기저</span>` : "";
    return `<span class="yoy ${up ? "up" : "down"}">${up ? "+" : "−"}${v}%</span>${wb}`;
  }
  if (r.yoy_label) {
    const good = r.yoy_label === "흑자전환" || r.yoy_label === "적자축소";
    const bad = r.yoy_label === "적자전환" || r.yoy_label === "적자확대";
    return `<span class="yoy ${good ? "up" : bad ? "down" : "flat"}">${esc(r.yoy_label)}</span>`;
  }
  return `<span class="yoy flat">—</span>`;
}

function bindFinToggle() {
  const head = el("detail-head");
  const btn = head.querySelector(".fin-head");
  const body = head.querySelector(".fin-body");
  if (!btn || !body) return;
  btn.addEventListener("click", () => {
    body.hidden = !body.hidden;
    btn.classList.toggle("open", !body.hidden);
    btn.setAttribute("aria-expanded", String(!body.hidden));
    if (!body.hidden && !btn.dataset.charted) {
      const qs = state.detailItem && state.detailItem.financials && state.detailItem.financials.quarters;
      if (qs && qs.length && el("fin-chart")) { renderFinChart(qs); btn.dataset.charted = "1"; }
    }
  });
}

// 12분기 차트 — 매출 막대(좌축) + 영익·순익 선(우축). null 분기는 갭으로 비움(보간 안 함).
function renderFinChart(quarters) {
  const host = el("fin-chart");
  if (!host || !window.LightweightCharts) return;
  destroyFinChart();
  const css = getComputedStyle(document.documentElement);
  const txt = (css.getPropertyValue("--muted") || "#8b97a7").trim();
  const grid = (css.getPropertyValue("--border") || "#2a3340").trim();
  const chart = LightweightCharts.createChart(host, {
    width: host.clientWidth || 320,
    height: 200,
    layout: { background: { color: "transparent" }, textColor: txt, fontSize: 10 },
    grid: { vertLines: { visible: false }, horzLines: { color: grid } },
    rightPriceScale: { borderVisible: false },
    leftPriceScale: { visible: true, borderVisible: false },
    timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
    handleScale: false, handleScroll: false,
    localization: { priceFormatter: finAxisFmt },
  });
  const valid = quarters.filter((q) => q.period_end);
  const bar = chart.addHistogramSeries({
    priceScaleId: "left", color: "rgba(74,163,255,.55)", priceLineVisible: false, lastValueVisible: false,
  });
  const op = chart.addLineSeries({
    priceScaleId: "right", color: "#3fb950", lineWidth: 2, priceLineVisible: false, lastValueVisible: false,
  });
  const net = chart.addLineSeries({
    priceScaleId: "right", color: "#ff9f43", lineWidth: 2, priceLineVisible: false, lastValueVisible: false,
  });
  const scale = isUSD() ? 1e6 : 1e8;  // USD→백만 단위 축, KRW→억 단위 축
  const unit = (v) => (v == null ? null : v / scale);
  bar.setData(valid.map((q) => (q.revenue == null ? { time: q.period_end } : { time: q.period_end, value: unit(q.revenue) })));
  op.setData(valid.map((q) => (q.op == null ? { time: q.period_end } : { time: q.period_end, value: unit(q.op) })));
  net.setData(valid.map((q) => (q.net == null ? { time: q.period_end } : { time: q.period_end, value: unit(q.net) })));
  chart.timeScale().fitContent();
  state.finChart = chart;
  state.finRo = new ResizeObserver(() => {
    const w = host.clientWidth;
    if (state.finChart && w > 0) state.finChart.applyOptions({ width: w });
  });
  state.finRo.observe(host);
}

// 차트 축 라벨 — 축 값(억 또는 백만 단위)을 원 통화 절대값으로 되돌려 재포맷.
function finAxisFmt(v) {
  if (v == null) return "";
  const scale = isUSD() ? 1e6 : 1e8;
  return fmtMoney(Math.round(v * scale));
}

// 실적 헤드라인 시그널(영업이익>순이익>매출 우선) — 카드·접힌버튼에서 한눈에 판단 참고용.
function finSignal(it) {
  const f = it.financials;
  if (!f || !f.items || !f.items.length) return null;
  const by = {};
  f.items.forEach((r) => { by[r.key] = r; });
  const pick = by.op || by.net || by.revenue;
  if (!pick) return null;
  const short = { revenue: "매출", op: "영익", net: "순익" }[pick.key] || pick.label;
  let txt, cls;
  if (pick.yoy != null) {
    const up = pick.yoy >= 0;
    txt = `${short} ${up ? "+" : "−"}${Math.abs(Math.round(pick.yoy * 1000) / 10)}%`;
    cls = up ? "up" : "down";
  } else if (pick.yoy_label) {
    const good = pick.yoy_label === "흑자전환" || pick.yoy_label === "적자축소";
    const bad = pick.yoy_label === "적자전환" || pick.yoy_label === "적자확대";
    txt = `${short} ${pick.yoy_label}`;
    cls = good ? "up" : bad ? "down" : "flat";
  } else {
    return null;
  }
  const wb = pick.weak_base ? ` <span class="fin-weak">기저</span>` : "";
  return { html: `${esc(txt)}${wb}`, cls };
}

function finChip(it) {
  const s = finSignal(it);
  return s ? `<span class="fin-chip ${s.cls}">${s.html}</span>` : "";
}

// ── util ──
function card() { const d = document.createElement("div"); d.className = "card"; return d; }
function chips(themes) {
  if (!themes || !themes.length) return "";
  return `<div class="chips">${themes.slice(0, 6).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;
}
// 카드용: 실적 시그널 칩 + 테마 칩을 한 줄에(영익 시그널 먼저).
function chipsRow(it) {
  const fc = finChip(it);
  const th = (it.themes || []).slice(0, 6).map((t) => `<span class="chip">${esc(t)}</span>`).join("");
  if (!fc && !th) return "";
  return `<div class="chips">${fc}${th}</div>`;
}
function pct(x) { return x == null ? "-" : Math.round(x * 100) + "%"; }
function n1(x) { return Math.round((x || 0) * 10) / 10; }
function fmtMoney(v) { const c = currency(); return c === "USD" ? fmtUsd(v) : c === "CNY" ? fmtCny(v) : fmtWon(v); }
function fmtCny(v) {
  if (v == null) return "—";
  const neg = v < 0;
  const n = Math.abs(v), JO = 1e12, EOK = 1e8;
  let out;
  if (n >= JO) {
    const jo = Math.floor(n / JO), eok = Math.round((n % JO) / EOK);
    out = eok > 0 ? `¥${jo}조 ${eok.toLocaleString()}억` : `¥${jo}조`;
  } else if (n >= EOK) {
    out = `¥${Math.round(n / EOK).toLocaleString()}억`;
  } else if (n >= 1e4) {
    out = `¥${Math.round(n / 1e4).toLocaleString()}만`;
  } else {
    out = `¥${Math.round(n).toLocaleString()}`;
  }
  return (neg ? "−" : "") + out;
}
function fmtUsd(v) {
  if (v == null) return "—";
  const neg = v < 0, n = Math.abs(v);
  let out;
  if (n >= 1e9) out = `$${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)}B`;
  else if (n >= 1e6) out = `$${Math.round(n / 1e6).toLocaleString()}M`;
  else if (n >= 1e3) out = `$${Math.round(n / 1e3).toLocaleString()}K`;
  else out = `$${Math.round(n).toLocaleString()}`;
  return (neg ? "−" : "") + out;
}
function fmtWon(v) {
  if (v == null) return "—";
  const neg = v < 0;
  const n = Math.abs(v), JO = 1e12, EOK = 1e8;
  let out;
  if (n >= JO) {
    const jo = Math.floor(n / JO), eok = Math.round((n % JO) / EOK);
    out = eok > 0 ? `${jo}조 ${eok.toLocaleString()}억` : `${jo}조`;
  } else if (n >= EOK) {
    out = `${Math.round(n / EOK).toLocaleString()}억`;
  } else if (n >= 1e4) {
    out = `${Math.round(n / 1e4).toLocaleString()}만`;
  } else {
    out = Math.round(n).toLocaleString();
  }
  return (neg ? "−" : "") + out;
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

// ── PWA ──
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
