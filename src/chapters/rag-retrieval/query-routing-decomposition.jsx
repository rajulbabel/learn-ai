import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Sub=0 two-column strategy card.
const QRD_STRATEGY_COLS = [
  {
    side: "Routing",
    question: "Which index / tool should this query hit?",
    answer: "Pick one target. Skip retrieval entirely for off-topic chitchat.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    side: "Decomposition",
    question: "Does this query need to be split into sub-queries?",
    answer: "Split complex queries into 2-3 sub-queries; retrieve and assemble.",
    color: C.orange,
    accent: "#ffcc80",
  },
];

// Sub=1 router decision tree.
const QRD_ROUTER_LEAVES = [
  {
    branch: "Account & Billing",
    target: "Account-Billing Index",
    topK: "Top-K = 5",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    branch: "Product Features",
    target: "Product-Features Index",
    topK: "Top-K = 5",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    branch: "Troubleshooting",
    target: "Troubleshooting Index",
    topK: "Top-K = 8",
    color: C.yellow,
    accent: "#ffe082",
  },
  {
    branch: "Chitchat / Off-Topic",
    target: "Skip Retrieval",
    topK: "Reply Directly",
    color: C.red,
    accent: "#ef9a9a",
  },
];

// Sub=2 router implementation comparison.
const QRD_ROUTER_IMPLS = [
  {
    name: "Semantic Router (Embedding-Based)",
    how: "Embed the query, compare to embeddings of route prototypes ('Billing question', 'Troubleshooting question'). Pick highest cosine.",
    cost: "~$0.0001 / Query",
    latency: "~10 Ms",
    accuracy: "85-90%",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    name: "LLM Classifier",
    how: "Pass the query + route labels to a small LLM ('Classify this query: billing / feature / troubleshoot / chitchat'). Pick the label.",
    cost: "~$0.0002 / Query",
    latency: "~150 Ms",
    accuracy: "92-97%",
    color: C.purple,
    accent: "#b8a9ff",
  },
];

// Sub=3 decomposition example.
const QRD_DECOMP_SUBQUERIES = [
  {
    label: "Sub-Query 1",
    text: "What's in the Pro plan?",
    docs: [
      { id: "doc-3", note: "Subscription Tiers" },
      { id: "doc-10", note: "Team Seat Management" },
    ],
    color: C.cyan,
    accent: "#80deea",
  },
  {
    label: "Sub-Query 2",
    text: "What's in the Enterprise plan?",
    docs: [
      { id: "doc-3", note: "Subscription Tiers" },
      { id: "doc-10", note: "Team Seat Management" },
      { id: "doc-21", note: "Quota Exceeded - Enterprise-Only Feature" },
    ],
    color: C.purple,
    accent: "#b8a9ff",
  },
];

// Sub=4 when-to-decompose row cards.
const QRD_DECOMP_SHAPES = [
  {
    shape: "Comparison",
    example: "Compare the Pro and Enterprise plans.",
    split: "Sub-1: What's in the Pro plan? + Sub-2: What's in the Enterprise plan?",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    shape: "Multi-Hop",
    example: "How do I reset my password if I forgot my email?",
    split: "Sub-1: How to recover email? + Sub-2: How to reset password?",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    shape: "Disjunction (Mixed Types)",
    example: "Why is the dashboard slow and showing 500 errors?",
    split: "Sub-1: Dashboard slow troubleshooting + Sub-2: 500 error troubleshooting",
    color: C.orange,
    accent: "#ffcc80",
  },
];

// Sub=5 2x2 decision grid.
const QRD_DECISION_GRID = [
  {
    label: "Route Only",
    body: "Most production RAG systems start here. Cheap, easy, high-impact.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    label: "Decompose Only",
    body: "Use when queries are consistently complex (multi-hop, comparisons). Adds 1 LLM call + N parallel retrievals.",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    label: "Both",
    body: "Route first to pick the right index, then decompose if the query is complex. They compose - they don't interfere.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    label: "Neither",
    body: "Default for simple lookup queries. Don't add complexity you don't need.",
    color: C.red,
    accent: "#ef9a9a",
  },
];

export default function QueryRoutingDecomposition(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=1 router decision tree geometry.
  const TREE_VB_W = 720;
  const TREE_VB_H = 280;
  const TREE_ROOT_W = 220;
  const TREE_ROOT_H = 56;
  const TREE_ROOT_X = (TREE_VB_W - TREE_ROOT_W) / 2;
  const TREE_ROOT_Y = 10;
  const TREE_LEAF_W = 150;
  const TREE_LEAF_H = 76;
  const TREE_LEAF_Y = 180;
  const TREE_LEAF_GAP = 18;
  const TREE_LEAVES_SPAN = QRD_ROUTER_LEAVES.length * TREE_LEAF_W + (QRD_ROUTER_LEAVES.length - 1) * TREE_LEAF_GAP;
  const TREE_LEAVES_X_START = (TREE_VB_W - TREE_LEAVES_SPAN) / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Two strategies framed side by side */}
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Routing Decides Where; Decomposition Decides How Many
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Two related query-transformation strategies share this chapter. Routing answers a where question - which
            index or tool should the query hit. Decomposition answers a how-many question - does the query need to be
            split into smaller sub-queries first.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_STRATEGY_COLS.map((col) => (
              <div
                key={col.side}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${col.color}06`,
                  border: `1px solid ${col.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={col.color} bold center size={16}>
                  {col.side}
                </T>
                <T color={col.accent} center size={14} style={{ marginTop: 8 }}>
                  {col.question}
                </T>
                <T color={col.accent} center size={13} style={{ marginTop: 8 }}>
                  {col.answer}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              Both rely on an LLM (or a cheaper classifier) to inspect the query and decide. They compose - a router can
              send a query to a decomposition step, or a decomposed sub-query can itself be routed to a different index.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Router decision tree with 4 leaves */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Routing Sends Each Query To The Right Target
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            On the running support corpus, queries split cleanly into four buckets. A router classifies each query into
            one of them, then sends it to the matching index - or skips retrieval entirely for chitchat.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TREE_VB_W} ${TREE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Router decision tree with four leaves: account/billing, product features, troubleshooting, and chitchat
                (skip retrieval). The root labels classify-query-type.
              </desc>

              {/* Root: Classify Query Type */}
              <rect
                x={TREE_ROOT_X}
                y={TREE_ROOT_Y}
                width={TREE_ROOT_W}
                height={TREE_ROOT_H}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.18"
                stroke={C.cyan}
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
              <text
                x={TREE_ROOT_X + TREE_ROOT_W / 2}
                y={TREE_ROOT_Y + TREE_ROOT_H / 2 + 5}
                fill="#80deea"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                Classify Query Type
              </text>

              {/* Branches and leaves */}
              {QRD_ROUTER_LEAVES.map((leaf, i) => {
                const leafX = TREE_LEAVES_X_START + i * (TREE_LEAF_W + TREE_LEAF_GAP);
                const leafCx = leafX + TREE_LEAF_W / 2;
                const rootCx = TREE_ROOT_X + TREE_ROOT_W / 2;
                const rootBottomY = TREE_ROOT_Y + TREE_ROOT_H;
                return (
                  <g key={leaf.branch}>
                    {/* Branch line from root bottom to leaf top */}
                    <line
                      x1={rootCx}
                      y1={rootBottomY}
                      x2={leafCx}
                      y2={TREE_LEAF_Y}
                      stroke={leaf.color}
                      strokeOpacity="0.55"
                      strokeWidth="1.6"
                    />
                    {/* Leaf rect */}
                    <rect
                      x={leafX}
                      y={TREE_LEAF_Y}
                      width={TREE_LEAF_W}
                      height={TREE_LEAF_H}
                      rx="8"
                      fill={leaf.color}
                      fillOpacity="0.18"
                      stroke={leaf.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.7"
                    />
                    <text
                      x={leafCx}
                      y={TREE_LEAF_Y + 18}
                      fill={leaf.accent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.branch}
                    </text>
                    <text x={leafCx} y={TREE_LEAF_Y + 38} fill={leaf.accent} fontSize="11" textAnchor="middle">
                      {leaf.target}
                    </text>
                    <text
                      x={leafCx}
                      y={TREE_LEAF_Y + 56}
                      fill={leaf.accent}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.topK}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              Routing avoids retrieving from indexes that can&apos;t help. Skipping retrieval on chitchat saves latency
              and cost - and prevents the LLM from hallucinating about a doc it doesn&apos;t need to read.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Router implementations: semantic vs LLM classifier */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Two Router Implementations: Embedding-Based Vs LLM Classifier
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The routing decision can be made by a tiny embedding lookup or by a small LLM call. The tradeoff is the
            usual one: embedding-based is ~15x faster and slightly cheaper; LLM classifier handles ambiguous wording
            better.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {QRD_ROUTER_IMPLS.map((impl) => (
              <div
                key={impl.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${impl.color}06`,
                  border: `1px solid ${impl.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={impl.color} bold center size={15}>
                  {impl.name}
                </T>
                <T color={impl.accent} center size={13} style={{ marginTop: 8 }}>
                  {impl.how}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      background: `${impl.color}12`,
                      border: `1px solid ${impl.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={impl.accent} bold center size={12}>
                      Cost
                    </T>
                    <T color={impl.accent} center size={13} style={{ marginTop: 4 }}>
                      {impl.cost}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      background: `${impl.color}12`,
                      border: `1px solid ${impl.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={impl.accent} bold center size={12}>
                      Latency
                    </T>
                    <T color={impl.accent} center size={13} style={{ marginTop: 4 }}>
                      {impl.latency}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      background: `${impl.color}12`,
                      border: `1px solid ${impl.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={impl.accent} bold center size={12}>
                      Accuracy
                    </T>
                    <T color={impl.accent} center size={13} style={{ marginTop: 4 }}>
                      {impl.accuracy}
                    </T>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Semantic router scales cheaper; LLM classifier handles edge cases better. Start with semantic; switch to
              LLM if routing accuracy stalls below your bar.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Decomposition: Pro vs Enterprise example */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Decomposition Splits &apos;Compare X And Y&apos; Into Two Sub-Queries
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            One query, two subjects. A single vector lookup gets pulled toward whichever subject has stronger phrasing
            and misses the other. Decomposition guarantees both sides of the comparison are retrieved before the LLM
            writes the answer.
          </T>

          {/* Panel A: user query */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}12`,
              border: `1px solid ${C.orange}30`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={14}>
              User Query
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 6 }}>
              &quot;Compare the Pro and Enterprise plans.&quot;
            </T>
          </div>

          {/* Panel B: LLM-generated sub-queries */}
          <T color={C.orange} bold center size={14} style={{ marginTop: 14 }}>
            LLM Splits Into Sub-Queries
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_DECOMP_SUBQUERIES.map((sq) => (
              <div
                key={sq.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${sq.color}06`,
                  border: `1px solid ${sq.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={sq.color} bold center size={13}>
                  {sq.label}
                </T>
                <T color={sq.accent} center size={14} style={{ marginTop: 6 }}>
                  &quot;{sq.text}&quot;
                </T>
              </div>
            ))}
          </div>

          {/* Panel C: retrieved docs per sub-query */}
          <T color={C.orange} bold center size={14} style={{ marginTop: 14 }}>
            Retrieved Docs Per Sub-Query
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_DECOMP_SUBQUERIES.map((sq) => (
              <div
                key={`docs-${sq.label}`}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${sq.color}06`,
                  border: `1px solid ${sq.color}18`,
                  textAlign: "center",
                }}
              >
                <T color={sq.color} bold center size={13}>
                  {sq.label} Hits
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {sq.docs.map((doc) => (
                    <div
                      key={`${sq.label}-${doc.id}`}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        background: `${sq.color}12`,
                        border: `1px solid ${sq.color}24`,
                        textAlign: "center",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}
                    >
                      <T color={sq.accent} center size={12}>
                        {doc.id} - {doc.note}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Assembly step */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}12`,
              border: `1px solid ${C.green}30`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={14}>
              LLM Assembly Step
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
              Union of retrieved docs (doc-3, doc-10, doc-21) is passed to a single LLM call that writes the
              side-by-side comparison.
            </T>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              Without decomposition, retrieval finds one tier&apos;s docs and misses the other. Decomposition guarantees
              both sides of the comparison are retrieved before the LLM has to answer.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When to decompose: 3 shapes */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            When To Decompose: Multi-Hop, Comparison, Disjunction
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Three query shapes consistently benefit from being split before retrieval. Each row shows the shape, a real
            example, and the sub-queries the LLM produces.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {QRD_DECOMP_SHAPES.map((row) => (
              <div
                key={row.shape}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={row.color} bold center size={14}>
                  {row.shape}
                </T>
                <T color={row.accent} center size={13} style={{ marginTop: 6 }}>
                  Example: &quot;{row.example}&quot;
                </T>
                <T color={row.accent} center size={13} style={{ marginTop: 6 }}>
                  Split: {row.split}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffe082" center size={14}>
              If the query has &apos;and&apos; / &apos;compare&apos; / &apos;or&apos; between two distinct subjects,
              decomposition usually helps. Single-subject queries don&apos;t benefit and just pay the extra LLM call for
              nothing.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── 2x2 decision: route, decompose, both, neither */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The Decision: Route, Decompose, Both, Or Neither
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Four combinations cover every production case. Pick by query complexity and the shape of your retrieval
            stack, not by what sounds clever.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_DECISION_GRID.map((cell) => (
              <div
                key={cell.label}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${cell.color}06`,
                  border: `1px solid ${cell.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={cell.color} bold center size={15}>
                  {cell.label}
                </T>
                <T color={cell.accent} center size={13} style={{ marginTop: 8 }}>
                  {cell.body}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f8bbd0" bold center size={14}>
              Cost Summary
            </T>
            <T color="#f8bbd0" center size={13} style={{ marginTop: 6 }}>
              Routing: +10-150 ms / +$0.0001-0.0002 per query. Decomposition: +200-300 ms / +$0.0005 per query.
              Combined: ~+300-450 ms total query-transformation overhead.
            </T>
          </div>
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
