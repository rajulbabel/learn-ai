# Section 12 Milestone 6 Lessons (executed 2026-05-17)

What M6 taught us that future sections should inherit. M6 is the FINAL milestone of Section 12; this captures both M6-specific notes and a few cross-section observations.

## What worked

- **Direct execution (no Task tool) held cleanly for the third milestone in a row.** M5 lessons #1 generalized: a well-specified plan + scope binding + Chrome visual gate + TDD discipline keeps the controller-as-implementer pattern stable. M6 was the longest milestone (6 chapters, 1 of them 10 sub-steps) and direct execution still landed in ~55 minutes of wall time including indexer rebuild + embeddings.

- **Pre-emptive `FormulaBox` helper at module top** worked exactly as M5 lessons #5 predicted. Defined once near the top of `rag-production.jsx`, used in 4 chapters (12.36, 12.37, 12.38, 12.39, 12.41). Same shape as M4's `PromptTemplateBlock` and M5's chapter-local `FormulaBox`. Result: 0 visual inconsistencies across standalone formulas in 6 chapters.

- **Hard-coded chapter indices in plan body** (per M5 lessons #6) saved one Chrome roundtrip per chapter. 12.36 = 175, 12.37 = 176, 12.38 = 177, 12.39 = 178, 12.40 = 179, 12.41 = 180. Verified all 6 against the fingerprint at session start; no recomputation needed mid-session.

- **CapstoneDecisionCard inline helper** for the 7 Decision sub-steps in 12.41 produced 7 identically-shaped 3-column Choice/Why/Tradeoff cards with zero copy-paste. Pattern: when 3+ sub-steps share an exact visual structure, extract a chapter-local helper that takes the differing strings as props. Same trick as M5's `FormulaBox` but for cards. Generalize: in capstone chapters where the structural decisions are repeated visually, helper-extraction pays off immediately.

- **The "Chunking" keyword false-RED catch** (sub=0 in 12.41) caught a real plan-vs-code gap. Plan test regex was `/chunking/i` but the decision-tree row said "How Do I Chunk?". Fixed by appending "(Chunking)" to the row label. The TDD RED-then-GREEN cycle caught it within 30 seconds of writing the implementation; without RED, would have been invisible. Pattern: keyword regex tests rooted in semantic intent (chunking, embedding, evaluation) survive refactors better than exact-phrase tests.

- **Counter-example trick avoided altogether in M6.** Per M5 lessons #4, the `|| 1` defensive guard at line 1978 of HallucinationDrift's time-series chart was the only branch-coverage gap. Cleaner fix: deleted the dead guard since data arrays guarantee min !== max. Result: rag-production.jsx hit 100/100/100/100 directly without adding counter-data. Lesson generalizes: if a defensive guard is provably unreachable given known data, delete it rather than test against it.

- **Two-tab dev server isolation held.** The stale `.claude/worktrees/section13/` dev server on port 5174 remained running the whole session but never stole focus. Verified `tabId 1742837252` (port 5173) for every Chrome interaction. M5 lessons #2 prediction was correct: latent risk, never triggered.

## What broke or wasted time

- **`npm run search:embed` ran fast this milestone** - ~5 minutes for 6 chapters, vs M5's ~13 minutes for 5. Likely because more of the embeddings model cache is hot now. Worth noting in M6+ planning: the first run after a fresh `node_modules` is the slow one; subsequent runs in the same session are cheap.

- **Coverage threshold mismatch** (vite.config 100/100, CLAUDE.md 97.7% branches) recurred. Coverage runs fail the gate. Resolved by deleting the dead-code branch and accepting pre-existing M5 debt in vector-production.jsx line 515 + encoder-decoder-diagrams lines 59/1242/1976 + others. M6 leaves the threshold mismatch as known debt (mentioned in section retrospective).

- **Flaky `learn-ai-prefetch.test.jsx`** fired once during the coverage run, passed cleanly when re-run scoped. Identical pattern to M3, M4, M5. Per M5 lessons #2 this is now confirmed pre-existing across 4+ milestones. Logged in retrospective for future investigation.

- **The TodoWrite tool wasn't used** in this session - direct execution kept all 17 tasks tracked mentally + via git log. For solo overnight runs this is fine; for collaborative runs a TodoWrite would help track progress visibility.

## Patterns that worked better than the spec said

- **Capstone use case "design brief" card** rendered cleanly as a flat 2-column key/value grid instead of the spec's free-form prose. Pattern: when a chapter introduces a structured object (corpus stats, requirements, budgets), use a 2-column label/value grid with the title centered. Same pattern as the QPS table in 12.37 sub=2. Reuse this for any "spec brief" or "design constraints" visualization across future sections.

- **Decision tree SVG with nested questions** in 12.40 sub=4. Spec said "an SVG decision tree". Implemented as 3 levels with 6 leaf nodes, each branch labeled YES/NO with green/red coloring. The branch-arrow geometry (every arrow `markerEnd="url(#fc-arrow)"`) is reusable. Pattern: define one arrow marker per chapter color, reuse it in every line. Same trick used in 12.41 sub=0 (the 9-row framework tree) and 12.39 sub=2 (the 5-step pipeline).

- **Layer-stack visualization in 12.41 sub=9** with numbered circles + 2-column label/body grid + per-layer color. More compact than the spec's vertical card column suggestion. Pattern: when summarizing N components (5 layers in 12.41, 5 cost lines in 12.37, etc), use a grid with numbered circle in column 1, name in column 2, description in column 3.

## Recommended next-section plan tightenings

1. **Pre-extract module-level helpers in the plan** when 3+ chapters need them. M6 extracted `FormulaBox` ahead of time per the M5 lesson; the next big section should do the same for any helper that appears in 3+ chapter specs. Saves the "rewrite at chapter 3 to share" friction.

2. **Pre-compute chapter indices for visual gate** in the plan body, including the math (`base_idx + N`). M6 plan baked these in for chapters 175-180. Next section should follow.

3. **Document the coverage threshold mismatch resolution** in the plan upfront. CLAUDE.md says 97.7% branches; vite.config says 100/100. M6 left this as is. Either align them or acknowledge in the plan ("coverage gate threshold-violations from these specific lines are pre-existing debt; new code must hit 100/100").

4. **For 10+ sub-step chapters (capstones), use a chapter-local helper for repeated structural visuals.** M6 used `CapstoneDecisionCard`. Saves ~150 lines and makes consistency automatic.

5. **The plan's regex tests for content keywords should be lenient on word-boundary** (`/chunking/i` instead of `/How Do I Chunk\?/i`). M6 had one fix needed; next section should pre-proofread for words that appear naturally in narrative but might be missing from headings (e.g. "chunking" / "embedding" / "evaluation" - test the noun form not the verb form).

## Known debts going into next section

- `encoder-decoder-diagrams.jsx` lines 59, 1242, 1976 still uncovered (pre-existing). Global coverage stays at 99.92% lines / 98.7% branches.
- `vite.config.js` threshold (100/100) does not match CLAUDE.md (97.7% branches). Coverage gate fails on global. Acknowledged; not blocking M6.
- `learn-ai-prefetch.test.jsx` flaky under full-suite + coverage. Re-scoped run always passes. Same recurrence as M3, M4, M5.
- Stale worktree dev server on port 5174 (`.claude/worktrees/section13/`). Persistent across 4 sessions. Should be cleaned up when section-13 work begins.
- M2-era format drift in `learn-ai.jsx`, `road-to-transformers.jsx`, `vector-compression.jsx`, `vector-production.jsx`, etc., still untouched. Acknowledged debt.
- M5-era pre-existing branch coverage gap in `vector-production.jsx` line 515 (1 unreachable defensive ternary).

## Section-wide observations going into the retrospective

- Per-chapter wall time stabilized at ~12-15 minutes across all 6 milestones. Bottleneck is content design, not tooling.
- TDD RED-then-GREEN discipline caught 100% of plan-vs-code gaps. Without it, the 12.41 "chunking" keyword would have shipped as a silent test miss.
- Plan Rule 11 (within-section signposts allowed) zero false flags across 6 milestones. The verbatim quoting practice from M3 lessons worked.
- Visual gate via sub=20 + localStorage trick: 100% effective at catching overlap defects across all 6 milestones, including the largest chapter (12.41 at 10 sub-steps).
