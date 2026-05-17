import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Matryoshka from "../../../chapters/vector-compression/matryoshka.jsx";

afterEach(() => cleanup());

describe("Matryoshka (11.16)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Matryoshka(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames the re-embedding problem", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/re[- ]?embed|re[- ]?encoding/i);
    expect(container.textContent).toMatch(/500M|500 million|million/i);
  });

  it("sub=1 introduces Matryoshka truncation", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/256/);
    expect(container.textContent).toMatch(/512/);
    expect(container.textContent).toMatch(/first[- ]?K|truncate|nested/i);
  });

  it("sub=2 shows the Russian doll concentric visual", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/nested|concentric/i);
    expect(container.textContent).toMatch(/Russian doll|dolls/i);
  });

  it("sub=3 truncates to 512 for 6x savings", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/512/);
    expect(container.textContent).toMatch(/3072|3,072/);
    expect(container.textContent).toMatch(/6[x×]|6 times|saving/i);
  });

  it("sub=4 covers adaptive precision for coarse-to-fine", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/coarse/i);
    expect(container.textContent).toMatch(/rerank|fine/i);
    expect(container.textContent).toMatch(/256|adaptive/i);
  });

  it("sub=5 names OpenAI/Cohere production availability", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OpenAI/);
    expect(container.textContent).toMatch(/text-embedding-3|Cohere/i);
  });

  it("sub=6 shows MRL composes with SQ/PQ/BQ", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/SQ|scalar/i);
    expect(container.textContent).toMatch(/PQ|product/i);
    expect(container.textContent).toMatch(/BQ|binary/i);
    expect(container.textContent).toMatch(/orthogonal|stack|compose/i);
  });

  it("sub=6 shows multiplicative compression numbers", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/12[x×]|12 times/i);
    expect(container.textContent).toMatch(/96[x×]|96 times/i);
    expect(container.textContent).toMatch(/3072|3,072/);
  });

  it("sub=6 covers order rule (truncate first, quantize after)", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/embed time|truncate first|MRL first|order/i);
    expect(container.textContent).toMatch(/codebook|index time|after/i);
  });

  it("sub=6 calls out BQ floor (d >= 768)", () => {
    const { container } = render(Matryoshka(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/floor|minimum|at least/i);
  });
});
