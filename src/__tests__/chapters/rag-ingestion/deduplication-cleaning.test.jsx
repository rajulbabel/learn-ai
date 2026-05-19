import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DeduplicationCleaning from "../../../chapters/rag-ingestion/deduplication-cleaning.jsx";

afterEach(() => cleanup());

describe("DeduplicationCleaning (20.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DeduplicationCleaning(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(DeduplicationCleaning(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(DeduplicationCleaning(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(DeduplicationCleaning(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(DeduplicationCleaning(makeCtx({ sub: 4 })))).not.toThrow();
  });
});
