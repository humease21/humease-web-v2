# Codex 리뷰 — redesign-b2b-uiux

## 1차 시도 (2026-10-23)
- 명령: `codex exec --sandbox read-only -o … "<리뷰 브리프>" < /dev/null`
- 결과: **실행 실패** — `ERROR: You've hit your usage limit … try again at 2:09 PM.`
- 첫 시도는 stdin 대기("Reading additional input from stdin...")로 멈춰 종료했고, `< /dev/null` 로 재실행했다.
- 리뷰 판정 없음. 리셋 이후 재요청한다.

## 1차 리뷰 (2026-10-23 14:10, 대상 `git diff 7ccd7e9`) — VERDICT: fail

| 파일:라인 | 심각도 | 근거 | 제안 | Claude 원본 확인 | 조치 |
|---|---|---|---|---|---|
| src/components/interactive/MobileNav.tsx:49 | major | aria-modal="true" 이지만 포커스 트랩·배경 inert 가 없어 Shift+Tab·마지막 링크 Tab 으로 가려진 본문에 포커스가 이동한다 | showModal() 사용 또는 포커스 순환·배경 inert | 확인 — 패널만 portal 되고 본문은 그대로 탐색 가능했다 | 열린 동안 패널 밖 body 자식 `inert`, 닫힐 때 해제 후 열기 버튼으로 포커스 복귀(사용자가 닫은 경우만) |
| src/components/interactive/MobileNav.tsx:23 (NavDropdown.tsx:23 동일) | minor | 경로 변경 시 openedAt 이 초기화되지 않아 뒤로→앞으로 이동하면 메뉴가 재개방된다 | 경로 변경 시 열림 상태 초기화 | 확인 — openedAt 이 이전 경로 값을 유지 | boolean open + 렌더 중 경로 변경 감지(seenPath)로 닫힘 |

## 2차 리뷰 (2026-10-23 14:2x) — VERDICT: fail

1차 지적 2건은 해소로 판단(추가 지적 없음).

| 파일:라인 | 심각도 | 근거 | 제안 | Claude 원본 확인 | 조치 |
|---|---|---|---|---|---|
| src/components/interactive/MobileNav.tsx:62 | major | 메뉴를 연 채 너비가 1024px 이상이 되면 패널만 lg:hidden 으로 숨고 open 이 유지돼 본문 inert·스크롤 잠금이 남는다 | matchMedia 로 데스크톱 전환 감지 시 닫기 + E2E | 확인 — 1차 조치(inert)가 만든 회귀 | 열린 동안 `(min-width: 1024px)` change 이벤트에서 닫아 effect 정리(inert·overflow 해제) 실행 |

## 3차 리뷰 (2026-10-23) — VERDICT: pass

| 파일:라인 | 심각도 | 근거 | 제안 | 조치 |
|---|---|---|---|---|
| tests/e2e/redesign.spec.ts:214 | minor | 1024px 전환 후 inert·overflow 해제, 각 닫힘 경로의 잠금 해제·포커스 복귀를 E2E 가 검증하지 않는다 | E2E 추가 | agy 에 폭 전환·닫힘 경로 시나리오 추가 요청 |

3차 이후 변경: agy E2E 2차에서 Shift+Tab 포커스 이탈(실제 결함) 발견 → MobileNav 에 Tab/Shift+Tab 포커스 순환 추가. 4차 리뷰 대상.

## 4차 리뷰 (2026-10-23) — VERDICT: pass

대상: MobileNav 포커스 순환·폭 전환 닫기·inert 원복, NavDropdown 경로 변경 닫기. 지적 없음.
Codex 사용 토큰(4차): 21,922.

## 5차 리뷰 (2026-10-23) — VERDICT: pass

대상: Arctera 관계 고지 띠 제거(하단 SourceNotes·FAQ 고지는 유지), AI 포트폴리오 서비스 화면 캡처 썸네일.

| 파일:라인 | 심각도 | 근거 | 제안 | 조치 |
|---|---|---|---|---|
| src/content/portfolio.ts:150 | minor | 캡처를 쓰는 HairAI·내친구 케이 visualType 이 'none', AnyBuild 가 'brand-image' 로 남아 표시 이미지와 메타데이터 불일치 | 'product-capture' 로 맞춤 | 세 프로젝트 visualType → 'product-capture' |

Codex 사용 토큰(5차): 56,283. 검증: E2E 스위트(agy 작성) Claude 재실행 30 pass / 3 skip, axe 0건, verify 10종 + entities PASS.

## 6차 (2026-10-24) — 맘이음 썸네일·회사정보 카드 제거·대표자 성명 제거
대상: assets.ts, portfolio.ts, company.ts, about/page.tsx, privacy/page.tsx, portfolio 캡처 4장
- 지적 사항 없음. 타입 검사와 변경 파일 ESLint 통과.
VERDICT: pass
