import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";
import { SOFT, tintedCard, pill } from "./agent-prompting.jsx";

// Section 13 Act 7: Evals
// Chapters 13.37 - 13.41
// Helpers SOFT, tintedCard, pill imported from agent-prompting.jsx (helper hub).
// Reveal, SubBtn, ctx, SOFT, tintedCard, pill, are used by chapter implementations below.

export const WhyEvalAgents = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Why Eval Agents Differently
        </T>
        <T size={16}>Stub - implemented in Task 6.</T>
      </Box>
    </div>
  );
};

export const EvalDimensions = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Eval Dimensions
        </T>
        <T size={16}>Stub - implemented in Task 7.</T>
      </Box>
    </div>
  );
};

export const LlmAsJudge = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          LLM-as-Judge
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const TraceEvals = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Trace Evals
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const EvalSetsContinuous = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Eval Sets + Continuous Eval
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};
