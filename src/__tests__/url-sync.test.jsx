import { describe, it, expect, vi, beforeEach } from "vitest";
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

  it("sets URL to chapter path on mount when ch>0", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    render(<Probe ch={idx} sub={0} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it("includes sub when sub>0", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/compute-qkv");
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
});
