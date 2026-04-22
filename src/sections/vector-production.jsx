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

// ───────────────────────────────────────────────────────────────────────────
// 11.19 Filtering
// ───────────────────────────────────────────────────────────────────────────

// Cat corpus snapshot with synthetic metadata so filter predicates have something
// to hit. tenant_id and published_year are invented for illustration; the text
// matches the canonical 10-doc corpus used across Section 11.
const FILTER_CORPUS = [
  { id: 1, text: "Cats are small domesticated carnivores", tenant: 42, year: 2024 },
  { id: 2, text: "Dogs are loyal pets", tenant: 7, year: 2023 },
  { id: 3, text: "Lions are big cats that live in Africa", tenant: 42, year: 2024 },
  { id: 4, text: "My cat sat on the mat", tenant: 7, year: 2024 },
  { id: 5, text: "Tigers are striped cats", tenant: 42, year: 2022 },
  { id: 6, text: "Python is a programming language", tenant: 7, year: 2024 },
  { id: 7, text: "Kittens grow up to be cats", tenant: 42, year: 2024 },
  { id: 8, text: "The dog chased the cat", tenant: 7, year: 2021 },
  { id: 9, text: "Birds can fly", tenant: 42, year: 2020 },
  { id: 10, text: "Fish live underwater", tenant: 7, year: 2024 },
];

// Graph used in sub=3 to show inline filtered-HNSW: 10 nodes placed on a
// rectangular grid, edges connect near neighbors. `pass` marks which satisfy
// the predicate in the running example.
const FILTERED_HNSW_NODES = [
  { id: 1, x: 90, y: 70, pass: true },
  { id: 2, x: 200, y: 90, pass: false },
  { id: 3, x: 310, y: 70, pass: true },
  { id: 4, x: 140, y: 150, pass: false },
  { id: 5, x: 260, y: 150, pass: true },
  { id: 6, x: 400, y: 130, pass: false },
  { id: 7, x: 90, y: 230, pass: true },
  { id: 8, x: 200, y: 250, pass: false },
  { id: 9, x: 330, y: 220, pass: false },
  { id: 10, x: 440, y: 220, pass: false },
];
const FILTERED_HNSW_EDGES = [
  [1, 2],
  [1, 4],
  [2, 3],
  [2, 5],
  [3, 5],
  [3, 6],
  [4, 5],
  [4, 7],
  [5, 8],
  [5, 9],
  [6, 9],
  [6, 10],
  [7, 8],
  [8, 9],
  [9, 10],
  [1, 3],
  [5, 7],
];
const FILTERED_HNSW_PATH = [1, 3, 5, 7];

export const Filtering = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const nodeById = Object.fromEntries(FILTERED_HNSW_NODES.map((n) => [n.id, n]));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Similarity search with a WHERE clause
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            In production, retrieval is almost never pure vector similarity. Callers attach metadata predicates:
            &quot;find docs similar to this one AND tenant_id = 42 AND published_after = 2024-01-01&quot;. An ANN index
            built over the raw embeddings has no idea what tenant_id or published_year even mean - it ranks by geometry.
            Without help, the top-k can come back with docs that are semantically close but violate the predicate. This
            is the number-one production gotcha with vector search.
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
              The query the app actually sends
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
              SELECT id FROM docs
              <br />
              WHERE <span style={{ color: C.cyan }}>tenant_id = 42</span> AND{" "}
              <span style={{ color: C.cyan }}>published_year &ge; 2024</span>
              <br />
              ORDER BY embedding &lt;=&gt; <span style={{ color: C.cyan }}>query_embedding</span>
              <br />
              LIMIT 3;
            </div>
          </div>
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
              10-doc cat corpus with metadata
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.5fr 3fr 1fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px" }}>id</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px" }}>text</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>tenant</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>year</div>
              <div style={{ color: C.cyan, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>passes?</div>
              {FILTER_CORPUS.map((d) => {
                const passes = d.tenant === 42 && d.year >= 2024;
                return (
                  <div key={`row-${d.id}`} style={{ display: "contents" }}>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        color: passes ? C.cyan : C.dim,
                      }}
                    >
                      {d.id}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        color: passes ? C.bright : C.dim,
                      }}
                    >
                      {d.text}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        textAlign: "center",
                        color: passes ? C.cyan : C.dim,
                      }}
                    >
                      {d.tenant}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.cyan}14` : `${C.cyan}04`,
                        borderRadius: 4,
                        textAlign: "center",
                        color: passes ? C.cyan : C.dim,
                      }}
                    >
                      {d.year}
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: passes ? `${C.green}20` : `${C.red}14`,
                        borderRadius: 4,
                        textAlign: "center",
                        color: passes ? C.green : C.red,
                        fontWeight: "bold",
                      }}
                    >
                      {passes ? "yes" : "no"}
                    </div>
                  </div>
                );
              })}
            </div>
            <T color={C.cyan} size={14} center style={{ marginTop: 10 }}>
              Only docs <span style={{ fontFamily: "monospace", color: C.green, fontWeight: "bold" }}>1, 3, 7</span>{" "}
              pass the predicate. A naive ANN lookup over this corpus returns nearest-by-geometry - it has no way to
              know those filters exist.
            </T>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Three strategies divide this problem up differently. Each has a failure mode. The rest of the chapter walks
            through them in order of increasing sophistication.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Pre-filter: shrink the set, then search
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The simplest strategy: evaluate the predicate first against every document, keep only the survivors, and
            brute-force the similarity over that smaller set. Works beautifully when the filter is tight (few survivors)
            and falls apart when the filter is loose (most docs survive, so you pay full brute-force cost).
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
              Filter funnel at N = 1M with 0.1% selectivity
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 220" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Three-stage filter funnel for the pre-filter strategy. Wide left trapezoid represents 1 million
                  vectors in the corpus. Middle narrowing trapezoid represents the ~1,000 docs that pass the tenant and
                  year predicates. Right-most narrow trapezoid represents the final top-3 returned after brute-force
                  similarity search over the survivors.
                </desc>
                <polygon
                  points="30,30 180,30 180,190 30,190"
                  fill={`${C.yellow}22`}
                  stroke={C.yellow}
                  strokeWidth={2}
                />
                <polygon
                  points="180,30 180,190 320,150 320,70"
                  fill={`${C.yellow}36`}
                  stroke={C.yellow}
                  strokeWidth={2}
                />
                <polygon
                  points="320,70 320,150 470,130 470,90"
                  fill={`${C.green}40`}
                  stroke={C.green}
                  strokeWidth={2}
                />
                <text x={105} y={110} fill={C.yellow} fontSize={18} fontWeight="bold" textAnchor="middle">
                  1M docs
                </text>
                <text x={105} y={132} fill={C.bright} fontSize={12} textAnchor="middle">
                  full corpus
                </text>
                <text x={250} y={110} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  1,000
                </text>
                <text x={250} y={128} fill={C.bright} fontSize={11} textAnchor="middle">
                  pass predicate
                </text>
                <text x={395} y={110} fill={C.green} fontSize={14} fontWeight="bold" textAnchor="middle">
                  top-3
                </text>
                <text x={395} y={128} fill={C.bright} fontSize={11} textAnchor="middle">
                  brute-force
                </text>
                <text x={260} y={22} fill={C.dim} fontSize={11} textAnchor="middle">
                  1. filter
                </text>
                <text x={395} y={60} fill={C.dim} fontSize={11} textAnchor="middle">
                  2. rank
                </text>
                <line x1={180} y1={205} x2={320} y2={205} stroke={C.dim} strokeWidth={1} />
                <text x={250} y={216} fill={C.dim} fontSize={10} textAnchor="middle">
                  metadata index read
                </text>
              </svg>
            </div>
          </div>
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
                Tight filter - wins
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; 0.1% selectivity on 1M = 1,000 survivors</div>
                <div>&bull; brute-force over 1k is cheap (~1 ms)</div>
                <div>&bull; recall = 100% - it is exact search</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Loose filter - loses
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; 50% selectivity on 1M = 500k survivors</div>
                <div>&bull; brute-force over 500k is slow (~500 ms)</div>
                <div>&bull; ANN speed is abandoned entirely</div>
              </div>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Pre-filter swaps approximate-fast for exact-slow. The strategy only pays off when the predicate shrinks the
            corpus to a few hundred or thousand survivors.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Post-filter: search first, drop non-matches
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Flip the order. Run the ANN index normally, take the top-100 candidates, then apply the predicate. This
            keeps the ANN speed on any workload, but when the predicate is tight it silently returns fewer than k
            results - sometimes zero - because the survivors you wanted may all sit at position 500 in the ANN ranking.
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
              Post-filter on a tight 0.1% predicate, k = 10
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
              <div>
                step 1: ANN returns top-100 nearest by geometry (<span style={{ color: C.green }}>fast</span>)
              </div>
              <div>
                step 2: evaluate predicate on each - 1 of 100 passes (<span style={{ color: C.red }}>insufficient</span>
                )
              </div>
              <div>
                step 3: return 1 result instead of 10 - <span style={{ color: C.red }}>fewer than k</span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: 3,
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const isSurvivor = i === 47;
              return (
                <div
                  key={`post-${i}`}
                  title={isSurvivor ? "passes predicate" : "dropped"}
                  style={{
                    aspectRatio: "1 / 1",
                    background: isSurvivor ? C.green : `${C.green}08`,
                    border: `1px solid ${isSurvivor ? C.green : `${C.green}14`}`,
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </div>
          <T color={C.green} size={14} center style={{ marginTop: 8 }}>
            100-candidate grid - only one square (position 48) passes the predicate. The response is{" "}
            <span style={{ color: C.red, fontWeight: "bold" }}>empty</span> for everyone who queried with a tight
            filter.
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
            <T color={C.red} bold center size={15}>
              The post-filter trap
            </T>
            <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
              <div>&bull; app asks for 10 results, gets 1 (or 0) back - the UI suddenly looks broken</div>
              <div>&bull; raise the ANN top-k to 1000 to compensate, latency climbs proportionally</div>
              <div>&bull; still no guarantee with very selective filters</div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Post-filter is easy to implement and fast on loose filters. The silent failure mode at high selectivity is
            why this approach is a long-running source of bug reports.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Inline: evaluate the filter during graph traversal
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Both pre- and post-filter separate the two steps. Inline filtering fuses them: at every HNSW graph hop,
            evaluate the predicate before expanding a node. The traversal still explores the graph, but it only counts
            passing nodes as candidates. This is how Qdrant&apos;s payload index works and it is the best-in-class
            performance across almost every selectivity level.
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
              HNSW graph with passing (bright) and failing (dim) nodes
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 300" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Small HNSW-style graph with 10 nodes on a rectangular layout. Nodes 1, 3, 5, 7 that pass the tenant
                  and year predicate are filled in orange, while failing nodes are dimmed. Gray edges connect near
                  neighbors. An orange traversal path with arrows visits only the passing nodes 1 to 3 to 5 to 7,
                  illustrating the Qdrant inline filtered-HNSW approach that evaluates the predicate during graph
                  traversal instead of pre- or post-filtering.
                </desc>
                <defs>
                  <marker
                    id="filt19-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill={C.orange} />
                  </marker>
                </defs>
                {FILTERED_HNSW_EDGES.map(([a, b], i) => {
                  const na = nodeById[a];
                  const nb = nodeById[b];
                  return (
                    <line
                      key={`edge-${i}`}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke={C.dim}
                      strokeWidth={1}
                      opacity={0.5}
                    />
                  );
                })}
                {FILTERED_HNSW_PATH.slice(0, -1).map((from, i) => {
                  const to = FILTERED_HNSW_PATH[i + 1];
                  const nf = nodeById[from];
                  const nt = nodeById[to];
                  return (
                    <line
                      key={`path-${i}`}
                      x1={nf.x}
                      y1={nf.y}
                      x2={nt.x}
                      y2={nt.y}
                      stroke={C.orange}
                      strokeWidth={3}
                      markerEnd="url(#filt19-arrow)"
                    />
                  );
                })}
                {FILTERED_HNSW_NODES.map((n) => (
                  <g key={`node-${n.id}`}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={15}
                      fill={n.pass ? C.orange : `${C.dim}30`}
                      stroke={n.pass ? C.bg : C.dim}
                      strokeWidth={2}
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      fill={n.pass ? C.bg : C.dim}
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {n.id}
                    </text>
                  </g>
                ))}
                <text x={260} y={285} fill={C.orange} fontSize={13} fontWeight="bold" textAnchor="middle">
                  traversal only counts bright nodes as candidates
                </text>
              </svg>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              How Qdrant does it - the payload index
            </T>
            <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
              <div>
                &bull; every payload field (tenant, year, tags) has its own structured index (inverted, range tree)
              </div>
              <div>&bull; at each graph hop the predicate is evaluated via a bitset lookup - O(1) per node</div>
              <div>&bull; non-passing nodes still get traversed (you may have to cross them to reach passing ones)</div>
              <div>&bull; only passing nodes are added to the top-k candidate heap</div>
            </div>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Inline filtering keeps the O(log N) graph navigation and pays only a per-hop bitset lookup. Selectivity
            barely matters - the traversal reaches passing nodes either way.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Where each strategy wins and loses
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Selectivity changes the winner. Pre-filter dominates at extreme tightness (a few survivors), post-filter
            dominates at extreme looseness (almost nothing filtered), and inline filtering wins everywhere in between -
            where most real production workloads sit.
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
              Strategy by filter selectivity (at N = 1M, k = 10)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr 0.9fr 0.9fr 0.9fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>strategy</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                tight 0.1%
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>medium 5%</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>loose 50%</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                universal 100%
              </div>
              {[
                {
                  name: "pre-filter",
                  cells: [
                    { text: "fast + exact", win: true },
                    { text: "acceptable", win: false },
                    { text: "500 ms", win: false },
                    { text: "1 s, brute force", win: false },
                  ],
                },
                {
                  name: "post-filter",
                  cells: [
                    { text: "empty results", win: false, bad: true },
                    { text: "missing some", win: false, bad: true },
                    { text: "good", win: false },
                    { text: "best - ANN speed", win: true },
                  ],
                },
                {
                  name: "inline (Qdrant)",
                  cells: [
                    { text: "great", win: true },
                    { text: "great", win: true },
                    { text: "great", win: true },
                    { text: "matches post-filter", win: false },
                  ],
                },
              ].flatMap((row) => [
                <div
                  key={`label-${row.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}08`,
                    borderRadius: 4,
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {row.name}
                </div>,
                ...row.cells.map((cell, i) => (
                  <div
                    key={`cell-${row.name}-${i}`}
                    style={{
                      padding: "6px 8px",
                      background: cell.win ? `${C.green}22` : cell.bad ? `${C.red}14` : `${C.red}08`,
                      borderRadius: 4,
                      textAlign: "center",
                      color: cell.win ? C.green : cell.bad ? C.red : C.bright,
                      fontWeight: cell.win || cell.bad ? "bold" : "normal",
                    }}
                  >
                    {cell.text}
                  </div>
                )),
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
            inline filtering is the rare &ldquo;no edge case&rdquo; answer
            <br />
            every production system that cares about filters converges on it
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Post-filter is the production footgun: it looks fine in tests on uniform data, then ships and quietly
            returns empty top-ks to the tenant with the tightest filter.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Filters need their own index
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Any of these strategies needs a way to evaluate the predicate quickly. A full table scan defeats the
            purpose. Every production vector DB ships a side index for metadata, and the choice of structure shapes what
            queries are cheap. The four main families below appear in every major system with slightly different
            tradeoffs.
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
              Metadata-index strategies across systems
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
                  system: "Qdrant",
                  index: "inverted index + bitmap on payload",
                  note: "integrates tightly with HNSW traversal, per-field tunable",
                },
                {
                  system: "Pinecone",
                  index: "namespaces + metadata index",
                  note: "namespaces partition physically, metadata via filter DSL",
                },
                {
                  system: "Weaviate",
                  index: "column-store inverted index",
                  note: "learned from Lucene, BM25 and filter share the column layout",
                },
                {
                  system: "pgvector",
                  index: "JSONB GIN or btree on columns",
                  note: "plain Postgres indexing - familiar to any SQL team",
                },
              ].map((row) => (
                <div
                  key={row.system}
                  style={{
                    padding: "10px 12px",
                    background: `${C.purple}08`,
                    border: `1px solid ${C.purple}18`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.purple} bold size={15}>
                    {row.system}
                  </T>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: C.bright,
                    }}
                  >
                    {row.index}
                  </div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {row.note}
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
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            bitmap: <span style={{ color: C.purple }}>O(1)</span> set membership, tiny memory
            <br />
            inverted index: <span style={{ color: C.purple }}>O(log N)</span> lookup per term, great for
            high-cardinality fields
            <br />
            column store: fastest for range predicates, bigger on disk
            <br />
            JSONB GIN: most flexible schema, slowest at scale
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The filter index is the hidden cost behind every filtered vector query. Benchmarks that leave it out always
            look good; production always finds it.
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.20 Updates & Deletes
// ───────────────────────────────────────────────────────────────────────────

// Small HNSW-like graph used in sub=1 and sub=2 to show how deletion
// breaks paths. Node D is central - many routes depend on it.
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

// Recall-vs-delete-rate curve for sub=3.
const UD_DELETE_RECALL = [
  { rate: 0, recall: 0.97 },
  { rate: 10, recall: 0.965 },
  { rate: 20, recall: 0.95 },
  { rate: 30, recall: 0.92 },
  { rate: 40, recall: 0.88 },
  { rate: 50, recall: 0.85 },
];

export const UpdatesDeletes = (ctx) => {
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
              1. embed the new doc &rarr; vector v
              <br />
              2. assign layer <span style={{ color: C.cyan }}>L = floor(&minus;ln(uniform) &middot; mL)</span>
              <br />
              3. search existing graph for <span style={{ color: C.cyan }}>M = 16</span> nearest neighbors
              <br />
              4. append node, add M edges, done
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
              { label: "work per insert", value: "O(log N)", color: C.cyan },
              { label: "edges added", value: "M = 16", color: C.cyan },
              { label: "memory growth", value: "linear in N", color: C.cyan },
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
                <T color={m.color} bold size={14}>
                  {m.label}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 16, color: m.color }}>{m.value}</div>
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
            remove one and those queries land on suboptimal hops
            <br />
            the index is <span style={{ color: C.red }}>broken</span> even though no query errors are thrown
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
                <div>&bull; set node.tombstone = true</div>
                <div>&bull; node stays in graph, edges untouched</div>
                <div>&bull; append &quot;deleted&quot; entry to WAL</div>
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
                <div>&bull; greedy descent still hops through tombstoned nodes</div>
                <div>&bull; tombstoned candidates dropped before the top-k heap</div>
                <div>&bull; query time filter is a one-bit check per node</div>
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
            node lives in the graph forever (until rebuild)
            <br />
            query time filter = <span style={{ color: C.green }}>1 bit per node check</span>
            <br />
            no path breakage today, gradual cost that accumulates
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
              recall@10 vs delete percentage (M = 16, ef_search = 50)
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
                {/* 30% marker */}
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
                  rebuild trigger
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
                  delete percentage of corpus
                </text>
                <text x={20} y={140} fill={C.dim} fontSize={12} textAnchor="middle" transform="rotate(-90 20 140)">
                  recall@10
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
            graph degrades smoothly but the drop accelerates past ~20% deletes
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
                when: "small indexes, scheduled windows",
              },
              {
                name: "Segment rotation",
                color: C.green,
                pros: ["no downtime", "new segment swaps in atomically"],
                cons: ["memory overhead during swap", "operational complexity"],
                when: "large indexes, 24/7 uptime",
              },
              {
                name: "Incremental repair",
                color: C.orange,
                pros: ["continuous", "no downtime"],
                cons: ["code is subtle", "partial recall recovery"],
                when: "streaming workloads with steady delete pressure",
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
                  <div style={{ color: C.green, fontWeight: "bold" }}>pros</div>
                  {r.pros.map((p, i) => (
                    <div key={i}>&bull; {p}</div>
                  ))}
                  <div style={{ color: C.red, fontWeight: "bold", marginTop: 6 }}>cons</div>
                  {r.cons.map((p, i) => (
                    <div key={i}>&bull; {p}</div>
                  ))}
                  <div style={{ color: C.dim, fontWeight: "bold", marginTop: 6 }}>when</div>
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
            every approach trades <span style={{ color: C.red }}>downtime</span> against{" "}
            <span style={{ color: C.red }}>operational</span> complexity
            <br />
            production systems mix all three across tiers
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
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px" }}>index family</div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                delete cost
              </div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px" }}>rebuild trigger</div>
              <div style={{ color: C.purple, fontWeight: "bold", padding: "6px 8px" }}>example</div>
              {[
                {
                  name: "IVF / IVF-PQ",
                  cost: "easy",
                  costColor: C.green,
                  trigger: "cell-level rebuild at ~50% dead",
                  example: "FAISS IVF_PQ, Milvus IVF",
                },
                {
                  name: "HNSW",
                  cost: "moderate",
                  costColor: C.yellow,
                  trigger: "full-graph rebuild at ~30% dead",
                  example: "Qdrant HNSW, Weaviate",
                },
                {
                  name: "HNSW + PQ",
                  cost: "hardest",
                  costColor: C.red,
                  trigger: "graph + codebook retrain",
                  example: "Qdrant HNSW+PQ, Milvus HNSW_PQ",
                },
                {
                  name: "pgvector HNSW",
                  cost: "historically hard",
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
            pick the index family <span style={{ color: C.purple }}>after</span> you know your write/delete pattern
            <br />
            static corpora: IVF-PQ - churn-heavy: HNSW or segment-rotated pgvector
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
};

// ───────────────────────────────────────────────────────────────────────────
// 11.21 Sharding & Partitioning
// ───────────────────────────────────────────────────────────────────────────

export const Sharding = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            About 100M vectors fit on one node
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before thinking about shards, know the single-node ceiling. At d = 768, one float32 vector is 3 KB. An AWS
            r7i.24xlarge has 768 GB of RAM. With HNSW overhead (~100 bytes/vector) and working headroom for caches and
            fragmentation, roughly 100M vectors is the comfortable ceiling on one server. Beyond that, the index has to
            split.
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
              Single-node fit math on an r7i.24xlarge (768 GB RAM)
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
              vectors: 100M &middot; 3 KB = <span style={{ color: C.cyan }}>300 GB</span>
              <br />
              HNSW graph: 100M &middot; 100 B = <span style={{ color: C.cyan }}>10 GB</span>
              <br />
              cache + fragmentation headroom: <span style={{ color: C.cyan }}>~60 GB</span>
              <br />
              total: <span style={{ color: C.green }}>~370 GB of 768 GB RAM</span> - comfortable
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
              { size: "10M", fit: "trivial on a laptop", color: C.green },
              { size: "100M", fit: "one r7i.24xlarge", color: C.yellow },
              { size: "1B+", fit: "must shard", color: C.red },
            ].map((r) => (
              <div
                key={r.size}
                style={{
                  padding: "10px 12px",
                  background: `${r.color}08`,
                  border: `1px solid ${r.color}18`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold size={16}>
                  {r.size}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  {r.fit}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The single-node ceiling is not a wall; it is the point where the operational cost of one big box flips to
            the operational cost of coordinating many smaller boxes.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Random sharding: round-robin by vector id
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The simplest split. Hash each vector id into one of S shards; shard i holds every vector whose id hashes to
            i. Writes distribute evenly; memory per shard is predictable. The catch: every query must fan out to every
            shard because any shard can contain the nearest neighbor.
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
              Random sharding across 4 shards
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 240" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Four shard rectangles labeled shard 0 through shard 3, each holding a random scatter of colored dots
                  representing docs. A query icon at the left sends fan-out arrows to all four shards simultaneously,
                  illustrating that random sharding forces every query to hit every shard.
                </desc>
                <g>
                  <circle cx={40} cy={120} r={14} fill={C.yellow} />
                  <text x={40} y={124} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                    q
                  </text>
                </g>
                {[0, 1, 2, 3].map((i) => {
                  const x = 120 + i * 95;
                  return (
                    <g key={`shard-${i}`}>
                      <line
                        x1={54}
                        y1={120}
                        x2={x + 30}
                        y2={60 + i * 30}
                        stroke={C.yellow}
                        strokeWidth={1.5}
                        opacity={0.8}
                      />
                      <rect
                        x={x}
                        y={40 + i * 30}
                        width={80}
                        height={80}
                        fill={`${C.yellow}08`}
                        stroke={C.yellow}
                        strokeWidth={1.5}
                        rx={6}
                      />
                      <text
                        x={x + 40}
                        y={35 + i * 30}
                        fill={C.yellow}
                        fontSize={11}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        shard {i}
                      </text>
                      {Array.from({ length: 12 }, (_, k) => (
                        <circle
                          key={`dot-${i}-${k}`}
                          cx={x + 10 + (k % 4) * 18}
                          cy={50 + i * 30 + Math.floor(k / 4) * 18}
                          r={4}
                          fill={[C.cyan, C.green, C.orange, C.red, C.purple, C.pink][(i + k) % 6]}
                        />
                      ))}
                    </g>
                  );
                })}
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
            shard placement: <span style={{ color: C.yellow }}>shard(id) = hash(id) mod S</span>
            <br />
            query cost = <span style={{ color: C.yellow }}>S</span> &middot; single-shard query
            <br />
            every shard must fan out to reach every query
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Random sharding gives the best possible load balance and the worst possible query fan-out. For
            throughput-bound workloads the fan-out is fine; for latency-critical workloads it can blow the P99 budget.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Semantic sharding: one IVF cluster per shard
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Cluster the entire corpus with IVF first; each cluster becomes a shard. Now each shard holds vectors from
            one region of the embedding space. A query arrives, computes distance to each centroid (there are only S of
            them), and routes to the nearest nprobe shards. Dramatically fewer shards touched per query.
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
              Semantic sharding: query routes to 2 of 4 shards (nprobe = 2)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 240" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Four shard rectangles each labeled with a region of the embedding space: cats, dogs, animals, and
                  misc. A query icon on the left sends routing arrows to only the two nearest shards (cats and animals);
                  the other two shards are dimmed. Illustrates semantic sharding where IVF clustering decides which
                  shards answer a given query.
                </desc>
                <g>
                  <circle cx={40} cy={120} r={14} fill={C.green} />
                  <text x={40} y={124} fill={C.bg} fontSize={11} fontWeight="bold" textAnchor="middle">
                    q
                  </text>
                </g>
                {[
                  { label: "cats", active: true, color: C.green, cluster: "A" },
                  { label: "animals", active: true, color: C.green, cluster: "B" },
                  { label: "dogs", active: false, color: C.dim, cluster: "C" },
                  { label: "misc", active: false, color: C.dim, cluster: "D" },
                ].map((s, i) => {
                  const x = 120 + i * 95;
                  return (
                    <g key={`ss-${i}`}>
                      {s.active && (
                        <line x1={54} y1={120} x2={x + 30} y2={60 + i * 30} stroke={C.green} strokeWidth={2} />
                      )}
                      <rect
                        x={x}
                        y={40 + i * 30}
                        width={80}
                        height={80}
                        fill={s.active ? `${C.green}14` : `${C.dim}06`}
                        stroke={s.active ? C.green : C.dim}
                        strokeWidth={1.5}
                        rx={6}
                        opacity={s.active ? 1 : 0.4}
                      />
                      <text
                        x={x + 40}
                        y={35 + i * 30}
                        fill={s.color}
                        fontSize={11}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {s.label}
                      </text>
                      <text
                        x={x + 40}
                        y={80 + i * 30 + 20}
                        fill={s.color}
                        fontSize={14}
                        fontWeight="bold"
                        textAnchor="middle"
                        opacity={s.active ? 1 : 0.4}
                      >
                        cluster {s.cluster}
                      </text>
                    </g>
                  );
                })}
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
            shard placement: <span style={{ color: C.green }}>shard(v) = argmin dist(v, centroid_i)</span>
            <br />
            query cost = <span style={{ color: C.green }}>nprobe</span> shards scanned, not S
            <br />
            the corpus is partitioned by semantic region, not by id
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Load balance is worse than random sharding (popular clusters get hotter), but the per-query cost is much
            lower. Most production deployments accept the hotspot risk for the latency gain.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Every shard returns top-k; coordinator merges
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Regardless of placement strategy, the actual query-time protocol is the same: the coordinator sends the
            query to the chosen shards in parallel, each shard runs its local ANN search and returns its top-k, and the
            coordinator merges the lists into the final top-k. Total latency is bound by the slowest shard (fan-out
            tail), not the sum.
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
              Fan-out: 8 shards, each returns top-10, coordinator merges to top-10
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
              step 1: coordinator broadcasts query to 8 shards in parallel
              <br />
              step 2: each shard runs local ANN, returns <span style={{ color: C.orange }}>top-10</span>
              <br />
              step 3: coordinator receives 80 candidates, merges by score, keeps{" "}
              <span style={{ color: C.orange }}>top-10</span>
              <br />
              total latency = fan-out tail + merge cost (~ fast)
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 6,
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`fanout-${i}`}
                style={{
                  padding: "8px 6px",
                  background: `${C.orange}14`,
                  border: `1px solid ${C.orange}30`,
                  borderRadius: 6,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold size={12}>
                  shard {i}
                </T>
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 11, color: C.bright }}>top-10</div>
              </div>
            ))}
          </div>
          <T color={C.orange} center size={14} style={{ marginTop: 8 }}>
            ↓ coordinator merges 8 &times; 10 = 80 candidates ↓
          </T>
          <div
            style={{
              marginTop: 6,
              padding: "10px 12px",
              background: `${C.green}20`,
              border: `1px solid ${C.green}40`,
              borderRadius: 6,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={16}>
              final top-10 returned to client
            </T>
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Tail-latency amplification means P99 gets worse with more shards - if each shard has a 1% chance of being
            slow, 8 shards have roughly an 8% chance the query waits.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Merged top-k is not single-node top-k
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The coordinator can only merge what each shard sends it. If the true top-10 are spread across shards, each
            shard&apos;s local top-10 may miss a true top-10 that sits at local position 11. Result: merged recall is
            lower than a hypothetical single-node top-10 would be. The fix is simple: ask each shard for a buffer -
            top-20 or top-50 - so the merge has more candidates to pick from.
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
              Recall of merged top-10 vs per-shard buffer size
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                per-shard limit
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>
                merged recall@10
              </div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>note</div>
              {[
                { k: "top-10", recall: "0.88", note: "buffer too small, misses spread hits" },
                { k: "top-20", recall: "0.94", note: "typical production buffer" },
                { k: "top-50", recall: "0.97", note: "matches single-node within 0.1%" },
                { k: "top-100", recall: "0.98", note: "diminishing returns, higher network cost" },
              ].flatMap((r) => [
                <div
                  key={`pk-${r.k}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, textAlign: "center" }}
                >
                  {r.k}
                </div>,
                <div
                  key={`rec-${r.k}`}
                  style={{
                    padding: "6px 8px",
                    background: `${C.red}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.red,
                    fontWeight: "bold",
                  }}
                >
                  {r.recall}
                </div>,
                <div
                  key={`note-${r.k}`}
                  style={{ padding: "6px 8px", background: `${C.red}08`, borderRadius: 4, color: C.dim, fontSize: 12 }}
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
            rule of thumb: per-shard buffer = <span style={{ color: C.red }}>k &middot; 2</span> to{" "}
            <span style={{ color: C.red }}>k &middot; 5</span> depending on how clustered your data is
            <br />
            merged recall &ne; single-node recall unless the buffer is large enough
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            This is the bug that ships first and gets fixed later. &quot;Sharded recall is lower than benchmarks&quot;
            is almost always a buffer issue.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Prune shards by filter predicate when possible
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Sharding and filtering interact. When the shard key aligns with a common filter field - for example
            tenant_id is the shard key and the query filters by tenant_id - the coordinator can skip the irrelevant
            shards entirely. When the filter is orthogonal to the shard key, every shard still has to be scanned.
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
                Aligned filter (skip most shards)
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
                  lineHeight: 1.8,
                }}
              >
                shard key: tenant_id
                <br />
                filter: tenant_id = 42
                <br />
                <span style={{ color: C.green }}>fan-out to 1 of 8 shards</span>
                <br />
                coordinator prunes the other 7
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Orthogonal filter (scan all shards)
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
                  lineHeight: 1.8,
                }}
              >
                shard key: vector_id (random)
                <br />
                filter: tenant_id = 42
                <br />
                <span style={{ color: C.red }}>fan-out to all 8 shards</span>
                <br />
                cannot prune - tenant spans shards
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
            pick the shard key to match the <span style={{ color: C.purple }}>hottest filter field</span>
            <br />
            multi-tenant apps almost always shard by tenant_id
            <br />
            multi-region apps almost always shard by region
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Shard key choice is a one-way door. Change it later and every vector has to move. Get it right on day one by
            picking the filter that dominates production query traffic.
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
};
// ───────────────────────────────────────────────────────────────────────────
// 11.22 Replication & High Availability
// ───────────────────────────────────────────────────────────────────────────

export const Replication = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Read replicas: N copies, reads load-balanced
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Vector search is read-heavy. Most production workloads ship 10-100 queries for every write. The natural
            response: run several identical copies of the index (read replicas), put a load balancer in front, and let
            queries spread out. Each replica holds the full index in RAM and answers independently. Throughput scales
            linearly with replica count up to the write rate that the leader can distribute.
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
              Load balancer + 4 read replicas (N copies of the index)
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <svg viewBox="0 0 520 240" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
                <desc>
                  Diagram showing a yellow load-balancer box on the left labeled LB with four arrows fanning out to four
                  cyan replica boxes on the right labeled R1 through R4. Each replica icon has a small index symbol
                  inside. Arrows from clients on the far left enter the load balancer. Illustrates read-replica
                  scale-out where each replica holds a full copy of the index and requests are distributed.
                </desc>
                <g>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <circle key={`client-${i}`} cx={30} cy={30 + i * 45} r={10} fill={C.green} />
                  ))}
                </g>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`cl-line-${i}`}
                    x1={40}
                    y1={30 + i * 45}
                    x2={130}
                    y2={120}
                    stroke={C.dim}
                    strokeWidth={1}
                    opacity={0.5}
                  />
                ))}
                <rect
                  x={130}
                  y={95}
                  width={80}
                  height={50}
                  fill={`${C.yellow}14`}
                  stroke={C.yellow}
                  strokeWidth={2}
                  rx={6}
                />
                <text x={170} y={125} fill={C.yellow} fontSize={16} fontWeight="bold" textAnchor="middle">
                  LB
                </text>
                {[0, 1, 2, 3].map((i) => {
                  const y = 40 + i * 55;
                  return (
                    <g key={`rep-${i}`}>
                      <line x1={210} y1={120} x2={350} y2={y + 20} stroke={C.cyan} strokeWidth={1.5} />
                      <rect
                        x={350}
                        y={y}
                        width={130}
                        height={40}
                        fill={`${C.cyan}14`}
                        stroke={C.cyan}
                        strokeWidth={1.5}
                        rx={6}
                      />
                      <text x={415} y={y + 25} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                        replica R{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x={260} y={220} fill={C.dim} fontSize={11} textAnchor="middle">
                  every replica is an identical copy of the index
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
            QPS capacity &asymp; <span style={{ color: C.cyan }}>replicas &middot; per-replica QPS</span>
            <br />
            memory cost &asymp; <span style={{ color: C.cyan }}>replicas &middot; per-replica RAM</span>
            <br />
            scale reads cheaply; pay in memory instead of latency
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Every managed vector DB sells replicas as a knob. The question is how they stay in sync with writes - the
            next sub-step.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Leader-follower writes with replication lag
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Writes have to go somewhere. The standard pattern is leader-follower: one node (the leader, or primary)
            accepts writes, then ships them asynchronously to the followers. Followers apply the write and become
            eventually consistent with the leader. The time window between &quot;leader applied the write&quot; and
            &quot;follower applied the write&quot; is replication lag.
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
              Typical replication lag in production
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
                { label: "steady state", value: "50 ms", color: C.green, note: "p50 under normal load" },
                { label: "moderate spike", value: "200 ms", color: C.yellow, note: "write burst, healthy pipeline" },
                { label: "heavy spike / rebuild", value: "2 s", color: C.red, note: "followers fall behind" },
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
                  <T color={r.color} bold size={14}>
                    {r.label}
                  </T>
                  <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 20, color: r.color }}>{r.value}</div>
                  <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                    {r.note}
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
            leader accepts write at <span style={{ color: C.yellow }}>t = 0</span>
            <br />
            followers apply it at <span style={{ color: C.yellow }}>t = 50 ms to 2 s</span>
            <br />
            queries in the lag window see <span style={{ color: C.red }}>stale results</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            &quot;I just added a document but the search does not find it&quot; is almost always lag, not a bug. Either
            wait out the window, or route the read-after-write to the leader.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Leader dies, follower promotes
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            If the leader fails, one follower is promoted to primary via a consensus algorithm (Raft in most modern
            vector DBs). Any writes that reached the leader but had not replicated are lost - this is the lag-window
            data-loss risk. Writers that fsync to a synchronous replica pay latency for every write but can survive a
            leader loss with zero data loss.
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
              Failover timeline
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
              t = 0 ms: leader processes write W<sub>n+1</sub>
              <br />t = 10 ms: leader crashes -{" "}
              <span style={{ color: C.red }}>
                W<sub>n+1</sub> never replicated
              </span>
              <br />
              t = 50 ms: followers notice, Raft election starts
              <br />
              t = 500 ms: new leader promoted, cluster accepts writes again
              <br />
              <span style={{ color: C.red }}>lost window: writes in-flight at t=0 to t=10 ms</span>
            </div>
          </div>
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
                Async replication (default)
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; fast writes: ack at leader</div>
                <div>&bull; at-most-50-ms lag typical</div>
                <div>
                  &bull; <span style={{ color: C.red }}>possible data loss on failover</span>
                </div>
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
                Sync replication
              </T>
              <div style={{ marginTop: 6, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; slower writes: ack after 1 follower applies</div>
                <div>&bull; zero data loss on failover</div>
                <div>
                  &bull; <span style={{ color: C.red }}>write latency &asymp; 2x async</span>
                </div>
              </div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Most vector DBs default to async. Pick sync only when a few lost writes in a rare failover would cost more
            than the steady-state latency hit.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Durability: if the RAM dies, is the index gone?
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Vector indexes live in RAM for speed. RAM is volatile. What happens if every node restarts at once? The
            answer depends on the persistence model. Three common patterns: WAL (write-ahead log) on disk, periodic
            snapshots, and source-of-truth rehydration. Most production systems layer all three.
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
              Durability mechanisms compared
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
                {
                  name: "WAL on disk",
                  color: C.green,
                  how: "every write appended to a log before ack",
                  rpo: "RPO = 0 (synchronous) or 1 batch",
                },
                {
                  name: "Periodic snapshots",
                  color: C.yellow,
                  how: "dump the index to disk every N minutes",
                  rpo: "RPO = interval, faster startup",
                },
                {
                  name: "Rehydrate from source",
                  color: C.red,
                  how: "re-read every doc from the app DB, re-embed",
                  rpo: "RPO = 0 but slow",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    padding: "10px 12px",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}18`,
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                >
                  <T color={r.color} bold size={14}>
                    {r.name}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                    {r.how}
                  </T>
                  <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                    {r.rpo}
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
            if every RAM copy dies, the index is only as durable as its{" "}
            <span style={{ color: C.orange }}>WAL + snapshot</span>
            <br />
            the source-of-truth DB is the ultimate recovery path
            <br />
            test it before the outage, not during
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Many teams never test &quot;full cluster loss&quot;. The first time it happens, they discover the snapshot
            cadence is 24 hours and the WAL retention is 1 hour, and they are stuck re-embedding for days.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Recovery time: WAL vs re-embed from source
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Worst case: the entire cluster dies. Recovery time depends entirely on what is cached. A fresh snapshot plus
            WAL replay takes minutes to hours; a full re-embed from the source documents takes days to weeks and costs
            real money.
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
              Recovery time for a 100M-vector corpus
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 1fr",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>strategy</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px", textAlign: "center" }}>time</div>
              <div style={{ color: C.red, fontWeight: "bold", padding: "6px 8px" }}>why</div>
              {[
                {
                  name: "snapshot + WAL replay",
                  time: "10 min - 2 hours",
                  why: "disk I/O bound, graph pages stream in",
                  color: C.green,
                },
                {
                  name: "WAL-only replay (no snapshot)",
                  time: "~12 hours",
                  why: "every insert replayed from scratch",
                  color: C.yellow,
                },
                {
                  name: "Re-embed from source DB",
                  time: "1 - 14 days",
                  why: "embedding API throughput + $ billed per token",
                  color: C.red,
                },
              ].flatMap((r) => [
                <div
                  key={`name-${r.name}`}
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
                  key={`time-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}14`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: r.color,
                    fontWeight: "bold",
                  }}
                >
                  {r.time}
                </div>,
                <div
                  key={`why-${r.name}`}
                  style={{
                    padding: "6px 8px",
                    background: `${r.color}08`,
                    borderRadius: 4,
                    color: C.dim,
                    fontSize: 12,
                  }}
                >
                  {r.why}
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
            RTO budget = <span style={{ color: C.red }}>snapshot cadence + WAL replay rate</span>
            <br />
            pick snapshot interval that matches your RTO target
            <br />
            re-embed is the fallback of last resort, measured in days
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Put this math into the runbook before a real outage. The cost of a one-day outage at 10K QPS usually dwarfs
            the cost of snapshots every 30 minutes.
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
};

export const HybridSearch = stubFactory("Hybrid Search", C.red);
export const Rerankers = stubFactory("Rerankers", C.purple);
export const MultiVectorRetrieval = stubFactory("Multi-vector Retrieval", C.pink);
export const EmbeddingLifecycle = stubFactory("Embedding Lifecycle", C.cyan);
export const Observability = stubFactory("Observability", C.yellow);
export const CapacityPlanning = stubFactory("Capacity Planning", C.green);
