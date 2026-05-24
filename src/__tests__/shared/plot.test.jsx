import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Graph } from "../../shared/plot.jsx";

describe("Graph (shared/plot.jsx)", () => {
  it("renders an SVG with desc child first", () => {
    const { container } = render(
      <Graph
        points={[
          [0, 0],
          [1, 1],
        ]}
        color="#fff"
        desc="line from origin to one"
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg.firstChild.tagName.toLowerCase()).toBe("desc");
    expect(svg.firstChild.textContent).toBe("line from origin to one");
  });

  it("handles degenerate X range (single x value) without dividing by zero", () => {
    const { container } = render(
      <Graph
        points={[
          [1, 0],
          [1, 1],
        ]}
        color="#fff"
        desc="vertical"
      />,
    );
    expect(container.querySelector("polyline")).not.toBeNull();
  });

  it("handles degenerate Y range (single y value) without dividing by zero", () => {
    const { container } = render(
      <Graph
        points={[
          [0, 5],
          [1, 5],
        ]}
        color="#fff"
        desc="horizontal"
      />,
    );
    expect(container.querySelector("polyline")).not.toBeNull();
  });

  it("draws zero axis when Y spans negative and positive", () => {
    const { container } = render(
      <Graph
        points={[
          [0, -1],
          [1, 1],
        ]}
        color="#fff"
        desc="zero crossing"
      />,
    );
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  it("omits zero axis when Y is all positive", () => {
    const { container } = render(
      <Graph
        points={[
          [0, 1],
          [1, 2],
        ]}
        color="#fff"
        desc="all positive"
      />,
    );
    expect(container.querySelectorAll("line").length).toBe(2);
  });

  it("omits zero axis when Y is all negative", () => {
    const { container } = render(
      <Graph
        points={[
          [0, -2],
          [1, -1],
        ]}
        color="#fff"
        desc="all negative"
      />,
    );
    expect(container.querySelectorAll("line").length).toBe(2);
  });

  it("uses fallback yellow for annotation without color", () => {
    const { container } = render(
      <Graph
        points={[
          [0, 0],
          [1, 1],
        ]}
        color="#fff"
        desc="annot"
        annotations={[{ x: 0, y: 0, text: "A" }]}
      />,
    );
    const annText = [...container.querySelectorAll("text")].find((t) => t.textContent === "A");
    expect(annText).toBeDefined();
  });

  it("uses provided color for annotation when given", () => {
    const { container } = render(
      <Graph
        points={[
          [0, 0],
          [1, 1],
        ]}
        color="#fff"
        desc="annot color"
        annotations={[{ x: 0, y: 0, text: "B", color: "#abc" }]}
      />,
    );
    const annText = [...container.querySelectorAll("text")].find((t) => t.textContent === "B");
    expect(annText).toBeDefined();
  });

  it("renders title, xLabel, yLabel when supplied", () => {
    const { container } = render(
      <Graph
        points={[
          [0, 0],
          [1, 1],
        ]}
        color="#fff"
        desc="labels"
        title="Title"
        xLabel="X"
        yLabel="Y"
      />,
    );
    const texts = [...container.querySelectorAll("text")].map((t) => t.textContent);
    expect(texts).toContain("Title");
    expect(texts).toContain("X");
    expect(texts).toContain("Y");
  });

  it("subsamples x-tick labels when more than 10 points", () => {
    const points = Array.from({ length: 12 }, (_, i) => [i, i]);
    const { container } = render(<Graph points={points} color="#fff" desc="dense" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
