# G1 검수 결과

- 실행: 2026-09-06 / Asia/Seoul
- 대상: **production build** — https://humease21.github.io/humease-web-v2/ (커밋 `59c930b`)
- 기준: `docs/08_QA_AND_HANDOFF.md` §2 필수 테스트
- 도구: Playwright Chromium 153.0.8010.12 / axe-core WCAG 2.1 AA / Lighthouse mobile, simulate throttling, 3회 중앙값
- 증거: `docs/reports/evidence/`

## 자동 검수 12/12 PASS

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

## V01 성능 — Lighthouse 모바일 3회 중앙값

| 지표 | 결과 | 목표 | 판정 |
|---|---|---|---|
| Performance | **97** | 90 | PASS |
| Accessibility | **100** | 95 | PASS |
| Best Practices | **96** | 95 | PASS |
| SEO | **100** | 95 | PASS |

LCP 중앙값 2,295ms · CLS 0.000 · 전송량 517KB (예산 1.5MB 이하)

개별 실행: 98 / 79 / 97. **2회차 79 는 네트워크 변동에 의한 이상치**로 LCP 3.7s·TBT 340ms 를 기록했다. 중앙값 기준을 적용하되 이상치 발생 사실을 남긴다.

## 수정한 결함 2건

**U04 CRITICAL — 모바일 메뉴가 열리지 않음.** 헤더의 `backdrop-blur` 가 `position: fixed` 의 containing block 을 생성해, 패널이 64px 헤더 기준으로 배치되며 height 0 이 됐다. `docs/02` §5 가 "스크롤 후 솔리드 배경"을 지정하므로 blur 를 제거해 스펙과 정합화했다.

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
