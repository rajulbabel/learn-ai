import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

export const Caching = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Caching - Prompt + Semantic (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const CostModels = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Cost Models (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ObservabilityTracing = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Observability & Tracing (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HallucinationDrift = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Detection & Drift (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const FrameworkChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Framework Choice (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const RAGDecisionFrameworkCapstone = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Complete RAG Decision Framework + Capstone (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
