import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

// Mock all dynamic imports so the component renders synchronously in tests
vi.mock("../sections/toc.jsx", () => ({
  TOC: () => <div data-testid="toc">TOC</div>,
}));
vi.mock("../sections/neural-foundations.jsx", () => ({
  WhatIsNN: () => <div>WhatIsNN</div>,
}));
vi.mock("../sections/llm-training.jsx", () => ({}));
vi.mock("../sections/scaling.jsx", () => ({}));
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

afterEach(() => cleanup());

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
