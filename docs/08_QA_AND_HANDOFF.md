# 08. 검수·게이트·작업자 인수인계

- 개정 2026-09-06 (v2) — 실제 실행된 검수 체계 반영.

## 0. 현재 자동 검수 — CI 가 매 배포마다 실행

| 스크립트 | 검사 |
|---|---|
| `verify:routes` | 공개 라우트·404·sitemap·robots 생성 |
| `verify:copy` | `docs/03` 승인 카피·SEO 메타 대조 |
| `verify:request` | 후속 요청서 지정 카피 대조 |
| `verify:content` | slug 중복·필수 누락·draft 노출·제품 경로·Capture 표기·파트너 주장·앵커·basePath |
| `verify:aliases` | 별칭 11개의 meta refresh·canonical·noindex·사이트맵 제외 |
| `verify:indexing` | preview/production 각각의 robots·sitemap·canonical·noindex 계약, 봇 정책 회귀 |
| `verify:entities` | JSON-LD 금지 필드·엔터티 관계·안전 직렬화 (운영 dry-run) |
| `verify:assets` | 원본↔배포본 정합, 인벤토리 생성 |
| `verify:exposure` | 빌드 산출물의 서버 비밀 노출 |
| `verify:font` | 폰트 서브셋이 현재 카피를 담고 있는지 |

`tests/audit.mjs` 배포본 기능·SEO·접근성 감사, `tests/design-qa.mjs` 디자인 FAIL 기준,
`tests/font-check.mjs` 한글 세리프 폴백 검사.

**빌드 성공과 200 응답만으로 디자인·콘텐츠를 PASS 로 판단하지 않는다.**

## 0-1. 실행된 게이트

| 게이트 | 결과 | 보고서 |
|---|---|---|
| G0 기준선 | 완료 (7항목 중 1 FAIL → ADR-001 로 해소) | `reports/G0_BASELINE.md` |
| G1 구현·검수 | 13/13 PASS | `reports/G1_QA_RESULTS.md` |
| G2 리디자인 | FAIL기준 5/5 통과 | `reports/G2_REDESIGN_QA.md` |
| G3 검색·표시언어 | 검증 9종 PASS | `reports/G3_SEO_AEO_GEO.md` |
| G4 독립 점검 | **NOT RUN** | — |
| G5 운영 전환 | **BLOCKED** | `docs/07` §5 |



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
| F01 | 문의 비활성 | 폼을 공개하지 않고 이메일 CTA 를 노출. 운영 저장·메일 전송 0 |
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

```text
HUMEASE `SPEC.md` v3.1 과 `docs/` 를 유일한 구현 기준으로 사용하고 구버전 Vite·Vercel·서버 API 지침은 폐기하라;
기존 홈페이지 저장소·폴더·Pages·DB·DNS 는 READ-ONLY 로 보존하고 `humease21/humease-web-v2` 에서만 작업하라;
Next.js 16 App Router + TypeScript strict + Tailwind CSS 4 + Node.js 24 + npm 과
`output: 'export'` 정적 빌드, GitHub Actions → GitHub Pages 배포 구조를 유지하라;
Route Handler·Server Actions·Middleware·ISR·서버 redirects 를 새로 도입하지 마라;
공개 19개 페이지와 별칭 11개를 유지하고 URL 을 변경하지 마라;
표시 언어는 Korean-first 로 하되 공식 제품명과 `Enterprise Vault Capture (formerly Merge1)` 표기는 그대로 두어라;
이미 생성된 A01–A17 중 사용 자산만 연결·최적화하고 신규 생성·재생성·프롬프트 작성은 하지 마라;
문의는 mock/disabled 를 유지하고 운영 DB·메일·로그에 쓰지 마라;
검색 색인은 배포 대상과 승인 두 값이 모두 있을 때만 열고, 검증 환경은 meta noindex 로만 제외하라;
`npm run verify:*` 전체와 `tests/` 감사 스크립트를 통과시킨 뒤 커밋하라;
대표님의 명시적 승인 전에는 운영 도메인 연결·DNS 변경·구 저장소 변경·검색 등록·IndexNow 제출·
비용 발생 작업을 실행하지 마라;
검수는 PASS/FAIL/BLOCKED/NOT RUN 과 증거로 보고하고 BLOCKED·NOT RUN 을 PASS 로 합산하지 마라.
```

## 8. Antigravity 전달 지침

```text
HUMEASE `SPEC.md` v3.1 과 `docs/08_QA_AND_HANDOFF.md` 를 기준으로 독립 점검한다.
소스·설정·Git 이력·DB·배포·DNS 를 변경하지 않는다. 보고서는 응답 또는 허용된 위치에만 남긴다.

확인 항목:
- 정적 Export 구조 유지, Route Handler·Server Actions·Middleware 부재
- 공개 19개 페이지와 별칭 11개의 직접 접근·새로고침, 없는 경로의 실제 404
- 별칭이 HTTP 301 이 아니라 200 정적 이동임을 보고서가 정확히 기술하는지
- Korean-first 적용 상태와 공식 제품명 보존,
  `Enterprise Vault Capture (formerly Merge1)` 의 H1·title·본문·FAQ 유지
- 검증 환경의 meta noindex, canonical·sitemap·JSON-LD 미출력
- 운영 dry-run 산출물이 검증 Pages 에 업로드되지 않았는지
- Arctera 비공식 파트너 관계 고지, 미확인 실적·파트너 주장 부재
- 포트폴리오의 공개 단계·참여 범위 표기가 확인된 사실만 담는지
- 이미지 원본 보존, 모바일에서 desktop 원본 중복 다운로드 부재
- 접근성·반응형·성능, 빌드 산출물의 비밀 노출

운영 문의 실전송·메일·로그 생성은 수행하지 않는다.
실행한 항목만 PASS/FAIL 로 판정하고 나머지는 BLOCKED/NOT RUN 으로,
재현 절차와 증거 및 심각도를 함께 보고한다.
```
