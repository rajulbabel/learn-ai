import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import JsonSchemaForTools from "../../../chapters/agent-tools/json-schema-for-tools.jsx";

afterEach(() => cleanup());

describe("JsonSchemaForTools (13.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(JsonSchemaForTools(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the schema as contract", () => {
    const { container } = render(JsonSchemaForTools(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/schema/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/input_schema|properties/i);
  });

  it("sub=1 distinguishes required vs optional", () => {
    const { container } = render(JsonSchemaForTools(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/required/i);
    expect(container.textContent).toMatch(/optional/i);
  });

  it("sub=2 shows enum and format constraints", () => {
    const { container } = render(JsonSchemaForTools(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/enum/i);
    expect(container.textContent).toMatch(/urgency/i);
  });

  it("sub=3 lists description-writing rules", () => {
    const { container } = render(JsonSchemaForTools(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/side effect|mutate/i);
  });

  it("sub=4 contrasts bad and good descriptions", () => {
    const { container } = render(JsonSchemaForTools(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/bad|vague/i);
    expect(container.textContent).toMatch(/good|specific/i);
    expect(container.textContent).toMatch(/200|escalate/i);
  });

  it("sub=5 shows the canonical lookup_customer reference", () => {
    const { container } = render(JsonSchemaForTools(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/canonical|reference/i);
  });
});
