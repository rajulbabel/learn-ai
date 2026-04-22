import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 11 Act 5: Production Realities (chapters 11.19-11.28).
// Continues the cat-corpus + production-scale numbers established in 11.1-11.18.
// Canonical scale dim d = 768. SVG marker/gradient ids follow `<type><chapter>-<svg-index>`.

const stubFactory = (title, color) => (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={color} style={{ width: "100%" }}>
          <T color={color} bold center size={22}>
            {title} (stub)
          </T>
        </Box>
      )}
      {sub < 5 && (
        <SubBtn
          key={sub}
          onClick={() => {
            setSubBtnRipple(Date.now());
            navigate("forward");
          }}
          rippleKey={subBtnRipple}
          registerSubBtn={registerSubBtn}
        />
      )}
    </div>
  );
};

export const Filtering = stubFactory("Filtering", C.cyan);
export const UpdatesDeletes = stubFactory("Updates & Deletes", C.yellow);
export const Sharding = stubFactory("Sharding & Partitioning", C.green);
export const Replication = stubFactory("Replication & High Availability", C.orange);
export const HybridSearch = stubFactory("Hybrid Search", C.red);
export const Rerankers = stubFactory("Rerankers", C.purple);
export const MultiVectorRetrieval = stubFactory("Multi-vector Retrieval", C.pink);
export const EmbeddingLifecycle = stubFactory("Embedding Lifecycle", C.cyan);
export const Observability = stubFactory("Observability", C.yellow);
export const CapacityPlanning = stubFactory("Capacity Planning", C.green);
