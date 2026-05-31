# Research report HTML format (target)

Reformat each Korean post into a premium research-report layout. Output the **inner HTML only** (no outer wrapper — the page adds `<div class="report">`). Use EXACTLY these classes (CSS already exists in app/globals.css):

- `<p class="report-eyebrow">DEEP RESEARCH · 종목명/주제</p>` — short uppercase kicker
- `<h1>제목</h1>` — main title
- `<p class="report-subtitle">한 줄 부제 — 무엇을 분석하는 글인지</p>`
- `<p class="report-meta">작성일: YYYY-MM-DD · 분석 관점 · 출처</p>`
- `<div class="report-warn">투자 판단의 책임은 본인에게 있습니다. 본 자료는 리서치이며 매수·매도 추천이 아닙니다.</div>` — disclaimer
- `<hr class="report-rule">` — thick divider after the header block
- Sections: `<h2>0. 결론 먼저</h2>`, `<h2>1. ...</h2>` … (number them; first section "결론 먼저"/"Bottom line first")
- Key statements: `<div class="report-callout"><p>...</p></div>` (blue box)
- Fact vs interpretation paragraphs (use when a claim is sourced vs your read):
  - `<p class="report-fact"><b>공식 사실:</b> ...</p>`
  - `<p class="report-interp"><b>해석:</b> ...</p>`
- Comparison/feature cards (use only when content has parallel items):
  `<div class="report-cards"><div class="report-card"><span class="tag">라벨</span><h4>소제목</h4><p>설명</p></div> …</div>`
- Architecture/flow diagram (ONLY if the post has a clear layered structure — optional):
  `<div class="report-diagram"><div class="dgm-top">상위 계층<small>부연</small></div><div class="dgm-cols"><div class="dgm-col blue"><b>층1</b><small>요소</small></div><div class="dgm-col green">…</div><div class="dgm-col amber">…</div><div class="dgm-col purple">…</div></div><div class="dgm-foot">최종 결과 요약</div></div>`
- Lists: plain `<ul><li>…</li></ul>` / `<ol>`
- Tables: plain `<table><thead>…</thead><tbody>…</tbody></table>`
- Bull/Base/Bear or scenarios: `<h3>` subheads + `<ul>`
- Sources at the end: `<div class="report-sources"><h2>출처</h2><ul><li>출처명: https://…</li></ul></div>`

Rules:
- Preserve ALL substantive content and any real numbers/facts from the source — do NOT invent facts. Restructure and clarify only.
- Keep the author's first-person research voice.
- **VISUAL UNDERSTANDING (required where possible):** Help the reader understand visually — intersperse visuals through the body, aiming for at least one visual aid in each major section when the content supports it:
  - (a) KEEP every image from the source. If the source has `<img src="_attachments/FILE">`, output it as `<img src="/blog-att/FILE" alt="설명">` (EN: English alt) placed near the relevant section. Never drop source images.
  - (b) ADD diagrams (`.report-diagram`) and comparison/feature cards (`.report-cards`) to visualize structures, flows, comparisons, timelines, or key numbers from the source.
  - Only visualize what is actually in the source — never fabricate fake data/numbers in a diagram.
- **LINKS (required):** PRESERVE every link in the source. Render each as a working `<a href="URL" target="_blank" rel="noreferrer">text</a>` inline where it appears. NEVER drop a link, flatten it to plain text, or strip the URL. Also collect external reference links into the `.report-sources` block at the end.
- Short/thin posts: still apply eyebrow/title/subtitle/meta/disclaimer + at least "결론 먼저" and 1–2 sections; add a small diagram/cards if it aids understanding, otherwise keep it clean.
- Produce BOTH a Korean (`ko`) and an English (`en`) version of the full report HTML (same structure; translate all visible text incl. labels: 공식 사실→Official fact, 해석→Interpretation, 결론 먼저→Bottom line first, 출처→Sources).
