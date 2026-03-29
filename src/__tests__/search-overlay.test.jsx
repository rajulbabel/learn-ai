import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import SearchOverlay from "../search-overlay.jsx";

// Mock search.js
vi.mock("../search.js", () => ({
  initSearch: vi.fn(() => Promise.resolve()),
  search: vi.fn(() => Promise.resolve([])),
  searchText: vi.fn(() => []),
  getSearchStatus: vi.fn(() => ({ mode: "off", progress: 0 })),
}));

// jsdom doesn't implement scrollIntoView
beforeAll(() => {
  if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

afterEach(() => cleanup());

// Standard multi-result set for keyboard navigation tests
const threeResults = [
  {
    chapterId: "5.1",
    title: "The Full Architecture",
    section: 5,
    sectionName: "Transformer Input Pipeline",
    sub: 0,
    text: "The complete Transformer diagram.",
    source: "text",
    score: 25.0,
  },
  {
    chapterId: "7.8",
    title: "The Full Formula",
    section: 7,
    sectionName: "Attention - The Full Computation",
    sub: 0,
    text: "Attention full formula.",
    source: "text",
    score: 18.5,
  },
  {
    chapterId: "7.17",
    title: "The Complete Picture",
    section: 7,
    sectionName: "Attention - The Full Computation",
    sub: 0,
    text: "The complete picture in plain English.",
    source: "text",
    score: 12.0,
  },
];

// Results with some below threshold (< 20% of max)
const mixedScoreResults = [
  {
    chapterId: "5.1",
    title: "The Full Architecture",
    section: 5,
    sectionName: "Transformer Input Pipeline",
    sub: 0,
    text: "The complete Transformer diagram.",
    source: "text",
    score: 30.0,
  },
  {
    chapterId: "7.8",
    title: "The Full Formula",
    section: 7,
    sectionName: "Attention - The Full Computation",
    sub: 0,
    text: "Attention full formula.",
    source: "text",
    score: 10.0,
  },
  {
    chapterId: "1.1",
    title: "What is a Neural Network?",
    section: 1,
    sectionName: "Neural Network Foundations",
    sub: 0,
    text: "An introduction to neural networks.",
    source: "text",
    score: 3.0, // 10% of max - below threshold
  },
  {
    chapterId: "2.1",
    title: "Tokenization",
    section: 2,
    sectionName: "How LLMs Actually Train",
    sub: 0,
    text: "Breaking words into tokens.",
    source: "text",
    score: 1.0, // 3.3% of max - well below threshold
  },
];

// Helper to set up search mocks with given results (array or single)
async function setupSearchMock(resultOrArray) {
  const mod = await import("../search.js");
  const results = Array.isArray(resultOrArray) ? resultOrArray : [resultOrArray];
  mod.searchText.mockReturnValue(results);
  mod.search.mockResolvedValue(results);
  return mod;
}

// Helper: type a query and wait for debounced results
async function typeAndWait(input, query) {
  await act(async () => {
    fireEvent.change(input, { target: { value: query } });
    await new Promise((r) => setTimeout(r, 300));
  });
}

// ── Sub clamping tests ──

describe("SearchOverlay handleSelect", () => {
  it("clamps negative sub values to 0 when selecting a result", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();

    await setupSearchMock({
      chapterId: "5.1",
      title: "The Full Architecture",
      section: 5,
      sectionName: "Transformer Input Pipeline",
      sub: -1,
      text: "Transformer Input Pipeline: The Full Architecture.",
      source: "text",
      score: 20,
    });

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "Full Architecture");

    const resultBtn = screen.getByText("The Full Architecture");
    await act(async () => {
      fireEvent.click(resultBtn.closest("button"));
    });

    expect(onGoTo).toHaveBeenCalledTimes(1);
    const [, sub] = onGoTo.mock.calls[0];
    expect(sub).toBe(0);
  });

  it("preserves positive sub values when selecting a result", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();

    await setupSearchMock({
      chapterId: "5.1",
      title: "The Full Architecture",
      section: 5,
      sectionName: "Transformer Input Pipeline",
      sub: 3,
      text: "Some content at sub 3.",
      source: "text",
      score: 20,
    });

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "Full Architecture");

    const resultBtn = screen.getByText("The Full Architecture");
    await act(async () => {
      fireEvent.click(resultBtn.closest("button"));
    });

    expect(onGoTo).toHaveBeenCalledTimes(1);
    const [, sub] = onGoTo.mock.calls[0];
    expect(sub).toBe(3);
  });

  it("defaults undefined sub to 0 when selecting a result", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();

    await setupSearchMock({
      chapterId: "5.1",
      title: "The Full Architecture",
      section: 5,
      sectionName: "Transformer Input Pipeline",
      sub: undefined,
      text: "Some content.",
      source: "text",
      score: 20,
    });

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "Full Architecture");

    const resultBtn = screen.getByText("The Full Architecture");
    await act(async () => {
      fireEvent.click(resultBtn.closest("button"));
    });

    expect(onGoTo).toHaveBeenCalledTimes(1);
    const [, sub] = onGoTo.mock.calls[0];
    expect(sub).toBe(0);
  });
});

// ── Keyboard navigation tests ──

describe("SearchOverlay keyboard navigation", () => {
  it("ArrowDown moves highlight to first result", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    const buttons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    expect(buttons[0].getAttribute("data-active")).toBe("true");
    expect(buttons[1].getAttribute("data-active")).toBe("false");
  });

  it("ArrowDown wraps from last result back to first", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowDown" }); // wraps to first
    });

    const buttons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    expect(buttons[0].getAttribute("data-active")).toBe("true");
  });

  it("ArrowUp from first result wraps to last", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" }); // go to first (index 0)
      fireEvent.keyDown(input, { key: "ArrowUp" }); // wrap to last
    });

    const buttons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    expect(buttons[buttons.length - 1].getAttribute("data-active")).toBe("true");
  });

  it("Enter selects the highlighted result", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
    }); // highlight first
    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    }); // select it

    expect(onGoTo).toHaveBeenCalledTimes(1);
    const [idx] = onGoTo.mock.calls[0];
    expect(idx).toBeGreaterThanOrEqual(0);
  });

  it("Enter with no highlight and no results does nothing", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    const mod = await import("../search.js");
    mod.searchText.mockReturnValue([]);
    mod.search.mockResolvedValue([]);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");

    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(onGoTo).not.toHaveBeenCalled();
  });

  it("highlight resets when query changes", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    await typeAndWait(input, "attention");

    const buttons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    const anyActive = buttons.some((b) => b.getAttribute("data-active") === "true");
    expect(anyActive).toBe(false);
  });

  it("ArrowDown scrolls the highlighted result into view", async () => {
    const onGoTo = vi.fn();
    const onClose = vi.fn();
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    const buttons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    buttons.forEach((b) => {
      b.scrollIntoView = vi.fn();
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    expect(buttons[0].scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  });
});

// ── Styling tests ──

describe("SearchOverlay search bar styling", () => {
  it("renders the search input inside a gradient border wrapper", async () => {
    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const wrapper = document.querySelector("[data-search-bar]");
    expect(wrapper).toBeTruthy();
    expect(wrapper.style.padding).toBeTruthy();
    expect(wrapper.style.borderRadius).toBeTruthy();
  });

  it("shows rainbow gradient border when semantic search is active", async () => {
    const mod = await import("../search.js");
    mod.getSearchStatus.mockReturnValue({ mode: "semantic", progress: 100 });

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const rainbow = document.querySelector("[data-search-rainbow]");
    expect(rainbow).toBeTruthy();
    expect(rainbow.style.background).toContain("linear-gradient");
  });

  it("does not show rainbow gradient when semantic is not ready", async () => {
    const mod = await import("../search.js");
    mod.getSearchStatus.mockReturnValue({ mode: "text", progress: 0 });

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const rainbow = document.querySelector("[data-search-rainbow]");
    expect(rainbow).toBeFalsy();
  });

  it("input inner container has dark background matching main page style", async () => {
    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const inner = document.querySelector("[data-search-inner]");
    expect(inner).toBeTruthy();
    expect(inner.style.backgroundColor).toBe("rgb(13, 11, 20)"); // #0d0b14
  });

  it("has a search icon SVG inside the input area", async () => {
    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const inner = document.querySelector("[data-search-inner]");
    const svg = inner?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg.querySelector("circle")).toBeTruthy();
  });

  it("results container width matches the search bar width", async () => {
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    const resultsContainer = document.querySelector("[data-search-results]");
    expect(resultsContainer).toBeTruthy();
    // maxWidth should match the search bar wrapper (600px)
    expect(resultsContainer.style.maxWidth).toBe("600px");
    // No horizontal padding that would make cards narrower than the bar
    expect(resultsContainer.style.paddingLeft).toBe("0px");
    expect(resultsContainer.style.paddingRight).toBe("0px");
  });

  it("search header is sticky at top of overlay", async () => {
    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const header = document.querySelector("[data-search-header]");
    expect(header).toBeTruthy();
    expect(header.style.position).toBe("sticky");
    expect(header.style.top).toBe("0px");
  });
});

// ── Score display and threshold filtering tests ──

describe("SearchOverlay score display and filtering", () => {
  it("shows search score on each result as a number out of 10", async () => {
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    // Top result should show "Search Score: 10.0" (normalized to top)
    const badges = document.querySelectorAll("[data-score]");
    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0].textContent).toContain("Search Score:");
    expect(badges[0].textContent).toContain("10.0");
  });

  it("normalizes scores to 0-10 scale relative to top result", async () => {
    await setupSearchMock(threeResults);

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    const badges = document.querySelectorAll("[data-score]");
    // Second result: 18.5/25 * 10 = 7.4
    expect(badges[1].textContent).toContain("Search Score:");
    expect(badges[1].textContent).toContain("7.4");
    // Third result: 12/25 * 10 = 4.8
    expect(badges[2].textContent).toContain("Search Score:");
    expect(badges[2].textContent).toContain("4.8");
  });

  it("filters out results below 1.5 score (15% of 10)", async () => {
    await setupSearchMock(mixedScoreResults);

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    const resultButtons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    // Only 2 results should pass: 30.0 (10.0) and 10.0 (3.3)
    // Filtered: 3.0 (1.0) and 1.0 (0.3)
    expect(resultButtons.length).toBe(2);
    expect(screen.getByText("The Full Architecture")).toBeTruthy();
    expect(screen.getByText("The Full Formula")).toBeTruthy();
    expect(screen.queryByText("What is a Neural Network?")).toBeNull();
    expect(screen.queryByText("Tokenization")).toBeNull();
  });

  it("always shows at least 1 result even if scores are low", async () => {
    await setupSearchMock([
      {
        chapterId: "1.1",
        title: "What is a Neural Network?",
        section: 1,
        sectionName: "Neural Network Foundations",
        sub: 0,
        text: "An introduction.",
        source: "text",
        score: 0.5,
      },
    ]);

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "xyz");

    const resultButtons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    expect(resultButtons.length).toBe(1);
  });

  it("handles results with missing score gracefully", async () => {
    await setupSearchMock([
      {
        chapterId: "5.1",
        title: "The Full Architecture",
        section: 5,
        sectionName: "Transformer Input Pipeline",
        sub: 0,
        text: "The complete Transformer.",
        source: "text",
        // no score field
      },
    ]);

    render(<SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search chapters, concepts, formulas...");
    await typeAndWait(input, "full");

    // Should still render without crashing
    const resultButtons = screen.getAllByRole("button").filter((b) => b.getAttribute("data-result") != null);
    expect(resultButtons.length).toBe(1);
  });
});
