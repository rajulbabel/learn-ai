import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Graph node positions for the 3-layer HNSW illustration in 11.18 sub=1. Eight bottom
// nodes with space for PQ-code labels, a middle hub layer with 3 nodes, and a single
// top hub. Positions are tuned so the code labels never overlap adjacent nodes.
const HNSWPQ_LAYERS = {
  L0: [
    { id: "a", x: 60, y: 260, code: "[c17,...]" },
    { id: "b", x: 130, y: 260, code: "[c22,...]" },
    { id: "c", x: 200, y: 260, code: "[c41,...]" },
    { id: "d", x: 270, y: 260, code: "[c38,...]" },
    { id: "e", x: 340, y: 260, code: "[c55,...]" },
    { id: "f", x: 410, y: 260, code: "[c62,...]" },
    { id: "g", x: 480, y: 260, code: "[c71,...]" },
    { id: "h", x: 550, y: 260, code: "[c85,...]" },
  ],
  L1: [
    { id: "h1", x: 130, y: 160, code: "[c22, c199, ...]" },
    { id: "h2", x: 300, y: 160, code: "[c38, c175, ...]" },
    { id: "h3", x: 470, y: 160, code: "[c71, c144, ...]" },
  ],
  L2: [{ id: "top", x: 300, y: 60, code: "[c38, c175, ...]" }],
};
const HNSWPQ_EDGES = {
  L0: [
    ["a", "b"],
    ["b", "c"],
    ["c", "d"],
    ["d", "e"],
    ["e", "f"],
    ["f", "g"],
    ["g", "h"],
    ["a", "c"],
    ["c", "e"],
    ["e", "g"],
    ["b", "d"],
    ["d", "f"],
    ["f", "h"],
  ],
  L1: [
    ["h1", "h2"],
    ["h2", "h3"],
  ],
  V: [
    ["L1:h1", "L0:b"],
    ["L1:h2", "L0:d"],
    ["L1:h3", "L0:g"],
    ["L2:top", "L1:h2"],
  ],
};

export default function HNSWPQ(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const layerLookup = {
    L0: Object.fromEntries(HNSWPQ_LAYERS.L0.map((n) => [n.id, n])),
    L1: Object.fromEntries(HNSWPQ_LAYERS.L1.map((n) => [n.id, n])),
    L2: Object.fromEntries(HNSWPQ_LAYERS.L2.map((n) => [n.id, n])),
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            HNSW gives fast search; PQ gives small vectors
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            IVF-PQ shines on static billion-scale corpora, but many production systems want graph-navigation speed AND
            compressed vectors. HNSW (chapters 11.8-11.11) gives logarithmic-hop search over a multi-layer small-world
            graph. PQ (chapter 11.15) gives 32x compression per vector. HNSW + PQ keeps the HNSW graph structure
            unchanged and swaps out the float32 payload at each node for a PQ code - small memory, fast graph, one index
            to tune.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                HNSW - graph navigation
              </T>
              <div style={{ marginTop: 8, fontSize: 15, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Multi-layer small-world graph over all N vectors</div>
                <div>&bull; O(log N) hops from entry point to the beam</div>
                <div>&bull; M = 16 edges per node at layer 0 (default)</div>
                <div>&bull; Ef_search = 50 candidates at query time</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                PQ - byte-coded vectors
              </T>
              <div style={{ marginTop: 8, fontSize: 15, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; M = 96 subvectors, 256 centroids per slot</div>
                <div>&bull; Each vector encoded as m bytes (96 bytes at m = 96)</div>
                <div>&bull; 32x smaller than the float32 baseline</div>
                <div>&bull; Distances via the asymmetric lookup table</div>
              </div>
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
            HNSW graph structure (edges, layers, M, ef_search) = <span style={{ color: C.yellow }}>unchanged</span>
            <br />
            Node payload: float32 vector &rarr; <span style={{ color: C.purple }}>PQ code</span> (96 bytes instead of
            3,072)
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The search algorithm is byte-for-byte the same - enter at the top hub, greedy-descend, beam-search at layer
            zero. Only the distance function changes: it consults PQ codes instead of float32 vectors.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Every node stores a PQ code instead of a float32 vector
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Picture the 3-layer HNSW graph from chapter 11.8. In HNSW + PQ, every node label changes from a float32
            vector to a 96-byte PQ code. Edges, layer assignments, entry points - all untouched. The memory math shifts
            dramatically: the graph costs stay near 100 bytes per vector (M = 16 edges at layer 0 plus sparse upper
            layers), and the payload drops from 3,072 to 96 bytes. Total per-vector footprint: about 196 bytes.
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
              Three-layer HNSW graph with PQ codes at every node
            </T>
            <svg viewBox="0 0 620 320" style={{ width: "100%", maxWidth: 640, height: "auto", display: "block" }}>
              <desc>
                Three-layer HNSW graph where each node is labeled as a compact PQ code like [c17, c203, c89, ...]
                instead of a float vector. The bottom layer (cyan) holds all eight docs with dense edges, the middle
                layer (yellow) holds three hub nodes with long-range edges, and the top layer (red) has a single global
                entry-point node. Vertical green dashed lines are layer-to-layer links. Illustrates that HNSW + PQ keeps
                the graph structure and replaces only the node payload.
              </desc>
              <rect x={20} y={30} width={580} height={60} fill={`${C.red}08`} stroke={`${C.red}20`} strokeWidth={1} />
              <rect
                x={20}
                y={130}
                width={580}
                height={60}
                fill={`${C.yellow}08`}
                stroke={`${C.yellow}20`}
                strokeWidth={1}
              />
              <rect
                x={20}
                y={230}
                width={580}
                height={60}
                fill={`${C.cyan}08`}
                stroke={`${C.cyan}20`}
                strokeWidth={1}
              />
              <text x={30} y={50} fill={C.red} fontSize={12} fontWeight="bold">
                Layer 2 (top hub)
              </text>
              <text x={30} y={150} fill={C.yellow} fontSize={12} fontWeight="bold">
                Layer 1 (hubs)
              </text>
              <text x={30} y={250} fill={C.cyan} fontSize={12} fontWeight="bold">
                Layer 0 (all docs)
              </text>
              {HNSWPQ_EDGES.V.map(([from, to], i) => {
                const [fL, fId] = from.split(":");
                const [tL, tId] = to.split(":");
                const f = layerLookup[fL][fId];
                const t = layerLookup[tL][tId];
                return (
                  <line
                    key={`v-${i}`}
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={C.green}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    opacity={0.7}
                  />
                );
              })}
              {HNSWPQ_EDGES.L0.map(([a, b], i) => {
                const na = layerLookup.L0[a];
                const nb = layerLookup.L0[b];
                return (
                  <line
                    key={`l0-${i}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={C.cyan}
                    strokeWidth={1}
                    opacity={0.55}
                  />
                );
              })}
              {HNSWPQ_EDGES.L1.map(([a, b], i) => {
                const na = layerLookup.L1[a];
                const nb = layerLookup.L1[b];
                return (
                  <line
                    key={`l1-${i}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={C.yellow}
                    strokeWidth={1.5}
                    opacity={0.7}
                  />
                );
              })}
              {HNSWPQ_LAYERS.L0.map((n) => (
                <g key={`l0-n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={9} fill={C.cyan} stroke={C.bg} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 3} fill={C.bg} fontSize={9} fontWeight="bold" textAnchor="middle">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y + 22} fill={C.cyan} fontSize={8} fontFamily="monospace" textAnchor="middle">
                    {n.code}
                  </text>
                </g>
              ))}
              {HNSWPQ_LAYERS.L1.map((n) => (
                <g key={`l1-n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={11} fill={C.yellow} stroke={C.bg} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 3} fill={C.bg} fontSize={10} fontWeight="bold" textAnchor="middle">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y + 26} fill={C.yellow} fontSize={9} fontFamily="monospace" textAnchor="middle">
                    {n.code}
                  </text>
                </g>
              ))}
              {HNSWPQ_LAYERS.L2.map((n) => (
                <g key={`l2-n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={13} fill={C.red} stroke={C.bg} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 3} fill={C.bg} fontSize={10} fontWeight="bold" textAnchor="middle">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y - 20} fill={C.red} fontSize={10} fontFamily="monospace" textAnchor="middle">
                    {n.code}
                  </text>
                </g>
              ))}
            </svg>
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
            Per-vector memory = graph edges (&asymp; 100 bytes) + PQ code (96 bytes) ={" "}
            <span style={{ color: C.yellow }}>196 bytes</span>
            <br />
            At N = <span style={{ color: C.yellow }}>100M</span>: 196 &middot; 10^8 bytes ={" "}
            <span style={{ color: C.yellow }}>19.6 GB</span> - fits on a single server
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Compare with float32 HNSW at 100M: 300 GB for vectors + 10 GB for graph = 310 GB, unworkable on one machine.
            HNSW + PQ drops the bill to 19.6 GB without touching the search algorithm.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Distance = asymmetric PQ lookup
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            HNSW walks the graph exactly as before. At every step it has to score a candidate against the query - that
            distance call is the only piece that changes. Instead of a float32 dot product or L2 over d dimensions, it
            looks up m values in the per-query asymmetric-distance table (built once per query in chapter 11.15) and
            sums them. At d = 768, m = 96 that is 96 table reads + 96 adds per distance, about ten times cheaper than
            the float32 equivalent. Graph hop count is identical, per-hop cost drops.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={16}>
                Float32 distance (baseline)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.9,
                }}
              >
                dot(q, v) = <span style={{ color: C.red }}>Sum</span> q[i] &middot; v[i]
                <br />
                d = 768 multiplies + 768 adds
                <br />
                AVX-512: &asymp; 48 fused-multiply-adds
                <br />
                <span style={{ color: C.red }}>baseline cost per distance</span>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Asymmetric PQ distance
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.9,
                }}
              >
                dist(q, code) = <span style={{ color: C.green }}>Sum</span> LUT<sub>slot</sub>[code[slot]]
                <br />
                m = 96 table lookups + 96 adds
                <br />
                Table built once per query (m &middot; 256 entries)
                <br />
                <span style={{ color: C.green }}>~10x faster per distance</span>
              </div>
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
            HNSW hop count &asymp; log<sub>M</sub>(N) &middot; ef_search
            <br />
            Per-hop cost: <span style={{ color: C.red }}>float32</span> &rarr;{" "}
            <span style={{ color: C.green }}>~10x cheaper PQ lookup</span>
            <br />
            Net: end-to-end query latency drops by a factor near 10x at common settings
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The lookup table holds the query-to-centroid distances for every slot. Once it is built, every doc in the
            graph is just m table reads and m adds away from a full estimated distance.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            PQ adds distance error; bigger ef_search recovers recall
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            PQ distances are approximations. Most of the time the ranking is right, but a small fraction of pairs get
            re-ordered - the error is typically 1 to 4 percent at m = 96, more at smaller m. On a graph, a ranking slip
            means HNSW&apos;s greedy descent occasionally takes a slightly wrong hop. At a fixed ef_search = 50 the
            recall drop is noticeable but modest. Raising ef_search widens the candidate beam at layer zero and most of
            the lost recall comes back.
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
              Recall@10 vs ef_search at M = 16 (typical workload)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.7fr 1fr 1fr 1.4fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>ef_search</div>
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>
                HNSW float32
              </div>
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>HNSW + PQ</div>
              <div style={{ color: C.red, fontWeight: "bold", textAlign: "center", padding: "6px 8px" }}>Note</div>
              {[
                { ef: 50, fp: "0.97", pq: "0.92", note: "Baseline, PQ drops 5%" },
                { ef: 100, fp: "0.98", pq: "0.94", note: "Raising ef starts helping" },
                { ef: 150, fp: "0.99", pq: "0.96", note: "Nearly recovered" },
                { ef: 200, fp: "0.99", pq: "0.97", note: "Matches float within 2%" },
              ].flatMap((r) => [
                <div
                  key={`ef-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {r.ef}
                </div>,
                <div
                  key={`fp-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {r.fp}
                </div>,
                <div
                  key={`pq-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.pq}
                </div>,
                <div
                  key={`note-${r.ef}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    color: C.dim,
                    fontSize: 12,
                  }}
                >
                  {r.note}
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Recall<sub>HNSW+PQ</sub> &asymp; recall<sub>HNSW</sub> &minus;{" "}
            <span style={{ color: C.red }}>1% to 5%</span> (varies with PQ m)
            <br />
            Dial: raise <span style={{ color: C.red }}>ef_search</span> from 50 to 150 to recover most of the gap
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The recall hit is predictable and small; the fix is a one-knob change at query time. Smaller m (more
            aggressive compression) widens the gap - tune m and ef_search together against your recall target.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Production deployments of HNSW + PQ
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            HNSW + PQ is now the default answer for 100M - 1B scale production search when filtering, updates, and
            low-latency matter. Every major self-hostable vector database exposes it as a configuration flag on top of a
            vanilla HNSW index - same graph code, same search, a toggle for compression.
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
              Where HNSW + PQ ships today
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
                  name: "Qdrant",
                  config: "quantization_config.product",
                  note: "Scalar, product, and binary on top of HNSW",
                },
                {
                  name: "Weaviate",
                  config: "VectorIndexConfig.pq.enabled: true",
                  note: "PQ or BQ layered on HNSW, trainable centroids",
                },
                {
                  name: "Milvus",
                  config: "HNSW_PQ / HNSW_SQ index types",
                  note: "Both scalar and product quantization flavors",
                },
                {
                  name: "pgvector",
                  config: "Scalar quantization + HNSW",
                  note: "SQ is live today; PQ on the roadmap",
                },
              ].map((sys) => (
                <div
                  key={sys.name}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={15}>
                    {sys.name}
                  </T>
                  <div
                    style={{ marginTop: 4, fontFamily: "monospace", fontSize: 12, color: C.bright, lineHeight: 1.5 }}
                  >
                    {sys.config}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {sys.note}
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
            <span style={{ color: C.purple }}>HNSW + PQ is the modern production default</span>
            <br />
            For 100M - 1B scale similarity search
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One graph engine, one compression switch. Start with plain HNSW for quick prototyping, flip on PQ when
            memory bites. The API surface barely changes; the memory footprint drops an order of magnitude.
          </T>
        </Box>
      </Reveal>
      {sub < 4 && (
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
