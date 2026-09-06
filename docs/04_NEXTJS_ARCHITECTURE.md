# 04. Next.js 기술 아키텍처

- 개정: 2026-09-06 (v2) — **현행 구현 기준으로 전면 개정**
- 개정 사유: 이 문서의 v1 은 Vercel 서버 런타임을 전제로 작성됐다. 이후 대표 지시로
  호스팅이 GitHub Pages 로 확정되면서(`docs/reports/ADR-001_HOSTING_GITHUB_PAGES.md`)
  서버 기능 전제가 전부 무효가 됐다. v1 의 `output: 'export'` 금지 조항,
  `api/` Route Handler 설계, `(operations)/admin` 구조, `proxy.ts`,
  `next.config.ts` redirects 는 **모두 폐기**한다.
- 이 문서는 **실제 코드에서 확인한 사실**만 적는다. 계획은 `계획` 또는 `미구현`으로 표시한다.

## 1. 확정 스택 — 실측값

`package-lock.json` 기준 실제 설치 버전이다. 버전 문자열을 조사 없이 만들어 넣지 않는다.

| 영역 | 기준 | 실측 |
|---|---|---|
| 프레임워크 | Next.js 16.x App Router | **16.3.4** |
| React | react / react-dom 동일 버전 고정 | **19.2.8** |
| 언어 | TypeScript strict | **5.9.3**, `strict: true` |
| 스타일 | Tailwind CSS 4.x | **4.3.3** |
| 런타임 | Node.js 24.x | `engines: >=24 <25`, `.nvmrc` `24` |
| 패키지 | npm, lockfile 커밋, CI `npm ci` | 적용 |
| 호스팅 | GitHub Pages (Actions 배포) | 적용 |

`pages/` 디렉터리는 없다. App Router 단일 구조다.

## 2. 빌드 계약 — 정적 Export

```ts
// next.config.ts
output: 'export',
basePath,                       // NEXT_PUBLIC_BASE_PATH
assetPrefix: basePath || undefined,
trailingSlash: true,
images: { unoptimized: true },
```

**정적 Export 에서 쓸 수 없는 것.** 도입하지 않는다.

- Route Handler(`route.ts`)의 런타임 동작, Server Actions, Middleware
- ISR·on-demand revalidate, `cookies()`·`headers()` 기반 동적 렌더링
- `generateStaticParams()` 없는 동적 라우트
- `next.config.ts` 의 `redirects()`·`rewrites()` — 서버가 없으므로 동작하지 않는다
- 서버 의존 이미지 최적화

**계속 쓰는 것.** App Router, 빌드 시점에 실행되는 Server Components, Metadata API,
`sitemap.ts`, `robots.ts`, `generateStaticParams()` 를 갖춘 동적 세그먼트.

현재 저장소 실측: Route Handler **0개**, Server Actions **0개**, middleware/proxy **0개**.

### basePath

논리 경로는 `/solutions/...`, `/ai-services/...` 로 관리하고 basePath 는 환경변수로 주입한다.
GitHub 프로젝트 사이트는 `/humease-web-v2` 하위, 커스텀 도메인 연결 후에는 빈 값이다.
**하드코딩하면 도메인 전환 순간 모든 경로가 깨진다.** 전환은 문자열 치환이 아니라 재빌드로 한다.

⚠ `assetPrefix` 는 `_next/*` 빌드 산출물에만 적용된다. `public/` 파일을 `/images/x.webp` 로
직접 참조하면 Next 가 경로를 다시 쓰지 않아 404 가 된다. `unoptimized` next/image 와
raw `<img>` 모두 해당한다. **`src/lib/asset-path.ts` 의 `asset()` 을 반드시 거친다.**

⚠ `next/link` 는 basePath 를 붙이지만 **순수 `<a href="/...">` 는 붙이지 않는다.**
내부 링크는 `src/components/ui/Link.tsx` 의 `A` 컴포넌트를 쓴다. 이 컴포넌트가
내부·외부·앵커·`mailto:` 를 분기한다. 두 결함 모두 실제로 발생해 전 페이지가 깨졌던 이력이 있다.

## 3. 디렉터리 — 실제 구조

```text
humease-web-v2/
  SPEC.md · AGENTS.md 없음(미작성) · CLAUDE.md 없음(미작성)
  docs/
    01_SCOPE_AND_BASELINE.md … 09_SOURCES_AND_CHANGELOG.md
    ASSET_MAP.csv
    reports/            G0_BASELINE · G1_QA_RESULTS · G2_REDESIGN_QA · QA_REQUEST
                        ASSET_INVENTORY · ADR-001 · evidence/
  src/
    app/
      layout.tsx        html lang=ko, next/font, 공통 metadata, 네이버 인증
      globals.css       디자인 토큰·장면·모션
      not-found.tsx     실제 404
      robots.ts · sitemap.ts   force-static
      (site)/
        layout.tsx      skip link + Header/Footer
        page.tsx        홈
        about · enterprise-data · contact · insights /page.tsx
        consulting/{e-discovery,internal-control,exchange-archive,ai-transformation}/page.tsx
        ai-services/page.tsx           AI 포트폴리오 허브
        ai-services/[slug]/page.tsx    프로젝트 상세 (generateStaticParams)
        solutions/page.tsx             Arctera Solutions 허브
        solutions/[slug]/page.tsx      제품 상세 (generateStaticParams)
    components/
      brand/CinematicHero.tsx
      layout/{SiteHeader,SiteFooter}.tsx
      sections/{Scene,DataTransition,ProductReveal,ExperienceScene,
                InsightsEditorial,ClosingContact,PortfolioList}.tsx
      ui/{Button,Link}.tsx
      interactive/{Reveal,HeaderShell,MobileNav}.tsx
    content/  assets · company · contact · navigation · portfolio · solutions .ts
    lib/      asset-path.ts · seo.ts
  public/   images/ · brand/ · fonts/
  scripts/  optimize-* · subset-font · verify-* · copy-supersessions.json
  tests/    audit.mjs · design-qa.mjs
  .github/workflows/deploy.yml
```

`(site)` 그룹은 URL 에 노출되지 않는다.
**관리자 영역과 `api/` 는 만들지 않았다.** `SPEC.md` §4 가 관리자 인수인계를 별도 시스템 범위로
분리했고, 정적 Export 에서는 서버 인증을 구현할 수 없다. 구조도에 이름이 있다고 구축 완료로 보고하지 않는다.

## 4. 서버·클라이언트 경계

페이지·레이아웃·본문·목록·상세는 전부 Server Component 로 빌드 시점에 렌더한다.
root layout 이나 페이지 전체에 `use client` 를 붙이지 않는다.

Client Component 는 상호작용이 필요한 셋뿐이다.

| 컴포넌트 | 이유 |
|---|---|
| `interactive/MobileNav` | 열림 상태, Escape, 포커스 복귀, body portal |
| `interactive/HeaderShell` | 스크롤 위치에 따른 배경 전환 |
| `interactive/Reveal` · `sections/DataTransition` | IntersectionObserver·스크롤 진행도 |

`MobileNav` 는 패널을 `createPortal` 로 body 에 올린다. 헤더의 `backdrop-filter` 가
`position: fixed` 의 containing block 을 만들어 패널 높이가 0 이 됐던 결함을 원천 차단한다.

콘텐츠는 `src/content` 의 타입 있는 데이터에서 빌드한다. CMS·실시간 DB·`useEffect` 지연 로딩을
쓰지 않는다. JS 가 꺼져도 H1·핵심 본문·제품명·실제 링크가 HTML 에 존재한다.

## 5. 콘텐츠 데이터 모델 — 실제 파일

| 파일 | 내용 | 공개 규칙 |
|---|---|---|
| `company.ts` | 법인명·이메일·블로그·사이트 URL | 대표자·사업자번호·주소는 승인값 미확인이라 `null`. **값이 없으면 렌더하지 않는다.** 자리표시자를 두지 않는다 |
| `navigation.ts` | 메뉴, `staticPublicRoutes` | sitemap 의 정적 경로 단일 출처 |
| `assets.ts` | A01–A13 배포 경로·실제 크기·role·alt·sourceStatus | A14–A17 은 미사용 사유를 `unusedAssets` 에 기록 |
| `contact.ts` | `CONTACT_MODE`, 문의 항목, 기존 운영 계약 주석 | 현재 `disabled` |
| `portfolio.ts` | AI 프로젝트 레코드 | `publication==='published' && publicationApproved` 만 공개. `stage` 는 확인일이 있을 때만 |
| `solutions.ts` | Arctera 6과제·제품 4종·관계 고지·확인일 | 파트너 주장 금지, 확인일은 빌드 날짜로 대체하지 않음 |

목록·홈 대표항목·상세·사이트맵은 **모두 같은 레코드**에서 생성한다. UI 파일에 프로젝트명·제품명을
하드코딩하지 않는다. 내부 승인 메모·개인 연락처는 공개 번들에 넣지 않는다.

`routes.ts`·`insights.ts`·`projects.ts` 는 v1 설계상의 이름이며 실제로는 위 파일들로 구현했다.
인사이트는 확인된 글이 없어 별도 데이터 파일 없이 빈 배열로 처리한다.

## 6. 이미지·폰트·모션 — 실제 구현과 근거

### 이미지

`images.unoptimized: true` 다. 정적 Export 에는 이미지 최적화 서버가 없으므로
**빌드 전에 사전 최적화본을 만든다**(`npm run optimize:assets`). 원본 46MB → 배포본 320KB.
원본은 배포 디렉터리 밖에 보존하고 포맷 변환·리사이즈·압축만 수행한다.

⚠ **full-bleed 배경 이미지는 raw `<img>` 를 쓴다.** `next/image` 의 `priority` 가 런타임에
desktop 이미지 preload 를 주입해 `<picture>` 의 media 선택을 우회하고, 모바일에서 desktop 원본까지
내려받는 것이 실측 확인됐다. 해당 파일에는 `eslint-disable` 과 사유 주석을 함께 둔다.
Hero 는 `<picture>` + `<source media>` + `fetchPriority="high"` + React 19 가 호이스팅하는
`<link rel="preload" media>` 로 구성한다. 두 장을 동시에 받지 않는지 네트워크로 검증한다.

모든 이미지에 실제 `width`/`height` 를 지정한다(CLS 0.000 유지). 장식 이미지는 `alt=""` 다.

### 폰트

`next/font/local` 로 **Noto Sans KR 서브셋을 self-host** 한다.
`next/font/google` 의 Noto Sans KR 은 unicode-range 청크마다 `@font-face` 를 만들어
**249개 · 170KB 의 렌더 블로킹 CSS** 를 생성했고 FCP 2.4초의 원인이었다.
빌드 산출물에서 실제 사용 글자만 추출해 가변 서브셋(wght 400–500) 하나로 줄였다.
CSS 170.3KB → 19.9KB(gzip 51.2 → 5.2KB), `@font-face` 249 → 2.

디자인 지정 폰트는 그대로 Noto Sans KR + Source Serif 4 다. 폰트를 교체한 것이 아니다.

⚠ **카피를 바꾸면 `npm run subset:font` 를 다시 실행해야 한다.** 누락 시 새 글자가 폴백 폰트로
렌더된다. CI 의 `verify-font-subset` 가 이를 막는다.

### 모션

**모션 라이브러리를 추가하지 않았다.** IntersectionObserver + CSS 트랜지션만 쓴다.
등장 760~900ms `cubic-bezier(0.16, 0.84, 0.3, 1)`, 이동 18px, 1회.
bounce·shake·파티클·커서 트레일·스크롤 하이재킹·자동재생 없음.

`prefers-reduced-motion: reduce` 에서 모든 `[data-reveal]` 이 즉시 최종 상태가 되고
`DataTransition` 은 두 메시지를 동시에 정적으로 보여준다. 애니메이션 없이도 장면이 완전하다.

## 7. SEO·HTTP 응답

`src/lib/seo.ts` 의 `pageMeta()` 가 title·description·canonical·OG 를 생성한다.
canonical 기준은 고정된 `https://www.humease.com` 이며 요청 Host 로 만들지 않는다.

`sitemap.ts` 는 `staticPublicRoutes` + 공개 프로젝트 + 제품 4종에서 생성한다.
draft·미승인 항목은 HTML 도 사이트맵도 만들지 않는다. 현재 19건.

### robots — 환경별 정책

```
basePath 있음(검증 환경)  → robots.txt: Allow /   +  meta robots: noindex, nofollow
basePath 없음(운영 도메인) → robots.txt: Allow / + AI 크롤러 허용 + sitemap 제출
```

⚠ **검증 환경을 `Disallow: /` 로 막지 않는다.** 크롤링을 차단하면 크롤러가 meta noindex 를
읽지 못해 오히려 색인이 남을 수 있다. 색인 차단은 meta 로만 한다.
프로젝트 경로 아래 `robots.txt` 는 호스트 루트 정책을 대신하지 못하므로 페이지별 meta 를 검수한다.

### 404

고유 페이지가 없는 경로는 실제 HTTP 404 를 반환한다(`404.html`).
모든 404 를 홈으로 보내는 SPA fallback 을 쓰지 않는다. 신규 URL 누락이 200 으로 가려지기 때문이다.

### 별칭 경로 — **미구현. 도메인 전환 전 처리 필요**

구 운영 사이트에 아래 경로가 실제로 존재하며 클라이언트 라우팅으로 최종 경로에 도달한다.
2026-09-06 실측: `https://www.humease.com/services/e-discovery` 등은 **301 로 trailing slash 정규화 후 200**.

| 별칭 | 최종 경로 |
|---|---|
| `/consulting/ai-consulting` · `/jtbd/ai-consulting` · `/services/ai-consulting` | `/consulting/ai-transformation` |
| `/jtbd/e-discovery` · `/services/e-discovery` | `/consulting/e-discovery` |
| `/jtbd/internal-control` · `/services/internal-control` | `/consulting/internal-control` |
| `/jtbd/exchange-archive` · `/services/exchange-archive` | `/consulting/exchange-archive` |
| `/jtbd/ai-transformation` · `/services/ai-transformation` | `/consulting/ai-transformation` |

**신 사이트에서는 현재 전부 404 다**(실측). 도메인을 전환하면 이 URL 들이 깨진다.

정적 Export 에는 서버 리다이렉트가 없다. `next.config.ts` 의 `redirects()` 는 동작하지 않는다.
따라서 **빌드 후 생성하는 정적 이동 페이지**(canonical + meta refresh + 실제 링크)로 처리한다.
이는 **HTTP 301 이 아니라 200** 이며, 보고서에 그렇게 기록한다. 301 을 구현한 것처럼 쓰지 않는다.

한편 `/solutions/#ev` 계열 앵커는 허브에 `id` 로 보존했고,
`/solutions/merge1` 같은 과거 상세 경로는 **구 사이트에 존재한 적이 없음을 확인**했으므로
별칭 대상이 아니다(전부 404).

## 8. npm 스크립트·CI — 실제 구성

| 스크립트 | 역할 |
|---|---|
| `dev` / `build` / `start` | `next dev` / `next build` / `next start` |
| `lint` | `eslint` (경고 0 유지) |
| `optimize:assets` · `optimize:logo` | 원본에서 웹 배포본 생성. 원본 무변경 |
| `subset:font` | 사용 글자만 담은 가변 폰트 서브셋 생성 |
| `verify:routes` | 공개 라우트·404·sitemap·robots 생성 확인 |
| `verify:copy` | `docs/03` 승인 카피 대조. 후속 요청서가 대체한 항목은 `copy-supersessions.json` 으로 제외 |
| `verify:request` | 후속 요청서 지정 카피 대조 |
| `verify:content` | slug 중복·필수 누락·draft 노출·제품 경로·Capture 표기·파트너 주장·앵커·basePath |
| `verify:assets` | 원본↔배포본 정합, `ASSET_MAP.csv`·`ASSET_INVENTORY.md` 생성 |
| `verify:exposure` | 빌드 산출물의 서버 비밀 노출 |
| `verify:font` | 서브셋이 현재 카피를 모두 담고 있는지 |

`tests/audit.mjs` — 배포본 대상 기능·SEO·접근성·성능 감사(Playwright + axe).
`tests/design-qa.mjs` — 리디자인 FAIL 기준 5종 자동 검사.

단위 테스트(`test:unit`)와 별도 e2e 러너는 **미구성**이다. 현재는 위 검증 스크립트와
두 감사 스크립트가 그 역할을 한다. 필요해지면 Node test runner 로 추가한다.

### CI 순서 (`.github/workflows/deploy.yml`)

```
checkout → setup-node(.nvmrc, npm cache) → npm ci → tsc --noEmit → eslint
→ next build (NEXT_PUBLIC_BASE_PATH 주입)
→ verify: routes · copy · request-copy · content · assets · exposure · font
→ touch out/.nojekyll → upload-pages-artifact → deploy-pages
```

검증 단계에도 `NEXT_PUBLIC_BASE_PATH` 를 주입한다. 없으면 basePath 이탈 검사가 조용히 건너뛰어진다.
Next build 성공을 ESLint 성공으로 간주하지 않는다.
자동 DNS 변경·DB migration·운영 폼 제출은 CI 에 넣지 않는다.

⚠ **`main` push 는 즉시 운영 배포를 실행한다.** 승인 없이 push 하지 않는다.

## 9. 성능·운영

성능 예산은 `docs/02` §8 을 따른다. 측정 조건은 Chrome headless, mobile form factor,
`--throttling-method=simulate`, 캐시 없음이다.

배포본은 CDN·네트워크 변동으로 편차가 커(77~98 관측) 중앙값이 불안정하다.
따라서 **네트워크 변수를 제거한 로컬 프로덕션 빌드(gzip 전송) 5회 중앙값**을 기준값으로 삼고
배포본 측정은 참고로 병기한다. basePath 없는 로컬 조건은 커스텀 도메인 전환 후와 동일하다.

| 시점 | Perf | A11y | BP | SEO | 비고 |
|---|---|---|---|---|---|
| 리디자인 전 | 98 | 100 | 100 | 100 | LCP 2,272ms |
| 리디자인 후 | 93 | 100 | 100 | 100 | full-bleed Hero 로 LCP 이미지 증가 |
| 콘텐츠 보강 후 | **94** | **100** | **100** | **100** | LCP 2,973ms · CLS 0.000 · 369KB |

실사용자 p75 LCP·INP·CLS 는 실제 트래픽이 쌓인 뒤 측정한다.
사전 테스트 결과를 실사용자 달성치로 쓰지 않는다.

## 10. 이 문서에서 폐기된 v1 조항

| v1 조항 | 상태 |
|---|---|
| "`output: 'export'` 는 쓰지 않는다" | **폐기** — 정적 Export 가 확정 구조다 |
| "GitHub Pages 용 basePath 를 가져오지 않는다" | **폐기** — basePath 는 필수다 |
| `api/contact`·`api/admin/inquiries`·`api/health` Route Handler | **폐기** — 서버가 없다 |
| `(operations)/admin` 인증 영역 | **폐기** — `SPEC.md` §4 별도 시스템 범위 |
| `src/lib/server/**`, `proxy.ts` | **폐기** |
| `next.config.ts` 의 permanent redirects·308 검수 | **폐기** — §7 정적 이동 페이지로 대체 |
| Vercel Node 설정·Output Directory 언급 | **폐기** — Vercel 미사용 |
