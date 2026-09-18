# REQUEST — HUMEASE Korean-first Premium 전면 언어 정리

- 대상 저장소: `humease21/humease-web-v2`
- 기준 배포: `b0941e5`
- 작성일: 2026-09-06
- 요청 성격: UI 카피/표현 체계 전면 정리
- 호스팅: GitHub Pages 유지
- 기술 스택: Next.js App Router + TypeScript + Tailwind CSS + Static Export 유지
- 이미지: 기존 생성 이미지 유지 / 신규 생성·재생성 없음
- SEO/AEO/GEO: 기존 구현 유지 및 회귀 금지

## 1. 목표

현재 사이트의 과도한 영어 장식 문구를 걷어내고 **Korean-first Premium** 원칙으로 전환한다.

> 고급스러움은 영어 문구가 아니라 타이포그래피, 여백, 이미지, 모션, 레이아웃에서 만든다.

사용자가 읽는 설명·섹션명·CTA·FAQ·프로세스는 한국어를 우선한다. 브랜드명·제품명·업계 고유명·SEO에 필요한 영문만 유지한다.

## 2. 반드시 유지할 영문

다음은 번역하거나 임의 변경하지 않는다.

- HUMEASE
- Arctera
- Enterprise Vault Complete
- Enterprise Vault Capture (formerly Merge1)
- Data Insight
- eDiscovery Platform
- e-Discovery
- AI
- Enterprise IT
- Microsoft 365
- Exchange
- Microsoft Teams
- Slack
- Microsoft MVP
- Symantec
- Veritas
- AnyBuild
- HairAI

특히 다음 표기는 절대 변경하지 않는다.

> **Enterprise Vault Capture (formerly Merge1)**

검색 연속성을 위해 아래 키워드 관계도 유지한다.

- Merge1
- Arctera Merge1
- Veritas Merge1
- Enterprise Vault Capture

## 3. 전역 원칙

사용자 노출 요소는 한국어 우선으로 변경한다.

- Navigation
- Hero eyebrow
- Section label
- Section heading
- CTA
- Process step
- Capability label
- FAQ heading
- Contact heading
- Portfolio heading
- Review/Source heading
- Footer navigation

영문 병기는 다음 경우에만 허용한다.

1. 공식 제품명
2. 브랜드명
3. 국내에서도 영문으로 일반 사용되는 전문용어
4. SEO 연속성을 위해 본문 첫 정의에 필요한 경우
5. 공식 기능/모듈명

장식용 영문 병기는 금지한다.

## 4. 글로벌 메뉴

| 현재 | 변경 |
|---|---|
| Enterprise Data | 기업 데이터 |
| Applied AI | AI 서비스 |
| Arctera Solutions | Arctera 솔루션 |
| AI Portfolio | AI 포트폴리오 |
| 인사이트 | 유지 |
| 회사소개 | 유지 |
| 문의 | 유지 |

권장 최종 메뉴:

```text
사업영역
 ├ 기업 데이터
 ├ AI 서비스
 └ Arctera 솔루션

AI 포트폴리오
인사이트
회사소개
문의
```

## 5. 홈 `/`

### Hero

삭제:

```text
HUMEASE · ENTERPRISE DATA & APPLIED AI
Complexity, made intelligent.
```

최종:

```text
HUMEASE

복잡한 데이터와 아이디어를,
실제로 작동하는 기술로.

기업 데이터의 보존과 통제부터 AI 서비스의 설계와 구현까지.
휴미즈는 기술을 현실의 문제 해결로 연결합니다.
```

CTA는 유지:

- 사업영역 살펴보기
- 프로젝트 문의

### Data Transition

현재:

```text
FROM DATA
Scattered.

TO INTELLIGENCE
Understood.
```

변경:

```text
흩어진 데이터
흩어진 기록, 서로 다른 시스템, 찾기 어려운 정보.

이해할 수 있는 정보로
정돈된 데이터가 사람에게 쓸모 있는 판단으로 이어집니다.
```

### 섹션명

| 현재 | 변경 |
|---|---|
| WHY HUMEASE | 왜 휴미즈인가 |
| ENTERPRISE DATA | 기업 데이터 |
| ARCTERA SOLUTIONS | Arctera 솔루션 |
| APPLIED AI | AI 서비스 |
| HOW WE WORK | 일하는 방식 |
| AI PORTFOLIO | AI 포트폴리오 |
| EXPERTISE, APPLIED | 전문성 |

### Enterprise Data Capability

| 현재 | 변경 |
|---|---|
| Preserve · 보존 | 보존 |
| Discover · 검색 | 검색 |
| Control · 통제 | 통제 |
| Respond · 대응 | 대응 |

CTA:

`Enterprise Data 알아보기` → `기업 데이터 알아보기`

### HOW WE WORK

| 현재 | 변경 |
|---|---|
| Understand | 이해 |
| Architect | 설계 |
| Build | 구현 |
| Validate | 검증 |

### Experience

현재 대형 영문:

```text
20+ years of
Enterprise IT experience.
Now applied to AI.
```

변경:

```text
20년 이상의 Enterprise IT 경험을,
AI 시대의 문제 해결에 연결합니다.
```

키워드:

| 현재 | 변경 |
|---|---|
| Microsoft MVP | 유지 |
| Symantec | 유지 |
| Veritas | 유지 |
| Arctera | 유지 |
| Enterprise Data | 기업 데이터 |
| AI Product Development | AI 제품 개발 |

`전문가 개인 경력` 고지는 유지한다.

## 6. 회사소개 `/about`

| 현재 | 변경 |
|---|---|
| ABOUT HUMEASE | 휴미즈 소개 |
| HOW WE WORK | 우리가 일하는 방식 |
| EXPERTISE, APPLIED | 전문성 |

본문에서 사업영역 개념을 병기할 경우 첫 언급만 다음처럼 허용한다.

- 기업 데이터(Enterprise Data)
- AI 서비스(Applied AI)

이후에는 한국어만 사용한다.

## 7. 기업 데이터 `/enterprise-data`

| 현재 | 변경 |
|---|---|
| ENTERPRISE DATA | 기업 데이터 |
| CAPABILITIES | 전문 영역 |
| APPROACH | 접근 방식 |

서비스명:

- e-Discovery → 유지
- Internal Control → 내부 통제
- Exchange Archive → Exchange 아카이빙

필요 시 첫 언급만 병기:

- 내부 통제(Internal Control)
- Exchange 아카이빙(Exchange Archive)

## 8. e-Discovery `/consulting/e-discovery`

- `ENTERPRISE DATA / E-DISCOVERY` → `e-Discovery`
- `SCOPE` → `검토 범위`
- `FAQ` → `자주 묻는 질문`

`e-Discovery`는 검색 및 업계 표준 용어이므로 유지한다.

## 9. 내부 통제 `/consulting/internal-control`

- `ENTERPRISE DATA / INTERNAL CONTROL` → `내부 통제`
- `SCOPE` → `검토 범위`
- `FAQ` → `자주 묻는 질문`

SEO metadata 내부의 `Internal Control`은 필요한 경우 유지 가능하다.

## 10. Exchange 아카이빙 `/consulting/exchange-archive`

- `ENTERPRISE DATA / EXCHANGE ARCHIVE` → `Exchange 아카이빙`
- `SCOPE` → `검토 범위`
- `FAQ` → `자주 묻는 질문`

## 11. AI 서비스 `/consulting/ai-transformation`

현재:

```text
APPLIED AI
Ideas, put to work.
SCOPE
PROCESS
BUILT BY HUMEASE
```

변경:

```text
AI 서비스
아이디어를, 실제로 쓰이는 AI로.
제공 영역
진행 방식
직접 만들고 검증합니다
```

`Applied AI`는 metadata/internal classification에서만 필요 시 유지한다.

## 12. AI 포트폴리오 `/ai-services`

- `BUILT BY HUMEASE` → `AI 포트폴리오`
- Breadcrumb `AI Portfolio` → `AI 포트폴리오`

Hero:

```text
직접 만든 서비스로,
AI의 가능성을 보여줍니다.
```

유지.

## 13. AI 프로젝트 상세 `/ai-services/[slug]`

- `HUMEASE AI PROJECT` → `휴미즈 AI 프로젝트`
- `PROJECT DETAIL` → `프로젝트 이야기`

기존 질문형 구성은 유지:

- 어떤 문제에서 시작했나요?
- 어떻게 풀었나요?
- 무엇을 구현했나요?
- AI는 어디에서 작동하나요?
- 어떻게 검증하고 있나요?
- 휴미즈의 역할
- 현재 단계

CTA `AI 프로젝트 목록`은 `AI 포트폴리오` 또는 `포트폴리오 목록`으로 변경한다.

## 14. Arctera 솔루션 `/solutions`

### Hero

- `ARCTERA SOLUTIONS` → `Arctera 솔루션`

### 정의

- `Arctera Solutions 란?` → `Arctera 솔루션이란?`

### 섹션

- `OUR ROLE` → `휴미즈의 역할`
- `REVIEW TOGETHER` → `함께 검토할 항목`

### 6개 해결 과제

사용자 화면의 영문 두 번째 줄을 제거한다.

최종 표시:

1. 커뮤니케이션 컴플라이언스
2. 커뮤니케이션 감독 및 모니터링
3. 기록 관리 및 보존 정책
4. 조사 및 eDiscovery
5. 커뮤니케이션 인사이트 및 분석
6. 아카이브 및 데이터 마이그레이션

`solutions.ts` 내부의 공식 영문 분류값은 SEO/AEO/GEO 정합성을 위해 유지한다.

### 핵심 제품명

아래는 그대로 유지:

- Enterprise Vault Complete
- Enterprise Vault Capture (formerly Merge1)
- Data Insight
- eDiscovery Platform

## 15. Arctera 제품 상세 `/solutions/[slug]`

제품 H1은 절대 번역하지 않는다.

공식 기능/구성명도 유지 가능:

- Exchange Mailbox Archiving
- Classification
- Surveillance
- Discovery Accelerator

설명 문장은 한국어로 유지한다.

권장 섹션명:

- 주요 기능
- 관련 구성요소
- 휴미즈 적용 검토
- 자주 묻는 질문
- 관련 페이지
- 참고 자료

## 16. 문의 `/contact`

- `LET'S TALK` → `문의`
- `HOW TO REACH US` → `연락 방법`

Hero `어떤 문제를 함께 해결할까요?`는 유지한다.

## 17. 인사이트 `/insights`

- `INSIGHTS` → `인사이트`

## 18. Footer

`Copyright © {year} HUMEASE.`는 유지 가능하다.

Header/Footer 로고의 `HUMEASE` 영문은 브랜드이므로 유지한다.

## 19. SEO / AEO / GEO 회귀 금지

이번 작업은 **표시 언어 정리**이며 검색 구조를 단순화하거나 제거하는 작업이 아니다.

### SEO 유지

- title
- meta description
- canonical
- sitemap
- robots
- Open Graph
- structured data
- 기존 URL
- alias
- alternateName
- Merge1 검색 연속성
- Arctera 공식 제품명
- internal linking

### AEO 유지

- AnswerBlock
- QuestionList
- 정의문
- 질문/답변 HTML
- 펼치기 전에도 답변이 정적 HTML에 존재
- JS 의존 없이 답변 내용 인식 가능

`FAQ`라는 화면 label을 없애더라도 질문/답변 구조는 절대 제거하지 않는다.

### GEO 유지

- SourceNotes
- 공식 출처 URL
- 정보 확인일
- 제조사/제품 Entity 관계
- 공식 파트너 아님 고지
- 제품별 휴미즈 검토 항목
- 수행 실적 주장과 검토 기준 분리
- Organization / WebPage / SoftwareApplication / CreativeWork structured data

## 20. Metadata

사용자 화면이 한국어 중심이 되어도 제품 검색용 metadata는 영문 키워드를 유지할 수 있다.

특히:

```text
Enterprise Vault Capture (formerly Merge1) | HUMEASE
```

는 유지한다.

일반 페이지 title은 한국어 중심 권장:

- 기업 데이터 | 휴미즈
- AI 서비스 | 휴미즈
- AI 포트폴리오 | 휴미즈
- Arctera 솔루션 | 휴미즈

## 21. URL 변경 금지

다음 URL은 변경하지 않는다.

```text
/enterprise-data
/consulting/e-discovery
/consulting/internal-control
/consulting/exchange-archive
/consulting/ai-transformation
/ai-services
/solutions
/contact
/insights
```

영문 URL은 기존 링크와 SEO 연속성을 위해 유지한다.

## 22. 디자인 유지

이번 요청은 언어 체계 정리가 중심이다.

유지:

- Cinematic Hero
- full-bleed image
- Premium dark palette
- large typography
- negative space
- scroll transition
- subtle reveal
- reduced motion
- responsive design

한국어 전환에 따라 필요한 범위에서만 조정 가능:

- font size
- max-width
- line break
- tracking
- section spacing
- mobile wrapping

한국어화를 이유로 일반 카드형 IT 사이트 레이아웃으로 회귀하지 않는다.

## 23. 전수 검수 대상

```text
/
/about
/enterprise-data
/consulting/e-discovery
/consulting/internal-control
/consulting/exchange-archive
/consulting/ai-transformation
/ai-services
/ai-services/*
/solutions
/solutions/*
/contact
/insights
/404
```

## 24. 검수 항목

- 장식 목적의 불필요한 영문이 남아 있지 않은가
- 공식 제품명은 그대로 유지되었는가
- `Enterprise Vault Capture (formerly Merge1)`이 유지되었는가
- Merge1 SEO 신호가 사라지지 않았는가
- e-Discovery 등 필요한 업계 용어를 과도하게 번역하지 않았는가
- 한국어 줄바꿈이 자연스러운가
- 320px에서 overflow가 없는가
- 모바일 메뉴의 영문 장식이 제거되었는가
- Footer 메뉴가 한국어로 통일되었는가
- structured data Entity 관계가 유지되는가
- AnswerBlock / QuestionList / SourceNotes가 유지되는가
- canonical / sitemap / robots 정책이 회귀하지 않았는가
- Static Export가 성공하는가
- GitHub Pages 배포가 성공하는가

## 25. 화면 QA

최소 viewport:

- 1920×1080
- 1440×900
- 768px
- 390px
- 320px

증거 화면 최소:

- Home Hero
- Home Data Transition
- Home Experience
- Enterprise Data
- AI 서비스
- AI 포트폴리오
- AI 프로젝트 상세
- Arctera 솔루션
- Enterprise Vault Complete
- Enterprise Vault Capture (formerly Merge1)
- Contact
- Mobile Navigation

## 26. FAIL 기준

다음 중 하나라도 발생하면 FAIL:

1. 장식용 영문 heading이 대량으로 남음
2. 공식 제품명을 임의 번역함
3. `formerly Merge1`이 사라짐
4. SEO/AEO/GEO 컴포넌트 또는 구조를 삭제함
5. URL 변경
6. structured data 관계 손상
7. 모바일 overflow/잘림
8. 한국어 전환으로 Hero가 지나치게 작아짐
9. Premium 레이아웃을 카드형 레이아웃으로 회귀
10. Static Export 또는 GitHub Pages 배포 실패

## 27. 완료 기준

모두 PASS 필요:

- Korean-first Premium 전수 적용
- 고유명/공식 제품명 보존
- SEO/AEO/GEO 회귀 없음
- Merge1 검색 연속성 유지
- 공개 페이지 전수 점검
- Desktop/Mobile QA PASS
- typecheck PASS
- lint PASS
- 기존 검증 스크립트 전체 PASS
- static export PASS
- GitHub Pages deploy PASS

## 28. 범위 외

이번 요청에서 하지 않는다.

- 이미지 신규 생성
- 이미지 재생성
- 홈페이지 구조 전면 재설계
- 신규 기능 개발
- DB/RLS 변경
- 문의 시스템 활성화
- DNS 변경
- www.humease.com 전환
- Vercel 작업
- Search Console/Bing/Naver 등록
- IndexNow 실제 제출
- 검색 순위/AI 인용 성과 보장

## 29. 최종 사용자 경험

목표:

> **한국 고객을 정확히 이해하는, 차분하고 수준 높은 기술회사**

영어가 많아서 글로벌해 보이는 사이트가 아니라,

> **한국어로 명확하게 설명하면서도 제품명과 기술명은 정확하게 사용하는 전문회사**

로 보여야 한다.

우선순위:

```text
한국어 메시지
>
공식 제품/브랜드명
>
필요한 업계 전문용어
>
SEO용 영문
>
장식용 영문
```

**장식용 영문은 원칙적으로 제거한다.**
