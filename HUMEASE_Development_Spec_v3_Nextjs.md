# HUMEASE 홈페이지 신규 구축 개발명세서 — 통합본

**v3.0 / 2026-09-06 / Next.js App Router / 신규 GitHub 저장소 / Vercel**

이 파일은 개발 패키지 SPEC.md와 세부 문서 9개의 동일 내용을 순서대로 합친 열람용 통합본입니다. 개발팀은 ZIP 안의 SPEC.md를 진입점으로 사용합니다. 이미지 생성·재생성·프롬프트 작성은 포함하지 않습니다.

## 목차

1. SPEC.md
2. docs/01_SCOPE_AND_BASELINE.md
3. docs/02_DESIGN_SYSTEM.md
4. docs/03_PAGES_AND_COPY.md
5. docs/04_NEXTJS_ARCHITECTURE.md
6. docs/05_EXISTING_ASSETS.md
7. docs/06_CONTACT_SECURITY_OPERATIONS.md
8. docs/07_VERCEL_RELEASE_AND_ROLLBACK.md
9. docs/08_QA_AND_HANDOFF.md
10. docs/09_SOURCES_AND_CHANGELOG.md

---

<!-- SOURCE: SPEC.md -->

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

공식 기준과 설치 시 확인 절차는 **04**, 출처는 **09**에 있다. 버전 문자열을 조사 없이 만들어 넣지 않는다. 프레임워크 메이저 변경은 별도 설계 변경이다. [S01][S02][S03][S10]

## 3. 회사·브랜드 방향

**Quiet Intelligence — 조용하지만 수준이 느껴지는 기술회사.**

브랜드 정의: Enterprise Data의 전문성을 바탕으로, 실제 사용되는 AI 서비스와 시스템을 설계·구현하는 회사.

- 영문 메인: **Complexity, made intelligent.**
- 한글 메인: **복잡한 데이터와 아이디어를 실제로 작동하는 기술로**
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
| 1 | **01_SCOPE_AND_BASELINE.md** | 기존·신규 경계, 사실 검증, 선행 조사 |
| 2 | **02_DESIGN_SYSTEM.md** | 레이아웃, 색, 타이포, 모션, 접근성 |
| 3 | **03_PAGES_AND_COPY.md** | 12개 페이지 최종 문구·CTA·경로 |
| 4 | **04_NEXTJS_ARCHITECTURE.md** | App Router·구조·렌더링·SEO·CI |
| 5 | **05_EXISTING_ASSETS.md** | 이미 생성된 이미지의 연결·최적화 |
| 6 | **06_CONTACT_SECURITY_OPERATIONS.md** | 문의·관리자·환경·보안 |
| 7 | **07_VERCEL_RELEASE_AND_ROLLBACK.md** | 새 프로젝트 배포·전환·롤백 |
| 8 | **08_QA_AND_HANDOFF.md** | 게이트·검수·작업자 지시 |
| 9 | **09_SOURCES_AND_CHANGELOG.md** | 출처·구버전 대체 내역 |

보조 파일 `docs/ASSET_MAP.csv`는 기존 이미지 ID·페이지 연결표다. 실제 이미지·폰트·소스코드·비밀키는 이 명세서 패키지에 포함하지 않는다.

## 7. 구현·검수 역할과 완료 기준

**Claude Code:** 신규 프로젝트 구현·테스트·허용된 Preview 배포·변경 보고. **Antigravity:** 독립 READ-ONLY 검수. **대표님:** 브랜드 공개 내용과 운영 전환·비용·권한 변경 승인.

검수 상태는 `PASS / FAIL / BLOCKED / NOT RUN`으로 구분한다. 테스트를 수행하지 않고 PASS라고 쓰지 않는다. 설계서 작성 완료, 구현 완료, Preview 승인, 실서비스 전환 완료를 구분한다.

구현 시작 전에 구버전 Vite 명세가 새 프로젝트의 `SPEC.md`·`CLAUDE.md`·`AGENTS.md`·작업 큐에 남아 있는지 확인하고 **새 프로젝트 안에서만** 제거한다. 기존 운영 저장소의 파일은 수정하지 않는다.


---

<!-- SOURCE: docs/01_SCOPE_AND_BASELINE.md -->

# 01. 범위·기존 운영 경계·선행 조사

## 1. 확정된 의사결정

본 프로젝트는 기존 회사 홈페이지의 내용을 새 구조·디자인으로 교체하되, 구현은 별도 Next.js 프로젝트에서 진행한다. 기존 코드의 리팩터링 프로젝트가 아니다. 페이지별 경로와 사업 내용의 연속성을 유지하는 것과 실행 코드를 재사용하는 것은 구분한다.

새 저장소 이름은 `humease-web-v2`로 정한다. GitHub 소유 조직·계정, 실제 저장소 생성 상태, 로컬 경로, Vercel 팀은 아직 확인되지 않았다. 동일 이름의 저장소·폴더·Vercel 프로젝트가 발견되면 소유와 내용을 확인하고 덮어쓰기·삭제·강제 초기화하지 않는다.

## 2. 현재 정보의 신뢰 수준

| 분류 | 내용 | 처리 |
|---|---|---|
| 이번 대화에서 확정 | Next.js 신규 구축, Vercel 이전, 이미지 생성 완료 | 설계 기준으로 적용 |
| 기존 v2 산출물에 기재 | `Humease/Homepage`, 기존 Vite 계열, GitHub Pages, 문의·관리자·블로그 흐름 | 인수인계 단서. 최신 운영 조사 결과로 재확인 |
| 사용자 제공 주소 | `https://www.humease.com` | 최종 대표 도메인 기준 |
| 아직 미확인 | 운영 커밋, DNS 값, DB·RLS·인증, 이미지 실제 파일명, 정책 승인본, Vercel 팀·요금제 | G0에서 확인. 없다고 추정하지 않음 |

이번 v3 작성 과정은 전달된 v2 파일과 현재 공식 기술 문서를 바탕으로 한 재설계다. GitHub 운영 코드를 이번 작업에서 다시 조회·검증했다고 주장하지 않는다. v2의 특정 코드 문제나 취약 가능성을 현재 확정된 장애로 승계하지 않는다.

## 3. 시스템 경계

| 자원 | 허용 | 금지 |
|---|---|---|
| 기존 저장소·작업 폴더 | 원격·브랜치·빌드·URL·기능 READ-ONLY 조사 | 파일 수정, reset, 새 의존성 설치, commit/push/merge |
| 기존 GitHub Pages | URL·배포·설정 확인과 복구 정보 기록 | 종료, CNAME 삭제, 워크플로 변경 |
| 새 저장소 | Next.js 초기화, feature 브랜치, PR, 승인 절차에 맞는 merge | 구 저장소를 remote origin으로 연결 |
| 새 Vercel 프로젝트 | 승인된 팀·권한·비용 범위에서 Preview 구축 | 기존 프로젝트 설정 재활용·삭제, 운영 도메인 무단 연결 |
| 기존 DB·메일 | 스키마·권한·연계 계약 확인 | 개인정보 덤프, 운영 테스트 쓰기, 신규 컬럼·RLS 변경 |
| 이미 생성된 이미지 | 원본 보호, 실제 경로 매핑, 비생성형 웹 최적화 | 신규 생성, 프롬프트 재작성, 임의 교체·스타일 변경 |
| 다른 서비스 | 승인된 외부 링크만 유지 | 맘이음 앱·내친구 케이·블로그 등 코드/배포/DB/DNS 변경 |

기존 DB 연결을 쓰더라도 새로운 홈페이지를 기존 프런트엔드에 얹는 것으로 해석하지 않는다. 서버 어댑터의 기능 계약만 이어받는다.

## 4. G0 조사 산출물

새 프로젝트의 `docs/reports/G0_BASELINE.md`에 다음을 기록한다. 비밀키·개인정보 원문은 포함하지 않는다.

1. 구·신 저장소 식별자, Git remote, 기본 브랜치, 현재 배포 커밋, 각 작업 디렉터리의 절대 경로와 읽기/쓰기 경계.
2. 실제 공개 URL 목록과 HTTP 상태, 외부 링크, 검색 인증 파일·메타·favicon, canonical, 기존 문의·관리자 경로.
3. DNS 레코드의 이름·타입·현재 값·TTL, 네임서버, HTTPS 상태. 보고서 공개 범위를 내부로 제한한다.
4. 회사명·대표자·사업자정보·연락처의 승인 출처, 경력과 파트너 관계의 공개 근거, 법적 정책의 승인 상태.
5. 문의 저장/알림/관리자 인증의 기능 계약. Supabase·FormSubmit 사용 여부는 실제 확인하고 확정한다.
6. 생성 완료 이미지의 실제 위치·파일명·크기·해시·이미지 ID 매핑. 자산 미연결과 생성 미완료를 혼동하지 않는다.
7. Vercel 팀·권한·상업용 플랜 적합성·보호 설정·환경변수 준비 여부.

접근 불가 항목은 `BLOCKED`로 기록한다. 해당 자료가 없어도 가능한 페이지·레이아웃·모의 어댑터 개발은 계속하되, 검증 없이 운영 전환하지 않는다.

## 5. 콘텐츠 공개 원칙

회사 경력과 개인 경력을 분리한다. 법인 대표자를 대화 호칭이나 개발 담당자 이름으로 추정하지 않는다. 대표자·사업자번호·주소는 승인된 최신 값을 적용한다. ‘국내 유일’, ‘최고’, 미확인 고객 수·매출·인증·파트너십은 공개하지 않는다. 제안 중인 고객 프로젝트는 납품 실적이 아니다.

맘이음은 이번 기업 홈페이지에서 **개발 중**으로 소개한다. 영문 서비스명은 화면에 병기하지 않는다. 내친구 케이는 휴미즈 소유 제품으로 자동 편입하지 않는다. 각 서비스 데이터·법적 문서·소유관계는 혼합하지 않는다.

기업 데이터 경험을 AI 역량과 연결한다는 문구가 고객 보관 데이터를 자체 AI 제품 학습에 사용한다는 뜻이 되지 않도록 한다.

## 6. 이번에 만들지 않는 것

새 로고·마스코트·생성 이미지·동영상, AI 챗봇, 고객 회원가입/결제, 제품 앱 기능, 새 CMS, 자동 뉴스 수집, 신규 운영 데이터베이스, 데이터 이관, 광고 추적·세션 리플레이는 제외한다.

다만 기존 관리자 업무가 실제 존재하면 삭제 대상으로 보지 않는다. 최소 필요 업무를 새 인증 구조로 이어받는 설계를 06 문서에 따라 확인하며, 이관 범위가 확정되지 않으면 릴리스 게이트에서 차단한다.

## 7. 판단 근거

조력자 34%: 신설 스택과 브랜드 시스템을 일관되게 설계한다. 조언자 33%: 신규 구축에서 누락되기 쉬운 URL·문의·관리자·검색 자산을 이관 계약으로 보호한다. 혁신가 33%: 여러 서비스를 장황하게 나열하기보다 기업 데이터 전문성과 직접 만드는 AI 프로젝트를 한 흐름으로 제시한다.

이는 이미 선택한 방향의 취약 지점 보완이다. Vite/Next.js 선택을 다시 열거나 신규 저장소 원칙을 되돌리지 않는다.


---

<!-- SOURCE: docs/02_DESIGN_SYSTEM.md -->

# 02. 디자인 시스템 · Next.js 신규 구현

## 1. 시각적 방향

**Quiet Intelligence.** 거대한 글자, 정밀한 재질, 깊은 여백, 낮은 속도의 움직임을 사용한다. 럭셔리는 금색 장식의 양이 아니라 정렬·크기·명암·완성도로 표현한다. 회로기판·로봇·디지털 뇌·네온 구체는 사용하지 않는다.

한 페이지당 주인공 비주얼은 하나다. 이미 생성된 자산의 실제 구도에 맞춰 레이아웃을 조정하며 새 이미지를 요구하지 않는다. 데이터 페이지는 ‘질서’, AI 페이지는 ‘연결과 실행’, 제품 페이지는 ‘사람에게 이어지는 따뜻함’을 전달한다. 같은 이미지를 모든 페이지에서 그대로 반복하지 않는다.

## 2. 고정 색상 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `bg` | `#090B0E` | 기본 배경 |
| `surface` | `#11151B` | 헤더·안쪽 영역 |
| `surface-raised` | `#181E25` | 입력 영역·상태 표시 |
| `text` | `#F2EFE8` | 주요 본문·제목 |
| `muted` | `#B8BEC7` | 보조 설명 |
| `accent` | `#C7B99D` | 샴페인 실버 포인트 |
| `line` | `#39414C` | 구획선; 입력 테두리는 별도 대비 검증 |
| `light-blue` | `#819AB7` | 이미지 내 극소량의 차가운 반사광 |
| `light-warm` | `#D8B895` | 맘이음 이미지의 따뜻한 반사광 |

블루/바이올렛은 화면을 덮는 그라데이션이 아니라 재질의 반사광으로 제한한다. 본문과 버튼을 낮은 opacity로 흐리게 만들지 않는다. 실제 적용 배경별 대비를 측정한다. 일반 본문 4.5:1, 큰 글자 3:1, 필요한 UI 경계·포커스는 3:1을 검수 기준으로 둔다. [S14]

## 3. 타이포그래피

영문 대형 디스플레이는 **Source Serif 4**, 한글·메뉴·본문은 **Noto Sans KR**를 디자인 지정 폰트로 사용한다. 실제 추가 시 해당 배포본의 상업적 웹 임베딩 허용·라이선스·서브셋을 확인해 저장소의 라이선스 기록에 남긴다. 폰트 파일을 이 문서 패키지에 포함하지 않는다.

- 영문 H1: desktop `clamp(64px, 6.5vw, 104px)`, mobile 40–52px, 행간 0.98–1.08.
- 한글 H1: desktop 52–72px, mobile 32–40px, 행간 1.2–1.3.
- H2: desktop 40–56px, mobile 28–34px.
- 본문: desktop 18px, mobile 16px, 행간 1.65–1.8.
- UI·라벨: 14–16px. 의미 있는 본문을 12px 미만으로 축소하지 않는다.
- 무게: 본문 400/500, UI 500/600. 모든 제목을 900으로 만들지 않는다.

각 페이지 H1은 하나. 한글은 `word-break: keep-all`을 사용하되 긴 URL·이메일에는 별도 줄바꿈 허용. 영문 슬로건은 예술적 인상을 담당하고, 실제 사업 설명과 CTA는 한국어로 읽히게 한다.

## 4. 레이아웃

최대 콘텐츠 폭 1280px. 좌우 여백 desktop 56–80px, tablet 32px, mobile 20px, 320px 화면 16px. 본문 읽기 폭은 680–760px. 섹션 세로 여백 desktop 104–144px, mobile 64–80px.

Hero는 기본 `min-height: 640px`와 유연한 `svh` 조합으로 구성하되 낮은 화면에서 콘텐츠가 잘리지 않게 한다. `height:100vh` 고정으로 폼·본문을 잘라내지 않는다. 모바일에서는 텍스트 → 이미지 순서로 자연스럽게 흐르고 스크롤 시작을 막지 않는다.

첫 화면: 좌측 제목 52–58%, 우측 시각물 42–48%. 글자 뒤에는 항상 충분히 어두운 여백을 확보한다. 이미지 전체에 무거운 검정 필터를 덮어 재질을 없애지 않는다.

## 5. 컴포넌트

- `SiteHeader`: 로고, 사업영역, AI 프로젝트, 인사이트, 회사소개, 문의. Desktop 76px / mobile 64px. 스크롤 후 솔리드 배경으로 읽기 확보.
- `HeroSection`: eyebrow, H1, 짧은 설명, CTA 최대 2개, `BrandVisual`.
- `EditorialSplit`: 큰 이미지와 짧은 본문. 좌우 배치를 섞되 모바일 읽는 순서는 유지.
- `CapabilityRows`: 선과 텍스트로 구성. 일괄 유리 카드 그리드 금지.
- `ProjectFeature`: 상태 배지, 프로젝트 이름, 설명, 실제 화면 또는 콘셉트 이미지.
- `EvidenceBlock`: 검증된 경력 텍스트와 출처/구분. 근거 없는 숫자 카운터 금지.
- `ArticleList`: 실제 글 최대 3개. 비어 있을 때 더미를 채우지 않음.
- `ContactForm`: 접근성 있는 라벨, 동의, 진행·성공·오류 상태.
- `SiteFooter`: 회사 정보, 실제 법적 문서 링크, 이메일, 하위 탐색.

카드 radius는 8–16px. 화면 전체를 40–60px 둥근 유리 카드로 감싸지 않는다. 아이콘은 보조 역할만 한다. hover 효과 없이도 클릭 가능성을 알 수 있어야 한다.

## 6. 모션 규격

이번 버전은 **이미 생성된 정지 이미지 + CSS + 필요한 경우 Motion for React 1종**으로 구현한다. `motion/react`를 사용하며 기존 프로젝트의 모션 코드를 복사하지 않는다. [S11] WebGL/Three.js/대형 영상은 넣지 않는다. 먼저 정지 상태에서 고급스럽고 명확한 화면을 완성한다.

- 일반 등장: 450–650ms, 이동 8–16px, 1회만.
- hover: 160–220ms, 이동 최대 2px 또는 매우 약한 명암 변화.
- Hero: 포인터가 있는 desktop에서만 최대 6px 이동. 텍스트·버튼은 이동하지 않음.
- 자동 장식 모션: 최초 4초 이내 1회로 끝내고 정지. 무한 루프 없음.
- 길게 자동 재생하는 모션으로 범위를 바꾸려면 일시정지 기능을 제공하고 별도 접근성 검토. [S14]
- `prefers-reduced-motion: reduce`: 포인터 반응·패럴랙스·smooth scroll·등장 이동을 끄고 즉시 정지 화면 제공.

스크롤 가로채기, 강제 스냅, 긴 인트로 로딩, 커스텀 커서, 자동 소리, 자동 슬라이더, 글자가 늦게 나타나 빈 Hero만 보이는 구성 금지. JS가 없거나 모션이 실패해도 본문은 보여야 한다.

## 7. 모바일과 접근성

320, 390, 768, 1280, 1440px 검수. 가로 넘침은 `overflow-x:hidden`으로 숨겨 통과시키지 말고 원인을 수정한다. 모든 주요 터치 조작은 프로젝트 기준 44×44px 이상으로 만든다. 이는 WCAG AA의 일반적인 최소 수치를 그대로 인용한 것이 아니라 더 넉넉한 내부 UX 기준이다. [S14]

메뉴: 실제 button, 펼침 상태, Escape 닫기, 포커스 이동/복귀, 키보드 접근. 메뉴가 열려 있을 때만 배경 스크롤을 잠근다. 페이지 앞부분에 ‘본문으로 건너뛰기’를 제공한다.

장식 이미지 alt는 빈 문자열로, 본문 의미를 전달하는 이미지는 적절한 설명으로 처리한다. 생성 조형물을 실제 시스템 아키텍처라고 설명하지 않는다. 200% 확대·400% reflow·키보드만으로 문의 완료 흐름을 확인한다.

## 8. 성능 예산

- 첫 화면 이미지: desktop 전송본 450KB 이하, mobile 250KB 이하 목표.
- 일반 섹션 이미지: 100–220KB 목표.
- OG: 1200×630, 300KB 이하 목표.
- 최초 화면 전송량: HTML+필수 CSS/JS+폰트+Hero 이미지 합계 1.5MB 이하 목표.
- 새 모션 효과가 추가하는 초기 JS: gzip 40KB 이하 목표.
- 이미지에는 크기/aspect-ratio를 지정. 실제 LCP 후보 한 장만 우선 로딩; 나머지는 lazy.

Lighthouse는 조건을 고정해 모바일 3회 중앙값을 기록한다. Performance 90 / Accessibility 95 / Best Practices 95 / SEO 95 이상을 목표로 한다. 실사용자 지표는 p75 LCP≤2.5s, INP≤200ms, CLS≤0.1 목표로 별도 기록한다. 배포 전 Lighthouse 결과를 실사용자 INP 달성으로 포장하지 않는다. [S15]

## 9. Next.js 컴포넌트 경계

Header의 로고·링크·본문은 서버에서 렌더한다. 모바일 메뉴와 폼 상태처럼 상호작용이 필요한 부분만 Client Component로 분리한다. 모든 섹션을 하나의 `use client` 페이지 안에 넣지 않는다. 모션 wrapper는 서버에서 받은 정적 children을 감쌀 수 있으나 회사정보·비밀 설정을 client props로 보내지 않는다. [S02]

레이아웃이 이미지의 구성과 충돌하면 텍스트를 다른 위치로 재배치한다. 이미지 재생성으로 해결하지 않는다. 원본 프레이밍의 중심을 훼손하는 과도한 크롭도 피한다. `next/font`의 실제 배포 파일·서브셋·빌드 네트워크 접근을 검증하며 폰트 파일은 개발 환경에서 합법적으로 조달한다. [S05]

## 10. 시각 검수의 실제 기준

브랜드 게이트에는 1440px와 390px의 Hero·Business·맘이음·문의 스크린샷을 제출한다. 같은 컴포넌트를 12페이지에 반복 배치한 전형적인 SaaS 카드 화면은 승인 기준에 맞지 않는다. 다만 디자인 때문에 방문자가 사업 영역과 문의 경로를 찾지 못하면 장식을 줄인다. 이미지 해상도·가독성·포커스·버튼 상태가 확인되기 전 시각 PASS를 선언하지 않는다.


---

<!-- SOURCE: docs/03_PAGES_AND_COPY.md -->

# 03. 페이지별 개발명세서와 최종 카피 · 신규 Next.js

아래 따옴표 안의 문구는 바로 적용할 공개 카피다. ‘구현 규칙’은 내부 지시이며 화면에 노출하지 않는다. URL을 새로 바꾸는 것보다 기존 검색 경로 유지가 우선이다. 아래 모든 페이지는 신규 App Router의 독립 라우트로 구현한다. 이미지 번호는 이미 생성된 자산에 연결할 식별자이며 생성 작업 지시가 아니다.

## 0. 사이트맵

| ID | 경로 | 메뉴/제목 | 대표 이미지 |
|---|---|---|---|
| P01 | `/` | 홈 | A01 desktop / A02 mobile, A03, A10 |
| P02 | `/about` | 회사소개 | A11 |
| P03 | `/enterprise-data` | Enterprise Data | A04 |
| P04 | `/consulting/e-discovery` | e-Discovery | A05 |
| P05 | `/consulting/internal-control` | Internal Control | A06 |
| P06 | `/consulting/exchange-archive` | Exchange Archive | A07 |
| P07 | `/consulting/ai-transformation` | Applied AI | A08 |
| P08 | `/ai-services` | AI 프로젝트 | A09, A10 |
| P09 | `/ai-services/mom-ie` | 맘이음 | A10 + 실제 승인 제품 캡처 |
| P10 | `/solutions` | 엔터프라이즈 솔루션 | A12 |
| P11 | `/contact` | 문의 | A13 |
| P12 | `/insights` | 인사이트 | A14/A15/A16을 실제 글 주제에 맞춰 사용 |

글로벌 메뉴: **사업영역 / AI 프로젝트 / 인사이트 / 회사소개 / 문의**. 사업영역 서브메뉴에 Enterprise Data, Applied AI, 엔터프라이즈 솔루션. 모바일도 동일한 명칭을 사용한다. 회사 로고는 홈으로 연결한다.

---

## P01. 홈 `/`

### 목적과 배치

첫 화면에서 ‘기술을 이해하는 고급스러운 회사’라는 인상과 실제 사업을 함께 전달한다. 영문만 읽어야 내용을 알 수 있는 화면으로 만들지 않는다. 콘텐츠 영역 6개, 각 영역마다 하나의 역할만 둔다.

### 1. Hero

Eyebrow: **HUMEASE · ENTERPRISE DATA & APPLIED AI**

H1: **Complexity, made intelligent.**

보조 제목: **복잡한 데이터와 아이디어를 실제로 작동하는 기술로**

본문: “기업 데이터의 보존과 통제부터 AI 서비스의 설계와 구현까지. 휴미즈는 기술을 현실의 문제 해결로 연결합니다.”

CTA1: **사업영역 살펴보기** → `/#business`
CTA2: **프로젝트 문의** → `/contact`

이미지: A01. 모바일은 A02를 사용한다. 로고·헤드라인·버튼은 모두 HTML. 배경 자산에 글자를 추가 생성하지 않는다. 실제 생성본의 프레이밍에 맞춰 HTML 텍스트를 배치한다.

### 2. Business `#business`

Eyebrow: **FROM DATA TO INTELLIGENCE**
H2: **데이터의 신뢰에서, AI의 실행으로.**

Enterprise Data 문구: “기업의 중요한 데이터를 보존하고, 통제하고, 필요한 순간 찾을 수 있도록 설계합니다.”
보조: **e-Discovery · Internal Control · Exchange Archive**
링크: **Enterprise Data 알아보기** → `/enterprise-data`

Applied AI 문구: “아이디어와 업무 과제를 사용자에게 필요한 AI 서비스로 구체화합니다. 기획부터 구현과 검증까지 연결합니다.”
보조: **AI 서비스 · 업무 자동화 · 웹 애플리케이션**
링크: **Applied AI 알아보기** → `/consulting/ai-transformation`

구현: 한 섹션 안에서 2개의 편집형 영역. A03을 낮은 높이의 공통 연결 비주얼로 사용한다. 데이터와 AI를 별도 풀스크린 인트로로 늘리지 않는다.

### 3. Own Product

Eyebrow: **BUILT BY HUMEASE**
H2: **우리는 직접 만들며, 가능성을 검증합니다.**
프로젝트명: **맘이음**
상태 배지: **개발 중**

주요 문구: **친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI**

본문: “부모님에게는 일상을 함께하는 대화 상대를, 가족에게는 더 자연스럽게 연결되는 계기를. 휴미즈가 준비하고 있는 가족 소통 AI 서비스입니다.”
CTA: **맘이음 프로젝트 보기** → `/ai-services/mom-ie`

이미지: A10. 실제 제품 화면이 확보되면 비식별화한 승인 캡처로 교체 가능. 콘셉트 이미지로 구현 완료를 주장하지 않는다.

### 4. Expertise

Eyebrow: **EXPERTISE, APPLIED**
H2: **기술의 깊이는, 문제를 해결해 온 경험에서 나옵니다.**
본문: “기업 데이터 환경과 운영 제약을 이해하는 전문성을 바탕으로, 필요한 기술을 선택하고 실행 가능한 구조를 설계합니다.”
CTA: **휴미즈 알아보기** → `/about`

증거 행은 검증된 개인 전문경력만 추가한다. 숫자 증명이 없으면 이 카피만으로 완성한다. 대기업 로고 띠, 미확인 20년 기업 업력·고객수는 넣지 않는다.

### 5. Insights

H2: **현장에서 생각하고, 기술로 답합니다.**
본문: “Enterprise Data와 Applied AI에 대한 휴미즈의 생각과 기록을 만나보세요.”
CTA: **인사이트 보기** → `/insights`

실제 확인된 글이 있을 때 최대 3개. 없으면 소개 문구와 CTA만 노출한다. 가짜 최신 글을 만들지 않는다.

### 6. Contact

H2: **해결하고 싶은 문제가 있다면, 함께 살펴보겠습니다.**
본문: “데이터 환경의 고민부터 AI 서비스 아이디어까지. 현재 상황과 기대하는 변화를 알려주세요.”
CTA: **프로젝트 문의** → `/contact`

### SEO

Title: **휴미즈 | Enterprise Data & Applied AI**
Description: **기업 데이터의 보존·검색·통제부터 AI 서비스 설계와 구현까지. 휴미즈의 Enterprise Data, Applied AI, 맘이음 프로젝트를 만나보세요.**

---

## P02. 회사소개 `/about`

### Hero

Eyebrow: **ABOUT HUMEASE**
H1: **복잡한 기술을, 사람에게 필요한 가치로.**
본문: “휴미즈는 기업 데이터의 신뢰를 설계하고, AI를 실제 사용되는 서비스로 연결하는 기술회사입니다.”
이미지: A11. 실제 사무실 사진으로 설명하지 않는다.

### 회사 설명

H2: **기술을 더하는 것보다, 문제를 제대로 이해하는 일.**

“기업의 시스템에는 데이터만 있는 것이 아닙니다. 운영 방식과 사람의 역할, 보안 기준과 업무의 제약이 함께 있습니다. 휴미즈는 이러한 맥락을 먼저 이해하고, 필요한 기술과 실행 순서를 설계합니다.”

“Enterprise Data와 Applied AI는 서로 다른 서비스를 나열한 것이 아닙니다. 데이터를 다뤄 온 경험을 바탕으로 신뢰할 수 있는 기술을 만들고, 그 기술이 실제로 쓰이게 한다는 같은 원칙을 공유합니다.”

### 일하는 방식

**먼저 이해합니다.** “현재 환경, 해결할 문제, 기대하는 결과를 구체화합니다.”

**필요한 만큼 설계합니다.** “과한 기능보다 실제 운영할 수 있는 구조와 우선순위를 정합니다.”

**구현하고 검증합니다.** “작동 여부뿐 아니라 사용성과 운영 조건까지 함께 살펴봅니다.”

### 전문성

H2: **경험은 이름이 아니라, 실행의 기준이 됩니다.**

공개 기본 문구: “Enterprise IT와 데이터 컴플라이언스에 대한 실무 경험을 바탕으로 설계와 구현을 지원합니다.”

구현: Microsoft MVP 수상/활동, Symantec·Veritas·Arctera 관련 경력은 대상자·기간·관계를 확인한 후 **전문가 개인 경력**이라는 제목 아래 기재한다. 대표자를 안형진으로 자동 바꾸지 않는다. 회사 설립연도와 개인 경력을 합쳐 20년 기업처럼 보이게 하지 않는다. 현행 소속/공식 파트너 관계를 근거 없이 표현하지 않는다.

CTA: **함께할 프로젝트 문의** → `/contact`

SEO Title: **회사소개 | 휴미즈**
Description: **기업 데이터의 신뢰와 AI 서비스의 실행을 연결하는 휴미즈. 문제를 이해하고, 설계하고, 구현하는 접근 방식을 소개합니다.**

---

## P03. Enterprise Data `/enterprise-data`

### Hero

Eyebrow: **ENTERPRISE DATA**
H1: **중요한 데이터를, 믿고 활용할 수 있도록.**
본문: “보존과 검색, 통제와 운영까지. 기업의 데이터가 필요한 순간 제 역할을 할 수 있도록 정책과 시스템을 함께 설계합니다.”
CTA: **데이터 환경 상담** → `/contact?service=enterprise-data`
이미지: A04.

### 역량 영역

**e-Discovery** — “조사와 감사, 분쟁 대응에 필요한 데이터를 찾고 검토할 수 있는 체계를 설계합니다.” → `/consulting/e-discovery`

**Internal Control** — “민감정보와 커뮤니케이션 리스크를 살펴보고, 점검·조치·기록의 흐름을 정리합니다.” → `/consulting/internal-control`

**Exchange Archive** — “메일 보존 정책과 사용 환경을 함께 고려해, 아카이빙과 검색 구조를 설계합니다.” → `/consulting/exchange-archive`

### 접근 방식

H2: **환경에 맞는 구조가, 오래 작동합니다.**

**진단:** “데이터 소스, 보존 정책, 검색 요구, 시스템 제약을 확인합니다.”
**설계:** “업무와 운영 기준에 맞는 아키텍처와 적용 범위를 정리합니다.”
**검증:** “도입·이관·운영 단계에서 확인할 조건과 시험 항목을 수립합니다.”

솔루션 연결 문구: “어떤 제품을 쓸지보다, 어떤 문제를 해결할지가 먼저입니다.”
링크: **검토 가능한 솔루션 보기** → `/solutions`

SEO Title: **Enterprise Data | 휴미즈**
Description: **e-Discovery, 내부 통제, Exchange 아카이빙을 위한 정책과 시스템 설계. 휴미즈와 기업 데이터 환경의 과제를 검토하세요.**

---

## P04. e-Discovery `/consulting/e-discovery`

### Hero

Eyebrow: **ENTERPRISE DATA / E-DISCOVERY**
H1: **필요한 증거를, 설명 가능한 과정으로.**
본문: “조사·감사·분쟁 대응에 필요한 데이터의 보존, 수집, 검색과 검토 흐름을 기업 환경에 맞게 설계합니다.”
이미지: A05.

### 해결할 과제

H2: **자료를 찾는 일보다, 대응 체계를 만드는 일.**
“데이터가 여러 시스템에 흩어져 있거나, 요청할 때마다 담당자가 수작업으로 대응하고 있다면 범위·권한·절차부터 정리해야 합니다.”

### 지원 범위

**대상과 범위 정리:** “요청 목적, 기간, 관련 데이터와 보존 요건을 함께 확인합니다.”
**검색·검토 구조:** “검색 조건과 검토 역할, 처리 흐름을 설계합니다.”
**운영과 증적:** “접근 권한과 수행 기록 등 운영에 필요한 점검 항목을 정리합니다.”

산출물 표현: “프로젝트 범위에 따라 요구사항 정리, 데이터 흐름·아키텍처, 적용 계획과 검증 항목을 제공합니다.”

FAQ1: **기존 아카이브와 연계할 수 있나요?** “데이터 소스와 제품 버전, 연결 방식, 사용 권한을 확인한 뒤 적용 범위를 검토합니다.”
FAQ2: **법률 판단도 제공하나요?** “휴미즈는 기술과 운영 체계의 설계를 지원합니다. 법률 판단과 제출 의무의 해석은 고객의 법무 담당자 또는 법률 전문가와 함께 확인해야 합니다.”
FAQ3: **특정 제품만 사용하나요?** “현재 환경과 요구를 먼저 확인하고 적합한 구성을 검토합니다.”

CTA: **e-Discovery 상담** → `/contact?service=e-discovery`
연결: **Enterprise Data 전체 보기** → `/enterprise-data`
SEO Title: **e-Discovery 컨설팅 | 휴미즈**
Description: **조사·감사·분쟁 대응을 위한 데이터 보존, 검색, 검토 흐름을 기업 환경에 맞게 설계하는 휴미즈 e-Discovery 컨설팅.**

---

## P05. Internal Control `/consulting/internal-control`

### Hero

Eyebrow: **ENTERPRISE DATA / INTERNAL CONTROL**
H1: **리스크를 발견하고, 대응을 기록하는 구조.**
본문: “민감정보와 업무 커뮤니케이션을 관리하는 기준부터 점검·조치의 흐름까지. 실제 운영을 고려한 통제 체계를 설계합니다.”
이미지: A06.

### 본문

H2: **도구보다 먼저, 무엇을 어떻게 관리할지 정합니다.**
“모든 데이터를 무작정 수집하거나 경고를 늘리는 대신, 필요한 범위와 담당자의 역할, 예외 상황과 조치 기준을 구체화합니다.”

**관리 범위:** “데이터 유형과 대상 시스템, 확인할 리스크를 정리합니다.”
**점검 흐름:** “정책·규칙·검토 절차와 담당자 역할을 설계합니다.”
**후속 조치:** “검토 결과의 기록, 예외 처리, 운영 점검 항목을 연결합니다.”

FAQ1: **기존 보안·아카이빙 환경과 함께 검토하나요?** “현재 시스템과 운영 정책을 확인하고 필요한 연계 범위를 살펴봅니다.”
FAQ2: **리스크 탐지 정확도를 보장하나요?** “데이터·정책·제품 구성에 따라 결과가 달라집니다. 적용 전 시험과 운영 중 점검 기준을 함께 정하는 것이 중요합니다.”
FAQ3: **모든 직원 데이터를 수집해야 하나요?** “업무 목적과 허용 범위를 먼저 검토하며, 불필요한 수집을 기본 전제로 삼지 않습니다.”

CTA: **내부 통제 상담** → `/contact?service=internal-control`
SEO Title: **Internal Control 컨설팅 | 휴미즈**
Description: **민감정보와 업무 커뮤니케이션의 관리 기준, 점검, 조치와 기록을 연결하는 휴미즈 내부 통제 컨설팅.**

---

## P06. Exchange Archive `/consulting/exchange-archive`

### Hero

Eyebrow: **ENTERPRISE DATA / EXCHANGE ARCHIVE**
H1: **메일의 가치는 남기고, 운영의 부담은 줄이도록.**
본문: “메일 보존과 검색, 사용자의 접근 방식과 시스템 운영을 함께 고려해 아카이빙 구조를 설계합니다.”
이미지: A07.

### 본문

H2: **보관 용량만이 아니라, 사용하는 방식까지.**
“아카이브의 목적은 데이터를 옮기는 데서 끝나지 않습니다. 무엇을 얼마나 보관할지, 사용자가 어떻게 찾을지, 운영자가 어떻게 관리할지가 함께 정리되어야 합니다.”

**환경 진단:** “메일 구성, 사용자 수, 데이터 규모와 증가 추이, 현재 보존 방식을 확인합니다.”
**정책·구조 설계:** “보존 정책, 아카이빙 범위, 검색·접근 방식을 구체화합니다.”
**이관·운영 검토:** “이관 순서와 검증, 운영 인수인계 항목을 정리합니다.”

FAQ1: **Microsoft 365와 온프레미스 모두 가능한가요?** “구성·버전·제품 지원 범위가 다르므로 환경을 확인해 적용 가능성을 검토합니다. 단일 방식으로 모든 환경이 지원된다고 안내하지 않습니다.”
FAQ2: **용량 절감률을 미리 알 수 있나요?** “실제 데이터와 정책을 확인해야 산정할 수 있습니다. 확인하지 않은 비율을 약속하지 않습니다.”
FAQ3: **Enterprise Vault를 검토할 수 있나요?** “기존 구성 또는 도입 요구를 기준으로 지원 버전과 기능 범위를 함께 확인합니다.”

CTA: **아카이빙 환경 상담** → `/contact?service=exchange-archive`
SEO Title: **Exchange 아카이빙 컨설팅 | 휴미즈**
Description: **메일 보존·검색·사용자 접근·운영을 함께 고려한 Exchange 아카이빙 설계와 도입·이관 검토를 지원합니다.**

---

## P07. Applied AI `/consulting/ai-transformation`

기존 URL을 유지하되 화면의 사업 명칭은 Applied AI로 바꾼다.

### Hero

Eyebrow: **APPLIED AI**
H1: **아이디어를, 실제로 쓰이는 AI로.**
본문: “어떤 AI를 도입할지보다, 누구의 어떤 문제를 해결할지에서 시작합니다. 사용자 흐름과 업무 맥락을 기반으로 서비스를 설계하고 구현합니다.”
이미지: A08.
CTA: **AI 프로젝트 상담** → `/contact?service=applied-ai`

### 적용 영역

**AI 서비스 설계·구현** — “대화형 서비스와 AI 기능을 사용자 경험에 맞게 구체화합니다.”
**업무 자동화·에이전트** — “반복 업무와 정보 흐름을 분석하고, 검증 가능한 자동화 범위를 설계합니다.”
**웹 애플리케이션·MVP** — “핵심 가설을 확인할 수 있는 사용 흐름과 구현 범위를 정합니다.”

### 구현 과정

H2: **작게 검증하고, 필요한 만큼 확장합니다.**

“문제와 성공 기준을 정리합니다. 핵심 사용자 흐름을 설계합니다. 우선순위에 맞춰 구현합니다. 사용성과 비용, 개인정보와 운영 조건을 점검합니다.”

### 직접 만드는 프로젝트

H2: **만드는 경험도, 다음 설계의 기준이 됩니다.**
“휴미즈는 가족 소통 AI 서비스 맘이음을 준비하고 있습니다. 직접 제품을 설계하며 얻는 질문과 검증 과정을 서비스 개발 역량으로 연결합니다.”
링크: **맘이음 프로젝트 보기** → `/ai-services/mom-ie`

FAQ: “범위와 일정·비용은 요구사항과 연계 환경을 확인한 뒤 제안합니다. AI가 항상 정확하게 답하거나 모든 업무를 무인으로 처리한다고 보장하지 않습니다.”

SEO Title: **Applied AI · AI 서비스 개발 | 휴미즈**
Description: **AI 서비스, 업무 자동화, 웹 애플리케이션과 MVP를 사용자 흐름에 맞게 설계하고 구현하는 휴미즈 Applied AI.**

---

## P08. AI 프로젝트 `/ai-services`

### Hero

Eyebrow: **BUILT BY HUMEASE**
H1: **우리는 직접 만들며, 가능성을 검증합니다.**
본문: “사람의 일상과 업무에 필요한 AI를 서비스로 구체화합니다. 휴미즈가 준비하고 있는 프로젝트를 소개합니다.”
이미지: A09.

### 대표 프로젝트

프로젝트: **맘이음** / 상태: **개발 중**
문구: **친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI**
본문: “부모님과 자연스럽게 대화하고 일상을 돕는 경험을 통해 가족의 연결을 지원하는 AI 서비스를 준비합니다.”
이미지: A10.
CTA: **프로젝트 자세히 보기** → `/ai-services/mom-ie`

### 구현 규칙

프로젝트가 하나라면 한 개를 크게 보여준다. 빈 3열 그리드나 가짜 Coming Soon 제품을 채우지 않는다. 이전 자료에 기재된 `/data/ai-services.json` 또는 실제 기존 목록에 추가 서비스가 있다면 소유·운영·공개 여부를 먼저 확인한다. 기존 실서비스를 무단 폐쇄하지 않되 신규 포트폴리오로 자동 재승인하지 않는다. 프로젝트 소개와 고객 구축 실적을 분리한다.

하단 문구: “함께 구체화하고 싶은 AI 아이디어가 있으신가요?”
CTA: **협업 문의** → `/contact?service=applied-ai`
SEO Title: **AI 프로젝트 | 휴미즈**
Description: **휴미즈가 직접 준비하는 AI 프로젝트를 소개합니다. 가족 소통 AI 서비스 맘이음의 방향과 개발 이야기를 만나보세요.**

---

## P09. 맘이음 `/ai-services/mom-ie`

### Hero

Eyebrow: **HUMEASE AI PROJECT**
상태: **개발 중**
H1: **맘이음**
메인 문구: **친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI**
본문: “부모님에게는 일상을 함께하는 대화 상대를, 가족에게는 더 자연스럽게 연결되는 계기를. 맘이음은 이런 일상을 위해 준비하고 있는 AI 서비스입니다.”
이미지: A10.

### 서비스가 지향하는 세 가지 역할

**친구처럼 곁에** — “부모님의 일상과 관심사를 나누고, 지난 이야기에서 자연스럽게 이어지는 대화를 지향합니다.”

**비서처럼 도움을** — “일정과 생활의 작은 부탁을 말로 쉽게 요청하고 도움받을 수 있는 경험을 준비합니다.”

**가족과 연결되도록** — “부모님의 의사를 존중하면서, 가족이 안부를 이해하고 대화를 시작할 계기를 만드는 것이 목표입니다.”

### 설계 원칙

H2: **가까워지기 위해, 지켜야 할 경계도 생각합니다.**
“부모님을 감시하거나 가족의 대화를 대신하기보다, 사람 사이의 연결을 돕는 방향으로 설계합니다. 공유 범위와 개인정보, AI가 도울 수 있는 일의 한계를 함께 고려합니다.”

### 현재 상태

H2: **지금은 개발 중입니다.**
“이 페이지는 맘이음의 서비스 방향을 소개합니다. 기능과 제공 범위는 개발 및 검증 과정에서 달라질 수 있습니다.”

실제 UI가 확보되면 캡처 날짜와 ‘개발 화면’ 표시를 붙인다. 샘플은 가상 인물·가상 데이터라고 명시한다. 생성 모델로 앱 화면·부모 리포트·그래프·이음 캐릭터를 임의 제작하지 않는다. 실제 캐릭터는 승인 자산만 사용한다.

CTA: **맘이음 협업 문의** → `/contact?service=momieum`
보조 링크: **AI 프로젝트 목록** → `/ai-services`

외부 서비스/랜딩페이지 링크는 정상 공개·브랜드·정책·접근 권한이 검증된 뒤만 추가한다. 현재 기준의 필수 CTA는 내부 문의이므로 외부 링크 확인 실패로 가짜 연결이 생기지 않는다.

SEO Title: **맘이음 — 개발 중인 가족 소통 AI | 휴미즈**
Description: **친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI. 휴미즈가 개발 중인 맘이음의 서비스 방향을 소개합니다.**

---

## P10. 엔터프라이즈 솔루션 `/solutions`

### Hero

Eyebrow: **ENTERPRISE SOLUTIONS**
H1: **제품보다 먼저, 환경에 맞는 구조를 봅니다.**
본문: “데이터 보존과 검색, 수집과 통제의 요구를 확인하고 적합한 구성을 검토합니다.”
이미지: A12.

### 기존 상담 대상 제품

**Enterprise Vault** — “아카이빙과 검색 요구에 맞는 적용 범위, 구성과 운영 조건을 검토합니다.”

**Merge1** — “수집 대상 데이터와 연결 요구를 기준으로 적용 가능성과 연계 구성을 검토합니다.”

**Data Insight** — “비정형 데이터의 현황과 관리 과제를 이해하기 위한 분석 요구를 검토합니다.”

공통 안내: “제품별 지원 범위는 버전·라이선스·데이터 소스·구성에 따라 달라질 수 있으므로 상담 과정에서 확인합니다.”

### 요구에 맞춰 함께 검토할 항목

“현재 시스템과 데이터 소스, 보존 및 검색 요구, 사용자와 운영자 흐름, 연계 조건, 도입·이관 범위.”

CTA: **솔루션 상담** → `/contact?service=enterprise-data`
관련 페이지: e-Discovery / Internal Control / Exchange Archive.

구현 규칙: 제품명은 이전 자료의 상담 대상 후보에서 이관했다. 현재 실제 지원·상담 대상인지 G0에서 재확인한다. 상세 지원 버전·커넥터 개수·인증·성능·소유회사·파트너 지위는 공식 자료 재확인 전 추가하지 않는다. 파트너 로고 띠를 기본 삭제하고, 사용권·관계가 확인된 제품 로고만 개별 표기한다. 내용은 클릭하지 않아도 읽히게 하고 큰 모달에 핵심 정보를 숨기지 않는다.

SEO Title: **엔터프라이즈 솔루션 | 휴미즈**
Description: **Enterprise Vault, Merge1, Data Insight 등 기존 데이터 환경과 요구에 맞는 솔루션 적용과 구성 검토를 지원합니다.**

---

## P11. 문의 `/contact`

### Hero 및 화면

Eyebrow: **LET'S TALK**
H1: **어떤 문제를 함께 해결할까요?**
본문: “현재 상황과 기대하는 변화를 알려주세요. 필요한 접근 방식과 다음 단계를 함께 살펴보겠습니다.”

직접 연락: **contact@humease.com** → `mailto:contact@humease.com`
이미지: A13. Desktop 설명 영역 아래에 작은 세로 비주얼로 사용하며 폼 뒤에 깔지 않는다. 모바일에서는 폼 아래로 이동하거나 장식 이미지를 숨긴다.

### 폼 라벨

회사명 / 담당자명 / 이메일 / 연락처(선택) / 관심 분야 / 문의 내용(선택).
문의 placeholder: **현재 환경과 해결하고 싶은 과제를 알려주세요.**
입력 안내: **개인정보와 영업기밀 등 민감한 내용은 적지 말아 주세요.**
제출: **문의 보내기**.

법적 동의·성공·오류 카피와 저장·알림 규칙은 06 문서의 계약을 적용한다. 실제 동의/정책/저장경로 검증 전에는 비활성 폼을 억지로 공개하지 않고 이메일 CTA를 우선 노출한다. 운영자 확인 없이 응답 시간을 약속하지 않는다.

SEO Title: **프로젝트 문의 | 휴미즈**
Description: **Enterprise Data와 Applied AI 프로젝트를 문의하세요. 현재 환경과 해결하고 싶은 과제를 알려주시면 확인 후 회신드리겠습니다.**

---

## P12. 인사이트 `/insights`

### Hero

Eyebrow: **INSIGHTS**
H1: **기술을 이해하고, 현장에 연결하는 기록.**
본문: “Enterprise Data와 Applied AI의 실무에서 마주하는 질문과 생각을 나눕니다.”

### 콘텐츠

카테고리: **Enterprise Data / Applied AI / Product Notes**.
실제 글 데이터는 제목·발행일·카테고리·외부 원문 주소·직접 작성한 짧은 소개·이미지 출처를 포함한다. 확인한 실제 글만 노출한다. 원문 날짜가 없으면 가짜 날짜를 채우지 않는다. 현재 날짜를 기사 발행일로 덮어쓰지 않는다.

A14는 데이터 글, A15는 AI 글, A16은 제품 개발 글의 콘셉트 커버로 사용한다. 이미지 내용이 글의 실제 실험 결과인 것처럼 보이면 사용하지 않는다.

초기 큐레이션 데이터가 없을 때의 완성 화면: 제목·소개 뒤에 “휴미즈 블로그에서 기술과 프로젝트에 대한 기록을 확인하실 수 있습니다.”를 표시하고 **휴미즈 블로그 보기** → `https://blog.humease.com/` CTA를 제공한다. 빈 카드나 빈 카테고리 필터는 표시하지 않는다.

외부 글은 새 탭 표시와 안전한 rel을 적용한다. 외부 블로그는 이번 개발의 배포/DB/DNS 수정 대상이 아니다.

SEO Title: **인사이트 | 휴미즈**
Description: **Enterprise Data와 Applied AI를 현장에 연결하는 휴미즈의 생각과 기록. 데이터 컴플라이언스와 AI 서비스 개발 인사이트를 만나보세요.**

---

## 13. 공통 Footer 및 비마케팅 페이지

Footer: 주식회사 휴미즈 / contact@humease.com / 사업영역 / AI 프로젝트 / 인사이트 / 회사소개 / 문의 / 실제 개인정보처리방침 / Copyright © [현재 연도] HUMEASE.

대표자·사업자등록번호·주소 등은 최신 공식 정보와 기존 승인값을 대조한 뒤 표시한다. 값이 미확인인 상태에서 가짜 값이나 `추후 입력`을 공개하지 않는다. 주소를 생성 이미지 속 건물과 연결하지 않는다.

### 개인정보처리방침 `/privacy`

큰 생성 이미지 없음. 본문 읽기 폭 760px, 명확한 H1과 시행일·버전·연락처. 실제 승인 본문만 서버에서 렌더한다. 본문이 없으면 Preview에서는 내부 점검 상태를 표시할 수 있으나 공개 페이지·sitemap·footer 링크에는 포함하지 않는다. 문의 폼 및 수집 기능의 공개 조건은 06 문서를 따른다. 폼/추적과 관련된 정책 누락을 링크 장식으로 숨기지 않는다.

### 이용약관

현행 본문 존재 여부와 실제 홈페이지 기능을 확인한 후 경로와 공개 필요성을 결정한다. 가짜 약관 작성·`#` 링크는 금지한다. 서비스 앱의 약관을 회사 홈페이지에 그대로 복사하지 않는다.

### 404

H1: **페이지를 찾을 수 없습니다.**
본문: “주소가 변경되었거나 존재하지 않는 페이지입니다.”
CTA1: **홈으로 돌아가기** → `/`
CTA2: **문의하기** → `/contact`
이미지: 기본 없음. 필요하면 A13 일부를 작은 장식으로 재사용. 실제 응답 코드는 404.

### 관리자 `/admin`

기존에 사용 중인 관리자 업무가 확인되면 신규 Next.js의 인증된 운영 영역으로 최소 기능을 구현한다. 기존 Vite 관리자 화면·코드를 복사하거나 공개 URL로 되돌려 연결하지 않는다. 조회·상태변경 등 실제 필요 범위와 인증 주체는 G0에서 확인하며, 이전 계획 또는 승인된 제외 사유 없이 릴리스하지 않는다. 06 문서의 서버 권한 검증과 데이터 비캐시 원칙을 따른다. 생성 이미지·브랜드 모션·공개 SEO는 제외한다.

## 14. 페이지별 구현 계약

공개 12개 페이지는 모두 직접 주소 접근·새로고침에서 해당 내용을 제공해야 한다. 폴더 구조는 04 문서의 명시적 App Router 페이지를 따른다. 한 개 동적 catch-all 페이지로 12개 URL을 흉내 내지 않는다.

페이지마다 H1 1개, 고유한 title/description/canonical, 활성 메뉴 또는 Breadcrumb, 명확한 하단 CTA를 갖춘다. FAQ는 본문으로 표시해 JS가 꺼져도 핵심 내용이 읽히게 한다. 열고 닫는 기능을 쓰더라도 실제 button과 aria 상태를 제공한다. 기존 검색 경로의 본문을 지우고 홈으로 돌리는 우회는 금지한다.

`/privacy`와 `/terms`는 승인된 실제 문서가 있을 때 공개한다. `/terms`의 별도 필요성이 확인되지 않으면 메뉴와 sitemap에 넣지 않고 정상 404로 처리한다. 개인정보 수집 기능을 켜면서 `/privacy`를 생략하는 것은 허용하지 않는다. 회사 홈페이지와 맘이음 앱의 정책을 서로 복사해 같은 서비스인 것처럼 표시하지 않는다.

각 페이지의 이미지는 `docs/ASSET_MAP.csv`와 실제 `src/content/assets.ts`를 기준으로 연결한다. 별도의 이미지 생성 프롬프트나 이미지 제작 라운드를 만들지 않는다.


---

<!-- SOURCE: docs/04_NEXTJS_ARCHITECTURE.md -->

# 04. Next.js 기술 아키텍처

## 1. 초기화·버전·빌드 계약

Next.js 16.x 안정 보안 패치를 사용한다. 작성일의 공식 문서는 16 계열 App Router를 기준으로 확인했다. 실제 설치일에 `create-next-app`, `next`, `react`, `react-dom`의 호환 버전·보안 공지·peer dependency를 확인하고 `G1_VERSION_LOCK.md`에 정확한 버전을 기록한다. 설치마다 `latest`가 다시 풀리게 두지 말고 lockfile을 커밋한다. React canary를 별도로 직접 설치하거나 실험 기능을 임의 활성화하지 않는다. [S01]

Node는 24.x로 정한다. `.nvmrc`, `package.json`의 engines, GitHub Actions, Vercel Node 설정을 일치시킨다. Vercel은 지원 메이저 내 세부 버전을 갱신할 수 있으므로 모든 환경의 패치 버전이 영구 동일하다고 가정하지 않는다. [S10]

새 빈 디렉터리에서 `create-next-app`의 App Router·TypeScript·Tailwind·ESLint·src 디렉터리·`@/*` 별칭 구성을 선택한다. 기존 폴더에 덮어쓰기 실행하지 않는다. npm 하나를 사용하고 yarn/pnpm/bun lockfile을 병행하지 않는다. Tailwind 4는 해당 공식 Next.js/PostCSS 설치 방식으로 구성한다. [S01][S03]

개발 빌드는 Next.js 기본 도구를 따른다. Vite·React Router·GitHub Pages용 basePath·SPA index.html fallback·별도 브라우저 프리렌더를 가져오지 않는다. `output: 'export'`는 쓰지 않는다. 서버 문의 API와 필요한 운영 기능이 있기 때문이다. Vercel Output Directory를 `dist`나 `out`으로 덮어쓰지 않는다.

## 2. 디렉터리 설계

```text
humease-web-v2/
  SPEC.md
  AGENTS.md                         # SPEC.md 우선순위와 안전 경계
  CLAUDE.md                         # AGENTS.md와 SPEC.md 진입 안내
  docs/
  src/
    app/
      layout.tsx                    # html lang=ko, fonts, 공통 metadata
      globals.css
      not-found.tsx
      error.tsx
      global-error.tsx
      robots.ts
      sitemap.ts
      (site)/
        layout.tsx                  # 공개 Header/Footer
        page.tsx
        about/page.tsx
        enterprise-data/page.tsx
        consulting/
          e-discovery/page.tsx
          internal-control/page.tsx
          exchange-archive/page.tsx
          ai-transformation/page.tsx
        ai-services/
          page.tsx
          mom-ie/page.tsx
        solutions/page.tsx
        contact/page.tsx
        insights/page.tsx
        privacy/page.tsx            # 승인 본문 없으면 공개하지 않음
        terms/page.tsx              # 실제 필요·승인된 경우에만 공개
      (operations)/
        admin/layout.tsx            # 공개 사이트와 다른 운영 UI
        admin/page.tsx              # 인증 후 실제 필요한 업무만
        admin/login/page.tsx        # 확인된 인증 방식의 새 구현
      api/
        contact/route.ts
        admin/inquiries/route.ts    # 필요 범위·권한 확인 후 구현
        health/route.ts             # 최소 상태, 비밀·DB정보 미출력
    components/
      layout/                       # Header, Footer, Breadcrumb
      brand/                        # Hero, BrandVisual, EditorialSplit
      sections/                     # Business, ProductFeature, Expertise
      ui/                           # Button, Field, InlineStatus
      interactive/                  # MobileNav, ContactForm, Reveal
    content/
      company.ts
      navigation.ts
      pages.ts
      projects.ts
      insights.ts
      assets.ts
      routes.ts
      legal/                        # 승인된 정책 본문·버전
    lib/
      seo.ts
      validation/contact.ts         # 부작용 없는 검증 함수
      server/                       # import 'server-only'
        env.ts
        contact-service.ts
        contact-store.ts
        notification.ts
        authorization.ts
        rate-limit.ts
      analytics.ts                  # 고정 이벤트, 기본 비활성
    proxy.ts                        # host/noindex 경계만; 권한검증 대체 금지
  public/
    images/brand/
    images/projects/
    images/insights/
    images/og/
    brand/                          # 승인 로고·favicon 원본의 배포본
  tests/
    unit/
    e2e/
    accessibility/
  scripts/
    verify-assets.mjs
    verify-routes.mjs
    verify-metadata.mjs
    verify-client-exposure.mjs
  .github/workflows/ci.yml
  .env.example
  .gitignore
  .nvmrc
  next.config.ts
  next-env.d.ts
  postcss.config.mjs
  eslint.config.mjs
  tsconfig.json
  package.json
  package-lock.json
```

폴더 그룹 `(site)`, `(operations)`는 URL에 노출하지 않는다. 관리자 엔드포인트는 기존 업무 필요성이 확인된 범위만 구현한다. 구조도에 이름이 있다고 실제 구축·연결이 완료된 것으로 보고하지 않는다.

## 3. 서버·클라이언트 경계

페이지·레이아웃·사업 소개·프로젝트·인사이트 본문은 기본 Server Components다. 모바일 메뉴, 문의 입력과 상태, 필요 모션만 작은 Client Components로 둔다. root layout이나 전체 페이지에 일괄 `use client`를 붙이지 않는다. 서버 비밀을 Client Component의 props로 전달하지 않는다. [S02]

정적 콘텐츠는 `src/content`의 타입이 있는 데이터에서 빌드한다. 초기 홈페이지에 CMS·실시간 DB 조회를 붙이지 않는다. 회사소개·제품 설명을 브라우저 `useEffect`로 뒤늦게 받아 빈 화면을 채우는 방식은 금지한다. 모션이 없어도 HTML의 H1·핵심 본문·연락수단이 보인다.

공개 페이지의 공통 레이아웃에서는 인증 쿠키·관리자 세션·요청 host를 읽지 않는다. 관리자와 문의 API의 요청 단위 처리가 전체 마케팅 페이지를 동적 렌더링으로 바꾸지 않도록 분리한다. 관리자 데이터·문의 응답에는 공유 캐시를 사용하지 않는다.

`next/link`로 내부 탐색하고 외부 주소는 명시적인 링크로 처리한다. 관리자·상태변경 URL을 마케팅 페이지에서 불필요하게 prefetch하지 않는다.

## 4. 콘텐츠 데이터 모델

`company.ts`: 승인된 법인명·연락처·대표자·주소·사업자정보·공개 경력과 내부 확인 기록. 내부 증빙 경로·비공개 메모는 브라우저에 전달하지 않는다.

`projects.ts`: id, nameKo, ownership, status, visibility, summary, route, externalUrl, imageId, evidenceType. 맘이음 기본은 `development`; 외부 URL은 확인된 값만 사용한다.

`insights.ts`: 실제 글 제목·발행일(확인된 경우)·category·summary·externalUrl·imageId. 원문 페이지를 렌더링할 때마다 긁어오지 않는다. 글이 없으면 03 문서의 블로그 연결 화면으로 완성한다.

`routes.ts`: 경로, 페이지 ID, title, description, navigation, sitemap 포함 여부, 실제 공개 조건. canonical과 내부 링크를 이 목록에서 교차 검증한다. route groups 이름은 경로에 포함하지 않는다.

이미지 모델은 05 문서, 문의 모델은 06 문서의 계약을 따른다.

## 5. 이미지·폰트·모션 구현

일반 이미지는 `next/image`를 사용하고 실제 width/height 또는 안정된 aspect ratio를 제공한다. `sizes`를 실제 레이아웃과 맞춘다. A01/A02는 `getImageProps`와 `<picture>`로 화면별 자산을 선택할 수 있다. 두 Image를 CSS로 숨겨 동시에 다운로드하지 않는다. 실제 네트워크에서 선택한 Hero만 로딩되는지 확인한다. [S04]

Next.js 16 문서 기준 Hero 로딩은 상황에 따라 `preload` 또는 `fetchPriority`를 사용한다. 두 장을 모두 선로딩하거나 상충하는 로딩 힌트를 겹치지 않는다. 일반 이미지에는 lazy loading을 적용한다. 품질·허용 형식·원격 도메인은 최소 설정으로 제한한다. [S04]

`next/font`로 선택 폰트를 적용한다. 폰트 공급 경로·사용권·한글 서브셋을 확인하고 불필요한 weight와 전체 폰트의 과도한 preload를 줄인다. 빌드 환경에서 내려받기가 불가능하면 합법적으로 보유한 로컬 폰트를 사용한다. 명세서 패키지는 폰트 파일을 배포하지 않는다. [S05]

Motion은 작은 Client wrapper에서만 사용한다. `reducedMotion`과 시스템 설정을 존중한다. GSAP·Lenis·Three.js·Spline·스크롤 가로채기·AI API를 브랜드 효과 때문에 추가하지 않는다. [S11]

## 6. SEO·HTTP 응답

페이지 title/description은 03 문서의 카피를 Metadata API로 구현한다. canonical 기준은 고정된 `https://www.humease.com`이며 요청의 임의 Host 값을 사용해 만들지 않는다. OG는 이미 만든 A17 또는 승인 자산에 HTML/코드로 실제 로고·제목을 합성한 정적 배포본을 사용한다. 이미지 재생성은 하지 않는다. [S06]

`app/sitemap.ts`에는 실제 공개 canonical 페이지만 포함한다. aliases·관리자·API·미승인 정책·외부 블로그·Preview 주소를 넣지 않는다. 단순 빌드 날짜를 모든 콘텐츠 수정일로 찍지 않는다. `app/robots.ts`는 07 문서의 host와 공개 상태 정책을 따른다. [S07]

고유 페이지가 없는 경로는 정상적인 404를 반환한다. `not-found.tsx`와 unknown-route HTTP 검수를 함께 수행한다. 본문에 404만 출력하고 HTTP 200을 반환하는 방식은 실패다. 오류 화면에 내부 stack trace·DB명·비밀 정보를 공개하지 않는다.

JSON-LD는 확인된 Organization·WebSite·Breadcrumb만 우선 적용한다. 가짜 평점·후기·수상·고객명·판매 중인 제품 지위를 생성하지 않는다. Next.js가 SEO 순위나 Lighthouse 점수를 자동 보장한다고 설명하지 않는다.

### 명시적 별칭 이관

아래는 이전 설계의 경로 보존 목록이다. 실제 기존 URL 조사로 누락을 추가하되 알 수 없는 모든 경로를 home으로 보내지 않는다.

| 별칭 | 최종 경로 |
|---|---|
| `/consulting/ai-consulting` | `/consulting/ai-transformation` |
| `/jtbd/ai-consulting` | `/consulting/ai-transformation` |
| `/services/ai-consulting` | `/consulting/ai-transformation` |
| `/jtbd/e-discovery` | `/consulting/e-discovery` |
| `/services/e-discovery` | `/consulting/e-discovery` |
| `/jtbd/internal-control` | `/consulting/internal-control` |
| `/services/internal-control` | `/consulting/internal-control` |
| `/jtbd/exchange-archive` | `/consulting/exchange-archive` |
| `/services/exchange-archive` | `/consulting/exchange-archive` |
| `/jtbd/ai-transformation` | `/consulting/ai-transformation` |
| `/services/ai-transformation` | `/consulting/ai-transformation` |

`next.config.ts`의 명시적 permanent redirects를 사용하고 308을 기대값으로 검수한다. 기존 301 정책이 따로 있다면 기록하고 일관되게 적용한다. 정상 HTTPS www host에서 별칭은 1회의 경로 이동으로 끝낸다. apex/HTTP 정규화에 따른 추가 이동은 별도로 측정한다. query의 서비스 선택은 허용값만 처리한다. [S13]

## 7. npm 스크립트·CI

| 스크립트 | 역할 |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` — 로컬 production build 검증 |
| `lint` | 실제 ESLint 검사, warning 정책 명시 |
| `typecheck` | Next 타입 생성이 필요한 구성을 반영한 `tsc --noEmit` |
| `test:unit` | 검증·URL·환경 gate·어댑터 결과 매핑의 단위 테스트 |
| `test:e2e` | Playwright로 실제 production build 검사 |
| `test:a11y` | 자동 접근성 검사와 결과 저장 |
| `verify:assets` | 파일 경로·dimensions·매핑·용량 |
| `verify:routes` | 상태코드·redirect·404 |
| `verify:metadata` | 페이지별 meta·canonical·OG·robots·sitemap |
| `verify:client-exposure` | 클라이언트 번들·HTML·source map의 비밀 노출 점검 |

단위 테스트는 Node test runner 또는 합의된 경량 도구로 구성하고 실제 실행 명령을 package.json에 넣는다. Vite 프로젝트를 만들기 위해 테스트 도구를 끌어오지 않는다. Playwright는 production build를 띄워 검수한다. 자동 검수에서 운영 DB·메일·analytics 요청을 차단한다.

CI 순서: 클린 checkout → Node/npm 확인 → `npm ci` → 타입 생성·typecheck → lint → unit → build → 로컬 production 서버 → e2e/접근성/경로/meta/자산 검수. 독립 job은 생성 타입 파일 의존성을 각 job에서 충족한다. Next build 성공을 ESLint 성공으로 간주하지 않는다. [S01]

CI 워크플로는 새 저장소에만 생성한다. 기존 GitHub Pages Action을 복사하거나 고치지 않는다. 자동 DNS 변경·DB migration·운영 폼 제출은 CI에 넣지 않는다.

## 8. 성능·운영 설계

처음에는 정적 콘텐츠와 정지 자산만으로 완성한다. 성능 예산은 02 문서를 따른다. 프레임워크 자체 초기 JS와 추가 모션 JS를 구분해 기록한다. Lighthouse 모바일 3회 중앙값과 실제 네트워크 워터폴을 함께 제출한다. 실사용자 p75는 실제 트래픽이 쌓인 뒤 측정하며 사전 테스트로 달성했다고 쓰지 않는다. [S15]

향후 업데이트는 콘텐츠 파일과 페이지 컴포넌트를 명확히 분리한 PR로 한다. 홈페이지 갱신을 이유로 맘이음 앱이나 별도 블로그의 배포를 실행하지 않는다. Analytics는 기본 비활성이고 실제 승인 도구·목적·정책이 준비된 경우에만 활성화한다.


---

<!-- SOURCE: docs/05_EXISTING_ASSETS.md -->

# 05. 이미 생성된 이미지의 연결 명세

## 1. 확정 범위

대표님은 이미지 생성이 이미 완료됐다고 명시했다. **이 문서는 이미지 제작 문서가 아니다.** 새 프롬프트·재생성·새 콘셉트·새 영상·새 캐릭터 제작을 시작하지 않는다.

이번 명세서에는 실제 이미지가 첨부되어 있지 않다. 개발 환경에서 대표님이 생성한 파일을 찾아 아래 ID와 연결한다. 실제 파일명이 다르더라도 그대로 사용할 수 있다. 매핑을 위해 이미지를 다시 만들거나 원본 이름을 강제로 변경하지 않는다.

허용 작업은 원본 보존, 웹용 복사, 포맷 변환·리사이즈·압축, 필요 최소 크롭, 배치·object-position 조정이다. 원본 시각 콘셉트를 바꾸는 재색상·합성·인페인팅·생성형 업스케일은 포함하지 않는다. OG의 실제 로고·문구 배치는 코드 합성으로 처리한다.

## 2. 기존 자산 ID와 연결 위치

| ID | 이전에 지정한 basename | 연결 위치 |
|---|---|---|
| A01 | home-hero-desktop | 홈 desktop Hero |
| A02 | home-hero-mobile | 홈 mobile Hero |
| A03 | data-to-intelligence | 홈 사업영역 연결 |
| A04 | enterprise-data | Enterprise Data |
| A05 | ediscovery | e-Discovery |
| A06 | internal-control | Internal Control |
| A07 | exchange-archive | Exchange Archive |
| A08 | applied-ai | Applied AI |
| A09 | ai-projects | AI 프로젝트 |
| A10 | momieum-connection | 홈·AI 프로젝트·맘이음 |
| A11 | about-craft | 회사소개 |
| A12 | enterprise-solutions | 솔루션 |
| A13 | contact-connection | 문의 보조, 404에 필요 시 소규모 재사용 |
| A14 | insight-enterprise-data | 실제 데이터 관련 글의 커버 |
| A15 | insight-applied-ai | 실제 AI 관련 글의 커버 |
| A16 | insight-product-notes | 실제 제품 개발 글의 커버 |
| A17 | og-background | 기존 공유 카드 배경 |

A14–A16은 실제 노출할 글이 있을 때만 사용한다. 준비된 이미지 17개를 모두 페이지에 강제로 채워 넣는 것이 목표가 아니다. 대표님이 일부 이미지를 통합해 생성했다면 실제 자산과 승인 용도에 맞게 ID 매핑을 기록한다.

## 3. 자산 manifest 계약

`src/content/assets.ts`의 레코드는 최소 다음 의미를 갖는다.

- `id`: A01–A17 또는 이미 승인된 실제 로고/캡처 ID.
- `src`: 존재가 확인된 배포 파일 경로. 없으면 임의 확장자를 붙여 만들지 않음.
- `width`, `height`: 실제 파일의 픽셀 크기.
- `role`: decorative / content / product-capture.
- `alt`: 장식이면 빈 문자열, 정보성이면 사실에 맞는 설명.
- `objectPosition`: 실제 구도 확인 후 desktop/mobile별 값.
- `pages`: 적용할 내부 경로 목록.
- `sourceStatus`: located / mapped / optimized / verified.

원본 절대 경로·해시·사용권·내부 확인자는 `docs/reports/ASSET_INVENTORY.md`에 별도 기록한다. 브라우저에 전달하는 manifest에 로컬 경로나 비공개 메모를 포함하지 않는다. `docs/ASSET_MAP.csv`는 초기 연결표이며 실제 파일을 검증했다는 증거가 아니다.

## 4. 원본 보존·웹 최적화

원본은 배포 디렉터리 밖의 기존 보관 위치를 유지한다. 필요한 최적화본만 `public/images`로 복사한다. 거대한 원본과 폰트 묶음을 명세서 ZIP에 넣지 않는다.

전송 예산은 desktop Hero 450KB, mobile Hero 250KB, 일반 이미지 100–220KB, OG 300KB 이하를 목표로 한다. 숫자는 프로젝트 성능 목표이며 생성 도구의 출력 보장이 아니다. 반사·유리·어두운 그라데이션이 뭉개지면 압축과 크기를 조정하고 시각 검수를 병행한다.

동일한 파일을 수차례 재압축하지 않는다. 원본에서 웹용 출력본을 만들고 변경 내역을 기록한다. 확장자는 실제 포맷과 일치해야 한다.

## 5. Next.js 적용

일반 이미지는 `next/image`로 크기를 안정화하고 실제 표시 폭에 맞는 sizes를 설정한다. 배경 장식이라도 접근성 설명을 억지로 넣지 않는다. A01/A02는 picture의 media 선택과 최적화 srcset을 조합하고 실제 모바일 네트워크에서 desktop 원본까지 받지 않는지 검증한다. [S04]

정적인 이미지 파일에 과도한 원근 왜곡이나 스크롤 변형을 적용하지 않는다. 모션은 주로 HTML 텍스트·구획·이미지 컨테이너의 작은 움직임으로 구현한다. 생성물 속 조형을 실제 회사 시스템 또는 제품 스크린샷으로 설명하지 않는다.

## 6. 실제 파일이 아직 연결되지 않은 경우

개발 전체를 멈추지 않고 단색 레이아웃으로 구현을 계속할 수 있다. 이는 개발용 대체 상태이며 최종 시각 승인 완료로 처리하지 않는다. 신규 이미지를 자동 생성하거나 다른 스톡 이미지로 채우지 않는다.

A01·A02 등 해당 릴리스에서 사용하는 주요 이미지 연결이 빠지면 시각 검수는 `BLOCKED`다. 글이 없는 A14–A16처럼 화면에서 사용하지 않기로 한 자산은 사용 계획에서 제외한 이유를 기록한다.

실제 맘이음 UI가 없으면 이미 생성된 A10을 유지한다. 가짜 UI나 부모 리포트를 만들지 않는다. 승인된 실제 화면이 있을 때만 비식별화·캡처일·개발 화면 표시를 갖춰 사용할 수 있다.


---

<!-- SOURCE: docs/06_CONTACT_SECURITY_OPERATIONS.md -->

# 06. 문의·관리자·환경·보안

## 1. 기능 이관 원칙

새 프런트엔드는 Next.js로 새로 작성한다. 기존 문의 저장소·메일·관리자 업무는 실제 계약을 조사해 필요한 동작을 이어받되 실행 코드·키·인증 우회 방법을 복사하지 않는다. 기존 v2 자료의 Supabase·FormSubmit 설명은 확인 단서이며 현재 운영이 그렇다고 단정하지 않는다.

이 문서는 문의 기능의 기본 구현까지 범위에 포함한다. 자격정보나 정책이 없다고 조용히 폼을 없애고 ‘전체 완료’로 보고하지 않는다. 연결 전에는 모의 어댑터로 개발·검수하고, 공개 조건 미충족은 `BLOCKED`로 명시한다.

## 2. 요청 경로

```text
ContactForm (Client Component)
  → POST /api/contact (Node.js Route Handler)
  → 환경·host·Origin·입력·남용 방지 검사
  → contact-service
  → 승인된 contact-store 저장
  → 승인된 notification 알림
  → 접수 결과 반환
```

브라우저가 DB나 메일 발송 서비스에 직접 접속하지 않는다. `route.ts`의 POST handler를 사용하며 HTTP method·JSON 응답·상태를 명확히 정의한다. route handler 실행과 서버 전용 모듈은 Client Component에 import하지 않는다. [S08]

홈페이지 문의 내용을 LLM에 보내지 않는다. Vercel 빌드나 페이지 렌더만으로 문의·메일·관리자 작업이 실행되면 실패다.

## 3. 입력 계약

| 필드 | UX / 검증 기준 |
|---|---|
| company_name | 회사명, 필수, trim 후 1–100자 |
| manager_name | 담당자명, 필수, trim 후 1–50자 |
| email | 필수, 형식 검증, 254자 이하 |
| phone | 선택, 30자 이하, 국제번호 등 합리적인 입력 허용 |
| interested_services | 고정 enum 배열, 1개 이상, 중복 제거 |
| message | 선택, 2,000자 이하, 제어문자·HTML 주입 방지 |
| consent | 필수 수집 동의 true, 초기 체크 금지 |
| consent_version | 실제 승인된 정책 버전과 서버에서 대조 |
| request_id | 클라이언트 생성 UUID, 형식 검증·추적용; 멱등 보장을 자동 의미하지 않음 |
| website | honeypot, 일반 사용자에게 노출·탐색되지 않게 구현 |

관심 분야 enum: `enterprise-data`, `e-discovery`, `internal-control`, `exchange-archive`, `applied-ai`, `momieum`, `other`. 페이지 query의 `service`는 이 목록에 있을 때만 사전 선택한다. 임의 query를 HTML·알림 제목에 넣지 않는다.

알 수 없는 필드는 제거하거나 400으로 거부하는 정책을 통일한다. 요청 본문 제한은 16KiB로 정하고 실제 바이트 제한을 적용한다. Content-Length만 신뢰하지 말고 수신 크기를 제한한다. 연락처와 문의 본문을 로컬스토리지·URL·analytics에 저장하지 않는다.

클라이언트 검증은 편의 기능이고 서버에서 같은 검증을 다시 수행한다. 저장소 필드명·NOT NULL·길이·동의 기록 방식은 G0에서 확인한 스키마와 어댑터로 맞춘다. 기존 스키마로 표현할 수 없으면 DB 변경 요청으로 기록하고 무단 migration하지 않는다.

## 4. HTTP·사용자 상태 계약

| 상황 | HTTP / 응답 코드 | 사용자 처리 |
|---|---|---|
| 저장 확인 성공 | 201 / RECEIVED | 접수 완료, 재제출 유도하지 않음 |
| 모의 환경 성공 | 200 / MOCK_RECEIVED | Preview 전용 ‘테스트 접수이며 실제 전송되지 않았습니다’ |
| 잘못된 입력 | 400 / VALIDATION_ERROR | 해당 필드 오류, 입력 보존 |
| Origin 거부 | 403 / FORBIDDEN_ORIGIN | 일반 오류, 내부 허용목록 노출 금지 |
| 요청 과다 | 429 / RATE_LIMITED | 제한 안내·Retry-After, 입력 보존 |
| 본문/형식 위반 | 413 또는 415 | 크기·형식 안내 |
| 기능 꺼짐·미승인 연결 | 503 / CONTACT_UNAVAILABLE | 이메일 연락 경로 제공 |
| 저장 실패가 확인됨 | 503 / STORE_FAILED | 접수되지 않았다고 안내, 입력 보존 |
| 저장 여부 불명확한 타임아웃 | 504 / SUBMISSION_UNCERTAIN | 무조건 재전송하지 않음, 중복 가능성 없는 확인 경로 안내 |
| 저장 성공·알림 실패 | 201 / RECEIVED | 성공 유지, 내부 비식별 경고만 기록 |

성공 문구: **문의가 접수되었습니다. 남겨주신 연락처로 회신드리겠습니다.**
실패 문구: **문의가 접수되지 않았습니다. 입력 내용은 유지됩니다. 다시 시도하거나 contact@humease.com으로 연락해 주세요.**
불확실 문구: **접수 여부를 확인하지 못했습니다. 중복 제출을 피하기 위해 잠시 후 확인하거나 contact@humease.com으로 연락해 주세요.**

여기서 ‘잠시 후 확인’은 시스템이 내구성 있는 상태 조회 기능을 제공할 때만 UI에 사용한다. 그 기능이 없으면 **접수 여부를 확인하지 못했습니다. 중복 제출을 피하기 위해 contact@humease.com으로 연락해 주세요.**로 고정한다. 없는 자동 확인 기능을 약속하지 않는다.

폼 상태: idle → validating → submitting → received / failed / uncertain. 제출 중 중복 클릭을 막는다. failed에서는 입력을 보존하고 실제 확인된 재시도 조건에서만 재전송한다. uncertain에서는 자동 retry하지 않는다. 미수신 실패와 저장 후 알림 실패를 혼동하지 않는다.

## 5. 중복·알림·실행 종료

기존 저장소에 내구성 있는 request_id 유일성 또는 검증된 멱등 API가 있으면 그것을 이용한다. 없다면 클라이언트 중복 클릭 차단만으로 ‘정확히 한 번 저장’을 보장하지 않는다. 네트워크 불확실 상태를 위 계약대로 처리한다.

메일 전송은 서버 응답 전에 제한된 시간 안에 결과를 await한다. 승인된 내구성 큐가 이미 있는 경우에만 큐 등록 후 처리할 수 있다. 응답 이후 끝날지 모르는 fire-and-forget fetch·임의 백그라운드 재시도·새 크론을 추가하지 않는다.

알림 실패 기록에는 request_id·비식별 에러 코드·발생 시각만 남긴다. 저장 데이터와 운영자가 연결해 처리할 수 있는지 검증한다. 자동 재시도 작업이 없는데 ‘알림은 곧 재발송됩니다’라고 안내하지 않는다.

## 6. 환경과 비밀정보

| 변수 | 기본 / 범위 | 규칙 |
|---|---|---|
| SITE_ORIGIN | https://www.humease.com | canonical용 고정 공용 값 |
| SITE_RELEASE_STATE | staging / live, 기본 staging | live도 운영 전환 승인 없이 활성화하지 않음 |
| CONTACT_MODE | disabled / mock / live / email-only | Preview는 mock 또는 disabled |
| ANALYTICS_ENABLED | 기본 false | 승인 후 실제 운영 host에서만 |
| 서버 저장소 자격정보 | 실제 확인 후 필요한 항목만 | 서버 전용, Preview에 운영 값 금지 |
| 서버 알림 자격정보 | 실제 승인 공급자 항목만 | 브라우저 공개·로그 출력 금지 |
| 관리자 인증 설정 | 확인된 공급자·역할 계약 | 공개 키와 비밀키를 분리 |

`NEXT_PUBLIC_`에는 비밀을 넣지 않는다. `.env.local`·실제 키·원본 문의 데이터는 Git에 커밋하지 않는다. `.env.example`에는 이름과 빈 값·설명만 둔다. 비밀을 `next.config`의 공개 env 치환이나 클라이언트 props에 넣지 않는다.

실제 운영 쓰기는 서버에서 **Vercel production 환경 + SITE_RELEASE_STATE=live + CONTACT_MODE=live + 요청 host가 www.humease.com + 검증된 저장·정책 준비 상태**를 모두 충족할 때만 허용한다. 사용자가 보내는 `environment=production` 등의 값은 신뢰하지 않는다.

빌드·테스트·정적 렌더·Preview에서는 운영 어댑터를 로드해도 부작용이 없어야 한다. 가장 안전하게 운영 자격정보 자체를 제공하지 않는다. 환경변수 변경이 빌드 산출물·화면에 영향을 주면 재배포하고 해당 배포를 다시 검증한다.

## 7. 남용 방지·권한·응답 보안

POST는 JSON만 받으며 실제 Origin을 고정 허용목록과 비교한다. 임의 전체 `.vercel.app` 도메인을 운영 허용목록에 넣지 않는다. 같은 Origin의 브라우저 폼만 사용하고 CORS 와일드카드를 열지 않는다. Origin 검사는 사용자 인증이나 강력한 봇 방지를 대체하지 않는다.

문의 공개 전 공유 가능한 요청 제한 또는 승인된 플랫폼 방어 규칙을 실제로 검증한다. 서버리스 인스턴스 내부 메모리 카운터만으로 전역 제한이 된다고 쓰지 않는다. 제한 기준의 초기 목표는 동일 출처/IP의 10분당 5회이며 프록시·공유망·개인정보 처리와 운영 오탐을 검토해 승인한다. 원본 IP를 명세서·로그에 무제한 저장하지 않는다.

body·메일 header injection·과도한 길이·허용 enum·honeypot을 검사한다. 외부 링크의 URL scheme을 제한하고 사용자 입력을 HTML로 직접 실행하지 않는다. 저장·관리자 API는 `Cache-Control: no-store`를 사용하고 인증 실패 응답에도 데이터 조각을 넣지 않는다.

CSP는 실제 Next.js 인라인 script와 도입한 서비스 도메인을 조사해 report-only 검증 후 적용한다. 정책 문구만 강하게 써놓고 페이지가 깨지게 만들지 않는다. `X-Content-Type-Options`, 적절한 Referrer-Policy, frame 제한을 적용한다. HSTS의 includeSubDomains·preload는 다른 하위 도메인에 영향이 있으므로 별도 승인 없이 추가하지 않는다.

## 8. 관리자 기능

기존에 실제 사용 중인 업무를 G0에서 목록화한다. 기본 후보는 문의 목록·상세·처리 상태 확인이며, 기존 스키마에 없는 상태 변경·대량 내보내기·삭제 기능은 새로 발명하지 않는다.

`/admin`은 신규 Next.js의 운영 영역으로 구현한다. 기존과 동일한 인증 주체를 사용할 수 있는지 확인하되 새 도메인·redirect URI·쿠키·세션 갱신을 검증한다. 기존 인증 설정 변경이 필요하면 영향과 승인 대상을 분리한다.

서버 layout의 진입 검사뿐 아니라 각 관리자 API·데이터 접근 함수에서도 인증과 역할 권한을 검증한다. public UI에서 링크를 숨기거나 proxy에서만 확인하는 것은 충분하지 않다. 타 사용자 또는 무권한 토큰, 만료 세션, 직접 API 요청을 거부해야 한다.

서비스 역할 키로 모든 요청을 대신 수행하면서 권한 확인을 생략하지 않는다. DB/RLS를 약하게 바꿔 UI를 작동시키지 않는다. 문의 개인정보를 정적 HTML·sitemap·OG·캐시·빌드 로그에 남기지 않는다. 관리자 경로는 noindex이며 공개 포트폴리오 모션·이미지를 사용하지 않는다.

기존 관리자 업무를 제외하려면 대표님의 명시적 제외 승인과 대체 운영 절차가 필요하다. ‘새 프로젝트라서 없어짐’은 허용하지 않는다.

## 9. 개인정보·분석·장애 시 공개 방식

문의 수집 목적·항목·보유기간·동의와 정책 버전은 실제 승인 문서에서 가져온다. 법률 확정 문서를 이 개발명세서에서 임의로 만들어 넣지 않는다. 회사 홈페이지 정책과 맘이음 서비스 정책은 별개다.

정책·저장 경로·안전장치가 준비되지 않은 동안에는 mock 개발을 진행한다. 공개를 이메일 CTA만으로 제한해야 한다면 `CONTACT_MODE=email-only`로 명시하고 대표님이 기능 축소를 승인한 릴리스 예외로 기록한다. 이 예외 없이 폼 이관 완료라고 보고하지 않는다.

Analytics의 허용 이벤트는 CTA·고정 page path·서비스 enum·비식별 오류 코드뿐이다. 이메일·전화·문의 본문·DOM 전체 텍스트·민감 query·세션 리플레이를 수집하지 않는다. Preview·자동 테스트·관리자에서는 비활성화한다. 도구를 새로 결제·가입하거나 기존 로그 DB를 변경하지 않는다.


---

<!-- SOURCE: docs/07_VERCEL_RELEASE_AND_ROLLBACK.md -->

# 07. 신규 Vercel 배포·운영 전환·롤백

## 1. 시스템과 브랜치

```text
기존 저장소 / 기존 main / 기존 GitHub Pages
  → 현재 www.humease.com 유지
  → 신규 구축 기간 READ-ONLY

신규 저장소 humease-web-v2
  main                       # 신규 프로젝트의 승인된 배포 기준
  feature/foundation         # 신규 기초 구조
  feature/site-pages         # 신규 디자인·본문·기존 이미지 연결
  feature/contact-operations # 문의·운영 기능
  fix/...                    # 신규 사이트 수정
  → 신규 Vercel 프로젝트 humease-web-v2
      PR / feature → Preview
      승인된 main → 신규 프로젝트 내부 Production
      별도 운영 전환 승인 후 → www.humease.com
```

‘main merge’라는 말은 어느 저장소인지 반드시 식별한다. 새 저장소의 승인된 main merge는 허용된 개발 절차지만, 기존 운영 저장소의 main은 수정하지 않는다. feature 브랜치 이름은 실제 작업 범위에 맞게 정리하되 구 저장소에서 만들지 않는다.

Vercel Git 연동은 새 저장소만 연결한다. 새 프로젝트 초기 import가 Production 환경을 만들더라도 실제 회사 도메인이 연결됐다고 간주하지 않는다. 초기에는 공개 플래그와 운영 쓰기를 꺼두고 보호 설정을 검증한다. [S09][S16]

## 2. Vercel 설정 계약

| 설정 | 값 |
|---|---|
| 프로젝트 | 새 `humease-web-v2`, 기존 프로젝트 재사용 금지 |
| Framework Preset | Next.js |
| Root Directory | 새 저장소 루트, 실제 package.json 위치 확인 |
| Install | npm ci |
| Build | npm run build |
| Output Directory | Next.js 자동 설정 유지, dist/out 수동 지정 금지 |
| Node | 24.x |
| Production Branch | 새 저장소 main |
| 공개 도메인 | 전환 승인 전 미연결 |
| 초기 환경 | staging, 문의 mock/disabled, analytics off |
| Preview 보호 | 팀에 제공되는 Deployment Protection 확인·활성화 |

회사 홈페이지이므로 상업용 사용에 맞는 Vercel 플랜·팀 권한·결제 승인을 확인한다. 공식 Hobby 정책은 비상업적 개인 용도를 대상으로 하므로 휴미즈 기업 운영을 무료 Hobby에 당연히 올릴 수 있다고 전제하지 않는다. Pro 이상 등 적합한 계약을 확인하되 이 설계서가 결제 승인을 대신하지 않는다. [S17]

Vercel의 보호 범위는 요금제·설정에 따라 달라진다. 기본 production domain까지 항상 보호된다고 가정하지 말고 비인증 브라우저에서 URL별 접근을 확인한다. noindex는 접근 통제가 아니다. [S16]

## 3. 단계별 절차

### G0 — 경계와 현황 확인

구·신 저장소·폴더·도메인·데이터 흐름을 기록한다. 이미지 실제 위치·회사정보·법적 문서·기존 URL·관리자 업무를 확인한다. 기존 실행 코드를 이 단계에서 변경하지 않는다.

### G1 — Next.js 기반선

새 프로젝트를 초기화하고 버전을 고정한다. Next.js 로컬 production build, 최소 공개 페이지, 기본 404, disabled/mock API, 환경 분리가 동작해야 한다. 새 Vercel의 보호된 URL에 배포한다. **기존 화면의 Vercel 복제 단계는 없다.**

### G2 — 브랜드·핵심 화면

이미 생성된 A01/A02를 연결해 desktop/mobile Hero를 완성한다. 이어서 Business와 맘이음, 실제 typography·메뉴·Footer를 검증한다. 과도한 모션 없이 정지 화면의 품질을 먼저 평가한다. 이미지가 미연결이면 대체 단색 상태로 작업하되 시각 PASS로 처리하지 않는다.

### G3 — 전체 페이지·기능

12개 공개 페이지, URL 별칭, 정책 공개 조건, 문의 상태, 필요한 관리자 업무를 구현한다. 운영과 분리된 어댑터·테스트 데이터로 검증한다. 운영 DB·메일로 자동 E2E를 돌리지 않는다.

### G4 — 릴리스 후보 검증

08 문서의 모든 필수 검수를 수행하고 Antigravity가 독립 검수한다. 심각도·미실행 항목·예외·증거를 정리한다. 배포할 정확한 commit SHA와 deployment ID를 기록한다. 신규 main 반영은 PR 검수·승인 절차를 거친다.

대표님에게 전환 승인 대상으로 다음을 함께 제출한다: 새 화면, 기존 기능 대응표, 테스트 결과, 실제 DNS 변경표, 환경값 변경명(비밀값 제외), 인증서/도메인 조건, 롤백 위치, 남은 위험·승인 예외.

### G5 — 승인 후 live 빌드와 도메인 전환

명시적 승인 후 새 프로젝트의 production 환경을 준비한다. 공개 상태와 운영 어댑터를 포함하는 새 배포가 필요하면 **최종 live 설정으로 다시 build하고 그 deployment를 검수**한다. staging 산출물을 단순 promote하면서 빌드 시 고정된 metadata·기능 플래그까지 변경됐다고 가정하지 않는다.

도메인 연결 전 live 설정의 후보 URL은 비정규 host noindex 및 문의 host gate로 보호한다. 운영 메일·DB의 실제 쓰기 smoke는 승인된 전환 테스트 계획에서만 수행한다.

도메인·DNS를 승인된 표대로 변경한다. 외부 DNS 캐시가 혼재할 수 있으므로 완벽한 무중단을 보장한다고 표현하지 않는다. www/apex/HTTPS/기존 URL/문의/관리자/블로그/메일 영향 점검을 즉시 실시한다.

### G6 — 운영 확인·복구 가능성 유지

실제 사용자 경로와 서버 오류·폼 접수·관리자 확인을 기록한다. 운영 문의 smoke는 별도 승인된 테스트 표식·수신자·정리 정책을 사용하고 실제 고객 데이터를 테스트하지 않는다. 기존 사이트를 최소 7일의 관찰 기준 동안 복구 가능하게 보존한다. 이 기간은 운영자 점검 계획이며 자동 모니터링이 구축됐다는 뜻이 아니다.

기존 Pages 비활성화·저장소 보관 방식 변경은 안정화 후 별도 승인 작업이다. 이 설계서의 작성이나 구현 완료만으로 실행하지 않는다.

## 4. 도메인·검색 노출 matrix

| 환경 / 요청 host | 검색 | 운영 문의·분석 |
|---|---|---|
| Development / localhost | noindex | mock 또는 disabled |
| Preview URL | noindex + 제공 가능한 인증 보호 | 운영 쓰기 금지 |
| 신규 Production, staging 상태 | noindex | 운영 쓰기 금지 |
| 신규 Production, live 상태, *.vercel.app | X-Robots-Tag noindex + 가능한 보호 | host gate로 운영 쓰기 금지 |
| live 상태, www.humease.com | 승인된 공개 페이지 index | 승인된 live 기능만 |
| live 상태, humease.com | www로 영구 redirect | 이 host에서 직접 처리하지 않음 |
| /admin, /api, 인증 페이지 | 항상 noindex | 인증/기능 계약에 따름 |

공통 metadata는 승인 전 noindex다. 승인된 live 빌드의 공개 metadata는 index로 전환한다. 그러나 **비정규 host에서는 서버 응답 X-Robots-Tag를 강제**해 `.vercel.app` 복제 URL이 index 허용을 상속하지 않게 한다. Next.js `proxy.ts` 등 가벼운 응답 경계로 구현하되 관리자 권한 검증을 대체하지 않는다. [S18]

`robots.ts`는 요청 host·공개 상태를 반영한다. host별 응답이 캐시에 섞이지 않도록 동적·캐시 정책을 명시하고 양쪽 실제 응답을 검수한다. 공개 페이지의 layout 전체를 host 확인 때문에 동적으로 만들지 않는다. noindex 헤더·robots·사이트맵·canonical은 서로 다른 역할이며 robots 차단만으로 비밀이나 색인 제거를 보장하지 않는다.

## 5. DNS 변경표와 보호 대상

실제 Vercel 프로젝트가 제시하는 A/CNAME/TXT 값을 사용한다. 예전 공통 IP·CNAME 값을 문서에 고정하지 않는다. 변경표에는 record name, type, 기존 값, 신규 값, TTL, 목적, 승인자, 변경시각, 복원값을 포함한다. [S12]

www와 apex 외의 레코드는 기본 수정 대상이 아니다. MX·SPF·DKIM·DMARC·메일 관련 호스트·Google/Microsoft 검증·blog/build 등 하위 도메인과 다른 서비스의 TXT를 보존한다. apex에 여러 TXT와 MX가 있다고 A만 변경하면서 함께 삭제하지 않는다.

네임서버 전체 이전·와일드카드 변경·DNSSEC·CAA·HSTS preload 변경은 기본 범위에 포함하지 않는다. 인증서 때문에 추가 변경이 필요한 경우 원인·영향·복원 방법을 확인하고 별도 승인한다. 다른 Vercel 프로젝트에 연결된 도메인을 무단으로 떼어내지 않는다.

대표 주소는 www, apex는 www로 영구 이동한다. HTTPS 양쪽 인증서와 path/query 보존, redirect loop 여부를 확인한다. 운영 리다이렉트 규칙이 이메일·블로그·정적 인증파일 요청을 잘못 가로채지 않는지 검수한다.

## 6. 롤백 설계

**코드 롤백:** 직전 정상 Vercel deployment의 SHA·ID·설정 조합을 저장한다. 코드 롤백이 프로젝트 환경변수·도메인·외부 DB 설정을 자동 복원한다고 가정하지 않는다.

**전환 롤백:** 기존 DNS 값과 Pages 설정, 정상 운영 커밋을 기준으로 복귀한다. DNS TTL과 캐시 때문에 즉시 전 세계 동일 복귀는 보장되지 않는다. 롤백도 www/apex/HTTPS/문의/관리자/메일/noindex를 다시 검사한다.

**문의 장애:** 신규 폼만 임시 차단하고 명시된 이메일 연락 경로를 제공할 수 있다. 영구 기능 축소가 아니라 장애 대응이며 운영자에게 상태를 보고한다. DB에 이미 저장된 문의를 프런트 롤백으로 지울 수 있다고 가정하지 않는다.

롤백 발동 후보는 주요 페이지 연속 5xx, 문의 저장 실패, 관리자 권한 노출, 인증서 오류, 핵심 URL 광범위 404다. 구체적 임계치와 판단 담당자는 전환 승인 보고서에 확정한다. 긴급 사고 대응 권한은 별도 운영 정책을 따른다.


---

<!-- SOURCE: docs/08_QA_AND_HANDOFF.md -->

# 08. 검수·게이트·작업자 인수인계

## 1. 결과 판정

`PASS`: 명시된 환경·버전·절차로 실행하고 증거가 있음. `FAIL`: 실행 결과가 기준 불충족. `BLOCKED`: 권한·자료·자산·승인 등으로 실행 불가. `NOT RUN`: 아직 실행하지 않음.

운영 전환의 필수 테스트에는 FAIL/BLOCKED/NOT RUN이 없어야 한다. 보안·개인정보·핵심 문의 접수·도메인/인증서 문제는 승인 예외로 덮지 않는다. 기능 축소 등 다른 예외는 영향·기간·담당자·대표님 승인 기록이 있어야 한다.

심각도는 CRITICAL/HIGH/MEDIUM/LOW로 구분한다. CRITICAL/HIGH는 0건이어야 하며 MEDIUM은 수정 또는 명시적 승인 예외가 필요하다. 문서 검사 PASS를 실제 사이트 검사 PASS로 합산하지 않는다.

## 2. 필수 테스트 목록

| ID | 검수 | 통과 기준 |
|---|---|---|
| B01 | 작업 경계 | 새 저장소 remote와 경로 확인, 기존 저장소 변경 0 |
| B02 | 스택 | Next.js App Router, Vite/React Router/SPA 프리렌더 미사용 |
| B03 | 클린 재현 | lockfile 기반 npm ci, typecheck, lint, unit, build 성공 |
| B04 | 초기 부작용 | build·Preview·자동 QA의 운영 DB/메일/로그 쓰기 0 |
| U01 | 홈 구성 | 6개 영역, Data/AI 메시지 중복 장면 없음 |
| U02 | 첫 화면 | H1·사업 설명·CTA가 JS/모션 전에도 읽힘 |
| U03 | 반응형 | 320·390·768·1280·1440px에서 의미 있는 잘림·가로 넘침 없음 |
| U04 | 메뉴 | 실제 button·keyboard·Escape·focus 복귀·모바일 스크롤 정상 |
| U05 | 브랜드 일관성 | 타이포·재질·여백·상태·푸터가 페이지 전반 일치 |
| I01 | 기존 이미지 연결 | 사용한 자산의 실제 파일과 A-ID 매핑 확인 |
| I02 | 원본·생성 제외 | 원본 보존, 신규 이미지 생성·프롬프트 작업 0 |
| I03 | Hero 로딩 | 모바일에서 불필요한 desktop Hero 중복 요청 없음 |
| I04 | 이미지 안정성 | 실제 dimensions·sizes·alt, 심한 깨짐·레이아웃 이동 없음 |
| C01 | 공개 카피 | 03 문서와 일치, 미승인 회사정보·더미·과장 지표 없음 |
| C02 | 맘이음 | 개발 중 표기·한글 서비스명·가짜 UI 및 성과 없음 |
| C03 | 인사이트 | 실제 글/날짜/외부 URL, 없는 글의 카드·필터 없음 |
| R01 | 공개 라우트 | 공개 대상 12개 URL 직접 접근·새로고침 정상 |
| R02 | 별칭 | 명시된 이전 경로가 최종 경로로 이동, :id 문자열 잔류 없음 |
| R03 | 진짜 404 | 임의 없는 경로가 HTTP 404와 안내 화면 제공 |
| R04 | 링크 | 빈 # CTA·깨진 내부 링크·unsafe scheme 없음 |
| S01 | HTML/메타 | 페이지별 H1·본문·title·description·canonical·OG 정상 |
| S02 | sitemap | 공개 canonical만, 관리자·별칭·Preview·미승인 정책 제외 |
| S03 | 검색 환경 | staging/Preview/vercel.app noindex, live www만 공개 정책 |
| S04 | 기존 검색 자산 | 인증파일·favicon·중요 URL 처리 계획/결과 확인 |
| F01 | 입력 검증 | 필수/길이/enum/동의/크기/형식의 클라이언트·서버 검사 |
| F02 | 문의 접수 | 비운영 어댑터 저장 성공·실패·오류 응답 각각 검증 |
| F03 | 중복·타임아웃 | 중복 클릭 차단, uncertain에서 자동 재전송 없음 |
| F04 | 알림 실패 | 저장 성공은 성공 유지, 무단 background retry 없음 |
| F05 | 환경 차단 | Preview에 운영 키 없음, live host gate 우회 불가 |
| F06 | 남용 방지 | Origin·rate limit·body limit·honeypot이 서버 경계에서 동작 |
| O01 | 관리자 | 미인증·무권한·만료 세션·직접 API 거부 |
| O02 | 관리자 데이터 | 필요한 업무는 보존, 정적 HTML/OG/캐시/로그 노출 없음 |
| P01 | 비밀 노출 | 브라우저 JS·HTML·응답·source map에 서버 비밀 0 |
| P02 | 개인정보 | 승인 정책·실제 수집·동의 기록·분석 범위 일치 |
| A01 | 대비·키보드 | 문서 기준 대비·가시 focus·접근 순서·skip link 정상 |
| A02 | 확대·감소모션 | 200% 확대·400% reflow·reduced-motion 정상 |
| A03 | 폼 접근성 | label·필드 오류·aria-live·제출 상태·focus 안내 정상 |
| V01 | 성능 | 고정 조건 모바일 3회 중앙값·용량 예산·원인 기록 |
| V02 | 브라우저 | 실제 버전·기기별 결과, 실행하지 않은 기기 PASS 금지 |
| D01 | 후보 식별 | 승인 SHA/deployment ID/환경과 실제 전환 대상 일치 |
| D02 | DNS/HTTPS | www/apex/path/query/인증서/redirect loop 검증 |
| D03 | 주변 영향 | 메일·블로그·다른 서비스·검증 레코드 변경/장애 없음 |
| D04 | 운영 smoke | 승인된 최소 테스트로 접수·알림·관리자 확인 |
| D05 | 롤백 | 이전 배포·DNS·설정 복원 정보와 실행 책임이 확보됨 |

## 3. 실행 환경·증거

브라우저 자동화는 production build를 대상으로 수행한다. Chrome/Edge 중심 desktop과 Playwright의 Chromium/WebKit 검사 결과를 구분한다. Playwright WebKit 결과를 실제 iPhone Safari 결과라고 표기하지 않는다.

실기기 확인 대상은 iPhone Safari, Android Chrome, Samsung Internet이다. 미보유·미실행은 NOT RUN 또는 BLOCKED로 적는다. 실제 Safari 지원 범위는 선택한 Next.js 버전의 공식 기준과 대상 사용자 기기를 대조한다. [S01]

시각 증거는 1440/390px 주요 화면과 320px 문제 구간, 기능 증거는 네트워크 상태·리다이렉트·서버 결과·마스킹된 에러 코드다. 문의 원문·토큰·이메일 주소 같은 실사용 개인정보를 스크린샷과 로그에 포함하지 않는다.

Lighthouse 목표: Performance 90, Accessibility 95, Best Practices 95, SEO 95 이상. 도구·버전·viewport·throttling·캐시 조건을 고정한 모바일 3회 중앙값을 제출한다. 운영 p75 LCP≤2.5s, INP≤200ms, CLS≤0.1은 별도 실사용자 목표다. 트래픽이 없으면 미측정으로 적는다. [S15]

## 4. 단계별 승인 조건

G0: 현황·미확인·자산 위치·운영 영향 경계가 문서화됨.
G1: 신규 Next.js 빌드·Preview·모의 문의·환경 차단이 실행 증거로 확인됨.
G2: Hero·Business·맘이음의 desktop/mobile 시각 검수 통과.
G3: 전체 페이지와 문의·필요 관리자 계약 구현 완료.
G4: 전환 전 필수 QA와 독립 점검 통과, 공개 내용·회사정보 확인.
G5: 대표님 전환 승인, live 배포 재검증, 실제 DNS/인증서 전환 실행·증거.
G6: 승인된 실제 운영 smoke·주변 영향·복구 가능성 확인.

G0 자료 미확인은 필요한 부분의 공개를 막을 뿐 신규 레이아웃 전체를 중단할 이유가 아니다. G1–G3는 비운영 데이터와 이미 제공된 자산으로 진행할 수 있다. 운영 게이트를 앞당겨 PASS 처리하지 않는다.

## 5. 변경 관리·작업 분해

작업 단위는 foundation → design system → home → enterprise pages → AI/about/insights → contact/operations → SEO/security → QA/release로 나눈다. 하나의 커밋에 신규 폴더 생성·전 페이지 디자인·DB 변경·DNS 전환을 묶지 않는다.

DB/RLS/역할·권한/비밀키/도메인/법적 내용/서비스 소유·상태/계획 외 비용이 바뀌면 해당 작업을 승인 대기로 분리한다. 관계없는 기존 서비스 저장소는 수정하지 않는다. 모든 변경 커밋은 새 저장소에서만 만든다.

새 코드가 기존 코드와 다른 것은 정상이다. 회귀 기준은 실행 코드를 그대로 남기는 것이 아니라 URL·연락 흐름·관리자 업무·공개 정보·검색 자산의 합의된 연속성이다.

## 6. 완료 보고 형식

보고서에는 신규 저장소·브랜치·SHA, Preview URL·deployment ID, 실제 버전, 구현 페이지/기능, 연결 이미지 목록, 각 QA 상태·증거, 잔여 이슈·심각도, 승인 필요 항목, 기존 자원 변경 유무, 다음 허용 단계, 롤백 대상을 적는다.

제목에서 **개발 완료 / Preview 검증 완료 / 운영 전환 승인 요청 / 운영 전환 완료**를 구분한다. 문의 모의 저장과 실제 저장을 혼동하지 않는다. 실기기 테스트·DNS 확인을 하지 않았으면 보고서에 명시한다.

## 7. Claude Code 전달 지침

아래 지침은 새 프로젝트에서 실행한다. 기존 프로젝트의 설정 파일을 수정해 적용하지 않는다.

```text
HUMEASE v3.0의 SPEC.md와 docs를 유일한 구현 기준으로 사용하고 구버전 Vite 유지 지침은 폐기하라; 기존 홈페이지 저장소·폴더·Pages·DB·DNS는 READ-ONLY로 보존한 채 별도 신규 저장소와 폴더 humease-web-v2에 Next.js 16 안정 패치+App Router+TypeScript strict+Tailwind CSS 4+Node.js 24+npm을 구성하라; 기존 Vite 코드를 이관하거나 기존 사이트를 Vercel에 먼저 복제하지 말고 신규 Next.js 사이트 자체를 새 Vercel 프로젝트에서 검증하라; 12개 공개 페이지의 최종 카피·경로·CTA를 구현하고 이미 생성된 A01–A17 이미지 중 실제 사용 자산을 찾아 연결·최적화하되 신규 생성·재생성·프롬프트 작성은 하지 마라; Server Components 중심 구조와 필요한 Client Components, Metadata API, next/image, next/font, 서버 문의 Route Handler 및 검증된 최소 관리자 기능을 구현하고 운영 연결 전에는 mock/disabled 모드로 테스트하라; 기존 URL·회사정보·정책·관리자 업무·검색 인증을 확인 없이 누락시키지 말고 Preview의 운영 DB·메일·분석 쓰기를 차단하라; 먼저 G0 경계·현황·미확인 목록을 보고한 뒤 가능한 신규 구현을 진행하며 대표님의 명시적 승인 전에는 운영 도메인 연결·DNS 변경·운영 쓰기·기존 저장소 변경·DB/RLS 변경·비용 발생 작업을 실행하지 마라; QA는 PASS/FAIL/BLOCKED/NOT RUN과 증거로 보고하라.
```

## 8. Antigravity 전달 지침

```text
HUMEASE v3.0의 SPEC.md와 docs/08_QA_AND_HANDOFF.md를 기준으로 신규 Next.js 후보를 독립 점검한다.
기존·신규 소스, 설정, Git 이력, DB, RLS, 배포, DNS를 변경하지 않는다. 보고서는 응답 또는 허용된 별도 검수 위치에만 남긴다.
신규 저장소와 Next.js App Router 사용, 기존 프로젝트 변경 없음, 구버전 Vite 실행 지침 잔류 여부를 확인한다.
이미 생성된 이미지의 실제 연결·모바일 구도·중복 다운로드·원본 보존을 확인하며 이미지를 생성하거나 수정하지 않는다.
12개 공개 페이지의 카피·경로·CTA·metadata, 맘이음 개발 중 표기, 실제 404, 접근성·성능을 검수한다.
문의 상태·관리자 서버 권한·비밀 노출·환경 분리·noindex·도메인 전환 조건을 확인한다. 운영 문의 실전송·메일·로그 생성은 수행하지 않는다.
실행한 항목만 PASS/FAIL로 판정하고 나머지는 BLOCKED/NOT RUN, 재현 절차와 증거 및 심각도를 보고한다.
```


---

<!-- SOURCE: docs/09_SOURCES_AND_CHANGELOG.md -->

# 09. 공식 출처·확인 범위·변경 이력

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

### [S08] Next.js Route Handlers
- 원문: https://nextjs.org/docs/app/api-reference/file-conventions/route
- 사용 범위: route.ts·HTTP method·Request/Response

### [S09] Vercel GitHub Deployments
- 원문: https://vercel.com/docs/git/vercel-for-github
- 사용 범위: 신규 저장소 연결·브랜치 배포

### [S10] Vercel Supported Node.js Versions
- 원문: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- 사용 범위: Node.js 24.x 지원·메이저 설정·패치 운영

### [S11] Motion for React — Accessibility
- 원문: https://motion.dev/docs/react-accessibility
- 사용 범위: 감소된 움직임 지원

### [S12] Vercel Add a Domain
- 원문: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- 사용 범위: 프로젝트별 도메인·DNS 설정

### [S13] Next.js redirects
- 원문: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
- 사용 범위: 명시적 redirect·영구 308

### [S14] WCAG 2.2
- 원문: https://www.w3.org/TR/WCAG22/
- 사용 범위: 대비·키보드·확대·움직임·상태 안내 기준

### [S15] web.dev Web Vitals
- 원문: https://web.dev/articles/vitals
- 사용 범위: LCP·INP·CLS와 현장 측정 기준

### [S16] Vercel Deployment Protection
- 원문: https://vercel.com/docs/deployment-protection
- 사용 범위: 배포 URL 보호와 범위·요금제 확인

### [S17] Vercel Hobby Plan
- 원문: https://vercel.com/docs/plans/hobby
- 사용 범위: 비상업적 개인 용도 정책·기업 운영 플랜 확인

### [S18] Next.js proxy.js
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


---

# 부록. 기존 이미지 연결표

실제 생성 자산의 경로·픽셀 크기는 개발 환경에서 확인 후 채웁니다. 빈 값은 신규 이미지 생성 요청이 아닙니다.

| ID | 참조 basename | 적용 페이지 | 용도 |
|---|---|---|---|
| A01 | home-hero-desktop | `/` | desktop Hero |
| A02 | home-hero-mobile | `/` | mobile Hero |
| A03 | data-to-intelligence | `/` | Business 연결 |
| A04 | enterprise-data | `/enterprise-data` | Hero |
| A05 | ediscovery | `/consulting/e-discovery` | Hero |
| A06 | internal-control | `/consulting/internal-control` | Hero |
| A07 | exchange-archive | `/consulting/exchange-archive` | Hero |
| A08 | applied-ai | `/consulting/ai-transformation` | Hero |
| A09 | ai-projects | `/ai-services` | Hero |
| A10 | momieum-connection | `/;/ai-services;/ai-services/mom-ie` | 맘이음 소개 |
| A11 | about-craft | `/about` | Hero |
| A12 | enterprise-solutions | `/solutions` | Hero |
| A13 | contact-connection | `/contact` | 문의 보조 |
| A14 | insight-enterprise-data | `/;/insights` | 실제 글이 있을 때 |
| A15 | insight-applied-ai | `/;/insights` | 실제 글이 있을 때 |
| A16 | insight-product-notes | `/;/insights` | 실제 글이 있을 때 |
| A17 | og-background | `공개 페이지` | 기존 OG 배경 |
