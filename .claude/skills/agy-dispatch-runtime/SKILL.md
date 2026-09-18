---
name: agy-dispatch-runtime
description: >-
  Execution and runtime mechanics for dispatching briefs to agy via relay.mjs. Covers CLI command
  syntax, flags (--cd, --model, --sandbox, --resume-last, --dangerously-skip-permissions), timeout
  budgeting, background polling, result.json schema, failure artifact recovery, and concurrency/worktree
  isolation. Use when ready to run a brief through relay.mjs or diagnose a failed/hung agy dispatch.
license: MIT
metadata:
  version: 0.7.0-runtime
---

# Antigravity Dispatch & Runtime

Mechanics of launching, monitoring, and interpreting `agy` runs through the relay layer.

## 1. Dispatch Command & Flags

Dispatch briefs to `agy --print` using the relay script:

```bash
node ".claude/skills/agy-delegate/scripts/relay.mjs" --brief brief.txt --cd /path/to/repo
```

### Supported Flags

| Flag | Purpose | Default / Behavior |
| --- | --- | --- |
| `--brief <file>` | Path to brief file. If omitted, reads brief from stdin. | Required (or stdin) |
| `--cd <dir>` | Working directory for Antigravity. | Current working directory |
| `--model <name>` | Specific model label from `agy models`. | Antigravity default model |
| `--sandbox` | Enables Antigravity's terminal sandbox. | Disabled |
| `--dangerously-skip-permissions` | Auto-approves tool permission prompts. | Disabled (requires explicit human approval) |
| `--new-project` | Starts a fresh Antigravity project without prior context. | Default for fresh runs |
| `--resume-last` | Resumes the most recent conversation; pass delta brief only. | Disabled |
| `--conversation <id>` | Resumes a specific conversation ID; pass delta brief only. | Disabled |
| `--print-timeout <dur>` | Timeout applied by agy itself in print mode. | `30m` (Project rule: `7m`) |
| `--timeout <dur>` | Relay watchdog timeout; kills process tree on expiry. | `--print-timeout` + 60s grace (Project rule: `8m`) |
| `--add-dir <dir>` | Adds extra workspace directory (repeatable). | `--cd` repo added automatically |
| `--out-dir <dir>` | Artifact directory for logs and `result.json`. | System temporary directory |

## 2. Permission & Sandbox Policy

- **No `--read-only` flag exists**: Passing `--read-only` fails with `unknown option`. Enforce read-only policy in the brief text ("파일 수정·커밋·배포 금지. 조사 결과만 보고한다.") and verify with `git status --short` afterward.
- **Headless write auto-denial**: Without `--dangerously-skip-permissions`, headless runs that attempt file writes or bash commands auto-deny and terminate with empty output.
- **Human approval required**: Use `--dangerously-skip-permissions` only with explicit human approval for each dispatch. Keep brief scope strictly bounded to specific paths.
- **Sandbox combination**: Combining `--sandbox` with `--dangerously-skip-permissions` removes the enforced boundary; treat that combination as full system access.

## 3. Timeout Budgeting (10-Minute Rule)

- Standard dispatch timeout: `--print-timeout 7m --timeout 8m` (CLAUDE.md §3 10-minute rule; spec.md `dispatch_command` overrides).
- A single brief must be scoped to complete within 10 minutes of active work.
- If a browser QA scenario list or complex refactor cannot be completed within 10 minutes, split the brief into sequential atomic tasks before dispatching, not after.

## 4. Execution & Monitoring

- **Claude Code**: Run the command with `run_in_background: true`. The orchestrator receives a notification upon process termination, then inspects `result.json`.
- **Completion condition**: A run is finished only when the process exits and `<out-dir>/result.json` is written. Do not rely on interim console progress lines.

## 5. `result.json` Contract & Failure Recovery

The output JSON file contains:
- `status`: `"completed"` | `"failed"` | `"timeout"` | `"aborted"` | `"agy_unavailable"`
- `exitCode`: Process exit code (`0` for clean run, non-zero for errors).
- `finalMessage`: Implementer's stdout response text.
- `touchedFiles`: Array of `git status --porcelain` lines in the working root (`[]` = clean, `null` = git check unavailable).
- `stderrTail`: Last ~20 stderr lines (crucial for diagnosing failures, permission denials, or timeouts).
- `briefPath`, `finalPath`, `logPath`, `stderrPath`: Exact artifact file locations.

### Failure Diagnostics

- **`status: "failed"` ≠ nothing produced**: A timeout or error terminates the conversation, but uncommitted edits made before the crash remain in the working tree. Always inspect `touchedFiles` and `git status` before re-dispatching.
- **`status: timeout`**: Watchdog terminated the run. Check whether work was partially applied. Do not blindly increase timeout; split the brief or resume via `--resume-last`.
- **`status: agy_unavailable` (exit 127)**: `agy` binary not found on PATH or unauthenticated.
- **Empty `finalMessage` with file edits**: Check `touchedFiles` and diff directly; the implementer may have completed code changes but failed to format the closing report.

## 6. Concurrency & Worktree Isolation

- **One worker per directory**: Never dispatch multiple concurrent workers into the same directory or branch.
- **Worktree isolation**: When running parallel tasks, assign each worker to a separate isolated `git worktree` (`.worktrees/<task>`).
- **Shared files**: Tasks touching shared files (`package.json`, shared types, central configs) must run sequentially, never in parallel.

## References

- Detailed flag specifications & schemas: [.claude/skills/agy-delegate/references/dispatch-and-poll.md](../agy-delegate/references/dispatch-and-poll.md)
