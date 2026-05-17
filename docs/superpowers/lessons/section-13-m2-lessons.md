# Section 13 Milestone 2 Lessons

Captured at end of M2 to inform M3. Read this before executing M3.

## What worked well

- **Helper hub pattern held up cleanly.** Adding `agent-loops.jsx` for Act 4 needed zero new helper duplication: `SOFT`, `tintedCard`, `pill`, `DIM_BG`, `DIM_BORDER` all imported from `agent-prompting.jsx` and used identically. SOFT got one new key (`amber: "#ffd54f"`) when Act 4 sub=3 introduced amber, committed standalone. The single-file helper hub pattern from M1 should carry through M3 (multi-agent + memory in new files).

- **Sub=20 + localStorage fingerprint trick** worked great for Chrome validation. One Chrome navigate, then a single JS routine that validates the current chapter + sets next-ch + reloads. Sub=20 made every Reveal block visible without manual click-through. The validation JS detected SVG-desc presence, `C.card` boxes (rgba 0.025), em-dashes, and overlapping bounding rects in one pass per chapter. 12 chapters validated in 12 JS calls.

- **Ordering: chapter entries before TOC entry** avoided the M1 ordering bug. M2 plan combined the two into Task 5 (config.test.js fail-first, then add 12 entries in one block), and the TOC entry implicitly existed from M1's section-13 registration. No ordering bug surfaced.

- **First-Act-3-chapter spec compliance review** caught the same kinds of nits M1's first chapter did (the SVG sprawl needed a unique-to-sub=0 string for the unique-matcher pattern). Pattern locked by 13.13. Subsequent chapters (13.14-13.23) shipped with 0 review interventions.

- **Module-level data constants above each export** continued to scale well. WhyProtocols (`SPRAWL_AGENTS`, `SPRAWL_TOOLS`, `PROTOCOL_CARDS`, `QUADRANTS`), McpArchitecture (`MCP_LIFECYCLE_STEPS`), McpPrimitives (`PRIMITIVES_COLS`, `DECISION_ROWS`), etc. Keep this convention in M3.

- **Artifact treatment held.** MCP messages (sub=4 13.13), MCP Prompt shape (13.14), MCP Server registration shapes (13.15), `agent.json` (13.17), ReAct trace (13.21), halt-signal tool result (13.23) all rendered as styled mono-text via `tintedCard(C.X)` + `<div style={{ fontFamily: "monospace", whiteSpace: "pre", textAlign: "left" }}>`. NEVER as code blocks. Outer card `textAlign: "center"`, inner pre `textAlign: "left"` so JSON keys align.

## What didn't work / had to be fixed mid-flight

- **`npm run search:build` cost ~20 minutes** when triggered to clear an auto-generated `chunks.json` brand leak that the M2 plan flagged in Task 1 Step 5. The leak does NOT propagate to live UI/content - it's auto-generated. M3 plan should explicitly mark "skip search:build for brand-leak diagnostics; only act if leak in src/sections/ or other live source." (Saved as `feedback_no_search_build_for_brand_leak.md` in memory.)

- **`C.amber` had to be added in Task 1.** Even after M1 added `C.indigo` and `C.teal`, `C.amber` was not in the palette but Act 4 sub=3 used it. Caught early via the "Verify C palette has all required colors" check from M1 lessons. M3 needs `C.green` available for Act 6 sub-step rotation; verify it exists during Task 1 baseline.

- **`SOFT.amber` had to be added** to `agent-prompting.jsx` SOFT map (chose `#ffd54f` to differentiate from `SOFT.yellow = #ffe082`). Same lesson: extend SOFT before any Act-4 chapter implementation. M3 may need additional SOFT entries depending on Act 6 palette.

- **Pre-existing flaky `learn-ai-prefetch.test.jsx > calls prefetchSearch after window load + idle`** still flakes in full-suite runs and still passes in isolation. Same M1 pattern - ignore unless it starts failing in isolation too.

## Test-pattern observations

- **Unique-to-sub=N matcher discipline scaled cleanly.** Every M2 chapter test block has at least one matcher that only the corresponding sub-step's content can satisfy: "30 Connectors", "Hub and spoke", "Model Context Protocol", "Protocol Mesh", "Sandbox Contract" (13.12); "Claude Desktop", "Postgres", "Server-Sent Events", "Initialize Handshake", "search_kb" (13.13); etc. Keep this in M3.

- **Test counts:** baseline 2688 (M1 end) -> 2899 after M2 (12 chapters; ~17 tests per chapter * 12 = ~204; +12 config entry tests; +3 lookup presence tests). ~211 added tests.

## Visual-rule landmines

- **None caught at Chrome validation.** All 12 chapters scored 0 missing-desc, 0 `C.card`, 0 em-dash, 0 overlap. The pattern is locked.

- **`Box color={C.card}` regression watch:** the M1-lessons-noted rule held. Reviewers and subagents both auto-checked `Box color={C.card}` and got 0 hits.

## Recommendations for M3

1. **Verify `C.green` (and any other Act-6 palette colors)** exist in `C` palette as part of Task 1 baseline. M3 covers Acts 5 (Memory) and 6 (Multi-Agent). Per spec tentative colors: Act 5 amber (already have), Act 6 green (already have green=#00e676 in palette, verify SOFT.green exists - it does).

2. **Keep helper hub in `agent-prompting.jsx`.** M3 will create `multi-agent.jsx` (Act 6, 7 chapters) - it imports helpers from agent-prompting.jsx. Act 5 chapters live in the existing `agent-loops.jsx` (12 chapters total - 6 Act 4 in M2, 6 Act 5 in M3).

3. **Continue avoiding `npm run format`.** No subagent ran it; format runs cascade-rewrite unrelated files. Repeat the forbid in every M3 chapter prompt.

4. **Continue artifact treatment for memory layers (M3 Act 5).** Working/episodic/semantic/procedural memory shapes will need the same "styled mono-text, NOT code block" treatment. Re-state this in every chapter prompt.

5. **Two-stage review only on first chapter of each new file.** M3 introduces `multi-agent.jsx` (Act 6) and re-uses `agent-loops.jsx` (Act 5). The first-chapter-of-Act-5 (13.24 MemoryTaxonomy) is in a file with the Act-4 pattern already locked, so a single-stage check suffices. The first-chapter-of-Act-6 (13.30 WhyMultiAgent) is in a NEW file - two-stage review there.

6. **Skip search-index regeneration** unless src/ content actually changes (per memory feedback). The chunks.json/chunk-cache.json brand leak is purely auto-gen; do not block on it.

7. **Test cadence in full-suite runs:** ignore the `learn-ai-prefetch` flake. Verify in isolation only if it surfaces.

8. **Continue using running example.** Alice (alice@example.com), customer c-9924, tickets T1-T5, canonical 8-tool inventory. Re-used cleanly across 13.12-13.23. M3 keeps the same.

## Section-13-specific outcomes (cumulative M1 + M2)

- 23 chapters total in Section 13 (M1: 11 + M2: 12). 6 milestones, 2 of 6 complete.
- 3 section files: `agent-prompting.jsx` (Act 1, 6 ch), `agent-tools.jsx` (Acts 2+3, 11 ch), `agent-loops.jsx` (Act 4, 6 ch; Act 5 added in M3).
- 2899 tests passing in M2 final (full suite); 2 skipped (search-index gated by ignored auto-gen artifacts).
- Coverage on M2 files: 100% statements/branches/functions/lines for newly added Act 3 + Act 4 code paths.
- No em-dashes, no `C.card`, no `opacity` for transparency, no forward-chapter hints, no carry-over fictional brand names.
- SVG descriptions registered in `svg-descriptions.json` for every new SVG diagram across Acts 3+4.
- CLAUDE.md mapping table + project structure tree updated for Acts 3+4.
- No discoverability metadata changes needed in M2 (Section 13 already listed in `llms.txt` + index.html JSON-LD from M1).
- 24 commits on `worktree-section13` for M2 work (amber palette + SOFT.amber + scaffolds + loader + config + lookups + 12 chapters + CLAUDE.md + agent-loops.jsx linter polish).
