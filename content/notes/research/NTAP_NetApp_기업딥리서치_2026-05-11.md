# NTAP / NetApp 기업 딥리서치 — 본업, 고객, 특화 포인트

작성일: 2026-05-11

## 한줄 결론

NetApp(NTAP)은 “스토리지 하드웨어 회사”로 보이지만, 실제 본업은 **기업 데이터 저장·관리 인프라**다. 핵심은 ONTAP 기반의 고효율·고신뢰 스토리지를 온프레미스와 AWS/Azure/GCP에 동일하게 깔아주는 것이다. AI 수혜주라기보다는, **AI/클라우드/보안/VMware 전환으로 데이터 위치가 복잡해질수록 필요한 하이브리드 데이터 인프라 벤더**에 가깝다.

## 본업

- 주력 사업: 기업용 데이터 스토리지와 데이터 관리.
- 세그먼트:
  - Hybrid Cloud: 온프레미스/프라이빗/퍼블릭 클라우드에 걸친 파일·블록·오브젝트 스토리지, 하드웨어, 소프트웨어, 지원서비스.
  - Public Cloud: AWS, Azure, Google Cloud에서 제공되는 클라우드 스토리지·데이터 서비스·운영 서비스.
- FY2025 매출 구성:
  - 총매출: 65.72억 달러.
  - 제품 매출: 매출의 46%, 약 30.4억 달러.
  - 서비스 매출: 35.32억 달러.
    - Support: 25.12억 달러.
    - Professional/Other: 3.55억 달러. Keystone STaaS 포함.
    - Public Cloud: 6.65억 달러.
  - 총매출의 대부분은 여전히 Hybrid Cloud/엔터프라이즈 스토리지 쪽.
- FY2026 Q3:
  - 매출 17.13억 달러, YoY +4%.
  - Hybrid Cloud 15.39억 달러, YoY +5%.
  - Public Cloud 1.74억 달러, YoY flat.
  - All-flash array 매출 10억 달러, YoY +11%, 연율화 42억 달러.

## 주요 제품/기술

- ONTAP:
  - NetApp의 핵심 스토리지 OS.
  - 파일/블록/오브젝트, 데이터 보호, 복제, 스냅샷, 효율화, 랜섬웨어 보호, 클라우드 연동의 기반.
- BlueXP:
  - 온프레미스와 클라우드에 흩어진 NetApp 스토리지·데이터 서비스를 관리하는 컨트롤 플레인.
- AFF A-Series:
  - 고성능 all-flash 스토리지. 가상화, 컨테이너, 데이터베이스, 저지연 워크로드.
- AFF C-Series:
  - 용량 최적화 flash. HDD/하이브리드에서 all-flash로 넘어가는 고객용.
- ASA:
  - SAN/block 전용 all-flash array. VM과 DB 워크로드용.
- FAS/E-Series:
  - 고용량/하이브리드/전용 고대역폭 스토리지.
- Keystone:
  - Storage-as-a-Service. CAPEX 구매 대신 사용량 기반/월 과금형 스토리지.
- Cloud storage:
  - Amazon FSx for NetApp ONTAP, Azure NetApp Files, Google Cloud NetApp Volumes 등.

## 고객

- 직접 고객군:
  - 대기업, 서비스프로바이더, 정부기관, 글로벌/로컬 기업.
  - 산업군: 에너지, 금융, 정부, 기술/인터넷, 생명과학, 헬스케어, 제조, 미디어·엔터테인먼트·애니메이션·영상후반작업, 통신.
- 판매 채널:
  - 직접 영업 + 파트너 생태계.
  - FY2025 간접채널 매출 비중 78%.
  - Arrow Electronics 21%, TD Synnex 24%가 FY2025 순매출을 차지. 단, 이는 최종 사용 고객이라기보다 유통/채널 고객으로 보는 것이 맞다.
- 클라우드 파트너/동시에 경쟁자:
  - AWS, Microsoft Azure, Google Cloud.
  - NetApp의 강점은 이들 클라우드에 “네이티브/퍼스트파티처럼” 박혀 있는 스토리지 서비스다.
  - 동시에 퍼블릭 클라우드 자체 스토리지 서비스와는 경쟁한다.

## 뭐가 특화됐나

1. ONTAP이라는 오래 검증된 데이터 관리 OS
   - 단순 저장장치가 아니라 스냅샷, 복제, 효율화, 보안, 데이터 보호, 멀티프로토콜 지원을 묶은 운영체제/플랫폼.
   - 기업 고객이 중요하게 보는 무중단 운영, 고가용성, 데이터 보호 역량이 강점.

2. 하이브리드 멀티클라우드 일관성
   - 온프레미스 NetApp을 쓰던 고객이 AWS/Azure/GCP로 가도 유사한 데이터 관리 경험을 유지할 수 있다.
   - 이것이 Dell/HPE/Pure 같은 전통 스토리지와 클라우드 네이티브 스토리지 사이에서 NetApp이 내세우는 차별점.

3. 클라우드 업체와의 깊은 통합
   - Amazon FSx for NetApp ONTAP, Azure NetApp Files, Google Cloud NetApp Volumes.
   - 일반적인 “파트너 마켓플레이스 앱”보다 클라우드 플랫폼 안쪽에 가까운 포지션.
   - 특히 엔터프라이즈 워크로드를 클라우드로 이전할 때 기존 파일/NFS/SMB/ONTAP 기반 운영방식을 보존하는 가치가 있다.

4. All-flash 전환 수혜
   - Q3 FY2026 all-flash array 매출 10억 달러, YoY +11%.
   - 연율화 run-rate 42억 달러.
   - C-Series는 고성능만이 아니라 용량/비용 최적화 flash 전환을 겨냥한다.

5. AI 데이터 인프라 포지셔닝
   - NetApp은 GPU/모델 회사가 아니라 AI가 쓸 데이터를 저장·보호·이동·공급하는 인프라 회사.
   - 비정형 데이터, 학습/추론 파이프라인, 온프레미스와 클라우드에 분산된 데이터 관리가 핵심 서사.
   - AI 수혜 강도는 GPU 서버/네트워크보다 낮지만, 기업 AI 도입이 실제 운영 데이터로 확산될 때 수혜 가능성이 있다.

## 경쟁 구도

- 전통 스토리지: Dell EMC, HPE, IBM, Hitachi Vantara, Lenovo 등.
- 고성능 flash 특화: Pure Storage.
- 하이퍼컨버지드/가상화/클라우드 운영: Nutanix 등.
- 퍼블릭 클라우드 자체 스토리지: AWS/Azure/GCP의 자체 블록·파일·오브젝트 스토리지.
- NetApp의 포지션:
  - “가장 빠른 flash만 파는 회사”라기보다 “기업 데이터 관리/하이브리드 클라우드 일관성”에 강한 회사.
  - 클라우드 업체와 파트너이면서 경쟁자라는 이중구조가 핵심.

## 투자 관점 체크포인트

### 강화 요인

- All-flash 매출 성장 지속.
- Hybrid Cloud가 저성장이라도 고마진·현금창출을 유지.
- Public Cloud의 first-party/marketplace storage 서비스 성장.
- AI 워크로드가 실제 스토리지/데이터 서비스 매출로 확인.
- Keystone 같은 구독/사용량 기반 모델 확대.

### 약화 요인

- Public Cloud 전체 매출이 정체되거나 CloudOps/비스토리지 서비스가 구조적으로 약해질 경우.
- 클라우드 업체 자체 스토리지에 의해 NetApp 통합 서비스가 잠식될 경우.
- Dell/Pure/HPE와 가격 경쟁으로 제품 마진 훼손.
- AI 내러티브는 강하지만 실제 매출 기여가 제한적일 경우.
- 채널 의존도: FY2025 간접채널 78%, Arrow/TD Synnex 합산 45% 매출 노출.

## 핵심 판단

NTAP은 “AI 인프라 고성장주”라기보다 **성숙한 엔터프라이즈 스토리지 현금창출 기업이 all-flash, 하이브리드 클라우드, 클라우드 네이티브 스토리지, AI 데이터 인프라로 재평가를 시도하는 케이스**다.

따라서 리서치 관점에서 봐야 할 핵심은:

- 본업: 기업용 데이터 저장/관리.
- 고객: 대기업·정부·서비스프로바이더 + 채널 파트너 + AWS/Azure/GCP 생태계.
- 특화: ONTAP, 하이브리드 클라우드 일관성, 클라우드 네이티브 통합, all-flash 전환, 데이터 보호/랜섬웨어 복구.
- 검증 포인트: all-flash 성장률, Public Cloud first-party storage 성장률, 총 Public Cloud 성장 재가속 여부, AI 관련 스토리지 수요가 매출로 나타나는지.

## 사용한 핵심 소스

- NetApp FY2025 Form 10-K, filed 2025-06-09, report date 2025-04-25.
- NetApp FY2026 Q3 earnings release / Exhibit 99.1, filed 2026-02-26.
- SEC company submissions and companyfacts for NTAP / CIK 0001002047.

## 주의

Google Workspace OAuth 토큰이 만료/폐기되어 사용자의 Drive “지시폴더” 딥리서치 프롬프트는 이번 실행에서 직접 확인하지 못했다. 따라서 본 메모는 SEC 공시와 NetApp 공식 실적자료 기반으로 작성했다.
