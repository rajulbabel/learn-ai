import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full chapter content added in subsequent M4 tasks.

export const ContextPacking = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Context Packing (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const LostInTheMiddle = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            The Lost-in-the-Middle Problem (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const CitationsRefusal = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Citations, Refusal and Groundedness (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const MultiHopRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Multi-Hop Retrieval (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const SelfRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Self-RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const CorrectiveRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            CRAG - Corrective RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const GraphRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            GraphRAG (Microsoft 2024) (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const AgenticRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tool-Augmented and Agentic RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const LongContextVsRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Long-Context vs RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
