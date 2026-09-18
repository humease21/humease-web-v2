---
name: agy-delegate
description: >-
  Core orchestrator entry point for delegating coding tasks to the Google Antigravity CLI (agy).
  Defines role boundaries, delegation criteria, brief requirements, common prohibitions, and routing
  to specialized sub-skills (agy-dispatch-runtime, agy-review-verify, agy-failure-safety). Use when
  initiating an agy delegation workflow or drafting an implementer brief.
license: MIT
compatibility: Requires agy CLI installed and authenticated, Node 18+, and git.
metadata:
  version: 0.8.0-core
---

# Antigravity Delegate (Core)

You are the **orchestrator**. You write the brief, control the boundaries, and own the engineering judgment. The **implementer** (`agy`) works in its own separate conversation without shared context. You verify and commit all changes.

## 1. When to Delegate

- **Delegate**: Bounded implementation tasks (5~10 min units), repetitive refactors, component scaffolding, and Playwright E2E QA execution.
- **Do NOT Delegate**:
  - Trivial tasks small enough to perform inline.
  - Architectural design or requirements decomposition (handled by orchestrator / Codex Sol).
  - Unauthenticated environments (`agy help` or `agy models` fails).
  - High-risk multi-module schema or production changes requiring human signoff.

## 1-A. Pre-Flight Check (run once, before creating a worktree or dispatching)

Missing environment causes a dispatch to fail deep into a run, burning a full timeout window before
the gap is discovered. Run this once per session before the first worktree/dispatch, not per task:

```bash
command -v agy >/dev/null && echo "agy: OK" || echo "agy: MISSING (check PATH, e.g. /home/home/.local/bin/agy)"
test -f "<repo-root>/.claude/skills/agy-delegate/scripts/relay.mjs" && echo "relay: OK" || echo "relay: MISSING"
test -f "<repo-root>/.env.local" && echo ".env.local: OK" || echo ".env.local: MISSING"
```

If any check fails, stop and fix the environment before creating a worktree — do not dispatch and
discover it via a failed/empty `result.json`.

## 2. Brief Essentials

Every brief must be self-contained and specify:
1. **Concrete Goal & Target Files**: Exact existing paths. Never guess paths.
2. **Untouched Boundaries**: Explicitly list files/modules that must remain untouched.
3. **Real Gate Commands**: Specify exact project commands (e.g. `npm run test:e2e`, `tsc --noEmit`). Never say "run tests" vaguely.
4. **Action Safety**: Forbid `git add`, `git commit`, or deleting tests. Leave edits uncommitted.
5. **Report Contract**: Demand structured output (`What changed`, `Files touched`, `Gate outcomes`).

## 3. Common Invariants & Prohibitions

- **Worker never commits**: The implementer edits the working tree; the orchestrator commits.
- **Premises freeze at dispatch**: The implementer cannot be steered mid-run. If requirements change, terminate and re-dispatch.
- **No blind retries**: If a task fails or times out, inspect the working tree first. Do not repeat the identical brief.
- **Self-reports are unproven**: Green gate claims in `finalMessage` are claims, not proof.

## 4. Specialized Sub-Skill Routing

Consult specialized sub-skills only when performing their specific stage of the workflow:

| Workflow Stage | Sub-Skill | When to Use |
| --- | --- | --- |
| **Launch & Monitor** | **`agy-dispatch-runtime`** | Constructing `relay.mjs` commands, tuning timeouts, configuring `--cd` / `--model` / `--sandbox`, managing `--dangerously-skip-permissions`, background monitoring, interpreting `result.json`, and worktree isolation. |
| **Review & Land** | **`agy-review-verify`** | Inspecting diffs against brief, re-running real gate commands, executing mandatory compile checks, verifying test authenticity, schema/migration validation, the 9-point implementer sweep, and committing. |
| **Incident Defense** | **`agy-failure-safety`** | Auditing worker output against known incident patterns: stale evidence, fake N/N passes, deleted tests, wrong surface coverage, invented facts, concurrency collisions, and silent git reverts. |

## References

- Brief authoring guide & templates: [references/writing-the-brief.md](references/writing-the-brief.md)
- Multi-task queue sequencing: [references/multi-task-queues.md](references/multi-task-queues.md)
