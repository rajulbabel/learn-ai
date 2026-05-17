import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FormulaBox, CapstoneDecisionCard } from "../../shared/rag-helpers.jsx";

describe("rag-helpers", () => {
  it("FormulaBox renders a div with the children inside", () => {
    const { container, getByText } = render(<FormulaBox color="#80deea">formula content</FormulaBox>);
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild.tagName).toBe("DIV");
    expect(getByText("formula content")).toBeDefined();
  });

  it("FormulaBox applies the color tint to background and border", () => {
    const { container } = render(<FormulaBox color="#ff0000">x</FormulaBox>);
    const div = container.firstChild;
    // JSDOM normalizes hex colors to rgba; check the rgb channel from "#ff0000".
    expect(div.style.background).toMatch(/255,\s*0,\s*0/);
    expect(div.style.border).toMatch(/255,\s*0,\s*0/);
  });

  it("CapstoneDecisionCard renders three columns: Choice, Why, Tradeoff", () => {
    const { container, getByText } = render(
      <CapstoneDecisionCard
        color="#80deea"
        accent="#ffffff"
        choice="Test Choice"
        why="Test Why"
        tradeoff="Test Tradeoff"
      />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(getByText("Choice")).toBeDefined();
    expect(getByText("Why")).toBeDefined();
    expect(getByText("Tradeoff")).toBeDefined();
    expect(getByText("Test Choice")).toBeDefined();
    expect(getByText("Test Why")).toBeDefined();
    expect(getByText("Test Tradeoff")).toBeDefined();
  });
});
