import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HighlightedJson, monoArtifact } from "../../shared/agent-helpers.jsx";

describe("agent-helpers", () => {
  it("HighlightedJson renders a div with monospaced lines", () => {
    const { container } = render(
      <HighlightedJson
        json={'{\n  "type": "tool_use",\n  "name": "lookup"\n}'}
        fields={[{ key: "name", soft: "#80deea" }]}
        soft="#cccccc"
      />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild.tagName).toBe("DIV");
    // The component splits on newlines and renders one div per line.
    // The JSON above has 3 newlines, so 4 lines: '{', '  "type": ...', '  "name": ...', '}'.
    expect(container.firstChild.children.length).toBe(4);
  });

  it("HighlightedJson colors lines that match a field key", () => {
    const { container } = render(
      <HighlightedJson
        json={'"name": "lookup"\n"other": 1'}
        fields={[{ key: "name", soft: "#ff0000" }]}
        soft="#cccccc"
      />,
    );
    // First child should use the field-matched color.
    const firstLine = container.firstChild.children[0];
    expect(firstLine.style.color).toMatch(/255,\s*0,\s*0/);
  });

  it("monoArtifact returns an object that extends tintedCard styles", () => {
    const ma = monoArtifact("#abcdef");
    expect(ma).toBeTypeOf("object");
    expect(ma.padding).toBe(14);
    expect(ma.fontFamily).toMatch(/monospace/);
    expect(ma.textAlign).toBe("center");
    // tintedCard supplies background/border tinted with the color.
    expect(ma.background).toBeDefined();
    expect(ma.border).toBeDefined();
  });

  it("monoArtifact merges extra style overrides on top", () => {
    const ma = monoArtifact("#abcdef", { padding: 20, color: "red" });
    expect(ma.padding).toBe(20);
    expect(ma.color).toBe("red");
  });
});
