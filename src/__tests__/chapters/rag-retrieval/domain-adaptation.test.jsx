import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DomainAdaptation from "../../../chapters/rag-retrieval/domain-adaptation.jsx";

afterEach(() => cleanup());

describe("DomainAdaptation (12.15)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DomainAdaptation(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(DomainAdaptation(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(DomainAdaptation(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(DomainAdaptation(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(DomainAdaptation(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows the off-the-shelf gap on domain pairs", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/off-the-shelf|off the shelf/i);
    expect(container.textContent).toMatch(/MI|tPA|medical|legal|code/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=1 shows triplet loss formula with anchor positive negative", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/triplet/i);
    expect(container.textContent).toMatch(/anchor/i);
    expect(container.textContent).toMatch(/positive/i);
    expect(container.textContent).toMatch(/negative/i);
    expect(container.textContent).toMatch(/margin/i);
  });

  it("sub=1 'Anchor (Query)' label sits clear of the Push-Away arrow", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 1 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) => s.textContent.includes("Anchor (Query)"));
    expect(svg).not.toBeNull();
    const anchorLabel = Array.from(svg.querySelectorAll("text")).find((t) => t.textContent.trim() === "Anchor (Query)");
    expect(anchorLabel).not.toBeNull();
    const labelY = +anchorLabel.getAttribute("y");
    expect(labelY, `anchor label y=${labelY}, expected >= 180`).toBeGreaterThanOrEqual(180);
  });

  it("sub=1 Pull/Push lines start at A circle boundary, not its center", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 1 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) => s.textContent.includes("Anchor (Query)"));
    const aCircle = Array.from(svg.querySelectorAll("circle")).find(
      (c) => c.getAttribute("r") === "14" && c.getAttribute("cx") === "260",
    );
    expect(aCircle).not.toBeNull();
    const cx = +aCircle.getAttribute("cx");
    const cy = +aCircle.getAttribute("cy");
    const r = +aCircle.getAttribute("r");
    const lines = Array.from(svg.querySelectorAll("line")).filter((l) =>
      ["#a5d6a7", "#ef9a9a"].includes(l.getAttribute("stroke")),
    );
    expect(lines.length).toBe(2);
    for (const l of lines) {
      const dx = +l.getAttribute("x1") - cx;
      const dy = +l.getAttribute("y1") - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      expect(
        dist,
        `line (${l.getAttribute("stroke")}) starts ${dist.toFixed(1)}vb from A center, expected ~${r}`,
      ).toBeGreaterThanOrEqual(r - 0.5);
    }
  });

  it("sub=2 shows training pair construction with hard negatives", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hard negative/i);
    expect(container.textContent).toMatch(/reset my password|sign in|cancel/i);
  });

  it("sub=3 names the when-to-fine-tune decision rules", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/specialized|domain/i);
    expect(container.textContent).toMatch(/80%|0\.80/);
    expect(container.textContent).toMatch(/5k|5000|5,000/i);
    expect(container.textContent).toMatch(/fine-?tun/i);
  });

  it("sub=4 shows before vs after recall/MRR delta on support corpus", () => {
    const { container } = render(DomainAdaptation(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recall|MRR/i);
    expect(container.textContent).toMatch(/before|after|off-the-shelf|fine-?tuned/i);
    expect(container.textContent).toMatch(/cost|\$/);
  });
});
