# Fastly(FSLY) 딥리서치 — 엣지클라우드 강자인가?

작성일: 2026-05-10

## 0. 한 줄 결론

Fastly는 **엣지클라우드/프로그래머블 CDN의 기술력 있는 전문 강자**는 맞지만, **시장 지배적 강자**라고 보기는 어렵다. 고성능 CDN, 즉시 퍼지, VCL/Compute 기반의 개발자 제어력은 강하지만, 매출 규모·보안 포트폴리오·고객 저변·수익성·플랫폼 생태계까지 합치면 Cloudflare, Akamai, AWS 쪽이 더 큰 강자다.

투자 관점에서는 “제2의 Cloudflare”라기보다 **고성능 programmable CDN/edge specialist의 턴어라운드**로 보는 것이 더 정확하다.

---

## 1. Fastly는 무엇을 하는 회사인가?

Fastly는 웹/앱/API 트래픽을 사용자 가까운 엣지에서 처리하는 인프라 플랫폼 회사다.

주요 제품군:

- Network Services
  - CDN, dynamic site acceleration, origin shield, instant purge, load balancing, image optimization 등
- Security
  - Next-Gen WAF, DDoS mitigation, bot management, API security
- Compute
  - WebAssembly 기반 edge serverless / Compute@Edge
- Observability
  - real-time logging, metrics, dashboard, traffic/security insight

사업모델은 여전히 usage-based network services가 중심이고, security 등은 구독형/고정 반복 매출 성격이 더 강하다.

---

## 2. 최근 4개년 10-K 핵심 수치

단위: 백만 달러. FCF = 영업현금흐름 - Capex.

### FY2022

- 매출: $432.7
- Gross profit: $209.8
- Gross margin: 48.5%
- Operating loss: -$246.2
- Net loss: -$190.8
- 영업현금흐름: -$69.6
- Capex: $20.0
- FCF: -$89.6
- 현금 + 시장성증권: $518.0
- RPO: $198.3
- 총 고객: 2,958
- Enterprise customers: 493
- Enterprise customer 매출 비중: 89%
- Average enterprise customer spend: $782k
- DBNER: 122.7%
- LTM NRR: 119.1%
- Top 10 고객 매출 비중: 35%

### FY2023

- 매출: $506.0
- Gross profit: $266.3
- Gross margin: 52.6%
- Operating loss: -$198.0
- Net loss: -$133.1
- 영업현금흐름: $0.4
- Capex: $11.0
- FCF: -$10.6
- 현금 + 시장성증권: $322.7
- RPO: $235.7
- 총 고객: 3,243
- Enterprise customers: 578
- Average enterprise customer spend: $880k
- Annual Revenue Retention Rate: 99.2%
- DBNER: 119.0%
- LTM NRR: 113.4%
- Top 10 고객 매출 비중: 37%

### FY2024

- 매출: $543.7
- Gross profit: $295.9
- Gross margin: 54.4%
- Operating loss: -$167.9
- Net loss: -$158.1
- 영업현금흐름: $16.4
- Capex: $10.3
- FCF: $6.1
- 현금 + 시장성증권: $295.9
- RPO: $244.4
- 총 고객: 3,061
- Enterprise customers: 596
- Annual Revenue Retention Rate: 99.0%
- LTM NRR: 102.3%
- Top 10 고객 매출 비중: 33%
- TikTok은 최대 고객 중 하나로 언급됨

### FY2025

- 매출: $624.0
- Gross profit: $356.2
- Gross margin: 57.1%
- Operating loss: -$119.0
- Net loss: -$121.7
- 영업현금흐름: $94.4
- Capex: $28.7
- FCF: $65.8
- 현금 + 시장성증권: $361.8
- RPO: $353.8
- 총 고객: 3,092
- Enterprise customers: 628
- Annual Revenue Retention Rate: 98.7%
- LTM NRR: 110.1%
- Top 10 고객 매출 비중: 32%
- 단일 고객 10% 초과 없음. 단, affiliated customers 기준 약 10% 고객군 존재.
- TikTok은 최대 고객 중 하나로 계속 언급되며, 미국 규제/구조개편이 트래픽에 미칠 영향은 불확실하다고 공시.

---

## 3. 4년간 숫자에서 보이는 변화

### 좋아진 점

- 매출: $432.7m → $624.0m
- Gross margin: 48.5% → 57.1%
- Operating loss: -$246.2m → -$119.0m
- FCF: -$89.6m → +$65.8m
- RPO: $198.3m → $353.8m
- Enterprise customers: 493 → 628

즉, Fastly는 성장률이 폭발적이지는 않지만, 수익성/현금흐름/계약 가시성이 확실히 개선됐다.

### 나빠졌거나 주의할 점

- LTM NRR: 2022년 119% → 2024년 102%까지 하락 후 2025년 110% 회복
- 고객 수는 2023~2025년 큰 폭 성장보다는 정체/완만한 증가
- Top 10 고객 비중이 여전히 30%대 초중반
- TikTok/ByteDance 같은 대형 고객 규제 리스크 존재
- GAAP 기준 아직 영업적자
- CDN 가격 경쟁/클라우드 번들링 압력 지속

---

## 4. 사업모델 변화

### 1) Programmable CDN에서 Edge Cloud Platform으로 확장

2022년 10-K는 “Programmable Edge Platform” 성격이 강했다. 2025년 10-K에서는 “Fastly Platform”으로 표현이 넓어지고, cloud-native application, serverless development, web/API protection, edge computing, emerging AI workloads까지 포함한다.

해석:
- 단순 CDN 회사에서 performance + security + compute + observability를 묶은 edge cloud 플랫폼으로 포지셔닝을 확장 중.
- 다만 Cloudflare처럼 풀스택 개발자 플랫폼이 된 것은 아직 아니다.

### 2) Usage-based 모델에서 반복/보안 매출 비중 확대

Fastly 매출은 여전히 트래픽/사용량 기반이 중심이다. 그러나 Security 제품은 주로 연간 구독/선불 청구 성격이라 매출 안정성을 높일 수 있다.

### 3) 고객지표 공시 변화

2023년 고객 수 산정 방식 변경. 2024년부터 Average Enterprise Customer Spend, DBNER, quarterly NRR을 핵심지표에서 제외하고 Total Customer Count, Enterprise Customer Count, Annual Revenue Retention Rate, LTM NRR, RPO 중심으로 바꿈.

해석:
- usage-based 분기 변동성보다 장기 retention/RPO를 강조하려는 방향.
- 동시에 DBNER 같은 과거 고성장 지표가 약해진 것을 덜 강조하려는 면도 있다.

### 4) GTM 변화

2024년에 대형 delivery/media 고객의 트래픽/가격 리셋 충격이 오면서 전략을 전환했다.

- 대형 media 고객 의존도 축소
- top 10 외 고객 성장 확대
- 패키징 단순화
- channel/demand generation 강화
- self-service/trial/onboarding friction 감소
- security/compute 크로스셀 확대

---

## 5. 컨퍼런스콜 기반 변화 타임라인

### 2022년: 새 CEO, 제품 확장, 엔터프라이즈 확대

- Todd Nightingale CEO 선임.
- Compute@Edge, Observability, Next-Gen WAF 확장.
- 엔터프라이즈 고객 493개, LTM NRR 119%, DBNER 123%.
- churn은 낮았으나 low-end 고객에서는 churn 증가 언급.

### 2023년: 운영규율과 GTM 정비

- operational and financial rigor 강조.
- go-to-market, packaging, channel 개선.
- 고객 3,243개, enterprise 578개, LTM NRR 113%.
- RPO $245m 수준.

### 2024년: 대형 고객 충격과 구조조정

가장 중요한 변곡점.

- Q1~Q2에 대형 delivery/media 고객들의 트래픽 전망 둔화.
- 고객들이 수익성을 중시하며 트래픽 성장률이 낮아짐.
- multi-vendor 전략, re-rate, 가격/볼륨 리셋 영향.
- LTM NRR: Q1 114% → Q4 102%.
- Top 10 매출 비중은 낮아졌지만, 일부는 좋은 의미의 다변화라기보다 대형 고객 매출 감소 때문.
- 구조조정과 비용절감 시행. 2024년 하반기 operating expense 약 $14m 절감 기대 언급.

### 2025년: Kip Compton 체제, 회복 시작

- Kip Compton CEO 선임.
- CFO/GTM 리더십 변화.
- 2025 Q1 LTM NRR 100% 저점 후 Q4 110% 회복.
- RPO $354m, YoY +55%.
- Enterprise 고객 628개.
- Top 10 외 고객도 성장, top 10도 다시 성장 전환.
- Security revenue Q4 $35.4m, YoY +32%, 총매출 21%.
- Compute/Other Q4 $6.4m, YoY +78%.
- AI traffic, AI bot mitigation, edge inference 관련 수요를 새로운 성장축으로 언급.

### 2026 Q1 최신

- 매출 $173m, YoY +20%.
- LTM NRR 113%.
- RPO $369m, YoY +63%.
- Large customer 634개.
- 단일 고객 10% 초과 없음, affiliated customers도 10% 초과 없음.
- Security revenue $38.8m, YoY +47%, 총매출 22%.
- Compute/other revenue $8m, YoY +67%.
- FY2026 가이던스:
  - 매출 $710m~$725m
  - non-GAAP operating income $58m~$68m
  - non-GAAP EPS $0.27~$0.33
  - FCF $40m~$50m
- CapEx는 2026년 매출의 10~12%로 증가 전망. 2025년 약 5%보다 높아짐.

---

## 6. 고객 변화 추이

### Enterprise/Large customer 수

- 2022 Q4: 493
- 2023 Q4: 578
- 2024 Q2: 601
- 2024 Q3: 576
- 2024 Q4: 596
- 2025 Q1: 595
- 2025 Q2: 622
- 2025 Q3: 627
- 2025 Q4: 628
- 2026 Q1: 634

해석:
- 2024년에 흔들렸지만 2025~2026에는 완만하게 회복.
- 단순 고객 수 폭증형 회사는 아니다. 대형/고가치 고객 내 침투율과 usage가 더 중요하다.

### LTM NRR

- 2022 Q4: 119%
- 2023 Q4: 113%
- 2024 Q1: 114%
- 2024 Q2: 110%
- 2024 Q3: 105%
- 2024 Q4: 102%
- 2025 Q1: 100%
- 2025 Q2: 104%
- 2025 Q3: 106%
- 2025 Q4: 110%
- 2026 Q1: 113%

해석:
- 2024 대형고객 리셋이 핵심 악재.
- 2025부터 회복세. 2026 Q1 113%는 턴어라운드 신호.

### Top 10 고객 의존도

- 2022: 35%
- 2023: 37%
- 2024: 33%
- 2025: 32%
- 2026 Q1: 34%

해석:
- 단일 고객 10% 초과는 사라졌으나, top 10 비중은 여전히 높다.
- TikTok/ByteDance 규제 리스크는 완전히 사라진 것이 아니다.

---

## 7. Fastly는 엣지클라우드 강자인가?

### 맞는 부분

Fastly는 아래 영역에서는 강자다.

- 고성능 CDN
- 실시간 캐시 퍼지
- 개발자가 제어 가능한 VCL/edge logic
- 미디어/뉴스/커머스/대형 트래픽 고객
- WebAssembly 기반 Compute@Edge
- 독립 edge vendor로서 멀티클라우드 환경에 적합

### 아닌 부분

하지만 전체 엣지클라우드 시장의 절대 강자는 아니다.

- Cloudflare 대비 고객 수와 플랫폼 생태계가 작음
- Akamai 대비 매출/수익성/엔터프라이즈 보안 기반이 약함
- AWS/Azure/GCP 대비 클라우드 번들링 파워가 약함
- Security 브랜드는 Cloudflare/Akamai/Imperva/F5보다 약함
- GAAP 수익성은 아직 적자

결론: **기술력 있는 니치 리더 / 전문 강자**이지, **시장 지배자**는 아니다.

---

## 8. 경쟁사 비교

### Cloudflare(NET)

- 2025 매출: 약 $2.168B
- 성장률: 약 29.8%
- Gross margin: 약 74.5%
- 유료 고객: 약 332,000
- $100k+ 고객: 4,298
- DBNRR: 약 120%
- 강점: CDN + 보안 + Zero Trust + Workers + R2/D1/AI + 대규모 개발자 생태계
- Fastly 대비: 플랫폼 폭, 고객 저변, 성장률, 총마진 우위

### Akamai(AKAM)

- 2025 매출: 약 $4.208B
- 성장률: 약 5.4%
- 영업이익률: 약 13.5%
- 강점: 전통 CDN, 대형 엔터프라이즈, 보안, API/Bot/DDoS, 장기 고객관계
- Fastly 대비: 규모/수익성/보안 엔터프라이즈 신뢰 우위
- Fastly 우위: 개발자 친화성, 현대적 programmable edge 이미지

### AWS CloudFront

- 750+ POP, 100+ 도시, 50+ 국가, 1,140+ embedded POP 공시
- 강점: S3, Lambda@Edge, CloudFront Functions, WAF, Shield, AWS 리전 통합
- Fastly 대비: 클라우드 번들링과 인프라 규모 압도
- Fastly 우위: 독립 CDN 전문성과 세밀한 캐시/퍼지 제어

### Google Cloud CDN / Microsoft Azure Front Door

- 클라우드 고객에게 자연스러운 CDN/edge 옵션
- Google/Microsoft 글로벌 네트워크와 통합
- Fastly 대비: 클라우드 번들 파워 우위
- Fastly 우위: CDN 전문업체로서의 기능/개발자 제어력

### Vercel / Netlify

- 프론트엔드 개발자 경험, Git 기반 배포, Preview deployment, Edge Functions 강점
- 범용 CDN/보안보다는 프론트엔드 앱 플랫폼
- Fastly는 인프라/CDN 성능 쪽, Vercel/Netlify는 개발 워크플로우 쪽 강점

### Imperva / F5

- CDN보다 WAF, DDoS, Bot, WAAP, API security 전문
- 보안 구매 의사결정에서는 Fastly보다 강한 브랜드가 될 수 있음

### Edgio

- 과거 CDN/edge 경쟁사였으나 2024년 Chapter 11 파산보호 신청 및 자산 매각 진행
- 독립 CDN 사업의 가격 경쟁/규모의 경제 압박을 보여주는 사례
- Fastly에는 경쟁 완화 요인이지만, 동시에 독립 CDN 모델의 구조적 난이도를 보여줌

---

## 9. Fastly의 moat

- 고성능 CDN 아키텍처
- 대형 POP 중심 네트워크와 빠른 캐시 처리
- Instant purge
- VCL 기반 세밀한 제어
- WebAssembly 기반 Compute@Edge
- 미디어/퍼블리싱/커머스 대형 고객 레퍼런스
- 멀티클라우드/독립 벤더 포지션

## 10. Fastly의 약점

- 고객 집중도 높음
- Cloudflare 대비 개발자 생태계와 제품 폭 부족
- Akamai 대비 수익성과 엔터프라이즈 보안 신뢰도 부족
- AWS/Azure/GCP 대비 번들링 약함
- 가격 경쟁과 트래픽 단가 하락 압력
- 사용량 기반 모델이라 대형 고객 트래픽 감소에 민감
- GAAP 영업적자 지속
- 2026년 CapEx 증가로 FCF가 매출 성장만큼 늘지 않을 수 있음

---

## 11. 투자 관점 시나리오

### Bull case

- LTM NRR 110% 이상 유지/상승
- Security 30~40%대 성장 지속
- Compute/AI workload가 실제 매출 축으로 커짐
- Top 10 외 고객 성장 지속
- TikTok/ByteDance 규제 리스크 완화
- 2026~2027년 non-GAAP 영업이익과 FCF가 안정화
- Fastly가 고성능 edge + AI traffic + bot/security 수혜주로 재평가

### Base case

- 매출 성장 15~20%대
- NRR 108~113% 수준 유지
- 보안/컴퓨트는 성장하지만 전체 매출 비중은 아직 20%대
- GAAP 흑자 전환까지는 시간 필요
- Cloudflare 대비 할인받는 edge/CDN specialist 포지션 지속

### Bear case

- 대형 고객 트래픽/가격 리셋 재발
- TikTok/ByteDance 등 특정 고객 리스크 현실화
- Cloudflare/AWS/Akamai에 신규 고객 확보 밀림
- Security/Compute가 충분히 크지 못하고 CDN 가격경쟁에 묶임
- CapEx 증가로 FCF 둔화
- “edge cloud 플랫폼”이 아니라 “느리게 성장하는 CDN”으로 밸류에이션 축소

---

## 12. 앞으로 봐야 할 지표

- LTM NRR: 110% 이상 유지 여부
- Enterprise/Large customers: 634개에서 계속 증가하는지
- Top 10 고객 비중: 30% 초반 이하로 내려가는지
- 단일/affiliated customer 10% 초과 재발 여부
- Security revenue 성장률: 30% 이상 유지 여부
- Compute/Other revenue: AI/edge workload로 실제 규모 커지는지
- RPO 성장률: 50%대 성장 지속 여부
- Gross margin: CapEx 증가에도 60%대 non-GAAP 유지 여부
- FCF: 2026년 $40~50m 가이던스 달성 여부
- GAAP operating loss 축소 속도

---

## 13. 최종 판단

Fastly는 “엣지클라우드 강자냐?”라고 물으면 **기술적으로는 강자, 시장지배력으로는 중간 강자**라고 보는 게 맞다.

- Cloudflare처럼 대중적 개발자 플랫폼이 된 것은 아니다.
- Akamai처럼 거대 엔터프라이즈 보안/CDN 현금창출 기업도 아니다.
- AWS/Azure/GCP처럼 클라우드 번들링 힘도 없다.
- 대신 Fastly는 고성능 CDN, 즉시 퍼지, programmable edge, 미디어/커머스 대형 트래픽 처리에서 분명한 차별성이 있다.

따라서 리서치 관점에서는 Fastly를 **“엣지클라우드 플랫폼 대장주”가 아니라 “고성능 CDN/edge specialist의 수익성 턴어라운드 + Security/Compute 옵션”**으로 추적하는 것이 적절하다.

---

## 14. 주요 출처

### Fastly 10-K

- FY2025 10-K: https://www.sec.gov/Archives/edgar/data/1517413/000151741326000053/fsly-20251231.htm
- FY2024 10-K: https://www.sec.gov/Archives/edgar/data/1517413/000151741325000063/fsly-20241231.htm
- FY2023 10-K: https://www.sec.gov/Archives/edgar/data/1517413/000151741324000048/fsly-20231231.htm
- FY2022 10-K: https://www.sec.gov/Archives/edgar/data/1517413/000151741323000035/fsly-20221231.htm

### Fastly 실적발표/컨퍼런스콜

- 2025 Q4 release: https://www.sec.gov/Archives/edgar/data/1517413/000151741326000026/ex991-fslypressrelease1231.htm
- 2026 Q1 release: https://www.sec.gov/Archives/edgar/data/1517413/000151741326000129/ex991-fslypressrelease33126.htm
- 2026 Q1 transcript: https://www.fool.com/earnings/call-transcripts/2026/05/06/fastly-fsly-q1-2026-earnings-transcript/
- 2025 Q4 transcript: https://www.fool.com/earnings/call-transcripts/2026/02/12/fastly-fsly-q4-2025-earnings-call-transcript/
- 2024 Q4 transcript: https://www.fool.com/earnings/call-transcripts/2025/02/12/fastly-fsly-q4-2024-earnings-call-transcript/

### 경쟁사/제품

- Fastly network: https://www.fastly.com/network-map
- Fastly Compute: https://www.fastly.com/products/edge-compute
- Fastly WAAP/security: https://www.fastly.com/products/web-application-api-protection
- Cloudflare network: https://www.cloudflare.com/network/
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Akamai: https://www.akamai.com/
- AWS CloudFront: https://aws.amazon.com/cloudfront/features/
- Google Cloud CDN locations: https://cloud.google.com/cdn/docs/locations
- Azure Front Door: https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview
- Vercel CDN: https://vercel.com/docs/cdn
- Edgio Chapter 11 8-K: https://www.sec.gov/Archives/edgar/data/1391127/000119312524215572/d795614d8k.htm
