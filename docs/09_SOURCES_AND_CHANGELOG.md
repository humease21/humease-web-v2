# 09. 공식 출처·확인 범위·변경 이력

- 개정 2026-09-06 (v2) — Vercel·서버 기능 출처를 폐기 표시하고 v3.1 변경 이력을 추가했다.


## 1. 확인 기준

공식 기술 문서 확인일: **2026-09-06**. 아래 자료는 기술 기능·설정의 근거다. 페이지 카피·브랜드 비중·색상·API 상태·성능 예산·작업 게이트는 이 프로젝트의 설계 결정이며 타사 문서의 보장이나 인증이 아니다.

이 설계서의 버전 정책은 설치 시점의 안정 보안 패치를 다시 확인하도록 정했다. 공식 문서의 기능 설명을 실제 배포 테스트 완료와 혼동하지 않는다. 회사 실적·법인정보·서비스 상태·이미지 승인 여부는 사용자 자료와 별도 확인으로 관리한다.

## 2. 공식 출처

### [S01] Next.js Installation
- 원문: https://nextjs.org/docs/app/getting-started/installation
- 사용 범위: App Router 초기화·지원 환경·TypeScript·설치·lint 분리

### [S02] Next.js Server and Client Components
- 원문: https://nextjs.org/docs/app/getting-started/server-and-client-components
- 사용 범위: 서버/클라이언트 경계·상호작용 분리

### [S03] Tailwind CSS — Next.js
- 원문: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- 사용 범위: Tailwind의 Next.js/PostCSS 구성

### [S04] Next.js Image Component
- 원문: https://nextjs.org/docs/app/api-reference/components/image
- 사용 범위: next/image·sizes·로딩 힌트·getImageProps

### [S05] Next.js Font Optimization
- 원문: https://nextjs.org/docs/app/getting-started/fonts
- 사용 범위: next/font·self-hosting·최적화

### [S06] Next.js Metadata and OG Images
- 원문: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- 사용 범위: metadata·OG 파일 규칙

### [S07] Next.js robots / sitemap
- 원문: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- 사용 범위: robots.ts 규칙; sitemap 공식 문서도 아래 병기

### [S08] Next.js Route Handlers — **폐기(v2)**
- 원문: https://nextjs.org/docs/app/api-reference/file-conventions/route
- 사용 범위: route.ts·HTTP method·Request/Response

### [S09] Vercel GitHub Deployments — **폐기(v2)**
- 원문: https://vercel.com/docs/git/vercel-for-github
- 사용 범위: 신규 저장소 연결·브랜치 배포

### [S10] Vercel Supported Node.js Versions — **폐기(v2)**
- 원문: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- 사용 범위: Node.js 24.x 지원·메이저 설정·패치 운영

### [S11] Motion for React — Accessibility
- 원문: https://motion.dev/docs/react-accessibility
- 사용 범위: 감소된 움직임 지원

### [S12] Vercel Add a Domain — **폐기(v2)**
- 원문: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- 사용 범위: 프로젝트별 도메인·DNS 설정

### [S13] Next.js redirects — **폐기(v2)**
- 원문: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
- 사용 범위: 명시적 redirect·영구 308

### [S14] WCAG 2.2
- 원문: https://www.w3.org/TR/WCAG22/
- 사용 범위: 대비·키보드·확대·움직임·상태 안내 기준

### [S15] web.dev Web Vitals
- 원문: https://web.dev/articles/vitals
- 사용 범위: LCP·INP·CLS와 현장 측정 기준

### [S16] Vercel Deployment Protection — **폐기(v2)**
- 원문: https://vercel.com/docs/deployment-protection
- 사용 범위: 배포 URL 보호와 범위·요금제 확인

### [S17] Vercel Hobby Plan — **폐기(v2)**
- 원문: https://vercel.com/docs/plans/hobby
- 사용 범위: 비상업적 개인 용도 정책·기업 운영 플랜 확인

### [S18] Next.js proxy.js — **폐기(v2)**
- 원문: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- 사용 범위: 요청/응답 경계·proxy 파일 규칙

S07 보조 원문: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

## 3. 제공 자료와 현재 확인의 한계

이전 `HUMEASE_Website_Development_Package_v2.zip`, `HUMEASE_Development_Spec_v2.md`, `HUMEASE_Image_Prompts_v2.md`를 읽어 합의된 카피·디자인·이미지 식별자를 이관했다. 이전 문서의 GitHub 관찰 내용은 이번에 재검증한 운영 사실이 아니다. 이번 산출물은 실제 저장소 생성·코드 수정·DB 연결·배포·DNS 변경을 수행하지 않았다.

사용자는 이미지 생성이 완료됐다고 밝혔다. 이 패키지는 이미지 생성 프롬프트와 이미지 파일을 다시 포함하지 않고 연결 기준만 제공한다. 실제 파일 경로·내용·해상도 검증은 개발 환경에서 수행한다.

## 4. v2 → v3.0 변경표

| 영역 | 변경 결과 |
|---|---|
| 아키텍처 | 기존 Vite 리뉴얼에서 별도 Next.js App Router 신규 구축으로 변경 |
| 저장소 | 기존 저장소 branch가 아니라 새 humease-web-v2 저장소 |
| 초기 이전 | 기존 Vercel 복제 단계 제거, 신규 Next.js Preview 기반선으로 대체 |
| 렌더링 | SPA·별도 브라우저 프리렌더 제거, Server Components/정적 렌더 중심 |
| 기술 도구 | next/image·next/font·Metadata API·Route Handlers·Next.js 프리셋 |
| 문의 | 브라우저 직접 저장/발송 이관 금지, 서버 검증·어댑터 경계 |
| 관리자 | 무단 삭제 없이 실제 업무·권한 계약만 새 구조에서 보존 |
| 이미지 | 생성·재생성·프롬프트 제외, A01–A17 연결표만 유지 |
| 공개 절차 | staging/live와 Vercel Production/실제 운영 도메인을 분리 |
| 보호 | 기존 코드·Pages·DB·DNS READ-ONLY, 운영 전환 별도 승인 |
| 유지 내용 | 프리미엄 디자인 콘셉트, 홈 6영역, 12페이지 카피, 맘이음 개발 중 |

## 5. 이 문서 이후 변경 방법

정책 변경은 관련 세부 문서와 SPEC.md 버전을 함께 갱신한다. 이미지 재생성·프레임워크 메이저 변경·기존 저장소 수정·DB/RLS 변경·운영 도메인 전환을 일반 UI 수정에 끼워 넣지 않는다. 승인된 변경만 changelog에 사유·영향·승인자·적용 커밋으로 남긴다.

구버전 문서가 작업 지시로 남아 있으면 새 프로젝트 내부에서 본 v3.0 기준으로 교체한다. 기존 운영 저장소 문서를 바꾸는 것은 이번 작업이 아니다.


## 6. v3.0 → v3.1 변경 (2026-09-06)

| 항목 | v3.0 | v3.1 |
|---|---|---|
| 호스팅 | Vercel | **GitHub Actions → GitHub Pages** |
| 빌드 | 서버 포함 | **`output: 'export'` 정적** |
| 문의 | 서버 Route Handler | **mock/disabled + 이메일 CTA** |
| 표시 언어 | 영문 섹션명·영문 Hero | **Korean-first** |
| 공개 페이지 | 12개 | **19개** + 별칭 11개 |

### 폐기된 출처

Vercel 전용 문서(S09·S10·S12·S16·S17)와 서버 기능 문서(S08 Route Handlers·S13 redirects·
S18 proxy.js)는 현재 구조에서 적용되지 않는다. 이력 보존용으로만 남긴다.

### 추가 확인 출처

| ID | 자료 | 확인일 | 적용 범위 |
|---|---|---|---|
| [A01] | Anthropic — 웹 크롤링 및 차단 방법 (`support.claude.com/en/articles/8896518`) | 2026-09-06 | 현행 크롤러 토큰 `ClaudeBot`·`Claude-User`·`Claude-SearchBot`. `Claude-Web`·`anthropic-ai` 는 공식 목록에 없음 |
| [P01] | Arctera 공식 제품 정보 (`arctera.io`) | 2026-09-06 | Enterprise Vault Complete·Capture·Data Insight·eDiscovery Platform 의 역할과 기능 범위 |

출처와 확인일은 `src/content/sources.ts` 에서 코드와 함께 관리한다.

### 변경 근거 문서

`docs/reports/ADR-001`(호스팅), `HUMEASE-WEB-20260906-CONTENT-01`(포트폴리오·Arctera),
`HUMEASE-SEO-AEO-GEO-20260906`(검색), `HUMEASE-KOREAN-FIRST-PREMIUM-20260906`(표시 언어).
