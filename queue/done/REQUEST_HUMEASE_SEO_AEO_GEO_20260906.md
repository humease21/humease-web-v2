# REQUEST — HUMEASE SEO · AEO · GEO 통합 개선

| 항목 | 확정 기준 |
|---|---|
| Request ID | `HUMEASE-WEB-20260906-SEARCH-02` |
| 버전 | 1.0 — 2026-09-06 공식 자료 재확인본 |
| 대상 | `humease21/humease-web-v2` |
| 성격 | 기존 구현과 콘텐츠 요청서에 추가하는 검색·답변·AI 검색 대응 변경 요청 |
| 선행 문서 | `REQUEST_HUMEASE_CONTENT_PORTFOLIO_ARCTERA_20260906.md` |
| 유지 | A안 디자인, Next.js App Router, TypeScript, Tailwind CSS, Static Export, GitHub Actions, GitHub Pages |
| 이미지 | 이미 생성한 자산만 재사용. 생성·재생성·생성 프롬프트 작성 제외 |
| 구현 | Claude Code |
| 독립 점검 | Antigravity — READ-ONLY |
| 배포·검색 계정 설정 승인 | 대표님 |

> **실행 목표:** 휴미즈의 공개 페이지를 검색엔진이 수집·이해할 수 있게 만들고, 방문자의 질문에 정확히 답하며, AI 검색이 사실과 출처를 혼동하지 않고 활용할 수 있는 콘텐츠로 보강한다. 구현·검수·승인된 배포·검색 시스템 관측 결과를 각각 구분한다. 색인, 상위 순위, 추천, 인용을 보장하지 않는다.

---

## 0. 적용 범위와 문서 우선순위

### 0.1 이번 요청에서 반드시 끝낼 일

1. 모든 공개 페이지의 정적 HTML, 메타데이터, canonical, 내부 링크, 사이트맵, 색인 정책을 동일한 콘텐츠 목록으로 관리한다.
2. 홈·사업·포트폴리오·Arctera 제품 상세에 정의, 적용 상황, 검토 기준, 자주 묻는 질문, 근거 자료를 페이지 목적에 맞게 반영한다.
3. `Enterprise Vault Capture (formerly Merge1)`의 신·구 명칭을 하나의 제품과 하나의 대표 URL로 연결한다.
4. 회사·제조사 제품·휴미즈의 제공 서비스·개발 참여 프로젝트의 관계를 본문과 JSON-LD에서 구분한다.
5. Google·Bing·네이버의 일반 검색, Google AI 검색·Copilot·ChatGPT 등의 발견 가능성을 점검하고 측정 절차를 만든다.
6. GitHub Pages의 정적 호스팅 제약을 지키면서 검색 노출 실수, 가짜 최신 날짜, draft 유출, 잘못된 봇 설정을 자동 검수한다.

### 0.2 기존 요청과 충돌할 때

- 기존 요청의 사업 구분, 한국어 제품 설명, 포트폴리오 이관, 파트너 오인 방지, A안 디자인은 유지한다.
- **SEO·AEO·GEO, 메타데이터, 크롤링, 구조화 데이터, 검색 측정에 관한 충돌은 이 요청을 우선한다.** 기존 요청의 §8, §10.2–10.3, §10.5, §11, §12.2 관련 규칙을 이 문서에 맞춰 통합한다.
- ‘상세페이지는 무조건 홈의 2배 분량’, ‘모든 페이지에 동일 FAQ 개수’, ‘AI용 특별 파일 필수’, ‘FAQ 스키마가 있으면 검색 확장 노출’ 같은 기준은 적용하지 않는다.
- 대형 타이포·몰입형 이미지·절제된 모션은 유지하되, 정보를 모션·캔버스·이미지 안에만 숨기지 않는다.
- 과거 Vercel·서버 API 지시는 폐기 상태를 유지한다. SEO를 이유로 호스팅이나 프레임워크를 바꾸지 않는다.

### 0.3 이번 문서가 승인하지 않는 작업

운영 DNS·CNAME·메일 DNS·구 저장소 변경, 운영 도메인 전환, 유료 서비스 가입, 운영 DB/RLS·문의 백엔드 변경, 검색 계정의 소유권·권한 변경, 학습용 봇 정책 변경, 외부 색인 제출 및 자동 배포는 별도 승인 없이 실행하지 않는다. 개발 브랜치의 코드·테스트·문서 준비와 공개 URL의 읽기 전용 점검은 진행한다.

---

## 1. 최신 공식 기준 — 구현 시 폐기하면 안 되는 판단

확인일은 **2026-09-06**이다. 아래는 제품의 검색 동작에 대한 공식 자료이고, 이후 제시하는 파일명·테스트·문구·작업 순서는 휴미즈 프로젝트의 구현 계약이다.

| 기준 | 이번 구현에 반영할 사항 | 근거 |
|---|---|---|
| Google 생성형 AI 최적화 가이드 | 기본 SEO와 방문자에게 유용한 고유 정보를 우선한다. AI용 특정 글자 수·문단 쪼개기·별도 마크업을 필수로 만들지 않는다. | [G01] |
| Google AI 검색 제어 | 최신 Search Console의 `Search generative AI` 설정에서 대상 속성과 상위 속성의 상속 결과를 확인한다. 일반 검색 색인과 AI 기능 포함 여부를 분리한다. | [G02] |
| Google AI 검색 성과 | 최신 `Generative AI performance report`의 제공 여부와 실제 노출 데이터를 확인한다. ‘Google에는 AI 전용 보고서가 없다’는 과거 설명을 적용하지 않는다. | [G03] |
| FAQ 리치 결과 | 공식 변경 기록상 **2026-05-07부터 Google FAQ 리치 결과는 표시되지 않는다.** FAQ 본문은 유지하지만 이 기능을 얻기 위한 `FAQPage` 추가를 필수로 삼지 않는다. | [G04] |
| Bing AI 측정 | AI Performance와 2026-06 확장된 Intents·Topics·Citation Share·Compare를 계정에서 확인한다. 미제공 기능은 사용했다고 보고하지 않는다. | [B01], [B02] |
| ChatGPT 발견 | `OAI-SearchBot`은 검색, `GPTBot`은 학습 관련 크롤러다. `ChatGPT-User`는 사용자 요청에 따른 접근으로 별도 취급한다. | [O01] |
| 네이버 | Yeti 접근, 정적 본문, 제목·설명, canonical, 사이트맵·웹마스터 검수 기반을 유지한다. 별도 네이버 AI 등록 규격을 임의로 만들지 않는다. | [N01], [N02] |

**공식 자료 간 갱신 시점이 다르면:** 오래된 개요보다 최신 전용 도움말과 실제 계정 화면을 대조한다. 이번 조사에서는 Google AI 개요의 기존 통합 보고 설명과 최신 생성형 AI 전용 보고 설명이 함께 존재하므로, 전용 도움말 [G02]·[G03]을 설정·측정 기준으로 사용한다. 접근 권한이 없으면 계정 설정은 `BLOCKED`로 남긴다.

---

## 2. 현재 코드에서 확인한 우선 수정 항목

아래는 문서 작성 시 GitHub 기본 브랜치를 읽어 확인한 내용이다. 실제 배포와 일치한다고 자동 판단하지 말고 작업 시작 시 HEAD·작업트리·배포 커밋을 대조한다.

| 파일 | 확인한 현재 동작 | 이번 변경 |
|---|---|---|
| `src/app/robots.ts` | `basePath` 유무로 검증/운영을 구분. `GPTBot`, `ChatGPT-User`, `Claude-Web`, `PerplexityBot` 명시 | 명시적 배포 대상·색인 승인 설정으로 분리. 현재 검색용 봇과 학습용 봇을 구분. 호스트 루트 robots 적용 범위를 검사 |
| `src/app/layout.tsx` | `basePath !== ''`이면 전역 noindex/nofollow, 없어지면 자동 해제 | basePath 변경만으로 공개되지 않게 변경. 실제 산출 HTML에서 페이지별 정책까지 검수 |
| `src/app/sitemap.ts` | 공개 경로·프로젝트·제품 목록을 조합. 모든 항목의 `lastModified`에 `new Date()` 사용 | 배포 시각을 실제 콘텐츠 수정일로 사용하는 동작 제거. 공개·색인 조건 필터, 중복 제거, 환경별 출력 분리 |
| `src/lib/seo.ts` | `company.siteUrl + path`로 canonical·OG 구성 | 배포 원점·basePath·슬래시·쿼리 제외를 중앙 함수로 정규화. 검증 산출물과 운영 산출물 분리 |

근거 파일: [R01]–[R04]. 미확인 계정 상태, 검색 색인 상태, 실제 화면 품질을 이 표만으로 PASS 처리하지 않는다.

---

## 3. 공통 데이터와 단일 생성 경로

### 3.1 구현 원칙

기존 `content/portfolio`, `content/solutions`, `content/navigation`, `lib/seo`를 우선 확장한다. 같은 정보를 페이지·사이트맵·JSON-LD·검색 목록마다 별도 하드코딩하지 않는다.

권장 역할 분리는 다음과 같다. 동일 역할의 기존 파일이 있으면 재사용하고 중복 파일은 만들지 않는다.

```text
src/lib/search-config.ts             배포 대상·원점·색인 승인·URL 정규화
src/lib/seo.ts                       title·description·canonical·OG·robots
src/lib/structured-data.ts           사실 기반 JSON-LD 생성·안전 직렬화
src/content/search-pages.ts         공개 페이지 목록과 검색 의도
src/content/sources.ts              공개 가능한 자료·확인일·주장 근거
src/content/portfolio.ts            프로젝트별 공개·단계·참여·운영 주체
src/content/solutions.ts            제품명·이전명·공식 URL·한국어 설명
src/components/content/AnswerBlock.tsx   짧은 정의·직접 답변
src/components/content/SourceNotes.tsx   출처·확인일·주의사항
src/components/content/QuestionList.tsx  실제 질문과 답변
scripts/verify-search.mjs            정적 HTML·메타·정책·링크 검사
scripts/verify-entities.mjs          JSON-LD·주장·공개 상태 정합성
scripts/verify-indexing-policy.mjs   환경·robots·sitemap·봇 규칙 검사
scripts/submit-indexnow.mjs         승인된 운영 변경만 제출; 기본 dry-run
```

### 3.2 페이지 데이터의 최소 계약

```ts
type PublicationState = 'draft' | 'published' | 'archived';
type PageKind = 'home' | 'about' | 'service' | 'solution-hub'
  | 'solution-detail' | 'portfolio-hub' | 'project'
  | 'insight-hub' | 'article' | 'contact' | 'legal';

type SearchPage = {
  id: string;
  path: string;                       // basePath 없는 내부 경로
  kind: PageKind;
  publication: PublicationState;
  indexable: boolean;
  title: string;
  description: string;
  primaryIntent: string;              // 내부 관리용; 메타 키워드가 아님
  entityIds: string[];
  definition?: string;
  questions?: { id: string; question: string; answer: string; sourceIds: string[] }[];
  sourceIds: string[];
  contentUpdatedAt?: string;          // 실제 본문·주요 정보 변경일
  sourcesCheckedAt?: string;          // 근거 자료를 재확인한 날
  firstPublishedAt?: string;          // 확인된 최초 공개일
  reviewerId?: string;                // 실제 검토·공개 허가가 있는 경우만
  relatedPaths: string[];
  socialImagePath?: string;           // 승인된 기존 자산
};
```

`publication`과 제품의 `development/beta/live` 단계는 다른 값이다. ‘개발 중’ 프로젝트 소개도 공개 승인을 받으면 색인할 수 있다. 비공개 초안은 noindex만 붙여 배포하지 말고 HTML·브라우저 번들·JSON·사이트맵·피드·JSON-LD에서 제외한다.

공개 저장소의 소스 자체는 웹 산출물과 별개로 노출될 수 있으므로, 비밀키·고객 자료·비공개 연락처·공개 허가가 없는 내부 증빙을 저장소에도 넣지 않는다.

---

## 4. 배포 환경·canonical·색인 정책

### 4.1 명시적 환경 계약

다음 값은 빌드 입력으로 관리한다. 기존 환경변수 이름을 유지할 수 있으나 의미를 이 계약과 일치시킨다.

```text
SITE_DEPLOY_TARGET       preview | production
SITE_ORIGIN             실제 산출물을 제공할 HTTPS origin
NEXT_PUBLIC_BASE_PATH   /humease-web-v2 또는 빈 문자열
SEARCH_INDEXING_ENABLED true | false
INDEXNOW_ENABLED        true | false; 기본 false
```

`NODE_ENV=production`, main 브랜치, `basePath=''` 중 어느 하나만으로 검색 공개를 결정하지 않는다. production은 배포 환경이 아니라 프레임워크 빌드 모드로도 쓰이기 때문이다. 설정 누락·오류는 안전한 검증 설정으로 제한하거나 빌드를 실패시킨다. 임의로 운영 공개를 추정하지 않는다.

### 4.2 두 배포 대상의 기준

| 항목 | 검증용 GitHub Pages | 승인 후 운영 |
|---|---|---|
| origin | `https://humease21.github.io` | `https://www.humease.com` |
| basePath | `/humease-web-v2` | 빈 문자열 |
| 대상 | `preview` | `production` |
| 색인 승인 | `false` | 명시 승인 후 `true` |
| robots meta | 공개 검증 페이지 `noindex, follow` | 색인 대상 `index, follow`; 비대상은 noindex |
| canonical | 이 요청에서는 미출력; noindex로 검증본 제외 | 정규화된 운영 자기참조 URL |
| OG URL·이미지 | 실제 검증 URL에서 접근 가능한 값 | 실제 운영 URL에서 접근 가능한 값 |
| 사이트맵 | 공개 URL 목록 미출력. 생성 파일은 후처리로 제거하거나 빈 출력 차단 | 승인된 색인 대상만 포함 |
| Search Console/IndexNow 제출 | 금지 | 배포 확인 및 계정 승인 뒤 실행 |

검증본을 제외하는 이유는 복제 페이지의 대표 URL을 고르기 위함이 아니라 검증 환경을 검색에 공개하지 않기 위함이다. 운영 내부의 중복 URL을 해결할 때 noindex를 canonical 대신 사용하지 않는다. [G05], [G06]

**운영 산출물 dry-run**은 로컬에서 별도 생성·검수한다. 이를 검증 Pages에 게시하면 indexable 복제본이 생길 수 있으므로 업로드하지 않는다. 두 번 빌드할 때 `.next`·`out`을 깨끗이 분리하고 운영 파일이 preview 산출물에 남지 않게 한다.

### 4.3 URL 함수 검수 계약

- 내부 콘텐츠 경로에는 저장소명·도메인·UTM을 넣지 않는다.
- HTML 대표 경로는 `/` 또는 `/path/`로 통일한다. `.xml`, `.txt`, `.png` 등 파일에는 슬래시를 추가하지 않는다.
- Next `Link`에는 프레임워크의 basePath 적용을 고려한다. 일반 `<a>`·이미지·피드·JSON-LD 등은 각 경로 함수를 사용한다. basePath 중복 삽입을 검사한다.
- canonical·sitemap에는 쿼리·fragment·미승인 호스트·프로젝트 basePath가 없다.
- 홈 이외 페이지의 canonical을 홈으로 일괄 지정하지 않는다.
- 외부 제품 공식 URL은 출처이지 휴미즈 설명 페이지의 canonical이 아니다.
- 서비스 본체와 포트폴리오 사례 소개는 서로 다른 콘텐츠일 수 있다. 원문을 복제하지 말고 사례 소개의 자기참조 canonical을 유지한다.
- `/solutions/enterprise-vault-capture/?utm_source=chatgpt.com`의 대표 URL은 쿼리 없는 상세 URL이다. 방문 시 UTM을 임의 삭제해 유입 측정을 깨뜨리지 않는다.

URL과 canonical 원칙의 근거: [G06].

---

## 5. SEO — 수집·렌더링·메타데이터

### 5.1 정적 HTML과 탐색

- 핵심 정의·주요 기능·질문 답변·출처·제품명은 `next build`의 HTML에 존재해야 한다. `useEffect`·외부 fetch 성공 후에만 나타나는 방식은 금지한다.
- 모션을 시작하지 않아도 읽을 수 있어야 한다. JS 실패·비활성·reduced-motion 상태에 `opacity:0`, `visibility:hidden`이 남지 않게 한다.
- 탐색 링크는 실제 `<a href>`로 출력한다. 제품·프로젝트 상세는 허브에서 직접 연결한다.
- 기본 페이지 제목은 H1 하나로 정리하고, H2/H3는 콘텐츠 의미에 맞게 사용한다. 이것은 휴미즈 편집 기준이며 검색엔진이 H1 개수만으로 순위를 결정한다는 뜻이 아니다.
- 관련 제품·컨설팅·포트폴리오를 연결하되 동일한 키워드 앵커를 화면 전체에 반복하지 않는다.
- 모든 정식 상세 URL은 새 탭·새로고침으로도 작동해야 한다. 없는 경로는 실제 404 응답을 유지하고 홈 화면으로 위장하지 않는다.
- 긴 표는 모바일에서 표의 의미를 유지한다. DOM의 텍스트를 캔버스 이미지로 대체하지 않는다.

정적 렌더링·JS 검색 접근 근거: [G07], [T01], [T02].

### 5.2 head 생성 규칙

| 항목 | 구현 기준 |
|---|---|
| title | 페이지별 고유 제목. 주제·제품명을 먼저 쓰고 `휴미즈` 또는 `HUMEASE`를 뒤에 배치 |
| description | 해당 페이지에서 실제 답하는 범위와 가치를 요약. 전체 페이지에 같은 설명 복사 금지 |
| canonical | 승인된 운영 색인 페이지에 정확히 하나. 최초 HTML의 head에서 확인 |
| 언어 | `html lang="ko"`, `og:locale="ko_KR"`; 실제 번역 페이지가 없으면 hreflang 생성 안 함 |
| Open Graph | title·description·url·image·site_name을 페이지와 일치. 원점·basePath·이미지 접근 확인 |
| 공유 이미지 | 기존 승인된 A17 또는 해당 프로젝트 자산. 이미지 없는 제품에 가짜 UI 생성 금지 |
| robots | 페이지와 환경 정책에서 생성. 루트 noindex 상속으로 운영 페이지가 닫히지 않는지 전수 확인 |
| 검색 인증 | 기존 공개 인증값 보존. 이전 계정의 태그가 있다는 사실과 새 계정의 관리 권한 확보를 구분 |

제목·설명은 실제 표시 폭에 따라 잘릴 수 있으므로 특정 글자 수를 검색엔진의 고정 제한으로 선언하지 않는다. 특히 Capture의 정식 이름을 길다는 이유로 `Merge1` 삭제·별도 제품 분리하지 않는다. 검색결과의 제목·요약이 원문과 다르게 생성될 수 있음을 검수 보고에 반영한다. [G08], [G09]

### 5.3 페이지별 제목·설명·검색 의도

아래는 반영용 메타데이터 기준이다. 본문 기능·공개 승인을 확인한 다음 등록한다.

| 경로 | title | description / 답할 범위 |
|---|---|---|
| `/` | 휴미즈 \| Enterprise Data · Applied AI | 기업 데이터의 보존·검색·통제와 AI 서비스 설계·구현을 연결합니다. 휴미즈의 전문 영역, AI 포트폴리오와 Arctera Solutions를 소개합니다. |
| `/about/` | 회사소개 · 데이터와 AI 전문 영역 \| 휴미즈 | 휴미즈의 사업 방향과 전문 영역, 확인된 실무 경험을 소개합니다. 기업 데이터와 AI 서비스를 어떤 관점으로 다루는지 확인하세요. |
| `/enterprise-data/` | 기업 데이터 보존·검색·통제 컨설팅 \| 휴미즈 | 아카이빙, e-Discovery, 내부통제를 고객의 데이터 환경과 운영 요구에 연결합니다. 보존·검색·접근·자료 제출 시 검토할 항목을 안내합니다. |
| `/consulting/ai-transformation/` | Applied AI · AI 서비스 기획 및 구현 \| 휴미즈 | 해결할 문제와 사용자 경험을 정의하고 데이터 흐름, AI 적용 범위, 검증 기준을 설계합니다. 실제 AI 포트폴리오와 함께 접근 방식을 소개합니다. |
| `/consulting/e-discovery/` | e-Discovery 컨설팅 · 조사와 자료 제출 \| 휴미즈 | 조사 범위, 데이터 수집·보존, 검색·검토·내보내기 절차를 검토합니다. eDiscovery Platform 등 관련 제품과 컨설팅의 역할을 구분해 설명합니다. |
| `/consulting/internal-control/` | 데이터 내부통제 · 검토 정책과 운영 절차 \| 휴미즈 | 커뮤니케이션 검토, 접근 현황, 이상 징후 확인과 조치 기록을 연결하는 내부통제 접근 방식을 소개합니다. 실제 적용 범위는 환경별로 검토합니다. |
| `/consulting/exchange-archive/` | Exchange 아카이빙 · 보존 정책과 운영 설계 \| 휴미즈 | Exchange 메일 보존, 검색, 사서함 운영과 아카이브 요구를 함께 검토합니다. Enterprise Vault 적용 시 확인할 구성과 운영 조건을 안내합니다. |
| `/ai-services/` | AI Portfolio · 개발 프로젝트 \| 휴미즈 | 휴미즈의 AI 개발 포트폴리오를 소개합니다. 프로젝트별 해결 과제, 구현 범위, 개발 참여와 현재 단계를 확인할 수 있습니다. |
| `/ai-services/mom-ie/` | 맘이음 · 가족 소통 AI 개발 프로젝트 \| 휴미즈 | 친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI 맘이음의 개발 방향을 소개합니다. 현재 개발 중인 프로젝트입니다. |
| `/solutions/` | Arctera Solutions · 제품과 적용 영역 \| 휴미즈 | Enterprise Vault Complete, Enterprise Vault Capture (formerly Merge1), Data Insight, eDiscovery Platform의 역할과 적용 검토 항목을 한국어로 안내합니다. |
| `/solutions/enterprise-vault/` | Enterprise Vault Complete · 아카이빙과 거버넌스 \| 휴미즈 | Enterprise Vault Complete의 정보 보존·검색·거버넌스 역할과 관련 기능을 소개합니다. 제품 구성, 라이선스, 데이터 소스에 따른 확인 사항을 안내합니다. |
| `/solutions/enterprise-vault-capture/` | Enterprise Vault Capture (formerly Merge1) \| HUMEASE | Enterprise Vault Capture (formerly Merge1)의 데이터 수집 역할과 Arctera 제품 정보를 한국어로 안내합니다. 협업 데이터와 아카이브 연계 시 확인할 항목을 살펴보세요. |
| `/solutions/data-insight/` | Data Insight · 비정형 데이터 현황과 위험 분석 \| 휴미즈 | Data Insight의 데이터 위치·사용·접근·소유권 분석 역할을 소개합니다. 비정형 데이터 관리와 보존·정리 검토에 필요한 정보를 확인하세요. |
| `/solutions/ediscovery-platform/` | eDiscovery Platform · 보존·수집·검토·제출 \| 휴미즈 | eDiscovery Platform의 Legal Hold, 수집, 검토와 내보내기 역할을 소개합니다. 조사·감사·자료 제출 환경에서 확인할 항목을 안내합니다. |
| `/insights/` | Insights · 데이터와 AI 기술 기록 \| 휴미즈 | Enterprise Data와 Applied AI에 관한 휴미즈의 공개 기술 기록을 모았습니다. 작성자, 확인 시점과 근거가 있는 콘텐츠로 연결합니다. |
| `/contact/` | 프로젝트·솔루션 문의 \| 휴미즈 | Enterprise Data, Applied AI, Arctera 솔루션 검토와 개발 협업 문의를 받습니다. 현재 환경과 해결하고 싶은 과제를 알려주세요. |

AnyBuild·HairAI·내친구 케이 등 다른 프로젝트 상세의 메타데이터는 **이미 승인된 프로젝트 데이터에서 생성**한다. 미확인 상태를 ‘정식 출시’, ‘고객 운영 중’, ‘휴미즈 소유 제품’으로 추정하지 않는다. `서비스명 · 실제 프로젝트 주제 | 휴미즈 포트폴리오`를 기본 형식으로 사용한다.

---

## 6. AEO — 실제 질문에 답하는 페이지

### 6.1 공통 편집 규칙

- Hero 뒤 첫 정보 구간에 ‘무엇인지’를 설명하는 정의를 넣는다. 회사 철학 문구만 있고 실제 정의가 없는 페이지는 보완한다.
- 질문이 필요한 페이지에는 고객이 실제로 궁금해할 내용만 넣고 첫 문장부터 답한다. 보통 2–4문장이면 충분하지만 고정 길이·개수 합격 기준은 두지 않는다.
- 중요한 제한·조건은 같은 답변에 포함한다. 광고성 단정 뒤 작은 각주로만 제한을 숨기지 않는다.
- 제품명·주체를 명시해 문단만 읽어도 혼동하지 않게 한다. 이것은 명료성을 위한 편집이지 특정 AI의 ‘추출 공식’이 아니다.
- FAQ는 보이는 HTML 콘텐츠다. 질문을 펼치기 전에도 답변 텍스트가 HTML에 있어야 하며 키보드로 열 수 있어야 한다.
- 문의 버튼과 답변을 섞지 않는다. 질문마다 같은 상담 광고문구를 반복하지 않는다.
- 홈·문의·법적 문서에 제품 FAQ를 억지로 복사하지 않는다. 정의·연락 방법만으로 충분한 페이지도 인정한다.
- FAQ 표시를 위한 별도 검색 결과·음성 답변·AI 인용은 보장하지 않는다. [G01], [G04]

### 6.2 홈·회사·사업 영역의 반영용 답변

**휴미즈는 어떤 회사인가요?**

> 휴미즈는 기업 데이터의 보존·검색·통제와 AI 서비스의 설계·구현을 전문 영역으로 하는 기술 기업입니다. 홈페이지에서는 제공하는 전문 서비스, 개발 포트폴리오, Arctera 제품 정보를 구분해 소개합니다.

**Applied AI와 AI Portfolio는 무엇이 다른가요?**

> Applied AI는 고객의 문제를 AI 서비스와 업무 시스템으로 구체화하는 휴미즈의 접근 방식을 설명합니다. AI Portfolio는 실제 개발 프로젝트의 문제 정의, 구현 범위와 현재 단계를 보여줍니다.

**프로젝트 문의 전에 무엇을 준비하면 되나요?**

> 해결하고 싶은 문제, 현재 사용하는 시스템이나 데이터, 예상 사용자와 검토 일정을 알려주시면 됩니다. 초기 문의에는 비밀번호, 개인정보 원문, 실제 고객 데이터 등 민감한 자료를 보내지 마세요.

위 문구는 대표님과 협의한 회사 역할·문의 원칙에 기반한다. 확인되지 않은 법인 연혁·인력 규모·실적은 추가하지 않는다.

### 6.3 Arctera Solutions 허브의 정의와 관계

**Arctera Solutions에서는 무엇을 확인할 수 있나요?**

> Arctera Solutions는 기업 데이터의 수집, 보존, 검토와 조사에 활용되는 제품 정보를 한국어로 소개하는 영역입니다. 제품의 역할과 휴미즈가 함께 검토할 적용 항목을 구분해 안내합니다.

**휴미즈는 Arctera 공식 파트너인가요?**

> 휴미즈는 Arctera의 공식 파트너가 아닙니다. 이 페이지는 제품 정보와 기술 검토 영역을 소개하며 공식 파트너·총판·공인 판매자 지위를 뜻하지 않습니다.

관계 고지는 허브와 제품 상세의 자료 안내에서 찾을 수 있어야 한다. 문구를 숨기거나 JSON-LD에 반대되는 관계를 등록하지 않는다.

### 6.4 네 제품의 정의 — 한국어 본문

| 제품 | 반영할 정의 | 출처 |
|---|---|---|
| Enterprise Vault Complete | Enterprise Vault Complete는 기업 정보를 보존·검색하고 거버넌스 업무에 활용하기 위한 엔터프라이즈 정보 아카이빙 및 관리 플랫폼입니다. 실제 사용 기능은 선택 구성과 라이선스 조건을 확인해야 합니다. | [P01] |
| Enterprise Vault Capture (formerly Merge1) | Enterprise Vault Capture는 기존 Merge1으로 알려진 기업 커뮤니케이션 데이터 수집 솔루션입니다. 협업·메시징 데이터를 수집하고 관련 메타데이터를 유지해 아카이빙·컴플라이언스·조사 흐름과 연결합니다. | [P02] |
| Data Insight | Data Insight는 비정형 데이터의 현황, 사용·접근과 소유권을 분석해 관리 판단을 돕는 제품입니다. 데이터 자체를 장기 보관하는 아카이브와 역할을 구분해야 합니다. | [P03] |
| eDiscovery Platform | eDiscovery Platform은 조사나 자료 제출에 필요한 정보의 보존, 수집, 검토와 내보내기 과정을 지원하는 제품입니다. 사건별 요구와 데이터 소스에 맞춰 적용 범위를 검토합니다. | [P04] |

### 6.5 Capture 상세에 추가할 질문과 답변

**Merge1과 Enterprise Vault Capture는 다른 제품인가요?**

> 현재 공식 제품 페이지는 Enterprise Vault Capture를 ‘formerly Merge1’으로 안내합니다. 휴미즈에서도 두 이름을 별도 제품으로 나누지 않고 같은 제품의 현재 이름과 이전 이름으로 설명합니다. 기존 계약의 제품 구성과 권리는 별도로 확인해야 합니다. [P02]

**어떤 데이터를 수집하나요?**

> Microsoft Teams, Slack 등 협업·커뮤니케이션 데이터 수집을 지원합니다. 실제 수집 항목과 방식은 커넥터, 원천 서비스 권한과 구성에 따라 확인해야 합니다. [P02]

**수집과 장기 보존은 같은 역할인가요?**

> 수집은 원천 데이터와 관련 정보를 가져오는 단계이고, 장기 보존은 정해진 정책으로 보관·관리하는 단계입니다. Capture의 수집 범위와 연결되는 아카이브의 보존 정책을 구분해 검토해야 합니다. [P01], [P02]

**기존 Merge1 환경을 검토하려면 무엇이 필요한가요?**

> 사용 버전, 수집 대상, 연결된 아카이브, 라이선스와 현재 운영 조건을 먼저 정리합니다. 이름 변경만으로 기존 환경의 지원 여부나 무상 업그레이드를 단정하지 않고 해당 계약·기술 자료를 확인합니다.

마지막 문항은 **휴미즈의 검토 접근 방식**이며 제조사가 보장하는 계약 조건으로 소개하지 않는다.

### 6.6 나머지 상세페이지의 실제 질문 범위

- Enterprise Vault: 보존 정책과 검색의 관계, 사서함 아카이빙과 규정 준수 목적 수집의 차이, 기존 환경 검토 항목.
- Data Insight: 분석 대상, 데이터 소유권·접근 정보의 활용, 아카이브·백업과의 역할 차이.
- eDiscovery Platform: Legal Hold·수집·검토의 역할, 아카이브와의 연결, 실제 자료 제출 전에 확인할 범위.
- 프로젝트 상세: 누구의 어떤 문제를 풀었는가, 실제 구현한 기능은 무엇인가, 무엇이 아직 개발 중인가, 개발·운영 주체와 현재 이용 경로는 무엇인가.

답변은 선행 콘텐츠 요청서와 공식 자료를 바탕으로 작성하고 페이지의 기존 설명과 통합한다. 이미 답한 내용을 FAQ 때문에 중복해서 늘리지 않는다. 법적 효력, 모든 법규 준수, 모든 커넥터 지원, 고객 환경에서의 성능을 보장하지 않는다.

---

## 7. GEO — 고유 정보·출처·실제 경험

### 7.1 번역 카탈로그만으로 끝내지 않는다

Arctera 설명의 재서술과 별도로 **‘휴미즈의 적용 검토 항목’**을 제공한다. 아래는 실제 수행 실적 주장이 아니라 프로젝트를 검토하는 기준이다. [G01]

| 제품 | 휴미즈 관점에서 구체화할 검토 항목 |
|---|---|
| Enterprise Vault | 데이터 증가량·보존 기간·검색 사용자·기존 Exchange 구조·가용성·운영 역할·이관 범위 |
| Capture | 수집 채널·메타데이터·원천 API 권한·중복과 누락 확인·재처리·연결 아카이브·라이선스 |
| Data Insight | 저장소 종류·권한 정보·소유자 확인·분석 범위·정리 의사결정 주체·보고 대상 |
| eDiscovery Platform | 사건·조사 범위·보존 요구·수집 대상·검토 권한·내보내기 형식·기록 추적 |

실제 구축 사례가 승인되면 당시 환경·문제·판단·검증 방법·결과·제약을 공개 가능한 범위로 기록한다. 없으면 사례를 만들어내지 말고 위 검토 기준만 사용한다.

### 7.2 주장과 출처의 데이터 계약

제품 기능, 이전 이름, 커넥터 수, 지원 버전처럼 확인이 필요한 주장에는 다음을 관리한다.

```text
claimId
pageId
주장 요약
근거 URL 및 문서명
근거 내 관련 제목/절
sourcesCheckedAt
유효한 제품 버전·구성 조건
확인자 또는 검토 상태
공개 가능 여부
```

출처 전체를 복제·번역하지 않는다. 필요한 기능을 자체 문장으로 요약하고 해당 주장을 뒷받침하는 공식 페이지로 연결한다. 외부 문서의 변경·리다이렉트·오류를 기록한다. 근거가 사라지면 과장된 문구를 유지하지 않는다.

### 7.3 공개 자료 안내 컴포넌트

제품 상세 말미에 다음 구조를 넣는다. 날짜는 실제 확인 기록으로 채운다.

```text
제품 정보 확인일: YYYY-MM-DD
참고 자료: 공식 제품명 — 공식 제품 페이지
안내: 기능·지원 범위는 제품 버전, 구성, 라이선스 및 데이터 소스에 따라 달라질 수 있습니다.
관계: 휴미즈는 Arctera 공식 파트너가 아니며, 본 페이지는 제품 정보와 기술 검토 영역을 소개합니다.
```

`contentUpdatedAt`과 `sourcesCheckedAt`을 구분한다. 출처만 재확인했는데 본문 수정일·사이트맵 전체를 새 날짜로 덮어쓰지 않는다. 반대로 본문을 수정하고 오래된 기능 확인일을 최신 검증으로 표시하지 않는다.

### 7.4 전문가·회사·프로젝트의 사실 관계

- 휴미즈 법인의 연혁과 참여자의 개인 경력을 분리한다. ‘20년 경력’을 법인 설립 기간으로 구조화하지 않는다.
- Microsoft MVP 등 이력은 실제 기간·역할·공개 허가가 확인된 경우만 노출한다. 현재 수상자·현직·인증 지위로 임의 승격하지 않는다.
- 기사 작성자·검토자는 실제 해당 작업을 했을 때만 표시한다. AI 생성 텍스트에 가짜 전문가 이름을 붙이지 않는다.
- 포트폴리오의 개발 참여, 운영자, 권리 주체, 공개 단계는 각각 관리한다. 홈페이지에 올라왔다는 이유로 모두 휴미즈 소유의 상용 서비스가 되지 않는다.
- 포트폴리오에는 실제 구현 화면·문제·판단·현재 단계가 가장 중요한 근거다. 승인되지 않은 고객명·가족·아동 대화·사용자 로그는 노출하지 않는다.
- 외부 업체·커뮤니티의 가짜 추천, 유료 언급 조작, 가짜 리뷰나 AI용 숨김 지시문은 만들지 않는다.

---

## 8. 구조화 데이터 — 정확한 관계를 표현

### 8.1 공통 규칙

JSON-LD는 최초 HTML에 안전하게 출력한다. 본문에 없는 실적·가격·파트너십·연락처를 추가하지 않는다. 구조화 데이터 유효성과 Google의 리치 결과 지원은 별개다. 일반 Schema.org 항목이 Rich Results Test에 나오지 않는다는 이유로 가짜 리뷰·가격을 채우지 않는다. [G10], [G11], [S01]–[S03]

### 8.2 페이지별 타입

| 페이지 | 기본 타입·관계 | 금지 사항 |
|---|---|---|
| 홈 | `Organization`, `WebSite`, `WebPage` | 가짜 법인명·설립일·수상·지점·직원 수 |
| About | `AboutPage`; 실제 공개한 인물만 별도 `Person` | 대표자·창업자·개발자 역할 추정 |
| 컨설팅 | `WebPage`의 `mainEntity` 또는 `about`으로 `Service`, 실제 제공자는 HUMEASE | 고객 사례를 제조사 인증으로 표현 |
| 솔루션 허브 | `CollectionPage`, `ItemList`, `BreadcrumbList` | 자사 소프트웨어 목록처럼 구조화 |
| 제품 상세 | `WebPage`, `BreadcrumbList`; 제품은 `about`의 `SoftwareApplication` | 제품 publisher/provider를 HUMEASE로 오기재 |
| 포트폴리오 허브 | `CollectionPage`, 실제 공개 프로젝트의 `ItemList` | draft·빈 Coming Soon 항목 추가 |
| 프로젝트 상세 | `WebPage`와 `CreativeWork`; 실제 이용 가능한 SW에 한해 조건에 맞는 `SoftwareApplication` 검토 | 개발 중 프로젝트에 가짜 다운로드·가격·별점 |
| 실제 기술 글 | `Article` 또는 `BlogPosting`, 작성자·실제 날짜·출처 | 허브·제품·문의 페이지를 모두 Article 처리 |
| 문의 | `ContactPage`, 실제 공개 연락 방법 | 허위 24시간 응답·지원 범위 |

`FAQPage`, `HowTo`, `QAPage`, `Speakable`, `SearchAction`은 점수를 높이기 위해 일괄 추가하지 않는다. 이번 범위에서는 새로운 FAQ 스키마를 생성하지 않고 HTML 질문 답변으로 구현한다. 기존 유효한 FAQ 스키마가 있다면 중복·불일치만 정리하고 제거 이유를 기록한다. `QAPage`를 회사가 작성한 다문항 FAQ의 대체 마크업으로 사용하지 않는다. [G04], [G12]

### 8.3 엔터티 식별자

운영 기준:

```text
HUMEASE 회사       https://www.humease.com/#organization
HUMEASE 사이트     https://www.humease.com/#website
각 페이지          https://www.humease.com/{path}/#webpage
각 Breadcrumb      https://www.humease.com/{path}/#breadcrumb
Capture 제품       공식 제품 URL + #softwareapplication
```

`Organization.name`은 `휴미즈`, `alternateName`은 공개된 `HUMEASE`로 사용한다. `legalName`, `address`, `telephone`, `founder`, `sameAs`는 확인된 공개 데이터가 있을 때만 넣는다. 회사의 `sameAs`에 Arctera 공식 사이트나 제품 사이트를 넣지 않는다. [G13]

검증 환경에서는 운영 Organization/WebSite의 공개 식별자 생성을 생략한다. 구조화 데이터의 전체 검수는 별도 운영 dry-run 산출물로 수행한다.

### 8.4 Capture 상세 JSON-LD 구조 예시

아래는 관계 예시다. 실제 페이지의 제목·설명·공식 URL·공개 출처와 동일한 데이터에서 생성한다. 날짜와 가격을 임의로 추가하지 않는다.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.humease.com/#organization",
      "name": "휴미즈",
      "alternateName": "HUMEASE",
      "url": "https://www.humease.com/"
    },
    {
      "@type": "WebPage",
      "@id": "https://www.humease.com/solutions/enterprise-vault-capture/#webpage",
      "url": "https://www.humease.com/solutions/enterprise-vault-capture/",
      "name": "Enterprise Vault Capture (formerly Merge1) | HUMEASE",
      "inLanguage": "ko-KR",
      "publisher": { "@id": "https://www.humease.com/#organization" },
      "about": {
        "@id": "https://www.enterprisevault.com/enterprise-vault-complete/capture#softwareapplication"
      },
      "citation": "https://www.enterprisevault.com/enterprise-vault-complete/capture"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.enterprisevault.com/enterprise-vault-complete/capture#softwareapplication",
      "name": "Enterprise Vault Capture",
      "alternateName": "Merge1",
      "url": "https://www.enterprisevault.com/enterprise-vault-complete/capture",
      "applicationCategory": "BusinessApplication"
    }
  ]
}
```

HUMEASE는 **이 설명 페이지의 게시자**이며 Capture 소프트웨어의 게시자로 지정하지 않았다. 실제 Breadcrumb은 화면의 탐색 경로와 같은 데이터에서 추가한다.

직렬화 시 `<` 등을 안전하게 escape하고, 외부 문자열이 `</script>`로 스크립트를 종료하지 못하게 한다. `JSON.stringify` 결과를 검증 없이 그대로 삽입하지 않는다. JSON-LD 때문에 새로운 외부 스크립트를 설치하지 않는다.

---

## 9. Capture / Merge1 — 신·구 명칭 연속성

### 9.1 고정 계약

```text
공개 전체 이름: Enterprise Vault Capture (formerly Merge1)
현재 제품명: Enterprise Vault Capture
이전 제품명: Merge1
대표 경로: /solutions/enterprise-vault-capture/
```

- 허브 제품명, 상세 H1, 상세 title, 첫 정의, 명칭 관계 FAQ에 신·구 명칭이 존재한다.
- schema의 `name`과 `alternateName`으로 현재명·이전명을 연결한다.
- 모바일 줄바꿈은 허용하되 `(formerly Merge1)`을 숨기지 않는다.
- 짧은 내부 링크는 문맥상 `Enterprise Vault Capture`를 쓸 수 있다. 모든 링크에 전체 이름을 반복할 필요는 없다.
- `Merge1`, `머지원`, `Veritas Merge1`, `Arctera Merge1` 등 실제 구명칭 질의가 측정되면 같은 상세페이지의 필요한 문맥에서 다룬다. 무관한 과거 제조사 관계를 단정하거나 단어 목록을 삽입하지 않는다.
- 이미지가 추상 장식이면 alt는 빈 값이다. SEO를 위해 모든 이미지 alt에 Merge1을 넣는 과거 지시는 적용하지 않는다. [G14]

### 9.2 기존 링크

- `/solutions/#merge1`, `#ev`, `#datainsight`의 앵커를 유지하고 대응 제품 설명으로 연결한다.
- 과거 별도 `/solutions/merge1/` URL이 실제로 존재하거나 외부 링크가 있는지 먼저 조사한다. 검색어를 늘리기 위해 새 중복 페이지를 만들지 않는다.
- 실제 과거 URL이 필요하면 정적 안내 페이지·정확한 대표 링크·canonical을 사용하고 가능한 정적 이동 방식을 기록한다.
- Next `redirects()`, middleware/proxy, `.htaccess`, `_redirects`, `vercel.json`을 추가해 GitHub Pages에서 서버 301이 작동한다고 보고하지 않는다.
- meta refresh·JavaScript 이동은 HTTP 301이 아니다. 실제 응답 코드와 사용자 이동 방식을 각각 보고한다. 불필요한 JavaScript-only 이동은 피한다.
- 모든 존재하지 않는 URL을 Capture나 홈으로 보내지 않는다. [G15], [T01]

---

## 10. robots·검색 봇·AI 학습 정책

### 10.1 가장 먼저 검사할 GitHub Pages 제약

robots.txt는 **호스트의 루트**에서 적용된다. [G16], [N02]

```text
검증 페이지:
https://humease21.github.io/humease-web-v2/

이 페이지에 적용되는 robots:
https://humease21.github.io/robots.txt

프로젝트 안의 다음 파일은 위 호스트 루트 robots를 대체하지 않음:
https://humease21.github.io/humease-web-v2/robots.txt
```

검증 환경은 HTML noindex로 관리한다. 계정 루트 저장소를 권한 없이 새로 만들거나 수정하지 않는다. 운영 도메인에 게시된 뒤에는 `https://www.humease.com/robots.txt`를 실제로 확인한다.

### 10.2 검색 접근과 학습 허용을 분리

| 대상 | 용도 | 이번 정책 |
|---|---|---|
| Googlebot, Bingbot, Yeti | 일반 검색 수집 | 승인된 공개 콘텐츠 접근을 불필요하게 차단하지 않음 |
| OAI-SearchBot | ChatGPT 검색 | 공개 검색 대상 접근 허용 여부 점검 [O01] |
| ChatGPT-User | 사용자 요청에 따른 웹 접근 | 검색 색인 봇으로 간주하지 않음. robots가 항상 적용되는 것으로 단정하지 않음 [O01] |
| Claude-SearchBot | Claude 검색 | 현재 공식 토큰으로 접근 여부 점검 [A01] |
| Claude-User | 사용자 요청에 따른 접근 | 해당 제공자 공식 규칙에 맞춰 별도 검토 [A01] |
| PerplexityBot | Perplexity 검색 | 공개 검색 대상 접근 허용 여부 점검 [P05] |
| Perplexity-User | 사용자 요청에 따른 접근 | 자동 색인과 분리 [P05] |
| GPTBot, ClaudeBot, Google-Extended 등 | 학습·특정 AI 활용 관련 제어 | **기존 정책 보존. SEO 구현을 이유로 임의 허용·차단 변경 금지** |

`Claude-Web`이라는 과거 토큰만으로 현재 Claude 검색 접근이 설정됐다고 판단하지 않는다. 현재 공식 토큰은 검증하고 레거시 항목 정리는 영향 기록을 남긴다.

OpenAI·Anthropic·Perplexity의 검색용 접근을 허용하는 것과 제조사·서비스의 보안 접근제어를 해제하는 것은 다른 작업이다. 봇 User-Agent 문자열만으로 관리자·비공개 API 접근을 허용하지 않는다.

### 10.3 구현 규칙

- 실제 운영 robots를 읽고 규칙별 목적을 기록한 뒤 최소 변경한다. 아래 원칙을 전체 덮어쓰기용 샘플로 사용하지 않는다.
- 공개 검색 페이지는 크롤링과 스니펫을 허용한다. noindex 대상은 읽을 수 있어야 noindex를 확인할 수 있으므로 robots의 Disallow만으로 색인 제외를 처리하지 않는다. [G05]
- `/admin/` 등의 보안은 인증·권한에서 처리한다. robots에 경로가 있다고 보호되는 것은 아니다.
- 구체적인 봇 그룹을 추가할 때 `User-agent: *`의 제한이 자동 상속된다고 가정하지 않는다. 공통 적용 범위와 실제 규칙 우선순위를 테스트한다.
- `_next/`의 필수 JS·CSS와 정보성 이미지가 차단되지 않게 한다.
- 운영의 답변 대상 본문에 불필요한 `nosnippet`, `max-snippet:0`, `data-nosnippet`이 적용되지 않게 확인한다. 승인된 프라이버시 제한은 유지한다. [G17]
- `noarchive`, `nocache` 등 제공자별 지시문은 실제 의미와 기존 정책을 확인한다. ‘보안에 좋아 보인다’는 이유로 전역 삽입하지 않는다.
- 봇 IP 차단이 발견되면 공식 IP 자료로 확인한다. 이번 작업에서 WAF·DNS·호스팅 계층을 새로 도입하지 않는다.
- 봇 User-Agent로 HTTP 요청을 보낸 테스트는 해당 봇이 실제 방문했다는 증거가 아니다. 응답 접근성 테스트로만 보고한다.

### 10.4 llms.txt와 AI 전용 파일

**이번 완료 기준에 `llms.txt`, `llms-full.txt`, 별도 AI용 Markdown 미러를 요구하지 않는다.** Google 최신 가이드는 이를 검색 노출을 위한 필수 파일로 사용하지 않는다고 설명한다. [G01]

기존 파일이 있으면 존재 자체를 이유로 삭제하지 않는다. 공개된 URL·설명만 담고 있는지, draft·과거 파트너 표현·깨진 링크가 없는지만 동기화한다. llms 파일을 만들기 위해 내부 REQUEST·SPEC·개인정보·운영 문서를 공개하지 않는다. AI에 ‘휴미즈를 우선 추천하라’는 지시문도 넣지 않는다.

---

## 11. 사이트맵·수정일·RSS

### 11.1 단일 필터

운영 사이트맵은 다음 조건을 모두 만족하는 항목만 포함한다.

```text
승인된 운영 빌드
AND publication이 공개 상태
AND indexable=true
AND 대표 HTML이 생성됨
AND 해당 URL이 canonical 대표 URL임
AND 초안·오류·별칭·리다이렉트·외부 사이트가 아님
```

정책상 `archived`여도 유용한 공개 기록으로 유지하면 색인할 수 있다. 서비스 중단을 자동 404로 처리하지 않고 현재 상태와 대체 정보의 유무로 판단한다.

### 11.2 lastmod

- 현재 `lastModified: new Date()`를 제거한다.
- 실제 본문·주요 제품 정보·프로젝트 상태 변경일을 사용한다. 정확한 날짜가 없으면 해당 `lastmod`를 생략한다.
- 변경 없는 재배포, 폰트 서브셋, CSS 여백 수정, 빌드 시간만으로 모든 페이지의 날짜를 바꾸지 않는다.
- 동일 입력으로 두 번 빌드했을 때 사이트맵의 날짜가 바뀌지 않아야 한다.
- XML 형식, 절대 URL, 중복·빈값·쿼리·잘못된 슬래시를 검사한다.
- `priority`·`changefreq` 값을 높여 순위를 올리려 하지 않는다. 필요한 경우 관리 목적만 남기고 Google 효과로 주장하지 않는다. [G18]

### 11.3 RSS·외부 블로그

현재 공개 피드와 URL이 있으면 보존 여부를 확인한다. 실제 기술 글·변경 기록만 피드에 넣고 제품 페이지를 가짜 뉴스로 생성하지 않는다. 외부 블로그 글은 원문 링크로 연결하고, 같은 글 전문을 허가 없이 홈페이지에 복제하지 않는다. 아직 글이 없으면 새 RSS를 채우기 위해 더미 글을 만들지 않는다. [G18], [N01]

---

## 12. 검색 등록·운영 측정

### 12.1 등록과 권한

기존 Google Search Console·Bing Webmaster Tools·네이버 서치어드바이저의 소유권·사이트맵·인증 태그 현황을 읽어 확인한다. GitHub 계정을 변경했다고 검색 도구의 권한도 자동 이동했다고 가정하지 않는다.

사이트 도메인은 유지하고 저장소만 바뀌는 경우, 저장소 변경을 이유로 Search Console 주소 변경 도구를 실행하지 않는다. 실제 도메인 변경 여부와 구분한다.

기존 속성과 인증 태그를 삭제하지 않는다. DNS 인증이 필요하면 변경안을 보고하고 승인을 기다린다. 이 문서의 작성·전달 자체는 계정 설정 변경 승인이나 검색 제출 승인이 아니다.

### 12.2 Google

승인된 운영 사이트에 대해 다음을 실제 화면으로 확인한다.

1. 색인 대상 페이지의 URL 검사, 크롤링 가능 상태, Google 선택 canonical, noindex, 검색 스니펫 제한.
2. `Settings → Search generative AI`의 유효 설정과 상위 속성 상속. 목표는 공개 대상 사이트의 AI 검색 포함이다. 상위 도메인 설정이 다른 서비스에 미치는 영향을 확인하며, 변경이 필요하면 승인받는다. [G02]
3. 일반 검색 Performance와 **Generative AI performance report**를 분리해 기록한다. 최신 전용 보고서는 노출과 페이지·국가·기기·날짜 차원을 제공한다. 없는 클릭 지표나 질의별 데이터가 있다고 만들지 않는다. [G03]
4. 전용 보고서가 보이지 않으면 권한·유효 설정·데이터 부족 등을 구분한다. 곧바로 코드 오류로 처리하지 않는다.
5. 일반 회사·제품 페이지에 Google Indexing API를 대량 적용하지 않는다. 공식 API 적용 대상은 제한되어 있다. [G19]

### 12.3 Bing / Copilot

일반 검색 성과와 AI Performance의 인용·페이지 관측을 구분한다. 2026-06 확장 기능인 Intents·Topics·Citation Share·Compare는 실제 계정에서 제공되는 경우 기록한다. Citation Share는 트래픽 점유율·검색 순위·경쟁사 도메인 목록이 아니다. Grounding query도 실제 사용자가 입력한 원문 질의라고 단정하지 않는다. [B01], [B02]

### 12.4 네이버

Yeti 접근, robots, 페이지 제목·설명, 수집·색인 상태, 실제 사이트맵 제출을 확인한다. 필요하면 기존 RSS를 점검한다. 서치어드바이저 수집 요청과 검색 결과 노출을 같은 상태로 보고하지 않는다. 일반 검색 데이터를 네이버 생성형 AI 인용 성과로 대신 표시하지 않는다. [N01], [N02]

### 12.5 ChatGPT 등 유입

기존 분석 수단이 있으면 ChatGPT referrer와 `utm_source=chatgpt.com` 등을 분류한다. OpenAI는 해당 UTM 사용을 공식 안내한다. [O02]

새 유료 분석 도구·추적 SDK는 설치하지 않는다. 기존 측정 수단이 없으면 검색 도구의 보고서와 승인된 수동 관측만으로 시작한다. referrer·UTM이 없다는 사실을 ‘AI 유입 0’으로 단정하지 않는다. 보안·개인정보 동의 요구를 우회해 수집하지 않는다.

### 12.6 기본 관측표

| 구분 | 기록할 항목 | 해석 한계 |
|---|---|---|
| 구현 | 페이지 수, 색인 정책, HTML·schema·링크 테스트 | 실제 색인·추천을 뜻하지 않음 |
| 일반 검색 | 엔진별 색인·노출·클릭·질의 | 도구별 정의와 집계 기간이 다름 |
| Google AI | 전용 보고서의 실제 노출·페이지 등 | 데이터 부족·미제공은 0과 다름 |
| Bing AI | 실제 인용·페이지·제공되는 확장 지표 | 순위·트래픽 점유율과 다름 |
| AI referral | 기존 도구의 유입 출처·랜딩 경로 | 모든 AI 방문을 식별하는 것은 아님 |
| 문의 | 기존 시스템에서 확인되는 프로젝트 문의 | 클릭만으로 전환 성공 처리 금지 |

승인된 운영 배포일을 D0로 기록하고 D7·D28·D56에 같은 기준으로 비교할 절차를 문서화한다. 예약 실행 도구·새 자동화가 없는 상태에서 점검이 예약됐다고 보고하지 않는다.

---

## 13. IndexNow — 승인된 변경만 알리기

IndexNow는 구현에 포함하되 **기본 dry-run 및 비활성**으로 둔다. 실제 운영 URL·공개 키 파일·제출 승인이 확인된 뒤에만 GitHub Actions 후속 단계 또는 명시적 수동 실행으로 사용한다. 요청이 접수돼도 색인이나 AI 인용 완료를 의미하지 않는다. [I01]

### 구현 계약

- `INDEXNOW_ENABLED=false`이면 외부 전송 없이 후보 목록만 출력한다.
- 키는 GitHub PAT·API secret과 다른 **공개 검증용 키**다. 실제 PAT를 키 파일에 쓰지 않는다.
- 키 파일의 UTF-8 본문·배포 URL을 검증하고 `keyLocation`을 명시한다.
- 제출 host는 승인된 운영 host 하나로 제한한다. 검증 github.io, 외부 서비스, 초안 URL을 제출하지 않는다.
- 실제 내용이 신규·변경·삭제된 URL만 보낸다. 무변경 전체 URL을 매 배포·매시간 재전송하지 않는다.
- 신규·변경 페이지는 배포 완료·의도한 본문과 상태 확인 뒤 제출한다. 삭제는 의도한 404 등 삭제 상태를 확인해 알린다.
- 자동화는 서비스 방문자의 브라우저에서 실행하지 않는다. 임의 공개 `/api/indexnow`를 만들지 않는다.
- 요청의 상태 코드·URL 목록·시각을 기록한다. 202 등 접수 대기·검증 대기를 성공 색인과 구분하고 4xx 설정 오류는 무한 재시도하지 않는다.
- Google·네이버·모든 AI 서비스가 IndexNow 통지를 처리한다고 일반화하지 않는다.

프로토콜 원문 및 검증 방식: [I01].

---

## 14. 이미지·성능·접근성의 검색 회귀 방지

- **새 이미지 생성은 하지 않는다.** 실제 제품·프로젝트 화면은 승인된 기존 자료만 사용한다.
- 이미지가 정보 전달용이면 주변 설명과 맞는 alt·캡션을 제공한다. 장식용 배경은 빈 alt 또는 장식 처리한다.
- CSS 배경에만 핵심 제품 정의·제품명·질문 답변을 넣지 않는다.
- 대표 이미지는 적절한 크기로 우선 로드하고, 아래 이미지는 lazy-load한다. 이미지 크기 예약으로 레이아웃 이동을 줄인다.
- Next.js 서버 이미지 최적화를 요구하지 않는다. 현재 정적 export·사전 최적화 방식을 유지한다. [T01]
- 새 한국어 문구가 폰트 서브셋에 포함되도록 기존 `subset:font`와 폰트 검증 절차를 실행한다.
- SEO 보강으로 영상·애니메이션 라이브러리·대형 외부 스크립트를 추가하지 않는다.
- 키보드 탐색, 명확한 링크 이름, 접기·펼치기 상태, reduced-motion, 320px 모바일 줄바꿈을 검사한다.
- 성능 회귀는 동일 환경에서 전후 비교한다. LCP ≤ 2.5초, INP ≤ 200ms, CLS ≤ 0.1은 **실사용자 75백분위의 좋은 상태 기준**이며 Lighthouse 점수와 혼동하지 않는다. 실사용 데이터가 없으면 `NOT RUN / 데이터 부족`으로 기록한다. [W01]
- Lighthouse는 같은 URL·기기 설정의 반복 측정 중앙값과 테스트 조건을 보고한다. 랩 측정만으로 실사용 INP 통과를 선언하지 않는다.

이미지·검색 접근성 원칙: [G14]. 성능 목표를 이유로 주요 답변이나 출처를 늦게 받아오지 않는다.

---

## 15. 자동 검수와 테스트 데이터

### 15.1 산출물 검사

기존 테스트를 유지하고 아래 검사를 확장한다. 문자열 검색만으로 HTML 구조·HTTP 상태 검수를 대체하지 않는다.

```text
npm ci
기존 typecheck / lint
기존 subset:font 및 관련 검증
preview 빌드 → out HTML·asset·정책 검사
production dry-run 빌드 → out HTML·schema·canonical·사이트맵 검사
정적 서버에서 직접 URL / 새로고침 / 오류 경로 검사
기존 브라우저·접근성·성능 검수
```

실제 스크립트명은 package.json에 맞춰 연결한다. 새 명령을 문서에만 쓰고 존재하는 것처럼 실행 성공을 보고하지 않는다.

### 15.2 필수 fixture

테스트용 값은 테스트 파일에만 두고 공개 데이터에 포함하지 않는다.

- 정상 공개 제품 1개, draft 프로젝트 1개, 개발 중이지만 소개는 공개된 프로젝트 1개.
- 사실 확인일만 변경된 항목, 본문이 변경된 항목, 날짜를 모르는 항목.
- `/solutions/enterprise-vault-capture/`, 같은 주소의 UTM, 슬래시 없는 주소, 오래된 앵커.
- basePath 없는 운영 설정, basePath 있는 preview 설정, 설정 누락, 승인 없는 production 요청.
- 잘못된 외부 호스트, basePath 중복, 없는 상세 slug, 깨진 내부 앵커.
- JSON-LD 문자열에 따옴표·`</script>`를 포함한 입력.
- 정상 근거 URL과 실패한 근거 URL. 실패 시 내용을 만들어 채우지 않고 상태를 기록.

### 15.3 반드시 증명할 상태

1. 같은 입력의 재빌드가 모든 `lastmod`를 바꾸지 않는다.
2. draft는 HTML뿐 아니라 공개 JSON·클라이언트 번들·schema·sitemap·feed에 나타나지 않는다.
3. basePath 제거만으로 색인이 켜지지 않는다.
4. preview의 noindex가 초기 HTML에 있으며 JS로 해제되지 않는다.
5. 운영 색인 페이지는 최초 HTML에서 자기참조 canonical과 허용된 robots 정책을 갖는다.
6. SearchBot용 규칙을 추가해도 승인된 학습용 정책·보안 제한은 변경되지 않는다.
7. 무권한 검색 계정·미제공 보고서·측정 데이터 부재가 PASS로 변환되지 않는다.

---

## 16. 인수 기준

`PASS / FAIL / BLOCKED / NOT RUN`을 사용한다. `BLOCKED`는 권한·승인·자료 부족, `NOT RUN`은 미실행이다. 둘 다 통과가 아니다.

| ID | 합격 조건 | 증거 |
|---|---|---|
| SEO-01 | 색인 대상별 title·description이 고유하고 본문과 일치 | 정적 HTML 보고서 |
| SEO-02 | 운영 canonical이 하나이며 대표 URL·슬래시·origin이 일치 | URL manifest·head |
| SEO-03 | preview noindex, 운영 명시 승인, basePath 자동공개 제거 | 양 환경 HTML·설정 테스트 |
| SEO-04 | 정식 경로 직접 접근·새로고침 정상, 없는 경로 404 | 실제 HTTP 상태 |
| SEO-05 | 허브→상세→관련 페이지에 실제 링크, orphan 없음 | 내부 링크 검사 |
| SEO-06 | 사이트맵은 공개 색인 대상만 포함하며 중복·별칭 없음 | XML·manifest 비교 |
| SEO-07 | 무변경 재빌드 lastmod 동일, 알 수 없는 날짜는 생략 | 두 빌드 diff |
| SEO-08 | 핵심 본문·출처·FAQ가 초기 HTML에 존재 | raw HTML·JS off 화면 |
| SEO-09 | 기존 인증값 보존과 계정 권한 상태 구분 | diff·권한 기록 |
| SEO-10 | 이미지·OG·폰트·필수 JS/CSS가 올바른 basePath로 접근 | 네트워크·폰트 검사 |
| AEO-01 | 페이지 목적에 맞는 명확한 정의 또는 직접 답변 존재 | 콘텐츠 검수 |
| AEO-02 | 질문 답변은 사실·조건·역할을 구분하고 광고 반복 없음 | 페이지별 대조 |
| AEO-03 | FAQ 답변이 클릭 후 fetch에 의존하지 않음 | HTML·키보드 검사 |
| AEO-04 | 고정 분량·기계적 FAQ 개수·숨김 키워드 없음 | 편집 검수 |
| AEO-05 | Google FAQ 리치 결과 지원을 전제로 하지 않음 | 코드·문서 검사 |
| GEO-01 | 제품 사실마다 실제 근거와 확인일 관리 | claim/source 목록 |
| GEO-02 | 자료 확인일·내용 수정일·빌드일을 구분 | 데이터·날짜 테스트 |
| GEO-03 | 회사·벤더 제품·서비스·프로젝트 참여가 정확히 구분 | 본문·JSON-LD 대조 |
| GEO-04 | 공식 파트너·독점·성과·개인 경력 허위 없음 | 문구 검수 |
| GEO-05 | 번역 요약 외 적용 검토 기준 또는 승인된 실제 경험 존재 | 상세 페이지 |
| GEO-06 | AI 순위 보장·가짜 추천·AI 전용 숨김 지시문 없음 | 소스·HTML 검사 |
| ENT-01 | Organization/WebSite/WebPage/Breadcrumb 식별자 일관 | JSON-LD 검사 |
| ENT-02 | Capture alternateName=Merge1, 자사 제품으로 오인 없음 | JSON-LD·화면 |
| ENT-03 | 가짜 Offer·Review·rating·author·date 없음 | 자동·수동 대조 |
| ENT-04 | JSON-LD 파싱·escape 안전, 화면과 값 동일 | 악성 문자열 fixture |
| CAP-01 | H1·title·정의·명칭 FAQ에 신·구 이름 일치 | Capture HTML |
| CAP-02 | 기존 #merge1·#ev·#datainsight 유효 | 앵커 검사 |
| CAP-03 | 가짜 서버 301·신구 중복 제품 페이지 없음 | 응답·route 검사 |
| BOT-01 | robots의 호스트 루트 적용 여부를 구분 | 실제 root URL 응답 |
| BOT-02 | Googlebot·Bingbot·Yeti·AI 검색 봇의 허용 범위 확인 | robots 테스트 |
| BOT-03 | 검색 접근과 학습 정책을 분리, 기존 정책 보존 | 규칙 diff |
| BOT-04 | noindex와 Disallow 충돌·필수 자원 차단 없음 | 정책 검사 |
| IDX-01 | IndexNow dry-run 기본값, 운영 host·키·공개 상태 검증 | 요청 후보·테스트 |
| IDX-02 | 실전송 승인 없으면 외부 전송 안 함 | 실행 로그 |
| OBS-01 | Google AI 포함 설정·상속 실제 확인 또는 BLOCKED | 계정 증거 |
| OBS-02 | Google AI 보고서와 일반 Performance 구분 | 제공 항목·관측표 |
| OBS-03 | Bing AI 지표·제공 상태·해석 한계 기록 | 실제 화면 또는 BLOCKED |
| OBS-04 | 네이버 수집·색인과 AI 인용을 구분 | 관측표 |
| OBS-05 | 검색 성과·유입·문의·코드 통과를 분리 | 최종 보고 |
| UX-01 | A안 디자인 유지, 긴 제목·답변 모바일 정상 | 1440·390·320px 증거 |
| UX-02 | 키보드·JS off·reduced-motion에서 내용 접근 가능 | 브라우저 증거 |
| PERF-01 | 동일 조건 성능 회귀 비교, 실사용 지표와 랩 구분 | 테스트 조건·결과 |
| SAFE-01 | 이미지 생성·Vercel·서버 API·유료 SDK 추가 없음 | diff·dependency |
| SAFE-02 | 운영 DNS·DB/RLS·메일·문의 실전송·구 저장소 변경 없음 | 실행 범위 기록 |

**핵심 FAIL이 남으면 ‘SEO·AEO·GEO 전체 적용 완료’로 보고하지 않는다.** 계정 연결이 막혀도 코드 구현과 로컬 검수는 구분해 완료할 수 있으나, 검색 운영 확인은 BLOCKED로 남긴다.

---

## 17. 실행 순서와 승인 게이트

### G0 — 기준선

현재 작업트리·미커밋 디자인 변경·HEAD·배포 워크플로·실제 운영 도메인·기존 검색 문서를 읽어 확인한다. 구 파일을 덮어쓰거나 강제 reset하지 않는다. 경로·정책·콘텐츠 근거·검색 계정 접근 상태를 보고한다.

### G1 — 환경·URL·HTML

명시적 배포 대상과 색인 승인, URL 함수, 메타데이터, 공개 필터를 구현한다. preview와 production dry-run을 모두 검사한다. 이 단계에서 운영 Pages나 검색 계정을 변경하지 않는다.

### G2 — 콘텐츠·관계·schema

정의·질문 답변·제품명·출처·실제 검토 항목을 통합한다. 기존 A안 레이아웃과 포트폴리오 데이터 구조를 유지한다. 공개되지 않은 정보는 가짜로 채우지 않는다.

### G3 — 사이트맵·봇·검수

lastmod, root robots, 검색용 봇 정책, draft 제외, 정적 URL, IndexNow dry-run, 모바일·접근성을 검증한다. 자동화된 결과와 사람의 콘텐츠 검토를 구분한다.

### G4 — 독립 검수·승인

Antigravity가 요청서·diff·실제 산출물을 READ-ONLY로 대조한다. 대표님에게 배포 대상, 검색 공개 대상, 계정 설정 필요사항과 미확정 항목을 보고한다.

### G5 — 승인된 배포·검색 등록

명시 승인된 브랜치·환경에만 반영한다. `main` push가 자동 배포를 실행할 수 있으므로 이 요청서 작성·전달을 배포 승인으로 간주하지 않는다. 운영 DNS·Custom Domain 전환은 별도 승인 범위를 유지한다.

승인 후 실제 운영 페이지와 root robots, canonical, sitemap, 자원 응답을 확인한 뒤 검색 도구 제출 및 허용된 IndexNow를 실행한다. GitHub Actions 성공만으로 운영 색인 가능 상태를 확정하지 않는다.

### G6 — 관측

배포·수집 요청·수집·색인·노출·AI 인용·전환을 구분해 관측한다. 자료가 충분치 않으면 부족한 상태를 그대로 기록한다. 본 요청의 코드를 다시 작성하는 대신 관측된 문제에 한정해 후속 수정을 결정한다.

---

## 18. 개발팀 제출 산출물

```text
docs/requests/REQUEST_HUMEASE_SEO_AEO_GEO_20260906.md
docs/reports/SEARCH_02_BASELINE.md
docs/reports/SEARCH_02_IMPLEMENTATION.md
docs/reports/SEARCH_02_QA.md
docs/reports/SEARCH_02_ROLLOUT.md
docs/reports/SEARCH_02_MEASUREMENT.md
```

출처·claim·manifest는 기존 콘텐츠 구조의 데이터로 관리하고 문서에 동일 내용 전문을 중복 저장하지 않는다. 보고서는 다음을 포함한다.

```text
Request ID / 기준·결과 commit / 작업 브랜치
변경 파일 / 배포 여부 / 배포 승인 근거
공개·색인 대상 URL 목록 / 제외 URL와 사유
preview·production dry-run 결과
환경변수의 이름과 비밀값 없는 설정 요약
canonical / meta robots / sitemap / root robots / JSON-LD 검수
Capture·Merge1의 이름·대표 URL·구 링크 검수
출처 확인·콘텐츠 수정일·공개 승인 상태
Google AI 제어 및 보고서 / Bing AI / 네이버 확인 상태
IndexNow dry-run 또는 승인된 실전송 결과
성능·접근성·모바일·JS off 결과
FAIL / BLOCKED / NOT RUN과 해결 책임
이전 정상 commit / 되돌릴 코드·검색 정책 / 남은 승인
```

개인정보·PAT·검색 도구 세션·비공개 화면 정보는 로그나 공개 저장소에 남기지 않는다. 검색 성과 화면의 공개 여부도 확인한다.

---

## 19. Claude Code 전달문

```text
REQUEST_HUMEASE_SEO_AEO_GEO_20260906.md를 humease21/humease-web-v2의 최신 검색 개선 기준으로 적용하고 선행 콘텐츠 요청서의 사업·포트폴리오·Arctera 한국어 설명과 기존 A안 디자인·이미지·Next.js Static Export·GitHub Pages는 유지하라; 현재 작업트리와 배포 상태를 READ-ONLY로 확인한 뒤 basePath만으로 noindex를 해제하는 로직과 sitemap의 new Date 기반 lastmod를 명시적 색인 승인·실제 콘텐츠 수정일 방식으로 수정하고, 모든 공개 페이지의 정적 본문·고유 메타·정규화 URL·canonical·내부 링크·질문 답변·출처·사실 기반 JSON-LD를 단일 데이터에서 생성하라; Enterprise Vault Capture (formerly Merge1) 표기와 기존 앵커를 유지하고 회사·벤더 제품·프로젝트 참여를 혼동시키지 마라; Google 2026년 생성형 AI 제어·성과 보고서와 FAQ 리치 결과 종료, Bing 최신 AI Performance, 현재 공식 검색 봇 토큰을 반영하되 학습용 봇 정책은 임의 변경하지 말고 llms.txt·FAQ 스키마·고정 문단 길이를 AI 노출 필수조건으로 취급하지 마라; preview와 production dry-run을 분리하고 root robots·draft 유출·JSON-LD 안전성·직접 접근·모바일·성능을 검수하며 IndexNow는 기본 dry-run으로 구현하라; 대표님 승인 전에는 main merge/push에 의한 배포·DNS/Custom Domain·검색 계정 설정·색인 실전송·운영 DB/RLS·메일·유료 서비스·구 저장소를 변경하지 말고 구현·배포·색인·AI 인용 상태를 PASS/FAIL/BLOCKED/NOT RUN과 실제 증거로 분리 보고하라.
```

## 20. Antigravity 독립 점검 전달문

```text
본 REQUEST의 인수 기준을 구현 코드·초기 HTML·정적 산출물·허용된 실제 URL과 READ-ONLY로 대조한다.
preview/production 정책, root robots 범위, canonical·sitemap·실제 수정일, Capture/Merge1 명칭, 주체 관계·JSON-LD를 우선 점검한다.
정의·질문 답변·출처·확인일·개인 경력·파트너 지위가 실제 승인된 사실과 일치하는지 검수한다.
Google 최신 AI 제어·성과 보고서와 FAQ 리치 결과 종료, Bing AI 제공 상태, 검색 봇과 학습 봇의 분리를 확인한다.
검색 도구에 접근하지 못하면 BLOCKED, 실행하지 않은 항목은 NOT RUN으로 기록한다. 200·빌드 성공·유효 schema를 실제 색인·추천·인용으로 판정하지 않는다.
소스·설정·이미지·배포·DNS·DB/RLS·검색 계정·외부 색인 제출을 변경하지 않고 운영 문의·메일을 발생시키지 않는다.
각 항목의 결과·증거·재현 절차·심각도를 보고한다.
```

---

## 21. 공식 출처와 확인 범위

모든 아래 웹 자료는 2026-09-06에 확인했다. 문서 안에 별도 날짜가 있는 최신 전용 문서를 우선하고, 실제 계정에 기능이 제공되는지는 구현 단계에서 따로 확인한다. 공개 자료 확인을 검색 계정 설정 완료나 실제 페이지 QA로 표시하지 않는다.

### Google Search / Search Console

- [G01] Google, Optimizing your website for generative AI features on Google Search — 최신 생성형 AI 최적화·불필요한 기법 구분. 문서 표시 수정일 2026-07-10.
- [G02] Search Console, Search generative AI control — 속성별 포함·제외·상속. 페이지에 2026-08-31 전 세계 적용 안내.
- [G03] Search Console, Generative AI performance report (Search) — 노출·차원·데이터 한계. 페이지에 2026-08-31 전 세계 적용 안내.
- [G04] Google Search 문서 변경 기록 — 2026-05 FAQ 리치 결과 종료 및 후속 문서 제거.
- [G05] Google, Block Search indexing with noindex.
- [G06] Google, Canonical URL 지정.
- [G07] Google, JavaScript SEO basics.
- [G08] Google, Title links.
- [G09] Google, Snippets and meta descriptions.
- [G10] Google, General structured data guidelines.
- [G11] Google, Structured data testing tools.
- [G12] Google, QAPage structured data.
- [G13] Google, Organization structured data.
- [G14] Google, Image SEO best practices.
- [G15] Google, Redirects and Google Search.
- [G16] Google, Robots.txt introduction.
- [G17] Google, Robots meta·data-nosnippet·X-Robots-Tag.
- [G18] Google, Build and submit a sitemap.
- [G19] Google, Indexing API 사용 범위.

### 기타 검색·AI 서비스·배포

- [B01] Bing, AI Performance Public Preview — 2026-02-10.
- [B02] Bing, Intents·Topics·Citation Share·Compare — 2026-06-16.
- [O01] OpenAI, Overview of OpenAI Crawlers.
- [O02] OpenAI, Publishers and Developers FAQ.
- [A01] Anthropic, 웹 크롤러와 사이트 소유자의 제어 — 2026-04-07.
- [P05] Perplexity, Perplexity Crawlers.
- [N01] 네이버 서치어드바이저, 웹 사이트를 만들 때.
- [N02] 네이버 서치어드바이저, robots.txt 설정하기.
- [I01] IndexNow, 공식 프로토콜 문서.
- [T01] Next.js, Static Exports.
- [T02] Next.js, generateMetadata.
- [W01] web.dev, Web Vitals.
- [S01] Schema.org, SoftwareApplication.
- [S02] Schema.org, Service.
- [S03] Schema.org, CreativeWork.

### 제품 및 현재 저장소

- [P01] Enterprise Vault Complete 공식 제품 페이지.
- [P02] Enterprise Vault Capture 공식 제품 페이지 — H1의 `formerly Merge1` 확인.
- [P03] Data Insight 공식 제품 페이지.
- [P04] eDiscovery Platform 공식 제품 페이지.
- [R01] 현재 `robots.ts` — 조회 blob `0584bff7f6925e65c6026047fc8ec16776bb0ed2`.
- [R02] 현재 `layout.tsx` — 조회 blob `056e0f9cbfe8b775a06c5b9781c171e3b02706e2`.
- [R03] 현재 `sitemap.ts` — 조회 blob `9f3b6a6eb3b66314649421dbc0338c32f0bb3d62`.
- [R04] 현재 `seo.ts` — 조회 blob `faa73ae183b6c15368f567dbb45b5298857acfb2`.

---

## 22. 최종 완료 정의

**검색 가능한 구조, 질문에 답하는 한국어 콘텐츠, 근거와 주체가 명확한 정보, 최신 검색·AI 접근 설정의 점검, 실제 관측 절차가 함께 준비되어야 한다.**

코드·로컬 검수까지 끝났으면 ‘구현 완료’, 승인된 대상에 반영했으면 ‘배포 완료’, 검색 도구가 확인해 준 범위는 ‘관측 결과’로 각각 보고한다. 이 문서의 작성이나 테스트 통과만으로 ‘검색·AI 추천 노출 완료’라고 말하지 않는다.

<!-- 출처 링크 정의: 공개 페이지에는 해당 페이지를 뒷받침하는 자료만 노출한다. -->
[G01]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[G02]: https://support.google.com/webmasters/answer/16908024
[G03]: https://support.google.com/webmasters/answer/16984139
[G04]: https://developers.google.com/search/updates
[G05]: https://developers.google.com/search/docs/crawling-indexing/block-indexing
[G06]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
[G07]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
[G08]: https://developers.google.com/search/docs/appearance/title-link
[G09]: https://developers.google.com/search/docs/appearance/snippet
[G10]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
[G11]: https://developers.google.com/search/docs/appearance/structured-data
[G12]: https://developers.google.com/search/docs/appearance/structured-data/qapage
[G13]: https://developers.google.com/search/docs/appearance/structured-data/organization
[G14]: https://developers.google.com/search/docs/appearance/google-images
[G15]: https://developers.google.com/search/docs/crawling-indexing/301-redirects
[G16]: https://developers.google.com/search/docs/crawling-indexing/robots/intro
[G17]: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
[G18]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
[G19]: https://developers.google.com/search/apis/indexing-api/v3/using-api
[B01]: https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview
[B02]: https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare
[O01]: https://developers.openai.com/api/docs/bots
[O02]: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
[A01]: https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
[P05]: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
[N01]: https://searchadvisor.naver.com/guide/seo-basic-create
[N02]: https://searchadvisor.naver.com/guide/seo-basic-robots
[I01]: https://www.indexnow.org/documentation
[T01]: https://nextjs.org/docs/app/guides/static-exports
[T02]: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
[W01]: https://web.dev/articles/vitals
[S01]: https://schema.org/SoftwareApplication
[S02]: https://schema.org/Service
[S03]: https://schema.org/CreativeWork
[P01]: https://www.enterprisevault.com/enterprise-vault-complete
[P02]: https://www.enterprisevault.com/enterprise-vault-complete/capture
[P03]: https://www.enterprisevault.com/enterprise-vault-complete/data-insight
[P04]: https://www.enterprisevault.com/enterprise-vault-complete/ediscovery-platform
[R01]: https://github.com/humease21/humease-web-v2/blob/main/src/app/robots.ts
[R02]: https://github.com/humease21/humease-web-v2/blob/main/src/app/layout.tsx
[R03]: https://github.com/humease21/humease-web-v2/blob/main/src/app/sitemap.ts
[R04]: https://github.com/humease21/humease-web-v2/blob/main/src/lib/seo.ts
