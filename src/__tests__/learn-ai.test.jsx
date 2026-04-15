import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { chapters } from "../config.js";

// Mock all dynamic imports so the component renders synchronously in tests
vi.mock("../sections/toc.jsx", () => ({
  TOC: () => <div data-testid="toc">TOC</div>,
}));
vi.mock("../sections/neural-foundations.jsx", () => ({
  WhatIsNN: (ctx) => (
    <div>
      <div>WhatIsNN</div>
      {ctx.sub >= 1 && (
        <div data-reveal="true" data-testid="reveal-1">
          Reveal 1
        </div>
      )}
      {ctx.sub >= 2 && (
        <div data-reveal="true" data-testid="reveal-2">
          Reveal 2
        </div>
      )}
      <button data-subbtn="true" data-testid="subbtn">
        Continue
      </button>
    </div>
  ),
}));
vi.mock("../sections/llm-training.jsx", () => ({
  BatchTraining: () => <div data-testid="batch-training">BatchTraining</div>,
}));
vi.mock("../sections/scaling.jsx", () => ({
  ParametersAtScale: () => <div data-testid="parameters-at-scale">ParametersAtScale</div>,
}));
vi.mock("../sections/road-to-transformers.jsx", () => ({}));
vi.mock("../sections/transformer-input.jsx", () => ({}));
vi.mock("../sections/attention-qkv.jsx", () => ({}));
vi.mock("../sections/attention-computation.jsx", () => ({}));
vi.mock("../sections/transformer-block.jsx", () => ({}));
vi.mock("../search-overlay.jsx", () => ({
  default: () => <div data-testid="search-overlay">Search Overlay</div>,
}));
vi.mock("../search.js", () => ({
  initSearch: vi.fn(() => Promise.resolve()),
  getSearchStatus: vi.fn(() => ({ mode: "off", progress: 0 })),
  search: vi.fn(() => Promise.resolve([])),
  searchText: vi.fn(() => []),
}));
vi.mock("../nav-persistence.js", () => ({
  saveNav: vi.fn(),
  loadNav: vi.fn(() => null),
}));

afterEach(async () => {
  cleanup();
  const navMod = await import("../nav-persistence.js");
  navMod.loadNav.mockReturnValue(null);
  const searchMod = await import("../search.js");
  searchMod.getSearchStatus.mockReturnValue({ mode: "off", progress: 0 });
});

// Helper: render LearnAI and wait for async chapter load
async function renderLearnAI() {
  const mod = await import("../learn-ai.jsx");
  const LearnAI = mod.default;
  let result;
  await act(async () => {
    result = render(<LearnAI />);
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 50));
  });
  return result;
}

describe("LearnAI search bar", () => {
  it("renders a search button with aria-label 'Search'", async () => {
    await renderLearnAI();
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
  });

  it("search bar is inside header", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.closest("header")).toBeTruthy();
  });

  it("search bar contains placeholder text and search icon", async () => {
    await renderLearnAI();
    expect(screen.getByText("Search chapters, concepts, formulas...")).toBeTruthy();
    const btn = screen.getByRole("button", { name: "Search" });
    const svg = btn.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg.querySelector("circle")).toBeTruthy();
  });

  it("shows Ctrl+K shortcut on non-Mac desktop", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.textContent).toContain("Ctrl+K");
  });

  it("has dim purple border when semantic is off", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.style.background).toContain("rgba(167, 139, 250, 0.25)");
  });

  it("shows static purple background when semantic is loading (no progress indicator)", async () => {
    const searchMod = await import("../search.js");
    searchMod.getSearchStatus.mockReturnValue({ mode: "loading", progress: 50 });

    await renderLearnAI();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600));
    });

    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.style.background).toBe("rgba(167, 139, 250, 0.25)");
    expect(btn.style.background).not.toContain("linear-gradient");
  });

  it("shows rainbow sweep overlay when semantic is ready", async () => {
    const searchMod = await import("../search.js");
    searchMod.getSearchStatus.mockReturnValue({ mode: "semantic", progress: 100 });

    await renderLearnAI();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600));
    });

    const btn = screen.getByRole("button", { name: "Search" });
    const rainbow = btn.querySelector("[data-search-rainbow]");
    expect(rainbow).toBeTruthy();
    expect(rainbow.style.animation).toContain("searchRainbowFade");
  });

  it("inner div has dark background and rounded corners", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    const inner = btn.querySelector("[data-search-inner]");
    expect(inner).toBeTruthy();
    expect(inner.style.borderRadius).toBe("7.5px");
  });

  it("outer div has rounded corners", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.style.borderRadius).toBe("9px");
  });

  it("wrapper has marginTop spacing", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn.parentElement.style.marginTop).toBe("12px");
  });

  it("opens search overlay on click", async () => {
    await renderLearnAI();
    const btn = screen.getByRole("button", { name: "Search" });
    await act(async () => {
      fireEvent.click(btn);
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(screen.getByTestId("search-overlay")).toBeTruthy();
  });

  it("opens search overlay on Ctrl+K", async () => {
    await renderLearnAI();
    await act(async () => {
      fireEvent.keyDown(window, { key: "k", ctrlKey: true });
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(screen.getByTestId("search-overlay")).toBeTruthy();
  });
});

describe("LearnAI auto-scroll on Continue", () => {
  it("scrolls to the midpoint between the previous box's bottom and the new box's top", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    // Ensure we're testing absolute scroll-y, not relative to current viewport scroll.
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });

    const navMod = await import("../nav-persistence.js");
    const ch1Idx = chapters.findIndex((c) => c.id === "1.1");
    // sub=2 means two reveals are in the DOM; we test the midpoint computation between them.
    navMod.loadNav.mockReturnValue({ ch: ch1Idx, sub: 2 });

    await renderLearnAI();

    // Mock getBoundingClientRect on each reveal so we can predict the midpoint deterministically.
    const rect = (top, bottom) => ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top });
    const reveal1 = screen.getByTestId("reveal-1");
    const reveal2 = screen.getByTestId("reveal-2");
    reveal1.getBoundingClientRect = () => rect(100, 200);
    reveal2.getBoundingClientRect = () => rect(300, 400);

    // Wait past the 200ms setTimeout inside the effect.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(scrollTo).toHaveBeenCalled();
    const lastCall = scrollTo.mock.calls[scrollTo.mock.calls.length - 1];
    // Midpoint = (reveal1.bottom 200 + reveal2.top 300) / 2 = 250. window.scrollY = 0.
    expect(lastCall[0]).toEqual({ top: 250, behavior: "smooth" });
  });

  it("falls back to a small offset above the new box when no previous reveal exists (sub=1)", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });

    const navMod = await import("../nav-persistence.js");
    const ch1Idx = chapters.findIndex((c) => c.id === "1.1");
    navMod.loadNav.mockReturnValue({ ch: ch1Idx, sub: 1 });

    await renderLearnAI();

    const rect = (top, bottom) => ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top });
    const reveal1 = screen.getByTestId("reveal-1");
    reveal1.getBoundingClientRect = () => rect(500, 800);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(scrollTo).toHaveBeenCalled();
    const lastCall = scrollTo.mock.calls[scrollTo.mock.calls.length - 1];
    // First reveal: fall back to reveal.top - 40 (small breathing offset) = 500 - 40 = 460
    expect(lastCall[0]).toEqual({ top: 460, behavior: "smooth" });
  });
});

describe("LearnAI chapter loading", () => {
  it("loads chapter 3.3 from the combined section 3 modules instead of reusing chapter 3.2", async () => {
    const navMod = await import("../nav-persistence.js");
    const chapter32 = chapters.findIndex((c) => c.id === "3.2");
    navMod.loadNav.mockReturnValue({ ch: chapter32, sub: 0 });

    await renderLearnAI();
    expect(screen.getByTestId("parameters-at-scale")).toBeTruthy();

    await act(async () => {
      fireEvent.keyDown(window, { key: "ArrowRight" });
      await new Promise((r) => setTimeout(r, 120));
    });

    expect(screen.getByTestId("batch-training")).toBeTruthy();
    expect(screen.queryByTestId("parameters-at-scale")).toBeNull();
  });
});
