# HUMEASE 홈페이지 신규 구축 개발명세서
## v3.0 · Next.js App Router · 신규 저장소 · Vercel

- 작성일: 2026-09-06 / Asia/Seoul
- 문서 상태: 개발·검수 기준. 실제 코드 구현, 저장소 생성, 배포, DNS 변경 완료를 의미하지 않는다.
- 새 프로젝트 / 새 GitHub 저장소 / 새 Vercel 프로젝트의 기준 이름: `humease-web-v2`
- `v3.0`은 설계서 버전, `web-v2`는 홈페이지 프로젝트 이름이다. 서로 다른 버전 체계이며 이름을 다시 변경하지 않는다.
- 최종 대표 주소: `https://www.humease.com`
- 확정 방식: **기존 프로젝트와 분리한 신규 Next.js 구축 → Vercel 검증 → 승인 후 운영 도메인 전환**
- 이미지: **대표님이 이미 생성한 자산 사용. 신규 생성·재생성·생성 프롬프트 작성은 범위에서 제외.**

## 1. 이 문서가 대체하는 것

본 패키지는 v1·v2 설계서의 실행 지침을 전부 대체한다. 구버전 문서를 함께 읽고 충돌을 임의 해석하지 않는다. 디자인·페이지 카피·이미지 식별자는 필요한 내용을 본 패키지에 다시 수록했다. 개발자는 구버전 패키지를 열지 않아도 구현할 수 있어야 한다.

| 구버전 지침 | 이번 확정 기준 |
|---|---|
| 기존 Vite 프로젝트 수정·재사용 | 폐기. 새로운 Next.js 프로젝트를 초기화한다. |
| 기존 저장소에서 feature 브랜치 작업 | 폐기. **새 저장소 안에서만** 작업 브랜치를 만든다. |
| 기존 화면을 Vercel에 먼저 복제 | 폐기. 신설 사이트의 Preview 검증으로 대체한다. |
| React Router·SPA·별도 Puppeteer 프리렌더 | 폐기. App Router와 Next.js 렌더링을 사용한다. |
| `vite build`, `dist`, GitHub Pages용 배포 | 폐기. `next build`와 Vercel Next.js 프리셋을 사용한다. |
| 이미지 17개 생성 | 폐기. 기존 A01–A17 매핑을 실제 생성 자산에 연결한다. |
| 새 홈페이지에 운영 DB·메일 설정 자동 복사 | 금지. 기능 계약을 조사한 뒤 승인된 서버 어댑터만 연결한다. |

Next.js 선택은 이번 프로젝트의 확정 아키텍처다. Vite로 고급 디자인을 만들 수 없거나 Vercel에 배포할 수 없기 때문이라는 설명은 사용하지 않는다.

## 2. 고정 기술 기준

| 영역 | 기준 |
|---|---|
| 프레임워크 | Next.js 16.x의 구현일 기준 안정 보안 패치, App Router |
| 언어 | TypeScript, strict mode |
| React | 선택한 Next.js가 지원하는 안정 버전의 react / react-dom을 같은 버전으로 고정 |
| 스타일 | Tailwind CSS 4.x + 필요한 CSS Modules |
| 런타임 | Node.js 24.x, 로컬·CI·Vercel 메이저 일치 |
| 패키지 관리 | npm, `package-lock.json`, CI는 `npm ci` |
| 페이지 | Server Components 중심의 정적 렌더링, 필요한 작은 부분만 Client Components |
| 모션 | CSS 우선, 필요한 경우 Motion for React 1종. GSAP·Three.js는 이번 범위 제외 |
| 이미지·폰트 | `next/image`, 필요 시 `getImageProps` + picture / `next/font` |
| 검색 메타 | Metadata API / `sitemap.ts` / `robots.ts` |
| 문의 | 같은 Origin의 Next.js Route Handler → 승인된 저장·알림 어댑터 |
| 배포 | 새 GitHub 저장소 → 새 Vercel 프로젝트 |
| 테스트 | ESLint·TypeScript·단위 테스트·Playwright·접근성·성능 검사 |

공식 기준과 설치 시 확인 절차는 [04](docs/04_NEXTJS_ARCHITECTURE.md), 출처는 [09](docs/09_SOURCES_AND_CHANGELOG.md)에 있다. 버전 문자열을 조사 없이 만들어 넣지 않는다. 프레임워크 메이저 변경은 별도 설계 변경이다. [S01][S02][S03][S10]

## 3. 회사·브랜드 방향

**Quiet Intelligence — 조용하지만 수준이 느껴지는 기술회사.**

브랜드 정의: Enterprise Data의 전문성을 바탕으로, 실제 사용되는 AI 서비스와 시스템을 설계·구현하는 회사.

- 영문 메인: **Complexity, made intelligent.**
- 한글 메인: **복잡한 데이터와 아이디어를, 실제로 작동하는 기술로.**
- 두 사업축: **Enterprise Data / Applied AI**
- 자체 프로젝트: **맘이음 — 개발 중**
- 맘이음 핵심 문구: **친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI**

Harvey 50% / Sierra 25% / Cohere 25%는 앞서 합의한 내부 디자인 참고 비중이다. 성능 점수나 타사 현재 화면에 대한 객관적 측정값이 아니다. 대형 타이포·여백·절제된 경험·Enterprise AI 메시지만 참고하며 타사 코드·로고·사진·문구를 복제하지 않는다.

## 4. 홈 구성과 전체 범위

홈은 **Hero → Business → 맘이음 → Expertise → Insights → Contact**의 6개 콘텐츠 영역이다. Header·Footer는 별도다. FROM DATA와 TO INTELLIGENCE를 각각 긴 화면으로 반복하지 않는다.

공개 마케팅 페이지 12개: 홈, 회사소개, Enterprise Data, e-Discovery, Internal Control, Exchange Archive, Applied AI, AI 프로젝트, 맘이음, 솔루션, 문의, 인사이트.

개인정보처리방침·필요한 약관·404·오류 화면·기존 관리자 기능의 인수인계는 별도 시스템 범위다. 회원가입·결제·채팅·AI 추론 API·신규 제품 기능은 만들지 않는다.

## 5. 기존 운영 보호

기존 홈페이지 저장소·작업 폴더·GitHub Pages·워크플로·DB·DNS는 READ-ONLY 기준이다. 기존 코드를 새 저장소에 통째로 복사하거나 기존 저장소를 Next.js로 덮어쓰지 않는다.

참고 가능한 것은 확인된 공개 카피, URL, 회사정보, 사용권이 있는 로고·이미지, 기능 요구와 데이터 계약이다. 실행 코드·환경변수·인증 방식은 자동 재사용하지 않는다.

새 사이트가 통과해도 대표님의 명시적 승인 전에는 `www.humease.com` 연결·DNS 변경·운영 메일 발송·운영 DB 쓰기·기존 Pages 종료를 하지 않는다. Vercel의 Production 배포와 실제 회사 도메인 공개는 서로 다른 단계다.

## 6. 문서 구성과 읽는 순서

| 순서 | 파일 | 책임 |
|---|---|---|
| 1 | [01_SCOPE_AND_BASELINE.md](docs/01_SCOPE_AND_BASELINE.md) | 기존·신규 경계, 사실 검증, 선행 조사 |
| 2 | [02_DESIGN_SYSTEM.md](docs/02_DESIGN_SYSTEM.md) | 레이아웃, 색, 타이포, 모션, 접근성 |
| 3 | [03_PAGES_AND_COPY.md](docs/03_PAGES_AND_COPY.md) | 12개 페이지 최종 문구·CTA·경로 |
| 4 | [04_NEXTJS_ARCHITECTURE.md](docs/04_NEXTJS_ARCHITECTURE.md) | App Router·구조·렌더링·SEO·CI |
| 5 | [05_EXISTING_ASSETS.md](docs/05_EXISTING_ASSETS.md) | 이미 생성된 이미지의 연결·최적화 |
| 6 | [06_CONTACT_SECURITY_OPERATIONS.md](docs/06_CONTACT_SECURITY_OPERATIONS.md) | 문의·관리자·환경·보안 |
| 7 | [07_VERCEL_RELEASE_AND_ROLLBACK.md](docs/07_VERCEL_RELEASE_AND_ROLLBACK.md) | 새 프로젝트 배포·전환·롤백 |
| 8 | [08_QA_AND_HANDOFF.md](docs/08_QA_AND_HANDOFF.md) | 게이트·검수·작업자 지시 |
| 9 | [09_SOURCES_AND_CHANGELOG.md](docs/09_SOURCES_AND_CHANGELOG.md) | 출처·구버전 대체 내역 |

보조 파일 `docs/ASSET_MAP.csv`는 기존 이미지 ID·페이지 연결표다. 실제 이미지·폰트·소스코드·비밀키는 이 명세서 패키지에 포함하지 않는다.

## 7. 구현·검수 역할과 완료 기준

**Claude Code:** 신규 프로젝트 구현·테스트·허용된 Preview 배포·변경 보고. **Antigravity:** 독립 READ-ONLY 검수. **대표님:** 브랜드 공개 내용과 운영 전환·비용·권한 변경 승인.

검수 상태는 `PASS / FAIL / BLOCKED / NOT RUN`으로 구분한다. 테스트를 수행하지 않고 PASS라고 쓰지 않는다. 설계서 작성 완료, 구현 완료, Preview 승인, 실서비스 전환 완료를 구분한다.

구현 시작 전에 구버전 Vite 명세가 새 프로젝트의 `SPEC.md`·`CLAUDE.md`·`AGENTS.md`·작업 큐에 남아 있는지 확인하고 **새 프로젝트 안에서만** 제거한다. 기존 운영 저장소의 파일은 수정하지 않는다.
