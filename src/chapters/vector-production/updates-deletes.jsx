import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

const UD_NODES = [
  { id: "A", x: 80, y: 90 },
  { id: "B", x: 200, y: 60 },
  { id: "C", x: 320, y: 90 },
  { id: "D", x: 200, y: 160 },
  { id: "E", x: 80, y: 230 },
  { id: "F", x: 200, y: 260 },
  { id: "G", x: 320, y: 230 },
  { id: "H", x: 420, y: 160 },
];
const UD_EDGES = [
  ["A", "B"],
  ["B", "C"],
  ["A", "D"],
  ["B", "D"],
  ["C", "D"],
  ["D", "E"],
  ["D", "F"],
  ["D", "G"],
  ["D", "H"],
  ["E", "F"],
  ["F", "G"],
  ["G", "H"],
];

const UD_DELETE_RECALL = [
  { rate: 0, recall: 0.97 },
  { rate: 10, recall: 0.965 },
  { rate: 20, recall: 0.95 },
  { rate: 30, recall: 0.92 },
  { rate: 40, recall: 0.88 },
  { rate: 50, recall: 0.85 },
];

export default function UpdatesDeletes(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const nodeById = Object.fromEntries(UD_NODES.map((n) => [n.id, n]));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Inserts: append the node, connect to its M nearest
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Adding a new vector to an HNSW index is cheap. The new node is assigned a layer by the usual layer formula,
            its M = 16 nearest existing neighbors are found with a standard search, and edges are drawn. The graph grows
            incrementally and continues to work well for as long as you only insert. This is the happy path every demo
            shows.
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
              Insert flow for a new cat-corpus doc
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
              1. Embed the new doc &rarr; vector v
              <br />
              2. Assign layer <span style={{ color: C.cyan }}>L = floor(&minus;ln(uniform) &middot; mL)</span>
              <br />
              3. Search existing graph for <span style={{ color: C.cyan }}>M = 16</span> nearest neighbors
              <br />
              4. Append node, add M edges, done
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
              { label: "Work per insert", value: "O(log N)", color: C.cyan },
              { label: "Edges added", value: "M = 16", color: C.cyan },
              { label: "Memory growth", value: "Linear in N", color: C.cyan },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "10px 12px",
                  background: `${m.color}08`,
                  border: `1px solid ${m.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={m.color} bold center size={14}>
                  {m.label}
                </T>
                <div
                  style={{ marginTop: 4, fontFamily: "monospace", fontSize: 16, color: m.color, textAlign: "center" }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Append-only systems love this. The index stays coherent forever. The pain starts the moment someone asks to
            delete something.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Delete: paths that routed through this node break
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Remove a node and every edge incident to it goes with it. If the removed node was a hub - the only short
            route between two regions - queries that used to cross it now have to take a longer detour or fail to reach
            their target. Worse, the greedy search has no idea the shortcut is gone; it just silently lands on
            suboptimal neighbors.
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
              Removing hub node D shatters five routing paths
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 320" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Small graph with 8 nodes where central hub node D has edges to A, B, C, E, F, G, and H. The node D is
                  struck through in red to indicate deletion. Every edge touching D is drawn with a dashed red line to
                  indicate that the route is broken. The remaining edges between the outer ring nodes are drawn in dim
                  gray - they still exist but detour around the missing hub.
                </desc>
                {UD_EDGES.map(([a, b], i) => {
                  const na = nodeById[a];
                  const nb = nodeById[b];
                  const broken = a === "D" || b === "D";
                  return (
                    <line
                      key={`ud-edge-${i}`}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke={broken ? C.red : C.dim}
                      strokeWidth={broken ? 2 : 1}
                      strokeDasharray={broken ? "6 4" : "0"}
                      opacity={broken ? 0.9 : 0.5}
                    />
                  );
                })}
                {UD_NODES.map((n) => {
                  const deleted = n.id === "D";
                  return (
                    <g key={`ud-node-${n.id}`}>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={16}
                        fill={deleted ? `${C.red}20` : C.yellow}
                        stroke={deleted ? C.red : C.bg}
                        strokeWidth={2}
                      />
                      <text
                        x={n.x}
                        y={n.y + 4}
                        fill={deleted ? C.red : C.bg}
                        fontSize={13}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {n.id}
                      </text>
                      {deleted && (
                        <line x1={n.x - 18} y1={n.y - 18} x2={n.x + 18} y2={n.y + 18} stroke={C.red} strokeWidth={3} />
                      )}
                    </g>
                  );
                })}
                <text x={260} y={305} fill={C.red} fontSize={13} fontWeight="bold" textAnchor="middle">
                  5 shortest-path routes lost when D disappears
                </text>
              </svg>
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
            <span style={{ color: C.red }}>hub nodes</span> are high-betweenness - many queries route through them
            <br />
            Remove one and those queries land on suboptimal hops
            <br />
            The index is <span style={{ color: C.red }}>broken</span> even though no query errors are thrown
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most production retrievers do not see this until recall regresses in aggregate - a silent quality drop that
            looks like &quot;the model got worse&quot;.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Tombstone: mark deleted, filter at query time
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The standard workaround is the tombstone. Instead of physically removing the node, mark a bit that says
            &quot;deleted&quot; and leave the vector and edges in place. At query time, any tombstoned node is traversed
            (so routing still works) but never returned as a result. This preserves the graph shape while hiding the
            removed document.
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
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Delete pipeline (soft)
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Set node.tombstone = true</div>
                <div>&bull; Node stays in graph, edges untouched</div>
                <div>&bull; Append &quot;deleted&quot; entry to WAL</div>
                <div>&bull; O(1) per delete</div>
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
              <T color={C.green} bold center size={15}>
                Query pipeline
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Greedy descent still hops through tombstoned nodes</div>
                <div>&bull; Tombstoned candidates dropped before the top-k heap</div>
                <div>&bull; Query time filter is a one-bit check per node</div>
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
            Node lives in the graph forever (until rebuild)
            <br />
            Query time filter = <span style={{ color: C.green }}>1 bit per node check</span>
            <br />
            No path breakage today, gradual cost that accumulates
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Tombstones trade the immediate path-break problem for slow bloat. Recall stays fine for the first few
            deletes, then the graph starts wasting work on dead nodes.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            30% deletes: graph holes, wasted hops, recall drops
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Tombstones are fine until they are not. As the tombstone fraction climbs past ~20%, the graph has more and
            more dead nodes that queries must traverse without benefit. Hub nodes that used to provide shortcuts are
            still there, but half the candidates they point to are tombstoned. Recall starts to degrade and query
            latency creeps up.
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
              Recall@10 vs delete percentage (M = 16, ef_search = 50)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 280" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Line chart plotting recall at 10 on the vertical axis (0.80 to 1.00) against delete percentage on the
                  horizontal axis (0 to 50 percent). The orange curve starts at 0.97 at 0 deletes, dips gently to 0.965
                  at 10%, then drops faster through 0.92 at 30% deletes and falls to 0.85 at 50% deletes. Grid lines
                  mark the 20% and 30% thresholds where rebuild is usually triggered.
                </desc>
                <line x1={60} y1={40} x2={60} y2={230} stroke={C.dim} strokeWidth={1} />
                <line x1={60} y1={230} x2={490} y2={230} stroke={C.dim} strokeWidth={1} />
                {[0.8, 0.85, 0.9, 0.95, 1.0].map((y) => {
                  const yPx = 230 - ((y - 0.8) / 0.2) * 190;
                  return (
                    <g key={`y-${y}`}>
                      <line x1={55} y1={yPx} x2={60} y2={yPx} stroke={C.dim} strokeWidth={1} />
                      <text x={50} y={yPx + 3} fill={C.dim} fontSize={11} textAnchor="end">
                        {y.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                {[0, 10, 20, 30, 40, 50].map((x) => {
                  const xPx = 60 + (x / 50) * 430;
                  return (
                    <g key={`x-${x}`}>
                      <line x1={xPx} y1={230} x2={xPx} y2={235} stroke={C.dim} strokeWidth={1} />
                      <text x={xPx} y={250} fill={C.dim} fontSize={11} textAnchor="middle">
                        {x}%
                      </text>
                    </g>
                  );
                })}
                <line
                  x1={60 + (30 / 50) * 430}
                  y1={40}
                  x2={60 + (30 / 50) * 430}
                  y2={230}
                  stroke={C.red}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
                <text x={60 + (30 / 50) * 430} y={35} fill={C.red} fontSize={11} textAnchor="middle">
                  Rebuild trigger
                </text>
                <polyline
                  points={UD_DELETE_RECALL.map((p) => {
                    const xPx = 60 + (p.rate / 50) * 430;
                    const yPx = 230 - ((p.recall - 0.8) / 0.2) * 190;
                    return `${xPx},${yPx}`;
                  }).join(" ")}
                  fill="none"
                  stroke={C.orange}
                  strokeWidth={3}
                />
                {UD_DELETE_RECALL.map((p) => {
                  const xPx = 60 + (p.rate / 50) * 430;
                  const yPx = 230 - ((p.recall - 0.8) / 0.2) * 190;
                  return (
                    <g key={`pt-${p.rate}`}>
                      <circle cx={xPx} cy={yPx} r={4} fill={C.orange} stroke={C.bg} strokeWidth={1.5} />
                      <text x={xPx + 6} y={yPx - 6} fill={C.orange} fontSize={10} fontFamily="monospace">
                        {p.recall.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                <text x={275} y={272} fill={C.dim} fontSize={12} textAnchor="middle">
                  Delete percentage of corpus
                </text>
                <text x={20} y={140} fill={C.dim} fontSize={12} textAnchor="middle" transform="rotate(-90 20 140)">
                  Recall@10
                </text>
              </svg>
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
            0 deletes: <span style={{ color: C.green }}>recall 0.97</span> &middot; 30% deletes:{" "}
            <span style={{ color: C.orange }}>0.92</span> &middot; 50% deletes:{" "}
            <span style={{ color: C.red }}>0.85</span>
            <br />
            Graph degrades smoothly but the drop accelerates past ~20% deletes
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most systems set rebuild alarms at 20-30% tombstoned. Past that the recall loss becomes user-visible and the
            wasted traversal cost shows up in P99 latency.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Rebuild: full, segmented, or incremental
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Once tombstones hurt, the tombstoned nodes have to go. Three standard strategies trade off operational
            complexity against recall restoration speed.
          </T>
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
                name: "Full rebuild",
                color: C.yellow,
                pros: ["simplest code path", "recall back to 0.97"],
                cons: ["downtime while rebuilding", "full CPU burn"],
                when: "Small indexes, scheduled windows",
              },
              {
                name: "Segment rotation",
                color: C.green,
                pros: ["no downtime", "new segment swaps in atomically"],
                cons: ["memory overhead during swap", "operational complexity"],
                when: "Large indexes, 24/7 uptime",
              },
              {
                name: "Incremental repair",
                color: C.orange,
                pros: ["continuous", "no downtime"],
                cons: ["code is subtle", "partial recall recovery"],
                when: "Streaming workloads with steady delete pressure",
              },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.name}
                </T>
                <div style={{ marginTop: 6, fontSize: 13, color: C.bright, lineHeight: 1.6 }}>
                  <div style={{ color: C.green, fontWeight: "bold" }}>Pros</div>
                  {r.pros.map((p, i) => (
                    <div key={i}>&bull; {p}</div>
                  ))}
                  <div style={{ color: C.red, fontWeight: "bold", marginTop: 6 }}>Cons</div>
                  {r.cons.map((p, i) => (
                    <div key={i}>&bull; {p}</div>
                  ))}
                  <div style={{ color: C.dim, fontWeight: "bold", marginTop: 6 }}>When</div>
                  <div>{r.when}</div>
                </div>
              </div>
            ))}
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
            Every approach trades <span style={{ color: C.red }}>downtime</span> against{" "}
            <span style={{ color: C.red }}>operational</span> complexity
            <br />
            Production systems mix all three across tiers
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The segment-rotation pattern is the industry default for anything above 100M vectors - build the next
            segment in the background, atomically swap, free the old.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Index type affects how painful deletes are
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Not every index suffers equally. IVF-based indexes quantize the space into cells; deleting a doc only
            affects one cell and that cell can be rebuilt independently. Graph-based indexes pay more because the
            removed node participates in traversal. Layered indexes (HNSW + PQ) get the worst of both: graph holes plus
            stale codebooks.
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
              Delete pain by index family
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr 1.3fr 1.3fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Index family
              </div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Delete cost
              </div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Rebuild trigger
              </div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                Example
              </div>
              {[
                {
                  name: "IVF / IVF-PQ",
                  cost: "Easy",
                  costColor: C.green,
                  trigger: "Cell-level rebuild at ~50% dead",
                  example: "FAISS IVF_PQ, Milvus IVF",
                },
                {
                  name: "HNSW",
                  cost: "Moderate",
                  costColor: C.yellow,
                  trigger: "Full-graph rebuild at ~30% dead",
                  example: "Qdrant HNSW, Weaviate",
                },
                {
                  name: "HNSW + PQ",
                  cost: "Hardest",
                  costColor: C.red,
                  trigger: "Graph + codebook retrain",
                  example: "Qdrant HNSW+PQ, Milvus HNSW_PQ",
                },
                {
                  name: "pgvector HNSW",
                  cost: "Historically hard",
                  costColor: C.orange,
                  trigger: "VACUUM + REINDEX",
                  example: "pgvector (issue tracked since 0.5)",
                },
              ].flatMap((r) => [
                <div
                  key={`label-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.purple}08`,
                    borderRadius: 4,
                    color: C.purple,
                    fontWeight: "bold",
                  }}
                >
                  {r.name}
                </div>,
                <div
                  key={`cost-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.costColor}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.costColor,
                    fontWeight: "bold",
                  }}
                >
                  {r.cost}
                </div>,
                <div
                  key={`trigger-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.purple}06`,
                    borderRadius: 4,
                  }}
                >
                  {r.trigger}
                </div>,
                <div
                  key={`ex-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.purple}06`,
                    borderRadius: 4,
                    color: C.dim,
                  }}
                >
                  {r.example}
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
            Pick the index family <span style={{ color: C.purple }}>after</span> you know your write/delete pattern
            <br />
            Static corpora: IVF-PQ - churn-heavy: HNSW or segment-rotated pgvector
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The biggest lesson: capacity plans must include delete pressure, not just insert rate. A system that ships
            fine with 10% monthly churn will grind at 40%.
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
