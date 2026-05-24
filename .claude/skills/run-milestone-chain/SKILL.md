---
name: run-milestone-chain
description: Autonomously execute a chain of learn-ai milestone starter prompts. Dispatches one fresh opus background agent per milestone (simulating manual fresh-session-paste flow), waits for completion notification, advances to next. Use when running multiple milestones unattended overnight.
user-invocable: true
allowed-tools: Read, Write, Bash, Agent, ToolSearch, ScheduleWakeup, PushNotification, SendUserFile, TaskGet, TaskOutput
---

# Run Milestone Chain

Autonomously chains milestones M{start} through M{end} of a learn-ai section by dispatching one fresh opus background agent per milestone. Mirrors the manual flow: clear session → paste starter prompt → execute milestone → milestone writes next starter → repeat.

## Arguments

`$ARGUMENTS` = `<section> <start> <end>` (three integers separated by spaces).

Examples:
- `13 3 6` — section 13, milestones M3 through M6
- `12 4 6` — section 12, milestones M4 through M6

If `$ARGUMENTS` is not exactly three integers, ABORT immediately with the exact reason.

---

## Pre-flight checks (ABORT on any failure, no auto-fix)

Run ALL pre-flight checks before dispatching anything. On any failure: print the exact failing condition and STOP. Do NOT attempt to construct missing files. Do NOT clean dirty trees.

### PF1. Validate args
- Section ∈ {12, 13}.
- 1 ≤ start ≤ end ≤ 6.

### PF2. Validate cwd
Run `pwd`. Required match:
- section == 13 → cwd is exactly `/Users/rajul/learn-ai/.claude/worktrees/section13`
- section == 12 → cwd is exactly `/Users/rajul/learn-ai`

Abort with: `CWD mismatch: expected <expected>, got <pwd>`.

### PF3. Validate git
- `git rev-parse --abbrev-ref HEAD` must be:
  - sec13 → `worktree-section13`
  - sec12 → `main`
- `git status --porcelain` must be empty OR contain ONLY untracked entries under `.claude/` (worktrees, skills, settings — all meta-tooling, harmless to chapter work). Tracked-but-modified files anywhere are NOT allowed; untracked files outside `.claude/` are NOT allowed.
- Abort with: `wrong branch` or `dirty tree: <git status output>`.

### PF4. Validate Chrome MCP
- Load `mcp__claude-in-chrome__list_connected_browsers` via ToolSearch (`select:mcp__claude-in-chrome__list_connected_browsers`).
- Call it. Must return ≥1 browser with `isLocal: true`.
- Abort with: `Chrome MCP not connected — open Chrome with the extension`.

### PF5. Ensure caffeinate
- `pgrep -x caffeinate >/dev/null || nohup caffeinate -dimsu > /dev/null 2>&1 &`
- Do NOT abort if it was missing — just launch. Log the action.

### PF6. Ensure dev server
- Port: sec12 → 5173, sec13 → 5174.
- IMPORTANT: do NOT chain the curl check with `&&` to anything else. `curl` returns nonzero exit code (e.g. 7 for connection refused) when the server is not running; that is the EXPECTED case that triggers the auto-launch path. Run the curl in isolation and capture only its HTTP-code output.
- Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/learn-ai/ || echo 000`
- If the captured code is `200`: server is up, proceed.
- If anything else (`000`, `404`, etc.):
  - `nohup npm run dev -- --port <port> > /tmp/dev-<port>.log 2>&1 &`
  - Sleep 10s, then re-curl in isolation.
  - If still not `200`: ABORT with `dev server failed to start on port <port>; see /tmp/dev-<port>.log`.

### PF7. Pre-confirm starter file for M{start}
- Path: `docs/superpowers/starter-prompts/section-<section>-m<start>-starter.md`
- If missing: poll every 300 seconds (5 minutes) using Bash `[ -f <path> ] && echo found || echo waiting`. Max wait 21600 seconds (6 hours). On each poll log `waiting for starter file <path>... attempt N of 72`.
- On timeout: ABORT with `Starter file never appeared: <path>` and send `PushNotification` with the same message.

### PF8. Print pre-flight summary
One block to chat:
```
Pre-flight OK
  section: <N>
  range: M<start>..M<end>
  cwd: <pwd>
  branch: <branch>
  port: <port>
  browser: <deviceId>
  caffeinate: <launched|already running>
  starter for M<start>: present
```

---

## Main loop

For each milestone M from `start` to `end` inclusive:

### Step A. Read starter file
- Path: `docs/superpowers/starter-prompts/section-<section>-m<M>-starter.md`
- For M > start, file may not yet exist (created by prior milestone agent). Poll as in PF7 (5-min interval, 6-hour cap). On timeout: ABORT + PushNotification.
- Read the file. The starter content is inside the first fenced ``` ``` block — extract its contents. If no fenced block, treat entire file body (after frontmatter, if any) as the starter.

### Step B. Build wrapped prompt
Prepend this preamble (verbatim, substituting `<CWD>` and `<PORT>`) to the extracted starter content:

```
ultrathink
use superpowers

You are running autonomously overnight. The user is asleep. No human intervention is possible until they wake.

Working directory (cd here as your FIRST shell command): <CWD>
All relative paths in the starter prompt below resolve under this directory.

The ORIGINAL STARTER PROMPT below is your primary instruction set — follow every rule it contains (subagent-driven-development, TDD, Chrome visual gate, two-stage review, helper-hub imports, forbid `npm run format`, unique-matcher discipline, opus everywhere, etc.). The "Operational rules" below are SUPPLEMENTARY overnight-safety constraints, not replacements.

Operational rules (HARD — violations abort the milestone):
- DO NOT push to remote. No `git push` under any circumstance.
- DO NOT merge branches.
- DO NOT use `--no-verify`, `--force`, `git reset --hard`, `git clean`, or any destructive op.
- Chrome MCP tools (mcp__claude-in-chrome__*) are deferred. Load via ToolSearch (`select:<name>`) before calling.
- A dev server is already running on http://localhost:<PORT>/learn-ai/. Reuse it. Do NOT start a second one.
- For Chrome visual gate, use the sub=20 + localStorage fingerprint trick documented in prior milestone lessons.
- If a chapter task fails after 3 subagent retries, document the issue inline and skip to the next chapter. Abort the milestone only after 3 consecutive chapter failures.
- All subagents you dispatch MUST be opus (`model: "opus"`). YOU are also opus.
- All subagents you dispatch MUST run at maximum thinking budget. PREPEND the literal token `ultrathink` as the very first line of every subagent prompt (chapter implementers, reviewers, fixers — all of them). No exceptions. This propagates max-effort reasoning down the dispatch tree.
- The starter's Task 0 "set session title" is N/A in autonomous mode — there is no interactive session to title. Skip it explicitly (do NOT fail because /title is unavailable). All other plan tasks remain mandatory.
- After completing every plan task (including the final "Plan Refinement Checkpoint" task that writes next milestone's starter prompt and the lessons file): your FINAL reply MUST be EXACTLY ONE LINE matching one of:
    DONE m<M> lastCommit=<sha> nextStarter=<path-or-NONE>
    FAIL m<M> reason=<short-description> lastCommit=<sha>
  No other text. No markdown. No trailing newline characters beyond the line itself.

------ BEGIN ORIGINAL STARTER PROMPT ------
```

Append the extracted starter content verbatim, then append:

```
------ END ORIGINAL STARTER PROMPT ------
```

### Step C. Dispatch agent in background

Call `Agent` with:
- `subagent_type`: `general-purpose`
- `model`: `opus`
- `description`: `Sec<section> M<M> autonomous`
- `prompt`: the wrapped prompt
- `run_in_background`: `true`

Record the returned task id as `current_task_id`.

Log to chat: `Dispatched sec<section> M<M> as task <id>. Waiting for completion notification.`

### Step D. Wait for completion
Do NOT poll. Background agents send a notification on completion that re-invokes you with the result.

Set ONE safety-net `ScheduleWakeup` for 3600 seconds with reason `heartbeat sec<section> m<M>` and a prompt that re-invokes this skill in continuation mode (see "Resumption" below).

When the agent completes (you will receive a task-completion notification) OR the heartbeat wakes you: proceed to Step E.

### Step E. Read result + classify
- Read the agent's output via `TaskOutput(task_id=current_task_id, block=false)` (final transcript).
- Extract the LAST non-empty line.
- Match against the two patterns:
  - `^DONE m<M> lastCommit=([a-f0-9]+) nextStarter=(.+)$` → success
  - `^FAIL m<M> reason=(.+) lastCommit=([a-f0-9]+)$` → failure
- If neither matches: treat as failure with reason `malformed final line: <last-line>`.

### Step F. On success
- Verify `git status --porcelain` is clean (only `.claude/worktrees/` untracked allowed).
- If dirty: send PushNotification `sec<section> M<M> left dirty tree` and ABORT.
- Verify `git rev-parse HEAD` matches the reported `lastCommit` prefix. If mismatch: PushNotification and ABORT.
- If M < end: verify `nextStarter` path exists. If not: PushNotification `M<M+1> starter missing despite DONE` and ABORT.
- Log: `M<M> complete. lastCommit=<sha>. nextStarter=<path>.`
- Continue loop with M+1.

### Step G. On failure
- Send `PushNotification(message="FAIL sec<section> M<M>: <reason>")`.
- Capture last 200 lines of agent transcript via `TaskOutput` for post-mortem; write to `/tmp/milestone-chain-sec<section>-fail-m<M>.log`.
- ABORT loop. Do NOT attempt M+1.

---

## Post-loop (only reached if all milestones in range succeeded)

1. Locate screenshot directory written by the last milestone — typically `docs/superpowers/screenshots/section-<section>-m<end>/`. If it exists, list the files via `Bash` (`ls -1 <dir>`). If non-empty, send the manifest via `SendUserFile` with status `proactive` and caption `Sec<section> M<start>..M<end> screenshots`.
2. Send `PushNotification(message="Sec<section> M<start>..M<end> complete. Final commit <sha>. Review on wake.")`.
3. Print one-line chat summary: `DONE sec<section> M<start>..M<end>. <num_milestones> milestones, final commit <sha>.`
4. Skill exits.

---

## Resumption (heartbeat wake)

If the 3600s `ScheduleWakeup` fires (notification was missed or agent stuck):

1. Call `TaskGet(taskId=current_task_id)` to check status.
2. If status is `completed`: proceed to Step E.
3. If status is `in_progress`:
   - If runtime so far < 4 hours: re-arm heartbeat (`ScheduleWakeup` 3600s) and continue waiting.
   - If runtime ≥ 4 hours: presumed stuck. `TaskStop(task_id=current_task_id)`. Send `PushNotification(message="sec<section> M<M> stuck >4h, killed")`. ABORT.
4. If status is `failed` or unknown: treat as Step G failure.

---

## Hard rules

- Never construct a missing starter file. Wait or abort.
- Never construct a missing lessons file. Wait or abort.
- Never push, merge, force, or destruct.
- Never run a second dev server on the chosen port.
- Never invoke another instance of this skill.
- Never modify `src/` directly — that's the dispatched agent's job.
- Never proceed past a milestone whose `DONE` line is malformed.

## Per-run log

Write a tail-friendly log of skill actions (pre-flight results, each dispatch, each completion, classifications) to:
`/tmp/milestone-chain-sec<section>-m<start>-m<end>.log`

Append-only. Useful for post-mortem on wake.
