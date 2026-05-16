import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

export const WhyLLMsNeedRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Why LLMs Need Retrieval (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const NaiveRAGPipeline = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Naive RAG Pipeline (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const WhereNaiveRAGBreaks = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Where Naive RAG Breaks (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
