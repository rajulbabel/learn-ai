import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Pinecone from "../../../chapters/vector-systems/pinecone.jsx";

afterEach(() => cleanup());

describe("Pinecone (11.33)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Pinecone(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Pinecone(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Pinecone(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Pinecone(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Pinecone(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Pinecone(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames Pinecone as managed SaaS with opinionated defaults", () => {
    const { container } = render(Pinecone(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/managed|SaaS/i);
    expect(container.textContent).toMatch(/proprietary|opinion/i);
  });

  it("sub=1 describes the pod architecture", () => {
    const { container } = render(Pinecone(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/pod/i);
    expect(container.textContent).toMatch(/shard/i);
    expect(container.textContent).toMatch(/p1|p2|scale/i);
  });

  it("sub=2 describes serverless with scale-to-zero and cold-start", () => {
    const { container } = render(Pinecone(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/serverless/i);
    expect(container.textContent).toMatch(/scale[- ]?to[- ]?zero|scale to zero/i);
    expect(container.textContent).toMatch(/cold[- ]?start/i);
  });

  it("sub=3 lists built-in filtering, hybrid, namespaces", () => {
    const { container } = render(Pinecone(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/filter/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/namespace|tenant/i);
  });

  it("sub=4 names the good-fit workloads", () => {
    const { container } = render(Pinecone(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/no ops|without ops/i);
    expect(container.textContent).toMatch(/variable|workload/i);
    expect(container.textContent).toMatch(/time[- ]?to[- ]?market|prototype/i);
  });

  it("sub=5 names vendor lock-in and cost-at-scale tradeoffs", () => {
    const { container } = render(Pinecone(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/lock[- ]?in/i);
    expect(container.textContent).toMatch(/cost|expensive/i);
    expect(container.textContent).toMatch(/opinion/i);
  });
});
