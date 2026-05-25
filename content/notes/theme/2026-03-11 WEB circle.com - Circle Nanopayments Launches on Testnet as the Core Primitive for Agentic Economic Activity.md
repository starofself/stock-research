---
title: "Circle Nanopayments Launches on Testnet as the Core Primitive for Agentic Economic Activity"
source: "https://www.circle.com/blog/circle-nanopayments-launches-on-testnet-as-the-core-primitive-for-agentic-economic-activity"
author: "Team Circle"
published: "2026-03-10"
captured: "2026-03-11T20:28:00+09:00"
kind: "web-deep-research"
tags:
  - obsidian
  - deep-research
  - source/web
  - category/crypto
  - category/payments
  - category/ai
  - keyword/circle
  - keyword/nanopayments
  - keyword/gateway
  - keyword/x402
  - keyword/usdc
  - keyword/agentic-economy
---

# Circle Nanopayments Launches on Testnet as the Core Primitive for Agentic Economic Activity

## Source
- Type: web
- URL: https://www.circle.com/blog/circle-nanopayments-launches-on-testnet-as-the-core-primitive-for-agentic-economic-activity
- Author/Channel: Team Circle
- Date: 2026-03-10

## One-Line Summary
Circle is testing a new payment rail that lets AI agents and software send ultra-small USDC payments without paying gas per transaction by batching settlement through Circle Gateway.

## What This Is

쉽게 말해, 이것은 "AI가 아주 작은 돈을 자주 주고받을 수 있게 만든 결제 인프라"다.

기존 카드 결제나 일반 온체인 송금은 너무 작은 금액을 처리하기에 비효율적이다. 예를 들어 API 한 번 호출할 때마다 0.0001달러 같은 식으로 과금하고 싶어도, 수수료가 결제 금액보다 훨씬 커질 수 있다. Circle Nanopayments는 이 문제를 풀기 위해 나온 구조다.

Circle 설명에 따르면 이 시스템은 USDC를 최소 0.000001달러 단위까지 보낼 수 있고, 개별 결제마다 가스비를 내지 않게 설계됐다. 현재는 메인넷이 아니라 테스트넷 단계다.

## Why It Matters

이게 중요한 이유는 "에이전트 경제"에 필요한 결제 단위를 현실화하려고 하기 때문이다.

AI 에이전트나 로봇이 스스로 행동하려면, 앞으로는 데이터 조회, 모델 호출, 컴퓨팅, 저장공간, 검색, 충전 같은 자원을 그때그때 사야 하는 상황이 많아질 수 있다. 그런데 이런 거래는 사람이 구독 버튼을 누르듯 하는 것이 아니라, 기계가 매우 자주, 매우 작은 금액으로 처리해야 한다.

기존 결제망은 이런 용도에 맞지 않았다. Circle은 이 점을 정면으로 겨냥해 pay-per-call API, usage-based billing, machine-to-machine 거래 같은 모델을 실제로 가능하게 만들겠다는 방향을 보여주고 있다.

## How It Works

핵심은 "결제는 오프체인에서 빠르게 승인하고, 정산은 온체인에서 나중에 묶어서 처리한다"는 구조다.

공식 블로그와 Circle 개발자 문서를 종합하면 흐름은 이렇다.

1. 사용자는 먼저 Circle Gateway Wallet에 USDC를 예치한다.
2. 에이전트나 클라이언트가 유료 리소스를 요청한다.
3. 서버는 HTTP 402 Payment Required와 결제 정보를 돌려준다.
4. 구매자는 EIP-3009 서명 기반 결제 승인 메시지를 오프체인으로 만든다.
5. 판매자는 서명을 확인하고 즉시 상품이나 API 응답을 제공한다.
6. Circle Gateway가 이런 승인들을 모아서 나중에 한 번에 온체인 정산한다.

즉, 사용자는 실제 돈을 아무 근거 없이 공중에서 만드는 게 아니라, 먼저 Gateway에 예치한 USDC를 바탕으로 움직인다. 다만 개별 결제를 체인에 하나하나 쓰지 않고, 내부 장부와 배치 정산으로 처리해 가스비 부담을 없애는 방식이다.

## Key Points
- Circle Nanopayments는 Circle Gateway 위에서 동작하는 가스비 없는 초소액 결제 레일이다.
- 최소 전송 단위는 0.000001달러 상당의 USDC까지 내려간다고 Circle이 설명한다.
- 결제 확인은 빠르게 하고 실제 온체인 정산은 뒤에서 묶어서 처리한다.
- x402 표준을 활용해 "HTTP 요청 자체에 결제를 붙이는" 흐름을 지향한다.
- 현재는 테스트넷 단계이며, 메인넷에서는 아직 Nanopayments가 활성화되지 않은 상태로 보인다.

## What Is Different From Existing Approaches

기존 방식과 가장 큰 차이는 "결제 승인"과 "최종 정산"을 분리했다는 점이다.

보통 온체인 결제는 거래 하나가 곧 정산 하나다. 그래서 금액이 너무 작으면 수수료 구조상 말이 안 된다. 반면 Circle Nanopayments는 수천 건의 초소액 결제를 먼저 처리한 뒤, 나중에 한 번에 온체인 정산한다. 이 구조 덕분에 초소액 결제를 경제적으로 만들 수 있다.

또 하나의 차이는 x402와의 연결이다. x402는 HTTP 402 Payment Required를 활용해 인터넷 요청 자체를 유료화하는 오픈 표준인데, Circle은 Nanopayments가 이 흐름을 실질적으로 가능하게 하는 인프라라고 설명한다. 다시 말해 x402가 "결제 규약"에 가깝다면, Nanopayments는 "그 규약을 초소액 규모로 실행 가능하게 만드는 정산 레일"에 가깝다.

Circle Gateway와의 관계도 중요하다. Gateway는 원래 여러 체인에 걸친 통합 USDC 잔액을 빠르게 쓰게 해주는 구조인데, Nanopayments는 그 위에 "배치 정산 기반의 초소액 결제" 기능을 올린 모습이다.

## Practical Use Cases
- API를 호출할 때마다 아주 작은 금액을 과금하는 pay-per-call 서비스
- 초 단위 또는 사용량 단위로 요금이 붙는 compute billing
- 크롤링, 검색, 데이터 피드 접근을 요청 건당 과금하는 서비스
- 에이전트끼리 데이터, 도구, 계산 자원을 자동 매매하는 마켓플레이스
- 로봇이나 기계가 충전, 네트워크, 소프트웨어 기능 사용료를 스스로 지불하는 machine-to-machine 결제

## Limits or Cautions
- 현재는 테스트넷 공개 단계다. 바로 실사용 메인넷 결제 레일로 보기에는 이르다.
- Circle 공식 지원 블록체인 문서를 보면 테스트넷에서는 여러 체인이 Nanopayments 지원으로 표시되지만, 메인넷은 아직 모두 "No"로 표시된다.
- "가스비 0"은 사용자가 개별 거래마다 가스를 안 낸다는 뜻이지, 시스템 전체에 온체인 비용이 완전히 사라진다는 뜻은 아니다. Circle이 배치 정산 계층에서 비용을 부담하는 구조다.
- 오프체인 장부와 배치 정산 구조는 효율적이지만, 순수하게 모든 거래가 즉시 온체인 확정되는 구조와는 신뢰 모델이 다르다. 따라서 회계, 정산 시점, 실패 처리 방식은 실제 도입 전에 자세히 검토해야 한다.
- OpenMind 로봇 사례는 방향성을 보여주는 데는 유용하지만, 이것만으로 시장 채택이 이미 검증됐다고 보기는 어렵다.

## Confidence Notes
- Circle 블로그에 나온 "0.000001달러", "가스비 없는 결제", "테스트넷 공개"는 공식 발표 내용이다.
- Gateway와 x402 연계 구조 설명은 Circle 개발자 문서와 x402 공식 문서를 바탕으로 정리했다.
- "이것이 에이전트 경제의 핵심 결제 레일이 될 수 있다"는 평가는 공식 발표의 방향성을 해석한 것이다. 아직은 테스트넷 단계이므로 시장 검증은 진행 중이라고 보는 편이 맞다.

## Related Notes
- [[Circle Gateway]]
- [[x402]]
- [[USDC]]
- [[Agentic Economy]]

## Next Actions
- Circle Nanopayments 메인넷 지원 여부가 열리면 다시 확인하기
- x402 기반 실제 API 결제 예시를 한 번 더 찾아서 비교 노트 만들기
- Gateway의 수수료 구조와 정산 지연 리스크를 별도 노트로 정리하기

## References
- Circle blog: https://www.circle.com/blog/circle-nanopayments-launches-on-testnet-as-the-core-primitive-for-agentic-economic-activity
- Circle Nanopayments docs: https://developers.circle.com/gateway/nanopayments
- Circle Gateway overview: https://developers.circle.com/gateway
- Circle Gateway supported blockchains: https://developers.circle.com/gateway/references/supported-blockchains
- x402 official site: https://www.x402.org/
- x402 docs: https://docs.x402.org/
