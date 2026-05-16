import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";
import { SOFT, tintedCard, pill } from "./agent-prompting.jsx";

// Section 13 Acts 8 + 9: Production Hardening + Frameworks & Decision
// Chapters 13.42 - 13.52. In Milestone 5 only Act 8 (13.42 - 13.47) is non-stub; Act 9 (13.48 - 13.52) is added in Milestone 6.

// 13.42 ObservabilityTracing: span tree nodes for ticket T2
const OBS_SPAN_TREE = [
  { id: "root", label: "Agent Run T2", parent: null, depth: 0, ms: 3400 },
  { id: "i1", label: "Loop Iter 1", parent: "root", depth: 1, ms: 1400 },
  { id: "i1-llm", label: "LLM Call 1", parent: "i1", depth: 2, ms: 1200 },
  { id: "i1-tool", label: "Tool: lookup_customer", parent: "i1", depth: 2, ms: 187 },
  { id: "i2", label: "Loop Iter 2", parent: "root", depth: 1, ms: 1300 },
  { id: "i2-llm", label: "LLM Call 2", parent: "i2", depth: 2, ms: 1100 },
  { id: "i2-tool", label: "Tool: change_email", parent: "i2", depth: 2, ms: 196 },
  { id: "i3", label: "Loop Iter 3", parent: "root", depth: 1, ms: 410 },
  { id: "i3-llm", label: "LLM Call 3 (Final Answer)", parent: "i3", depth: 2, ms: 400 },
];

// 13.42 sub=2: vendor comparison cards
const OBS_VENDORS = [
  {
    name: "LangSmith",
    color: "red",
    line1: "By LangChain",
    line2: "Tight LangChain + LangGraph Integration",
    line3: "Managed Cloud. Eval Features Built In",
    when: "When You Already Use LangChain Stack",
  },
  {
    name: "Weave",
    color: "orange",
    line1: "By Weights & Biases",
    line2: "Broader ML Observability",
    line3: "Agent Traces Alongside Model Training. On-Prem Option",
    when: "When You Want One Pane For ML + Agents",
  },
  {
    name: "Phoenix",
    color: "yellow",
    line1: "By Arize AI",
    line2: "Open-Source, OTel-Native",
    line3: "On-Prem First. Lightweight Self-Host",
    when: "When You Need On-Prem And Open Standards",
  },
];

// 13.42 sub=3: per-span metadata classes
const OBS_METADATA = [
  {
    name: "LLM Call Span",
    color: "red",
    fields: [
      "Model Name",
      "Input Tokens, Output Tokens",
      "Cost ($)",
      "Latency (ms)",
      "Prompt Fingerprint",
    ],
  },
  {
    name: "Tool Call Span",
    color: "orange",
    fields: [
      "Tool Name",
      "Input Args (Hashed)",
      "Output Or Error",
      "Status: Success / Failure",
      "Retry Count",
    ],
  },
  {
    name: "Loop Iteration Span",
    color: "yellow",
    fields: [
      "Iteration Number",
      "Reason Summary",
      "State Transition",
      "Decision Reached",
      "Halt Signal If Final",
    ],
  },
];

// 13.42 sub=5: alerting rules
const OBS_ALERTS = [
  {
    metric: "Latency",
    color: "red",
    threshold: "P95 > 8s For 5 Minutes",
    action: "Page On-Call",
  },
  {
    metric: "Cost",
    color: "orange",
    threshold: "Per-Trace Cost > $1",
    action: "Slack Notify + Block User",
  },
  {
    metric: "Tool Failure Rate",
    color: "yellow",
    threshold: "Error Rate > 5% Over 10 Minutes",
    action: "Page On-Call + Open Incident",
  },
  {
    metric: "Quality Drift",
    color: "purple",
    threshold: "Composite Score < Baseline - 0.05 (See 13.41)",
    action: "Slack Notify, Trigger Eval Sweep",
  },
];

export const ObservabilityTracing = (ctx) => {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // Layout helpers for span tree (sub=0)
  const treeViewW = 720;
  const rowH = 38;
  const leftPad = 24;
  const indentW = 36;

  // Sub=4 cost overlay: same shape as span tree but with cost values on LLM call spans
  const COST_PER_SPAN = {
    "i1-llm": 0.025,
    "i2-llm": 0.03,
    "i3-llm": 0.04,
  };
  const totalCost = Object.values(COST_PER_SPAN).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            An Agent Run Is A Tree Of Spans
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            One ticket = one trace = one tree of spans. Every operation worth measuring becomes a
            span. The root span covers the whole run. Each loop iteration is a child. Inside each
            iteration, the LLM call and tool call are leaves. This is the spine of every
            production agent debugger.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${treeViewW} ${OBS_SPAN_TREE.length * rowH + 24}`}
              style={{ width: "100%", maxWidth: treeViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Span tree for ticket T2: root agent run with three loop iterations. Iter 1 calls
                lookup_customer, iter 2 calls change_email, iter 3 emits the final answer. Each
                span row shows its label and duration in milliseconds.
              </desc>
              {OBS_SPAN_TREE.map((s, i) => {
                const y = 16 + i * rowH;
                const x = leftPad + s.depth * indentW;
                const labelW = 360;
                const barX = x + labelW + 12;
                const maxBarW = treeViewW - barX - leftPad - 80;
                const barW = Math.max(8, (s.ms / 3400) * maxBarW);
                return (
                  <g key={s.id}>
                    {s.parent && (
                      <line
                        x1={x - indentW / 2}
                        y1={y - rowH + rowH / 2}
                        x2={x - indentW / 2}
                        y2={y + rowH / 2 - 8}
                        stroke={`${C.pink}66`}
                        strokeWidth={1.4}
                      />
                    )}
                    {s.parent && (
                      <line
                        x1={x - indentW / 2}
                        y1={y + rowH / 2 - 8}
                        x2={x - 4}
                        y2={y + rowH / 2 - 8}
                        stroke={`${C.pink}66`}
                        strokeWidth={1.4}
                      />
                    )}
                    <text
                      x={x}
                      y={y + rowH / 2 - 2}
                      fill={SOFT.pink}
                      fontSize="14"
                      fontWeight={s.depth === 0 ? 700 : 500}
                    >
                      {s.label}
                    </text>
                    <rect
                      x={barX}
                      y={y + rowH / 2 - 12}
                      width={barW}
                      height={14}
                      rx={3}
                      fill={`${C.pink}33`}
                      stroke={C.pink}
                      strokeWidth={1.2}
                    />
                    <text
                      x={barX + barW + 6}
                      y={y + rowH / 2 - 1}
                      fill={SOFT.pink}
                      fontSize="12"
                    >
                      {s.ms}ms
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            The tree is the answer to every &quot;why was that ticket slow / wrong / expensive?&quot;
            Click into a span, read its attributes, jump to the parent or sibling. No tree = no
            debugger.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            OTel: The Open Standard
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            OpenTelemetry (OTel) is the vendor-neutral standard for spans. Every modern agent
            tracer speaks OTel underneath. The span shape below is what every vendor stores
            (with their own UI on top). Learn the shape once, read traces in any vendor.
          </T>

          <div
            style={{
              ...tintedCard(C.red),
              padding: 14,
              marginTop: 14,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={pill(C.red)}>SPAN (SHAPE)</span>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.red,
                fontSize: 14,
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              {`{
  "trace_id":       "tr-8492",
  "span_id":        "sp-3",
  "parent_span_id": "sp-1",
  "name":           "tool.lookup_customer",
  "start_time":     "2026-05-16T10:32:11.204Z",
  "duration_ms":    187,
  "attributes": {
    "customer_id":  "c-9924",
    "tool_name":    "lookup_customer",
    "tool_status":  "success",
    "input_hash":   "sha256:9f4a..."
  }
}`}
            </div>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            trace_id ties together every span in the whole run. parent_span_id builds the tree.
            attributes carry the per-span detail (who, what, how long, success or failure).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Three Vendors, Same Concepts
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Three production-grade observability stacks. All store the same OTel-shaped spans
            underneath. Pick by integration fit, not by feature list, since the core capabilities
            converge.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {OBS_VENDORS.map((v) => {
              const accent = C[v.color];
              const soft = SOFT[v.color];
              return (
                <div key={v.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>VENDOR</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 8 }}>
                    {v.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {v.line1}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {v.line2}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {v.line3}
                  </T>
                  <T color={accent} center size={13} bold style={{ marginTop: 10 }}>
                    {v.when}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            All three accept OTel-format spans, so swapping vendors later is mostly a config
            change, not a rewrite. Lock in the OTel shape today.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            What To Attribute
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Per-span metadata makes the tree searchable, gradable, and replayable. Capture
            inputs (so you can replay) AND outputs (so you can grade). Three span classes, three
            metadata profiles.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {OBS_METADATA.map((m) => {
              const accent = C[m.color];
              const soft = SOFT[m.color];
              return (
                <div key={m.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>ATTRIBUTE</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {m.name}
                  </T>
                  <div style={{ marginTop: 10, textAlign: "left" }}>
                    {m.fields.map((f) => (
                      <T key={f} color={soft} size={13} style={{ marginTop: 4 }}>
                        - {f}
                      </T>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            Production rule: capture inputs for replay AND outputs for grading. Without both,
            you cannot reproduce a bad trace OR score it later.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Full T2 Trace With Cost
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Same tree as sub=0, now with cost overlaid on each LLM call span. Tool calls
            themselves are nearly free (compute only). LLM calls dominate. Sum across all LLM
            spans = total trace cost. This is what every cost dashboard reduces to.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${treeViewW} ${OBS_SPAN_TREE.length * rowH + 24}`}
              style={{ width: "100%", maxWidth: treeViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Same span tree as sub=0 for ticket T2, with cost values overlaid on each LLM
                call span. LLM call 1 cost $0.025, call 2 cost $0.03, call 3 cost $0.04. Total
                trace cost shown at bottom.
              </desc>
              {OBS_SPAN_TREE.map((s, i) => {
                const y = 16 + i * rowH;
                const x = leftPad + s.depth * indentW;
                const labelW = 320;
                const barX = x + labelW + 12;
                const maxBarW = treeViewW - barX - leftPad - 130;
                const barW = Math.max(8, (s.ms / 3400) * maxBarW);
                const cost = COST_PER_SPAN[s.id];
                return (
                  <g key={s.id}>
                    {s.parent && (
                      <line
                        x1={x - indentW / 2}
                        y1={y - rowH + rowH / 2}
                        x2={x - indentW / 2}
                        y2={y + rowH / 2 - 8}
                        stroke={`${C.purple}66`}
                        strokeWidth={1.4}
                      />
                    )}
                    {s.parent && (
                      <line
                        x1={x - indentW / 2}
                        y1={y + rowH / 2 - 8}
                        x2={x - 4}
                        y2={y + rowH / 2 - 8}
                        stroke={`${C.purple}66`}
                        strokeWidth={1.4}
                      />
                    )}
                    <text
                      x={x}
                      y={y + rowH / 2 - 2}
                      fill={SOFT.purple}
                      fontSize="14"
                      fontWeight={s.depth === 0 ? 700 : 500}
                    >
                      {s.label}
                    </text>
                    <rect
                      x={barX}
                      y={y + rowH / 2 - 12}
                      width={barW}
                      height={14}
                      rx={3}
                      fill={`${C.purple}33`}
                      stroke={C.purple}
                      strokeWidth={1.2}
                    />
                    <text
                      x={barX + barW + 6}
                      y={y + rowH / 2 - 1}
                      fill={SOFT.purple}
                      fontSize="12"
                    >
                      {s.ms}ms
                    </text>
                    {cost && (
                      <text
                        x={treeViewW - leftPad}
                        y={y + rowH / 2 - 1}
                        fill={C.purple}
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="end"
                      >
                        ${cost.toFixed(3)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <T color={C.purple} bold center size={18} style={{ marginTop: 14 }}>
              Total Trace Cost: ${totalCost.toFixed(3)}
            </T>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The same tree powers latency dashboards (bar widths) AND cost dashboards (per-LLM
            span values). One trace, many views, all from the same OTel spans.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Turn Traces Into Alerts
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            Traces are great for debugging one ticket. Alerts are how traces protect production.
            Every alert rule converts a per-span aggregate into a paging signal. These four
            cover most agent incidents.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.6fr 1.4fr",
                gap: 0,
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.pink }}>Metric</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.pink }}>
                Threshold
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.pink }}>Action</div>
              {OBS_ALERTS.map((a) => {
                const accent = C[a.color];
                const soft = SOFT[a.color];
                return (
                  <Fragment key={a.metric}>
                    <div
                      style={{
                        padding: "10px 10px",
                        borderTop: `1px solid ${C.pink}22`,
                        color: accent,
                        fontWeight: 700,
                      }}
                    >
                      {a.metric}
                    </div>
                    <div
                      style={{
                        padding: "10px 10px",
                        borderTop: `1px solid ${C.pink}22`,
                        color: soft,
                      }}
                    >
                      {a.threshold}
                    </div>
                    <div
                      style={{
                        padding: "10px 10px",
                        borderTop: `1px solid ${C.pink}22`,
                        color: soft,
                      }}
                    >
                      {a.action}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            The drift rule chains back to 13.41: when the composite eval score drops past a
            threshold, alerting kicks in BEFORE end-users notice. Tracing + eval together close
            the production loop.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

// 13.43 sub=0: cost-breakdown stacked bar segments for a typical agent run
const COST_BREAKDOWN = [
  { name: "Input Tokens", pct: 40, color: "red" },
  { name: "Output Tokens", pct: 35, color: "orange" },
  { name: "Retries", pct: 20, color: "yellow" },
  { name: "Tool Calls", pct: 5, color: "purple" },
];

// 13.43 sub=2: model-routing tiers
const COST_ROUTING_TIERS = [
  {
    name: "Classifier (Cheap)",
    color: "red",
    line1: "Tiny Model (Haiku-Class)",
    line2: "Decides Route",
    cost: "$0.01 / Ticket",
  },
  {
    name: "Small Model Path",
    color: "orange",
    line1: "Simple Lookups, FAQs",
    line2: "60% Of Tickets Land Here",
    cost: "$0.05 / Ticket",
  },
  {
    name: "Large Model Path",
    color: "purple",
    line1: "Complex Multi-Step Cases",
    line2: "40% Of Tickets",
    cost: "$0.30 / Ticket",
  },
];

// 13.43 sub=4: cost-aware retry decision rows
const COST_RETRY_RULES = [
  {
    kind: "Transient",
    color: "orange",
    detail: "Rate Limit, Timeout, 5xx",
    decision: "Retry With Exp Backoff (Cheap, Likely To Succeed)",
  },
  {
    kind: "Permanent",
    color: "red",
    detail: "Auth Fail, 403, Invalid Tool",
    decision: "Do Not Retry. Escalate Immediately",
  },
  {
    kind: "Malformed",
    color: "yellow",
    detail: "Bad JSON, Schema Mismatch",
    decision: "Retry Once. Often Succeeds On Second Try",
  },
  {
    kind: "Business Rule",
    color: "purple",
    detail: "Refund Above Cap, Closed Account",
    decision: "Do Not Retry. Adapt Or Escalate",
  },
];

export const CostControl = (ctx) => {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // SVG dims for sub=0 stacked bar
  const barViewW = 640;
  const barH = 56;
  const barY = 60;

  // Prompt-cache sub=1: tokens before vs after
  const cacheViewW = 640;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Where The Dollars Go
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            A typical multi-iter agent run on the customer-support corpus costs about $0.30 per
            ticket. Output tokens are usually the dominant slice because output is priced 5x
            input. Retries quietly compound. Tool calls themselves are negligible.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${barViewW} 200`}
              style={{ width: "100%", maxWidth: barViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Stacked horizontal cost bar showing a typical agent run: input tokens 40 percent,
                output tokens 35 percent, retries 20 percent, tool calls 5 percent. Total cost
                annotated as 30 cents per ticket. Output tokens are the dominant slice because
                output is priced 5 times input.
              </desc>
              {(() => {
                const inner = barViewW - 80;
                let cursor = 40;
                return COST_BREAKDOWN.map((seg) => {
                  const w = (seg.pct / 100) * inner;
                  const x = cursor;
                  cursor += w;
                  const accent = C[seg.color];
                  return (
                    <g key={seg.name}>
                      <rect
                        x={x}
                        y={barY}
                        width={w}
                        height={barH}
                        fill={`${accent}55`}
                        stroke={accent}
                        strokeWidth={1.5}
                      />
                      <text
                        x={x + w / 2}
                        y={barY + barH / 2 + 4}
                        fill={SOFT[seg.color]}
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {seg.pct}%
                      </text>
                      <text
                        x={x + w / 2}
                        y={barY + barH + 22}
                        fill={SOFT[seg.color]}
                        fontSize="13"
                        textAnchor="middle"
                      >
                        {seg.name}
                      </text>
                    </g>
                  );
                });
              })()}
              <text
                x={barViewW / 2}
                y={barY + barH + 60}
                fill={C.pink}
                fontSize="18"
                fontWeight="700"
                textAnchor="middle"
              >
                Total Cost: $0.30 / Ticket
              </text>
              <text
                x={barViewW / 2}
                y={barY + barH + 84}
                fill={SOFT.pink}
                fontSize="13"
                textAnchor="middle"
              >
                Output Tokens Are The Dominant Slice (Priced 5x Input)
              </text>
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            The biggest wins target the biggest slices. Output tokens first (use smaller models
            where possible). Retries second (better error handling). Input tokens third (prompt
            caching). Tool calls almost never.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Cache The Prefix
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Every iteration sends the same system prompt + tool definitions + earlier history.
            Without caching, the model re-bills the prefix on every call. Prompt caching stores
            the prefix server-side and only bills the new turn.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${cacheViewW} 220`}
              style={{ width: "100%", maxWidth: cacheViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Before-and-after diagram for prompt caching: before, every iteration is billed
                for the full 15k token context. After, the 12k prefix is cached and only the 3k
                new turn is billed fresh, yielding about 80 percent savings on input tokens.
              </desc>
              {(() => {
                const beforeY = 30;
                const afterY = 130;
                const totalW = 480;
                const xStart = (cacheViewW - totalW) / 2;
                return (
                  <g>
                    {/* Before: one big block */}
                    <text x={xStart - 8} y={beforeY + 18} fill={SOFT.red} fontSize="14" fontWeight="700" textAnchor="end">
                      Before
                    </text>
                    <rect x={xStart} y={beforeY} width={totalW} height={40} fill={`${C.red}55`} stroke={C.red} strokeWidth={1.5} />
                    <text x={xStart + totalW / 2} y={beforeY + 25} fill={SOFT.red} fontSize="14" fontWeight="700" textAnchor="middle">
                      Full Context Re-Billed Each Turn (15k Tokens)
                    </text>
                    {/* After: prefix cached + new turn */}
                    <text x={xStart - 8} y={afterY + 18} fill={SOFT.red} fontSize="14" fontWeight="700" textAnchor="end">
                      After
                    </text>
                    <rect x={xStart} y={afterY} width={totalW * 0.8} height={40} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={1.5} strokeDasharray="6 4" />
                    <text x={xStart + (totalW * 0.8) / 2} y={afterY + 25} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                      Cached Prefix (12k Tokens, ~Free)
                    </text>
                    <rect x={xStart + totalW * 0.8} y={afterY} width={totalW * 0.2} height={40} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.5} />
                    <text x={xStart + totalW * 0.8 + (totalW * 0.2) / 2} y={afterY + 25} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                      New Turn (3k)
                    </text>
                  </g>
                );
              })()}
              <text x={cacheViewW / 2} y={200} fill={C.red} fontSize="17" fontWeight="700" textAnchor="middle">
                ~80% Savings On Input Cost
              </text>
            </svg>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Section 12.36 covers prompt + semantic caching for RAG; the mechanism is identical
            for agents. The big difference: agents send a near-identical prefix on EVERY tool
            iteration, so the cache hit rate is even higher than RAG.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Cheap For Easy, Expensive For Hard
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Not every ticket needs the largest model. A tiny classifier routes by complexity.
            Simple lookups go to a small model. Complex multi-step cases get the large model.
            About 60% of tickets land on the small path. The blended cost is roughly half what
            it would be sending everything through the large model.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {COST_ROUTING_TIERS.map((tier) => {
              const accent = C[tier.color];
              const soft = SOFT[tier.color];
              return (
                <div key={tier.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>TIER</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 8 }}>
                    {tier.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {tier.line1}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {tier.line2}
                  </T>
                  <T color={accent} center size={15} bold style={{ marginTop: 10 }}>
                    {tier.cost}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Blended average across all routes: about $0.13 / ticket vs $0.30 without routing.
            Roughly 50% cost savings, with the same per-ticket quality on the hard cases (they
            still use the large model).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Hard Cap Per Ticket
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Beyond the average, you need a hard ceiling. The budget cap is a running tally of
            spend per ticket. When it hits a fixed limit (typically $1), the loop terminates
            with an escalation. The cap is the LAST line of defense against runaway iterations.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
            <T color={SOFT.yellow} center size={13} style={{ marginBottom: 8 }}>
              Budget Bar Fills As Iterations Spend Tokens
            </T>
            <svg viewBox="0 0 540 80" style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
              <desc>
                Budget bar diagram showing a ticket consuming spend across iterations. At 80
                percent the bar is yellow. At 100 percent ($1 cap) the bar turns red and the
                loop terminates with an escalation.
              </desc>
              <rect x={20} y={20} width={500} height={32} fill={`${C.yellow}11`} stroke={`${C.yellow}55`} strokeWidth={1.2} rx={4} />
              <rect x={20} y={20} width={400} height={32} fill={`${C.yellow}55`} stroke={C.yellow} strokeWidth={1.5} rx={4} />
              <text x={220} y={42} fill={SOFT.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                Spent: $0.80
              </text>
              <text x={510} y={42} fill={C.red} fontSize="13" fontWeight="700" textAnchor="end">
                Cap: $1.00
              </text>
              <text x={270} y={72} fill={SOFT.yellow} fontSize="12" textAnchor="middle">
                Iteration 4 In Progress
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            Combine the cost cap with the iteration cap (Section 13.23 max-iter) for
            belt-and-suspenders. One protects against expensive loops; the other protects
            against infinite loops with cheap models. You need both.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Don&apos;t Retry Expensive Failures
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Retries are the silent killer of cost. A naive busy-retry on every error doubles or
            triples the spend on the failing tickets. Classify the failure first; retry only
            when the next attempt is likely to succeed.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr 2fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>
                Failure Kind
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>
                Examples
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>
                Decision
              </div>
              {COST_RETRY_RULES.map((r) => {
                const accent = C[r.color];
                const soft = SOFT[r.color];
                return (
                  <Fragment key={r.kind}>
                    <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.purple}22`, color: accent, fontWeight: 700 }}>
                      {r.kind}
                    </div>
                    <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.purple}22`, color: soft }}>
                      {r.detail}
                    </div>
                    <div style={{ padding: "10px 10px", borderTop: `1px solid ${C.purple}22`, color: soft }}>
                      {r.decision}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Section 13.11 covers the full error taxonomy and retry policies. The cost angle is
            the same lesson with money attached: a busy-retry on a permanent error can double
            the cost of a failed ticket without ever succeeding.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

// 13.44 sub=0: latency waterfall steps for ticket T2 (3.4s baseline)
const LATENCY_T2_WATERFALL = [
  { name: "LLM Call 1", color: "red", ms: 1200, label: "Decide: Call lookup_customer" },
  { name: "Tool: lookup_customer", color: "orange", ms: 200, label: "Customer Profile Returned" },
  { name: "LLM Call 2", color: "red", ms: 1100, label: "Decide: Call reset_password" },
  { name: "Tool: reset_password", color: "orange", ms: 200, label: "Token Generated" },
  { name: "LLM Call 3", color: "red", ms: 700, label: "Final Answer" },
];

// 13.44 sub=4: cacheable results
const LATENCY_CACHE_TARGETS = [
  {
    name: "Customer Profile",
    color: "red",
    ttl: "TTL: 5 Minutes",
    why: "Profile Rarely Changes Mid-Session",
  },
  {
    name: "KB Article Body",
    color: "orange",
    ttl: "TTL: 1 Hour",
    why: "KB Updates Are Infrequent",
  },
  {
    name: "Routing / Classification",
    color: "yellow",
    ttl: "TTL: Per Conversation",
    why: "Topic Rarely Shifts Mid-Convo",
  },
];

export const LatencyOptimization = (ctx) => {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // Waterfall layout (sub=0)
  const wfViewW = 720;
  const totalMs = LATENCY_T2_WATERFALL.reduce((a, s) => a + s.ms, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Where The Seconds Go
          </T>
          <T color={SOFT.pink} center size={16} style={{ marginTop: 10 }}>
            Ticket T2 takes 3.4 seconds end-to-end. Break it down into spans and the story is
            blunt: LLM calls are the bulk. Tool calls are nearly free. If you want T2 faster,
            shorten LLM time first. Tool optimization is third or fourth on the list.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${wfViewW} 260`}
              style={{ width: "100%", maxWidth: wfViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Gantt-style latency waterfall for ticket T2 with 5 spans summing to 3400
                milliseconds: LLM call 1 1200ms, lookup_customer tool 200ms, LLM call 2 1100ms,
                reset_password tool 200ms, LLM call 3 700ms. LLM calls dominate the timeline.
              </desc>
              {(() => {
                const innerW = wfViewW - 200;
                let cursor = 0;
                return LATENCY_T2_WATERFALL.map((s, i) => {
                  const w = (s.ms / 3400) * innerW;
                  const y = 30 + i * 42;
                  const x = 180 + cursor;
                  cursor += w;
                  const accent = C[s.color];
                  return (
                    <g key={s.name}>
                      <text x={170} y={y + 20} fill={SOFT[s.color]} fontSize="13" fontWeight="700" textAnchor="end">
                        {s.name}
                      </text>
                      <rect x={x} y={y + 4} width={w} height={26} fill={`${accent}55`} stroke={accent} strokeWidth={1.4} rx={3} />
                      <text x={x + w + 6} y={y + 22} fill={SOFT[s.color]} fontSize="12">
                        {s.ms}ms
                      </text>
                      <text x={x + w / 2} y={y + 20} fill={SOFT[s.color]} fontSize="11" textAnchor="middle">
                        {s.label}
                      </text>
                    </g>
                  );
                });
              })()}
              <text x={wfViewW / 2} y={250} fill={C.pink} fontSize="17" fontWeight="700" textAnchor="middle">
                Total Latency: {totalMs}ms (3.4 Seconds)
              </text>
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            Three LLM calls = 3000ms of the 3400ms. Two tool calls = 400ms. The optimization
            order is forced by the numbers: shorten LLM time first.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Show Progress Token By Token
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Streaming doesn&apos;t make the answer arrive faster. It makes the user FEEL faster.
            Without streaming, the user stares at a spinner for 1.5 seconds. With streaming,
            the first token appears at 200ms and text scrolls in. Same total time. Different
            perceived latency.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 640 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two side-by-side timelines comparing perceived latency. Without streaming, the
                user sees nothing for 1500 milliseconds then the full response. With streaming,
                the user sees the first token at 200 milliseconds with text scrolling in until
                1500 milliseconds. Same total time, very different perception.
              </desc>
              {/* Without streaming */}
              <text x={20} y={40} fill={SOFT.red} fontSize="14" fontWeight="700">
                Without Streaming
              </text>
              <rect x={20} y={50} width={500} height={28} fill={`${C.red}22`} stroke={`${C.red}55`} strokeWidth={1.2} rx={3} />
              <rect x={500} y={50} width={20} height={28} fill={`${C.red}88`} stroke={C.red} strokeWidth={1.4} rx={3} />
              <text x={270} y={70} fill={SOFT.red} fontSize="12" textAnchor="middle">
                User Sees Spinner For 1.5s, Then Full Answer
              </text>
              {/* With streaming */}
              <text x={20} y={120} fill={SOFT.green} fontSize="14" fontWeight="700">
                With Streaming
              </text>
              <rect x={20} y={130} width={66} height={28} fill={`${C.green}22`} stroke={`${C.green}55`} strokeWidth={1.2} rx={3} />
              <rect x={86} y={130} width={434} height={28} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.4} rx={3} />
              <text x={300} y={150} fill={SOFT.green} fontSize="12" textAnchor="middle">
                First Token At 200ms, Text Scrolls In Through 1.5s
              </text>
              <text x={320} y={185} fill={C.red} fontSize="14" fontWeight="700" textAnchor="middle">
                Perceived Latency Drops From 1.5s To 200ms
              </text>
            </svg>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            Cheap win, large UX impact. Always stream the final answer. Stream intermediate
            tool-call narration too when the agent is multi-step.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Run Independent Tools Concurrently
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Ticket T4 (cancel + refund) needs two lookups before deciding. Serial: 400ms total
            tool latency. Parallel: 200ms total. Same outputs. Half the time. Section 13.10
            covers the tool_choice setting that lets the model emit multiple tool calls in one
            response.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 640 220"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Serial vs parallel tool call timelines for ticket T4. Serial timeline: 200ms
                lookup_customer followed by 200ms lookup_subscription, 400ms total. Parallel
                timeline: both tool calls run concurrently in 200ms total. Half the time for
                identical results.
              </desc>
              {/* Serial */}
              <text x={20} y={40} fill={SOFT.orange} fontSize="14" fontWeight="700">
                Serial (T4)
              </text>
              <rect x={20} y={50} width={200} height={28} fill={`${C.orange}55`} stroke={C.orange} strokeWidth={1.4} rx={3} />
              <text x={120} y={70} fill={SOFT.orange} fontSize="12" textAnchor="middle">
                lookup_customer (200ms)
              </text>
              <rect x={220} y={50} width={200} height={28} fill={`${C.orange}55`} stroke={C.orange} strokeWidth={1.4} rx={3} />
              <text x={320} y={70} fill={SOFT.orange} fontSize="12" textAnchor="middle">
                lookup_subscription (200ms)
              </text>
              <text x={440} y={70} fill={C.orange} fontSize="13" fontWeight="700">
                400ms Total
              </text>
              {/* Parallel */}
              <text x={20} y={130} fill={SOFT.green} fontSize="14" fontWeight="700">
                Parallel (T4)
              </text>
              <rect x={20} y={140} width={200} height={28} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.4} rx={3} />
              <text x={120} y={160} fill={SOFT.green} fontSize="12" textAnchor="middle">
                lookup_customer (200ms)
              </text>
              <rect x={20} y={172} width={200} height={28} fill={`${C.green}55`} stroke={C.green} strokeWidth={1.4} rx={3} />
              <text x={120} y={192} fill={SOFT.green} fontSize="12" textAnchor="middle">
                lookup_subscription (200ms)
              </text>
              <text x={240} y={170} fill={C.green} fontSize="13" fontWeight="700">
                200ms Total
              </text>
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Section 13.10 (Parallel Tools + Tool Choice) is the API-level mechanism. The latency
            payoff: 200ms saved per applicable turn. In multi-tool tickets like T4 this adds up
            fast.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Run Likely Steps Before Confirming
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Speculative execution starts the next probable tool call BEFORE the LLM finishes its
            decision. While the model is still generating &quot;I&apos;ll look up your account...&quot;
            the runtime speculatively kicks off lookup_customer for the customer already
            referenced earlier. If the model ends up requesting it, the result is already in
            cache. If not, the work is discarded.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 640 220"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Speculative execution timeline showing the LLM generating its decision in 1.2
                seconds while a speculative lookup_customer tool call runs in parallel and
                completes at 200 milliseconds. When the LLM finishes, the tool result is
                already available with zero added wait.
              </desc>
              <text x={20} y={40} fill={SOFT.yellow} fontSize="14" fontWeight="700">
                LLM Generating Decision
              </text>
              <rect x={20} y={50} width={520} height={28} fill={`${C.yellow}55`} stroke={C.yellow} strokeWidth={1.4} rx={3} />
              <text x={280} y={70} fill={SOFT.yellow} fontSize="12" textAnchor="middle">
                &quot;I&apos;ll look up your account...&quot; (1200ms)
              </text>
              <text x={20} y={120} fill={SOFT.purple} fontSize="14" fontWeight="700">
                Speculative Tool Call
              </text>
              <rect x={20} y={130} width={87} height={28} fill={`${C.purple}55`} stroke={C.purple} strokeWidth={1.4} rx={3} strokeDasharray="4 3" />
              <text x={63} y={150} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                lookup_customer (200ms)
              </text>
              <text x={130} y={150} fill={SOFT.purple} fontSize="12">
                Result Cached, Waiting
              </text>
              <text x={320} y={195} fill={C.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                When LLM Requests It At 1200ms, Result Returns In 0ms (Already Computed)
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            The tradeoff is real: speculative calls pay for sometimes-wasted work in exchange
            for real-time response. Use only on tool calls where the wasted-work cost is small
            (read-only lookups). Never speculate on mutation tools.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Cache What Doesn&apos;t Change
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Result caching is the last latency lever. Three categories of result are stable
            enough to cache safely with conservative TTLs. Pair every cache with an invalidate
            hook on the matching mutation event.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {LATENCY_CACHE_TARGETS.map((t) => {
              const accent = C[t.color];
              const soft = SOFT[t.color];
              return (
                <div key={t.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>CACHEABLE</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 8 }}>
                    {t.name}
                  </T>
                  <T color={soft} center size={14} bold style={{ marginTop: 8 }}>
                    {t.ttl}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {t.why}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Cache invalidation is the hard part. Pick conservative TTLs (5 minutes for profile,
            1 hour for KB) and invalidate on mutation events (profile-updated, kb-doc-edited).
            Better to miss the cache than to serve a stale answer.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

export const Guardrails = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Guardrails
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const PromptInjectionDefenses = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Prompt Injection Defenses
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const ToolSecurity = (_ctx) => {
  return (
    <div>
      <Box color={C.pink}>
        <T color={C.pink} bold center size={22}>
          Tool Security
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};
