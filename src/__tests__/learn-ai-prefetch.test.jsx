import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

describe("search prefetch fires after window load", () => {
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

  it("calls prefetchSearch after window load (no interaction needed)", async () => {
    // The remote embed endpoint is cheap to warm: a metadata fetch + the
    // int8 corpus bin. No 99 MB ONNX model parse means no reason to gate on
    // interaction, so prewarm runs as soon as `load` fires.
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });

  it("calls prefetchSearch immediately if readyState is already complete", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "complete" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    for (let i = 0; i < 50 && prefetchSpy.mock.calls.length === 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(prefetchSpy).toHaveBeenCalled();
  });
});
