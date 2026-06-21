import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter:
const FC_OPTIONS = [
  {
    name: "No Framework",
    blurb:
      "Raw SDK (Anthropic / OpenAI / Cohere) Plus Simple Python Or TypeScript Orchestration. Most Popular For New Production RAG In 2025.",
  },
  {
    name: "LlamaIndex",
    blurb: "RAG-Focused Framework. Good Defaults For Retrieval; Less Abstracted Than LangChain.",
  },
  {
    name: "LangChain",
    blurb: "The Original. Large Ecosystem; Abstractions Evolving (And Some Deprecated Within The Framework Itself).",
  },
  {
    name: "LangGraph",
    blurb: "Graph-Based Agent Orchestration From The LangChain Team. Newer; Explicit State Machine.",
  },
  {
    name: "Haystack",
    blurb: "Enterprise-Leaning; Modular Pipelines; Smaller Community Than LangChain.",
  },
  {
    name: "Vendor SDK",
    blurb: "OpenAI Agents, Anthropic Native Tool-Use. Tight Integration; Vendor Lock-In.",
  },
];

const FC_MATRIX_ROWS = [
  {
    criterion: "Lock-In Risk",
    cells: ["None", "Low", "Medium", "Medium", "Low", "High"],
  },
  {
    criterion: "API Churn",
    cells: ["None", "Low", "High", "Medium", "Low", "Low"],
  },
  {
    criterion: "Complexity",
    cells: [
      "High Build / Low Hidden",
      "Low Build / Medium Hidden",
      "Low Build / High Hidden",
      "Medium Build / Medium Hidden",
      "Medium Build / Medium Hidden",
      "Low Build / High Hidden",
    ],
  },
  {
    criterion: "Community Size",
    cells: ["Huge", "Large", "Huge", "Growing", "Medium", "Vendor-Specific"],
  },
  {
    criterion: "RAG-Specific Fit",
    cells: ["You Build", "Strong", "OK", "OK", "Strong", "OK"],
  },
];

const FC_MATRIX_COLS = ["No Framework", "LlamaIndex", "LangChain", "LangGraph", "Haystack", "Vendor SDK"];

const FC_LANGCHAIN_PROS = [
  "Largest Ecosystem",
  "Biggest Community",
  "Tutorials Everywhere",
  "Prototype In 30 Minutes",
  "Integrations For Every Vector DB / Embedding Model / LLM",
];

const FC_LANGCHAIN_CONS = [
  "Abstractions Hide What Is Actually Happening (Lost-In-Middle Invisible Until You Trace)",
  "Some Abstractions Deprecated Within The Framework Itself (Stuff / MapReduce / Refine, Original AgentExecutor)",
  "Fast-Moving API Churn Requires Upgrade Cycles",
  "Framework Lock-In Concerns Once Production Code Depends On Chains",
];

const FC_WHEN_TABLE = [
  {
    name: "No Framework",
    body: "Small Team, Full Control Needed, Production-Grade RAG With Custom Orchestration. Fits 2-3 Engineers Building A Single Product.",
  },
  {
    name: "LlamaIndex",
    body: "RAG-Heavy Product, Want Good Retrieval Defaults, Accept Some Framework Dependency. Fits Teams Shipping A RAG-Centric App.",
  },
  {
    name: "LangChain",
    body: "Early Prototyping, Large Team Needs Shared Vocabulary, Ecosystem Integrations Matter More Than Minimalism. Fits Teams That Staff For Framework Upgrades.",
  },
  {
    name: "LangGraph",
    body: "Explicit Agent State Machine, Multi-Step Workflows, Less Hidden Magic Than LangChain. Fits Teams Building Structured Agents.",
  },
  {
    name: "Haystack",
    body: "Enterprise / Regulated Environment, Modular Pipelines, Smaller-Community Tradeoff Is Acceptable. Fits Orgs With Security Review On Every Dependency.",
  },
  {
    name: "Vendor SDK",
    body: "Committed To One Provider, Lock-In Is Acceptable, Tight Integration Is The Priority. Fits Internal Anthropic / OpenAI Shops.",
  },
];

const FC_AGNOSTIC_BULLETS = [
  "Chunking Strategy (20.4 - 20.10) Is A Data-Pipeline Decision, Not A Framework Decision.",
  "Embedding Model Choice (21.1) Is A Data-Pipeline Decision.",
  "Hybrid + Reranker Cascade (21.3, 21.4) Is A Retrieval-Quality Decision.",
  "Prompt Template + Context Packing (22.1) Is A Generation Decision.",
  "Eval (23.1 - 23.5) Is A Measurement Decision.",
  "Tracing (23.8) Is An Ops Decision.",
];

export default function FrameworkChoice(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Six Options ─── */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Six Framework Options For RAG
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Six common framework choices in 2025. Brand names below preserve their official capitalization (LlamaIndex,
            LangChain, etc) - that is the right spelling, not a title-case violation.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {FC_OPTIONS.map((opt) => (
              <div
                key={opt.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={15}>
                  {opt.name}
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 8 }}>
                  {opt.blurb}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Decision Matrix ─── */}
      <Reveal when={sub >= 1}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Framework Decision Matrix
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Five criteria across the six options. Read across a row to see how each framework rates on that criterion;
            read down a column to assemble that framework's profile.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px repeat(6, 1fr)",
                gap: 6,
              }}
            >
              <T color={C.pink} bold size={12} style={{ textAlign: "center" }}>
                Criterion
              </T>
              {FC_MATRIX_COLS.map((col) => (
                <T key={col} color={C.pink} bold size={12} style={{ textAlign: "center" }}>
                  {col}
                </T>
              ))}
              {FC_MATRIX_ROWS.map((row) => (
                <div key={row.criterion} style={{ display: "contents" }}>
                  <T color="#f8bbd0" bold size={12} style={{ textAlign: "right", paddingRight: 4 }}>
                    {row.criterion}
                  </T>
                  {row.cells.map((cell, i) => (
                    <div
                      key={`${row.criterion}-${i}`}
                      style={{
                        padding: 6,
                        borderRadius: 4,
                        background: `${C.pink}10`,
                        textAlign: "center",
                        fontSize: 11,
                        color: "#f8bbd0",
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Honest LangChain Take ─── */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            An Honest Take On LangChain
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            LangChain is the dominant framework in 2025, but the picture is mixed. Below the real pros and the real cons
            side by side. Either is reason enough to pick LangChain - or to pick something else.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Pros
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {FC_LANGCHAIN_PROS.map((p) => (
                  <T key={p} color="#80e9b1" center size={13}>
                    + {p}
                  </T>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Cons
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {FC_LANGCHAIN_CONS.map((c) => (
                  <T key={c} color="#ef9a9a" center size={13}>
                    - {c}
                  </T>
                ))}
              </div>
            </div>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 12 }}>
            LangChain is still actively developed and dominant for prototyping. For production-grade RAG, many teams
            move to raw SDK + LlamaIndex retriever, or stay on LangChain but carefully avoid deprecating abstractions.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── When Each Fits ─── */}
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            When Each Framework Fits
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            One row per framework. The team profile and product profile that best fit each. Use this as a first-pass
            filter before opening any framework's documentation.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {FC_WHEN_TABLE.map((row) => (
              <div
                key={row.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.pink} bold size={14}>
                  {row.name}
                </T>
                <T color="#f8bbd0" size={13}>
                  {row.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Decision Tree ─── */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Framework Decision Tree
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A 3-question decision tree. Start at the root, follow YES/NO, land on one recommendation. Verifies your
            framework choice in under a minute.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 870 470" width="100%" style={{ maxWidth: 870 }} role="img">
              <desc>
                Decision tree for choosing a RAG framework: starts with whether RAG is the primary feature, branches on
                team size and agent complexity, and recommends one of six options at the leaves.
              </desc>
              <defs>
                <marker id="fc-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.pink} />
                </marker>
                <marker id="fc-arrow-cyan" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.cyan} />
                </marker>
                <marker id="fc-arrow-purple" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.purple} />
                </marker>
                <marker id="fc-arrow-orange" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.orange} />
                </marker>
                <marker id="fc-arrow-yellow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.yellow} />
                </marker>
              </defs>

              {/* ─── Level 0: Root ─── */}
              <rect
                x="270"
                y="20"
                width="300"
                height="56"
                rx="8"
                fill={`${C.pink}1a`}
                stroke={C.pink}
                strokeWidth="2"
              />
              <text x="420" y="46" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                Is RAG The Primary Product Feature?
              </text>
              <text x="420" y="65" textAnchor="middle" fill="#f8bbd0" fontSize="12">
                Start Here
              </text>
              {/* Root YES -> left question (center 215, top 130) */}
              <line x1="370" y1="76" x2="227" y2="126" stroke={C.pink} strokeWidth="2" markerEnd="url(#fc-arrow)" />
              <text x="312" y="100" textAnchor="middle" fill="#80e9b1" fontSize="12" fontWeight="700">
                YES
              </text>
              {/* Root NO -> right question (center 625, top 130) */}
              <line x1="470" y1="76" x2="613" y2="126" stroke={C.pink} strokeWidth="2" markerEnd="url(#fc-arrow)" />
              <text x="528" y="100" textAnchor="middle" fill="#ef9a9a" fontSize="12" fontWeight="700">
                NO
              </text>

              {/* ─── Level 1 Left: Mid-sized team? (center 215) ─── */}
              <rect x="70" y="130" width="290" height="56" rx="8" fill={`${C.cyan}1a`} stroke={C.cyan} />
              <text x="215" y="156" textAnchor="middle" fill="#80deea" fontSize="13" fontWeight="700">
                Mid-Sized Team With Full Control?
              </text>
              <text x="215" y="174" textAnchor="middle" fill="#80deea" fontSize="11">
                3+ Engineers
              </text>
              {/* Left YES -> leaf "No Framework + LlamaIndex Retriever" (center 112) */}
              <line
                x1="180"
                y1="186"
                x2="120"
                y2="244"
                stroke={C.cyan}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-cyan)"
              />
              <text x="135" y="218" textAnchor="middle" fill="#80e9b1" fontSize="11" fontWeight="700">
                YES
              </text>
              {/* Left NO -> leaf "LlamaIndex" (center 300) */}
              <line
                x1="250"
                y1="186"
                x2="298"
                y2="244"
                stroke={C.cyan}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-cyan)"
              />
              <text x="293" y="218" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="700">
                NO
              </text>
              {/* Leaf: No Framework + LlamaIndex retriever (center 112) */}
              <rect x="22" y="250" width="180" height="60" rx="8" fill={`${C.green}1a`} stroke={C.green} />
              <text x="112" y="275" textAnchor="middle" fill="#80e9b1" fontSize="12" fontWeight="700">
                No Framework +
              </text>
              <text x="112" y="294" textAnchor="middle" fill="#80e9b1" fontSize="12" fontWeight="700">
                LlamaIndex Retriever
              </text>
              {/* Leaf: LlamaIndex (center 300) */}
              <rect x="220" y="250" width="160" height="60" rx="8" fill={`${C.green}1a`} stroke={C.green} />
              <text x="300" y="285" textAnchor="middle" fill="#80e9b1" fontSize="13" fontWeight="700">
                LlamaIndex
              </text>

              {/* ─── Level 1 Right: Multi-step agent? (center 625) ─── */}
              <rect x="480" y="130" width="290" height="56" rx="8" fill={`${C.purple}1a`} stroke={C.purple} />
              <text x="625" y="156" textAnchor="middle" fill="#b8a9ff" fontSize="13" fontWeight="700">
                Is It A Multi-Step Agent?
              </text>
              <text x="625" y="174" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                Tool Use, Loops, Workflows
              </text>
              {/* Right YES -> sub-question "Want Explicit State?" (center 505) */}
              <line
                x1="585"
                y1="186"
                x2="517"
                y2="244"
                stroke={C.purple}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-purple)"
              />
              <text x="533" y="218" textAnchor="middle" fill="#80e9b1" fontSize="11" fontWeight="700">
                YES
              </text>
              {/* Right NO -> sub-question "Single-Provider OK?" (center 745) */}
              <line
                x1="665"
                y1="186"
                x2="737"
                y2="244"
                stroke={C.purple}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-purple)"
              />
              <text x="720" y="218" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="700">
                NO
              </text>

              {/* ─── Level 2 Right sub-questions ─── */}
              {/* Want Explicit State? (center 505) */}
              <rect x="405" y="250" width="200" height="56" rx="8" fill={`${C.orange}1a`} stroke={C.orange} />
              <text x="505" y="283" textAnchor="middle" fill="#ffcc80" fontSize="13" fontWeight="700">
                Want Explicit State?
              </text>
              {/* Single-Provider OK? (center 745) */}
              <rect x="655" y="250" width="180" height="56" rx="8" fill={`${C.yellow}1a`} stroke={C.yellow} />
              <text x="745" y="283" textAnchor="middle" fill="#fff59d" fontSize="13" fontWeight="700">
                Single-Provider OK?
              </text>

              {/* Want Explicit State? YES -> LangGraph (center 445) */}
              <line
                x1="475"
                y1="306"
                x2="447"
                y2="364"
                stroke={C.orange}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-orange)"
              />
              <text x="445" y="338" textAnchor="middle" fill="#80e9b1" fontSize="11" fontWeight="700">
                YES
              </text>
              {/* Want Explicit State? NO -> LangChain (center 565) */}
              <line
                x1="535"
                y1="306"
                x2="563"
                y2="364"
                stroke={C.orange}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-orange)"
              />
              <text x="565" y="338" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="700">
                NO
              </text>
              {/* Single-Provider OK? YES -> Vendor SDK (center 685) */}
              <line
                x1="715"
                y1="306"
                x2="687"
                y2="364"
                stroke={C.yellow}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-yellow)"
              />
              <text x="685" y="338" textAnchor="middle" fill="#80e9b1" fontSize="11" fontWeight="700">
                YES
              </text>
              {/* Single-Provider OK? NO -> No Framework (center 805) */}
              <line
                x1="775"
                y1="306"
                x2="803"
                y2="364"
                stroke={C.yellow}
                strokeWidth="2"
                markerEnd="url(#fc-arrow-yellow)"
              />
              <text x="805" y="338" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="700">
                NO
              </text>

              {/* ─── Level 3 Right leaves (uniform 110 x 50) ─── */}
              <rect x="390" y="370" width="110" height="50" rx="8" fill={`${C.green}1a`} stroke={C.green} />
              <text x="445" y="399" textAnchor="middle" fill="#80e9b1" fontSize="13" fontWeight="700">
                LangGraph
              </text>
              <rect x="510" y="370" width="110" height="50" rx="8" fill={`${C.green}1a`} stroke={C.green} />
              <text x="565" y="399" textAnchor="middle" fill="#80e9b1" fontSize="13" fontWeight="700">
                LangChain
              </text>
              <rect x="630" y="370" width="110" height="50" rx="8" fill={`${C.green}1a`} stroke={C.green} />
              <text x="685" y="399" textAnchor="middle" fill="#80e9b1" fontSize="12" fontWeight="700">
                Vendor SDK
              </text>
              <rect x="750" y="370" width="110" height="50" rx="8" fill={`${C.green}1a`} stroke={C.green} />
              <text x="805" y="399" textAnchor="middle" fill="#80e9b1" fontSize="12" fontWeight="700">
                No Framework
              </text>
            </svg>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
            Three questions. Six leaves. One choice. Anything more complex than this is over-thinking the framework
            decision.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Framework-Agnostic Core ─── */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            What Stays The Same Regardless Of Framework
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10 }}>
            Every framework wraps the same six core decisions. Get the decisions right; the framework is replaceable.
            Production RAG code should be thin enough that a framework swap is a 2-day job, not a 2-month rewrite.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FC_AGNOSTIC_BULLETS.map((b, i) => (
                <div
                  key={b}
                  style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 10, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      background: `${C.green}33`,
                      color: C.green,
                      textAlign: "center",
                      lineHeight: "30px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <T color="#80e9b1" size={14}>
                    {b}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80e9b1" center size={14} style={{ marginTop: 12 }}>
            Frameworks are wrappers. The decisions in 20.4-23.5 are agnostic to which one you pick. Make those right
            first; the framework choice becomes a 2-day swap, not a 2-month rewrite.
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
