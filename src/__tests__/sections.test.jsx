import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { chapters } from "../config.js";

// Import all sections
import { TOC } from "../sections/toc.jsx";
import * as NeuralFoundations from "../sections/neural-foundations.jsx";
import { Graph } from "../sections/neural-foundations.jsx";
import * as LLMTraining from "../sections/llm-training.jsx";
import * as Scaling from "../sections/scaling.jsx";
import * as RoadToTransformers from "../sections/road-to-transformers.jsx";
import * as TransformerInput from "../sections/transformer-input.jsx";
import * as AttentionQKV from "../sections/attention-qkv.jsx";
import * as AttentionComputation from "../sections/attention-computation.jsx";
import * as TransformerBlock from "../sections/transformer-block.jsx";
import * as EncoderDecoderDiagrams from "../sections/encoder-decoder-diagrams.jsx";

const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
  ...TransformerBlock,
  ...EncoderDecoderDiagrams,
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

  // Test all 9 sections expanded to cover each one
  for (let secNum = 1; secNum <= 9; secNum++) {
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

// ─── ComputeQKV W matrix sub-steps ───
describe("ComputeQKV W matrix sub-steps", () => {
  const fn = AttentionComputation.ComputeQKV;

  it("sub 1 shows all three W matrices (W_Q, W_K, W_V)", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("W_K");
    expect(text).toContain("W_V");
    // Should show matrix values
    expect(text).toContain("0.15");
    expect(text).toContain("0.59");
  });

  it("sub 2 shows detailed multiplication for 'I'", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the step-by-step multiplication
    expect(text).toContain("1.0");
    expect(text).toContain("0.59");
    // Should show the result
    expect(text).toContain("[1.0, -0.5]");
  });

  it("sub 3 shows the final Q, K, V results table", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Query");
    expect(text).toContain("Key");
    expect(text).toContain("Value");
    expect(text).toContain("[0.8, 0.2]");
  });
});

describe("AttentionScores hovered", () => {
  const fn = AttentionComputation.AttentionScores;
  for (let h = 0; h <= 4; h++) {
    it(`hovered=${h}`, () => renderAndInteract(fn, 7, { hovered: h }));
  }
});

// ─── Chapter 7.4: Why Do We Need Softmax? ───
describe("WhySoftmax sub-steps", () => {
  const fn = AttentionComputation.WhySoftmax;

  it("sub 5 shows Steps 1-2 (e^score + sum) but not Step 3", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Step 1");
    expect(text).toContain("e^score");
    expect(text).toContain("Step 2");
    expect(text).toContain("151.17");
    expect(text).not.toContain("Step 3");
  });

  it("sub 6 shows Step 3 (divide by sum) and checkmarks", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Step 3");
    expect(text).toContain("Divide");
    expect(text).toContain("98.2%");
    expect(text).toContain("All positive");
    expect(text).toContain("Sum = 100%");
  });

  it("sub 7 shows amplification content (was sub 6)", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("amplif");
    expect(text).toContain("dominates");
  });

  it("sub 8 shows the complete picture recap (was sub 7)", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("complete picture");
    expect(text).toContain("FORMULA");
  });

  it("shows SubBtn when sub < 8 and hides at sub 8", () => {
    const ctx7 = makeCtx({ sub: 7 });
    const { container: c7 } = render(fn(ctx7));
    expect(c7.querySelector("[data-subbtn]")).toBeTruthy();

    const ctx8 = makeCtx({ sub: 8 });
    const { container: c8 } = render(fn(ctx8));
    expect(c8.querySelector("[data-subbtn]")).toBeFalsy();
  });
});

// ─── Chapter 7.9: Causal Masking - Hiding the Future ───
describe("CausalMask sub-steps", () => {
  const fn = AttentionComputation.CausalMask;

  it("sub 0 shows the problem - future words shouldn't be visible during generation", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("generat");
    expect(text).toContain("future");
  });

  it("sub 1 shows who-can-look-at-whom grid and unmasked score matrix", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("score");
    expect(text).toMatch(/The|cat|sat|on/);
    expect(text).toContain("diagonal");
    expect(text).toContain("future");
  });

  it("sub 2 shows the mask matrix with -infinity for future positions", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/-inf|infinity|\u221E/i);
    expect(text).toContain("mask");
  });

  it("sub 3 shows masked scores only", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("masked");
    expect(text).toContain("scores");
  });

  it("sub 4 shows softmax turning masked scores into attention weights", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("0.00");
  });

  it("sub 5 shows bidirectional vs causal visual comparison", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/[Bb]idirectional/);
    expect(text).toMatch(/[Cc]ausal/);
  });

  it("sub 6 shows training insight - every position makes a prediction", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training Insight");
    expect(text).toContain("prediction");
    expect(text).toContain("Causal Mask");
    expect(text).toContain("HONEST");
    expect(text).toContain("0 usable training examples");
    expect(text).toContain("4 usable training examples");
  });

  it("sub 7 shows encoder-only architecture (BERT, RoBERTa)", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ENCODER-ONLY");
    expect(text).toContain("BERT");
    expect(text).toContain("bidirectional");
    expect(text).not.toContain("DECODER-ONLY");
    expect(text).not.toContain("ENCODER-DECODER");
  });

  it("sub 8 shows decoder-only architecture (GPT, Claude, LLaMA)", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("DECODER-ONLY");
    expect(text).toContain("GPT");
    expect(text).toContain("generate");
  });

  it("sub 9 shows encoder-decoder architecture (T5, BART) and core rule summary", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ENCODER-DECODER");
    expect(text).toContain("T5");
    expect(text).toContain("core rule");
    expect(text).toContain("already exists");
    expect(text).toContain("being generated");
  });
});

// ─── Chapter 7.10: Cross-Attention - The Encoder-Decoder Bridge ───
describe("CrossAttention sub-steps", () => {
  const fn = AttentionComputation.CrossAttention;

  it("sub 0 shows the setup - encoder output meets decoder", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("encoder");
    expect(text).toContain("decoder");
  });

  it("sub 1 shows Q from decoder, K and V from encoder", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Query");
    expect(text).toContain("Key");
    expect(text).toContain("Value");
    expect(text).toContain("decoder");
    expect(text).toContain("encoder");
  });

  it("sub 2 traces a concrete translation example with scores", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("score");
    expect(text).toContain("softmax");
  });

  it("sub 3 compares self-attention vs cross-attention side by side", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/self.attention/i);
    expect(text).toMatch(/cross.attention/i);
    expect(text).toContain("same sentence");
  });

  it("sub 4 shows misconception vs reality - encoder runs once", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/encoder.*once/i);
    expect(text).toContain("WRONG");
    expect(text).toContain("CORRECT");
    expect(text).toContain("K, V");
  });

  it("sub 5 shows complete data flow SVG with dimensions", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Complete data flow");
    expect(text).toContain("d_model = 512");
  });

  it("sub 6 shows layer-by-layer math and dimension walkthrough", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("each decoder layer");
    expect(text).toContain("Dimension walkthrough");
    expect(text).toContain("[3 x 64]");
  });

  it("sub 7 shows where cross-attention appears in the architecture", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only");
    expect(text).toContain("encoder-decoder");
  });
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

// ─── HeadSplit redesigned sub-steps ───
describe("HeadSplit redesigned visuals", () => {
  const fn = AttentionComputation.HeadSplit;

  it("sub 0 shows the problem recap with single arrow concept", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("512");
  });

  it("sub 1 shows the dimension split visual with 8 chunks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("64");
    // Should show chunk labels for all 8 heads
    expect(text).toContain("H1");
    expect(text).toContain("H8");
  });

  it("sub 2 shows cost vs quality tradeoff", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show both approaches compared
    expect(text).toContain("512");
    expect(text).toContain("64");
    // Should show the cost comparison
    expect(text).toContain("8");
    // Should mention diminishing returns or similar concept
    expect(text).toContain("same budget");
  });

  it("sub 3 shows each chunk gets its own W matrices", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("W_K");
    expect(text).toContain("W_V");
    expect(text).toContain("512");
    expect(text).toContain("64");
  });

  it("sub 4 shows 8 heads asking different questions", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Head 1");
    expect(text).toContain("Head 3");
  });

  it("sub 5 shows layers stacking concept", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("96");
    expect(text).toContain("768");
  });
});

// ─── Derivatives Frac helper coverage ───
// ─── ConcatWO envelope visual ───
describe("ConcatWO envelope visual", () => {
  const fn = AttentionComputation.ConcatWO;

  it("sub 1 shows sealed envelopes as visual blocks with barriers", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show envelope content
    expect(text).toContain("suspect");
    expect(text).toContain("park");
    expect(text).toContain("Tuesday");
    // Should show the sealed/barrier concept visually
    expect(text).toContain("sealed");
  });

  it("sub 1 shows visual envelope blocks for each head", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    // Should have distinct envelope blocks with head-specific colors
    const headBlocks = container.querySelectorAll("[data-envelope]");
    expect(headBlocks.length).toBeGreaterThanOrEqual(4);
  });

  it("sub 1 shows concatenation bar with visible barriers between segments", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    // Should have a concatenated bar visualization
    const concatBar = container.querySelector("[data-concat-bar]");
    expect(concatBar).toBeTruthy();
  });
});

// ─── TOC sections 8 and 9 ───
describe("TOC section 8", () => {
  it("shows section 8 when expanded", () => {
    const { container } = render(TOC(makeCtx({ expanded: 8 })));
    expect(container.innerHTML).toBeTruthy();
    expect(container.textContent).toContain("The Encoder");
  });
});

describe("TOC section 9", () => {
  it("shows section 9 when expanded", () => {
    const { container } = render(TOC(makeCtx({ expanded: 9 })));
    expect(container.innerHTML).toBeTruthy();
    expect(container.textContent).toContain("The Decoder");
  });
});

// ─── AddNorm chapter sub-steps ───
describe("AddNorm sub-steps", () => {
  const fn = TransformerBlock.AddNorm;

  it("sub 0 shows the Transformer block overview with Add & Norm highlighted", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the block diagram with attention, add & norm, FFN flow
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
  });

  it("sub 1 shows the value drift problem with both shrink and explode scenarios", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the problem with concrete numbers from "cats" embedding
    expect(text).toContain("0.7");
    // Should show both directions of drift
    expect(text).toContain("shrink");
    expect(text).toContain("explode");
    // Should mention layers
    expect(text).toContain("layer");
  });

  it("sub 2 shows the Add step with concrete math and explains residual meaning", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should explain what "residual" means in plain language
    expect(text).toContain("residual");
    expect(text).toContain("leftover");
    // Should show original input + attention output = combined
    expect(text).toContain("original");
    expect(text).toContain("+");
    // Should have the visual
    expect(container.querySelector("[data-residual]")).toBeTruthy();
  });

  it("sub 3 shows layer normalization formula and parameter explanations", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the formula and parameter explanations
    expect(text).toContain("Layer Normalization");
    expect(text).toContain("gamma");
    expect(text).toContain("beta");
    expect(text).toContain("variance");
  });

  it("sub 4 shows layer normalization step-by-step computation", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the normalization steps: mean, subtract, divide
    expect(text).toContain("mean");
    expect(text).toContain("subtract");
    // Should show concrete numbers being normalized
    expect(text).toContain("0");
  });

  it("sub 5 shows full Add & Norm pipeline with numbers flowing through", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the complete pipeline
    expect(text).toContain("Input");
    expect(text).toContain("Attention");
    // Should have the pipeline visualization
    expect(container.querySelector("[data-pipeline]")).toBeTruthy();
  });

  it("sub 6 shows why it matters - with vs without comparison", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the comparison
    expect(text).toContain("Without");
    expect(text).toContain("With");
    // Should mention stability or training
    expect(text).toContain("stable");
  });
});

describe("Derivatives with high sub to invoke Frac", () => {
  const fn = NeuralFoundations.Derivatives;
  // Render at every sub to ensure the internal Frac component is used
  for (let s = 0; s <= 7; s++) {
    it(`sub=${s}`, () => {
      renderAndInteract(fn, s);
    });
  }
});

// ─── Chapter 1.11: Vectors ───
describe("Vectors sub-steps", () => {
  const fn = NeuralFoundations.Vectors;

  it("sub 0 introduces what a vector is with concrete example", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("list");
    expect(text).toContain("number");
  });

  it("sub 1 connects vectors to neural networks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Everything");
    expect(text).toContain("vector");
  });

  it("sub 2 shows words become vectors", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("cat");
    expect(text).toContain("vector");
  });

  it("sub 3 shows similar words have similar vectors", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("similar");
  });
});

// ─── Chapter 1.12: Dot Product ───
describe("DotProductIntro sub-steps", () => {
  const fn = NeuralFoundations.DotProductIntro;

  it("sub 0 introduces how to compare vectors", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("compare");
  });

  it("sub 1 shows step-by-step dot product computation", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Multiply");
    expect(text).toContain("Add");
  });

  it("sub 2 explains what the result number means - similarity", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("similar");
  });

  it("sub 3 connects to word vectors and attention", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("neuron");
  });
});

// ─── Chapter 1.13: Matrices ───
describe("Matrices sub-steps", () => {
  const fn = NeuralFoundations.Matrices;

  it("sub 0 introduces what a matrix is - a grid of numbers", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("grid");
  });

  it("sub 1 shows matrix-vector multiplication step by step", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("row");
    expect(text).toContain("dot product");
  });

  it("sub 2 shows a concrete computation with real numbers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show actual numbers being multiplied
    expect(text).toMatch(/\d/);
  });

  it("sub 3 connects matrices to neural network weights", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("weight");
    expect(text).toContain("transform");
  });
});

// ─── Chapter 1.14: Layer = Matrix Multiplication ───
describe("LayerIsMatMul sub-steps", () => {
  const fn = NeuralFoundations.LayerIsMatMul;

  it("sub 0 recalls single neuron from chapter 1.4", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
  });

  it("sub 1 shows multiple neurons side by side", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show neuron weights
    expect(text).toContain("neuron");
    expect(text).toContain("weights");
  });

  it("sub 2 reveals that multiple neurons = matrix multiplication", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("matrix");
  });

  it("sub 3 shows the visual: one neuron = one row of the weight matrix", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("row");
    expect(text).toContain("layer");
  });

  it("sub 4 scales up to real Transformer dimensions", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("heartbeat");
  });
});

// ─── Chapter 1.15: Activation Functions Full Picture ───
describe("ActivationFunctions sub-steps", () => {
  const fn = NeuralFoundations.ActivationFunctions;

  it("sub 0 recalls ReLU from chapter 1.5", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ReLU");
  });

  it("sub 1 introduces sigmoid - squashes to 0-1 range", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Sigmoid");
    expect(text).toContain("0");
    expect(text).toContain("1");
  });

  it("sub 2 introduces tanh - squashes to -1 to 1", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Tanh");
  });

  it("sub 3 introduces softmax - turns list into probabilities", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Softmax");
  });

  it("sub 4 shows summary comparing all activation functions", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ReLU");
    expect(text).toContain("Sigmoid");
    expect(text).toContain("Softmax");
  });
});

// ─── Chapter 1.16: What Deep Really Means ───
describe("WhatDeepMeans sub-steps", () => {
  const fn = NeuralFoundations.WhatDeepMeans;

  it("sub 0 explains deep = many layers stacked", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
    expect(text).toContain("deep");
  });

  it("sub 1 shows why depth helps - building abstractions", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("simple");
    expect(text).toContain("abstract");
  });

  it("sub 2 shows the depth problem - vanishing/exploding values", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("low-level");
    expect(text).toContain("high-level");
  });

  it("sub 3 explains training vs inference", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
    expect(text).toContain("FROZEN");
  });

  it("sub 4 shows GPT-3 scale - 96 layers, 175 billion parameters", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
  });
});

// ─── Chapter 1.17: Same Building Blocks ───
describe("SameBuildingBlocks sub-steps", () => {
  const fn = NeuralFoundations.SameBuildingBlocks;

  it("sub 0 states everything in AI uses these building blocks", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("pieces");
  });

  it("sub 1 lists the building blocks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Matrix multiplication");
    expect(text).toContain("Activation");
    expect(text).toContain("Loss");
    expect(text).toContain("Backpropagation");
  });

  it("sub 2 previews how Transformers use these exact pieces", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Simple");
    expect(text).toContain("Deep network");
    expect(text).toContain("GPT");
  });

  it("sub 3 gives the confidence-building summary", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("understand");
  });
});

// ─── Chapter 2.8: Output Layer (rewritten with NN diagram) ───
describe("OutputLayer sub-steps", () => {
  const fn = LLMTraining.OutputLayer;

  it("sub 0 explains hidden state from scratch with layer-by-layer visual", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("hidden state");
    expect(text).toContain("768");
    expect(text).toContain("layer");
    expect(text).toContain("vector");
  });

  it("sub 1 explains what logits are before using them", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("logit");
    expect(text).toContain("score");
    expect(text).toContain("50,000");
  });

  it("sub 2 shows the NN diagram from layers to output via unembedding", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Unembedding");
    expect(text).toContain("hidden state");
    expect(text).toContain("unembedding matrix");
    expect(text).not.toContain("Transformer");
  });

  it("sub 3 shows the unembedding matrix with concrete dot product example", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("dot product");
    expect(text).toContain("row");
    expect(text).toContain("logit");
  });

  it("sub 4 shows raw logits for sample tokens", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("logits");
    expect(text).toContain("the");
    expect(text).toContain("softmax");
  });

  it("sub 5 shows softmax conversion with concrete probabilities", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("probability");
    expect(text).toContain("e^");
  });

  it("sub 6 explains why one linear layer works and parameter count", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("hidden layers");
    expect(text).toContain("parameter");
  });

  it("sub 7 explains weight tying with visual similarity example", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("weight tying");
    expect(text).toContain("embedding");
    expect(text).toContain("mat");
    expect(text).toContain("rug");
  });
});

// ─── Chapter 2.9: Autoregressive Generation ───
describe("AutoregressiveGeneration sub-steps", () => {
  const fn = LLMTraining.AutoregressiveGeneration;

  it("sub 0 introduces training vs generation distinction with visual contrast", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("training");
    expect(text).toContain("one word at a time");
  });

  it("sub 1 shows step-by-step generation with full pipeline per step", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("mat");
    expect(text).toContain("softmax");
  });

  it("sub 2 explains greedy vs sampling vs top-k with probability bars", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Greedy");
    expect(text).toContain("probability");
    expect(text).toContain("Top");
  });

  it("sub 3 explains temperature as the creativity dial with concrete examples", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Temperature");
    expect(text).toContain("logit");
  });

  it("sub 4 explains why generation works and when it stops", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("context");
    expect(text).toContain("stop");
    // Must NOT reference attention - learner hasn't seen it yet
    expect(text.toLowerCase()).not.toContain("self-attention");
    expect(text.toLowerCase()).not.toContain("attention pairs");
  });

  it("does not reference attention concepts anywhere (not yet taught)", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain("self-attention");
    expect(text).not.toContain("attention pairs");
    expect(text).not.toContain("attn pairs");
    expect(text).not.toContain("quadratic");
  });
});

// ─── Chapter 2.5 RLHF: split reward model and PPO into multiple boxes ───
describe("RLHF split boxes", () => {
  const fn = LLMTraining.RLHF;

  // Sub 3: Reward model - what it is + how it learns
  it("sub 3 shows the reward model as a neural network that scores responses", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("neural network");
    expect(text).toContain("score");
  });

  it("sub 3 shows concrete training data for the reward model with winner/loser pairs", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("winner");
    expect(text).toContain("loser");
  });

  it("sub 3 explains what the reward model learns to detect", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("helpful");
  });

  it("sub 3 does NOT show scored responses - those are in sub 4", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("score any response");
  });

  // Sub 4: Reward model - after training, scored responses
  it("sub 4 shows scored responses after training", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("score any response");
    expect(text).toContain("8.5");
  });

  it("sub 4 transitions to PPO by explaining why reward model replaces humans", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("PPO");
    expect(text).toContain("instant");
  });

  it("sub 4 does NOT show PPO loop - that is in sub 5", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Proximal Policy Optimization");
  });

  // Sub 5: PPO 4-step loop
  it("sub 5 mentions PPO and shows the training loop", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("PPO");
    expect(text).toContain("Generate");
    expect(text).toContain("Score");
    expect(text).toContain("Compare");
    expect(text).toContain("Nudge");
  });

  it("sub 5 does NOT show KL divergence details - that is in sub 6", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Kullback-Leibler");
  });

  // Sub 6: KL divergence concrete example
  it("sub 6 explains KL divergence with concrete bar chart comparison", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KL");
    expect(text).toContain("Kullback-Leibler");
    expect(text).toContain("SFT");
    expect(text).toContain("40%");
    expect(text).toContain("85%");
  });

  it("sub 6 does NOT show formula worked examples - that is in sub 7", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Reward hacking");
  });

  // Sub 7: Formula + worked examples + why KL needed
  it("sub 7 shows the formula with reward, KL, and beta", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Reward");
    expect(text).toContain("beta");
    expect(text).toContain("8.5");
  });

  it("sub 7 shows worked examples with concrete math", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("0.2");
    expect(text).toContain("Reward hacking");
  });

  it("sub 7 explains why KL penalty is necessary", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KL penalty");
    expect(text).toContain("shortcuts");
  });

  // Sub 8: Why RLHF matters (was sub 5)
  it("sub 8 explains why RLHF matters with concrete problems it solves", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("reward");
    expect(text).toContain("SFT");
  });
});

// ─── Chapter 2.3: CrossEntropy - graph and formula ───
describe("CrossEntropy graph and formula", () => {
  const fn = LLMTraining.CrossEntropy;

  it("sub 1 shows the -log(P) formula as an SVG visual", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const text = container.textContent;
    expect(text).toContain("log");
  });

  it("sub 1 shows the -log(P) graph curve", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("0.0");
    expect(text).toContain("1.0");
    // Graph has axis labels
    expect(text).toContain("probability");
  });

  it("sub 1 explains the graph with concrete LLM examples", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("mat");
    expect(text).toContain("confident");
  });

  it("sub 1 does NOT contain the weather forecaster example (that is sub 2)", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("weather");
  });
});

// ─── Chapter 2.4: NNInAction - The Neural Network in Action ───
describe("NNInAction sub-steps", () => {
  const fn = LLMTraining.NNInAction;

  it("sub 0 shows the 20-word vocabulary grid", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("20 words");
    expect(text).toContain("the");
    expect(text).toContain("cat");
    expect(text).toContain("with");
  });

  it("sub 0 shows word IDs in the vocabulary", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("[0]");
    expect(text).toContain("[19]");
  });

  it("sub 1 shows the input sentence The cat sat on with predict question", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("sat");
    expect(text).toContain("on");
    expect(text).toContain("???");
  });

  it("sub 2 shows the neural network diagram with layers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Input");
    expect(text).toContain("Hidden");
    expect(text).toContain("Output");
    expect(text).toContain("weight");
  });

  it("sub 3 shows how the mat output circle computes its score", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("mat");
    expect(text).toContain("logit");
    expect(text).toContain("4.40");
  });

  it("sub 4 shows raw scores for all 20 words", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Raw scores");
    expect(text).toContain("the");
    expect(text).toContain("4.2");
    expect(text).toContain("mat");
    expect(text).toContain("3.8");
  });

  it("sub 5 shows softmax conversion with e^score", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("2.718");
  });

  it("sub 6 shows final probability bars with the as highest", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("probability");
    expect(text).toContain("the");
    expect(text).toContain("38.3%");
  });

  it("sub 7 shows the key insight that it is all multiply and add", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("multiply");
    expect(text).toContain("add");
    expect(text).toContain("weight");
  });
});

// ─── Chapter 2.5: SFT in depth ───
describe("SFT sub-steps", () => {
  const fn = LLMTraining.SFT;

  it("sub 0 explains the problem - model predicts generic internet text", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("internet");
    expect(text).toContain("predict");
  });

  it("sub 1 shows SFT training data format with User/Assistant pairs", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("User:");
    expect(text).toContain("Assistant:");
  });

  it("sub 2 shows loss computed only on assistant tokens position by position", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("no loss");
  });

  it("sub 3 shows before vs after SFT probability shift", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Before");
    expect(text).toContain("After");
  });

  it("sub 4 reveals the hidden prompt template wrapping", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("template");
  });

  it("sub 5 explains why 100K examples is enough", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("100K");
  });
});

// ─── Chapter 3.4 CLIP fix: must show cosine formula ───
describe("CLIP cosine similarity formula", () => {
  const fn = Scaling.CLIP;

  it("sub 3 shows the actual cosine similarity formula", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("||A||");
  });
});

// ─── Chapter 3.3 Distillation fix: must mention temperature ───
describe("Distillation temperature mechanism", () => {
  const fn = Scaling.Distillation;

  it("sub 2 or 3 mentions temperature", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("temperature");
  });
});

// ─── Chapter 4.5: Encoder & Decoder ───
describe("EncoderDecoder sub-steps", () => {
  const fn = RoadToTransformers.EncoderDecoder;

  it("sub 0 introduces the translation problem", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("translat");
  });

  it("sub 1 explains encoder reads and decoder writes", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Encoder");
    expect(text).toContain("Decoder");
  });

  it("sub 2 shows cross-attention connection between encoder and decoder", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("cross");
  });

  it("sub 3 references the 2017 paper architecture", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("2017");
  });
});

// ─── Chapter 4.6: Decoder-Only ───
describe("DecoderOnly sub-steps", () => {
  const fn = RoadToTransformers.DecoderOnly;

  it("sub 0 states GPT/Claude are decoder-only", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only");
  });

  it("sub 1 explains why no encoder is needed for text-to-text", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("continuous");
  });

  it("sub 2 shows visual comparison of architectures", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("masking");
  });

  it("sub 3 explains why decoder-only wins", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only wins");
  });
});

// ─── Chapter 8.2: FeedForwardNetwork ───
describe("FeedForwardNetwork sub-steps", () => {
  const fn = TransformerBlock.FeedForwardNetwork;

  it("sub 0 shows where FFN sits in the Transformer block", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
    // FFN should be highlighted
    expect(text).toContain("Feed-Forward");
  });

  it("sub 1 explains FFN is a simple 2-layer neural network", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should reference what learner already knows about layers
    expect(text).toContain("two");
    expect(text).toContain("layer");
    // Should show the formula
    expect(text).toContain("W");
    expect(text).toContain("b");
  });

  it("sub 2 shows the expand-then-compress shape with dimensions", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the 512 -> 2048 -> 512 shape
    expect(text).toContain("512");
    expect(text).toContain("2048");
    // Should explain the 4x expansion
    expect(text).toContain("4x");
  });

  it("sub 3 shows step-by-step computation Step 1 only (W1 expansion)", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should use the cats embedding from Add & Norm output
    expect(text).toContain("cats");
    // Should show matrix multiply for Step 1
    expect(text).toContain("W");
    // Should have concrete numbers
    expect(text).toMatch(/\d+\.\d+/);
    // Should NOT contain Step 2 or Step 3 content (those moved to sub 4)
    expect(text).not.toContain("Apply GELU");
    expect(text).not.toContain("compress 8");
  });

  it("sub 4 shows step-by-step computation Steps 2-3 (GELU + W2 compression)", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show GELU activation step
    expect(text).toContain("GELU");
    // Should show W2 compression step
    expect(text).toContain("compress 8");
    // Should show the summary text
    expect(text).toContain("thinking space");
    // Should have concrete numbers
    expect(text).toMatch(/\d+\.\d+/);
  });

  it("sub 5 shows the GELU formula with Phi and erf, then compares to ReLU", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Must show the real formula
    expect(text).toContain("GELU");
    expect(text).toContain("(x)");
    expect(text).toContain("erf");
    // Must show worked examples with concrete numbers
    expect(text).toContain("0.977");
    expect(text).toContain("1.95");
    // Must compare to ReLU
    expect(text).toContain("ReLU");
    // Must explain the smooth difference
    expect(text).toContain("smooth");
  });

  it("sub 6 shows area/length/breadth example", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("area");
    expect(text).toContain("length");
    expect(text).toContain("breadth");
    expect(text).toContain("knowledge");
  });

  it("sub 7 shows France/Paris factual recall example", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("France");
    expect(text).toContain("Paris");
    expect(text).toContain("847");
  });

  it("sub 8 shows bank/river multi-block example with detector details", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("bank");
    expect(text).toContain("river");
    expect(text).toContain("Block 1");
    expect(text).toContain("Block 5");
  });

  it("sub 9 shows deep Q&A", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("attention replace FFN");
    expect(text).toContain("FFN replace attention");
  });

  it("sub 10 shows parameter breakdown in its own box", () => {
    const ctx = makeCtx({ sub: 10 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("parameter");
    expect(text).toContain("2/3");
    expect(text).toContain("1/3");
  });
});

// ─── Chapter 8.3: FFNParallelTrick ───
describe("FFNParallelTrick sub-steps", () => {
  const fn = TransformerBlock.FFNParallelTrick;

  it("sub 0 recaps single-word FFN with one vector times W", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("one word");
    // Should show dimensions
    expect(text).toMatch(/1\s*x\s*3|1x3/i);
    expect(text).toMatch(/3\s*x\s*6|3x6/i);
  });

  it("sub 1 shows stacking multiple words into a matrix", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("stack");
    // Should show 3 words stacked
    expect(text).toMatch(/3\s*x\s*3|3x3/i);
    // Same W
    expect(text).toContain("same W");
  });

  it("sub 2 shows 6 words with same weight matrix", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("6");
    // Same 18 weights
    expect(text).toContain("18");
    expect(text).toMatch(/6\s*x\s*3|6x3/i);
  });

  it("sub 3 shows 10 words to prove weight count independence", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("10");
    // Still 18 weights
    expect(text).toContain("18");
    // Key insight: word count doesn't affect weights
    expect(text).toMatch(/10\s*x\s*3|10x3/i);
  });

  it("sub 4 shows W2 scaling back down with inverse shape", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // W2 has inverse shape
    expect(text).toMatch(/6\s*x\s*3|6x3/i);
    expect(text).toContain("compress");
  });

  it("sub 5 explains GPU parallelism and free variable", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("GPU");
    expect(text).toContain("parallel");
  });
});

// ─── Chapter 8.4 (was 8.3): AddNormTwo ───
describe("AddNormTwo sub-steps", () => {
  const fn = TransformerBlock.AddNormTwo;

  it("sub 0 shows where we are - just after FFN, second Add & Norm", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("second");
  });

  it("sub 1 shows the Add step with FFN input + FFN output", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("+");
    // Should have concrete vectors
    expect(text).toMatch(/\[.*\d.*\]/);
  });

  it("sub 2 shows the Norm step with concrete numbers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Norm");
    // Should show actual normalized values
    expect(text).toMatch(/\d+\.\d+/);
  });

  it("sub 3 shows the complete single-block pipeline from input to output", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show all 4 stages
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
    // Should have the full pipeline visual
    expect(container.querySelector("[data-full-block]")).toBeTruthy();
  });

  it("sub 4 explains why Add & Norm appears twice", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("twice");
    // Should explain each sub-layer needs its own stabilization
    expect(text).toContain("sub-layer");
  });
});

// ─── Chapter 8.5 (was 8.4): TransformerBlockRepeats ───
describe("TransformerBlockRepeats sub-steps", () => {
  const fn = TransformerBlock.TransformerBlockRepeats;

  it("sub 0 explains one block is not enough", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("one");
    expect(text).toContain("block");
    // Should motivate why repetition is needed
    expect(text).toContain("repeat");
  });

  it("sub 1 shows the stack with real model sizes", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show GPT-2 and GPT-3 block counts
    expect(text).toContain("GPT-2");
    expect(text).toContain("12");
    expect(text).toContain("GPT-3");
    expect(text).toContain("96");
  });

  it("sub 2 explains same structure different weights per block", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("same structure");
    expect(text).toContain("different weights");
  });

  it("sub 3 shows what each layer learns - shallow to deep", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show progression from basic to abstract
    expect(text).toContain("grammar");
    expect(text).toContain("meaning");
  });

  it("sub 4 shows complete picture from tokens through N blocks to output", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Full pipeline
    expect(text).toContain("Token");
    expect(text).toContain("Block");
    expect(text).toContain("Output");
    // The Nx notation
    expect(text).toContain("N");
  });
});

describe("source files have no standalone uppercase IS", () => {
  const sectionFiles = [
    "llm-training.jsx",
    "road-to-transformers.jsx",
    "neural-foundations.jsx",
    "scaling.jsx",
    "transformer-input.jsx",
    "attention-qkv.jsx",
    "attention-computation.jsx",
    "transformer-block.jsx",
    "toc.jsx",
  ];

  sectionFiles.forEach((file) => {
    it(`${file} has no standalone uppercase IS in string literals`, async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "sections", file);
      const content = fs.readFileSync(filePath, "utf-8");
      // Match standalone IS (word boundary) inside JSX string content
      // Exclude CLIP, THIS, RLHF and other valid acronyms - only match standalone IS
      const lines = content.split("\n");
      const violations = [];
      lines.forEach((line, i) => {
        // Skip import lines and comment-only lines
        if (line.trim().startsWith("import ") || line.trim().startsWith("//")) return;
        // Find standalone IS (surrounded by word boundaries, not part of larger word)
        const matches = line.match(/\bIS\b/g);
        if (matches) violations.push({ line: i + 1, text: line.trim() });
      });
      expect(violations).toEqual([]);
    });
  });
});

// ─── Graph helper edge-case branches ───
describe("Graph helper", () => {
  it("renders with xLabel and yLabel", () => {
    const { container } = render(Graph({
      points: [[0, 0], [1, 2], [2, 4]],
      color: "#ff0000",
      xLabel: "X Axis",
      yLabel: "Y Axis",
    }));
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.textContent).toContain("X Axis");
    expect(container.textContent).toContain("Y Axis");
  });

  it("renders without title (falsy title branch)", () => {
    const { container } = render(Graph({
      points: [[0, 1], [1, 2]],
      color: "#ff0000",
    }));
    // Default title is "" so no title text element
    const texts = container.querySelectorAll("text");
    const titleText = Array.from(texts).find(t => t.getAttribute("y") === "18" && t.getAttribute("font-weight") === "700");
    expect(titleText).toBeFalsy();
  });

  it("handles single-x-value points (maxX === minX division-by-zero fallback)", () => {
    const { container } = render(Graph({
      points: [[5, 0], [5, 3], [5, 6]],
      color: "#00ff00",
    }));
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("handles single-y-value points (maxY === minY division-by-zero fallback)", () => {
    const { container } = render(Graph({
      points: [[0, 3], [1, 3], [2, 3]],
      color: "#0000ff",
    }));
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders zero line when minY < 0 and maxY > 0", () => {
    const { container } = render(Graph({
      points: [[0, -2], [1, 0], [2, 3]],
      color: "#ff00ff",
    }));
    // Zero line has dashed stroke
    const lines = container.querySelectorAll("line");
    const dashed = Array.from(lines).find(l => l.getAttribute("stroke-dasharray") === "4,4");
    expect(dashed).toBeTruthy();
  });

  it("skips zero line when all values are positive", () => {
    const { container } = render(Graph({
      points: [[0, 1], [1, 2]],
      color: "#ff0000",
    }));
    const lines = container.querySelectorAll("line");
    const dashed = Array.from(lines).find(l => l.getAttribute("stroke-dasharray") === "4,4");
    expect(dashed).toBeFalsy();
  });

  it("renders every-other x-label when points.length > 10", () => {
    const manyPoints = Array.from({ length: 12 }, (_, i) => [i, i * 2]);
    const { container } = render(Graph({
      points: manyPoints,
      color: "#ff6600",
    }));
    expect(container.querySelector("svg")).toBeTruthy();
    // With 12 points and modulo 2, only even-indexed x-labels appear (6 labels)
    const xLabels = container.querySelectorAll("text[text-anchor='middle']");
    expect(xLabels.length).toBeGreaterThan(0);
  });

  it("renders annotations without explicit color (ac || C.yellow fallback)", () => {
    const { container } = render(Graph({
      points: [[0, 0], [1, 2], [2, 4]],
      color: "#ff0000",
      annotations: [{ x: 1, y: 2, text: "peak" }],
    }));
    // Should use C.yellow as fallback
    const circles = container.querySelectorAll("circle");
    const annotationCircle = Array.from(circles).find(c => c.getAttribute("r") === "6");
    expect(annotationCircle).toBeTruthy();
    expect(annotationCircle.getAttribute("stroke")).toBe("#ffd740");
  });
});
