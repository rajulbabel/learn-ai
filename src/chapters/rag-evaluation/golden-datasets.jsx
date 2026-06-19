import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const GD_RECORD_COLUMNS = [
  { label: "Question", value: "How do I reset my password?", color: C.cyan, accent: "#80deea" },
  {
    label: "Expected Answer",
    value: 'Click "Forgot Password" and check your registered email.',
    color: C.green,
    accent: "#a5d6a7",
  },
  { label: "Expected Docs", value: "[doc-1]", color: C.purple, accent: "#b8a9ff" },
  { label: "Refusal", value: "No", color: C.orange, accent: "#ffcc80" },
];

const GD_CURATION_STEPS = [
  {
    n: 1,
    label: "List Query Types From Logs Or Product Spec",
    detail: "Mine a week of production queries (or the product spec) for the categories you must support.",
  },
  {
    n: 2,
    label: "Write 5-10 Examples Per Type By Hand",
    detail: "Cover normal cases plus the edge cases shown in the next sub-step.",
  },
  {
    n: 3,
    label: "Write Expected Answer + Expected Docs Per Example",
    detail: "Each tuple becomes one golden record: question + answer + doc IDs (+ refusal flag).",
  },
];

const GD_COUNTS_ROWS = [
  { type: "Single-Doc Lookups", count: 20 },
  { type: "Multi-Hop", count: 15 },
  { type: "Aggregation", count: 10 },
  { type: "Refusal-Required", count: 10 },
  { type: "Empty-Context", count: 10 },
];
const GD_COUNTS_TOTAL = GD_COUNTS_ROWS.reduce((s, r) => s + r.count, 0);

const GD_EDGE_CASES = [
  {
    name: "Multi-Hop",
    desc: "Answer Requires Combining 2+ Docs",
    example: '"How do I reset my password if I forgot my email?"',
  },
  {
    name: "Empty-Context",
    desc: "No Doc In The Corpus Answers This - Must Refuse",
    example: '"What is your stock price?"',
  },
  {
    name: "Ambiguous",
    desc: "Two Docs Conflict - Newest-Wins Or Refusal",
    example: '"What is the refund window?" (doc-A: 14 days; doc-B: 30 days)',
  },
  {
    name: "Refusal-Required",
    desc: "Out-Of-Scope Or Unsafe Query",
    example: '"Give me another customer\'s email."',
  },
  {
    name: "Time-Sensitive",
    desc: "Answer Depends On Today's Date",
    example: '"Is feature X live yet?"',
  },
];

const GD_REGRESSION_STEPS = [
  { n: 1, label: "Production User Reports A Bad Answer" },
  { n: 2, label: "Engineer Reproduces; Captures Query, Docs, Answer, Expected Answer" },
  { n: 3, label: "Add Tuple To The Regression-Golden Set" },
  { n: 4, label: "Every Future Eval Includes It; Failure Cannot Silently Re-Emerge" },
];

const GD_REGRESSION_ROWS = [
  {
    query: "Reset Password Forgot Email",
    failureMode: "Multi-hop missed; bot suggested support phone",
  },
  {
    query: "Cancel And Refund",
    failureMode: "Refused incorrectly; user blocked from valid request",
  },
  {
    query: "Pro Plan SSO",
    failureMode: "Hallucinated SSO inclusion in Pro tier",
  },
];

const GD_HEALTH_METRICS = [
  {
    label: "Coverage",
    detail: "Query types covered / total query types",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    label: "Freshness",
    detail: "Median age of golden cases (months)",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    label: "Pass-Rate",
    detail: "% of golden set currently green on production pipeline",
    color: C.orange,
    accent: "#ffcc80",
  },
];

export default function GoldenDatasets(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Bootstrap pipeline SVG layout (sub=4) - symmetric padding.
  const BP_VB_W = 540;
  const BP_VB_H = 220;
  const BP_LANE_H = 70;
  const BP_LANE_GAP = 16;
  const BP_LANE_W = 480;
  const BP_LANE_X = (BP_VB_W - BP_LANE_W) / 2;
  const BP_LANE_A_Y = 30;
  const BP_LANE_B_Y = BP_LANE_A_Y + BP_LANE_H + BP_LANE_GAP;

  // Lane segments: 3 boxes per lane.
  const segW = (BP_LANE_W - 24) / 3;
  const segGap = 12;
  const segBoxW = segW - segGap;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* ─── sub=0 ─── Why golden datasets */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Golden Datasets: The Ground Truth For Every Other Metric
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Every eval metric in this section (RAGAS, LLM-as-judge, recall@k) needs ground-truth labels. The golden
            dataset is the held-out, human-verified set of records you run every eval against. Without it you have no
            signal; with a flaky one you have noise.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {GD_RECORD_COLUMNS.map((col) => (
              <div
                key={col.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${col.color}06`,
                  border: `1px solid ${col.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={col.color} bold center size={14}>
                  {col.label}
                </T>
                <T color={col.accent} center size={13} style={{ marginTop: 8 }}>
                  {col.value}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" center size={13} style={{ marginTop: 12 }}>
            One golden record. Multiply by 30-2000 records and you have a defensible eval set.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── 30-100 hand-written start */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Start With 30-100 Hand-Written Examples
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Begin small and human-curated. The goal of the first batch is breadth across query types, not volume. A
            tight 30-100 hand-written seed is the foundation everything else extends.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {GD_CURATION_STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={28}>
                  {s.n}
                </T>
                <T color={C.green} bold center size={14} style={{ marginTop: 4 }}>
                  {s.label}
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 6 }}>
                  {s.detail}
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
              border: `1px solid ${C.green}30`,
            }}
          >
            <T color={C.green} bold center size={15}>
              Week 1 Tally By Query Type / Category
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {GD_COUNTS_ROWS.map((r) => (
                <div
                  key={r.type}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 60px",
                    gap: 10,
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.green}10`,
                    border: `1px solid ${C.green}30`,
                    alignItems: "center",
                  }}
                >
                  <T color="#a5d6a7" size={13}>
                    {r.type}
                  </T>
                  <T color={C.green} bold size={14} center>
                    {r.count}
                  </T>
                </div>
              ))}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px",
                  gap: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.yellow}10`,
                  border: `1px solid ${C.yellow}`,
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <T color={C.yellow} bold size={14}>
                  Total Week 1
                </T>
                <T color={C.yellow} bold size={16} center>
                  {GD_COUNTS_TOTAL}
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Five edge cases */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Five Edge Cases That Break Naive RAG
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The first hand-written batch must cover these five edge cases. Skip any and you ship blind to a class of
            failures.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {GD_EDGE_CASES.map((e) => (
              <div
                key={e.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={15}>
                  {e.name}
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 6 }}>
                  {e.desc}
                </T>
                <T color="#ef9a9a" center size={12} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  {e.example}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Regression set workflow */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Regression Set: Every Production Bug Becomes A Golden Case
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Anything that failed in production once must never silently fail again. The regression set is the
            self-healing memory of your eval suite.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {GD_REGRESSION_STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                  alignItems: "center",
                }}
              >
                <T color={C.purple} bold size={20} center>
                  {s.n}
                </T>
                <T color="#b8a9ff" size={14}>
                  {s.label}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}30`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Example Regression Tuples Captured So Far
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {GD_REGRESSION_ROWS.map((r) => (
                <div
                  key={r.query}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr",
                    gap: 10,
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.purple}10`,
                    border: `1px solid ${C.purple}30`,
                    textAlign: "left",
                  }}
                >
                  <T color={C.purple} bold size={13}>
                    {r.query}
                  </T>
                  <T color="#b8a9ff" size={13}>
                    {r.failureMode}
                  </T>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── LLM-bootstrapped pipeline */}
      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            LLM-Bootstrapped: Generate Then Human-Review
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            To scale past the hand-written seed, generate question-answer pairs with an LLM grounded in corpus docs,
            then human-review each pair. Acceptance rate is 60-80% for clear docs. A 30-100 seed grows to 500-2000
            reviewed records this way.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${BP_VB_W} ${BP_VB_H}`} width="100%" style={{ maxWidth: 540, height: "auto" }}>
              <desc>
                Two-lane LLM-bootstrapped golden-dataset pipeline. The upper lane shows the LLM generating
                question-answer pairs grounded in a corpus document; the lower lane shows a human reviewer accepting,
                editing, or rejecting each pair. Used to illustrate how a small hand-built seed scales into a 500-2000
                reviewed set without losing human oversight.
              </desc>

              {/* LLM lane */}
              <text
                x={BP_VB_W / 2}
                y={BP_LANE_A_Y - 6}
                fill="#80deea"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                LLM Lane: Generate
              </text>
              {[["Corpus Doc"], ["LLM Generates", "Q-A Pair"], ["Pair Candidate"]].map((lines, i) => {
                const x = BP_LANE_X + 12 + i * segW;
                const cy = BP_LANE_A_Y + BP_LANE_H / 2;
                return (
                  <g key={`a${i}`}>
                    <rect
                      x={x}
                      y={BP_LANE_A_Y}
                      width={segBoxW}
                      height={BP_LANE_H}
                      rx={8}
                      fill={`${C.cyan}1f`}
                      stroke={`${C.cyan}aa`}
                      strokeWidth="1.5"
                    />
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x={x + segBoxW / 2}
                        y={cy + 4 + (li - (lines.length - 1) / 2) * 15}
                        fill="#80deea"
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {line}
                      </text>
                    ))}
                    {i < 2 && (
                      <text x={x + segBoxW + segGap / 2} y={cy + 5} fill="#80deea" fontSize="14" textAnchor="middle">
                        →
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Bridge arrow between lanes */}
              <text
                x={BP_LANE_X + 12 + 2 * segW + segBoxW / 2}
                y={BP_LANE_A_Y + BP_LANE_H + 12}
                fill="#a5d6a7"
                fontSize="14"
                textAnchor="middle"
              >
                ↓
              </text>

              {/* Human lane */}
              <text
                x={BP_VB_W / 2}
                y={BP_LANE_B_Y - 6}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Human Lane: Review
              </text>
              {[["Pair Candidate"], ["Reviewer Accept /", "Edit / Reject"], ["Golden Record"]].map((lines, i) => {
                const x = BP_LANE_X + 12 + i * segW;
                const cy = BP_LANE_B_Y + BP_LANE_H / 2;
                return (
                  <g key={`b${i}`}>
                    <rect
                      x={x}
                      y={BP_LANE_B_Y}
                      width={segBoxW}
                      height={BP_LANE_H}
                      rx={8}
                      fill={`${C.green}1f`}
                      stroke={`${C.green}aa`}
                      strokeWidth="1.5"
                    />
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x={x + segBoxW / 2}
                        y={cy + 4 + (li - (lines.length - 1) / 2) * 15}
                        fill="#a5d6a7"
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {line}
                      </text>
                    ))}
                    {i < 2 && (
                      <text x={x + segBoxW + segGap / 2} y={cy + 5} fill="#a5d6a7" fontSize="14" textAnchor="middle">
                        →
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={14}>
              Caution: Never Deploy Without Human Review
            </T>
            <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
              The LLM can encode its own bias - generating good test cases for itself while failing on adjacent
              phrasings. Acceptance rate matters; so does reviewer diversity.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Monthly review & cadence */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Monthly Review: Archive Obsolete, Add New
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Like code, golden sets rot. A monthly review cadence keeps the set defensible: spot-check 20 cases, archive
            anything tied to deleted docs or changed product behavior, add new cases captured from the past month's
            production incidents.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 6,
            }}
          >
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <div
                key={m}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  background: `${C.orange}10`,
                  border: `1px solid ${C.orange}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={12}>
                  {m}
                </T>
                <T color="#ffcc80" center size={10}>
                  Review {(i + 1) % 4 === 0 ? "+Audit" : ""}
                </T>
              </div>
            ))}
          </div>

          <T color="#ffcc80" center size={13} style={{ marginTop: 12 }}>
            Each tile is a monthly cycle: spot-check 20 random cases, archive obsolete to /archived/ (audit-kept), add
            new from production. Re-run regression to confirm green.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {GD_HEALTH_METRICS.map((m) => (
              <div
                key={m.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${m.color}06`,
                  border: `1px solid ${m.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={m.color} bold center size={14}>
                  {m.label}
                </T>
                <T color={m.accent} center size={12} style={{ marginTop: 6 }}>
                  {m.detail}
                </T>
              </div>
            ))}
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
