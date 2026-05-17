# Section 12 Complete

Section 12 "Retrieval-Augmented Generation" shipped on 2026-05-17. 41 chapters across 6 milestones.

## Verify the section is live

- TOC shows Section 12 with 41 chapters (12.1-12.41).
- `npx vitest run --dir src --exclude='.claude/**' --exclude='.claude/worktrees/**'` green; 3046 tests pass.
- Coverage: 99.92% lines / 98.7% branches globally. All `rag-*.jsx` files at 100/100/100/100.
- `npm run lint` clean (6 pre-existing warnings in encoder-decoder-diagrams.jsx and embedding-cache.test.js).
- `npm run build` succeeds.
- Chrome browser visual validation: every new chapter renders 0 overlap, every SVG has `<desc>`, every Box uses a real color.

## Files shipped

- `src/sections/rag-foundations.jsx` (Acts 1+3, chapters 12.1-12.3 + 12.7-12.13)
- `src/sections/rag-ingestion.jsx` (Act 2, chapters 12.4-12.6)
- `src/sections/rag-retrieval.jsx` (Acts 4+5, chapters 12.14-12.21)
- `src/sections/rag-generation.jsx` (Acts 6+7, chapters 12.22-12.30)
- `src/sections/rag-evaluation.jsx` (Act 8, chapters 12.31-12.35)
- `src/sections/rag-production.jsx` (Acts 9+10, chapters 12.36-12.41)

## Retrospective

See `docs/superpowers/lessons/section-12-retrospective.md` for what worked / what did not work / suggested backlog. See `docs/superpowers/lessons/section-12-m*-lessons.md` for per-milestone lessons.

## Reminders

After deploy:

- Request re-indexing in Google Search Console (URL Inspection -> Request indexing).
- Submit URL in Bing Webmaster Tools (URL Submission).
- Confirm `public/llms.txt`, `index.html` JSON-LD `teaches` array, and `CLAUDE.md` mapping table all reflect Section 12.

## Next big project

TBD. See `docs/superpowers/lessons/section-12-retrospective.md` "Suggested backlog" section. Candidates include:

- Multi-modal models (vision + text + audio joint embedding, modern multi-modal architectures).
- Mechanistic interpretability (probing, circuits, sparse autoencoders).
- Inference optimization deep dive (speculative decoding, batching, FlashAttention, paged attention).
- RAG at web scale (federated retrieval, real-time index updates, distributed RAG infrastructure).
- Agent frameworks deep dive (LangGraph, AutoGen, OpenAI Agents SDK, multi-agent coordination).
- Content polish (apply title-case-for-diagram-box-text rule retroactively to Sections 1-11).
