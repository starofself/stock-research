# Twilio(TWLO) 딥리서치 — CPaaS/고객참여 플랫폼 강자인가?

작성일: 2026-05-10

## 0. 한 줄 결론

Twilio는 **CPaaS/커뮤니케이션 API의 대표 강자**가 맞다. Messaging, Voice, Email/SendGrid, Verify, Flex, Segment까지 가진 제품 폭과 개발자 mindshare는 여전히 최상위권이다.

다만 Twilio를 “고객참여 플랫폼 전체의 절대 강자”로 보면 과하다. 마케팅 자동화/CRM/고객지원/AI contact center까지 넓히면 Salesforce, Braze, Klaviyo, HubSpot, Zendesk/Intercom, AWS/Microsoft와 경쟁해야 한다.

정확한 포지션은 다음과 같다.

> **Twilio = 글로벌 CPaaS/커뮤니케이션 API의 대표 강자 + Segment/Flex/SendGrid/Verify를 통한 고객참여 플랫폼 확장 + AI 시대 voice/messaging 인프라 턴어라운드 기업**

---

## 1. Twilio는 무엇을 하는 회사인가?

Twilio는 기업이 앱/웹/서비스 안에 문자, 음성, 이메일, 인증, 고객 데이터, 컨택센터 기능을 API로 붙일 수 있게 해주는 플랫폼이다.

주요 제품군:

- Messaging: SMS, MMS, WhatsApp, RCS 등
- Voice: programmable voice, SIP, PSTN 연결, IVR, AI voice agent 연동
- Email/SendGrid: 대량 이메일 API 및 마케팅 캠페인
- Verify: OTP, 2FA, passkeys, Fraud Guard, Lookup 등 인증/identity
- Flex: programmable contact center
- Segment: customer data platform/CDP
- AI/CustomerAI: 데이터·커뮤니케이션 기반 개인화/자동화/AI agent 연결

매출은 Messaging/Voice/Verify 같은 사용량 기반이 크고, Email/Segment는 구독형 성격이 더 강하다.

---

## 2. 최근 4개년 10-K 핵심 수치

단위: 백만 달러. FCF = 영업현금흐름 - productive assets/capex 취득.

### FY2022

- 매출: $3,826.3
- Gross profit: $1,813.6
- Gross margin: 47.4%
- Operating loss: -$1,205.3
- Net loss: -$1,256.1
- 영업현금흐름: -$254.4
- Capex: $34.4
- FCF: -$288.8
- 현금+단기 AFS 증권: $4,155.1
- Active Customer Accounts: 290,000
- DBNER: 121%
- Top 10 active customers 매출 비중: 12%
- 10% 초과 단일 고객: 없음
- RPO: $154.5
- 구조조정/손상:
  - 인력 약 11% 감축
  - restructuring charges $76.6m
  - long-lived asset impairment $97.7m

### FY2023

- 매출: $4,153.9
- Gross profit: $2,043.9
- Gross margin: 49.2%
- Operating loss: -$876.5
- Net loss: -$1,015.4
- 영업현금흐름: $414.8
- Capex: $11.3
- FCF: $403.4
- 현금+단기 AFS 증권: $4,012.0
- Active Customer Accounts: 305,000
- DBNER: 103%
- Top 10 active customers 매출 비중: 10%
- 10% 초과 단일 고객: 없음
- RPO: $144.0
- 구조조정/손상:
  - 2023년 2월 인력 약 17% 감축
  - restructuring charges 총 $165.7m
  - long-lived asset impairment $320.5m
  - Segment 관련 intangible impairment $285.7m
  - strategic investment impairment $46.2m

### FY2024

- 매출: $4,458.0
- Gross profit: $2,278.2
- Gross margin: 51.1%
- Operating loss: -$53.7
- Net loss: -$109.4
- 영업현금흐름: $716.2
- Capex: $7.0
- FCF: $709.3
- 현금+단기 AFS 증권: $2,384.4
- Active Customer Accounts: 325,000
- DBNER: 104%
- Top 10 active customers 매출 비중: 10%
- 10% 초과 단일 고객: 없음
- RPO: $182.3
- 유의미한 신규 구조조정 없음
- strategic investment impairment $8.2m

### FY2025

- 매출: $5,067.2
- Gross profit: $2,478.7
- Gross margin: 48.9%
- Operating income: $157.8
- Net income: $33.8
- 영업현금흐름: $1,003.2
- Capex: $5.8
- FCF: $997.4
- 현금+단기 AFS 증권: $2,470.3
- Active Customer Accounts: 402,000
- DBNER: 108%
- Top 10 active customers 매출 비중: 9%
- 10% 초과 단일 고객: 없음
- RPO: $175.2
- equity method investment impairment $80.6m
- goodwill impairment 없음

---

## 3. 4년 숫자에서 보이는 변화

### 좋아진 점

- 매출: $3.83B → $5.07B
- Operating loss: -$1.21B → operating income +$158m
- Net loss: -$1.26B → net income +$34m
- FCF: -$289m → +$997m
- Active customers: 290k → 402k
- Top 10 고객 비중: 12% → 9%
- DBNER: 2023년 103% 저점 이후 2025년 108%로 회복

### 주의할 점

- Gross margin은 2024년 51.1%에서 2025년 48.9%로 하락
- 통신사 비용/A2P fee pass-through가 매출은 올리지만 margin rate를 누를 수 있음
- 2023년에 Segment 관련 대규모 impairment 발생
- Segment/CDP 단독 성장성은 기대보다 약했음
- GAAP 흑자는 2025년에 막 전환된 단계
- 고성장 SaaS보다는 수익성·현금흐름 중심의 mature platform 성격이 강해짐

---

## 4. 사업모델 변화

### 2022년: 성장 우선 CPaaS + 고객참여 확장

- Messaging/Voice 중심 CPaaS에 Segment, SendGrid, Flex를 더해 customer engagement platform을 지향.
- 30%+ growth 논리에서 organic growth 15~25%, software products 30%+로 현실화.
- A2P 10DLC, 국제 메시징 mix, 통신사 비용 상승이 margin 압박으로 등장.

### 2023년: 구조조정과 사업부 분리

- Communications와 Data & Applications/Segment로 분리.
- 인력 17% 감축, 비용 구조조정.
- Segment 성장 부진과 손상차손으로 “CDP 독립 성장주” 스토리 훼손.
- Twilio의 초점이 성장률에서 non-GAAP operating income/FCF로 이동.

### 2024년: 효율적 성장과 Segment 재해석

- Khozema Shipchandler CEO 체제.
- Communications는 회복, Segment는 Communications를 강화하는 데이터 레이어로 재포지셔닝.
- Segment DBNER는 낮지만, 고객 데이터/개인화/AI context 측면에서 전략적 역할 유지.
- DBNE 102%에서 106%로 회복.

### 2025년: 단일 플랫폼/AI customer engagement로 재통합

- 기존 Communications/Segment 별도 사업부 구조를 해체하고 단일 operating/reportable segment로 전환.
- 제품별 매출:
  - Messaging: $2,878.3m
  - Voice: $615.7m
  - Email/SendGrid: $523.5m
  - Segment: $303.3m
  - Other Communications: $746.5m
- 전략은 Communications + contextual data + AI를 하나의 customer engagement platform으로 통합하는 방향.

---

## 5. 컨퍼런스콜 기반 변화 타임라인

### 2022년: 성장 우선에서 수익성 압박 시작

- Q3 2022 active customer accounts 약 280k.
- Q3 DBNE 122%, Q4 DBNE 110%.
- Messaging은 핵심 매출원이나 국제 mix/A2P 10DLC/통신사 비용이 margin 압박.
- Flex/Segment/Engage는 고객 engagement stack 상위 레이어로 투자.
- Twilio는 장기 organic growth 목표를 15~25%로 현실화.

### 2023년: 구조조정과 수익성 우선 전환

- 2023년 2월 약 17% 인력 감축.
- Communications와 Data & Applications로 분리.
- DBNE: Q2 103%, Q3 101%, Q4 102%.
- Segment는 churn/contraction이 높아 약세.
- Crypto 및 특정 vertical 약세, macro 영향.
- non-GAAP operating income과 FCF 창출이 경영진 메시지의 중심으로 이동.

### 2024년: 효율적 성장, Segment 재정의, DBNE 회복

- Jeff Lawson 퇴임 후 Khozema Shipchandler가 CEO로 전면 등장.
- Active customer accounts 2024년 말 325k+.
- DBNE: Q1 102%, Q2 102%, Q3 105%, Q4 106%.
- Communications DBNE Q4 108%, Segment DBNE 93%.
- Segment는 단독 고성장 SaaS보다 data interoperability + communications enrichment로 재해석.
- FY2024 revenue $4.458B, organic growth 9%, non-GAAP operating income $714m, FCF $657m.

### 2025년: 성장 재가속과 AI-native 고객 등장

- Active customer accounts 2025년 말 335k+.
- DBNE: Q1 107%, Q2 108%, Q3 109%, Q4 109%.
- FY2025 DBNER 108%.
- Messaging revenue +18%.
- Voice revenue +13%.
- Email revenue +7%.
- Segment revenue +2%.
- Verify는 Q4 2025 두 분기 연속 25%+ 성장.
- Self-serve revenue +28%, ISV +26%.
- AI-native 고객과 Voice AI, Branded Calling, Conversational Intelligence가 새 성장축으로 언급.
- FY2025 revenue $5.07B, organic growth 13%, non-GAAP operating income $924m, FCF $945m.

### 최신 Q1 2026: AI/Voice가 성장 내러티브 중심

- Revenue $1.407B, YoY +20%.
- Organic revenue growth +16%, 2022년 이후 가장 빠른 organic growth.
- Non-GAAP operating income $279m, margin 19.8%.
- FCF $132m. 단, 2025 cash bonus 지급 $141m 영향 포함.
- DBNE 114%. 단, incremental carrier fees가 약 4pt 기여.
- Messaging growth 가속, WhatsApp/RCS 강세.
- RCS volume QoQ 2배 이상 증가.
- Voice revenue +20%, 6개 분기 연속 성장 가속.
- Software add-on revenue +20% 이상. Verify, Branded Calling, Conversational Intelligence 주도.
- Self-serve와 ISV revenue 각각 25%+ 성장.
- FY2026 organic growth 가이던스 9.5~10.5%로 상향.
- FY2026 reported revenue growth 14~15%.
- FY2026 non-GAAP operating income $1.08B~$1.10B.
- FY2026 FCF $1.08B~$1.10B.

---

## 6. 고객 변화 추이

### Active Customers

- 2021년 말: 256k+
- Q3 2022: 약 280k
- FY2022: 290k
- FY2023: 305k
- FY2024: 325k
- FY2025: 402k
- 2026년부터는 Active Customer Accounts보다 DBNE/customer accounts 중심으로 metric 설명 전환

### DBNER/DBNE

- FY2022: 121%
- FY2023: 103%
- FY2024: 104%
- FY2025: 108%
- Q1 2026: 114%

해석:
- 2022년 고성장 이후 2023년 급락.
- 2024~2026년 회복 추세.
- Q1 2026 114%는 좋지만 carrier fee pass-through 약 4pt 기여를 감안해야 함.

### Top 10 고객 집중도

- FY2022: 12%
- FY2023: 10%
- FY2024: 10%
- FY2025: 9%
- 단일 고객 10% 초과 없음

해석:
- Fastly와 달리 고객 집중 리스크는 낮은 편.
- Twilio의 리스크는 특정 고객보다 통신사 비용, 가격경쟁, usage/macro, 제품별 성장성에 더 가깝다.

---

## 7. 주요 제품별 변화

### Messaging

- Twilio 최대 매출원.
- FY2025 매출 $2.88B.
- WhatsApp, RCS, 국제 메시징, A2P fee pass-through가 성장에 기여.
- 리스크: 통신사 비용 상승, pass-through revenue로 gross margin rate 하락 가능.

### Voice

- FY2025 매출 $615.7m.
- Q1 2026 Voice revenue +20%.
- AI voice agent, Conversational Intelligence, Branded Calling, Flex 연동이 새 성장축.
- Twilio가 AI 시대에 다시 주목받을 수 있는 핵심 포인트.

### Email/SendGrid

- FY2025 매출 $523.5m.
- 성장률은 높지 않지만 대량 이메일 API에서 안정적 포지션.
- Marketing Campaigns와 함께 고객참여 멀티채널 stack 일부.

### Segment

- FY2025 매출 $303.3m.
- FY2025 성장률 2% 수준.
- 2023년 대규모 impairment가 있었고 독립 CDP 성장 스토리는 약화.
- 하지만 AI 개인화, 고객 데이터 context, journey orchestration 측면에서 전략적 역할은 유지.

### Verify / Identity

- 2025~2026 high-margin software add-on 성장축.
- OTP, 2FA, passkeys, Fraud Guard, Lookup API 등.
- Messaging/Voice보다 마진 질이 좋을 가능성이 높아 중요.

### Flex

- Programmable contact center.
- Amazon Connect, Salesforce Service Cloud, Zendesk, Genesys, Five9, NICE 등과 경쟁.
- Twilio 전체 성장 재가속의 핵심 단독 동력이라기보다 Voice/AI/Segment와 결합되는 옵션으로 보는 게 적절.

---

## 8. Twilio는 CPaaS/고객참여 강자인가?

### CPaaS/커뮤니케이션 API에서는 강자 맞음

강한 이유:

- 개발자 mindshare 최상위권
- SMS/Voice/Email/Verify/API 문서와 SDK 강함
- 글로벌 고객 기반
- FY2025 매출 $5.07B 규모
- 고객 집중도 낮음
- 제품 폭: Messaging + Voice + Email + Verify + Flex + Segment

### 고객참여 플랫폼 전체에서는 절대 강자라고 보기 어려움

왜냐하면 고객참여 전체는 매우 넓다.

- CRM/마케팅: Salesforce, HubSpot
- B2C 캠페인/개인화: Braze, Klaviyo
- 고객지원/AI support: Zendesk, Intercom
- 컨택센터: Amazon Connect, Genesys, Five9, NICE, Salesforce Service Cloud
- 클라우드 인프라/AI: AWS, Microsoft

Twilio는 인프라/API 레이어에서는 강하지만, 마케터/상담원/CRM 운영자의 daily workflow를 지배하는 앱 레이어에서는 경쟁이 훨씬 치열하다.

---

## 9. 주요 경쟁사 비교

### Sinch

- 글로벌 메시징, SMS, RCS, WhatsApp, 이메일, 인증.
- 유럽 기반 CPaaS 강자.
- 메시징 볼륨과 통신사 연결은 강함.
- Twilio 대비 개발자 생태계와 API-first 브랜드는 약함.
- gross margin은 Twilio보다 낮은 편.

### Vonage / Ericsson

- Vonage Communications APIs, UCaaS/CCaaS, Ericsson 통신사 관계.
- 5G/network API 가능성.
- 하지만 Ericsson 내 전략 조정과 손상차손 등으로 Twilio만큼 명확한 CPaaS 성장 스토리는 약함.

### Bandwidth

- 자체 네트워크, voice, messaging, numbers, 911, SIP trunking.
- 인프라 직접성은 강함.
- Twilio 대비 제품 폭, 개발자 브랜드, Segment/Flex/SendGrid 확장성은 약함.

### Infobip

- 글로벌 omnichannel messaging, WhatsApp/RCS/SMS, contact center, chatbot.
- 유럽·신흥시장·통신사 연결 강점.
- 비상장이라 재무 투명성 낮음.
- Twilio 대비 개발자 커뮤니티·상장사 신뢰도·Segment 자산은 약함.

### Bird/MessageBird

- SMS, WhatsApp, email, omnichannel inbox/automation.
- 가격경쟁과 omnichannel positioning.
- 최근 전략/브랜드 변화로 안정성과 투명성은 Twilio보다 낮음.

### Telnyx / Plivo

- 저가/기술 지향 API 대체재.
- Voice/SMS API에서 특정 고객에게 매력.
- Twilio 대비 규모, 브랜드, 엔터프라이즈 신뢰도, 제품 폭은 약함.

### AWS

- Amazon Pinpoint, SES, SNS, Connect.
- AWS 인프라, 가격, 보안, Bedrock/AI와 결합.
- AWS 고객에게는 강력한 대체재.
- 다만 제품이 분산되어 있고 Twilio처럼 커뮤니케이션 API 플랫폼으로 직관적이지는 않음.

### Microsoft

- Azure Communication Services, Teams, Dynamics, Copilot 생태계.
- 엔터프라이즈 IT와 보안/컴플라이언스 강점.
- Twilio 대비 범용 CPaaS 개발자 브랜드는 약하지만, Teams/Dynamics/Copilot 연계는 강력.

### Salesforce

- Marketing Cloud, Data Cloud, Service Cloud, Einstein.
- CRM/마케팅/서비스 앱 레이어에서 압도적.
- Twilio는 통신 API와 개발자 경험에서 우위, Salesforce는 고객 데이터/업무 워크플로우에서 우위.

### Braze / Klaviyo / HubSpot

- Braze: B2C 실시간 캠페인/개인화 강자.
- Klaviyo: 이커머스 email/SMS 마케팅 강자.
- HubSpot: SMB/mid-market CRM/마케팅 강자.
- 이들은 통신 API보다는 마케터용 앱 레이어에서 Twilio보다 강할 수 있다.

### Zendesk / Intercom

- Zendesk: 고객지원 티켓팅/메시징/workflow.
- Intercom: AI customer support, chatbot, in-app messaging.
- Twilio Flex와 경쟁하지만, Twilio는 인프라/API 성격이 강하고 이들은 상담/지원 앱 레이어가 강하다.

---

## 10. Twilio의 해자

- 개발자 브랜드: CPaaS 하면 가장 먼저 떠오르는 이름 중 하나.
- API-first 경험: 문서, SDK, 빠른 구축, 콘솔.
- 글로벌 통신 연결: 메시징/음성/이메일/인증을 한 플랫폼에서 제공.
- 제품 폭: Messaging, Voice, Email, Verify, Flex, Segment.
- 고객 집중도 낮음: top 10 고객 9%, 단일 10% 초과 없음.
- 규모: FY2025 매출 $5B+.
- 데이터+커뮤니케이션 결합: Segment를 통해 AI/개인화 인프라 스토리 가능.

---

## 11. Twilio의 약점

- 통신 원가가 높아 SaaS 대비 gross margin 낮음.
- A2P fee/pass-through가 매출은 올리지만 margin rate를 희석.
- SMS/voice는 가격경쟁과 통신사 정책 영향이 큼.
- Segment는 기대보다 성장 약했고 impairment 발생.
- Flex는 contact center 시장의 압도적 1위가 아님.
- 앱 레이어에서는 Salesforce/Braze/Klaviyo/HubSpot/Zendesk/Intercom이 강함.
- 빅테크 AWS/Microsoft가 인프라+AI+엔터프라이즈 계약으로 압박.

---

## 12. 투자 관점 시나리오

### Bull case

- DBNE 110% 이상 유지.
- Organic growth 10%+ 지속.
- Voice AI, RCS, WhatsApp, Verify가 고성장 지속.
- Segment가 AI context/data layer로 재평가.
- FCF $1B+ 유지.
- GAAP 이익이 지속 확대.
- 시장이 Twilio를 “성숙 CPaaS”가 아니라 “AI customer engagement infrastructure”로 재평가.

### Base case

- Organic growth 8~11%.
- DBNE 106~110%.
- Messaging/Voice/Verify는 견조하나 Segment는 저성장.
- FCF는 강하지만 gross margin은 통신사 비용 때문에 크게 개선되기 어려움.
- Valuation은 고성장 SaaS보다 FCF 기반 플랫폼으로 평가.

### Bear case

- A2P fee/pass-through 제외 organic growth가 약화.
- DBNE가 다시 100~105%로 하락.
- Segment/Flex가 계속 애매하고 고객참여 플랫폼 확장이 실패.
- AWS/Microsoft/Salesforce/Braze/Klaviyo에 앱/AI 레이어를 빼앗김.
- 통신사 비용 상승과 가격경쟁으로 gross margin 하락.
- Twilio가 “AI 인프라”가 아니라 “저마진 SMS API 업체”로 평가절하.

---

## 13. 앞으로 봐야 할 지표

- DBNE: 110% 이상 유지 여부
- Organic revenue growth: pass-through 제외 10% 이상 유지 여부
- Voice growth: AI voice 수요로 15~20% 성장 지속 여부
- Messaging growth: RCS/WhatsApp 성장과 A2P fee 효과 분리
- Verify/software add-ons: 20%+ 성장 유지 여부
- Segment: 저성장 2%에서 회복되는지
- Gross margin: carrier fee 영향에도 50% 안팎 유지 가능한지
- FCF: 2026년 $1.08B~$1.10B 달성 여부
- GAAP net income 지속성
- Active customers 대신 customer accounts/DBNE 지표 변화의 의미
- AI-native 고객 사례가 실제 큰 매출로 이어지는지

---

## 14. 최종 판단

Twilio는 **CPaaS/커뮤니케이션 API에서는 확실한 강자**다. 특히 개발자 경험, 글로벌 메시징/음성/이메일/인증 API, 대규모 고객 기반, 낮은 고객집중도는 강력하다.

하지만 고객참여 플랫폼 전체에서는 여러 층의 경쟁을 받는다.

- 하위 통신 API: Sinch, Infobip, Bandwidth, Telnyx, Plivo
- 클라우드 인프라: AWS, Microsoft
- 마케팅/CRM 앱: Salesforce, Braze, Klaviyo, HubSpot
- 고객지원/컨택센터: Zendesk, Intercom, Amazon Connect, Genesys/Five9/NICE

따라서 TWLO는 이렇게 추적하는 게 맞다.

> **“저마진 SMS API 회사에서 벗어나, Messaging/Voice/Verify/Segment/Flex를 묶은 AI customer engagement infrastructure로 재평가될 수 있는가?”**

이 질문의 답은 앞으로 DBNE, organic growth, Voice AI, Verify, Segment 회복, FCF 지속성에서 나온다.

---

## 15. 주요 출처

### SEC 10-K

- FY2025 10-K: https://www.sec.gov/Archives/edgar/data/1447669/000144766926000021/twlo-20251231.htm
- FY2024 10-K: https://www.sec.gov/Archives/edgar/data/1447669/000144766925000035/twlo-20241231.htm
- FY2023 10-K: https://www.sec.gov/Archives/edgar/data/1447669/000144766924000034/twlo-20231231.htm
- FY2022 10-K: https://www.sec.gov/Archives/edgar/data/1447669/000144766923000049/twlo-20221231.htm

### 실적발표/컨퍼런스콜

- Twilio transcripts: https://stockanalysis.com/stocks/twlo/transcripts/
- Q1 2026 transcript: https://stockanalysis.com/stocks/twlo/transcripts/556169-q1-2026/
- Q4 2025 transcript: https://stockanalysis.com/stocks/twlo/transcripts/398962-q4-2025/
- Q1 2026 SEC release: https://www.sec.gov/Archives/edgar/data/1447669/000144766926000046/twloq126ex991.htm
- Q4/FY2025 release: https://www.twilio.com/en-us/press/releases/Q4-full-year-2025-earnings
- Q4/FY2024 release: https://www.twilio.com/en-us/press/releases/twilio-announces-fourth-quarter-and-full-year-2024-results
- Q4/FY2023 release: https://www.twilio.com/en-us/press/releases/q4-2023-earnings
- Q4/FY2022 release: https://www.twilio.com/en-us/press/releases/twilio-announces-fourth-quarter-and-full-year-2022-results

### 제품/경쟁사

- Twilio Messaging: https://www.twilio.com/en-us/messaging
- Twilio Voice: https://www.twilio.com/en-us/voice
- Twilio SendGrid Email API: https://www.twilio.com/en-us/sendgrid/email-api
- Twilio Verify: https://www.twilio.com/en-us/verify
- Twilio Flex: https://www.twilio.com/en-us/flex
- Twilio Segment/CDP: https://www.twilio.com/en-us/customer-data-platform
- Sinch: https://www.sinch.com/
- Vonage APIs: https://www.vonage.com/communications-apis/
- Bandwidth: https://www.bandwidth.com/products/
- Infobip: https://www.infobip.com/company
- Bird: https://bird.com/
- Telnyx: https://telnyx.com/
- Plivo: https://www.plivo.com/
- Amazon Pinpoint: https://aws.amazon.com/pinpoint/
- Amazon SES: https://aws.amazon.com/ses/
- Amazon SNS: https://aws.amazon.com/sns/
- Amazon Connect: https://aws.amazon.com/connect/
- Azure Communication Services: https://azure.microsoft.com/en-us/products/communication-services
- Salesforce Marketing Cloud: https://www.salesforce.com/marketing/
- Salesforce Data Cloud: https://www.salesforce.com/data/
- Braze: https://www.braze.com/product
- Klaviyo: https://www.klaviyo.com/products
- HubSpot: https://www.hubspot.com/products
- Zendesk: https://www.zendesk.com/service/messaging/
- Intercom: https://www.intercom.com/
