import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

export const RetrievalProblem = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Retrieval Problem (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const BruteForceKNN = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Brute-Force kNN (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ThreeWayTradeoff = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Three-Way Tradeoff (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const DistanceMetrics = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Distance Metrics (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
