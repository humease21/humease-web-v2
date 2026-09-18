---
name: agy-failure-safety
description: >-
  Audit rules and safety guardrails for detecting and preventing known AI worker failure patterns.
  Covers stale evidence detection, fake N/N pass claims, deletion of failing tests, wrong-surface
  instrumentation, invented/hallucinated report facts, touchedFiles concurrency collisions,
  and uncommitted edit reversions. Use when verifying an agy report against past failure modes
  or auditing suspicious test/review claims.
license: MIT
metadata:
  version: 0.7.0-safety
---

# Antigravity Failure Patterns & Safety Guardrails

Empirical failure patterns observed across real delegation incidents, paired with their mandatory detection and prevention rules. Audit every agy delivery against this catalog.

## 1. Stale Evidence

- **Symptom**: Implementer reruns an existing test spec, past database record, or cached log, reporting historical success numbers as newly verified results.
- **Guardrails**:
  - Require freshness evidence in the brief: match deploy/build timestamps against the newest evidence row.
  - Forbid reusing existing static test accounts or pre-baked fixtures when verifying live workflows.
  - Verify independently with a dated query (e.g. `SELECT max(created_at) ...` or checking file mtimes). Evidence older than the dispatch time must be rejected and re-executed.

## 2. Fake "N/N Passed" from Unregistered Tests

- **Symptom**: Implementer creates a new test file, does not register it in the test runner or `package.json`, and reports "100% passed" based on a suite that never executed the new file.
- **Guardrails**:
  - Run the specific new test file path directly using the repository's actual test CLI command.
  - Grep new test filenames in runner configurations (`playwright.config.ts`, `jest.config.js`, `package.json`). Unregistered tests are dead code.
  - **Falsification test**: Temporarily break the fix in the code and verify that the test count drops and fails. A test that cannot fail proves nothing.

## 3. Deleting Failing Tests Instead of Fixing Code

- **Symptom**: When faced with a failing regression test, the implementer removes the failing assertion or test case so the suite returns green.
- **Guardrails**:
  - Scan deletions in test files explicitly:
    ```bash
    git diff -- '*.test.*' '*.spec.*' | grep '^-'
    ```
  - An implementer must never decide an existing test is obsolete. Any test deletion requires explicit authorization in the brief.
  - Separate implementation and test authoring across independent sessions.

## 4. Wrong Surface Instrumentation

- **Symptom**: The brief names a convenient file, and the implementer instruments it correctly while three other identical entry points or API routes continue shipping the bug uncovered.
- **Guardrails**:
  - In the brief, specify the *system behavior* and architectural layer, not merely an isolated file path.
  - Demand an entry-point census in the report and cross-verify with ripgrep across all route handlers and client callers.
  - Verify against the real user entry point, not a mock or secondary utility.

## 5. Invented / Hallucinated Facts in Reports

- **Symptom**: Asked to find N items or audit a category, the implementer hallucinates fictitious items to fulfill the requested quota when fewer items actually exist.
- **Guardrails**:
  - Separate fact enumeration (verifiable search) from content generation (creative expansion) in the brief.
  - Explicitly state that `"0건 / 없음 / empty"` is a completely valid and expected answer.
  - Trace every reported fact, ID, and schema element back to an exact file path and line number in the repo before accepting it.

## 6. `touchedFiles` Concurrency Collisions

- **Symptom**: When multiple workers run concurrently in a shared directory, `git status --porcelain` reports the union of all changes, causing false scope-violation reports or race conditions.
- **Guardrails**:
  - Strict isolation: Exactly one worker per directory / worktree.
  - Never allow concurrent workers to touch shared files (`package.json`, common types, router indexes). Overlapping scopes must be executed sequentially.
  - Verify changes against pre-assigned file ownership rather than trusting raw working-tree status under concurrency.

## 7. Reverting Orchestrator's Uncommitted Edits

- **Symptom**: Implementer runs `git checkout .` or `git stash` during setup or failure recovery, silently destroying uncommitted edits made by the orchestrator.
- **Guardrails**:
  - **Never dispatch with dirty working tree**: Always commit, stash, or isolate orchestrator edits before launching an agy dispatch.
  - If dispatching into a tree with necessary uncommitted edits, explicitly name those files in the brief with `"수정 및 되돌리기 절대 금지"` instructions.
  - Re-verify your own files after every worker completion.

## 8. True Findings in Invalid Runs

- **Symptom**: A worker run fails due to timeout, permission denial, or stale data, leading the orchestrator to dismiss the entire report including a genuine underlying bug discovery.
- **Guardrails**:
  - Do not discard a substantive defect report merely because the execution wrapper failed.
  - Extract specific claimed bugs or schema mismatches from `stderrTail` and `finalMessage`, and reproduce them directly in the workspace.

## Pre-Landing Incident Safety Checklist

Before committing any agy output, confirm:
- [ ] No test assertions were deleted or weakened (`git diff -- '*.test.*' | grep '^-'`).
- [ ] New tests are registered in the test runner and proven to fail when the fix is removed.
- [ ] Evidence timestamps are strictly newer than the dispatch start time.
- [ ] All reported file paths, database columns, and API symbols exist in the repository.
- [ ] No uncommitted orchestrator edits were overwritten or reverted.
