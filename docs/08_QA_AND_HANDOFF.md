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
