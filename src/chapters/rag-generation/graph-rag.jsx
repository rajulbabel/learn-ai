import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const GRAG_NODES = [
  { id: 1, name: "Smith v Jones", x: 130, y: 80, community: 0 },
  { id: 2, name: "Doe v Acme", x: 270, y: 60, community: 0 },
  { id: 3, name: "Roe v Tech", x: 420, y: 70, community: 0 },
  { id: 4, name: "Brown v Board", x: 200, y: 180, community: 0 },
  { id: 5, name: "Garcia v State", x: 360, y: 180, community: 0 },
  { id: 6, name: "Miller v EEOC", x: 540, y: 150, community: 0 },
  { id: 7, name: "Apex v Beta", x: 90, y: 290, community: 1 },
  { id: 8, name: "Cosmos v Stellar", x: 230, y: 320, community: 1 },
  { id: 9, name: "Delta v Epsilon", x: 370, y: 310, community: 1 },
  { id: 10, name: "Falcon v GoTech", x: 510, y: 290, community: 1 },
  { id: 11, name: "Hera v Olympus", x: 640, y: 250, community: 1 },
  { id: 12, name: "Aurora v Beacon", x: 130, y: 420, community: 2 },
  { id: 13, name: "Cipher v Decode", x: 290, y: 440, community: 2 },
  { id: 14, name: "Eagle v Falcon IP", x: 460, y: 420, community: 2 },
  { id: 15, name: "Sigma v Tau", x: 620, y: 410, community: 2 },
];

const GRAG_EDGES = [
  [1, 4],
  [2, 1],
  [2, 4],
  [3, 1],
  [3, 2],
  [4, 6],
  [5, 4],
  [5, 6],
  [6, 4],
  [3, 5],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 8],
  [9, 7],
  [10, 8],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 12],
  [12, 14],
  [13, 15],
  [7, 12],
  [9, 13],
  [11, 15],
  [2, 7],
];
const GRAG_SUBGRAPH_NODES = new Set([1, 2, 3, 4, 5]);

const GRAG_COMMUNITY_COLORS = [
  { name: "Civil Rights", color: C.red, accent: "#ef9a9a" },
  { name: "Contract Law", color: C.cyan, accent: "#80deea" },
  { name: "IP Law", color: C.orange, accent: "#ffcc80" },
];

const GRAG_COMMUNITY_SUMMARIES = [
  {
    name: "Civil Rights",
    nodeCount: 6,
    color: C.red,
    accent: "#ef9a9a",
    summary: "Cases established protected-class precedents under Title VII and the Equal Protection Clause.",
  },
  {
    name: "Contract Law",
    nodeCount: 5,
    color: C.cyan,
    accent: "#80deea",
    summary: "Cases interpreted breach-of-contract remedies, specific performance, and damages caps.",
  },
  {
    name: "IP Law",
    nodeCount: 4,
    color: C.orange,
    accent: "#ffcc80",
    summary: "Cases shaped fair-use boundaries, trademark dilution, and software copyrightability.",
  },
];

const GRAG_GLOBAL_LOCAL = [
  {
    type: "Local Query",
    color: C.green,
    accent: "#a5d6a7",
    query: "How did the court rule in Smith v Jones?",
    plan: "Retrieve the Smith v Jones node + 1-hop neighbors (5 nodes total).",
    answer: "Direct answer from the subgraph.",
  },
  {
    type: "Global Query",
    color: C.purple,
    accent: "#b8a9ff",
    query: "What are the main themes across this corpus?",
    plan: "Retrieve all 3 community summaries; map-reduce summarize them.",
    answer: "High-level themes answer the question without retrieving every doc.",
  },
];

const GRAG_WORTH_CARDS = [
  {
    title: "Worth It",
    color: C.green,
    accent: "#a5d6a7",
    bullets: [
      "Rich entity-relationship corpus (legal, biomedical, code)",
      "Global queries common (themes, summaries, comparisons)",
      "Long-term value (build the graph once, query many times)",
    ],
  },
  {
    title: "Not Worth It",
    color: C.red,
    accent: "#ef9a9a",
    bullets: [
      "Mostly self-contained docs (FAQ, support knowledge base - like our primary corpus)",
      "Only local / factoid queries",
      "Schema churn (entities change weekly)",
    ],
  },
  {
    title: "Cost",
    color: C.orange,
    accent: "#ffcc80",
    bullets: [
      "Per-doc LLM extraction at index time (~$0.02 per doc)",
      "Re-extract on doc changes",
      "Graph storage + community detection compute",
    ],
  },
  {
    title: "Mitigations",
    color: C.cyan,
    accent: "#80deea",
    bullets: [
      "Cache extractions",
      "Run community detection nightly, not per-query",
      "Hybrid: GraphRAG for global queries, naive RAG for local",
    ],
  },
];

export default function GraphRAG(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const GR_VB_W = 800;
  const GR_VB_H = 500;

  const renderGraph = (highlightSet = null, useCommunityColors = false, descText) => (
    <svg viewBox={`0 0 ${GR_VB_W} ${GR_VB_H}`} width="100%" style={{ maxWidth: 800, height: "auto" }}>
      <desc>{descText}</desc>
      {/* Edges */}
      {GRAG_EDGES.map(([from, to], i) => {
        const fromNode = GRAG_NODES.find((n) => n.id === from);
        const toNode = GRAG_NODES.find((n) => n.id === to);
        const isHighlighted = highlightSet && highlightSet.has(from) && highlightSet.has(to);
        return (
          <line
            key={i}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke={isHighlighted ? C.orange : "#80deea"}
            strokeOpacity={isHighlighted ? "0.9" : "0.25"}
            strokeWidth={isHighlighted ? "2.5" : "1"}
          />
        );
      })}
      {/* Nodes */}
      {GRAG_NODES.map((n) => {
        const isHighlighted = highlightSet && highlightSet.has(n.id);
        const fillColor = useCommunityColors ? GRAG_COMMUNITY_COLORS[n.community].color : C.purple;
        const accentColor = useCommunityColors ? GRAG_COMMUNITY_COLORS[n.community].accent : "#b8a9ff";
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={isHighlighted ? "14" : "10"}
              fill={isHighlighted ? C.orange : fillColor}
              fillOpacity={isHighlighted ? "0.6" : "0.3"}
              stroke={isHighlighted ? C.orange : fillColor}
              strokeWidth={isHighlighted ? "2.5" : "1.5"}
            />
            <text
              x={n.x}
              y={n.y + 26}
              fill={isHighlighted ? "#ffcc80" : accentColor}
              fontSize="11"
              textAnchor="middle"
              fontWeight={isHighlighted ? "700" : "400"}
            >
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Corpus switch */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Why This Chapter Uses A Different Corpus
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The customer-support corpus is mostly self-contained how-to pages. Relationships are sparse, so GraphRAG
            over it would build a thin graph. This chapter switches to a 15-node legal-citation network because the
            customer-support corpus lacks rich entity-relationship structure.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Customer Support Corpus - Won't Fit
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                30 docs, mostly self-contained how-to pages. Relationships sparse. A graph here would have few edges and
                demonstrate nothing.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Legal Citation Network - Fits
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                15 case decisions where each cites 2-5 prior cases. Rich entities (Plaintiff, Defendant, Court, Statute)
                and a real graph topology.
              </T>
            </div>
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            The customer-support corpus returns in chapter 22.8. This chapter only uses the legal-citation secondary
            corpus.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Entity + relation extraction */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Offline: Extract Entities And Relations With An LLM
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Each case runs through an LLM extraction prompt once at index time. The LLM emits entities (people,
            organizations, statutes) and relations (sued, decided-in, applies, holding). Cost is ~$0.02 per doc.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={15}>
              Example: "Smith v Jones (2018)"
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <T color="#80deea" bold size={14}>
                  Entities
                </T>
                <T color="#80deea" size={13} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  Smith (Plaintiff)
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Jones (Defendant)
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Northern District Court
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Title VII (Statute)
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  "Discrimination Found" (Holding)
                </T>
              </div>
              <div style={{ textAlign: "center" }}>
                <T color="#80deea" bold size={14}>
                  Relations
                </T>
                <T color="#80deea" size={13} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  Smith -- sued --&gt; Jones
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Smith v Jones -- decided-in --&gt; Northern District Court
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Smith v Jones -- applies --&gt; Title VII
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Smith v Jones -- holding --&gt; Discrimination Found
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── 15-node graph */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The 15-Node Citation Graph
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Built once offline. Each node is a case; each directed edge is a citation from the citing case to the cited
            case. Updated incrementally as new cases come in.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            {renderGraph(
              null,
              false,
              "Fifteen-node legal citation graph used as the GraphRAG running corpus, with cases as nodes and directed citation edges between them.",
            )}
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            15 cases, 27 citation edges. Built once offline; updated incrementally as new cases arrive.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Subgraph retrieval */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Query Time: Retrieve A Subgraph
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Query: "What is the precedent chain for workplace discrimination cases?" The retriever finds a 5-node
            subgraph (Smith v Jones, Doe v Acme, Roe v Tech, Brown v Board, Garcia v State) and sends only those nodes +
            their edges to the LLM. Entity-aware retrieval; the graph topology is the signal.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            {renderGraph(
              GRAG_SUBGRAPH_NODES,
              false,
              "Subgraph retrieval highlight on the 15-node citation graph showing how a query selects a 5-node connected component (a precedent chain) as the retrieved context.",
            )}
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            5 nodes highlighted in orange. The LLM reads only the highlighted subgraph - not the whole 15-node corpus.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Communities */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Communities: Cluster The Graph For Global Queries
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Community detection (Leiden or Louvain) groups densely-connected nodes into clusters. Each community gets an
            LLM-generated summary at index time. Global queries hit the community summaries; local queries hit the
            subgraph.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            {renderGraph(
              null,
              true,
              "Same 15-node citation graph re-colored into three communities (Civil Rights, Contract Law, IP Law) for global-query summarization.",
            )}
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {GRAG_COMMUNITY_SUMMARIES.map((c) => (
              <div
                key={c.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${c.color}06`,
                  border: `1px solid ${c.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={c.color} bold center size={15}>
                  {c.name} ({c.nodeCount} Nodes)
                </T>
                <T color={c.accent} center size={13} style={{ marginTop: 6 }}>
                  {c.summary}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Global vs local */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Global Queries Use Communities, Local Queries Use Subgraphs
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Two query patterns, two routing paths. Local queries need a specific subgraph; global queries need an
            overview that no single subgraph contains.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {GRAG_GLOBAL_LOCAL.map((q) => (
              <div
                key={q.type}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${q.color}06`,
                  border: `1px solid ${q.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={q.color} bold center size={15}>
                  {q.type}
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
                  "{q.query}"
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8 }}>
                  Plan: {q.plan}
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8 }}>
                  Output: {q.answer}
                </T>
              </div>
            ))}
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Global queries are GraphRAG's killer feature. Naive RAG cannot answer them without retrieving everything;
            GraphRAG answers from the community summaries.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── When worth it */}
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            When To Reach For GraphRAG
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            GraphRAG is expensive to build and maintain. Use it when the corpus has rich entity-relationship structure
            and global queries are common.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {GRAG_WORTH_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.bullets.map((b, i) => (
                    <T key={i} color={card.accent} center size={13}>
                      {b}
                    </T>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      {sub < 6 && (
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
