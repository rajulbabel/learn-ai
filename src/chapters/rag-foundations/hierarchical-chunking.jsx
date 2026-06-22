import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const HIERARCHY_SECTIONS = [
  {
    id: "Eligibility",
    summary: "Who Qualifies And Refund Window.",
    leaves: ["L1", "L2", "L3", "L4"],
  },
  {
    id: "Process",
    summary: "Filing Steps And SLAs.",
    leaves: ["L5", "L6", "L7", "L8"],
  },
  {
    id: "Edge Cases",
    summary: "Late Requests And Appeals.",
    leaves: ["L9", "L10", "L11", "L12"],
  },
];

const HIERARCHICAL_LEAF_SCORES = [
  { id: "L7", score: 0.89, isTop: true, snippet: "...No Refunds After 30 Days..." },
  { id: "L3", score: 0.74, isTop: false, snippet: "Refund Eligibility Window: 14 Days Full, 15-30 Days Prorated..." },
  { id: "L12", score: 0.68, isTop: false, snippet: "Appeal Process For Denied Refund Requests..." },
];

const HIERARCHICAL_USE_WHEN = [
  "Docs are long and have natural section structure (manuals, policies, RFCs).",
  "Queries need surrounding context to answer well (legal, medical, technical docs where one sentence is rarely enough).",
  "Storage cost for parent texts is acceptable (roughly 2-3x raw doc size).",
];

const HIERARCHICAL_COST_NOTES = [
  "Storage: index + parent-text store. Roughly 2-3x raw corpus size.",
  "Latency: one extra lookup per hit (parent-from-leaf-id). Sub-millisecond.",
  "Implementation: every major framework has this pattern. LangChain ParentDocumentRetriever, LlamaIndex RecursiveRetriever.",
];

// Tree-layout constants for sub=1 and sub=4 SVG diagrams.
// viewBox: 640 wide, computed symmetric padding for every row.
const TREE_VIEW_W = 640;
const TREE_ROOT_W = 280;
const TREE_ROOT_X = (TREE_VIEW_W - TREE_ROOT_W) / 2; // = 180
const TREE_ROOT_CX = TREE_VIEW_W / 2; // = 320
const TREE_SECTION_W = 120;
const TREE_SECTION_CENTERS = [110, 320, 530]; // 3 sections evenly spaced
const TREE_LEAF_W = 38;
const TREE_LEAF_GAP = 4;

export default function HierarchicalChunking(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Small Chunks Retrieve Better; Large Chunks Generate Better
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Chunk size is a tug-of-war between two phases of RAG. A retriever finds the best matching chunk; an LLM
            answers from the chunk text. The smaller the chunk, the more focused each vector is - but the less context
            the LLM sees. The larger the chunk, the more context the LLM has - but the fuzzier the vector becomes.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Small Chunks (64 Tokens)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}24`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" center size={13}>
                  Retrieval Precision: High. Each chunk is one focused fact.
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}24`,
                  textAlign: "center",
                }}
              >
                <T color="#ef9a9a" center size={13}>
                  Generation Context: Low. The LLM may need surrounding paragraphs to answer fully.
                </T>
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={16}>
                Large Chunks (1024 Tokens)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}24`,
                  textAlign: "center",
                }}
              >
                <T color="#ef9a9a" center size={13}>
                  Retrieval Precision: Low. Many topics per chunk; the vector averages them.
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}24`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" center size={13}>
                  Generation Context: High. The LLM has the whole section.
                </T>
              </div>
            </div>
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
              Pick one and you are forced to compromise. What if you did not have to?
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Hierarchical: Leaves Are Small, Parents Are Big
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Chunk the doc twice. Build a tree. The root is the whole doc. The mid-level nodes are sections of around 300
            tokens each. The leaves are tiny 64-token chunks that fit one fact apiece. Only the leaf vectors live in the
            index - they are what we search. Parents live in a separate parent-text store, keyed by id, ready to be
            swapped in at generation time.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={16}>
              Doc-4 Refunds Policy: 1 Root + 3 Sections + 12 Leaves
            </T>
            <svg viewBox="0 0 640 340" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Tree hierarchy diagram with doc-4 refunds policy as the root node at the top, three section nodes below
                for eligibility, process, and edge cases, and four leaf chunk nodes below each section, with leaves
                colored cyan, sections purple, and root green.
              </desc>
              {/* Root node */}
              <rect
                x={TREE_ROOT_X}
                y="14"
                width={TREE_ROOT_W}
                height="46"
                fill={`${C.green}30`}
                stroke={C.green}
                strokeWidth="1.4"
                rx="6"
              />
              <text x={TREE_ROOT_CX} y="32" textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                Doc-4 Refunds Policy (Root)
              </text>
              <text x={TREE_ROOT_CX} y="49" textAnchor="middle" fill="#a5d6a7" fontSize="11">
                3 Sections - 900 Tokens Total
              </text>
              {/* Edges root -> sections */}
              {TREE_SECTION_CENTERS.map((cx, i) => (
                <line
                  key={`r-${i}`}
                  x1={TREE_ROOT_CX}
                  y1="60"
                  x2={cx}
                  y2="120"
                  stroke={`${C.green}80`}
                  strokeWidth="1.2"
                />
              ))}
              {/* Section nodes */}
              {HIERARCHY_SECTIONS.map((sec, i) => {
                const cx = TREE_SECTION_CENTERS[i];
                const x = cx - TREE_SECTION_W / 2;
                return (
                  <g key={`sec-${i}`}>
                    <rect
                      x={x}
                      y="120"
                      width={TREE_SECTION_W}
                      height="46"
                      fill={`${C.purple}30`}
                      stroke={C.purple}
                      strokeWidth="1.4"
                      rx="5"
                    />
                    <text x={cx} y="139" textAnchor="middle" fill="#b8a9ff" fontSize="12" fontWeight="bold">
                      {sec.id}
                    </text>
                    <text x={cx} y="156" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                      ~300 Tokens
                    </text>
                  </g>
                );
              })}
              {/* Edges section -> leaves */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((_, lIdx) => {
                  const lcx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP) + TREE_LEAF_W / 2;
                  return (
                    <line
                      key={`e-${sIdx}-${lIdx}`}
                      x1={secCx}
                      y1="166"
                      x2={lcx}
                      y2="230"
                      stroke={`${C.cyan}80`}
                      strokeWidth="1"
                    />
                  );
                });
              })}
              {/* Leaf nodes */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((leafId, lIdx) => {
                  const lx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP);
                  return (
                    <g key={`leaf-${sIdx}-${lIdx}`}>
                      <rect
                        x={lx}
                        y="230"
                        width={TREE_LEAF_W}
                        height="46"
                        fill={`${C.cyan}30`}
                        stroke={C.cyan}
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x={lx + TREE_LEAF_W / 2}
                        y="249"
                        textAnchor="middle"
                        fill="#80deea"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {leafId}
                      </text>
                      <text x={lx + TREE_LEAF_W / 2} y="265" textAnchor="middle" fill="#80deea" fontSize="9">
                        64 Tok
                      </text>
                    </g>
                  );
                });
              })}
              {/* Bottom annotation */}
              <text
                x={TREE_ROOT_CX}
                y="302"
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Index Stores Leaf Vectors. Retrieval Finds Leaves.
              </text>
              <text x={TREE_ROOT_CX} y="322" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">
                We Swap Each Leaf For Its Parent Before Sending To The LLM.
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#a5d6a7",
            }}
          >
            Index: {`{ leaf_id -> vector }`} &nbsp;|&nbsp; Parent Store: {`{ leaf_id -> parent_text }`}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Step 1: Retrieval Finds The Best Leaf
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The user asks &quot;Can I get a refund if I cancel after 30 days?&quot; The query is embedded once. We
            search the leaf index. The top-3 leaves come back ranked by cosine similarity. L7 wins because its 64-token
            text directly states the 30-day cutoff.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#b8a9ff",
            }}
          >
            Query: &quot;Can I get a refund if I cancel after 30 days?&quot; &rarr; q_vec
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {HIERARCHICAL_LEAF_SCORES.map((row) => (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px minmax(0, 1fr) 100px 90px",
                  gap: 10,
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 8,
                  background: row.isTop ? `${C.purple}18` : "rgba(0,0,0,0.3)",
                  border: row.isTop ? `1px solid ${C.purple}60` : `1px solid ${C.purple}24`,
                }}
              >
                <T color={row.isTop ? C.purple : "#b8a9ff"} bold size={15}>
                  {row.id}
                </T>
                <T color="#b8a9ff" size={13}>
                  {row.snippet}
                </T>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: row.isTop ? `${C.purple}24` : "rgba(0,0,0,0.4)",
                    border: row.isTop ? `1px solid ${C.purple}60` : `1px solid ${C.purple}20`,
                    textAlign: "center",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  <T color={row.isTop ? C.purple : "#b8a9ff"} size={13} bold={row.isTop}>
                    {row.score.toFixed(2)}
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: row.isTop ? `${C.purple}24` : "rgba(0,0,0,0.4)",
                    border: row.isTop ? `1px solid ${C.purple}60` : `1px solid ${C.purple}20`,
                    textAlign: "center",
                  }}
                >
                  <T color={row.isTop ? C.purple : "#b8a9ff"} size={13} bold={row.isTop}>
                    {row.isTop ? "Top-1" : "-"}
                  </T>
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
              L7 wins at 0.89. Its 64-token snippet directly states &quot;no refunds after 30 days&quot; - a precise hit
              on the 30-day cutoff in the query.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Step 2: Swap The Leaf For Its Parent Before The LLM
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            We retrieved a leaf, but we do not send the leaf to the LLM. Each leaf carries the id of its parent section.
            A parent-lookup pulls the full 300-token Edge Cases section from the parent-text store. That section is what
            enters the prompt - so the LLM has the eligibility nuance, the appeal path, and the carve-outs, not just one
            sentence in isolation.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={16}>
              Leaf-To-Parent Swap Flow
            </T>
            <svg viewBox="0 0 640 280" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Leaf-to-parent swap flow diagram showing retrieved leaf L7 with the no-refunds-after-30-days sentence on
                the left, a parent-lookup arrow in the middle, and the full 300-token edge-cases section on the right
                being sent to the LLM.
              </desc>
              {/* Left: retrieved leaf L7 */}
              <rect
                x="20"
                y="50"
                width="200"
                height="120"
                fill={`${C.cyan}24`}
                stroke={C.cyan}
                strokeWidth="1.4"
                rx="6"
              />
              <text x="120" y="40" textAnchor="middle" fill={C.cyan} fontSize="12" fontWeight="bold">
                Retrieved Leaf
              </text>
              <text x="120" y="74" textAnchor="middle" fill="#80deea" fontSize="14" fontWeight="bold">
                L7 - 64 Tokens
              </text>
              <text x="120" y="98" textAnchor="middle" fill="#80deea" fontSize="11">
                &quot;...No Refunds After
              </text>
              <text x="120" y="114" textAnchor="middle" fill="#80deea" fontSize="11">
                30 Days...&quot;
              </text>
              <text x="120" y="146" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                Parent-Id: Sec-Edge-Cases
              </text>
              <text x="120" y="160" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                Score: 0.89
              </text>
              {/* Middle: parent-lookup arrow */}
              <line x1="226" y1="110" x2="404" y2="110" stroke={C.orange} strokeWidth="2.4" />
              <polygon points="400,103 400,117 414,110" fill={C.orange} />
              <text x="320" y="92" textAnchor="middle" fill={C.orange} fontSize="13" fontWeight="bold">
                Parent Lookup
              </text>
              <text x="320" y="128" textAnchor="middle" fill="#ffcc80" fontSize="11">
                parent_store[L7.parent_id]
              </text>
              {/* Right: parent (full section) */}
              <rect
                x="414"
                y="30"
                width="206"
                height="160"
                fill={`${C.purple}24`}
                stroke={C.purple}
                strokeWidth="1.4"
                rx="6"
              />
              <text x="517" y="22" textAnchor="middle" fill={C.purple} fontSize="12" fontWeight="bold">
                Parent Section (Goes Into Prompt)
              </text>
              <text x="517" y="50" textAnchor="middle" fill="#b8a9ff" fontSize="14" fontWeight="bold">
                Edge Cases - 300 Tokens
              </text>
              <text x="517" y="76" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - 14-Day Full Refund Window
              </text>
              <text x="517" y="92" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - 15-30 Day Prorated Refund
              </text>
              <text x="517" y="108" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - No Refunds After 30 Days
              </text>
              <text x="517" y="124" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - Manual-Review Carve-Out
              </text>
              <text x="517" y="140" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - Appeal Path (Form A-12)
              </text>
              <text x="517" y="156" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - Special-Case Refunds
              </text>
              <text x="517" y="180" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                ~4.7x More Context Than Leaf
              </text>
              {/* Bottom: arrow to LLM */}
              <line x1="517" y1="196" x2="517" y2="230" stroke={C.orange} strokeWidth="2" />
              <polygon points="510,226 524,226 517,240" fill={C.orange} />
              <rect
                x="445"
                y="240"
                width="144"
                height="30"
                fill={`${C.orange}30`}
                stroke={C.orange}
                strokeWidth="1.4"
                rx="5"
              />
              <text x="517" y="260" textAnchor="middle" fill="#ffcc80" fontSize="13" fontWeight="bold">
                LLM Prompt Context
              </text>
            </svg>
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
              The LLM now has the eligibility nuance to give the user a real answer, not just &quot;no refunds after 30
              days&quot; in isolation. Retrieval precision came from the leaf; generation context comes from the parent.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Variation: Index Summary Chunks Instead Of Leaves
          </T>
          <T color="#fff59d" center size={16} style={{ marginTop: 10 }}>
            Same tree, different retrieval target. Run an LLM over each section once at index time to generate a 1-2
            sentence summary. Embed and index those summary chunks instead of the leaves. On a hit, swap to the full
            parent section (or even the whole doc). Summaries pack more meaning per token, so the vector match can be
            more semantic. The cost is an LLM pass at index time.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Doc-4 Hierarchy With Summary Chunks Per Section
            </T>
            <svg viewBox="0 0 640 360" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Tree hierarchy diagram extending the doc-4 refunds tree with a small summary card placed beside each
                section node. Summary cards are colored yellow and labeled with one-sentence LLM-generated summaries.
                Index now stores summary vectors; retrieval finds a summary then swaps to the full parent section.
              </desc>
              {/* Root */}
              <rect
                x={TREE_ROOT_X}
                y="14"
                width={TREE_ROOT_W}
                height="46"
                fill={`${C.green}30`}
                stroke={C.green}
                strokeWidth="1.4"
                rx="6"
              />
              <text x={TREE_ROOT_CX} y="32" textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                Doc-4 Refunds Policy (Root)
              </text>
              <text x={TREE_ROOT_CX} y="49" textAnchor="middle" fill="#a5d6a7" fontSize="11">
                3 Sections - 900 Tokens Total
              </text>
              {/* Edges root -> sections */}
              {TREE_SECTION_CENTERS.map((cx, i) => (
                <line
                  key={`r4-${i}`}
                  x1={TREE_ROOT_CX}
                  y1="60"
                  x2={cx}
                  y2="120"
                  stroke={`${C.green}80`}
                  strokeWidth="1.2"
                />
              ))}
              {/* Section nodes */}
              {HIERARCHY_SECTIONS.map((sec, i) => {
                const cx = TREE_SECTION_CENTERS[i];
                const x = cx - TREE_SECTION_W / 2;
                return (
                  <g key={`sec4-${i}`}>
                    <rect
                      x={x}
                      y="120"
                      width={TREE_SECTION_W}
                      height="46"
                      fill={`${C.purple}30`}
                      stroke={C.purple}
                      strokeWidth="1.4"
                      rx="5"
                    />
                    <text x={cx} y="139" textAnchor="middle" fill="#b8a9ff" fontSize="12" fontWeight="bold">
                      {sec.id}
                    </text>
                    <text x={cx} y="156" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                      ~300 Tokens
                    </text>
                  </g>
                );
              })}
              {/* Summary cards sit between section row and leaf row */}
              {HIERARCHY_SECTIONS.map((sec, i) => {
                const cx = TREE_SECTION_CENTERS[i];
                const w = 168;
                const x = cx - w / 2;
                return (
                  <g key={`sum-${i}`}>
                    {/* Connector from section to summary card */}
                    <line
                      x1={cx}
                      y1="166"
                      x2={cx}
                      y2="186"
                      stroke={`${C.yellow}80`}
                      strokeWidth="1.4"
                      strokeDasharray="3 2"
                    />
                    <rect
                      x={x}
                      y="186"
                      width={w}
                      height="50"
                      fill={`${C.yellow}24`}
                      stroke={C.yellow}
                      strokeWidth="1.2"
                      rx="5"
                    />
                    <text x={cx} y="202" textAnchor="middle" fill="#fff59d" fontSize="11" fontWeight="bold">
                      Summary (LLM-Made)
                    </text>
                    <text x={cx} y="218" textAnchor="middle" fill="#fff59d" fontSize="9">
                      {sec.summary}
                    </text>
                    <text x={cx} y="231" textAnchor="middle" fill="#fff59d" fontSize="9">
                      Indexed - 1 Vector
                    </text>
                  </g>
                );
              })}
              {/* Connector summary card -> leaf row */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((_, lIdx) => {
                  const lcx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP) + TREE_LEAF_W / 2;
                  return (
                    <line
                      key={`e4-${sIdx}-${lIdx}`}
                      x1={secCx}
                      y1="236"
                      x2={lcx}
                      y2="270"
                      stroke={`${C.cyan}50`}
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    />
                  );
                });
              })}
              {/* Leaf nodes */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((leafId, lIdx) => {
                  const lx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP);
                  return (
                    <g key={`leaf4-${sIdx}-${lIdx}`}>
                      <rect
                        x={lx}
                        y="270"
                        width={TREE_LEAF_W}
                        height="34"
                        fill={`${C.cyan}18`}
                        stroke={C.cyan}
                        strokeWidth="0.8"
                        rx="3"
                      />
                      <text
                        x={lx + TREE_LEAF_W / 2}
                        y="284"
                        textAnchor="middle"
                        fill="#80deea"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {leafId}
                      </text>
                      <text x={lx + TREE_LEAF_W / 2} y="297" textAnchor="middle" fill="#80deea" fontSize="9">
                        64 Tok
                      </text>
                    </g>
                  );
                });
              })}
              {/* Bottom annotation */}
              <text
                x={TREE_ROOT_CX}
                y="328"
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Index Stores Summary Vectors. Retrieval Finds A Summary.
              </text>
              <text x={TREE_ROOT_CX} y="348" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">
                Swap To The Full Parent Section On A Hit.
              </text>
            </svg>
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
            <T color="#fff59d" center size={14}>
              Trade-off: summaries are denser semantically (one vector encodes the gist of a 300-token section), but
              require an LLM pass at index time to generate them.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Hierarchical: When And At What Cost
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Hierarchical chunking is a workhorse pattern in production RAG: it gives precise retrieval and rich
            generation context at the price of storing parent texts. Every major framework ships an off-the-shelf
            implementation, so the implementation cost is near zero.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Use Hierarchical When
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {HIERARCHICAL_USE_WHEN.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {line}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Cost & Implementation
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {HIERARCHICAL_COST_NOTES.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {line}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Reach for hierarchical chunking when your docs have natural section structure and queries need surrounding
              context to answer well. Use LangChain ParentDocumentRetriever or LlamaIndex RecursiveRetriever and you
              have the pattern working in a few lines.
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
