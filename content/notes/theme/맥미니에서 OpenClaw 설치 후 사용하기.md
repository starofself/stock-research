# 맥미니에서 OpenClaw 설치 후 텔레그램으로 사용하는 실전 가이드

이 문서는 **맥미니를 처음 사서**, **OpenClaw를 처음 설치하고**, **텔레그램으로 여러 봇을 운영하려는 사람**을 위한 실전 가이드다.  
설치만 하는 수준이 아니라, 내가 실제로 세팅해서 쓰는 방식까지 포함했다.

이 가이드의 목표는 3가지다.

1. 맥미니에 OpenClaw를 설치한다.
2. ChatGPT Pro 계정으로 로그인해 기본 AI를 붙인다.
3. 텔레그램 봇을 여러 개 만들어 역할별로 나눠 쓴다.

---

## 1. 이런 사람에게 맞다

- 맥미니를 업무용 AI 허브처럼 쓰고 싶은 사람
- 텔레그램에서 AI 비서처럼 OpenClaw를 쓰고 싶은 사람
- 자료수집, 기업분석, Obsidian 저장, 블로그 초안 같은 일을 역할별 봇으로 나누고 싶은 사람
- Gemini / NotebookLM / Google Drive / Obsidian 같은 외부 서비스와 같이 쓰고 싶은 사람

---

## 2. 내가 실제로 쓰는 구조 요약

내가 지금 쓰는 구조는 이런 식이다.

- `main`
  총괄 오케스트라 봇.  
  사용자는 보통 이 봇에 먼저 지시한다.

- `research-web`
  기업분석, Gemini Deep Research, NotebookLM 슬라이드 작업용

- `datafond`
  자료수집, 다운로드, PDF 정리, 파일 업로드, Google Drive 저장용

- `starobsidian`
  Obsidian 읽기/수정/저장용

- `starofblog`
  네이버 블로그 초안 작성 및 발행 보조용

- `unionmo`
  노조/노무/설명회 준비 같은 특수 업무용

- `codexops`
  OpenClaw 자체 설정 수정, 봇 추가, 유지보수용

핵심은 **사용자는 보통 main에 말하고**,  
**main이 필요하면 다른 전문 봇으로 위임**하는 구조다.

---

## 3. 먼저 준비할 것

필수 준비물:

- 맥미니
- Homebrew
- Node.js 22 이상
- 텔레그램 계정
- ChatGPT Pro 계정

권장 준비물:

- Google 계정
- Gemini / NotebookLM 사용 계정
- Obsidian 동기화용 폴더
- Google Drive

확인 명령:

```bash
brew --version
node -v
npm -v
```

Node 버전이 너무 낮으면 먼저 올리는 것이 좋다.

---

## 4. 설치 방식은 QuickStart가 가장 쉽다

OpenClaw는 처음 설치할 때 **Manual보다 QuickStart**가 훨씬 쉽다.

설치:

```bash
npm install -g openclaw@latest
```

온보딩 시작:

```bash
openclaw onboard --install-daemon
```

온보딩 중 추천 선택:

- 모드: `QuickStart`
- 모델 제공자: `OpenAI`
- 인증 방식: `OpenAI Codex (ChatGPT OAuth)`

중요:

- **ChatGPT Pro 계정으로 쓰려면 API Key가 아니라 OAuth 로그인**을 써야 한다.
- 여기서 브라우저가 열리면 **ChatGPT Pro 계정으로 로그인**하면 된다.

---

## 5. 로그인할 때 자주 막히는 포인트

로그인을 끝냈는데 터미널에 아래와 비슷한 문구가 멈춰 있을 수 있다.

- `Complete sign-in in browser...`
- `Paste the authorization code (or full redirect URL):`

이럴 때는 보통 이렇게 해결된다.

1. 터미널에서 `Enter` 한 번 눌러본다.
2. 안 넘어가면 브라우저 마지막 주소를 복사한다.
3. 그 URL 전체를 터미널에 붙여넣고 `Enter`

즉, 브라우저 로그인은 끝났는데 **터미널이 마지막 콜백을 못 받은 상태**일 수 있다.

---

## 6. 기본 모델 추천

처음엔 기본 모델을 이렇게 잡는 게 무난하다.

- `openai-codex/gpt-5.4`

이유:

- 코딩, 일반질문, 긴 문맥 처리까지 밸런스가 좋다
- 나중에 필요하면 봇별로 바꿀 수 있다

처음부터 너무 많은 모델을 만지기보다,  
기본은 `gpt-5.4`로 두고 역할 분리를 먼저 하는 것이 좋다.

---

## 7. 텔레그램은 “내 계정 로그인”이 아니라 “봇 생성” 방식이다

OpenClaw를 텔레그램에서 쓰려면 보통 **Telegram Bot API** 방식을 쓴다.  
즉, 내 개인 계정 자체로 접속하는 것이 아니라 **내가 만든 봇과 대화**하는 구조다.

온보딩 중 채널 선택 화면이 나오면:

- `Telegram (Bot API)` 선택

그 다음 Telegram에서 `@BotFather`를 열고:

1. `/newbot`
2. 봇 이름 입력
3. username 입력
4. 발급된 `BOT_TOKEN` 복사
5. OpenClaw 터미널에 붙여넣기

봇 생성 후에는:

- 그 봇과 1:1 대화창 열기
- `/start` 보내기

처음엔 **그룹보다 1:1 DM**부터 테스트하는 것이 가장 안전하다.

---

## 8. 처음 세팅 때는 불필요한 옵션을 많이 건드리지 않는 게 좋다

온보딩 중 자주 나오는 항목과 추천:

- Web search: `Skip for now`
- Skills: 처음엔 `No` 또는 `Skip`
- Hooks: 처음엔 `No`

이유:

- 나중에 따로 붙여도 된다
- 처음부터 켜면 흐름이 복잡해진다
- 먼저 “기본 대화가 되느냐”가 더 중요하다

---

## 9. 처음 텔레그램 테스트할 때 안 되면 확인할 것

대표적으로 막히는 경우:

### 1) `/start`는 보냈는데 반응이 없다

원인:

- pairing 승인 필요
- allowlist 미설정
- 봇과의 DM 세션이 아직 안 열림

해결:

- 봇과 1:1 DM에서 일반 문장을 한 번 더 보내본다
- pairing 승인 필요하면 승인한다
- allowFrom 설정을 확인한다

### 2) 로그인이 된 것 같은데 브라우저 자동화가 로그아웃처럼 보인다

원인:

- OpenClaw 전용 브라우저 프로필과 일반 크롬 세션이 다르기 때문

해결:

- OpenClaw 전용 브라우저에서 다시 로그인
- 필요시 Chrome Relay 확장을 연결

### 3) “업로드 불가”처럼 잘못 답한다

원인:

- 기능이 없는 게 아니라 세션 문맥이 꼬인 경우가 많다

해결:

- 해당 봇 세션 초기화
- 게이트웨이 재시작
- 새 문맥에서 다시 지시

---

## 10. 내가 추천하는 운영 방식: 처음엔 2개, 익숙해지면 여러 개

처음부터 5~8개 봇을 다 굴리면 관리가 어렵다.  
보통은 이렇게 시작하는 것이 좋다.

### 가장 쉬운 시작

- `main`
- `research-web`

### 내가 실제로 확장한 구조

- `main`: 총괄
- `research-web`: 분석/Gemini/NotebookLM
- `datafond`: 수집/다운로드/PDF/Drive
- `starobsidian`: Obsidian
- `starofblog`: 블로그 초안/발행 보조
- `unionmo`: 특수 업무
- `codexops`: OpenClaw 설정 유지보수

---

## 11. 오케스트라 방식이 왜 중요한가

OpenClaw를 진짜 편하게 쓰려면 **사용자는 main만 주로 쓰고**,  
main이 적절한 전문 봇에게 업무를 넘기게 만드는 것이 좋다.

예를 들어:

- 자료수집 필요 -> `datafond`
- 기업분석 필요 -> `research-web`
- Obsidian 저장 필요 -> `starobsidian`
- 블로그 초안 필요 -> `starofblog`
- OpenClaw 설정 수정 필요 -> `codexops`

즉, 사용자는 이렇게 말하면 된다.

```text
이 기업 분석해줘. 필요하면 자료수집도 하고, 결과는 옵시디언에 저장해줘.
```

그러면 main이 알아서:

- 자료수집
- 분석
- 저장

순서 또는 병렬로 나눠 처리하게 만들 수 있다.

---

## 12. 봇별 역할을 분리하면 왜 좋은가

이유는 간단하다.

- 대화 문맥이 안 섞인다
- 저장 규칙이 깔끔해진다
- 브라우저 자동화 역할을 나누기 쉽다
- 업무별 성격 설정이 쉬워진다

예:

- `research-web`은 투자자 관점, 검증 중심
- `starobsidian`은 기록/정리 중심
- `starofblog`는 읽기 쉬운 글쓰기 중심
- `codexops`는 설정 수정/진단 중심

---

## 13. Gemini Deep Research를 붙이고 싶다면

이건 중요한 포인트다.

OpenClaw에서 Gemini를 쓰는 방식은 크게 2가지다.

### 1) 모델 provider로 Gemini 붙이기

이건 “Gemini 모델 호출”에 가깝다.

### 2) Gemini 웹에 직접 로그인해서 브라우저 자동화로 쓰기

이건 내가 실제로 더 유용하게 쓴 방식이다.  
특히 **Deep Research** 같은 웹 기능을 쓸 때는 이 방식이 현실적이다.

추천 흐름:

1. OpenClaw 전용 브라우저 열기
2. `gemini.google.com` 로그인
3. 필요한 문서 업로드
4. Deep Research 실행
5. 결과를 Docs / Drive / Obsidian / Telegram으로 넘기기

주의:

- 일반 크롬 세션과 OpenClaw 전용 브라우저 세션은 다를 수 있다
- 브라우저 제어가 꼬이면 탭을 하나만 유지하는 게 좋다

---

## 14. Google Drive를 붙이면 좋아지는 점

Google Drive를 붙이면:

- 자료를 폴더별로 저장 가능
- 분석 PDF, IR자료, 리서치 결과를 한 곳에 정리 가능
- NotebookLM, Gemini, Obsidian 연계가 쉬워짐

실전 예시:

- `OpenClaw Uploads/종목명/`
- `OpenClaw Uploads/IR/`
- `OpenClaw Uploads/Research/`

즉, 결과물을 텔레그램에만 보내는 게 아니라  
**Drive에 저장하고 링크로 관리하는 흐름**이 가능해진다.

---

## 15. Obsidian은 반드시 “동기화 폴더”에 저장해야 한다

이건 매우 중요하다.

맥미니 로컬 아무 폴더에 저장하면  
핸드폰 Obsidian과 자동 동기화되지 않는다.

반드시:

- 내가 실제로 Obsidian Sync 또는 클라우드 동기화에 쓰는 폴더

에 저장해야 한다.

즉, Obsidian 봇을 만들 때는 먼저:

1. 내가 실제로 쓰는 vault 경로를 확인
2. 그 폴더를 기본 저장 위치로 지정

해야 한다.

핵심 원칙:

- “맥에 저장”이 아니라
- “내가 동기화 중인 실제 Obsidian vault에 저장”

이어야 한다.

---

## 16. 네이버 블로그 자동화는 어디까지 가능한가

블로그 초안 작성은 꽤 잘 된다.

예:

- 뉴스 링크 정리
- 유튜브 링크 요약
- 투자자 관점 질문 추가
- 20자 내외 제목
- 읽기 쉬운 블로그 문단 구조

다만 실제 네이버 블로그 발행은:

- 로그인 세션
- 편집기 iframe
- 리다이렉트
- 브라우저 자동화 안정성

때문에 완전 자동이 가끔 꼬일 수 있다.

그래서 가장 현실적인 방식은:

1. `starofblog`가 발행 직전 초안 생성
2. 초안은 markdown 파일이나 텍스트로 저장
3. 필요 시 사용자가 최종 발행

이다.

---

## 17. 대시보드를 붙이면 관리가 쉬워진다

내가 추가로 붙인 대시보드에서는 이런 걸 본다.

- 봇별 상태
- 금일 작업내역
- 진행 중 작업
- 대기 중 작업
- 봇별 Thinking / Reasoning 설정

예:

- 로컬 데몬 URL: `http://127.0.0.1:18810/`

이런 대시보드가 있으면  
어떤 봇이 뭘 하고 있는지 훨씬 보기 쉽다.

---

## 18. Thinking / Reasoning은 이렇게 이해하면 된다

### Thinking

얼마나 깊게 추론할지

- `off`: 거의 생각 없이 빠르게
- `minimal`: 최소 추론
- `low`: 가벼운 추론
- `medium`: 균형형
- `high`: 분석형
- `xhigh`: 가장 깊은 추론

추천:

- `main`: `high`
- `research-web`: `high`
- `datafond`: `medium`
- `starobsidian`: `medium`
- `starofblog`: `medium`
- `unionmo`: `high`
- `codexops`: `high`

### Reasoning

생각 내용을 사용자에게 어떻게 보여줄지

- `off`: reasoning 표시 안 함
- `on`: reasoning 표시 사용
- `stream`: 생성 중 실시간 프리뷰처럼 보냄
- `inherit`: 기본값 따름

보통은:

- `Reasoning = off` 또는 `inherit`
- 정말 중간 추론을 보고 싶을 때만 `on` 또는 `stream`

으로 쓰는 편이 좋다.

---

## 19. 초보자에게 추천하는 실전 순서

처음 시작하는 사람은 아래 순서가 좋다.

1. Homebrew / Node 설치
2. `npm install -g openclaw@latest`
3. `openclaw onboard --install-daemon`
4. QuickStart 선택
5. OpenAI Codex OAuth로 ChatGPT Pro 로그인
6. Telegram Bot API 연결
7. main 봇 1개로 먼저 테스트
8. 그 다음 research-web 추가
9. Gemini / Drive / Obsidian 순서로 확장
10. 마지막에 블로그, 대시보드, Thinking/Reasoning 튜닝

---

## 20. main 봇에는 어떻게 말하면 좋은가

가장 잘 먹히는 지시 방식:

`목표 + 입력자료 + 원하는 결과물 + 저장 위치`

예:

```text
이 기업 분석해줘. 필요하면 자료수집도 하고, 핵심 쟁점과 다음 질문 5개로 정리한 뒤 옵시디언에 저장해줘.
```

```text
이 문서들로 Gemini Deep Research 돌려줘. 결과는 투자자 관점으로 요약하고 Google Drive에 저장해줘.
```

```text
이 링크 블로그 초안으로 만들어줘. 제목은 짧게 하고, 투자자 관점 질문도 넣어줘.
```

즉:

- “어떤 봇을 써라”보다
- “최종적으로 무엇을 원한다”를 말하는 게 더 좋다

---

## 21. 가장 중요한 운영 팁

이 부분이 제일 중요하다.

### 1) 처음부터 모든 걸 자동화하려 하지 말 것

먼저:

- 기본 대화
- 텔레그램 응답
- 파일 저장

이 세 가지만 안정화하는 게 우선이다.

### 2) 브라우저 자동화는 탭을 적게 유지할 것

Gemini / NotebookLM / Naver는  
탭이 많거나 세션이 섞이면 잘 꼬인다.

### 3) 저장 위치를 항상 명확히 정할 것

- Drive는 Drive 폴더
- Obsidian은 실제 동기화 vault
- 블로그 초안은 drafts 폴더

이렇게 나눠야 관리가 쉽다.

### 4) 사용자에게는 main 하나만 중심으로 보이게 할 것

그래야 구조가 복잡해도 실제 사용은 쉽다.

---

## 22. 내가 이 방식에서 얻은 결론

OpenClaw는 단순 챗봇이 아니라  
**맥미니를 AI 업무 허브처럼 쓰게 해주는 운영 도구**에 가깝다.

가장 좋은 방식은:

- 하나의 총괄 봇
- 몇 개의 전문 봇
- 텔레그램을 일상 인터페이스로 사용
- 브라우저 자동화와 Drive/Obsidian을 뒤에서 연결

하는 구조다.

처음엔 어렵게 느껴질 수 있지만,  
한 번 구조를 잡으면 “자료수집 -> 분석 -> 저장 -> 발행”을  
상당히 체계적으로 굴릴 수 있다.

---

## 23. 마지막 한 줄 추천

초보자는 이렇게 시작하면 된다.

**main 봇 하나로 시작 -> research-web 추가 -> Drive/Obsidian 연결 -> 필요할 때 전문 봇 확장**

이 순서가 가장 덜 꼬이고, 실제로 오래 쓸 수 있다.