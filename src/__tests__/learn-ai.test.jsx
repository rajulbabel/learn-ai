import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { chapters } from "../config.js";

// Mock all dynamic imports so the component renders synchronously in tests
vi.mock("../chapters/table-of-contents/toc.jsx", () => ({
  default: () => <div data-testid="toc">Table of Contents</div>,
}));
vi.mock("../chapters/neural-foundations/what-is-nn.jsx", () => ({
  default: (ctx) => (
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
vi.mock("../chapters/neural-foundations/inside-neuron.jsx", () => ({
  default: () => <div data-testid="inside-neuron">InsideNeuron</div>,
}));
vi.mock("../chapters/llm-training/batch-training.jsx", () => ({
  default: () => <div data-testid="batch-training">BatchTraining</div>,
}));
vi.mock("../chapters/scaling/parameters-at-scale.jsx", () => ({
  default: () => <div data-testid="parameters-at-scale">ParametersAtScale</div>,
}));
vi.mock("../search-overlay.jsx", () => ({
  default: () => <div data-testid="search-overlay">Search Overlay</div>,
}));
vi.mock("../search.js", () => ({
  initSearch: vi.fn(() => Promise.resolve()),
  prefetchSearch: vi.fn(() => Promise.resolve()),
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
  delete globalThis.requestIdleCallback;
  const navMod = await import("../nav-persistence.js");
  navMod.loadNav.mockReturnValue(null);
  const searchMod = await import("../search.js");
  searchMod.getSearchStatus.mockReturnValue({ mode: "off", progress: 0 });
  // useUrlSync mutates window.location.pathname; reset so each test starts fresh.
  window.history.replaceState(null, "", "/learn-ai/");
  localStorage.clear();
});

// Helper: render LearnAI and wait for async chapter load. Mocks the <main>
// element's bounding rect so click-position tests have predictable side-band
// geometry (jsdom returns all-zero rects by default). Also fires window.load
// + a synchronous requestIdleCallback shim so search prefetch + poll triggers
// activate during the test (production defers them until idle).
async function renderLearnAI({ mainBounds = { left: 200, right: 824 } } = {}) {
  globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
  const mod = await import("../learn-ai.jsx");
  const LearnAI = mod.default;
  let result;
  await act(async () => {
    result = render(<LearnAI />);
  });
  await act(async () => {
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
  });
  const main = document.querySelector("main");
  if (main && mainBounds) {
    main.getBoundingClientRect = () => ({
      left: mainBounds.left,
      right: mainBounds.right,
      top: 0,
      bottom: 1000,
      width: mainBounds.right - mainBounds.left,
      height: 1000,
      x: mainBounds.left,
      y: 0,
      toJSON: () => ({}),
    });
  }
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

describe("LearnAI author footer (SEO)", () => {
  it("renders a <footer> with author credit", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain("Rajul Babel");
  });

  it("footer links to GitHub repo", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    const link = footer.querySelector('a[href*="github.com/rajulbabel"]');
    expect(link).toBeTruthy();
  });

  it("footer link uses rel=author for SEO authorship", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    const author = footer.querySelector('a[rel*="author"]');
    expect(author).toBeTruthy();
    expect(author.textContent).toContain("Rajul Babel");
  });

  it("footer links to LinkedIn profile", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    const link = footer.querySelector('a[href*="linkedin.com/in/rajulbabel"]');
    expect(link).toBeTruthy();
  });

  it("footer renders author credit and links on separate lines", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    const lines = footer.querySelectorAll("[data-footer-line]");
    expect(lines.length).toBe(2);
    expect(lines[0].textContent).toContain("Built by");
    expect(lines[0].textContent).toContain("Rajul Babel");
    expect(lines[1].textContent).toContain("LinkedIn");
    expect(lines[1].textContent).toContain("GitHub");
  });

  it("footer divider spans full parent width (no maxWidth cap)", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    expect(footer.style.maxWidth).toBe("");
    expect(footer.style.alignSelf).toBe("stretch");
    expect(footer.style.borderTop).toContain("1px solid");
  });

  it("renders spacer before footer to enforce min gap above divider", async () => {
    await renderLearnAI();
    const footer = document.querySelector("footer");
    const spacer = footer.previousElementSibling;
    expect(spacer).toBeTruthy();
    expect(spacer.getAttribute("data-footer-spacer")).toBe("true");
    expect(spacer.style.flexGrow).toBe("1");
    expect(spacer.style.minHeight).toBe("16px");
  });
});

describe("LearnAI fullscreen toggle", () => {
  function installFullscreenMocks({ active = false } = {}) {
    document.documentElement.requestFullscreen = vi.fn(() => Promise.resolve());
    document.exitFullscreen = vi.fn(() => Promise.resolve());
    Object.defineProperty(document, "fullscreenElement", {
      value: active ? document.documentElement : null,
      configurable: true,
      writable: true,
    });
  }

  it("pressing F requests fullscreen on the document element when not fullscreen", async () => {
    installFullscreenMocks({ active: false });
    await renderLearnAI();
    await act(async () => {
      fireEvent.keyDown(window, { key: "f" });
    });
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  it("pressing F exits fullscreen when already fullscreen", async () => {
    installFullscreenMocks({ active: true });
    await renderLearnAI();
    await act(async () => {
      fireEvent.keyDown(window, { key: "F" });
    });
    expect(document.exitFullscreen).toHaveBeenCalled();
    expect(document.documentElement.requestFullscreen).not.toHaveBeenCalled();
  });

  it("pressing Escape while in fullscreen exits fullscreen", async () => {
    installFullscreenMocks({ active: true });
    await renderLearnAI();
    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  it("pressing Escape while NOT in fullscreen does not call exitFullscreen via this handler", async () => {
    installFullscreenMocks({ active: false });
    await renderLearnAI();
    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });

  it("Escape while the search overlay is open does not exit fullscreen (search handles it first)", async () => {
    installFullscreenMocks({ active: true });
    await renderLearnAI();
    await act(async () => {
      fireEvent.keyDown(window, { key: "k", ctrlKey: true });
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(screen.getByTestId("search-overlay")).toBeTruthy();
    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(document.exitFullscreen).not.toHaveBeenCalled();
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

describe("LearnAI tap-anywhere navigation", () => {
  it("advances to the next chapter on a click in the right side band (right of main)", async () => {
    // Start at TOC (ch=0); a click to the right of <main> should land at WhatIsNN (ch=1)
    await renderLearnAI();
    expect(screen.getByTestId("toc")).toBeTruthy();

    await act(async () => {
      fireEvent.click(document.body, { detail: 1, clientX: 900 });
      // Wait past the defer window + chapter async load + re-render
      await new Promise((r) => setTimeout(r, 550));
    });
    expect(screen.queryByTestId("toc")).toBeNull();
    expect(screen.getByText("WhatIsNN")).toBeTruthy();
  });

  it("goes back to the previous chapter on a click in the left side band (left of main)", async () => {
    const navMod = await import("../nav-persistence.js");
    const ch1Idx = chapters.findIndex((c) => c.id === "1.1");
    navMod.loadNav.mockReturnValue({ ch: ch1Idx, sub: 0 });

    await renderLearnAI();
    expect(screen.getByText("WhatIsNN")).toBeTruthy();

    await act(async () => {
      fireEvent.click(document.body, { detail: 1, clientX: 100 });
      await new Promise((r) => setTimeout(r, 550));
    });
    expect(screen.queryByText("WhatIsNN")).toBeNull();
    expect(screen.getByTestId("toc")).toBeTruthy();
  });

  it("does NOT navigate on a left-band click on the TOC (no previous chapter)", async () => {
    await renderLearnAI();
    expect(screen.getByTestId("toc")).toBeTruthy();

    await act(async () => {
      fireEvent.click(document.body, { detail: 1, clientX: 100 });
      await new Promise((r) => setTimeout(r, 550));
    });
    expect(screen.getByTestId("toc")).toBeTruthy();
  });

  it("does NOT navigate when the click lands inside the main content column", async () => {
    // clientX 600 falls within the mocked main bounds (200-824). It is also in
    // the right half of the viewport, so without the bounds skip it would
    // advance to the next chapter; with the skip it must stay on TOC.
    await renderLearnAI();
    expect(screen.getByTestId("toc")).toBeTruthy();

    await act(async () => {
      fireEvent.click(document.body, { detail: 1, clientX: 600 });
      await new Promise((r) => setTimeout(r, 550));
    });
    expect(screen.getByTestId("toc")).toBeTruthy();
    expect(screen.queryByText("WhatIsNN")).toBeNull();
  });

  it("does NOT advance when the user double-clicks (text-selection gesture)", async () => {
    await renderLearnAI();
    expect(screen.getByTestId("toc")).toBeTruthy();

    await act(async () => {
      fireEvent.click(document.body, { detail: 1, clientX: 900 });
      // Second click of a double-click arrives quickly with detail > 1
      fireEvent.click(document.body, { detail: 2, clientX: 900 });
      // Wait past the defer window
      await new Promise((r) => setTimeout(r, 550));
    });
    // Still at TOC; no navigation fired
    expect(screen.getByTestId("toc")).toBeTruthy();
  });

  it("does NOT advance when click target is removed from DOM by its own React onClick", async () => {
    // Reproduces the TOC bug: clicking a child of a cursor:pointer element whose React
    // onClick re-renders to remove the target leaves e.target detached. The handler must
    // inspect composedPath() (which preserves the original ancestor chain) rather than
    // walking via parentElement, otherwise it incorrectly treats the click as background.
    await renderLearnAI();
    expect(screen.getByTestId("toc")).toBeTruthy();

    const detachedTarget = document.createElement("div");
    const interactiveAncestor = document.createElement("div");
    interactiveAncestor.style.cursor = "pointer";
    // Intentionally NOT linked via appendChild - mimics React's post-unmount state where
    // parentElement is null but the originally-dispatched composedPath still has ancestors.

    await act(async () => {
      const ev = new MouseEvent("click", { bubbles: true, button: 0, detail: 1, clientX: 900 });
      Object.defineProperty(ev, "composedPath", {
        value: () => [detachedTarget, interactiveAncestor, document.body, document, window],
      });
      Object.defineProperty(ev, "target", { value: detachedTarget });
      window.dispatchEvent(ev);
      await new Promise((r) => setTimeout(r, 550));
    });

    // Still at TOC; window handler must have detected the cursor:pointer ancestor.
    expect(screen.getByTestId("toc")).toBeTruthy();
  });
});

describe("LearnAI chapter loading", () => {
  it("loads chapter 6.3 from the combined section 6 modules instead of reusing chapter 6.2", async () => {
    const navMod = await import("../nav-persistence.js");
    const chapter62 = chapters.findIndex((c) => c.id === "6.2");
    navMod.loadNav.mockReturnValue({ ch: chapter62, sub: 0 });

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

describe("chapterLoaders glob", () => {
  it("import.meta.glob resolves one loader per configured chapter", async () => {
    const loaders = import.meta.glob("../chapters/**/*.jsx");
    expect(typeof loaders).toBe("object");
    expect(Object.keys(loaders).length).toBe(chapters.length);
  });
});

describe("URL routing - boot", () => {
  beforeEach(async () => {
    localStorage.clear();
    window.history.replaceState(null, "", "/learn-ai/");
    const navMod = await import("../nav-persistence.js");
    navMod.loadNav.mockReturnValue(null);
  });

  it("opens at chapter URL", async () => {
    window.history.replaceState(null, "", "/learn-ai/neural-foundations/what-is-nn");
    await renderLearnAI();
    expect(await screen.findByText(/What is a Neural Network/i)).toBeTruthy();
  });

  it("opens TOC at bare URL", async () => {
    await renderLearnAI();
    expect(await screen.findByText(/Table of Contents/i)).toBeTruthy();
  });

  it("redirects bare URL to saved chapter when localStorage present", async () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/inside-neuron");
    const navMod = await import("../nav-persistence.js");
    navMod.loadNav.mockReturnValue({ ch: idx, sub: 0 });
    await renderLearnAI();
    await screen.findByText(/Inside a Single Neuron/i);
    expect(window.location.pathname).toBe("/learn-ai/neural-foundations/inside-neuron");
  });

  it("falls back to TOC for invalid URL", async () => {
    window.history.replaceState(null, "", "/learn-ai/no/such/chapter");
    await renderLearnAI();
    expect(await screen.findByText(/Table of Contents/i)).toBeTruthy();
  });
});
