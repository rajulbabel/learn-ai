import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { useUrlSync } from "../url-sync.js";
import { chapters } from "../config.js";

function Probe({ ch, sub, expanded }) {
  useUrlSync({ ch, sub, expanded });
  return null;
}

describe("useUrlSync", () => {
  let replaceSpy;
  let pushSpy;

  beforeEach(() => {
    replaceSpy = vi.spyOn(window.history, "replaceState");
    pushSpy = vi.spyOn(window.history, "pushState");
    window.history.replaceState(null, "", "/learn-ai/");
    replaceSpy.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sets URL to chapter path on mount when ch>0", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    render(<Probe ch={idx} sub={0} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
  });

  it("includes sub when sub>0", () => {
    const idx = chapters.findIndex((c) => c.file === "attention-computation/compute-qkv");
    render(<Probe ch={idx} sub={3} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(
      null,
      "",
      "/learn-ai/attention-computation/compute-qkv/3",
    );
  });

  it("reflects TOC super expansion", () => {
    render(<Probe ch={0} sub={0} expanded={{ super: "C", section: null }} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/transformers");
  });

  it("reflects TOC super + section expansion", () => {
    render(<Probe ch={0} sub={0} expanded={{ super: "C", section: 10 }} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/transformers/attention");
  });

  it("does not call replaceState if URL already matches", () => {
    window.history.replaceState(null, "", "/learn-ai/");
    replaceSpy.mockClear();
    render(<Probe ch={0} sub={0} expanded={null} />);
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("uses pushState for navigations after the first sync", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    const { rerender } = render(<Probe ch={0} sub={0} expanded={null} />);
    // First sync at bare URL matches -> no write, but firstSync flips to false.
    replaceSpy.mockClear();
    pushSpy.mockClear();
    rerender(<Probe ch={idx} sub={0} expanded={null} />);
    expect(pushSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("uses replaceState (not pushState) for the very first sync", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    render(<Probe ch={idx} sub={0} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
    expect(pushSpy).not.toHaveBeenCalled();
  });
});
