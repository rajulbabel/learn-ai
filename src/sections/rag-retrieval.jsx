import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks (Section 12 Milestone 3).
// Act 4 (Embed & Index Choices for RAG): 12.14-12.17
// Act 5 (Query Transformation): 12.18-12.21

export const EmbeddingModelChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Picking An Embedding Model (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const DomainAdaptation = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Domain Adaptation (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HybridForRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hybrid Retrieval For RAG (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const RerankerCascade = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            The Reranker Cascade (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const WhyTransformQueries = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Why Transform Queries (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HyDE = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            HyDE - Hypothetical Document Embeddings (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const MultiQueryExpansion = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Multi-Query Expansion (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const QueryRoutingDecomposition = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Query Routing And Decomposition (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};
