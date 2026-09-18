---
name: agy-review-verify
description: >-
  Review, verification, and landing standards for agy-produced changes. Covers independent gate
  re-execution, diff inspection against the brief, mandatory compile checks, test authenticity
  verification, schema/migration validation, dangling reference greps, the implementer sweep,
  and commit/landing boundaries. Use when an agy run completes and needs diff review, gate verification,
  or landing into git.
license: MIT
metadata:
  version: 0.7.0-review
---

# Antigravity Review & Verification

Standards and checklists for reviewing, validating, and landing code produced by `agy`.

## 0. Scope the Review Depth First (2026-09-03, 저토큰 운영 구조 개선)

Not every clean PASS needs the full 9-point sweep — running it unconditionally on every trivial
task is exactly the "큰 context × 불필요한 다중 turn" this update targets. Decide depth before reading the diff:

**Full verification required** (run everything in §2~§6 below) when ANY of:
- Touches DB schema, migrations, RLS, or payment/auth code.
- This is a retry after a previous failure on the same task (§ agy-failure-safety applies).
- The self-report lacks concrete evidence (no real command output, vague "모두 정상" claims).
- The diff is large, cross-cutting, or touches files outside the brief's stated scope.
- The brief itself was flagged high-risk.

**Minimal evidence check suffices** (re-run the real gate commands + confirm the diff matches the
brief's file scope; skip the 9-point sweep and the dangling-reference grep) when: the brief was a
simple bounded unit, this is the first attempt, the self-report includes real command output, and
the diff is small and scoped exactly to the brief's paths.

When in doubt, do the full pass — this only trims the obviously-safe, obviously-small cases.

## 1. The Review Imperative: Distrust Self-Reports

Antigravity did the typing; the orchestrator owns the engineering judgment.
- Never trust `result.json`'s self-reported "N/N passed" or claims of correctness without independent verification.
- Verify against reality by reading the actual diff and executing gate commands yourself.

## 2. Gate Re-Execution & Mandatory Compile Check

1. **Re-run real gates yourself**: Execute the project's actual lint, test, and typecheck commands in the working tree. Passing gates is necessary, but not sufficient.
2. **Never drop the compile check**:
   - Always run `tsc --noEmit` / `cargo check` / `go build` across the workspace.
   - Large file edits can truncate or corrupt mid-output while still producing a plausible-looking diff. A clean compilation check confirms syntactic and type integrity.

## 3. Test Authenticity First

Inspect test diffs **before** running or trusting test suites:
- **Unbriefed test edits**: Any unrequested modification to existing test files is a contract change, not part of a fix.
- **Deleted, skipped, or commented-out assertions**: Check `git diff -- '*.test.*' | grep '^-'`. If an implementer removed or disabled an assertion, treat the test as failing.
- **Loosened assertions**: Reject changes that replace exact equality checks with truthy/contains checks or broadened tolerances.

## 4. Diff Inspection against Brief

Read `git diff` and `git status` (using `touchedFiles` as an initial checklist):
- **Scope creep**: Did the implementer edit files, configs, or routes outside the brief's designated paths?
- **Scope shortfall**: Did it fulfill all edge cases, null guards, and cleanups described in the brief?
- **Quiet judgment calls**: Did it introduce unrequested architectural abstractions or third-party libraries?

## 5. Specialized Verification Checklists

- **Database schema & migrations**:
  - Verify every referenced column and table exists in the target DB schema.
  - Round-trip test migrations and verify RLS grants (`GRANT ALL ON public.<tbl> TO anon, authenticated`).
- **Removals and renames**:
  - Grep the entire repository for dangling references, stale imports, or obsolete mock registrations.
- **Stateful behaviors**:
  - Exercise real dynamic behaviors instead of relying solely on static compilation.

## 6. The Implementer Sweep

Walk this 9-point sweep across every diff before landing:
1. **Hardcoded success / stubs**: Mocked return values or fake fixture data on production execution paths.
2. **Catch-all error suppression**: Empty `catch {}` blocks or default fallbacks that conceal real runtime crashes.
3. **Unverified API signatures**: Methods, imports, or SDK options not present in the installed dependency version.
4. **Dead weight**: Unused helper functions, orphan types, or leftover scaffolding comments.
5. **Duplicate paradigms**: Introducing a secondary logging, HTTP, or client wrapper alongside an existing one.
6. **Internal assertion tests**: New tests that assert internal private state rather than observable interface behavior.
7. **Near-duplicate test bodies**: Multiple test blocks varying by only a single literal value.
8. **Speculative surface**: Uncalled config parameters, generic helper abstractions with zero callers.
9. **Impossible guards**: Defensive checks on unreachable branches that distract from real trust boundaries.

## 7. Commit & Landing Boundary

- **The orchestrator commits**: The implementer edits the working tree; the orchestrator commits. The implementer must never commit.
- **Working tree is authoritative**: Between dispatch and commit, the working tree is the only copy of the implementer's work. Never execute `git checkout .`, `git reset`, or `git clean` without inspecting `git status`, `git diff`, and untracked (`??`) files first.
- **Rework cycle**: If review reveals flaws, do not restate the entire brief. Dispatch a delta brief using `--resume-last` to continue the same conversation context:
  ```bash
  echo "The fix is right, but remove the unused import and use the real fixture." | node ".claude/skills/agy-delegate/scripts/relay.mjs" --resume-last --cd /path/to/repo
  ```

## 8. Authorization & Human Surfacing

- **Surface, don't absorb**: Report implementer design decisions, unprompted refactors, and non-blocking nitpicks to the human.
- **Stop for scope changes**: If completing the task requires modifying architectural boundaries or files outside the agreed scope, pause and consult the human.

## References

- Detailed review protocols: [.claude/skills/agy-delegate/references/review-and-land.md](../agy-delegate/references/review-and-land.md)
