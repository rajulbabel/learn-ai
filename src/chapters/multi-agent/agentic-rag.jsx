import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
const QUERY_REWRITE_TRACE = [
  {
    iter: 1,
    query: '"Customer Issues Past 90 Days"',
    results: "5 Generic Articles. Too Broad.",
  },
  {
    iter: 2,
    query: '"Customer-Impact Incidents Past 90 Days, Severity > 2"',
    results: "Better Hits. 8 Incidents Returned.",
  },
  {
    iter: 3,
    query: '"Customer-Impact Incidents Past 90 Days, Severity > 2, Status = Resolved"',
    results: "Best Hits. 8 Incidents, All With Resolution Details.",
  },
];

const RESEARCH_QUERY_STEPS = [
  {
    step: 1,
    actor: "Initial Query",
    color: "teal",
    detail: '"Find All Customer-Impact Issues In The Past 90 Days."',
  },
  {
    step: 2,
    actor: "Search Top-5",
    color: "cyan",
    detail: "Vector Search Returns 5 KB Articles.",
  },
  {
    step: 3,
    actor: "Judge",
    color: "blue",
    detail: "Only 2 Are Customer-Impact. Need Broader Retrieval With Severity Filter.",
  },
  {
    step: 4,
    actor: "Rewrite + Search",
    color: "indigo",
    detail: "Query Adds severity > 2 Filter. New Search Returns 8 Articles.",
  },
  {
    step: 5,
    actor: "Final Aggregation",
    color: "green",
    detail: "8 Incidents Synthesized Into A Summary Table With Dates, Severities, Resolutions.",
  },
];

const NAIVE_VS_AGENTIC_DECISION = [
  {
    pick: "Naive RAG",
    color: "teal",
    when: "Direct Factoid Lookups; Single-Doc Questions.",
    examples: '"What Is The Refund Policy?"',
    cost: "1 Retrieval, 1 Generation. Cheap.",
  },
  {
    pick: "Agentic RAG",
    color: "cyan",
    when: "Research Questions; Multi-Hop; Find-All Or Compare Queries.",
    examples: '"Find All Customer-Impact Issues Past 90 Days."',
    cost: "3-10x Naive Cost. Slow.",
  },
];

export default function AgenticRag(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Retrieve Once vs Retrieve In A Loop
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Naive RAG retrieves once and generates an answer. Agentic RAG puts retrieval inside an agent loop: search,
            judge the results, refine the query, search again. Iterative instead of one-shot. Mechanics covered in
            Section 12.29; here we frame it as a multi- agent pattern.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 240" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Top row shows naive RAG as a one-shot pipeline from query to retrieve to generate; bottom row shows
                agentic RAG as a loop from query to retrieve to judge with a conditional rewrite arrow back to retrieve
                until the judge says done.
              </desc>
              {/* Naive RAG row */}
              <text x={40} y={20} fill={SOFT.green} fontSize="12" fontWeight="700">
                Naive RAG (One-Shot)
              </text>
              {[
                { x: 40, label: "Query" },
                { x: 200, label: "Retrieve" },
                { x: 360, label: "Generate" },
              ].map((n, i) => (
                <g key={`naive-${i}`}>
                  <rect
                    x={n.x}
                    y={30}
                    width={120}
                    height={40}
                    rx={8}
                    fill={`${C.green}1f`}
                    stroke={C.green}
                    strokeWidth={1.6}
                  />
                  <text x={n.x + 60} y={55} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                  {i < 2 && (
                    <>
                      <line x1={n.x + 120} y1={50} x2={n.x + 160} y2={50} stroke={C.green} strokeWidth={1.6} />
                      <polygon
                        points={`${n.x + 156},47 ${n.x + 164},47 ${n.x + 160},43 ${n.x + 160},57 ${n.x + 156},53`}
                        fill={C.green}
                      />
                    </>
                  )}
                </g>
              ))}

              {/* Agentic RAG row - loop */}
              <text x={40} y={110} fill={SOFT.cyan} fontSize="12" fontWeight="700">
                Agentic RAG (Iterative)
              </text>
              {[
                { x: 40, label: "Query" },
                { x: 180, label: "Retrieve" },
                { x: 320, label: "Judge" },
                { x: 460, label: "Done" },
              ].map((n, i) => (
                <g key={`agentic-${i}`}>
                  <rect
                    x={n.x}
                    y={120}
                    width={100}
                    height={40}
                    rx={8}
                    fill={`${C.cyan}1f`}
                    stroke={C.cyan}
                    strokeWidth={1.6}
                  />
                  <text x={n.x + 50} y={145} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                  {i < 3 && (
                    <>
                      <line x1={n.x + 100} y1={140} x2={n.x + 140} y2={140} stroke={C.cyan} strokeWidth={1.6} />
                      <polygon
                        points={`${n.x + 136},137 ${n.x + 144},137 ${n.x + 140},133 ${n.x + 140},147 ${n.x + 136},143`}
                        fill={C.cyan}
                      />
                    </>
                  )}
                </g>
              ))}
              {/* Loop back arrow */}
              <path d="M 370 160 Q 270 210 230 160" stroke={C.red} strokeWidth={1.8} fill="none" />
              <polygon points="226,157 234,157 230,165" fill={C.red} />
              <text x={280} y={210} fill={SOFT.red} fontSize="11" fontWeight="700" textAnchor="middle">
                Rewrite If Not Enough
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Naive RAG is a pipeline; agentic RAG is a loop with retrieval inside. Section 12.2 covers the naive
            pipeline; Section 12.29 covers the loop mechanics. Here we close the multi-agent chapters by framing
            agentic RAG as a multi-agent pattern.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Search, Judge, Refine, Repeat
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The agentic RAG loop has four stations. Search returns candidates; Judge asks "do I have enough? what is
            missing?"; Refine rewrites the query with the gap in mind; Search again. Loop until Judge says "done" or max
            iterations is hit.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 200" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Circular four-station loop: search, judge with a question of whether enough evidence has been collected,
                refine which rewrites the query, then search again, until judge says done or max iterations is hit.
              </desc>
              {[
                { x: 280, y: 30, label: "Search" },
                { x: 480, y: 100, label: "Judge" },
                { x: 280, y: 170, label: "Refine" },
                { x: 80, y: 100, label: "Done?" },
              ].map((s, i) => (
                <g key={`loop-${i}`}>
                  <rect
                    x={s.x - 60}
                    y={s.y - 16}
                    width={120}
                    height={32}
                    rx={8}
                    fill={`${C.teal}1f`}
                    stroke={C.teal}
                    strokeWidth={1.6}
                  />
                  <text x={s.x} y={s.y + 4} fill={SOFT.teal} fontSize="13" fontWeight="700" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              ))}
              <path d="M 340 30 Q 440 50 470 80" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="466,76 474,76 470,84" fill={C.teal} />
              <path d="M 480 120 Q 440 160 340 170" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="344,166 344,174 336,170" fill={C.teal} />
              <path d="M 220 170 Q 100 160 80 120" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="76,124 84,124 80,116" fill={C.teal} />
              <path d="M 80 80 Q 100 50 220 30" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="216,34 224,34 220,26" fill={C.teal} />
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Each station is its own LLM call (or its own internal agent). The Judge is the most critical - if it always
            says "I have enough", you have naive RAG with extra steps. If it never says "enough", you have cost runaway.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Agent Rewrites Its Own Query
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Query rewriting is the smartest part of the loop. The Judge identifies what is missing; the Refine step
            turns that gap into a sharper next query. Three iterations on a real research question.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {QUERY_REWRITE_TRACE.map((q) => (
              <div key={`rw-${q.iter}`} style={{ ...tintedCard(C.cyan), padding: 12 }}>
                <span style={pill(C.cyan)}>{`ITERATION ${q.iter}`}</span>
                <T color={C.cyan} bold center size={14} style={{ marginTop: 8 }}>
                  Query: {q.query}
                </T>
                <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                  Results: {q.results}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            Each iteration narrows toward what the Judge wanted. By iteration 3, the query is so specific that the top-K
            results are all relevant. The agent has effectively learned the query specification by doing the search.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Example: Customer-Impact Issues Past 90 Days
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The research-style query the agent answers across the full loop. Trace through 5 steps from initial query to
            final aggregated summary table.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {RESEARCH_QUERY_STEPS.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`rs-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            The final aggregation is a structured artifact: 8 incidents with dates, severity ratings, and resolution
            summaries. Naive RAG could not have produced this - it has no way to broaden a search when the first attempt
            is too narrow.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            When To Iterate Retrieval
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Agentic RAG costs 3-10x more than naive RAG. Use it when the answer quality matters more than the latency.
            Otherwise stick with the naive pipeline (Section 12.2).
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {NAIVE_VS_AGENTIC_DECISION.map((d) => {
              const accent = C[d.color];
              const soft = SOFT[d.color];
              return (
                <div key={d.pick} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{d.pick.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {d.pick}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    When: {d.when}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Example: {d.examples}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Cost: {d.cost}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Naive RAG pipeline - covered in Section 12.2 - here we contrast with the iterative loop. Agentic RAG
            mechanics covered in Section 12.29 - here we frame it as a multi- agent pattern that closes out the
            multi-agent chapters.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
