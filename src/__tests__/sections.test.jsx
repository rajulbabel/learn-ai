import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { chapters } from "../config.js";

// Import all sections
import { TOC } from "../sections/toc.jsx";
import * as NeuralFoundations from "../sections/neural-foundations.jsx";
import * as LLMTraining from "../sections/llm-training.jsx";
import * as Scaling from "../sections/scaling.jsx";
import * as RoadToTransformers from "../sections/road-to-transformers.jsx";
import * as TransformerInput from "../sections/transformer-input.jsx";
import * as AttentionQKV from "../sections/attention-qkv.jsx";
import * as AttentionComputation from "../sections/attention-computation.jsx";

const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
};

afterEach(() => cleanup());

// Default context factory
function makeCtx(overrides = {}) {
  return {
    sub: 0,
    setSub: vi.fn(),
    subBtnRipple: 0,
    setSubBtnRipple: vi.fn(),
    navigate: vi.fn(),
    goTo: vi.fn(),
    bankIdx: 0,
    setBankIdx: vi.fn(),
    hovered: 0,
    setHovered: vi.fn(),
    expanded: null,
    setExpanded: vi.fn(),
    registerSubBtn: vi.fn(),
    ...overrides,
  };
}

// Helper: render a chapter function at a given sub, click SubBtn if present, fire all cursor-pointer clicks
function renderAndInteract(fn, sub, extraCtx = {}) {
  const navigate = vi.fn();
  const setSubBtnRipple = vi.fn();
  const setHovered = vi.fn();
  const setBankIdx = vi.fn();
  const ctx = makeCtx({ sub, navigate, setSubBtnRipple, setHovered, setBankIdx, ...extraCtx });
  const { container } = render(fn(ctx));

  // Click SubBtn if present
  const subBtn = container.querySelector("[data-subbtn]");
  if (subBtn) fireEvent.click(subBtn);

  // Click all cursor-pointer elements (setHovered, setBankIdx, etc.)
  const clickables = container.querySelectorAll("[style*='cursor: pointer']");
  clickables.forEach((el) => {
    fireEvent.click(el);
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
  });

  return { container, navigate, setSubBtnRipple };
}

// ─── Generic: render every chapter at every sub and interact ───
describe("All chapters - full sub + interaction coverage", () => {
  chapters.forEach((chapter) => {
    const fn = lookup[chapter.component];

    describe(`${chapter.id} ${chapter.component}`, () => {
      // Go through enough sub levels to cover all branches (max any chapter uses is ~7)
      for (let s = 0; s <= 10; s++) {
        it(`sub=${s}`, () => {
          renderAndInteract(fn, s);
        });
      }
    });
  });
});

// ─── TOC special branches ───
describe("TOC", () => {
  it("renders section list", () => {
    const ctx = makeCtx();
    const { container } = render(TOC(ctx));
    expect(container.textContent).toContain("Neural Network Foundations");
  });

  it("expands a section", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: null })));
    const headers = container.querySelectorAll("[style*='cursor: pointer']");
    fireEvent.click(headers[0]);
    expect(setExpanded).toHaveBeenCalledWith(1);
  });

  it("collapses an expanded section", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: 1 })));
    const headers = container.querySelectorAll("[style*='cursor: pointer']");
    fireEvent.click(headers[0]);
    expect(setExpanded).toHaveBeenCalledWith(null);
  });

  it("renders chapters when expanded and navigates on click", () => {
    const goTo = vi.fn();
    const { container } = render(TOC(makeCtx({ expanded: 1, goTo })));
    expect(container.textContent).toContain("What is a Neural Network?");
    const chapterLinks = container.querySelectorAll("[style*='padding: 6px 8px 6px 40px']");
    if (chapterLinks.length > 0) {
      fireEvent.click(chapterLinks[0]);
      expect(goTo).toHaveBeenCalled();
    }
  });

  it("shows hover effect on chapter links", () => {
    const { container } = render(TOC(makeCtx({ expanded: 1 })));
    const chapterLinks = container.querySelectorAll("[style*='padding: 6px 8px 6px 40px']");
    if (chapterLinks.length > 0) {
      fireEvent.mouseEnter(chapterLinks[0]);
      fireEvent.mouseLeave(chapterLinks[0]);
    }
  });

  // Test all 7 sections expanded to cover each one
  for (let secNum = 1; secNum <= 7; secNum++) {
    it(`shows chapters for section ${secNum}`, () => {
      const { container } = render(TOC(makeCtx({ expanded: secNum })));
      expect(container.innerHTML).toBeTruthy();
    });
  }
});

// ─── Special interactive chapters ───

describe("ContextProblem bankIdx branches", () => {
  const fn = AttentionQKV.ContextProblem;

  it("bankIdx=0", () => {
    renderAndInteract(fn, 5, { bankIdx: 0 });
  });

  it("bankIdx=1", () => {
    renderAndInteract(fn, 5, { bankIdx: 1 });
  });

  it("clicks sentence buttons", () => {
    const setBankIdx = vi.fn();
    const ctx = makeCtx({ sub: 5, setBankIdx });
    const { container } = render(fn(ctx));
    const buttons = container.querySelectorAll("button");
    buttons.forEach((b) => fireEvent.click(b));
  });
});

describe("WordLookup hovered branches", () => {
  const fn = AttentionQKV.WordLookup;
  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => {
      renderAndInteract(fn, 5, { hovered: h });
    });
  }

  it("hovered out of range triggers || fallback", () => {
    renderAndInteract(fn, 5, { hovered: 99 });
  });
});

describe("DotProduct hovered branches", () => {
  const fn = AttentionQKV.DotProduct;
  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => {
      renderAndInteract(fn, 5, { hovered: h });
    });
  }
});

describe("TracingExample hovered branches", () => {
  const fn = AttentionQKV.TracingExample;
  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => {
      renderAndInteract(fn, 5, { hovered: h });
    });
  }
});

describe("WhatTransformerDoes interactive", () => {
  const fn = TransformerInput.WhatTransformerDoes;

  it("bankIdx=0", () => renderAndInteract(fn, 5, { bankIdx: 0 }));
  it("bankIdx=1", () => renderAndInteract(fn, 5, { bankIdx: 1 }));

  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => renderAndInteract(fn, 5, { hovered: h }));
  }
});

describe("ComputeQKV interactive", () => {
  const fn = AttentionComputation.ComputeQKV;

  it("bankIdx=0", () => renderAndInteract(fn, 7, { bankIdx: 0 }));
  it("bankIdx=1", () => renderAndInteract(fn, 7, { bankIdx: 1 }));
  it("bankIdx=2", () => renderAndInteract(fn, 7, { bankIdx: 2 }));
});

describe("AttentionScores hovered", () => {
  const fn = AttentionComputation.AttentionScores;
  for (let h = 0; h <= 4; h++) {
    it(`hovered=${h}`, () => renderAndInteract(fn, 7, { hovered: h }));
  }
});

// ─── WhyMultiHead label width fix ───
describe("WhyMultiHead compromise bar labels", () => {
  const fn = AttentionComputation.WhyMultiHead;

  it("label minWidth accommodates 'last week' without wrapping", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    // Find the bar label spans (minWidth on the word labels)
    const labels = container.querySelectorAll("span[style*='text-align: right']");
    const lastWeekLabel = Array.from(labels).find((el) => el.textContent === "last week");
    expect(lastWeekLabel).toBeTruthy();
    // minWidth should be at least 70px to fit "last week"
    const minWidth = parseInt(lastWeekLabel.style.minWidth, 10);
    expect(minWidth).toBeGreaterThanOrEqual(70);
  });
});

// ─── WhyMultiHead sub 2 head boxes alignment ───
describe("WhyMultiHead head boxes alignment", () => {
  const fn = AttentionComputation.WhyMultiHead;

  it("head boxes use consistent grid with aligned columns", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    // Find the three head row grids by matching their gridTemplateColumns pattern (Npx 1fr Npx)
    const allGrids = container.querySelectorAll("[style*='display: grid']");
    const headRows = Array.from(allGrids).filter((el) => {
      const tpl = el.style.gridTemplateColumns;
      return tpl && /^\d+px 1fr \d+px$/.test(tpl);
    });
    expect(headRows.length).toBe(3);
    // All should have identical grid templates
    headRows.forEach((row) => expect(row.style.gridTemplateColumns).toBe(headRows[0].style.gridTemplateColumns));
  });

  it("head sublabels are center-aligned", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    // T renders as <div>, find sublabel divs by text content
    const sublabels = ["subject-verb", "verb-location", "temporal"];
    sublabels.forEach((label) => {
      const el = Array.from(container.querySelectorAll("div")).find((d) => d.textContent === label);
      expect(el).toBeTruthy();
      expect(el.style.textAlign).toBe("center");
    });
  });

  it("first column width accommodates longest sublabel", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const allGrids = container.querySelectorAll("[style*='display: grid']");
    const headRows = Array.from(allGrids).filter((el) => {
      const tpl = el.style.gridTemplateColumns;
      return tpl && /^\d+px 1fr \d+px$/.test(tpl);
    });
    // First column should be at least 80px to fit "subject-verb"
    headRows.forEach((row) => {
      const firstColWidth = parseInt(row.style.gridTemplateColumns.split(" ")[0], 10);
      expect(firstColWidth).toBeGreaterThanOrEqual(80);
    });
  });
});

// ─── Derivatives Frac helper coverage ───
describe("Derivatives with high sub to invoke Frac", () => {
  const fn = NeuralFoundations.Derivatives;
  // Render at every sub to ensure the internal Frac component is used
  for (let s = 0; s <= 7; s++) {
    it(`sub=${s}`, () => {
      renderAndInteract(fn, s);
    });
  }
});
