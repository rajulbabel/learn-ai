import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FewShotStructuredOutput from "../../../chapters/agent-prompting/few-shot-structured-output.jsx";

afterEach(() => cleanup());

describe("FewShotStructuredOutput (13.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(FewShotStructuredOutput(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts zero-shot and few-shot", () => {
    const { container } = render(FewShotStructuredOutput(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/few.?shot/i);
    expect(container.textContent).toMatch(/example/i);
    expect(container.textContent).toMatch(/classif/i);
  });

  it("sub=1 shows three examples in the same format", () => {
    const { container } = render(FewShotStructuredOutput(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/output/i);
    expect(container.textContent).toMatch(/category|billing|troubleshooting/i);
  });

  it("sub=2 shows the output schema with enums", () => {
    const { container } = render(FewShotStructuredOutput(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/schema/i);
    expect(container.textContent).toMatch(/enum/i);
    expect(container.textContent).toMatch(/urgency/i);
  });

  it("sub=3 explains few-shot + schema combination", () => {
    const { container } = render(FewShotStructuredOutput(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/structure/i);
    expect(container.textContent).toMatch(/drift|consistent|every/i);
  });

  it("sub=4 lists production tips", () => {
    const { container } = render(FewShotStructuredOutput(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/3.?(to|-)? ?5/i);
    expect(container.textContent).toMatch(/diverse|edge case/i);
  });

  it("sub=5 shows the assembled classifier artifact", () => {
    const { container } = render(FewShotStructuredOutput(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/classif/i);
    expect(container.textContent).toMatch(/category|schema/i);
    expect(container.textContent).toMatch(/ticket.?classifier|classifier template/i);
  });
});
