# 주도주 스크리너 (leader)

`leader.starfolio.io` 로 따로 배포되던 정적 앱을 이 저장소로 이식한 것. 원본은 Vercel CLI 로 로컬 폴더에서
직접 배포돼 git 이력이 없었다 — 이제 앱을 고칠 곳은 여기다.

## 지금 뭐가 어디로 가나

| 주소 | 동작 |
| --- | --- |
| `starfolio.io/` | **307 리다이렉트 → `leader.starfolio.io`** (운영 중인 스크리너, 손대지 않음) |
| `starfolio.io/leader/` | 이 저장소의 앱 — 여기서 고치고 확인한다 |
| `starfolio.io/ko` · `/en` | 기존 리서치 대시보드 (그대로) |

리다이렉트는 `next.config.ts` 의 `redirects()` 에 있고 `permanent: false`(307) 라 브라우저가 영구 캐시하지
않는다. 이 저장소 버전으로 갈아탈 준비가 되면 그 한 줄을 지우고 `rewrites().beforeFiles` 로
`{ source: "/", destination: "/leader/index.html" }` 를 넣으면 루트가 이 앱을 서빙한다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 앱 셸 — 시장 스위치(한국·미국·중국) + 탭 바 |
| `app.js` | 전체 로직 — 목록·상세·차트·법칙·리서치 탭 |
| `styles.css` | 스타일 |
| `coins.html` | 🪙 코인 탭 (iframe) |
| `data/credit.json` | 💳 신용잔고 탭 데이터 (kr·us·cn 1년치 주간) |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA |
| `lib/lightweight-charts.standalone.production.js` | 차트 라이브러리 (npm `lightweight-charts@4.2.3` 의 standalone 빌드) |

## 데이터

스냅샷 데이터(`data/latest_{kr,us,cn}.json`, `data/coins.json` 등)는 아직 **로컬 파이썬 파이프라인이
`leader.starfolio.io` 로 퍼블리시**한다. 그래서 이 앱은 그 오리진에서 데이터를 읽는다
(`Access-Control-Allow-Origin: *` 라 크로스 오리진 fetch 가 된다).

- `app.js` 의 `DATA_BASE`
- `coins.html` 의 `DATA_BASE`

데이터까지 이 저장소로 옮기면 두 곳 다 `""` 로 바꾸고 `public/leader/data/` 에 JSON 을 넣으면 된다.

같은 이유로 🚢 수출 탭은 아직 `leader.starfolio.io` 의 `exports.html` 을 iframe 으로 띄운다.
옮기려면 파일을 여기 복사하고 `app.js` 의 iframe `src` 에서 `${DATA_BASE}` 를 떼면 된다.

## 💳 신용잔고 탭 (구 체온 탭)

여러 지표를 섞어 하나의 "시장 온도"를 내던 체온 탭은 걷어냈다. 대신 **신용잔고 하나만** 보여주고,
한국·미국·중국은 상단 시장 스위치로 갈아끼운다(시장 종속 탭이라 `MARKET_FREE_TABS` 에 넣지 않는다).
화면은 최신값 · 최근 4주 · 1년 증감 + 1년 최고/최저 + 최근 1년 주간 추이 차트다.

데이터는 `public/leader/data/credit.json`:

```jsonc
{
  "as_of": "2026-08-14",
  "sample": true,            // ← 실데이터 붙이면 이 플래그를 지운다. 지우면 화면의 노란 경고도 사라진다.
  "markets": {
    "kr": {
      "label": "한국",
      "name": "신용거래융자 잔고",
      "unit": "조원",
      "decimals": 2,          // 표시 소수 자릿수
      "source": "금융투자협회 · KRX",
      "series": [{ "t": "2025-08-15", "v": 19.4 }]   // 주간, 오래된 것 → 최신 순
    }
    // us: 마진부채(FINRA), cn: 융자융권 잔고(상하이·선전)
  }
}
```

**지금 들어 있는 값은 UI 확인용 샘플이다.** 실제 수치가 아니고, 화면 상단에도 그렇게 표시된다.
수집 소스(한국 금투협/KRX · 미국 FINRA · 중국 거래소)를 붙여 같은 스키마로 이 파일을 갱신하면 된다.

## 시장과 무관한 탭

`app.js` 의 `MARKET_FREE_TABS` 에 들어간 탭은 한국·미국·중국 스위치와 무관하게 동작하고,
활성화되면 시장 스위치와 기준일 배지를 숨긴다.

- `coins` — 코인은 24시간 글로벌 시장이라 국가 구분이 없다
- `research` — 내가 쓴 노트라 시장 구분이 없다

## 리서치 탭

`/api/research` 가 `content/notes/**` 의 마크다운을 읽어 목록과 폴더별 적재 현황을 내려준다.
탭 상단의 **업로드 점검** 패널이 폴더별 노트 수·최근 날짜·요약 누락을 보여주므로,
올린 리서치가 제대로 붙었는지 여기서 바로 확인할 수 있다.

노트 폴더(`lib/content.ts` 의 `NOTE_DIRS`):

```
content/notes/oc        기업노트
content/notes/industry  산업
content/notes/research  딥리서치
content/notes/theme     테마
content/notes/daily     데일리
```
