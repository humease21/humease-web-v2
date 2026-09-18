# 부트스트랩 — 신규 프로젝트 1회 실행

킷을 새 리포에 복사한 직후 **1회만** 실행한다. 완료 보고 후 이 파일은 삭제한다.

## 0. 대전제

- **새 규칙을 창작하지 마라.** 여기 적힌 절차만 수행한다.
- 규칙의 출처는 `CLAUDE.md` 와 `.claude/skills/` 다섯 스킬이다. 이 문서는 초기화 절차만 담는다.
- 프로젝트 고유값은 `spec.md` 에만 둔다. 규칙 문서에 옮겨 적지 않는다.
- 판단이 애매하면 만들지 말고 **물어라.**
- 전체 파일 출력 금지. 생성·변경·검증 결과만 보고하라.

## 1단계 — 킷 파일 확인

아래 12개가 있어야 한다. 하나라도 없으면 멈추고 보고하라.

```
CLAUDE.md
AGENTS.md
GEMINI.md
spec.template.md
.gitignore
add-process.md                                  헤더 줄만 있는 빈 인박스
.claude/skills/queue-run/SKILL.md
.claude/skills/session-control/SKILL.md
.claude/skills/gate-route/SKILL.md
.claude/skills/delegate-run/SKILL.md
.claude/skills/failure-handling/SKILL.md
.claude/skills/triage-notes/SKILL.md
```

**킷이 오염됐는지부터 본다.** 킷 문서가 이전 프로젝트 원문인 채로 복사되는 사고가
실제로 있었다. 6단계 검증을 **여기서 미리 1회 실행**하고, 걸리는 것이 있으면
착수하지 말고 보고하라. 스스로 고치지 마라 — 킷 교체본을 받아야 한다.

**있으면 안 되는 것.** 발견하면 목록으로 보고하고 삭제 여부를 물어라.

- `add-process.archive.md` — `triage-notes` 가 첫 아카이브 때 만든다. 미리 있으면 규칙 위반이다.
- 위 12개와 `spec.md`·이 파일 외의 루트 `.md` — 이전 프로젝트 아카이브·계획서일 수 있다.
- `.claude/skills/` 안의 킷 6종 외 스킬 — 목록으로 보고하고 존치 여부를 물어라.
- 에이전트 런타임 상태 디렉터리(`.omc/`, `.claude/logs/` 등)가 `.claude/skills/` **안에**
  있으면 이전 세션 잔존물이다. 삭제한다.

## 2단계 — spec.md 확인

`spec.md` 는 사람이 리포 루트에 올린다. 추측해서 만들지 마라.

**없으면 `spec.template.md` 를 가리키며 요청하라** — "`spec.template.md` 를 `spec.md` 로
복사해 채워달라" 고 한 줄로 요청하고, 3단계까지만 진행한 뒤 멈춘다.

있으면 `CLAUDE.md §10` 필수 항목이 채워졌는지 확인한다. `<>` 가 남아 있으면 미기재다.

1. `dispatch_command` — 워커 실행 명령. **타임아웃 플래그 포함 여부를 반드시 확인한다.**
   타임아웃이 없으면 10분 룰을 판정할 수 없으므로 미기재로 취급한다.
2. 모델·노력도 라우팅
3. `verify_typecheck` / `verify_lint` / `verify_test`
4. 코딩 규약
5. 보고 채널 — 비어 있으면 "대화로 보고" 로 확정하고 진행
6. 배포 명령·대상 — 비어 있으면 "배포하지 않는다" 로 확정하고 진행
7. 운영 데이터 접근 범위

빠진 항목은 목록으로 물어라. 3·4·7번이 비었다고 임의값을 넣지 마라.
아직 코드가 없는 신규 리포라 3번이 "해당 없음" 이면 그대로 진행하되,
5단계 스모크에서 게이트 명령을 생략한 사유로 로그에 남긴다.

## 3단계 — 저장소·폴더 골격

### 3-1. git 저장소 확인

```bash
git rev-parse --is-inside-work-tree 2>/dev/null || echo "NOT A REPO"
```

저장소가 아니면 **승인을 받고** `git init` 한다. 승인 없이 초기화하지 않는다.
`git init` 은 7단계 커밋의 전제다. 저장소가 아닌 채로 5단계까지 가면
"워커가 커밋하지 않았을 것" 을 검증할 방법이 없다.

### 3-2. 폴더 골격

Git 은 빈 디렉터리를 추적하지 않으므로 `.gitkeep` 이 반드시 필요하다.

```bash
mkdir -p queue/{todo,doing,review,qa,done,failed,blocked} logs
for d in queue/*/ logs/; do touch "$d.gitkeep"; done
```

확인 — 8개가 나와야 한다. `git status --short` 는 새 디렉터리를 한 줄로 접으므로
`--untracked-files=all` 없이는 `.gitkeep` 이 보이지 않는다.

```bash
git status --short --untracked-files=all | grep -c gitkeep    # 8
```

### 3-3. .gitignore 확인

킷 `.gitignore` 에 에이전트 런타임 산출물(`.omc/` 등)과 워커 결과물(`result.json`)이
들어 있는지 확인한다. 프로젝트 스택에 맞는 항목 추가는 사람에게 물어본다.

## 4단계 — 워커 컨텍스트 로딩 확인

- **Codex** 는 전역 `~/.codex/AGENTS.md` → 프로젝트 `AGENTS.md` 순으로 자동 로드한다.
  `CLAUDE.md` 는 기본으로 읽지 않는다. 로드 합계 32 KiB 제한이 있다.
- **agy** 는 워크스페이스 루트의 `GEMINI.md` 와 `AGENTS.md` 를 **둘 다** 자동 로드하고
  전역 `~/.gemini/GEMINI.md` 도 읽는다.
- 전역 파일에 이전 프로젝트 규칙이 남아 있는지 확인해 **보고만** 하라.
  전역 파일 수정은 사람 승인 사항이다.

확인 방법 — 각 워커를 `spec.md` 의 `dispatch_command` 로 1회 호출해
"지금 로드된 지침 파일의 절대 경로만 나열하라. 파일을 수정하지 마라" 고 지시하고
결과를 보고한다. 이 호출에도 `dispatch_command` 의 타임아웃이 그대로 적용된다.

이 호출이 실패하면 `dispatch_command` 가 틀린 것이다. 스모크로 넘어가지 말고
`spec.md` 를 고쳐달라고 보고하라.

## 5단계 — 스모크 테스트 1건

`queue/todo/000-smoke.md` 에 사소한 작업 1건을 올리고 정상 흐름 그대로 통과시켜라.
목적은 코드 검증이 아니라 **파이프라인이 실제로 도는지** 확인하는 것이다.

작업 내용은 `README.md` 에 한 줄 추가로 한다. `README.md` 가 없으면 생성이 곧 작업이다.

확인할 것.

- `todo → doing → review → qa → done` 이동이 실제로 일어날 것
- `logs/000-smoke.log` 가 생성될 것
- 게이트 3종을 Claude 가 **직접 실행**하고 명령·출력을 로그에 남길 것.
  `spec.md` 에서 "해당 없음" 이면 생략 사유를 로그에 남길 것
- 동적 QA 는 문서 변경이므로 생략하고, **생략 사유를 로그에 남길 것**
- 구현자와 정적 리뷰어가 다른 주체일 것
- 워커가 커밋하지 않았을 것 — `git log` 로 확인한다

실패하면 원인만 보고하고 멈춰라. 자동 재시도 하지 마라.
통과하면 스모크 산출물(`README.md` 변경)은 되돌리고 큐 파일은 `queue/done/` 에 남긴다.

## 6단계 — 검증

앞의 네 개는 결과가 **비어 있어야 한다.** 검사 대상은 킷 문서로 한정한다 —
이 파일과 `spec.md`·`add-process.md` 를 대상에 넣으면 자기 자신이 검출된다.

```bash
KIT="CLAUDE.md AGENTS.md GEMINI.md \
.claude/skills/queue-run/SKILL.md .claude/skills/session-control/SKILL.md \
.claude/skills/gate-route/SKILL.md \
.claude/skills/delegate-run/SKILL.md .claude/skills/failure-handling/SKILL.md \
.claude/skills/triage-notes/SKILL.md"

# A. 구 큐 어휘 — 폴더 위치로만 상태를 표현해야 한다
grep -n "requests/\|_done\|_failed\|_blocked\|_dashboard" $KIT

# B. 절대경로·URL — 이전 프로젝트 잔존물의 가장 확실한 신호
grep -nE "/(mnt|home|Users)/|[A-Z]:\\\\|https?://" $KIT

# C. 프로젝트 고유값 하드코딩 — 전부 spec.md 로 가야 한다
grep -nE "print-timeout|--timeout|--model|npm |npx |yarn |pnpm " $KIT

# D. 폐기 표시 없는 tmux 절차
grep -n "tmux" $KIT
```

추가 확인.

```bash
wc -l CLAUDE.md AGENTS.md GEMINI.md      # 각 200줄 이하
ls -d queue/{todo,doing,review,qa,done,failed,blocked} logs
```

- `/skills` 에 `queue-run`, `session-control`, `gate-route`, `delegate-run`,
  `failure-handling`, `triage-notes` 6종이 보이는지 확인한다. 보이지 않으면 프론트매터가 깨진 것이다 —
  `SKILL.md` 첫 줄이 정확히 `---` 인지, `name` 과 `description` 이 있는지 본다.
- `CLAUDE.md §9` 가 가리키는 스킬 이름과 실제 디렉터리 이름이 일치하는지 확인한다.

## 7단계 — 커밋

커밋은 Claude 만 한다. 이 파일은 곧 삭제되므로 커밋 대상에서 뺀다.
`spec.template.md` 는 킷 파일이고 `CLAUDE.md §10` 이 참조하므로 커밋한다.

```
[규칙] 신규 프로젝트 부트스트랩
```

`push`·배포·마이그레이션은 사람 승인 없이 하지 않는다.

## 마지막 보고

목록으로 한 번에 보고하라.

- 누락된 킷 파일, 삭제한 파일, 존치 여부를 물어야 할 파일
- 1단계 사전 검증 결과 — 킷 오염 여부
- `spec.md` 미기재 항목
- `git init` 수행 여부와 `.gitkeep` 8개 인식 결과
- 워커별로 실제 로드된 지침 파일 경로, 전역 파일 잔존 규칙
- 스모크 테스트 결과와 게이트 로그, QA 생략 사유
- 6단계 검사 A~D 결과 전부
- 판단하지 못한 항목은 `add-process.md` 에 `(1회)` 로 적고 보고
- 보고 후 이 파일 삭제 여부 확인 요청
