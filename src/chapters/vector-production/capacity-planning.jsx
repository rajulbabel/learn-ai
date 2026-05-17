import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function CapacityPlanning(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Inputs to size a vector search system
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Good capacity planning starts with the inputs the workload gives you: how many vectors, how big each one is,
            how many queries per second, what latency budget, how selective the filters are, what availability the
            business needs. Six numbers determine almost everything about the provisioning decision.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              The six sizing inputs
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { name: "N vectors", value: "1M - 10B", example: "500M" },
                { name: "d dimensions", value: "128 - 3072", example: "768" },
                { name: "QPS target", value: "10 - 10K", example: "200" },
                { name: "P99 target", value: "30 - 300 ms", example: "100 ms" },
                { name: "Filter selectivity", value: "0.1% - 100%", example: "5%" },
                { name: "Availability", value: "99% - 99.99%", example: "99.9%" },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}08`,
                    border: `1px solid ${C.cyan}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={14} center>
                    {r.name}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright }}>{r.value}</div>
                  <T color={C.dim} size={11} style={{ marginTop: 4 }} center>
                    Example: {r.example}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Everything that follows - memory, CPU, node count, cost - is derived from these six numbers plus the index
            choice.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Memory formula: vectors + graph + cache + fragmentation
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            RAM is usually the gating resource. The total is the vector storage plus graph overhead plus working-set
            cache headroom plus an allocator-fragmentation fudge factor. Each multiplier accumulates; undersize any one
            and P99 latency explodes.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Memory formula
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 15,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              RAM = N &middot; (<span style={{ color: C.yellow }}>vec_bytes</span> +{" "}
              <span style={{ color: C.yellow }}>graph_bytes</span>) &middot;{" "}
              <span style={{ color: C.yellow }}>cache_factor</span> &middot;{" "}
              <span style={{ color: C.yellow }}>frag_factor</span>
              <br />
              Cache_factor &asymp; 1.2 (20% headroom) &middot; frag_factor &asymp; 1.3 (allocator)
              <br />
              Vec_bytes = d &middot; 4 for float32, d for int8, m for PQ m-bytes
              <br />
              Graph_bytes &asymp; 100 for HNSW, ~20 for IVF-PQ
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Each multiplier matters - undersizing <span style={{ color: C.red }}>cache</span> or{" "}
            <span style={{ color: C.red }}>fragmentation</span> blows P99
            <br />
            Plan for 1.5x the naive &quot;N times vec_bytes&quot;
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every production team eventually learns this the hard way. The cache and fragmentation factors are easy to
            forget and expensive to discover.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            CPU sizing: per-query ops x QPS x headroom
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            CPU capacity sizing is simpler: estimate per-query work, multiply by target QPS, add headroom for spikes and
            replication overhead. For HNSW at typical parameters, each query touches about 30 graph hops averaging 10
            microseconds each - 300 microseconds of compute per query.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              CPU formula for HNSW
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 15,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Per-query CPU = <span style={{ color: C.green }}>hops &middot; us/hop</span>
              <br />
              Typical: 30 hops &middot; 10 us = 300 us
              <br />
              Cores = <span style={{ color: C.green }}>per-query-cost &middot; QPS &middot; headroom</span>
              <br />
              Worked: 300 us &middot; 200 QPS &middot; 2x headroom = 120,000 us = 0.12 core-seconds/sec
              <br />
              Round up to <span style={{ color: C.green }}>8-16 cores</span> per replica with write and merge overhead
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            CPU is rarely the bottleneck when memory is sized correctly. Most production systems have plenty of CPU
            headroom and end up memory-bound first.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Worked example: 500M vectors x d=768 x 200 QPS
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Concrete run. 500M docs, d = 768, HNSW index, 200 QPS, P99 target 100 ms, 99.9% availability. Compute the
            memory, CPU, and node count explicitly. This is the shape of every real sizing exercise.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              500M vector sizing walkthrough
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "14px 18px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              Vectors: 500M &middot; 3 KB = <span style={{ color: C.orange }}>1.5 TB</span>
              <br />
              HNSW graph: 500M &middot; 100 B = <span style={{ color: C.orange }}>50 GB</span>
              <br />
              Cache + fragmentation (1.2 &middot; 1.3 = 1.56): &asymp; 2.4 TB total
              <br />
              Spread across <span style={{ color: C.orange }}>6 nodes</span> (r7i.24xlarge with 768 GB each)
              <br />
              Each node holds ~100M vectors = <span style={{ color: C.orange }}>400 GB</span> of the working set
              <br />
              Replicate 2x for availability: <span style={{ color: C.orange }}>12 nodes total, 3 TB RAM</span>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                label: "Memory",
                value: "3 TB",
                note: "Across replicas, 1.5 TB primary + replication",
                color: C.orange,
              },
              { label: "Nodes", value: "6 + 6", note: "Primary shards + 1 replica each", color: C.orange },
              { label: "CPU", value: "~96 cores", note: "16 per node times 6 nodes", color: C.orange },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={14}>
                  {r.label}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 18, color: r.color }}>{r.value}</div>
                <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                  {r.note}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the shape of every well-sized deployment. Start from raw numbers, apply the cache and fragmentation
            factors, decide on shard count from single-node ceiling, multiply by replication.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Cost comparison: Pinecone pods vs self-host Qdrant vs pgvector
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Cost depends entirely on who runs the infrastructure. Pinecone&apos;s managed pods include the ops team, at
            a premium. Self-hosted Qdrant on AWS is cheaper in compute but you run it yourself. pgvector on a big
            Postgres box is the cheapest, but the operational model has its own caveats. Rough order-of-magnitude
            estimates for our 500M workload follow.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={16}>
              Monthly cost estimates for 500M x d=768 x 200 QPS (illustrative)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 0.9fr 2fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>System</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Est. monthly cost
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>Trade</div>
              {[
                {
                  name: "Pinecone (pod-based)",
                  cost: "~$30K",
                  trade: "Managed, opinionated scaling, no ops team needed",
                  color: C.red,
                },
                {
                  name: "Self-host Qdrant on AWS",
                  cost: "~$8K",
                  trade: "You run it, ops load but great cost/feature ratio",
                  color: C.yellow,
                },
                {
                  name: "pgvector on big Postgres",
                  cost: "~$5K",
                  trade: "SQL transactions, cheapest, ops burden + feature limits",
                  color: C.green,
                },
              ].flatMap((r) => [
                <div
                  key={`n-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}10`,
                    borderRadius: 4,
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div
                  key={`c-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.cost}
                </div>,
                <div
                  key={`t-${r.name}`}
                  style={{ padding: "6px 8px", background: `${r.color}06`, borderRadius: 4, color: C.bright }}
                >
                  {r.trade}
                </div>,
              ])}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Numbers are order-of-magnitude illustrations, not authoritative
            <br />
            Ratios are durable: Pinecone ~4x-6x self-host, pgvector cheapest but operationally limited
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The real decision is ops capacity: a two-engineer team may rationally pay Pinecone&apos;s premium to skip
            the infrastructure grind.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Decision lens: cost per million vectors, cost per million queries
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Normalize the cost comparison to two numbers: dollars per million vectors per month (storage cost) and
            dollars per million queries (compute cost). These ratios stay roughly constant as the workload changes,
            which makes them the cleanest metric for vendor comparisons and scale-up planning.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Cost ratios as the decision lens
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  metric: "$ per million vectors per month",
                  what: "Storage side of the cost - scales with N",
                  example: "Pinecone ~$60 / Qdrant ~$16 / pgvector ~$10",
                },
                {
                  metric: "$ per million queries",
                  what: "Compute side - scales with QPS",
                  example: "Pinecone ~$6 / Qdrant ~$1.5 / pgvector ~$1",
                },
              ].map((r) => (
                <div
                  key={r.metric}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={C.purple} bold size={14} center>
                    {r.metric}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                    {r.what}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 4, fontFamily: "monospace" }} center>
                    {r.example}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            The right decision framework = <span style={{ color: C.purple }}>per-million cost ratios</span>
            <br />
            Adjusted for ops capacity + feature needs
            <br />
            Numbers change over time; the shape of the decision does not
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            With per-million ratios + ops capacity in hand, the team can reach a defensible vendor decision from first
            principles rather than marketing copy.
          </T>
        </Box>
      </Reveal>
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
}
