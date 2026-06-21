import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const CRAG_SCORED_DOCS = [
  {
    doc: "doc-7 (Refunds + Cancellation)",
    score: 0.92,
    verdict: "CORRECT",
    color: C.green,
    accent: "#a5d6a7",
    snippet: "Customers can cancel monthly plans any time before the next billing cycle.",
  },
  {
    doc: "doc-22 (API Rate Limits)",
    score: 0.31,
    verdict: "INCORRECT",
    color: C.red,
    accent: "#ef9a9a",
    snippet: "Free tier allows 100 requests per minute; Pro tier 1000 per minute.",
  },
  {
    doc: "doc-15 (Subscription Tiers)",
    score: 0.62,
    verdict: "AMBIGUOUS",
    color: C.yellow,
    accent: "#ffe082",
    snippet: "Monthly and annual plans differ in pricing and feature access.",
  },
];

const CRAG_STRIPS = [
  { n: 1, title: "Refund Eligibility", action: "KEEP", color: C.green, accent: "#a5d6a7" },
  { n: 2, title: "Annual Plans Prorating", action: "KEEP", color: C.green, accent: "#a5d6a7" },
  { n: 3, title: "Refund Processing Time", action: "KEEP", color: C.green, accent: "#a5d6a7" },
  { n: 4, title: "Tax Handling", action: "DROP", color: C.red, accent: "#ef9a9a" },
  { n: 5, title: "Legal Disclaimers", action: "DROP", color: C.red, accent: "#ef9a9a" },
  { n: 6, title: "Chargeback Policy", action: "DROP", color: C.red, accent: "#ef9a9a" },
];

export default function CorrectiveRAG(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=5 decision tree geometry.
  const TREE_VB_W = 720;
  const TREE_VB_H = 460;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Retrieval evaluator */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Score Every Retrieved Doc Before Using It
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            CRAG (Yan et al. 2024) adds a retrieval evaluator between retrieval and generation. Each doc is scored and
            classified: CORRECT (use it), AMBIGUOUS (combine with external sources), or INCORRECT (fall back to web).
            Query: "What is our cancellation policy for monthly plans?"
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {CRAG_SCORED_DOCS.map((d) => (
              <div
                key={d.doc}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${d.color}06`,
                  border: `1px solid ${d.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={d.color} bold center size={15}>
                  {d.doc} - Score {d.score} - {d.verdict}
                </T>
                <T color={d.accent} center size={13} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  "{d.snippet}"
                </T>
              </div>
            ))}
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            The evaluator can be a small classifier model or an LLM judge. Threshold below 0.5 = INCORRECT, above 0.8 =
            CORRECT, between = AMBIGUOUS.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── CORRECT branch */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Correct: Use Retrieved Docs Directly
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Highest-confidence path. Doc passes the evaluator; CRAG routes it through knowledge refinement (next
            sub-step) and then to the LLM with citations. Same flow as baseline RAG once the doc passes.
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
            <T color="#a5d6a7" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Retrieved Doc -&gt; Knowledge Refinement -&gt; Generate Answer With Citations
            </T>
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            Highest-confidence path. Same as baseline RAG once the docs pass the evaluator.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── INCORRECT branch */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Incorrect: Fall Back To Web Search
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Doc fails the evaluator. CRAG rewrites the query for web search, calls an external search API, and uses the
            web results in place of the internal doc. Trade-off versus admitting "I don't know".
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Failed Doc -&gt; Rewrite Query -&gt; External Web Search -&gt; Use Web Results -&gt; Generate Answer
            </T>
          </div>

          <T color="#ef9a9a" center size={14} style={{ marginTop: 12 }}>
            Web fallback costs latency (300-800 ms) and requires a search API. Use when refusal is unacceptable.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── AMBIGUOUS branch */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Ambiguous: Combine Internal + Web
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Doc partially answers. CRAG keeps it AND also fetches external web results, then merges both into the
            generation prompt. The hedge bet: highest cost path, lowest miss rate.
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
            <T color="#ffcc80" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Partial Doc + Web Results -&gt; Merge Into Context -&gt; Generate Answer
            </T>
          </div>

          <T color="#ffcc80" center size={14} style={{ marginTop: 12 }}>
            Hedge bet. Highest cost. Use when refusal is unacceptable but confidence in internal docs is low.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Knowledge refinement: strips */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Decompose Retrieved Docs Into Strips
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            CRAG knowledge refinement splits each retrieved doc into 100-150 token strips and scores each strip
            individually. Off-topic strips are dropped; on-topic strips are packed. Doc-7 (Refunds) starts at 800
            tokens; after refinement, only 3 of 6 strips are kept (~50% reduction).
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Doc-7 Strip Breakdown
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.4fr 2fr 0.8fr",
                gap: 8,
                fontSize: 13,
              }}
            >
              <T color="#b8a9ff" bold size={13}>
                Strip
              </T>
              <T color="#b8a9ff" bold size={13}>
                Title
              </T>
              <T color="#b8a9ff" bold size={13}>
                Action
              </T>
              {CRAG_STRIPS.flatMap((s) => [
                <T key={`${s.n}-n`} color={s.accent} size={13}>
                  {s.n}
                </T>,
                <T key={`${s.n}-t`} color={s.accent} size={13}>
                  {s.title}
                </T>,
                <T key={`${s.n}-a`} color={s.color} bold size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {s.action}
                </T>,
              ])}
            </div>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            Final: 3 kept strips, ~50% of original tokens, all on-topic. Packed into the prompt for generation.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── 3-branch decision tree */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The CRAG Decision Tree
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            One evaluator, three branches, one knowledge refinement step before generation. The full Yan et al. 2024
            pipeline.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TREE_VB_W} ${TREE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                CRAG three-branch decision tree: an evaluator score routes retrieved docs to a CORRECT path (use
                directly), an AMBIGUOUS path (combine internal + web), or an INCORRECT path (web-search fallback), all
                converging into knowledge refinement before generation.
              </desc>

              {/* Root: Query + Docs */}
              <rect
                x={260}
                y={10}
                width={200}
                height={42}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.2"
                stroke={C.cyan}
                strokeOpacity="0.7"
              />
              <text x={360} y={36} fill="#80deea" fontSize="13" fontWeight="700" textAnchor="middle">
                Query + Retrieved Docs
              </text>

              {/* Diamond: Evaluator Score */}
              <line x1={360} y1={52} x2={360} y2={80} stroke="#80deea" strokeOpacity="0.6" />
              <polygon
                points="360,80 480,140 360,200 240,140"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={135} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Evaluator
              </text>
              <text x={360} y={153} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Score
              </text>

              {/* Branches */}
              {/* CORRECT */}
              <line x1={360} y1={200} x2={140} y2={250} stroke={C.green} strokeOpacity="0.7" strokeWidth="1.5" />
              <rect
                x={40}
                y={250}
                width={200}
                height={42}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text x={140} y={276} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                CORRECT -&gt; Use Docs
              </text>

              {/* AMBIGUOUS */}
              <line x1={360} y1={200} x2={360} y2={250} stroke={C.yellow} strokeOpacity="0.7" strokeWidth="1.5" />
              <rect
                x={260}
                y={250}
                width={200}
                height={42}
                rx="8"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={276} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                AMBIGUOUS -&gt; Combine
              </text>

              {/* INCORRECT */}
              <line x1={360} y1={200} x2={580} y2={250} stroke={C.red} strokeOpacity="0.7" strokeWidth="1.5" />
              <rect
                x={480}
                y={250}
                width={200}
                height={42}
                rx="8"
                fill={C.red}
                fillOpacity="0.2"
                stroke={C.red}
                strokeOpacity="0.7"
              />
              <text x={580} y={276} fill="#ef9a9a" fontSize="13" fontWeight="700" textAnchor="middle">
                INCORRECT -&gt; Web
              </text>

              {/* Converge into Knowledge Refinement */}
              <line x1={140} y1={292} x2={360} y2={340} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1" />
              <line x1={360} y1={292} x2={360} y2={340} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1" />
              <line x1={580} y1={292} x2={360} y2={340} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1" />
              <rect
                x={240}
                y={340}
                width={240}
                height={42}
                rx="8"
                fill={C.purple}
                fillOpacity="0.2"
                stroke={C.purple}
                strokeOpacity="0.7"
              />
              <text x={360} y={366} fill="#b8a9ff" fontSize="13" fontWeight="700" textAnchor="middle">
                Knowledge Refinement (Strips)
              </text>

              {/* Generate Answer */}
              <line x1={360} y1={382} x2={360} y2={410} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1.5" />
              <rect
                x={260}
                y={410}
                width={200}
                height={42}
                rx="8"
                fill={C.blue}
                fillOpacity="0.2"
                stroke={C.blue}
                strokeOpacity="0.7"
              />
              <text x={360} y={436} fill="#90caf9" fontSize="13" fontWeight="700" textAnchor="middle">
                Generate Answer
              </text>
            </svg>
          </div>

          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            3 branches. 1 evaluator. All converge into knowledge refinement and generation (Yan et al. 2024).
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
