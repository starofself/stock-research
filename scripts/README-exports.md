# 주요품목 수출 데이터 파이프라인

`/exports` 페이지가 사용하는 `data/exports.json`을 만드는 두 가지 경로.

## 1. 관세청 API 자동 수집 (권장, 10년치 백필 + 발표일 자동 갱신)

`.github/workflows/update-exports.yml`이 관세청 발표일(매월 1·11·15·16·21·22일 등,
11:30 KST)에 `scripts/fetch-exports-customs.mjs`를 실행해 커밋한다.

### 최초 1회 설정 (약 5분)

1. [공공데이터포털](https://www.data.go.kr) 가입 후 아래 3개 API를 **활용신청**
   (자동승인, 무료):
   - [관세청_품목별 수출입실적](https://www.data.go.kr/data/15101609/openapi.do)
   - [관세청_품목별 국가별 수출입실적](https://www.data.go.kr/data/15100475/openapi.do)
   - [관세청_국가별 수출입실적](https://www.data.go.kr/data/15101612/openapi.do)
2. 마이페이지에서 **일반 인증키(Decoding)** 를 복사
3. GitHub 리포 → Settings → Secrets and variables → Actions →
   `DATA_GO_KR_KEY` 라는 이름으로 등록
4. Actions 탭 → update-exports → **Run workflow** 실행
   (첫 실행 시 각 품목의 데이터가 2016년 1월까지 자동 백필됨)

### 품목 추가/수정

`data/export-items.json` 편집:

```json
{ "name": "디램", "hs": "8542321010", "country": null, "flow": "exp", "type": "item", "companies": "삼성전자, 하이닉스" }
```

- `hs`: HS코드(콤마로 여러 개 → 합산), `country`: ISO2 국가코드(콤마로 여러 개 → 합산)
- `flow`: `exp`(수출) / `imp`(수입), `type`: `item` / `nation`(국가 전체) / `total`(총수출)

### 안전장치

- 기존(엑셀 유래) 값과 겹치는 월을 비교해 **단위(달러/천달러, kg/톤)를 자동 보정**
- 일치율 80% 미만인 품목은 API 값을 버리고 기존 값 유지 —
  `data/exports-report.json`에서 `mismatch` 품목 확인 후 HS/국가 설정을 고칠 것

## 2. 엑셀 수동 반영

관리하던 수출입 엑셀(품목별 시트)을 그대로 반영하려면:

```bash
pip install openpyxl
python3 scripts/ingest-exports-xlsx.py 수출입.xlsx
```

시트의 원자료 블록(년월/금액달러/금액원화/중량)만 추출해 병합한다.
