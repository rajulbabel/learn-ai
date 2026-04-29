---
paths:
  - "src/sections/**/*.jsx"
---

# Visual Design Rules for Section Files

Every chapter, sub-step, and visual MUST follow these rules.

- **Illustrative first** - every concept must be shown visually, not just described. Use colored bars, grids, split diagrams, progress bars, side-by-side comparisons, and inline calculations. Text alone is never enough.
- **Simple language, advanced content** - explain in plain language but NEVER simplify the actual concept. Always show the real formula, the real math, the real mechanism.
- **Build up piece by piece** - use progressive sub-steps (Reveal). Each click should add one clear idea. Never dump everything on screen at once.
- **Concrete over abstract** - always use real numbers, real words, real sentences. Never say "some value" when you can say "[0.8, 0.2]".
- **Show the WHY, not just the WHAT** - if something is split, scaled, or chosen, explain the tradeoff.
- **Consistent example sentences** - use "I love cats" and "The cat sat on the mat last week" as running examples.
- **Titles always center-aligned** - every Box title must use the T component's center prop. This applies to BOTH the outer Box title AND any title T inside grid/flex card layouts. Inside a card div, the title T MUST have `center`, the description T MUST have `center`, and the parent card div MUST have `textAlign: "center"`. No exceptions for "card-style" layouts - if it has a title, it gets centered.
- **Capitalize first letter of every visible text fragment** - every line of monospace formula boxes, every cell in tables, every bullet point, every column header, every card name/description/note, every SVG text label MUST start with a capital letter. Examples that MUST be capitalized: `name: "Cosine"`, `latency: "Normal"`, `params: ["Fast to build"]`, `pain: "Queries on tenant_id..."`, `tech: "Cross-encoder"`, `year: "Today"`, SVG `<text>` labels like "Query" / "Doc" / "Score". Exceptions: brand names that are officially lowercase (pgvector, numpy, iPhone), variable identifiers inside a math formula expression (the `q_vec` in `Score = cosine(q_vec, d_vec)`), parameter syntax (`m = 16`, `ef_search = 40`), tokens like `[CLS]` / `[SEP]`. When unsure, capitalize. The first letter of a LINE is what counts - everything after a colon or first word does not need re-capitalization.
- **SVG diagrams must be horizontally centered in their viewBox** - never hardcode `x = 40` for elements in a `viewBox 0 0 520 ...`. Compute symmetric padding: `x_start = (viewBox_width - element_span) / 2`. Token rows, transformer boxes, score circles, and any element-row layout must have equal left/right margins. After placing, verify visually in Chrome - do not trust the math alone.
- **Colored boxes, not invisible ones** - always use actual colors for Box (C.cyan, C.purple, C.red, C.yellow, C.green, C.orange, C.blue). NEVER use Box color={C.card}.
- **No next-chapter hints** - never reference upcoming chapters inside content.
- **Font sizes 16-20 for content** - body text 16-19px, titles 20-24px. Never below 14px except tiny annotations.
- **Inner element pattern** - use tinted backgrounds: `${color}06`, border: `1px solid ${color}12`, borderRadius: 8. Never use opacity.
- **No em-dashes** - use hyphens or rewrite.
- **Dot product notation** - use the middle dot, not multiplication sign.
- **Chapter context** - all chapter functions receive ctx with: sub, setSub, navigate, goTo, bankIdx, setBankIdx, hovered, setHovered, expanded, setExpanded, subBtnRipple, setSubBtnRipple, registerSubBtn.
- **SVG search metadata** - every `<svg>` MUST have a `<desc>` child as its first element describing what the diagram shows. For JSX SVGs: `<desc>text</desc>`. For Graph component: pass `desc` prop. For imperative SVGs (B() factory): call `desc("text")`. Also add/update the entry in `src/data/svg-descriptions.json`.
- **Standalone formulas always centered** - any formula, equation, vector display, or worked computation in its own dark/tinted box MUST have `textAlign: "center"` on the container div. This includes monospace math like `new_weight = old_weight - lr x gradient` and vector displays like `[0.2, 0.9, 0.4]`. Inline formulas within flowing text sentences are exempt.
