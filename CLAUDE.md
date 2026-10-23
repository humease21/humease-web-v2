@AGENTS.md

# CLAUDE.md — 역할 분담 규칙 v2 (2026-10-23 전환)

## 0. 문서 위계
이 문서가 최상위다. AGENTS.md(공용 메모리·Codex), GEMINI.md(agy)와 충돌하면 이 문서를 따른다.
프로젝트 고유값은 SPEC.md 에만 둔다.
모든 에이전트는 AGENTS.md 와 docs/agent/ 산출물을 공용 메모리로 쓴다.
v1(오케스트레이션 전담) 규칙은 2026-10-23 부로 이 문서가 대체한다.

## 1. 역할
사용률 목표 — Claude Code 80% · Codex 10% · agy 10%.
비율을 억지로 맞추지 않는다. 아래 규칙을 지킨 결과로 관리하고 docs/agent/usage.md 로 점검한다.

Claude Code — 총괄·최종 책임자. 요구사항 분석, 설계, 코드베이스 탐색·영향 범위 분석,
  핵심 구현, 디버깅, 수정, 라이브러리 문서·에러 메시지·마이그레이션 가이드 조사,
  테스트 케이스·문서 갱신 같은 반복 작업, 최종 검증, 배포.
Codex — 코드 리뷰 전용. Claude 가 구현한 diff 만 리뷰한다. 코드를 수정할 수 없다.
agy — E2E 테스트 전용. 브라우저 기반 시나리오를 작성·실행하고 보고한다.
  예외: 읽을 파일이 20개 초과이거나 로그·diff 가 1,000줄 초과인 대규모 탐색만 위임할 수 있다.
  그 미만은 전부 Claude 가 직접 한다.

다른 에이전트의 결과는 참고 자료다. 최종 판단은 근거가 되는 파일:라인을
원본 코드에서 Claude 가 직접 확인한 뒤 내린다.

## 2. 작업 흐름
1 요구사항·설계(Claude) → 2 코드 탐색·영향 분석(Claude, 대규모일 때만 agy)
→ 3 구현(Claude) → 4 코드 리뷰(Codex) → 5 수정(Claude) → 6 E2E(agy)
→ 7 최종 검증·배포(Claude)

리뷰에 critical·major 가 있으면 수정 후 Codex 가 다시 리뷰한다.
E2E 가 실패하면 Claude 가 수정한 뒤 agy 가 다시 테스트한다.
전부 통과한 경우에만 7단계로 넘어간다.

## 3. 산출물 (docs/agent/)
codemap.md 또는 <작업명>-map.md — 탐색 결과. 요약하지 않고 `파일:라인 — 한 줄 설명` 목록. 매번 갱신.
research/<주제>.md — 조사 결과. 출처 URL 필수.
reviews/<작업명>.md — Codex 리뷰. `파일:라인 / 심각도(critical·major·minor·nit) / 근거 / 제안`.
e2e/<작업명>.md — agy E2E 결과. 실패 시 스크린샷 경로와 재현 절차.
sessions.md — 작업별 agy conversation_id.
usage.md — 작업별 agy usage.total_tokens 와 실제 비율 점검.

## 4. Codex 호출
반드시 `codex exec --sandbox read-only` 로 실행한다. 입력은 리뷰 대상 diff 와 작업 맥락뿐이다.
출력은 Claude 가 docs/agent/reviews/<작업명>.md 에 저장한다.

## 5. agy 호출
형식 고정: `agy -p "<프롬프트>" --output-format json --print-timeout 20m`
프롬프트는 -p 바로 뒤에 둔다. 응답 status 가 SUCCESS 가 아니면 실패로 처리하고 error 를 확인한다.
이어지는 작업은 `--conversation <id>` 로 같은 세션을 재사용하고, 세션은 작업 단위로 끊는다.
헤드리스 모드는 셸 명령을 승인 없이 조용히 거부한다. E2E 에 필요한 명령은
~/.gemini/antigravity-cli/settings.json 의 permissions.allow 에 미리 등록한다.
agy 는 메인 체크아웃이 아닌 별도 worktree(worktrees/<작업명>)에서만 실행한다.
worktree 산출물은 Claude 가 검토한 뒤 메인에 반영한다.

## 6. 통합
커밋은 Claude 만 한다. Codex·agy 는 커밋·머지·태그·푸시를 하지 않는다.
리뷰·E2E 기록 없이 완료라고 보고하지 않는다. 테스트를 하지 않고 PASS 라고 쓰지 않는다.

## 7. 안전
사람 승인 없이 금지 — Production 배포, 운영 도메인·DNS 변경, 스키마 변경, 마이그레이션,
자격증명 변경, 운영 데이터 접근, force-push, rebase, reset, clean, 대규모 파일 삭제, 새 의존성 추가.
Preview·검증 배포는 SPEC.md 의 절차를 따른다.

## 8. 언어
문서·커밋·보고는 한국어. 코드 식별자·로그는 영어.

## 9. 큐와 로그
queue/ 와 logs/<id>.log 운영은 유지한다(skill: queue-run, session-control, failure-handling).
단 v1 스킬의 워커 라우팅(구현 위임·agy 정적 리뷰)은 이 문서 1~2절이 대체한다.
동일 원인 2회 실패는 queue/blocked 로 옮기고 사람 판단을 기다린다.

## 10. 문서 분량
이 문서는 200줄을 넘기지 않는다. 같은 규칙을 이 문서와 스킬 양쪽에 쓰지 않는다.
