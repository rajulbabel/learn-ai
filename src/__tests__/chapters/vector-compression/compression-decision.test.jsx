import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CompressionDecision from "../../../chapters/vector-compression/compression-decision.jsx";

afterEach(() => cleanup());

describe("CompressionDecision (16.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CompressionDecision(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames the four decision axes", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/five techniques|five ways|which one/i);
    expect(container.textContent).toMatch(/corpus size|N/);
    expect(container.textContent).toMatch(/dimension|dim/i);
    expect(container.textContent).toMatch(/DB|database|support/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 renders the decision tree with four N-range branches and DB gate table", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/MRL|Matryoshka/);
    expect(container.textContent).toMatch(/N < 1M|under 1M/i);
    expect(container.textContent).toMatch(/Skip|no quantization/i);
    expect(container.textContent).toMatch(/1M.*10M/);
    expect(container.textContent).toMatch(/Scalar|int8|SQ/);
    expect(container.textContent).toMatch(/10M.*100M/);
    expect(container.textContent).toMatch(/Binary|BQ/);
    expect(container.textContent).toMatch(/rescore|rescoring/i);
    expect(container.textContent).toMatch(/100M/);
    expect(container.textContent).toMatch(/HNSW.*PQ|PQ/);
    expect(container.textContent).toMatch(/pgvector/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Pinecone/);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg.querySelector("desc")).toBeTruthy();
  });

  it("sub=1 flowchart SVG has horizontal connector at y=200 and drop-lines to bucket centers", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 1 })));
    const lines = Array.from(container.querySelectorAll("svg line"));
    const horizontalConnector = lines.find(
      (l) =>
        l.getAttribute("y1") === "200" &&
        l.getAttribute("y2") === "200" &&
        l.getAttribute("x1") === "80" &&
        l.getAttribute("x2") === "560",
    );
    expect(horizontalConnector, "expected a horizontal connector at y=200 from x=80 to x=560").toBeTruthy();
    for (const cx of [80, 240, 400, 560]) {
      const dropLine = lines.find(
        (l) =>
          l.getAttribute("x1") === String(cx) &&
          l.getAttribute("x2") === String(cx) &&
          l.getAttribute("y1") === "200" &&
          l.getAttribute("y2") === "240",
      );
      expect(dropLine, `expected drop-line from bucket center x=${cx} y=200 to y=240`).toBeTruthy();
    }
  });

  it("sub=1 MRL pre-step is centered horizontally above the Inputs box", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    const texts = Array.from(svg.querySelectorAll("text"));
    const mrlText = texts.find((t) => /MRL pre-step/i.test(t.textContent));
    const inputsText = texts.find((t) => /Inputs:/.test(t.textContent));
    expect(mrlText, "expected MRL pre-step label to render").toBeTruthy();
    expect(inputsText, "expected Inputs label to render").toBeTruthy();
    const svgCenterX = 320;
    expect(
      Math.abs(parseFloat(mrlText.getAttribute("x")) - svgCenterX),
      "MRL label must sit on the SVG's horizontal center",
    ).toBeLessThan(5);
    expect(
      Math.abs(parseFloat(inputsText.getAttribute("x")) - svgCenterX),
      "Inputs label must sit on the SVG's horizontal center",
    ).toBeLessThan(5);
    expect(parseFloat(mrlText.getAttribute("y")), "MRL must sit above Inputs vertically").toBeLessThan(
      parseFloat(inputsText.getAttribute("y")),
    );
  });

  it("sub=2 walks four worked scenarios with concrete memory numbers", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/500K|500,000/);
    expect(container.textContent).toMatch(/6 GB|6GB/);
    expect(container.textContent).toMatch(/50M|50,000,000/);
    expect(container.textContent).toMatch(/10 GB|10GB|9\.6/);
    expect(container.textContent).toMatch(/300 GB|300GB|307/);
    expect(container.textContent).toMatch(/5M|5,000,000/);
    expect(container.textContent).toMatch(/20 GB|20GB|5 GB|5GB/);
    expect(container.textContent).toMatch(/SQ \(int8\)|HNSW \+ SQ/);
    expect(container.textContent).toMatch(/200M|200,000,000/);
    expect(container.textContent).toMatch(/19 GB|19GB|820 GB/);
    expect(container.textContent).toMatch(/OpenAI|text-embedding-3/);
    expect(container.textContent).toMatch(/BGE/);
    expect(container.textContent).toMatch(/Qdrant/);
  });

  it("sub=2 every scenario result names HNSW so readers don't infer it's only for massive scale", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 2 })));
    const titles = [
      "Startup - the skip path",
      "Mid-scale - the SQ default",
      "Growing product - the high-leverage path",
      "Massive scale - the HNSW+PQ default",
    ];
    titles.forEach((title) => {
      const titleEl = Array.from(container.querySelectorAll("*")).find((n) => n.textContent === title);
      expect(titleEl, `expected scenario title to render: ${title}`).toBeTruthy();
      const card = titleEl.closest("div[style*='border-radius']");
      expect(card, `scenario card not found for: ${title}`).toBeTruthy();
      expect(card.textContent, `scenario card should name HNSW: ${title}`).toMatch(/HNSW/);
    });
  });

  it("sub=3 lists five heuristics and four traps to avoid", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/memory bites|quantize until/i);
    expect(container.textContent).toMatch(/MRL is free|always apply/i);
    expect(container.textContent).toMatch(/DB first|database first/i);
    expect(container.textContent).toMatch(/Rescor(e|ing) is.*free|rescor.*default/i);
    expect(container.textContent).toMatch(/measure recall|your own data/i);
    expect(container.textContent).toMatch(/traps|avoid/i);
    expect(container.textContent).toMatch(/BQ at d.*256|d <= 256/i);
    expect(container.textContent).toMatch(/skip(ping)? MRL/i);
    expect(container.textContent).toMatch(/stacking|without measuring/i);
    expect(container.textContent).toMatch(/disabl.*rescor/i);
  });

  it("sub=3 heuristics/traps grid uses responsive auto-fit columns for mobile readability", () => {
    const { container } = render(CompressionDecision(makeCtx({ sub: 3 })));
    const heuristicsTitle = Array.from(container.querySelectorAll("*")).find(
      (n) => n.textContent === "Five rules of thumb",
    );
    expect(heuristicsTitle, "expected the 'Five rules of thumb' title to render in Sub 3").toBeTruthy();
    let node = heuristicsTitle.parentElement;
    let gridAncestor = null;
    while (node) {
      const style = node.getAttribute("style") || "";
      if (style.includes("display: grid") && style.includes("grid-template-columns")) {
        gridAncestor = node;
        break;
      }
      node = node.parentElement;
    }
    expect(gridAncestor, "expected the heuristics title to live inside a CSS grid ancestor").toBeTruthy();
    const gridStyle = gridAncestor.getAttribute("style") || "";
    expect(
      gridStyle,
      `expected Sub 3 outer grid to use responsive auto-fit minmax(280px, 1fr); got style="${gridStyle}"`,
    ).toMatch(/auto-fit/);
    expect(gridStyle).toMatch(/minmax\(280px/);
  });
});
