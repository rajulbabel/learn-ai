import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

describe("search prefetch is interaction-gated", () => {
  let prefetchSpy;

  beforeEach(() => {
    vi.resetModules();
    prefetchSpy = vi.fn().mockResolvedValue();
    vi.doMock("../search.js", () => ({
      initSearch: vi.fn().mockResolvedValue(),
      prefetchSearch: prefetchSpy,
      search: vi.fn(),
      searchText: vi.fn(() => []),
      getSearchStatus: vi.fn(() => ({ mode: "off", progress: 0 })),
    }));
  });

  afterEach(() => {
    cleanup();
    delete globalThis.requestIdleCallback;
    vi.doUnmock("../search.js");
    vi.resetModules();
  });

  it("does not call prefetchSearch synchronously during render", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    expect(prefetchSpy).not.toHaveBeenCalled();
  });

  it("does NOT call prefetchSearch on window load alone (no interaction yet)", async () => {
    // Lighthouse fires load but never interacts. Prewarm must stay dormant
    // so the audit trace doesn't see the heavy network/CPU cost.
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 200));
    expect(prefetchSpy).not.toHaveBeenCalled();
  });

  it("calls prefetchSearch after first user interaction (pointerdown)", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("pointerdown"));
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });

  it("calls prefetchSearch after first scroll", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("scroll"));
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });

  it("calls prefetchSearch after mousemove (hover-only path on TOC)", async () => {
    // TOC has nothing to scroll; user who only hovers must still arm prewarm.
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 10, clientY: 10 }));
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });

  it("calls prefetchSearch after pointermove", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("pointermove"));
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });

  it("calls prefetchSearch after keydown", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });
});
