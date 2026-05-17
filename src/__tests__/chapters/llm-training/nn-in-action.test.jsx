import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import NNInAction from "../../../chapters/llm-training/nn-in-action.jsx";

afterEach(() => cleanup());

describe("NNInAction (2.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(NNInAction(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the 20-word vocabulary grid", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("20 words");
    expect(text).toContain("the");
    expect(text).toContain("cat");
    expect(text).toContain("with");
  });

  it("sub=0 shows word IDs in the vocabulary", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("[0]");
    expect(text).toContain("[19]");
  });

  it("sub=1 shows the input sentence The cat sat on with predict question", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("sat");
    expect(text).toContain("on");
    expect(text).toContain("???");
  });

  it("sub=2 shows the neural network diagram with layers", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Input");
    expect(text).toContain("Hidden");
    expect(text).toContain("Output");
    expect(text).toContain("weight");
  });

  it("sub=3 shows how the mat output circle computes its score", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("mat");
    expect(text).toContain("logit");
    expect(text).toContain("4.40");
  });

  it("sub=4 shows raw scores for all 20 words", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("Raw scores");
    expect(text).toContain("the");
    expect(text).toContain("4.2");
    expect(text).toContain("mat");
    expect(text).toContain("3.8");
  });

  it("sub=5 shows softmax conversion with e^score", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("2.718");
  });

  it("sub=6 shows final probability bars with the as highest", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("probability");
    expect(text).toContain("the");
    expect(text).toContain("46.0%");
  });

  it("sub=7 shows the key insight that it is all multiply and add", () => {
    const { container } = render(NNInAction(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("multiply");
    expect(text).toContain("add");
    expect(text).toContain("weight");
  });
});
