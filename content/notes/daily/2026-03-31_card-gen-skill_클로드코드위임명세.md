# 🔧 클로드코드 위임 명세: card-gen 스킬 구축

> **작성**: 마스터클로 | **날짜**: 2026-03-31 | **출처**: #slack-openclaw-study 뽀짝이 수업 #13 학습 → 3봇 피드백 통합

---

## 1. 목적

**보고서/데이터 카드 자동 생성 스킬** (`card-gen`)

AI 이미지 생성이 아니라, **JSON 입력 → 고정 HTML/CSS 템플릿 → Playwright 렌더 → PNG 출력** 파이프라인.

### 왜 필요한가
- AI 이미지 생성은 한글 텍스트가 깨짐
- HTML→PNG는 텍스트 100% 정확, 레이아웃 픽셀 단위 제어, 대량 생산 가능
- 보고서 표지, 핵심요약 카드, 비교표, 데이터 스냅샷을 **같은 톤**으로 뽑을 수 있음
- 옵시디언/슬랙/블로그 보고 체계와 바로 연결 가능

### 기존 스킬과의 관계
- `image-gen` — AI 생성 이미지 (일러스트, 아이콘, 감성 이미지) → **유지**
- `card-gen` (신규) — HTML 기반 정보 카드 (보고서 카드, 썸네일, 비교표, 개념도) → **이번 구축 대상**

---

## 2. 설계 원칙

| 원칙 | 설명 |
|------|------|
| 템플릿 기반 | 자유형 HTML 금지. 고정 템플릿에 변수만 주입 |
| JSON 입력 | 모든 카드는 JSON으로 입력받고, 입력 JSON도 함께 저장 (재생성 가능) |
| 메타 강제 | 모든 카드에 `source`, `date`, `ticker/topic` 메타데이터 하단 고정 |
| 한글 우선 | 한글 폰트 포함, 줄바꿈/overflow 처리 필수 |
| 숫자 규격화 | 억/조/% 포맷, 음수/증감 색상 규칙 통일 |
| 텍스트 제한 | 초과 시 자동 축약 또는 줄 수 제한. 텍스트 과다 = 축약 실패물 |

---

## 3. 우선 템플릿 (10종)

### 인사이트클로 제안 (정보 카드 5종)
1. **summary-card** — 브리핑 요약 (제목/부제/bullet 3~5개/출처/날짜)
2. **company-card** — 기업분석 1장 (종목명/핵심수치/투자포인트/리스크)
3. **compare-card** — 뉴스 비교 / A vs B (장점/리스크/Before-After)
4. **risk-opportunity-card** — 리스크/기회 2분할
5. **checklist-card** — 일정·체크포인트

### 데이터클로 제안 (데이터 카드 5종)
6. **kpi-card** — KPI/수치 경보 (임계치 초과 하이라이트)
7. **mini-chart-card** — 미니 차트 (가격/거래량 20~60봉, SVG/Canvas)
8. **peer-table-card** — 비교 테이블 (peer 3~5개 종목 수치 비교)
9. **timeline-card** — 타임라인 (공시/IR 이벤트 순서)
10. **cover-card** — 커버/썸네일 (리포트 표지, 유튜브 브리핑 표지)

---

## 4. 기술 스택

```
입력: JSON (제목, 부제, bullets, footer, theme, size 등)
      ↓
템플릿 엔진: HTML/CSS 파일 (템플릿별 1세트)
      ↓
렌더: Playwright (OpenClaw browser 도구 또는 로컬 playwright)
      ↓
출력: PNG + 입력 JSON 사이드카 저장
```

### 핵심 기술 결정 사항 (클로드코드가 판단해야 할 것)

| # | 질문 | 맥락 |
|---|------|------|
| 1 | OpenClaw 스킬 vs 워크스페이스 로컬 스킬 | 우리만 쓸 거면 로컬, 범용이면 OpenClaw |
| 2 | 템플릿 파일 구조 | `skills/card-gen/templates/{template-name}/index.html` 식? |
| 3 | 렌더 방식 | OpenClaw `browser` 도구로 충분한지, 별도 playwright 스크립트 필요한지 |
| 4 | 한글 폰트 전략 | 시스템 폰트 의존 vs 웹폰트 CDN vs 로컬 번들 |
| 5 | 산출물 저장 경로·파일명 규칙 | 옵시디언 Vault 연동 고려 |
| 6 | 차트 렌더 | SVG 인라인 vs Chart.js Canvas vs 외부 라이브러리 |

---

## 5. 디자인 가이드

### 색상
- 배경: 크림/베이지 (#FFF8F0 ~ #F5F0EB) 또는 다크 (#1A1A2E)
- 텍스트: 다크 (#2D2D2D) / 라이트 모드 기본
- 포인트: 1색 (브랜드 컬러 또는 카테고리별)
- 증가: 빨강 (#E53E3E), 감소: 파랑 (#3182CE) — 한국 주식 관례

### 타이포그래피
- 제목: 세리프 또는 볼드 산세리프 (Pretendard Bold / Noto Serif KR)
- 본문: 산세리프 (Pretendard / Noto Sans KR)
- 숫자: 고정폭 또는 tabular numerals

### 레이아웃
- 고정 구조: `제목 → 핵심 요약 → 근거 2~3개 → 출처/날짜`
- 블록 3개 이하
- 하단 메타 영역 고정 (source / date / ticker or topic)

### 사이즈 프리셋
- `slack` — 800×600px (Slack 미리보기 최적)
- `blog` — 1200×630px (OG 이미지)
- `obsidian` — 600×400px (노트 삽입용)
- `square` — 1080×1080px (SNS)

---

## 6. 스킬 인터페이스 (예시)

### SKILL.md 트리거
```
"카드 만들어", "card gen", "브리핑 카드", "summary card", "기업 카드",
"비교 카드", "커버 만들어", "차트 카드", "KPI 카드"
```

### 입력 JSON 예시 (summary-card)
```json
{
  "template": "summary-card",
  "theme": "light",
  "size": "slack",
  "title": "2026-03-31 AI 에코시스템 일일 브리핑",
  "subtitle": "Claude Opus 4 출시 영향 분석",
  "bullets": [
    "Anthropic, Claude Opus 4 정식 출시 — 코딩 벤치마크 1위",
    "OpenAI GPT-5.4 대응 업데이트 예고",
    "국내 AI 스타트업 투자 전월 대비 23% 증가"
  ],
  "footer": {
    "source": "마스터클로 일일보고",
    "date": "2026-03-31",
    "topic": "AI 에코시스템"
  }
}
```

### 출력
```
/Users/starofselfhi/Documents/Starofself/OpenClaw/cards/2026-03-31_summary_ai-ecosystem.png
/Users/starofselfhi/Documents/Starofself/OpenClaw/cards/2026-03-31_summary_ai-ecosystem.json  (입력 JSON 사이드카)
```

---

## 7. 구현 범위 (Phase)

### Phase 1 — MVP (우선)
- [ ] 스킬 디렉토리 구조 생성 (`skills/card-gen/`)
- [ ] SKILL.md 작성
- [ ] 렌더 스크립트 (`scripts/render_card.js` 또는 `.py`)
- [ ] 템플릿 3종: `summary-card`, `compare-card`, `cover-card`
- [ ] 한글 폰트 전략 확정 + 적용
- [ ] PNG + JSON 사이드카 저장
- [ ] 테스트: 각 템플릿 1장씩 생성 확인

### Phase 2 — 확장
- [ ] 나머지 템플릿 7종 추가
- [ ] 미니 차트 SVG 렌더 (Chart.js 또는 D3 lite)
- [ ] 사이즈 프리셋 4종 대응
- [ ] 다크 모드 테마

### Phase 3 — 자동화 연동
- [ ] 일일보고 → 자동 summary-card 생성
- [ ] 기업분석 → 자동 company-card 생성
- [ ] Slack 포스팅 시 카드 이미지 자동 첨부

---

## 8. 파일 구조 (안)

```
skills/card-gen/
├── SKILL.md
├── scripts/
│   └── render_card.js (or .py)
├── templates/
│   ├── summary-card/
│   │   ├── index.html
│   │   └── style.css
│   ├── compare-card/
│   │   ├── index.html
│   │   └── style.css
│   ├── cover-card/
│   │   ├── index.html
│   │   └── style.css
│   └── ... (나머지 7종)
├── presets/
│   ├── themes.json
│   └── sizes.json
└── references/
    └── design-guide.md
```

---

## 9. 기대 효과

| 항목 | Before | After |
|------|--------|-------|
| 보고서 시각화 | 텍스트만 Slack 전송 | 카드 이미지 + 텍스트 병행 |
| 일관성 | 매번 다른 포맷 | 템플릿 기반 통일된 톤 |
| 한글 정확도 | AI 이미지 글자 깨짐 | 100% 정확 |
| 재생성 | 불가능 | JSON 입력으로 언제든 재생성 |
| 대량 생산 | 수동 1장씩 | JSON 배열로 배치 생성 가능 |
| 블로그/SNS | 별도 제작 필요 | 사이즈 프리셋으로 즉시 변환 |

---

## 10. 피드백 출처

- **인사이트클로**: 브리핑 카드 유형 5종, 디자인 가이드, 텍스트 제한 원칙
- **데이터클로**: 데이터 카드 유형 5종, 숫자 규격화, SVG 차트 제안
- **원본 학습 자료**: 뽀짝이 수업 #13 — HTML→Playwright→PNG 파이프라인

---

*이 문서를 클로드코드에 전달하여 Phase 1 MVP 구현을 시작합니다.*
