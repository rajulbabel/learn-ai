import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { chapters, sectionNames, sectionColors } from "../../../config.js";
import { makeCtx } from "../../chapter-test-helpers.js";
import TOC from "../../../chapters/table-of-contents/toc.jsx";

afterEach(() => cleanup());

describe("TOC (0)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TOC(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders section list", () => {
    const { container } = render(TOC(makeCtx()));
    expect(container.textContent).toContain("Neural Networks - The Mechanics");
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

  it("clicking the description in an expanded section does not bubble to the window tap-anywhere handler", () => {
    const { container } = render(TOC(makeCtx({ expanded: 1 })));
    const desc = Array.from(container.querySelectorAll("div")).find(
      (d) => d.textContent === "Neuron, layer, weights/biases, linear, ReLU, forward pass" && d.children.length === 0,
    );
    expect(desc).toBeTruthy();
    let bubbledToWindow = false;
    const onWindowClick = () => {
      bubbledToWindow = true;
    };
    window.addEventListener("click", onWindowClick);
    try {
      fireEvent.click(desc);
    } finally {
      window.removeEventListener("click", onWindowClick);
    }
    expect(bubbledToWindow).toBe(false);
  });

  // Data-driven: every section with chapters in config.js must appear in TOC
  const sectionNumbers = [...new Set(chapters.map((c) => c.section).filter((s) => s > 0))].sort((a, b) => a - b);
  sectionNumbers.forEach((secNum) => {
    it(`shows chapters for section ${secNum}`, () => {
      const { container } = render(TOC(makeCtx({ expanded: secNum })));
      expect(container.innerHTML).toBeTruthy();
      expect(container.textContent).toContain(sectionNames[secNum]);
    });
  });

  // Every TOC section's color must match the canonical sectionColors map in config.js.
  // Catches drift between TOC's local color array and config.
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  sectionNumbers.forEach((secNum) => {
    it(`section ${secNum} TOC color matches sectionColors[${secNum}]`, () => {
      const { container } = render(TOC(makeCtx({ expanded: null })));
      const expected = sectionColors[secNum];
      expect(expected).toBeTruthy();
      const html = container.innerHTML.toLowerCase();
      expect(html).toContain(hexToRgb(expected));
    });
  });
});
