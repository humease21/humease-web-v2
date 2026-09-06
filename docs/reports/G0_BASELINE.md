# G0 기준선 조사 보고서

- 작성: 2026-09-06 / Asia/Seoul
- 근거 문서: `SPEC.md` v3.0, `docs/01_SCOPE_AND_BASELINE.md` §4
- 조사 성격: **READ-ONLY.** 기존 저장소·Pages·DB·DNS 에 어떤 쓰기도 하지 않았다.
- 공개 범위: **내부.** 비밀키·개인정보 원문은 포함하지 않는다.

## 0. 조사 방법과 한계

실행한 명령은 전부 읽기다 — `git status/log/show/branch/remote`, 파일 읽기, `curl`(GET), `getent hosts`, `gh run list/view`, `gh api` GET, Vercel MCP 조회.
체크아웃·브랜치 생성·커밋·푸시·의존성 설치·빌드·배포는 실행하지 않았다.

이 환경에는 `dig`·`nslookup`·`host` 가 없다. DNS 는 `getent hosts` 로 A/AAAA 만 확인했고 **TTL·NS·TXT 는 확인할 수 없다.**

---

## 1. 저장소·작업 경계

| 항목 | 기존(구) | 신규 |
|---|---|---|
| 식별자 | `Humease/Homepage` | 미생성 — `humease-web-v2` 예정 |
| remote | `https://github.com/Humease/Homepage.git` | 없음 |
| 기본 브랜치 | `main` | `master` (로컬 init 직후) |
| 원격 브랜치 | `origin/main`, `origin/backup/before-oauth-renewal` | — |
| 작업 디렉터리 | `/mnt/e/VibeCoding/Humease-homepage` | `/mnt/e/VibeCoding/humease-web-v2` |
| 경계 | **읽기 전용** | 읽기·쓰기 |

**현재 배포 커밋: `afaa576`** — `[기능] 휴미즈 관리자 로그인 구글 OAuth 전환 + 이메일 화이트리스트`, 2026-06-16 19:42:25 +0900.
이후 커밋 없음 → `main` HEAD 와 운영 배포본이 일치한다. GitHub Actions 최근 12회 중 11회 성공, 마지막 성공 런 `27612143845` (2026-06-16T10:46:47Z, headSha `afaa576a…`).

⚠ **기존 작업 폴더에 미커밋 변경 9건 + 미추적 파일 다수**가 있다 (`.env.example`, `.gitignore`, `GEMINI.md`, `Plan.md`, `Plan2.md`, `SEO_AEO_GEO…md`, `public/sitemap.xml`, `src/components/Footer.tsx`, `src/components/Navbar.tsx`, `src/lib/supabase.ts`). 조사 전후 동일하며 손대지 않았다. **이 변경들은 운영에 반영되어 있지 않다.**

**작업 폴더 충돌:** `/mnt/e/VibeCoding/humease-web-v2`, `Humease-web-v2` 모두 조사 시점에 존재하지 않았다. 신규 생성했으므로 덮어쓰기·강제 초기화는 발생하지 않았다.

## 2. 공개 URL·검색 자산

호스팅은 **GitHub Pages** (`server: GitHub.com`, `via: 1.1 varnish`). Pages 설정: `build_type=workflow`, source `main /`, `https_enforced=true`.

| 경로 | 상태 | 비고 |
|---|---|---|
| `/` `/about` `/solutions` `/contact` `/ai-services` | 200 | |
| `/consulting/e-discovery` | 200 | 하위 3종도 sitemap 등재 |
| `/admin` | 200 | 관리자 화면 공개 접근 가능(인증은 화면 내부) |
| `/robots.txt` `/sitemap.xml` `/llms.txt` `/rss.xml` | 200 | |
| **`/enterprise-data`** | **404** | v3 신규 페이지 P03 |
| **`/insights`** | **404** | v3 신규 페이지 P12 |
| `naver27d4b225…html` | **404** | 파일이 `public/` 이 아닌 리포 루트에 있어 미배포 |

sitemap 등재 경로 8개: `/about` `/ai-services` `/consulting/ai-transformation` `/consulting/e-discovery` `/consulting/exchange-archive` `/consulting/internal-control` `/contact` `/solutions`.

- 검색 인증: `naver-site-verification` **메타 태그로 동작 중**(파일 방식은 404). Google 인증 태그 없음.
- favicon: `/favicon.png`
- OG: `og:url=https://www.humease.com`, `og:image=/company_img.jpg`, `og:site_name=휴미즈`, `og:locale=ko_KR`
- ⚠ **`<link rel="canonical">` 없음** — 신규 구축 시 Metadata API 로 반드시 추가
- robots.txt 가 `GPTBot`·`ChatGPT-User`·`Claude-Web`·`PerplexityBot` 을 명시 허용 → 신규 사이트에서 유지 여부 확인 필요

## 3. DNS·HTTPS

| 이름 | 타입 | 값 | TTL |
|---|---|---|---|
| `humease.com` | A | `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153` | **BLOCKED** |
| `www.humease.com` | CNAME→ | `humease.github.io` (AAAA `2606:50c0:800{0..3}::153`) | **BLOCKED** |
| NS / TXT | — | **BLOCKED** — 조회 도구 없음 | — |

apex·www 모두 **GitHub Pages 를 가리킨다.** HTTPS 인증서: `humease.com` + `www.humease.com`, 상태 approved, **만료 2026-10-23.**

⚠ **CNAME 불일치:** 리포의 `public/CNAME` 파일은 `humease.com`(apex) 인데 GitHub Pages API 는 `cname: www.humease.com` 을 보고한다. DNS 전환 설계 전에 apex/www 대표 주소를 확정해야 한다.

`blog.humease.com`·`build.humease.com` 은 이 환경에서 해석되지 않았다 — **BLOCKED**(미존재 단정 아님).

## 4. 회사 정보·공개 근거

현재 라이브에 게시된 문구를 **출처로만** 기록한다. 승인 상태는 확인되지 않았다.

- `og:title` / `<title>`: 휴미즈 | 데이터 컴플라이언스 & AI 컨설팅 전문기업
- description: "**Microsoft MVP 출신 전문가**가 제공하는 데이터 컴플라이언스(e-Discovery, 내부통제) 및 맞춤형 AI 서비스(AX) 컨설팅 전문 기업… Enterprise Vault, Merge1, Exchange Server, Microsoft 365"

⚠ **재승인 필요 항목** (`SPEC.md` §7, `docs/01` §5):
- "Microsoft MVP 출신" — **개인 경력인지 법인 경력인지 구분되지 않은 채 회사 설명에 사용 중**. 분리 원칙에 저촉될 수 있다
- 벤더 제품명(Enterprise Vault, Merge1 등) 나열이 파트너 지위로 읽힐 소지
- 대표자·사업자번호·주소·연락처: 이번 조사 범위의 HTML head 에서 확인되지 않음 → **NOT RUN**(푸터 본문 미확인)
- 개인정보처리방침·약관 승인본: **BLOCKED**

## 5. 문의·관리자 기능 계약

| 기능 | 구현 | 저장소 |
|---|---|---|
| 문의 저장 | `src/pages/Contact.tsx` → `supabase.from('inquiries').insert` | Supabase `inquiries` |
| 분석 로그 | `src/lib/supabase.ts` `logEvent()` → `view_logs` insert. `/admin` 경로에서는 전송 차단 | Supabase `view_logs` |
| 관리자 | `/admin`, **Google OAuth + 이메일 화이트리스트** (`afaa576`) | Supabase Auth |
| 알림 | Edge Function `supabase/functions/discord-webhook` 1개 | Discord |
| 메일 | `@emailjs/browser` 의존성은 있으나 **`src/` 에서 호출 없음** → 미사용 잔재로 보임 |

- **FormSubmit 사용 안 함** (확인됨).
- 운영 환경변수(CI Secrets): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 2종만 빌드에 주입.
- `.env.example` 의 `GEMINI_API_KEY`·`APP_URL`·`VITE_EMAILJS_*` 3종은 현재 코드가 쓰지 않는다.
- 비밀 파일(`.env`, `.supabase_token`, `.vercel/`)은 전부 gitignore 되어 있고 **과거 커밋 유출 이력 없음**(`git log --all -- .env .supabase_token` 무결과).

⚠ **RLS·스키마·권한은 조사하지 않았다** — DB 접근은 금지 범위. **BLOCKED.**

## 6. 이미지 자산 인벤토리와 A01–A17 매핑

원본 위치: `/mnt/e/VibeCoding/Humease-homepage-v2/Images/` — **PNG 26개 / 46.1 MB / 평균 1.8 MB.**

**내용 완전 동일 중복 2쌍**(md5 일치) → 고유 자산 **24개**.
- `ab76de9c03` internal_contr ×2
- `aeab3c3e1a` e-Disc ×2

해상도: 2048×1152 6개(신규 `A_premium_*`), 1376×768 16개(구 `Create_a_*`), 928×1152 2개, 912×1136 1개, 1200×896 1개.

### 제안 매핑 (`sourceStatus: located` — 승인 전)

| ID | 후보 파일(접두) | md5 | 비고 |
|---|---|---|---|
| A01 | `Create_a_169_horizontal_premium_enterprise_websit` | `f0059ec480` | desktop Hero |
| A02 | `A_premium_45_vertical_background_image_for_a_mobi` | `0fc94d6432` | mobile Hero(고해상) |
| A02-alt | `Create_a_45_vertical_mobile_homepage_background_i` | `798f28243f` | 구본 |
| A03 | `A_premium_169_horizontal_abstract_brand_image_On` | `6bb17fe708` | 구본 `3dfd77b170` |
| A04 | `A_premium_169_horizontal_image_for_an_Enterprise_` | `30864002b4` | 구본 `300160f223` |
| A05 | `A_premium_169_horizontal_precise_abstract_image_` | `e23a6f9bfa` | 구본 `aeab3c3e1a`(중복쌍) |
| A06 | `A_premium_169_horizontal_abstract_image_for_an_in` | `e0acf8699d` | 구본 `ab76de9c03`(중복쌍) |
| A07 | `A_premium_169_horizontal_abstract_image_for_a_mai` | `5c4936d360` | 구본 `fb875471f6` |
| A08 | `Create_a_169_hero_image_for_an_Applied_AI_page_O` | `c04fc8f9c6` | |
| A09 | `Create_a_169_abstract_image_for_an_AI_projects_in` | `70bf6f079c` | |
| A10 | `Create_a_169_brand_concept_image_for_a_family_com` | `f401e8255b` | 맘이음 |
| A11 | `Create_a_43_abstract_material_image_for_an_about_` | `77a10f0e85` | 1200×896 |
| A12 | `Create_a_169_abstract_image_for_an_enterprise_sol` | `bc45204938` | |
| A13 | `A_premium_169_horizontal_background_image_for_a_c` | `70e076e3e5` | contact 추정 |
| A14 | `Create_a_169_editorial_cover_image_for_a_tech_ins` | `3fb5ccd252` | 글 있을 때만 |
| A15 | `Create_a_169_editorial_cover_image_for_an_Applied` | `a2529fac5f` | 글 있을 때만 |
| A16 | `Create_a_169_editorial_cover_image_for_a_product_` | `8dcd2dc62a` | 글 있을 때만 |
| A17 | `Create_a_wide_background_image_at_approximately_1` | `4026400a99` | OG 배경 |
| 미배정 | `Create_a_45_vertical_supplementary_image_for_a_pr` | `b537422e39` | 용도 확인 필요 |

**A01–A17 전부 후보 파일이 존재한다.** 다만 이 표는 파일명(생성 프롬프트)에 근거한 **추정**이며 시각 확인을 거치지 않았다 → `verification_status: located`, 시각 검수는 **NOT RUN**.

⚠ `A_premium_*` 7개는 동일 주제의 고해상 재생성본으로 보인다. **A02·A03·A04·A05·A06·A07 에서 신·구본 중 무엇을 쓸지 대표 확인 필요.**
⚠ 파일명에 `169`(16:9) 라고 적혀 있으나 실제 비율은 1376×768 = 43:24, 2048×1152 = 정확히 16:9 다. CSS `aspect-ratio` 고정 시 크롭이 발생할 수 있다.

## 7. Vercel

| 항목 | 값 |
|---|---|
| 팀 | `markanitp-8020's projects` (slug `markanitp`, `team_UfClyOCwAeLTrTHiQCDvcXMg`) |
| **플랜** | **`hobby`** |
| 기존 프로젝트 | `k-bestie-v3-dev`, `k-bestie-v3` — 2개뿐 |
| `humease-web-v2` | **없음** — 신규 생성 가능 |
| 환경변수 준비 | **NOT RUN** — 프로젝트 미생성 |

🔴 **최우선 차단 사유.** 현재 플랜이 **Hobby** 다. Vercel Hobby 는 **비상업적 용도 전용**이며, 회사 홈페이지(`humease.com`) 운영은 상업적 사용에 해당해 **Pro 플랜이 필요**하다. 플랜 상향은 비용 발생 작업이므로 **대표 승인 없이 진행할 수 없다.** → `docs/01` §4-7 "상업용 플랜 적합성" = **BLOCKED**

⚠ 기존 리포의 `.vercel/project.json` 은 `projectName: humease-homepage` 를 가리키지만 **이 팀에는 그 프로젝트가 없다.** 다른 계정 소유이거나 삭제된 것으로, 스테일 파일이다. 신규 프로젝트와 혼동하지 말 것.

## 8. 런타임 기준 대조

| 항목 | SPEC §2 요구 | 실제 | 판정 |
|---|---|---|---|
| Node.js | 24.x | **v24.18.0** | PASS |
| npm | npm + `package-lock.json` | **11.16.0** | PASS |
| git | — | 2.53.0 | — |
| Next.js / TS / Tailwind 4 | 16.x / strict / 4.x | 미설치 | NOT RUN |

## 9. 추가 발견 — 신규 구축에 반영할 것

1. **`.env.local` 파일 손상.** `/mnt/e/VibeCoding/Humease-homepage-v2/.env.local` 10줄 중 `=` 가 있는 줄이 1개뿐이다. 5행(208자)·8행(219자) 은 **키 이름 없이 JWT 값만** 있다. 그대로는 어떤 런타임도 읽지 못한다. 값은 이 보고서에 옮기지 않았다. 219자 키는 `service_role` 일 가능성이 있으므로 **절대 `NEXT_PUBLIC_` 접두사를 붙이면 안 된다.** → 대표 확인 후 재작성 필요
2. 기존 `vercel.json` 의 `rewrites: /(.*) → /` 는 SPA 폴백이다. **Next.js 에서는 불필요하며 그대로 옮기면 라우팅이 깨진다.**
3. 기존 `vite.config.ts` 5행이 `vite-plugin-sitemap` 을 import 하지만 package.json·lock·node_modules 어디에도 없다. **다만 CI 는 해당 커밋에서 성공했다**(미사용 import 가 번들 단계에서 제거된 것으로 보임). 현재 장애가 아니라 잠재 위험이며, 신규 프로젝트에는 이식하지 않으므로 무관하다.

## 10. 검수 상태 요약

| # | 항목 | 상태 |
|---|---|---|
| 1 | 구·신 저장소·remote·브랜치·배포 커밋·경계 | **PASS** |
| 2 | 공개 URL·HTTP·검색 자산·문의/관리자 경로 | **PASS** (canonical 부재·naver 파일 404 결함 발견) |
| 3 | DNS 이름·타입·값 | **PASS(부분)** — TTL·NS·TXT **BLOCKED** |
| 4 | 회사정보·경력·정책 승인 출처 | **BLOCKED** — 승인본 미확인, 푸터 본문 **NOT RUN** |
| 5 | 문의·알림·관리자 기능 계약 | **PASS** — RLS·스키마 **BLOCKED** |
| 6 | 이미지 위치·해시·ID 매핑 | **PASS(제안)** — 시각 검수 **NOT RUN** |
| 7 | Vercel 팀·권한·플랜·환경변수 | **FAIL** — Hobby 플랜, 상업용 부적합 |

## 11. 승인 없이 진행 불가한 항목

1. **Vercel Pro 플랜 상향** — 비용 발생. 미승인 시 Preview 검증까지만 가능하고 운영 전환 불가
2. **신규 GitHub 저장소 생성** — 소유 조직(`Humease` vs 개인) 미확정
3. `.env.local` 재작성에 필요한 **정상 키 이름과 값**
4. A02–A07 **신·구본 이미지 선택**
5. 회사 정보·경력 문구 **승인본**

## 12. 다음 단계 (승인 불요)

로컬에서 즉시 가능한 작업 — Next.js 16 App Router + TypeScript strict + Tailwind 4 초기화, 디자인 토큰 구현, 12개 페이지 라우팅·카피, 이미지 웹 최적화본 생성, 문의 **mock/disabled** 어댑터, Playwright·a11y·성능 검사.
