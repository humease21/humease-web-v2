# G2 리디자인 시각 QA 결과

- 실행: 2026-09-06 / Asia/Seoul
- 대상: https://humease21.github.io/humease-web-v2/ (커밋 `885428f`)
- 범위: **시각 레이어 전면 재설계.** 콘텐츠·라우팅·SEO·정적 Export·문의 구조·도메인 계획 무변경

## 1. FAIL 기준 5개 — 12페이지 전부 통과

지시된 실패 조건을 자동 검사로 만들어 매 배포마다 돌린다(`tests/design-qa.mjs`).

| 기준 | 검사 방법 | 결과 |
|---|---|---|
| 이미지가 카드 안에 갇힘 | 이미지 상위 3세대에 `border-radius ≥ 8px` + border/overflow 래퍼가 있고 폭이 뷰포트 92% 미만인 경우 | **0건** |
| 일반 IT 템플릿처럼 보임 | 동일 클래스의 rounded+border 블록이 3회 이상 반복 | **0건** |
| 한 화면에 정보가 너무 많음 | 첫 뷰포트 안 텍스트 420자 초과 | **0건** |
| 보라색 AI SaaS 느낌 | 배경·그라디언트에서 B가 R·G보다 크게 우세한 색 2건 초과 | **0건** |
| Hero 높이 미달 | 홈 첫 섹션이 88svh 미만 | **94svh 충족** |

## 2. 반응형 — 5개 뷰포트

1920×1080 · 1440×900 · 768 · 390 · 320 에서 6개 대표 페이지 검사. **가로 넘침 0건.**
증거: `docs/reports/evidence/redesign/` 35장.

## 3. 기능·라우팅·SEO 회귀 — 13/13 PASS

리디자인 전과 동일 기준으로 재실행했다.

공개 12개 라우트 200 · 진짜 404 · H1 1개/페이지 · title·canonical 각 12종 고유 ·
sitemap 12건 · axe WCAG 2.1 AA 위반 0 · skip link · 200% 확대 · 모바일 메뉴 키보드·Escape·포커스 복귀 ·
모바일 Hero desktop 미요청 · 4xx/5xx 0 · 클라이언트 번들 비밀 노출 0 · Vite 잔재 0

## 4. 성능 — 리디자인 후 재측정

로컬 프로덕션 빌드(gzip, basePath 없음 = 도메인 전환 후 조건) 5회 중앙값.

| 지표 | 리디자인 전 | 리디자인 후 | 목표 |
|---|---|---|---|
| Performance | 98 | **93** | 90 PASS |
| Accessibility | 100 | **100** | 95 PASS |
| Best Practices | 100 | **100** | 95 PASS |
| SEO | 100 | **100** | 95 PASS |
| LCP | 2,272ms | 3,141ms | — |
| CLS | 0.000 | **0.000** | — |
| TBT | — | 119ms | — |
| 전송량 | 319KB | 352KB | 1.5MB 이하 |

Performance 98 → 93 은 full-bleed Hero 가 화면 전체를 덮으면서 LCP 이미지가 커진 결과다.
목표 90 은 유지하며 CLS 는 0을 유지했다. 개별 실행 92/98/93/92/98.

## 5. 리디자인 중 잡은 회귀 3건

**승인 카피 2건 누락 (CRITICAL).** 시각 재설계 과정에서 공용 컴포넌트가 페이지 전용 문구를 덮어썼다.
`verify-copy` 가 잡았다.
- P02 `/about` — "Enterprise IT와 데이터 컴플라이언스에 대한 실무 경험을 바탕으로 설계와 구현을 지원합니다."
- P08 `/ai-services` — "부모님과 자연스럽게 대화하고 일상을 돕는 경험을 통해 가족의 연결을 지원하는 AI 서비스를 준비합니다."

**검수 스크립트 오탐 (자체 결함).** lazy 이미지가 뷰포트 밖일 때 `naturalWidth 0` 을 로드 실패로 오판했다.
스크롤 후 `document.images.every(i => i.complete)` 를 명시적으로 기다리도록 고쳤다.
고정 대기 시간에 의존하면 긴 페이지에서 재발한다.

## 6. 접근성·모션

- `prefers-reduced-motion: reduce` 에서 모든 `[data-reveal]` 이 즉시 최종 상태가 되고
  `DataTransition` 은 두 메시지를 동시에 정적으로 보여준다. 장면 이해에 애니메이션이 필요 없다.
- 스크롤 하이재킹 없음. sticky 장면 안에서 진행도만 읽고 스크롤을 가로채지 않는다.
- 모션은 760~900ms `cubic-bezier(0.16, 0.84, 0.3, 1)`. bounce·shake·파티클·커서 트레일·자동재생 없음.
- 모션 라이브러리를 추가하지 않았다. IntersectionObserver 와 CSS 트랜지션만 사용한다.
- 모바일 메뉴를 body portal 로 옮겨 헤더 `backdrop-filter` 가 `position:fixed` 의
  containing block 을 만드는 문제를 원천 차단했다.

## 7. 대표님 판단이 필요한 항목

자동 검사는 "템플릿처럼 보이지 않는다"를 구조적으로만 확인한다. **인상·품격은 육안 판단 영역이다.**
`docs/reports/evidence/redesign/` 의 1920·1440·768·390·320 스크린샷으로 확인 부탁드린다.

`docs/reports/QA_REQUEST.md` 의 미해결 항목(이미지 매핑 시각 확인, 회사 정보, 경력 문구 승인,
실기기 확인, 문의·정책·관리자·도메인 전환 승인)은 이번 리디자인으로 바뀌지 않았다.
