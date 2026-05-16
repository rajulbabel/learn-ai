# Section 12 Milestone 4 Lessons (executed 2026-05-17)

What M4 taught us that M5-M6 should bake in.

## What worked

- **Direct execution (no Task tool available)** worked cleanly when the plan is well-specified. The autonomous overnight runner did not expose the `Task` tool, so subagent dispatch was not possible. The M3 lessons #5 recovery pattern (controller commits manually from clean tree) generalized to "controller is the implementer when no subagent is available". TDD discipline held: tests written first, scoped vitest run to confirm failure, implementation written, tests confirmed passing, Chrome visual validation, scope check, commit.

- **Plan typo pre-correction in test prompts paid off again.** M3 lessons #1 flagged forward-ref regex typos. M4 plan had `/12\.22|multi-hop/i` for 12.23 sub=4 (should be `/12\.25|multi-hop/i`), `/12\.28-12\.32|RAGAS/i` for 12.24 sub=4 (should be `/12\.31-12\.35|RAGAS/i`), `/12\.33-12\.37|framework choice/i` for 12.29 sub=5 (should be `/12\.36-12\.40|framework choice/i`), and `/12\.20/` for 12.30 sub=1 & sub=3 lost-in-middle (should be `/12\.23/`). All four corrected inline in the implementer prompts before writing tests. Zero false-failure cycles.

- **`PromptTemplateBlock` helper reused across 4 chapters.** Extracted as a shared component near the top of `rag-generation.jsx`. Pattern: `padding 16, borderRadius 8, background ${color}06, border 1px solid ${color}12`, inner `<pre>` with monospace font + tinted background. CitationsRefusal had 4 templates, MultiHopRetrieval had 1, AgenticRAG had 1, ContextPacking inlined one (since it's the chapter that introduces packing). Reusing the helper kept the 4 templates visually consistent.

- **Module-level data constants made the chapters quick to read AND quick to spec-update.** Every chapter exports its data arrays at module top (CP_BUDGET_SEGMENTS, LITM_CURVE_POINTS, MH_HOPS, SR_TIMELINE, CRAG_SCORED_DOCS, GRAG_NODES, AR_TOOLS, LCR_METRICS, etc.). Made spec changes a one-edit operation and made render code under each function shorter than the data definitions, which keeps the visual rules legible at the call site.

- **15-node GraphRAG corpus drawn programmatically, reused 3 times.** The same `renderGraph(highlightSet, useCommunityColors, descText)` helper function was called 3 times in 12.28 (sub=2 plain, sub=3 with subgraph highlight, sub=4 with community colors). Single layout source, three views. Reused-helper pattern from rag-retrieval.jsx (MiniMeter etc.) generalizes well.

- **Chrome visual gate caught the worktree-server confusion.** The dev server contested between the main learn-ai server (port 5173) and a stale worktree server at `.claude/worktrees/section13/` (port 5174). The browser tab silently switched to 5174 after a vite restart, leading to stale page content. Caught via the URL field in the tab context output ("localhost:5174" instead of expected 5173). Fix: `mcp__claude-in-chrome__navigate` back to 5173. Future: shut down stray worktree dev servers before starting visual gates.

- **The sub=20 + reload trick** for forcing all sub-steps visible while validating remains the right pattern. localStorage `learn-ai-nav` key with `ch: <chapter_idx>, sub: 20, fingerprint: <full-fingerprint>` then `location.reload()` lands directly on the target chapter with everything revealed. Auto-loaded fingerprint from a prior load works as long as it matches `chapters.map(c => c.id).join(",")`.

## What broke or wasted time

- **No `Task` tool in autonomous overnight runner.** The starter prompt assumed `subagent-driven-development`, but the deferred-tool list did not include the Task tool. ToolSearch for `select:Task` returned no match. Recovery: execute the plan directly with controller-as-implementer (TDD discipline preserved). Lost ~3 minutes investigating tool availability before falling back. M5+ starter prompts should explicitly note "if Task is unavailable, controller executes directly with full TDD discipline; the subagent two-stage review is replaced by self-review + Chrome visual gate".

- **Pre-existing flake on `learn-ai-prefetch.test.jsx`** still recurs even without coverage flag. The full-suite run failed it twice in M4 (once at baseline, once after final search-index rebuild). Re-running scoped passes immediately. Per M3 lessons, this is acknowledged debt. Suggest: either a `vi.useFakeTimers()` fix in the test, or move it into a separate suite with `retry: 2`.

- **`npx vitest run` without `--exclude='.claude/**'` picked up `.claude/worktrees/section13/` test files** in the section13 worktree. Forgot the exclude on one early run; got phantom failures. Then remembered M3 lessons #11. Always use the M3 scoped vitest pattern.

- **Vite preview never spawned during build.** Run `npm run build` while the dev server was also up, and a worktree vite (port 5174) had been auto-started earlier by the `.claude/worktrees/section13/` setup. The browser tab switched to that worktree server, leading to a visual gate against stale code briefly. Fix: navigate the Chrome tab back to the correct port (5173) explicitly. Future: lessons should note "stray dev servers on adjacent ports are a real risk in worktree-using setups; check `ps aux | grep vite` before any visual gate sweep".

- **`<>` fragment without key inside `.map()` did NOT trigger a React warning in vitest output** as expected. Initially noticed in ContextPacking sub=0 table where I wrapped 3 T elements with `<>` per row. Switched to `.flatMap()` returning an array of T elements with their own keys, which is the cleaner React idiom. No regression.

## Patterns that worked better than spec said

- **Inside-cell title-case with monospace body for tool/token cards.** Self-RAG sub=1 (4 token cards), Self-RAG sub=4 critique table, AgenticRAG sub=0 (4 tool cards), and CRAG sub=0 (3 scored docs) all used the same pattern: outer card title in title-case via `T bold center`, inner data line in monospace via `fontFamily: "ui-monospace, monospace"`. Especially useful when the inner data is a literal token like `<retrieve>` or a function call like `tool_call(...)`.

- **Loop-back arrow via inline `<path>` with `M ... L ... L ... L`** for the multi-hop control loop (12.25 sub=2) and the agentic tool-call loop (12.29 sub=2). Cleaner than computing intermediate `<line>` segments. The path's `M x y L x y L x y` syntax with `fill="none"` + `stroke` gives a clean L-shaped looping arrow that visually communicates "this comes back".

- **15-node force-layout style positioning, hand-laid.** Force layout libraries weren't an option (no new deps). Hand-laying 15 nodes in 3 community clusters (top, middle, bottom bands) with internal horizontal spread produced a clean readable graph. The intentional clustering made the sub=4 community-colored view immediately legible without a separate layout.

- **Per-doc table with KEEP/DROP badges in monospace** for CRAG strip decomposition (12.27 sub=4) and Self-RAG isrel critique (12.26 sub=4). Both used a 3-column grid with the badge column in monospace + bold + verdict-color, which makes the categorical outcome pop visually.

## Recommended M5 plan tightenings

1. **Add a "Task tool may be unavailable" note** to M5 plan. If autonomous runner mode doesn't expose Task, controller executes directly with TDD + visual gate + scope binding. Same quality bar, fewer dispatches.

2. **Bake corpus references explicitly** in any chapter that uses a non-default corpus (M5 evaluation chapters may use the support corpus exclusively, but if any switch happens, mention it in sub=0 like 12.28 and 12.30 did).

3. **Pre-proofread plan test regex** for forward-chapter refs. M3-style. M4 had 4 typos in plan; M5 should be audited before execution begins.

4. **Verify worktree dev servers before visual gate.** Before running Chrome MCP, run `ps aux | grep vite` and ensure only the intended dev server (port 5173) is up. Stale worktree vite processes silently steal browser focus.

5. **Helper-hub pattern.** `PromptTemplateBlock` in `rag-generation.jsx` is a near-clone of patterns already in `rag-retrieval.jsx` (e.g., the styled monospace blocks in HyDE, MultiQueryExpansion). M5 might benefit from extracting these into `components.jsx` (single source of truth) IF M5 also uses them. Otherwise leave them per-file.

6. **Don't sweep prettier across the repo.** Stay scoped: only the 4 M4 files. M2-era format drift in the rest of the tree is acknowledged debt; widening the prettier sweep would create commit noise.

7. **The pre-push hook auto-rebuilds search index** ONLY when pushing. In autonomous mode (no push), run `npm run search:index && npm run search:embed` manually at Task 15-16 boundary. Commit artifacts as a separate "Rebuild search index" commit so the diff is reviewable.

## Things M2/M3 plans got right that M5+ should keep

- Per-chapter strict scope binding with `**Files:**` list + `git diff --stat` gate before commit. Zero scope violations across M4.
- Module-level data constants pattern documented in chapter task templates.
- Forbidden-word list (em-dash, "architect", "Habuild", "Next chapter:") quoted in every implementer prompt verbatim.
- Cross-file dependency map (lookup.test.js + sections.test.jsx spread requirements). Caught one cross-file gap automatically when sections.test.jsx generic test failed after Task 4 - Task 5 fixed it cleanly.
- Chapter-range reference table.
- Plan Rule 11 (within-section signposts allowed) verbatim in both implementer and reviewer prompts. Zero false flags on "covered in chapter 12.X" forward refs in M4.
- Scoped vitest + scoped prettier + `.prettierignore` for `src/data/`.

## Known debts going into M5

- `encoder-decoder-diagrams.jsx` lines 59, 1242, 1976 still uncovered (pre-existing, untouched M3 and M4). Pre-existing global coverage gap remains at 98.65% branches / 99.92% lines.
- `vite.config.js` threshold (100/100) doesn't match CLAUDE.md (97.7% branches) - coverage check fails on global but new code is clean.
- `learn-ai-prefetch.test.jsx` still occasionally flaky (timing-sensitive in jsdom).
- M2-era format drift in many files (`learn-ai.jsx`, `road-to-transformers.jsx`, `vector-compression.jsx`, `vector-production.jsx`, etc.) untouched. Not M4's job. A future cleanup could run `npx prettier --write src/`.
- Stale worktree dev server on port 5174 (`.claude/worktrees/section13/`). Should be shut down once the section13 work is integrated, but isn't this milestone's job.
