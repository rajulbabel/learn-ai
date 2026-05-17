import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// 4-leaf plan tree for ticket T4 (cancel + refund). Centered in viewBox 0 0 560 240.
// Each leaf rect width = 116, gap = 16. 4 leaves => total = 4*116 + 3*16 = 512. Pad = (560-512)/2 = 24.
const PLAN_T4_LEAVES = [
  {
    x: 24,
    label: "1. lookup_customer",
    note: "To Get customer_id",
    color: "yellow",
  },
  {
    x: 156,
    label: "2. lookup_subscription",
    note: "To Get invoice_id",
    color: "yellow",
  },
  {
    x: 288,
    label: "3. cancel",
    note: "Subscription",
    color: "yellow",
  },
  {
    x: 420,
    label: "4. process_refund",
    note: "business_rule Error -> Escalate",
    color: "red",
  },
];

// Walk-the-leaves view (sub=2). Same 4 leaves plus an added Step 5 leaf below.
// viewBox 0 0 600 320. Leaf width 110, gap 12. 4 leaves => 4*110 + 3*12 = 476. Pad = (600-476)/2 = 62.
const WALK_LEAVES = [
  {
    x: 62,
    label: "1. lookup_customer",
    result: "customer_id: c-9924",
    color: "green",
    status: "Ok",
  },
  {
    x: 184,
    label: "2. lookup_subscription",
    result: "invoice_id: inv-7741",
    color: "green",
    status: "Ok",
  },
  {
    x: 306,
    label: "3. cancel",
    result: "status: cancelled",
    color: "green",
    status: "Ok",
  },
  {
    x: 428,
    label: "4. process_refund",
    result: "Error: business_rule",
    color: "red",
    status: "Err",
  },
];

// Reflection cycle rows (sub=3).
const REFLECTION_ROWS = [
  {
    n: "1",
    title: "Model Writes Draft Answer",
    body: "First Pass. Free Text Or Structured Output. May Be Confidently Wrong.",
    color: "amber",
  },
  {
    n: "2",
    title: "Model (Or Critic) Scores The Draft 0-10 With Reasoning",
    body: "Grade Covers Accuracy, Format, Completeness, Tone. Reasoning Spells Out The Misses.",
    color: "amber",
  },
  {
    n: "3",
    title: "If Score < 7, Model Revises And Re-Evaluates",
    body: "Revision Uses The Critique As A Diff List. Re-Score Decides Whether To Stop Or Loop Again.",
    color: "amber",
  },
];

// Decision matrix 2x2 (sub=4). Axes: complexity (low/high) x auditability (low/high).
const DECISION_MATRIX = [
  // [complexityIdx 0=low/1=high][auditIdx 0=low/1=high]
  {
    row: 0,
    col: 0,
    label: "Plain Tool-Use",
    note: "Cheap Single-Call Flow.",
    color: "green",
  },
  {
    row: 0,
    col: 1,
    label: "ReAct",
    note: "Simple Task, Visible Reasoning.",
    color: "yellow",
  },
  {
    row: 1,
    col: 0,
    label: "Plan-Execute",
    note: "Complex Plan, Light Audit.",
    color: "orange",
  },
  {
    row: 1,
    col: 1,
    label: "Plan-Execute + Reflection",
    note: "Complex Plan, Heavy Audit, Self-Check.",
    color: "red",
  },
];

export default function PlanExecuteReflect(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Decide Up Front Or Step By Step
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            ReAct chooses the next move iteration by iteration. Plan-Execute does the opposite: the
            model writes the full plan tree up front, then a simple executor walks the leaves. Same
            tools, same model, very different control shape.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {/* Left card: ReAct reactive chain */}
            <div style={{ ...tintedCard(C.red), padding: 14 }}>
              <span style={pill(C.red)}>REACT</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                Decide Each Step
              </T>
              <svg
                viewBox="0 0 280 180"
                style={{ width: "100%", maxWidth: 320, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Linear ReAct chain showing four reactive steps connected by question-mark arrows
                  representing the model choosing the next action on the fly each iteration.
                </desc>

                {/* 4 step nodes spaced symmetrically. Width 44, gap 32. Total = 4*44+3*32 = 272. Pad=(280-272)/2=4. */}
                {[0, 1, 2, 3].map((i) => {
                  const x = 4 + i * (44 + 32);
                  const cy = 90;
                  return (
                    <g key={`react-step-${i}`}>
                      <rect
                        x={x}
                        y={cy - 16}
                        width={44}
                        height={32}
                        rx={6}
                        fill={`${C.red}28`}
                        stroke={C.red}
                        strokeWidth="1.5"
                      />
                      <text
                        x={x + 22}
                        y={cy + 4}
                        fill={SOFT.red}
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {`S${i + 1}`}
                      </text>
                    </g>
                  );
                })}

                {/* Question-mark arrows between steps */}
                {[0, 1, 2].map((i) => {
                  const x1 = 4 + i * (44 + 32) + 44;
                  const x2 = 4 + (i + 1) * (44 + 32);
                  const midX = (x1 + x2) / 2;
                  return (
                    <g key={`react-arrow-${i}`}>
                      <line
                        x1={x1}
                        y1={90}
                        x2={x2 - 4}
                        y2={90}
                        stroke={`${SOFT.red}99`}
                        strokeWidth="1.4"
                        strokeDasharray="4 3"
                      />
                      <polygon
                        points={`${x2 - 4},90 ${x2 - 10},86 ${x2 - 10},94`}
                        fill={SOFT.red}
                      />
                      <text
                        x={midX}
                        y={78}
                        fill={SOFT.red}
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        ?
                      </text>
                    </g>
                  );
                })}

                <text
                  x={140}
                  y={140}
                  fill={`${SOFT.red}b3`}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  Model Picks Next Action Each Turn
                </text>
              </svg>
              <T color={SOFT.red} center size={13} style={{ marginTop: 8 }}>
                Reactive. No Plan Until Step N+1 Is Chosen.
              </T>
            </div>

            {/* Right card: Plan-Execute tree */}
            <div style={{ ...tintedCard(C.cyan), padding: 14 }}>
              <span style={pill(C.cyan)}>PLAN-EXECUTE</span>
              <T color={C.cyan} bold center size={15} style={{ marginTop: 8 }}>
                Plan First, Execute Second
              </T>
              <svg
                viewBox="0 0 280 180"
                style={{ width: "100%", maxWidth: 320, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Plan tree topology where a single root node fans out to four leaf nodes
                  representing the full plan written up front before any leaf is executed.
                </desc>

                {/* Root node centered */}
                <rect
                  x={104}
                  y={20}
                  width={72}
                  height={28}
                  rx={6}
                  fill={`${C.cyan}28`}
                  stroke={C.cyan}
                  strokeWidth="1.5"
                />
                <text
                  x={140}
                  y={38}
                  fill={SOFT.cyan}
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  Root Plan
                </text>

                {/* 4 leaves spaced symmetrically along y=120. Width 44, gap 16. Total=4*44+3*16=224. Pad=(280-224)/2=28. */}
                {[0, 1, 2, 3].map((i) => {
                  const x = 28 + i * (44 + 16);
                  return (
                    <g key={`plan-leaf-${i}`}>
                      {/* Connector from root */}
                      <line
                        x1={140}
                        y1={48}
                        x2={x + 22}
                        y2={108}
                        stroke={`${SOFT.cyan}99`}
                        strokeWidth="1.2"
                      />
                      <rect
                        x={x}
                        y={108}
                        width={44}
                        height={28}
                        rx={5}
                        fill={`${C.cyan}1f`}
                        stroke={C.cyan}
                        strokeWidth="1.2"
                      />
                      <text
                        x={x + 22}
                        y={126}
                        fill={SOFT.cyan}
                        fontSize="11"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {`L${i + 1}`}
                      </text>
                    </g>
                  );
                })}

                <text
                  x={140}
                  y={162}
                  fill={`${SOFT.cyan}b3`}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  Whole Plan Drawn Before Any Leaf Runs
                </text>
              </svg>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 8 }}>
                Deliberate. Plan Tree Is Visible Up Front.
              </T>
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Use ReAct when the next step truly depends on what just happened. Use Plan-Execute when
            you can name all the steps up front and just want them ordered, parallelized, or
            audited.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            What A Plan Looks Like
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            A plan is a tree. The root names the overall goal. Each leaf names a concrete tool call
            with the data it needs. Below is the plan the model writes for ticket T4: a customer
            wants to cancel and get a refund.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <T color={C.yellow} bold center size={14}>
              Plan Tree - Resolve T4: Cancel + Refund
            </T>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Four-leaf plan tree for ticket T4 cancel and refund showing lookup_customer,
                lookup_subscription, cancel, process_refund leaves with refund leaf marked for
                escalation.
              </desc>

              {/* Root node centered at x = 280 (560/2). Width 200. */}
              <rect
                x={180}
                y={16}
                width={200}
                height={44}
                rx={8}
                fill={`${C.yellow}28`}
                stroke={C.yellow}
                strokeWidth="2"
              />
              <text
                x={280}
                y={36}
                fill={C.yellow}
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                Resolve T4: Cancel + Refund
              </text>
              <text
                x={280}
                y={52}
                fill={SOFT.yellow}
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                Root Goal
              </text>

              {/* Connectors from root to each leaf. Leaves start at y=120. */}
              {PLAN_T4_LEAVES.map((leaf, i) => (
                <line
                  key={`conn-${i}`}
                  x1={280}
                  y1={60}
                  x2={leaf.x + 58}
                  y2={120}
                  stroke={`${SOFT.yellow}99`}
                  strokeWidth="1.4"
                />
              ))}

              {/* Leaf nodes */}
              {PLAN_T4_LEAVES.map((leaf, i) => {
                const accent = C[leaf.color];
                const soft = SOFT[leaf.color];
                return (
                  <g key={`leaf-${i}`}>
                    <rect
                      x={leaf.x}
                      y={120}
                      width={116}
                      height={88}
                      rx={6}
                      fill={`${accent}1f`}
                      stroke={accent}
                      strokeWidth="1.6"
                    />
                    <text
                      x={leaf.x + 58}
                      y={142}
                      fill={accent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.label}
                    </text>
                    {leaf.note.split(/ -> /).map((line, j, arr) => (
                      <text
                        key={`note-${i}-${j}`}
                        x={leaf.x + 58}
                        y={162 + j * 14}
                        fill={soft}
                        fontSize="10"
                        fontWeight="500"
                        textAnchor="middle"
                      >
                        {arr.length > 1 && j > 0 ? `-> ${line}` : line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* Caption */}
              <text
                x={280}
                y={228}
                fill={`${SOFT.yellow}b3`}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                Tree Drawn Before Any Tool Fires
              </text>
            </svg>
          </div>

          <div style={{ ...tintedCard(C.yellow), padding: 12, marginTop: 12 }}>
            <span style={pill(C.yellow)}>KEY IDEA</span>
            <T color={SOFT.yellow} center size={14} style={{ marginTop: 8 }}>
              Every Leaf Names A Tool And The Data It Will Need.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            The plan is structured output, not free text. The model emits four leaf objects, each
            with a tool name, an argument template, and a note about which earlier leaf supplies
            each argument. The fourth leaf flags a known business_rule snag the planner anticipates.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Walk The Leaves
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Once the plan is set, a thin executor walks the leaves in order. Each leaf calls its
            tool, captures the result, and feeds the result into the next leaf's arguments. The
            model only re-enters the loop when something the plan did not anticipate happens.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <T color={C.red} bold center size={14}>
              Executor Walking Leaves 1 - 4 + Adapted Leaf 5
            </T>
            <svg
              viewBox="0 0 600 320"
              style={{ width: "100%", maxWidth: 680, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Plan execution sweep showing four leaves running with their results next to them,
                the fourth leaf failing with a business_rule error, and a fifth escalate_human leaf
                appended by the executor to adapt to the error.
              </desc>

              {/* Top row: 4 original leaves */}
              {WALK_LEAVES.map((leaf, i) => {
                const accent = C[leaf.color];
                const soft = SOFT[leaf.color];
                return (
                  <g key={`walk-${i}`}>
                    <rect
                      x={leaf.x}
                      y={20}
                      width={110}
                      height={72}
                      rx={6}
                      fill={`${accent}1f`}
                      stroke={accent}
                      strokeWidth="1.6"
                    />
                    <text
                      x={leaf.x + 55}
                      y={42}
                      fill={accent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.label}
                    </text>
                    <text
                      x={leaf.x + 55}
                      y={62}
                      fill={soft}
                      fontSize="10"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {leaf.result}
                    </text>
                    {/* Status badge */}
                    <rect
                      x={leaf.x + 35}
                      y={70}
                      width={40}
                      height={16}
                      rx={3}
                      fill={`${accent}33`}
                      stroke={accent}
                      strokeWidth="1"
                    />
                    <text
                      x={leaf.x + 55}
                      y={82}
                      fill={accent}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.status}
                    </text>
                  </g>
                );
              })}

              {/* Connector arrows between top-row leaves */}
              {[0, 1, 2].map((i) => {
                const x1 = WALK_LEAVES[i].x + 110;
                const x2 = WALK_LEAVES[i + 1].x;
                return (
                  <g key={`arrow-top-${i}`}>
                    <line
                      x1={x1}
                      y1={56}
                      x2={x2 - 4}
                      y2={56}
                      stroke={`${SOFT.green}99`}
                      strokeWidth="1.4"
                    />
                    <polygon
                      points={`${x2 - 4},56 ${x2 - 10},52 ${x2 - 10},60`}
                      fill={SOFT.green}
                    />
                  </g>
                );
              })}

              {/* Error annotation under leaf 4 */}
              <text
                x={WALK_LEAVES[3].x + 55}
                y={112}
                fill={SOFT.red}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                business_rule Error
              </text>

              {/* Bent arrow from leaf 4 down to leaf 5 */}
              <path
                d={`M ${WALK_LEAVES[3].x + 55} 120 L ${WALK_LEAVES[3].x + 55} 160 L 300 160 L 300 200`}
                fill="none"
                stroke={SOFT.purple}
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <polygon
                points={`300,200 296,194 304,194`}
                fill={SOFT.purple}
              />
              <text
                x={400}
                y={150}
                fill={SOFT.purple}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                Executor Adapts -&gt; Adds A Leaf
              </text>

              {/* Step 5 leaf centered */}
              <rect
                x={245}
                y={208}
                width={110}
                height={72}
                rx={6}
                fill={`${C.purple}1f`}
                stroke={C.purple}
                strokeWidth="2"
              />
              <text
                x={300}
                y={230}
                fill={C.purple}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                5. escalate_human
              </text>
              <text
                x={300}
                y={250}
                fill={SOFT.purple}
                fontSize="10"
                fontWeight="500"
                textAnchor="middle"
              >
                Reason: business_rule
              </text>
              <rect
                x={280}
                y={258}
                width={40}
                height={16}
                rx={3}
                fill={`${C.purple}33`}
                stroke={C.purple}
                strokeWidth="1"
              />
              <text
                x={300}
                y={270}
                fill={C.purple}
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                Done
              </text>

              <text
                x={300}
                y={304}
                fill={`${SOFT.red}b3`}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                Adapted Plan Closes The Loop
              </text>
            </svg>
          </div>

          <div style={{ ...tintedCard(C.red), padding: 12, marginTop: 12 }}>
            <span style={pill(C.red)}>WHEN PLANS BREAK</span>
            <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
              Executor Catches The business_rule Error And Appends Step 5: escalate_human.
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            Notice the executor did not throw the entire plan away. Leaves 1, 2, and 3 already
            succeeded - their results are kept. Only the failed leaf triggers a replan, and the
            replan appends one new leaf instead of rebuilding the tree from scratch.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Reflection: Did That Answer Land?
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Reflection sits on top of any loop. After the model writes a draft, the same model (or
            a separate critic call) grades it. If the grade is low, the model revises. It is a
            cheap, model-only feedback loop that catches confidently wrong answers before they
            ship.
          </T>

          <div
            style={{
              ...tintedCard(C.amber),
              padding: 14,
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {REFLECTION_ROWS.map((row) => (
              <div
                key={row.n}
                style={{
                  ...tintedCard(C[row.color]),
                  padding: "12px 14px",
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    background: `${C[row.color]}28`,
                    border: `1px solid ${C[row.color]}`,
                    borderRadius: 6,
                    padding: "8px 0",
                    textAlign: "center",
                  }}
                >
                  <T color={C[row.color]} bold size={14}>
                    {row.n}
                  </T>
                </div>
                <div>
                  <T color={C[row.color]} bold size={14}>
                    {row.title}
                  </T>
                  <T color={SOFT[row.color]} size={13} style={{ marginTop: 4 }}>
                    {row.body}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              ...tintedCard(C.amber),
              padding: 12,
              marginTop: 12,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
            }}
          >
            <span style={pill(C.amber)}>SAFETY VALVE</span>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              One Revision Cap Typical. More Triggers Escalation.
            </T>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <T color={C.amber} bold center size={14}>
              Critic Prompt Sketch
            </T>
            <pre
              style={{
                margin: "10px 0 0 0",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.amber,
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
{`Critic: Grade the draft 0-10 on accuracy, format, completeness.
Return JSON: { "score": int, "reasoning": str, "fix_list": [str] }.

If Score < 7, the orchestrator runs the model again with the
fix_list pasted into the prompt. Second draft is re-scored.
Two failed revisions in a row escalate_human.`}
            </pre>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            The cost is one extra model call per draft, plus another full call if a revision is
            needed. The win is catching bugs the original pass missed: math errors, missing fields,
            tone mismatches. Bound revisions so reflection cannot spiral into an infinite revise
            loop.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Pick The Right Loop Pattern
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Four shapes, one decision matrix. Plot the task on two axes: how complex is the task,
            and how much do you need to audit the reasoning. The right loop falls out of the cell
            you land in.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={C.cyan} bold center size={14}>
              Loop Pattern Decision Matrix
            </T>

            {/* Header row: x-axis label */}
            <T color={SOFT.cyan} center size={13} style={{ marginTop: 12 }}>
              Need For Auditability -&gt;
            </T>

            {/* Matrix grid: 3 columns (row label + 2 cells). 2 data rows + 1 axis header row. */}
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "120px 1fr 1fr",
                gap: 8,
                alignItems: "stretch",
              }}
            >
              {/* Column headers */}
              <div />
              <div
                style={{
                  ...tintedCard(C.cyan),
                  padding: "8px 6px",
                  textAlign: "center",
                  background: DIM_BG,
                  border: `1px solid ${DIM_BORDER}`,
                }}
              >
                <T color={SOFT.cyan} bold center size={13}>
                  Low Audit
                </T>
              </div>
              <div
                style={{
                  ...tintedCard(C.cyan),
                  padding: "8px 6px",
                  textAlign: "center",
                  background: DIM_BG,
                  border: `1px solid ${DIM_BORDER}`,
                }}
              >
                <T color={SOFT.cyan} bold center size={13}>
                  High Audit
                </T>
              </div>

              {/* Row 1: Low complexity */}
              <div
                style={{
                  ...tintedCard(C.cyan),
                  padding: "8px 6px",
                  textAlign: "center",
                  background: DIM_BG,
                  border: `1px solid ${DIM_BORDER}`,
                }}
              >
                <T color={SOFT.cyan} bold center size={13}>
                  Simple Task
                </T>
              </div>
              {DECISION_MATRIX.filter((c) => c.row === 0).map((cell) => {
                const accent = C[cell.color];
                const soft = SOFT[cell.color];
                return (
                  <div
                    key={`m-${cell.row}-${cell.col}`}
                    style={{
                      ...tintedCard(accent),
                      padding: "12px 10px",
                      textAlign: "center",
                    }}
                  >
                    <T color={accent} bold center size={14}>
                      {cell.label}
                    </T>
                    <T color={soft} center size={12} style={{ marginTop: 6 }}>
                      {cell.note}
                    </T>
                  </div>
                );
              })}

              {/* Row 2: High complexity */}
              <div
                style={{
                  ...tintedCard(C.cyan),
                  padding: "8px 6px",
                  textAlign: "center",
                  background: DIM_BG,
                  border: `1px solid ${DIM_BORDER}`,
                }}
              >
                <T color={SOFT.cyan} bold center size={13}>
                  Complex Task
                </T>
              </div>
              {DECISION_MATRIX.filter((c) => c.row === 1).map((cell) => {
                const accent = C[cell.color];
                const soft = SOFT[cell.color];
                return (
                  <div
                    key={`m-${cell.row}-${cell.col}`}
                    style={{
                      ...tintedCard(accent),
                      padding: "12px 10px",
                      textAlign: "center",
                    }}
                  >
                    <T color={accent} bold center size={14}>
                      {cell.label}
                    </T>
                    <T color={soft} center size={12} style={{ marginTop: 6 }}>
                      {cell.note}
                    </T>
                  </div>
                );
              })}
            </div>

            {/* Y-axis label below for context */}
            <T color={SOFT.cyan} center size={12} style={{ marginTop: 10 }}>
              Task Complexity Grows Top -&gt; Bottom.
            </T>
          </div>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 12,
              marginTop: 12,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
            }}
          >
            <span style={pill(C.cyan)}>DECISION SHORTCUT</span>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
              <T color={SOFT.cyan} size={14}>
                - Single Tool, Trusted Output: Plain Tool-Use.
              </T>
              <T color={SOFT.cyan} size={14}>
                - Few Steps, Need Visible Reasoning: ReAct.
              </T>
              <T color={SOFT.cyan} size={14}>
                - Many Steps, Order Known: Plan-Execute.
              </T>
              <T color={SOFT.cyan} size={14}>
                - High-Stakes Answer, Must Self-Check: Plan-Execute + Reflection.
              </T>
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Loops are not a ladder where bigger is always better. Each extra structure costs
            tokens, latency, and review surface. Pick the smallest shape that handles the task and
            graduate only when the task forces you to.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
