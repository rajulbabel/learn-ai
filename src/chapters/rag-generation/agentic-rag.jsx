import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const AR_TOOLS = [
  {
    name: "Vector Search",
    color: C.cyan,
    accent: "#80deea",
    desc: "Semantic retrieval over your embedded chunks. The RAG we have been building.",
  },
  {
    name: "SQL Query",
    color: C.green,
    accent: "#a5d6a7",
    desc: "Structured lookups over a relational store. Pricing tables, user accounts.",
  },
  {
    name: "Calculator",
    color: C.orange,
    accent: "#ffcc80",
    desc: "Precise arithmetic. Models are bad at math; calculators are not.",
  },
  {
    name: "Web Search",
    color: C.purple,
    accent: "#b8a9ff",
    desc: "Fresh or out-of-corpus info. Used as a fallback or for time-sensitive queries.",
  },
];

const AR_TRACE = `User: Compare the Pro and Enterprise plans.

Model: I need the pricing table. Calling tool.
  tool_call: sql_query(table="plans", filter="name in ('Pro','Enterprise')")
  tool_response: [{"plan":"Pro","price":29,"users":10},
                  {"plan":"Enterprise","price":199,"users":"unlimited"}]

Model: I also need feature comparison docs. Calling tool.
  tool_call: vector_search(query="Pro vs Enterprise features", k=3)
  tool_response: [doc-15 chunk 1, doc-15 chunk 2, doc-19 chunk 1]

Model: Now I can answer. Generating response with citations.`;

const AR_TURNS = [
  {
    n: 1,
    tool: "vector_search",
    args: '("Pro Enterprise comparison")',
    output: "3 chunks (doc-15 + doc-19)",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    n: 2,
    tool: "sql_query",
    args: "(SELECT price FROM plans WHERE name='Pro')",
    output: "$29 per seat",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    n: 3,
    tool: "calculator",
    args: "(25 x 29)",
    output: "725",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    n: 4,
    tool: "Final Answer",
    args: "",
    output:
      "Pro is $29/seat. 25 users => $725/month. Pro includes features X, Y, Z [doc-15]; Enterprise adds SSO + audit logs [doc-19].",
    color: C.pink,
    accent: "#f48fb1",
  },
];

const AR_CONTROL_CARDS = [
  {
    title: "Hard Caps",
    color: C.red,
    accent: "#ef9a9a",
    bullets: [
      "max_iterations (typically 5-10)",
      "Total tool calls per query (rate-limit by tool)",
      "Wall-clock budget (timeout in seconds)",
    ],
  },
  {
    title: "Soft Signals",
    color: C.yellow,
    accent: "#ffe082",
    bullets: [
      "Model emits 'final answer' marker",
      "Same tool called with same args twice in a row -> divergence flag",
      "Tool error rate above threshold -> abort and refuse",
    ],
  },
  {
    title: "Cost Tracking",
    color: C.purple,
    accent: "#b8a9ff",
    bullets: [
      "Each tool call has a fixed cost; sum across iterations",
      "Alert if over per-query budget",
      "Bill chargebacks to feature owners",
    ],
  },
  {
    title: "Mitigations",
    color: C.cyan,
    accent: "#80deea",
    bullets: [
      "Cap iterations strictly",
      "Cache tool responses by exact args (especially vector_search)",
      "Use a smaller orchestrator model",
    ],
  },
];

function PromptTemplateBlock({ color, accent, title, template }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: `${color}06`,
        border: `1px solid ${color}12`,
      }}
    >
      <T color={color} bold center size={15}>
        {title}
      </T>
      <pre
        style={{
          marginTop: 10,
          padding: 14,
          background: `${color}08`,
          borderRadius: 6,
          color: accent,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          textAlign: "left",
          overflow: "auto",
        }}
      >
        {template}
      </pre>
    </div>
  );
}

export default function AgenticRAG(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const LOOP_VB_W = 720;
  const LOOP_VB_H = 380;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Retrieval as one tool */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Retrieval Is One Tool. Add More.
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Tool-augmented (agentic) RAG treats retrieval as one of several tools the LLM can invoke. SQL, calculators,
            web search, and internal APIs sit alongside it. The model picks the right tool per query.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {AR_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${tool.color}06`,
                  border: `1px solid ${tool.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={tool.color} bold center size={14}>
                  {tool.name}
                </T>
                <T color={tool.accent} center size={12} style={{ marginTop: 6 }}>
                  {tool.desc}
                </T>
              </div>
            ))}
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            The LLM decides which tool to call. Function-calling pattern. Each tool returns text the model can read.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Function-calling pattern */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Function-Calling: How The Model Picks A Tool
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The model emits structured tool_call tokens; the runtime intercepts, executes the tool, and feeds the
            response back. The loop continues until the model emits a final answer or hits max_iterations.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock color={C.cyan} accent="#80deea" title="Function-Calling Trace" template={AR_TRACE} />
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Tool-call loop */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Tool-Call Loop
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The control loop runs until the model declares done or max_iterations is reached. A loopback path lets the
            model chain multiple tool calls.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LOOP_VB_W} ${LOOP_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Tool-call loop flowchart for agentic RAG: model emits a tool_call, the runtime executes the tool and
                feeds the response back, looping until the model emits a final answer or hits max_iterations.
              </desc>

              <rect
                x={260}
                y={10}
                width={200}
                height={42}
                rx="8"
                fill={C.blue}
                fillOpacity="0.2"
                stroke={C.blue}
                strokeOpacity="0.7"
              />
              <text x={360} y={36} fill="#90caf9" fontSize="13" fontWeight="700" textAnchor="middle">
                User Query
              </text>

              <line x1={360} y1={52} x2={360} y2={80} stroke="#b8a9ff" strokeOpacity="0.6" />
              <rect
                x={260}
                y={80}
                width={200}
                height={42}
                rx="8"
                fill={C.purple}
                fillOpacity="0.2"
                stroke={C.purple}
                strokeOpacity="0.7"
              />
              <text x={360} y={106} fill="#b8a9ff" fontSize="13" fontWeight="700" textAnchor="middle">
                Model
              </text>

              <line x1={360} y1={122} x2={360} y2={150} stroke="#b8a9ff" strokeOpacity="0.6" />
              <polygon
                points="360,150 470,200 360,250 250,200"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={195} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Need A
              </text>
              <text x={360} y={213} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Tool?
              </text>

              <line x1={470} y1={200} x2={555} y2={200} stroke={C.cyan} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={510} y={192} fill="#80deea" fontSize="12" fontWeight="700" textAnchor="middle">
                YES
              </text>
              <rect
                x={555}
                y={180}
                width={155}
                height={42}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.2"
                stroke={C.cyan}
                strokeOpacity="0.7"
              />
              <text
                x={633}
                y={206}
                fill="#80deea"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                tool_call(...)
              </text>
              <path
                d={`M ${633} ${222} L ${633} ${290} L ${360} ${290} L ${360} ${122}`}
                stroke={C.cyan}
                strokeOpacity="0.6"
                strokeWidth="1.5"
                fill="none"
              />
              <text x={500} y={285} fill="#80deea" fontSize="11" textAnchor="middle">
                tool_response Fed Back
              </text>

              <line x1={250} y1={200} x2={165} y2={200} stroke={C.green} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={210} y={192} fill="#a5d6a7" fontSize="12" fontWeight="700" textAnchor="middle">
                NO
              </text>
              <rect
                x={10}
                y={180}
                width={155}
                height={42}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text x={87} y={206} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                Final Answer
              </text>

              <text x={360} y={330} fill="#b8a9ff" fontSize="13" fontWeight="700" textAnchor="middle">
                max_iterations = 10
              </text>
              <text x={360} y={350} fill="#b8a9ff" fontSize="12" textAnchor="middle">
                Hard Cap Prevents Runaway Loops
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Worked multi-tool trace */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Worked Example: Multi-Tool Trace
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Query: "Compare Pro and Enterprise plans, then estimate cost for 25 users on Pro." Four turns, three tools,
            one final answer.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {AR_TURNS.map((turn) => (
              <div
                key={turn.n}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${turn.color}06`,
                  border: `1px solid ${turn.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={turn.color} bold center size={15}>
                  Turn {turn.n}: {turn.tool}
                  {turn.args}
                </T>
                <T color={turn.accent} center size={13} style={{ marginTop: 6 }}>
                  {turn.output}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Loop control */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Loop Control: Termination Criteria
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Termination is a layered defense. Hard caps stop runaway loops; soft signals catch loops that are
            technically progressing but diverging; cost tracking catches expensive flows; mitigations cut the rate.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {AR_CONTROL_CARDS.map((card) => (
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

      {/* ─── sub=5 ─── Orchestration */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Orchestration: Frameworks Like LangGraph
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Pick orchestration last. The patterns above work without any framework. Frameworks are a productivity
            choice, not a correctness one. Chapters 23.6-23.10 cover framework choice in depth.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={15}>
                DIY (Custom While Loop)
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                You implement the function-calling parse, tool dispatch, max_iterations check, response merge yourself.
                Full control. More code.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={15}>
                LangGraph And Similar Frameworks
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 8 }}>
                Graph-shaped state machine for tool flows. Nodes are tool calls, edges are transitions. Built-in
                checkpointing, retries, human-in-the-loop. Less code. Framework lock-in.
              </T>
            </div>
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Pick a framework when it saves more time than it costs. Patterns above are framework-agnostic.
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
