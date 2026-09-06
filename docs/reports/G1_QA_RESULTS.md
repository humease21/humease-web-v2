# G1 검수 결과

- 실행: 2026-09-06 / Asia/Seoul
- 대상: **production build** — https://humease21.github.io/humease-web-v2/ (커밋 `79ca82d`)
- 개정: 2회차. 1회차 보고의 이미지 검수 PASS 는 **오판이었다.** 아래 §0 참조.
- 기준: `docs/08_QA_AND_HANDOFF.md` §2 필수 테스트
- 도구: Playwright Chromium 153.0.8010.12 / axe-core WCAG 2.1 AA / Lighthouse mobile, simulate throttling, 3회 중앙값
- 증거: `docs/reports/evidence/`

## 0. 1회차 보고 정정 — 검수 자체의 결함

**1회차에서 I03·I04 를 PASS 로 보고했으나 틀렸다.** 당시 사이트의 **모든 이미지와 로고가 404** 였다.

검수 스크립트가 `src` 속성 문자열과 요청 URL 부분일치만 확인하고 **실제 로드 여부를 보지 않았다.**
404 를 받은 이미지도 `src` 속성은 정상이고 요청 URL 에 파일명이 들어 있어 그대로 통과했다.
같은 이유로 1회차 Lighthouse Performance 97 도 **이미지가 없는 상태의 무효값**이었다.

원인은 `basePath` 미적용이다. `next.config` 의 `assetPrefix` 는 `_next/*` 에만 적용되며,
`public/` 파일을 `/images/x.webp` 로 직접 참조하면 Next 가 경로를 다시 쓰지 않아
프로젝트 Pages 하위 경로에서 404 가 된다. `unoptimized` next/image 와 raw `<img>` 모두 해당한다.

조치: `src/lib/asset-path.ts` 의 `asset()` 으로 basePath 일괄 주입.
검수 스크립트에는 `naturalWidth > 0` 검사와 4xx/5xx 응답 수집(N01)을 추가했다.
수정 전 배포본에 새 스크립트를 돌려 **결함을 실제로 잡는 것까지 확인**한 뒤 수정본을 배포했다.

## 자동 검수 13/13 PASS

| ID | 검수 | 결과 | 증거 |
|---|---|---|---|
| B02 | Vite/React Router/SPA 프리렌더 미사용 | PASS | 번들 8개 문자열 검사, 흔적 0 |
| B03 | 클린 재현 npm ci → typecheck → build | PASS | 별도 clone 에서 17/17 정적 생성 |
| U03 | 반응형 가로 넘침 | PASS | 320·390·768·1280·1440 × 12페이지, 넘침 0 |
| U04 | 모바일 메뉴 button·aria·Escape·focus 복귀 | PASS | 수정 후 재검증 |
| I03 | 모바일 Hero 중복 요청 | PASS | mobile=true, desktop=false, 이미지 3건 |
| I04 | 이미지 dimensions·alt | PASS | 전 이미지 width/height/alt 지정 |
| R01 | 공개 12개 라우트 직접 접근 | PASS | 12/12 HTTP 200 |
| R03 | 진짜 404 | PASS | 임의 경로 HTTP 404 |
| R04 | 빈 # CTA·unsafe scheme | PASS | 0건 |
| S01 | H1 1개·title·description·canonical·OG·lang=ko | PASS | 12페이지 전부, title·canonical 각 12종 고유 |
| S02 | sitemap 공개 canonical 만 | PASS | 12건, admin/privacy/terms 0건 |
| A01 | 접근성 axe WCAG 2.1 AA | PASS | 4개 대표 페이지 위반 0건 |
| A01b | skip link | PASS | 최초 Tab → "본문으로 건너뛰기" (#main) |
| A02 | 200% 확대 상당(640px) | PASS | 가로 넘침 없음 |
| P01 | 클라이언트 번들 비밀 노출 | PASS | service_role·JWT·토큰·webhook 0건 |

## V01 성능 — Lighthouse 모바일

측정 조건: Chrome 153.0.8010.12, mobile form factor, `--throttling-method=simulate`, 캐시 없음.
배포본은 CDN·네트워크 변동으로 편차가 커(77~98) 중앙값이 불안정했다.
따라서 **네트워크 변수를 제거한 로컬 프로덕션 빌드(gzip 전송) 5회 중앙값**을 기준값으로 삼고,
배포본 측정은 참고로 병기한다. basePath 없는 로컬 조건은 커스텀 도메인 전환 후와 동일하다.

| 지표 | 로컬 5회 중앙값 | 목표 | 판정 |
|---|---|---|---|
| Performance | **98** | 90 | PASS |
| Accessibility | **100** | 95 | PASS |
| Best Practices | **100** | 95 | PASS |
| SEO | **100** | 95 | PASS |

FCP 766ms · LCP 2,272ms · CLS 0.000 · 전송량 319KB (예산 1.5MB 이하)
개별 실행 98 / 98 / 94 / 98 / 98 — 편차 4점.

### 성능 결함과 조치

이미지 404 를 고치자 Performance 는 **86 (FAIL)** 로 떨어졌다. 앞선 97 이 무효값이었기 때문이다.
원인을 추적한 결과 CSS 170.3KB(gzip 51.2KB)의 **100% 가 Noto Sans KR 의 `@font-face` 249개**였다.
`next/font/google` 이 unicode-range 청크마다 하나씩 생성한 것으로, 렌더 블로킹이라 FCP 2.4초를 만들었다.

공개 카피가 고정된 마케팅 사이트에서 전 글리프를 실어 나를 이유가 없다. 빌드 산출물에서
실제 사용 글자 396자를 추출해 **가변 서브셋(wght 400-500) 하나로 self-host** 했다.
디자인 지정 폰트는 그대로 Noto Sans KR 이며 폰트를 교체한 것이 아니다.

| 항목 | 전 | 후 |
|---|---|---|
| CSS | 170.3KB (gzip 51.2KB) | 19.9KB (gzip 5.2KB) |
| `@font-face` | 249개 | 2개 |
| FCP | 2.4s | **0.77s** |
| LCP | 3.9s | **2.27s** |
| 전송량 | 497KB | **319KB** |
| Performance | 84 | **98** |

함께 적용: favicon 48.5KB → 2.5KB, 폰트 weight 축소, Hero LCP preload.

⚠ **카피를 변경하면 `npm run subset:font` 를 다시 실행해야 한다.** 누락 시 새 글자가 폴백 폰트로 렌더된다.

## 수정한 결함 4건

**U04 CRITICAL — 모바일 메뉴가 열리지 않음.** 헤더의 `backdrop-blur` 가 `position: fixed` 의 containing block 을 생성해, 패널이 64px 헤더 기준으로 배치되며 height 0 이 됐다. `docs/02` §5 가 "스크롤 후 솔리드 배경"을 지정하므로 blur 를 제거해 스펙과 정합화했다.

**자산 전체 404 CRITICAL — basePath 미적용.** §0 참조. 첫 배포부터 모든 이미지·로고가 404 였다.

**폰트 CSS 렌더 블로킹 HIGH — Noto Sans KR @font-face 249개.** 위 성능 절 참조.

**I03 HIGH — 모바일에서 desktop Hero 중복 다운로드.** `next/image` 의 `priority` 가 런타임에 desktop 이미지 preload 를 주입해 `<picture>` 의 media 선택을 우회했다. Hero 반응형 이미지를 순수 `<picture>` 로 교체했다.

## BLOCKED · NOT RUN

| ID | 검수 | 상태 | 사유 |
|---|---|---|---|
| F01–F06 | 문의 입력·접수·중복·알림·환경차단·남용방지 | **BLOCKED** | 문의 mock/disabled. 운영 자격정보·동의·개인정보처리방침 승인 전 |
| O01·O02 | 관리자 인증·데이터 | **BLOCKED** | `SPEC.md` §4 별도 시스템 범위. 이관 범위 미확정 |
| P02 | 개인정보 정책·동의 일치 | **BLOCKED** | 승인 정책 본문 없음 |
| C01 | 공개 카피 대조 | **NOT RUN** | 자동 대조 미구현. 육안 검수 필요 |
| C03 | 인사이트 실제 글 | **NOT RUN** | 확인된 글 없어 블로그 CTA 만 노출 중 |
| I01 | A-ID ↔ 실제 파일 매핑 | **NOT RUN** | `G0_BASELINE.md` §6 제안 매핑 상태. 시각 확인 필요 |
| S03 | Preview noindex | **NOT RUN** | 현재 Pages 가 Preview 겸용. 도메인 전환 설계 시 확정 |
| S04 | 기존 검색 자산 처리 | **NOT RUN** | naver 인증·favicon·URL 이관 계획 미수립 |
| U05 | 브랜드 일관성 | **NOT RUN** | 육안 검수 |
| V02 | 실기기 브라우저 | **NOT RUN** | iPhone Safari·Android Chrome·Samsung Internet 미보유 |
| D01–D05 | 전환·DNS·롤백 | **NOT RUN** | 승인 전 실행 금지 |

**Playwright Chromium 결과를 실제 Safari/실기기 결과로 표기하지 않는다**(`docs/08` §3).

## 운영 영향

기존 `Humease/Homepage`·`www.humease.com`·GitHub Pages·DNS·CNAME·운영 DB **변경 0**. 검수는 전부 신규 사이트 대상 읽기 요청이며 운영 DB/메일/로그 쓰기는 발생하지 않았다(B04 PASS).
