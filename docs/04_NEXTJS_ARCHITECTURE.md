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
