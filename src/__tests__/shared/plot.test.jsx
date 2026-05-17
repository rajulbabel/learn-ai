import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Graph } from "../../shared/plot.jsx";

describe("Graph (shared/plot.jsx)", () => {
  it("renders an SVG with desc child first", () => {
    const { container } = render(
      <Graph points={[[0, 0], [1, 1]]} color="#fff" desc="line from origin to one" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg.firstChild.tagName.toLowerCase()).toBe("desc");
    expect(svg.firstChild.textContent).toBe("line from origin to one");
  });
});
