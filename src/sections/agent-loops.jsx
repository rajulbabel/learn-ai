import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Acts 4 + 5: Workflows / Agent Loops + Memory
// Chapters 13.18 - 13.29. In Milestone 2 only 13.18 - 13.23 are non-stub; Act 5 (13.24 - 13.29) is added in Milestone 3.

export const WorkflowVsAgent = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Workflow vs Agent
        </T>
        <T size={16}>Stub - implemented in Task 13.</T>
      </Box>
    </div>
  );
};

export const WorkflowPrimitives = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Workflow Primitives - Chaining, Routing, Parallelization
        </T>
        <T size={16}>Stub - implemented in Task 14.</T>
      </Box>
    </div>
  );
};

export const AgentLoop = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          The Agent Loop
        </T>
        <T size={16}>Stub - implemented in Task 15.</T>
      </Box>
    </div>
  );
};

export const ReActPattern = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          ReAct Pattern
        </T>
        <T size={16}>Stub - implemented in Task 16.</T>
      </Box>
    </div>
  );
};

export const PlanExecuteReflect = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Plan-Execute + Reflection
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const LoopTermination = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Loop Termination
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};
