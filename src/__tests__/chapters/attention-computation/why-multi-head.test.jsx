import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyMultiHead from "../../../chapters/attention-computation/why-multi-head.jsx";

afterEach(() => cleanup());

describe("WhyMultiHead (7.9)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyMultiHead(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyMultiHead(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyMultiHead(makeCtx({ sub: 2 })))).not.toThrow();
  });
});

describe("WhyMultiHead compromise bar labels", () => {
  it("label minWidth accommodates 'last week' without wrapping", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(WhyMultiHead(ctx));
    // Find the bar label spans (minWidth on the word labels)
    const labels = container.querySelectorAll("span[style*='text-align: right']");
    const lastWeekLabel = Array.from(labels).find((el) => el.textContent === "last week");
    expect(lastWeekLabel).toBeTruthy();
    // minWidth should be at least 70px to fit "last week"
    const minWidth = parseInt(lastWeekLabel.style.minWidth, 10);
    expect(minWidth).toBeGreaterThanOrEqual(70);
  });
});

describe("WhyMultiHead head boxes alignment", () => {
  it("head boxes use consistent grid with aligned columns", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(WhyMultiHead(ctx));
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
    const { container } = render(WhyMultiHead(ctx));
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
    const { container } = render(WhyMultiHead(ctx));
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
