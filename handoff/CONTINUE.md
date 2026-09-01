# 인수인계: 주요품목 수출 데이터 작업 마무리 (새 세션용)

> **이 문서 위치:** `starofself/stock-research` 리포, 브랜치 `claude/starfolio-export-data-graph-8mvz6t`, 경로 `handoff/CONTINUE.md`
> 새 세션은 이 리포를 클론하고 이 문서를 먼저 읽으세요. 남은 일은 **① PR #1 머지 ② leader에 수출 탭 반영** 두 가지입니다.

---

## 지금까지 된 것 (요약)
`/exports` (주요품목 수출 데이터) 기능을 stock-research에 구현 완료. 전부 브랜치
`claude/starfolio-export-data-graph-8mvz6t` 에 있고 **PR #1 (draft)** 로 열려 있음.
- 페이지: 품목 검색(이름·HS·종목) · 수출액/YoY/판가($ /kg)/중량 차트 · 월별표 · CSV/엑셀 다운로드
- 사이드바 "수출" 메뉴, ko·en 사전, 사이트맵 등록
- 데이터: 관세청 공공데이터포털 API 자동수집(2016~현재, 264품목 중 253개 API 수집, 8개 HS미지정·3개 API무데이터는 엑셀값 유지, **불일치 0**)
- 자동 갱신: `.github/workflows/update-exports.yml` 이 관세청 발표일(매월 1·11·15·21일 등) 실행. secret `DATA_GO_KR_KEY` **이미 등록됨**.

## 핵심 파일 지도
| 경로 | 내용 |
|---|---|
| `app/[lang]/exports/page.tsx` | 수출 페이지 (서버) |
| `components/ExportsView.tsx` | 수출 UI (검색·차트·표·다운로드) |
| `app/api/exports/route.ts` | 전체 데이터 JSON API |
| `lib/exports.ts` | 데이터 로더 |
| `data/exports.json` | 관세청 10년치 데이터 (자동수집 산출물) |
| `data/export-items.json` | 264품목 수집 설정(HS·국가·수출입 방향) |
| `scripts/fetch-exports-customs.mjs` | 관세청 API 수집기 |
| `scripts/ingest-exports-xlsx.py` | 원본 엑셀 → JSON 병합기 |
| `.github/workflows/update-exports.yml` | 발표일 자동수집 워크플로 |
| `scripts/README-exports.md` | 데이터 파이프라인 설명 |

---

## 남은 작업 A — PR #1 머지 (stock-research → starfolio.io 발행)
PR: https://github.com/starofself/stock-research/pull/1 (branch `claude/starfolio-export-data-graph-8mvz6t` → `main`)

1. 최신 브랜치 체크아웃 후 빌드 확인:
   ```
   git fetch origin claude/starfolio-export-data-graph-8mvz6t
   git checkout claude/starfolio-export-data-graph-8mvz6t
   npm install && npm run build      # 통과 확인
   ```
2. **머지 전에 이 핸드오프 폴더는 제거** (feature PR에 남기지 않기):
   ```
   git rm -r handoff && git commit -m "chore: remove handoff notes" && git push
   ```
3. PR을 draft 해제(ready for review) 후 main으로 머지.
4. 머지 후 https://starfolio.io/ko/exports 에서 수출 탭·차트·다운로드 정상 동작 확인.
   (Vercel 프로젝트 `stock-research`, 도메인 starfolio.io — main 머지 시 자동 배포)

> 참고: 머지가 이미 됐다면 이 브랜치는 소진된 것. 후속 변경은 main에서 새 브랜치로.

## 남은 작업 B — leader.starfolio.io 에 "수출" 탭 추가
leader.starfolio.io(주도주 스크리너 PWA)는 **별도 세션/로컬에서 Vercel CLI로 배포**되는 정적 사이트라
stock-research와 리포가 다름. 그 사이트를 관리하는 세션에서 아래 지시문을 실행하면 됨:

- **지시문:** `handoff/leader-exports/LEADER-수출탭-지시문.md` (이 리포 안. exports.html 전체 소스 포함, 자체 완결형)
- **수출 뷰어:** `handoff/leader-exports/exports.html` (leader가 이미 쓰는 lightweight-charts·다크테마 재사용)
- 방식: leader에 `exports.html` + `data/exports.json` 추가하고, 기존 파일 3곳(index.html 탭버튼 1줄 / app.js 3+1줄 / styles.css 1블록)만 **추가**. 기존 화면·아이콘·데이터 무변경.
- `data/exports.json` 은 이 리포에서 받으면 됨:
  ```
  curl -L -o data/exports.json \
    "https://raw.githubusercontent.com/starofself/stock-research/refs/heads/claude/starfolio-export-data-graph-8mvz6t/data/exports.json"
  ```

> ⚠️ 이 세션(현재)에서는 leader 소스가 없어(다른 세션 환경) 직접 배포 불가였음.
> 또한 leader를 라이브에서 통째로 재배포하려 하면 바이너리 앱아이콘(icon-192/512.png)을
> 원본 그대로 가져올 수 없어 기존 화면이 바뀜 → leader **소스가 있는 세션**에서 위 지시문대로 적용할 것.

---

## 상태 메모
- 반복 PR 체크인(트리거)은 모두 종료됨(run_once, 재발화 없음). 새로 감시하려면 subscribe_pr_activity 또는 send_later로 재설정.
- 미해결/보류: 없음. 위 A·B만 실행하면 마무리.
