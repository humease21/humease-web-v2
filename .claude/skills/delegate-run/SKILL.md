---
name: delegate-run
description: Codex·agy 디스패치 명령, 타임아웃 예산, 격리, 결과 스키마와 완료 판정 방법을 정의한다. 워커에 작업을 넘기거나 워커 결과를 판정할 때 사용한다.
disable-model-invocation: true
---

# 디스패치 실행

상위 규칙은 CLAUDE.md §1·§3·§6 이다. 큐 처리 절차는 `/queue-run` 에 있다.

## 워커 선택

난이도 판단은 Claude 가 한다.

| 성격 | 워커 |
|---|---|
| 설계, 코드 리뷰, 어려운 코딩, 어려운 QA, 대량 작업 | Codex |
| 10분 이내 단순 코딩·단순 QA, 리서치, 전수조사, 점검, 잡무 | agy |
| 30초 안에 끝나는 한 줄 수정 | Claude 직접 |

브리프 작성 비용이 작업보다 클 때만 직접이 이득이다. 애매하면 위임한다.
agy 가 5분 내 불가라고 판단해 blocked 로 반환하면 Codex 로 재라우팅한다.
재라우팅은 실패로 세지 않는다.

## 브리프 필수 포함 항목

워커는 CLAUDE.md 와 `.claude/skills/` 를 읽지 못한다(CLAUDE.md 전문).
따라서 아래를 브리프에 직접 적는다. 하나라도 빠지면 디스패치하지 않는다.

1. 작업 id
2. 목표 — 큐 파일에서 추출한 것
3. 대상 파일 목록과 정확한 경로
4. 완료 조건 — 판정 가능한 형태로
5. 범위 밖 — 손대면 안 되는 경로. "없음" 도 명시한다
6. 검증 방법 — `spec.md` 의 `verify_typecheck` / `verify_lint` / `verify_test` 원문
7. `spec.md` 의 코딩 규약 중 이 작업에 걸리는 항목 원문
8. 결과 보고 형식 — Codex 는 AGENTS.md 보고 스키마, agy 는 `result.json`
9. 금지 사항 — 커밋·머지·태그·푸시 금지, `queue/` 쓰기 금지

이 브리프가 곧 게이트 판정 기준이다. 브리프에 없는 것으로 fail 을 내지 않고,
브리프에 있는 것을 빠뜨린 결과를 pass 시키지 않는다.

## 명령과 모델

`dispatch_command` 와 용도별 모델·노력도는 `spec.md` 에만 있다(CLAUDE.md §10).
이 문서에 프로젝트 고유값을 적지 않는다. `spec.md` 에 없으면 디스패치하지 않고 되묻는다.

플래그 표기(모델 지정, 노력도 옵션 등)는 프로젝트에서 처음 쓸 때 1회
`<워커> --help` 로 실제 표기를 확인한다. 모델명 오타는 조용히 기본 모델로
폴백될 수 있어 판정을 오염시킨다. 확인 결과가 `spec.md` 와 다르면
`spec.md` 를 고치도록 사람에게 알린다. 스스로 고치지 않는다.

## 타임아웃

워커 프로세스는 약 10분에 강제 종료된다(CLAUDE.md §3). 그 시점에 결과가 없으면
원인 불명 실패다. 따라서 타임아웃은 그 안쪽에 둔다.

실제 플래그 표기와 값은 `spec.md` 의 `dispatch_command` 에 포함돼 있다.
이 문서에 적지 않는다. `dispatch_command` 에 타임아웃이 없으면 디스패치하지 않고
사람에게 되묻는다 — 타임아웃 없는 호출은 10분 룰을 판정 불가로 만든다.

지정된 타임아웃은 워커 호출 전부에 적용한다. 점검·확인용 1회 호출도 예외가 아니다.
타임아웃에 걸리면 재시도가 아니라 분해 실패다. 브리프를 다시 쪼갠다.
작업은 5분 내 완료를 전제로 분해한다. 미완성 ok 보다 명시적 실패가 낫다.

## 격리

동시에 2건 이상 디스패치할 때는 워커마다 별도 작업 경로를 준다.
같은 작업 디렉터리를 공유하면 빌드 캐시와 편집이 서로를 밟는다.
격리 방법(worktree 등)과 경로 규칙은 `spec.md` 를 따른다. 지정이 없으면
동시 디스패치를 하지 않고 순차로 처리한다.

## 완료 판정

- Codex — 브리프에 지정한 보고 스키마(AGENTS.md)의 JSON 블록 1개.
- agy — 작업 루트의 `result.json` 1개. 이 파일의 존재만이 완료 신호다.

화면 텍스트·pane 캡처·"끝난 것 같다" 는 판정이 아니다.
결과물이 없는 채로 프로세스가 끝났으면 원인 불명 실패로 처리한다.
`status=failed` 또는 타임아웃에서 자동 재시도하지 않는다 → `/failure-handling`.

종료 코드를 그대로 믿지 않는다. 강제 종료 경로에서 정상 종료로 기록되는
사례가 있다. 의심되면 로그와 산출물이 실제로 완결됐는지 함께 확인한다.

## 결과 스키마

워커 공통 필드다. 원본은 AGENTS.md · GEMINI.md 이며 충돌하면 그쪽을 따른다.

```json
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
  "qa_results": ["시나리오 — pass|fail|미검증"],
  "out_of_scope_findings": ["발견했으나 손대지 않은 것"],
  "blocked_reason": "<blocked 인 경우>",
  "next_hint": "<다음 작업 제안 한 줄>"
}
```

Codex 는 리뷰를 맡을 때 `review_verdict` 와 `review_findings` 를 더한다.
agy 는 모델 예외를 썼을 때 `model_exception_request` 를 더한다.

`status: ok` 는 구현하고 검증했다는 뜻이지 최종 승인이 아니다. 게이트는 별도다.
`evidence` 는 명령 출력 원문이어야 한다. 생략·요약·재작성은 허위 보고다.

## 결과 수령 시 확인

게이트를 태우기 전에 Claude 가 먼저 본다.

- `evidence` 가 원문인가. 요약문이면 그 자체로 허위 보고다 → `/failure-handling`.
- `changed_files` 와 실제 diff 가 일치하는가. `git diff --stat` 으로 대조한다.
- gitignore 대상 파일은 git 이 보고하지 않는다. 그런 산출물이 있으면
  사전 스냅샷과 대조해 확인한다.
- 빈 diff 이거나 브리프와 무관한 변경이면 즉시 fail 이다(CLAUDE.md §4).
- 워커가 커밋했는지 확인한다. 커밋했으면 규칙 위반이므로 fail 로 처리하고
  `logs/<id>.log` 에 기록한다(CLAUDE.md §6).

## 금지

- 워커에게 커밋·머지·태그·푸시를 시키지 않는다.
- 워커 자기보고만으로 완료 처리하지 않는다.
- 권한 우회 플래그는 건마다 사람 승인을 받는다. 설정의 허용 목록을 우회하지 않는다.
- CLAUDE.md §7 안전 항목을 브리프에 담지 않는다. 승인부터 받는다.
