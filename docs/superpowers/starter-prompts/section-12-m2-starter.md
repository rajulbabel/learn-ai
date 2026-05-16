# M2 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 2 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-2.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m1-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review (SCOPE first, CORRECTNESS second)
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable) - catches defects tests pass through
- First task: set session title to "section12-milestone2"
- After M2 ships, execute the final refinement task (lessons + M3 starter prompt) before starting M3

Critical implementer-prompt patterns (baked from M1 lessons):
- Include verbatim Files: list from each task
- Include rule: "modify ONLY files in the Files: list; if you find other defects, document them but do NOT fix them"
- Include rule: "DO NOT run npm run format globally; if formatting needed, run npx prettier --write <specific files only>"
- Include rule: "DO NOT read or edit any file under docs/"
- Include forbidden-word list: architect/architecture/architectural, em-dash, literal "Act N" in chapter content
- Include reference: spec's Act-to-chapter mapping table (so forward signposts use correct chapter numbers)
- Include rule: "Run git diff --stat HEAD before staging; abort if anything outside Files: list is dirty"

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m1-lessons.md` to know what M1 taught
- Confirmed `git log` shows M1 commits cleanly merged on main
- Verified `npm run test` is green on main (expect 2385 tests passing after M1; M2 will add more)
- Killed any leftover dev server process from M1 (`lsof -i :5173`)

## M1 acceptance state (handoff to M2)

- Section 12 registered in `src/config.js`, `src/learn-ai.jsx` `sectionLoaders`, `src/sections/toc.jsx` sections array.
- 3 chapters live: 12.1 WhyLLMsNeedRetrieval, 12.2 NaiveRAGPipeline, 12.3 WhereNaiveRAGBreaks.
- `src/sections/rag-foundations.jsx` holds all 3 chapter exports (~1700 lines).
- Discoverability synced: CLAUDE.md mapping, public/llms.txt, index.html JSON-LD.
- `src/data/svg-descriptions.json` has entries for 12.2 (pipeline) and 12.3 (U-curve).
- Chrome visual gate verified all sub-steps of all 3 chapters.
- 2385/2385 tests pass; lint clean; lines 99.9% (one pre-existing miss in encoder-decoder-diagrams.jsx); branches 98.48%.
- Pre-commit hook regenerates and stages search-index artifacts when src/sections/* changes — this is NOT a scope violation.

## What M2 should produce

Per plan (as restructured): 10 chapters (12.4 ParsingExtraction through 12.13 ChunkingDecision) across 2 new section files (`rag-ingestion.jsx` + chunking exports added to `rag-foundations.jsx` or new file). Plan has 15 tasks including scaffold, per-chapter implementation, doc sync, visual gate, final verification, and lessons checkpoint.
