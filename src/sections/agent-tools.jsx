import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Acts 2 + 3: Tool Calling + Protocols (MCP + A2A)
// Chapters 13.7 - 13.17. In Milestone 1 only 13.7 - 13.11 are non-stub; Act 3 (13.12 - 13.17) is added in Milestone 2.

export const ToolUseAsBridge = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Use - LLM as Orchestrator
        </T>
        <T size={16}>Stub - implemented in Task 14.</T>
      </Box>
    </div>
  );
};

export const JsonSchemaForTools = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          JSON Schemas + Tool Descriptions
        </T>
        <T size={16}>Stub - implemented in Task 15.</T>
      </Box>
    </div>
  );
};

export const ToolCallLifecycle = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Call Lifecycle
        </T>
        <T size={16}>Stub - implemented in Task 16.</T>
      </Box>
    </div>
  );
};

export const ParallelToolsAndChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Parallel Tools + Tool Choice
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const ToolErrorsRetries = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Errors, Retries, Validation
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};
