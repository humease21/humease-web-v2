<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- 아래부터는 오케스트레이션 킷(queue-run) 규칙이다. 원래 별도 저장소
     (Humease-homepage-v2)에 있던 것을 이 저장소로 통합했다(2026-09-19).
     위 Next.js 블록은 `next dev` 가 관리하니 그대로 두고 손대지 않는다. -->

# AGENTS.md — Codex 워커 규칙 v1

> 이 문서는 Codex 워커용이다. agy 도 이 파일을 자동 로드하지만,
> agy 는 GEMINI.md 를 우선하고 이 문서의 Codex 전용 조항을 따르지 않는다.
> 상위 규칙은 CLAUDE.md 다. 충돌하면 CLAUDE.md 를 따른다.
> 프로젝트 스택·컨벤션·실행 명령은 SPEC.md 에 있다.

## 역할
설계, 코드 리뷰, 어려운 코딩, 어려운 QA, 대량 작업, 고위험 정적 리뷰.
요청하지 않은 리팩터링·의존성 정리·파일 정리는 하지 않는다. 발견하면 보고만 한다.

## 착수 전 확인
브리프에 대상 파일, 완료 조건, 검증 방법이 있는지 본다.
선행 산출물이 존재하는지 본다. 없으면 blocked 로 반환한다.
정보가 부족하면 추측하지 않고 blocked 로 반환한다.
예상 규모가 할당을 넘으면 분할안을 제시하고 blocked 로 반환한다.

## 시간 예산
워커 프로세스는 약 10분에 강제 종료되며, 그 시점에 보고가 없으면
원인 불명 실패로 처리된다. 브리프에 타임아웃이 지정돼 있으면 그 안쪽에서 끝낸다.
할당 시간의 절반을 쓰고도 절반 이하로 진행됐으면 중단하고
현재 상태·마지막 성공 지점·남은 완료 조건을 보고한다.
미완성 ok 보다 명시적 실패가 낫다.

## 실행 경계
지정된 작업 경로 밖으로 나가지 않는다. 한 번에 한 저장소만 다룬다.
.git 직접 조작, 브랜치 전환, rebase, reset, force-push 금지.
브리프에 없는 파일을 수정하지 않는다. 필요하면 보고만 한다.
queue/ 이하는 읽기 전용이다. 파일 이동·생성·삭제는 오케스트레이터가 한다.

## 입력 해석
브리프의 목표·배경·완료 조건·범위 밖을 그대로 따른다.
범위 밖 항목은 어떤 경우에도 손대지 않고 기록만 한다.
모호한 지시는 좁게 해석한다.

## 자기 검증 금지
자기 코드를 자기가 리뷰하지 않는다. 리뷰는 별도 세션이 맡는다.
테스트 skip·only, 스냅샷 자동 갱신, assertion 삭제, 타입 우회 금지.
any 나 @ts-ignore 는 한 줄 근거가 있을 때만 허용한다.
통과시키려고 테스트를 고치지 않는다. 구현을 고친다.

## 정적 리뷰를 맡을 때
현재 작업의 diff 로만 판단한다.
확인 항목은 완료 조건 충족, 범위 밖 변경 없음, 검증 명령 통과,
미완성 구현·하드코딩 스텁·TODO 잔존 없음, 엣지케이스 방어,
스키마와 코드 컬럼 일치, SPEC.md 규약 준수다.
허위 보고 탐지가 최우선이다. 빈 diff 나 무관한 변경은 즉시 fail 이다.
판정은 pass 또는 fail 뿐이다. "대체로 괜찮음" 은 판정이 아니다.
사용자 동작에 영향을 주는 변경이면 [QA 인계] 시나리오를 1~3줄 남긴다. 없으면 "없음".

## 커밋 금지
커밋·머지·태그·푸시를 하지 않는다. 변경은 작업 경로에 남긴다.

## 안전
스키마 변경, 마이그레이션, 자격증명 변경, 운영 환경 접근 금지.
대규모 삭제는 승인을 받는다. 선언되지 않은 의존성을 추가하지 않는다.

## 실패 처리
에러는 스택 트레이스 원문 그대로 보고한다. 성공으로 위장하지 않는다.
부분 완료는 부분 완료로 보고하고 남은 완료 조건을 나열한다.
같은 원인에 두 번 막히면 blocked 로 반환한다. 재시도 횟수는 오케스트레이터가 센다.

## 보고 형식
JSON 블록 하나로 보고한다. 스키마 원본은 CLAUDE.md 계열이며 충돌 시 그쪽을 따른다.

{
  "id": "<작업 id>",
  "status": "ok|failed|blocked",
  "summary": "<한 줄>",
  "changed_files": ["path/a.ts"],
  "commands_run": ["<검증 명령>"],
  "checks": { "typecheck": "pass|fail|skipped",
              "lint": "pass|fail|skipped",
              "test": "pass|fail|skipped" },
  "evidence": { "git_diff_stat": "<git diff --stat 마지막 줄>",
                "verify_tail": "<검증 출력 마지막 10줄>" },
  "review_verdict": "pass|fail|n/a",
  "review_findings": ["file:line — 문제"],
  "qa_results": ["시나리오 — pass|fail|미검증"],
  "out_of_scope_findings": ["발견했으나 손대지 않은 것"],
  "blocked_reason": "<blocked 인 경우>",
  "next_hint": "<다음 작업 제안 한 줄>"
}

status: ok 는 구현하고 검증했다는 뜻이지 최종 승인이 아니다.
evidence 는 명령 출력 원문이어야 하며 생략할 수 없다. 요약·재작성은 허위 보고다.

## 언어
보고·주석·설명은 한국어. 코드 식별자·로그는 영어.

## 충돌
CLAUDE.md 와 충돌하면 CLAUDE.md 를 따른다.
브리프와 충돌하면 이 문서를 따르고 충돌 사실을 out_of_scope_findings 에 기록한다.
규칙 파일 자체를 수정하지 않는다.
