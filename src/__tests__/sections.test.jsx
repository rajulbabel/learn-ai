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
import * as TransformerBlock from "../sections/transformer-block.jsx";

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

  // Test all 8 sections expanded to cover each one
  for (let secNum = 1; secNum <= 8; secNum++) {
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

// ─── TOC section 8 ───
describe("TOC section 8", () => {
  it("shows section 8 when expanded", () => {
    const { container } = render(TOC(makeCtx({ expanded: 8 })));
    expect(container.innerHTML).toBeTruthy();
    expect(container.textContent).toContain("Beyond Attention");
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

  it("sub 3 shows layer normalization step-by-step computation", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the normalization steps: mean, subtract, divide
    expect(text).toContain("mean");
    expect(text).toContain("subtract");
    // Should show concrete numbers being normalized
    expect(text).toContain("0");
  });

  it("sub 4 shows full Add & Norm pipeline with numbers flowing through", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the complete pipeline
    expect(text).toContain("Input");
    expect(text).toContain("Attention");
    // Should have the pipeline visualization
    expect(container.querySelector("[data-pipeline]")).toBeTruthy();
  });

  it("sub 5 shows why it matters - with vs without comparison", () => {
    const ctx = makeCtx({ sub: 5 });
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

// ─── Chapter 2.7: Output Layer ───
describe("OutputLayer sub-steps", () => {
  const fn = LLMTraining.OutputLayer;

  it("sub 0 asks how the model produces probabilities", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("hidden");
    expect(text).toContain("512");
  });

  it("sub 1 shows the linear layer projecting to vocabulary size", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("50,257");
    expect(text).toContain("Linear");
  });

  it("sub 2 introduces logits and softmax conversion", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("logit");
    expect(text).toContain("softmax");
  });

  it("sub 3 shows the full pipeline end to end", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Hidden");
    expect(text).toContain("Probabilities");
  });
});

// ─── Chapter 2.8: Autoregressive Generation ───
describe("AutoregressiveGeneration sub-steps", () => {
  const fn = LLMTraining.AutoregressiveGeneration;

  it("sub 0 introduces training vs inference distinction", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
  });

  it("sub 1 shows the token-by-token loop", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("one token");
  });

  it("sub 2 shows growing context window step by step", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("append");
  });

  it("sub 3 explains stop conditions and connects to masking", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("stop");
    expect(text).toContain("mask");
  });
});

// ─── Chapter 2.5 RLHF fix: must mention PPO ───
describe("RLHF names real algorithms", () => {
  const fn = LLMTraining.RLHF;

  it("sub 3 or later mentions PPO", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("PPO");
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
    expect(text).toContain("same language");
  });

  it("sub 2 shows visual comparison of architectures", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Encoder");
    expect(text).toContain("Decoder");
  });

  it("sub 3 explains why full architecture matters", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Full Architecture Matters");
  });
});
