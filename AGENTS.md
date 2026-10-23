<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- 아래부터는 오케스트레이션 킷(queue-run) 규칙이다. 원래 별도 저장소
     (Humease-homepage-v2)에 있던 것을 이 저장소로 통합했다(2026-09-19).
     위 Next.js 블록은 `next dev` 가 관리하니 그대로 두고 손대지 않는다. -->

# AGENTS.md — 공용 메모리 · Codex 리뷰어 규칙 v2 (2026-10-23)

> 모든 에이전트(Claude·Codex·agy)의 공용 메모리다. docs/agent/ 산출물도 함께 참조한다.
> 상위 규칙은 CLAUDE.md 다. 충돌하면 CLAUDE.md 를 따른다.
> 프로젝트 스택·컨벤션·실행 명령은 SPEC.md 에 있다.

## 공용 메모리 위치
docs/agent/codemap.md, docs/agent/<작업명>-map.md — 코드 지도(파일:라인 — 설명)
docs/agent/research/ — 조사 결과와 출처 URL
docs/agent/reviews/ — Codex 리뷰
docs/agent/e2e/ — agy E2E 결과
docs/agent/sessions.md, docs/agent/usage.md — agy 세션·토큰 기록

## Codex 역할 — 코드 리뷰 전용
`codex exec --sandbox read-only` 로만 실행된다. 코드를 수정하지 않는다.
Claude 가 구현한 변경분(diff)만 리뷰한다. 범위 밖 코드는 리뷰하지 않는다.
요청하지 않은 리팩터링 제안은 nit 이하로만 적는다.

## 리뷰 기준
완료 조건 충족, 범위 밖 변경 없음, 버그·회귀, 엣지케이스 방어,
접근성·SEO 계약 훼손, 미완성 구현·하드코딩 스텁·TODO 잔존, SPEC.md 규약 준수.
빈 diff 나 무관한 변경은 critical 이다.

## 리뷰 출력 형식
지적 한 건당 한 줄:
`파일:라인 / 심각도(critical·major·minor·nit) / 근거 / 제안`
마지막 줄에 `VERDICT: pass` 또는 `VERDICT: fail`.
critical·major 가 하나라도 있으면 fail 이다.

## 금지
파일 수정·생성, 커밋·머지·태그·푸시, .git 조작, 운영 환경 접근, 의존성 추가.
규칙 파일 자체를 수정하지 않는다.

## 언어
리뷰 본문은 한국어. 코드 식별자는 영어.
