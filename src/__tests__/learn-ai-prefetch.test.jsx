import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

describe("search prefetch is deferred", () => {
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

  it("calls prefetchSearch after window load + idle", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    // Allow chapter useEffect to run and register the load listener.
    await new Promise((r) => setTimeout(r, 50));
    window.dispatchEvent(new Event("load"));
    // wait for idle + dynamic search.js import + chained promises
    await new Promise((r) => setTimeout(r, 200));
    expect(prefetchSpy).toHaveBeenCalled();
  });
});
