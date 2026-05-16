import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Acts 8 + 9: Production Hardening + Frameworks & Decision
// Chapters 13.42 - 13.52. In Milestone 5 only Act 8 (13.42 - 13.47) is non-stub; Act 9 (13.48 - 13.52) is added in Milestone 6.

export const ObservabilityTracing = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Observability & Tracing
        </T>
        <T size={16}>Stub - implemented in Task 6.</T>
      </Box>
    </div>
  );
};

export const CostControl = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Cost Control
        </T>
        <T size={16}>Stub - implemented in Task 7.</T>
      </Box>
    </div>
  );
};

export const LatencyOptimization = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Latency Optimization
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const Guardrails = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Guardrails
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const PromptInjectionDefenses = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Prompt Injection Defenses
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const ToolSecurity = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Tool Security
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};
