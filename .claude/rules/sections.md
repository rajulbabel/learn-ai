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
- **Titles always center-aligned** - every Box title must use the T component's center prop.
- **Colored boxes, not invisible ones** - always use actual colors for Box (C.cyan, C.purple, C.red, C.yellow, C.green, C.orange, C.blue). NEVER use Box color={C.card}.
- **No next-chapter hints** - never reference upcoming chapters inside content.
- **Font sizes 16-20 for content** - body text 16-19px, titles 20-24px. Never below 14px except tiny annotations.
- **Inner element pattern** - use tinted backgrounds: `${color}06`, border: `1px solid ${color}12`, borderRadius: 8. Never use opacity.
- **No em-dashes** - use hyphens or rewrite.
- **Dot product notation** - use the middle dot, not multiplication sign.
- **Chapter context** - all chapter functions receive ctx with: sub, setSub, navigate, goTo, bankIdx, setBankIdx, hovered, setHovered, expanded, setExpanded, subBtnRipple, setSubBtnRipple, registerSubBtn.
