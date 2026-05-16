import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Act 1: Prompting Foundations
// Chapters 13.1 - 13.6

export const AnatomyOfLlmCall = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Anatomy of an LLM Call
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const SystemPromptContract = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          System Prompts - The Role Contract
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const FewShotStructuredOutput = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Few-Shot + Structured Output
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const ChainOfThoughtSelfConsistency = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Chain of Thought + Self-Consistency
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};

export const PromptVsTuneVsRagVsAgent = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Prompt vs Fine-Tune vs RAG vs Agent
        </T>
        <T size={16}>Stub - implemented in Task 12.</T>
      </Box>
    </div>
  );
};

export const ContextEngineering = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Context Engineering
        </T>
        <T size={16}>Stub - implemented in Task 13.</T>
      </Box>
    </div>
  );
};
