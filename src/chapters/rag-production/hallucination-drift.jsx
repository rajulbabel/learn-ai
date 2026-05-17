import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { FormulaBox } from "../../shared/rag-helpers.jsx";

// Module-private helpers used by THIS chapter:
const HD_SIGNALS = [
  {
    title: "Faithfulness Score",
    body: "Per-Generation Faithfulness From LLM-As-Judge (12.32). Alert If Rolling 7-Day Median Drops Below 0.85.",
  },
  {
    title: "Citation Coverage",
    body: "Percent Of Claims With A [Doc-X] Citation. Alert If Drops Below 80%.",
  },
  {
    title: "Refusal Rate",
    body: "Percent Of Queries Refused With 'I Don't Know'. Alert On Spike (Too Cautious) Or Dip (Hallucinating When Context Was Sufficient).",
  },
  {
    title: "Out-Of-Index Mentions",
    body: "Regex Or LLM Check For Entities Mentioned That Do Not Appear In Any Retrieved Doc. Hard Signal Of Hallucination.",
  },
];

const HD_DRIFT_TYPES = [
  {
    title: "Data Drift",
    detect: "Re-Index Timestamp Vs Current Doc Set Checksum",
    body: "The Corpus Changes (New Docs Added, Old Docs Removed). The Embedding Index Becomes Stale Relative To The Current Corpus.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    title: "Embedding Drift",
    detect: "Log embedding_model_version Per Query; Alert On Mixed-Version Retrievals",
    body: "You Re-Embed With A New Model. Old Vectors And New Vectors Are Not Directly Comparable. Mixed-Version Retrievals Pollute Top-K.",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    title: "Eval Drift",
    detect: "Lock Judge Version; Rerun Calibration On Judge Change",
    body: "The LLM-As-Judge Model Is Upgraded. Faithfulness Scores From Old Judge Vs New Judge Are Not Directly Comparable.",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    title: "Distribution Drift",
    detect: "Cluster Monitoring On Query Embeddings Over Time",
    body: "User Query Distribution Shifts (New Product Launched, New Failure Mode). Old Query Embeddings Cluster Differently.",
    color: C.yellow,
    accent: "#fff59d",
  },
];

const HD_DETECTION_STEPS = [
  { name: "Extract Claims", note: "LLM Segments Answer Into Atomic Claims" },
  { name: "Check Each Claim Against Retrieved Chunks", note: "LLM-As-Judge: Is Claim Supported?" },
  { name: "Compute Faithfulness Score", note: "supported_claims / total_claims" },
  { name: "Log Score + Doc-IDs + Unsupported Claims", note: "Emit To Trace" },
  { name: "Alert If Rolling Median < 0.85", note: "Page Owner On Drop" },
];

const HD_TIME_SERIES = [
  {
    name: "Faithfulness",
    color: C.green,
    accent: "#80e9b1",
    series: [0.92, 0.91, 0.91, 0.9, 0.9, 0.89, 0.88, 0.87, 0.86, 0.85, 0.84],
    threshold: 0.85,
    alertDay: 28,
  },
  {
    name: "Recall On Golden Set",
    color: C.cyan,
    accent: "#80deea",
    series: [0.88, 0.87, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.8, 0.8, 0.79],
    threshold: 0.82,
    alertDay: 22,
  },
  {
    name: "Refusal Rate (%)",
    color: C.orange,
    accent: "#ffcc80",
    series: [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 18],
    threshold: 15,
    alertDay: 25,
  },
];

const HD_DASHBOARD_DRIFT_STATUS = [
  { type: "Data", status: "OK", color: C.green },
  { type: "Embedding", status: "WARN", color: C.orange },
  { type: "Eval", status: "OK", color: C.green },
  { type: "Distribution", status: "ALERT", color: C.red },
];

const HD_TOP_HALLUCINATED = [
  { query: "How Do I Reset My Password If I Forgot My Email?", score: 0.6 },
  { query: "Cancel My Subscription And Get A Refund", score: 0.5 },
  { query: "Why Is My Dashboard Slow With 500 Errors?", score: 0.68 },
];

export default function HallucinationDrift(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Hallucination Signals */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Signals In Production
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Four signals catch most hallucinations without manual review. Wire each into the trace; alert on rolling
            medians; investigate any spike inside the same shift.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {HD_SIGNALS.map((s) => (
              <div
                key={s.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={15}>
                  {s.title}
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 8 }}>
                  {s.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Four Drift Types */}
      <Reveal when={sub >= 1}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Four Drift Types
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Drift is the slow leak before the flood. Four kinds of drift afflict production RAG. Each has a different
            detection mechanism and a different fix.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {HD_DRIFT_TYPES.map((d) => (
              <div
                key={d.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${d.color}06`,
                  border: `1px solid ${d.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={d.color} bold center size={16}>
                  {d.title}
                </T>
                <T color={d.accent} center size={13} style={{ marginTop: 8 }}>
                  {d.body}
                </T>
                <T color={d.accent} bold center size={12} style={{ marginTop: 8 }}>
                  Detect: {d.detect}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Hallucination Detection Pipeline */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Detection Pipeline
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A 5-step pipeline that runs per-generation. The LLM extracts atomic claims, the judge labels each as
            supported or unsupported, and a rolling-median alert fires below threshold.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 280" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Hallucination detection flow: extract claims from the answer, check each against retrieved chunks,
                compute faithfulness score, log to trace, and alert when the rolling median drops below the threshold.
              </desc>
              {/* Input box */}
              <rect x="60" y="20" width="600" height="40" rx="6" fill={`${C.pink}1a`} stroke={C.pink} strokeWidth="2" />
              <text x="360" y="46" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                Input: User Query + Retrieved Chunks + Generated Answer
              </text>
              {HD_DETECTION_STEPS.map((step, i) => {
                const y = 80 + i * 38;
                return (
                  <g key={step.name}>
                    <rect x="60" y={y} width="600" height="28" rx="4" fill={`${C.pink}33`} stroke={C.pink} />
                    <text x="80" y={y + 18} fill="#f8bbd0" fontSize="13" fontWeight="700">
                      Step {i + 1}: {step.name}
                    </text>
                    <text x="640" y={y + 18} textAnchor="end" fill="#f8bbd0" fontSize="11">
                      {step.note}
                    </text>
                    {i < HD_DETECTION_STEPS.length - 1 && (
                      <line
                        x1="360"
                        y1={y + 28}
                        x2="360"
                        y2={y + 38}
                        stroke={C.pink}
                        strokeWidth="2"
                        markerEnd="url(#hd-arrow)"
                      />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker id="hd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.pink} />
                </marker>
              </defs>
            </svg>
          </div>
          <FormulaBox color={C.pink}>
            <span style={{ color: "#f8bbd0" }}>
              Worked: 5 Claims, 4 Supported, 1 Hallucinated -&gt; Faithfulness = 4/5 = 0.80 -&gt; Below 0.85 Threshold,
              ALERT
            </span>
          </FormulaBox>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Drift Time Series */}
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Drift Detection: Metrics Over Time
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Three drift signals over 30 days. Each crosses its alert threshold on a different day. Without the chart you
            would have noticed the symptoms - a flood of unhappy users - 2-3 weeks late.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 320" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Time-series chart over 30 days showing faithfulness, recall, and refusal rate lines crossing their alert
                thresholds at different days. Each metric is in a distinct color with its threshold shown as a dashed
                line.
              </desc>
              {/* Axes */}
              <line x1="80" y1="40" x2="80" y2="260" stroke="#f8bbd0" strokeWidth="1" />
              <line x1="80" y1="260" x2="660" y2="260" stroke="#f8bbd0" strokeWidth="1" />
              <text x="370" y="290" textAnchor="middle" fill="#f8bbd0" fontSize="13">
                Days (1 To 30)
              </text>
              <text x="40" y="150" textAnchor="middle" fill="#f8bbd0" fontSize="13" transform="rotate(-90, 40, 150)">
                Metric Value
              </text>
              {/* X labels: 1, 10, 20, 30 */}
              {[1, 10, 20, 30].map((d) => {
                const x = 80 + ((d - 1) / 29) * 580;
                return (
                  <g key={d}>
                    <line x1={x} y1="260" x2={x} y2="264" stroke="#f8bbd0" />
                    <text x={x} y="278" textAnchor="middle" fill="#f8bbd0" fontSize="11">
                      Day {d}
                    </text>
                  </g>
                );
              })}
              {/* Lines */}
              {HD_TIME_SERIES.map((line, lineIdx) => {
                // Normalize each line to its own scale for visibility.
                const min = Math.min(...line.series, line.threshold);
                const max = Math.max(...line.series, line.threshold);
                const range = max - min;
                const points = line.series
                  .map((v, i) => {
                    const x = 80 + (i / (line.series.length - 1)) * 580;
                    const y = 250 - ((v - min) / range) * (180 - lineIdx * 30);
                    return `${x},${y}`;
                  })
                  .join(" ");
                const thresholdY = 250 - ((line.threshold - min) / range) * (180 - lineIdx * 30);
                return (
                  <g key={line.name}>
                    <polyline points={points} stroke={line.color} strokeWidth="2" fill="none" />
                    <line
                      x1="80"
                      y1={thresholdY}
                      x2="660"
                      y2={thresholdY}
                      stroke={line.accent}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text x="670" y={thresholdY + 4} fill={line.accent} fontSize="11">
                      {line.name}
                    </text>
                    {/* Alert marker */}
                    {(() => {
                      const alertX = 80 + ((line.alertDay - 1) / 29) * 580;
                      return (
                        <g>
                          <circle cx={alertX} cy={thresholdY} r="6" fill={C.red} stroke="#fff" strokeWidth="1.5" />
                          <text
                            x={alertX}
                            y={thresholdY - 12}
                            textAnchor="middle"
                            fill={C.red}
                            fontSize="10"
                            fontWeight="700"
                          >
                            Alert Day {line.alertDay}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
            Three different metrics. Three different alert days. Each catches a different failure mode early.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Alert Payload */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            What An Alert Should Carry
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            An alert without examples is a blank page at 3am. Always include the failing queries, the failing scores,
            and a hint at the recommended action so the on-call engineer can start fixing immediately.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <T color={C.pink} bold center size={14}>
              Alert Payload Example
            </T>
            <div
              style={{
                marginTop: 10,
                padding: 14,
                borderRadius: 6,
                background: `${C.pink}10`,
                border: `1px dashed ${C.pink}33`,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 13,
                color: "#f8bbd0",
                textAlign: "left",
                whiteSpace: "pre-wrap",
              }}
            >
              {`ALERT: rag.faithfulness.drop
Severity: WARNING
Trigger: 7-Day Median Faithfulness Dropped Below 0.85 (Currently 0.82)
First Crossed: 2026-05-14 03:21 UTC
Affected: Production - Customer Support Pipeline

Recent Examples (Last 24h):
  - Query: "How Do I Reset My Password If I Forgot My Email?"
    Faithfulness: 0.60 | Cited Docs: doc-1, doc-3
    Unsupported Claim: "Support Team Will Email A Reset Link."
  - Query: "Cancel My Subscription And Get A Refund"
    Faithfulness: 0.50 | Cited Docs: doc-4
    Unsupported Claim: "Refunds Are Issued Within 24 Hours."

Recommended Action: Review Recent Corpus Updates And Re-Run Golden Eval.`}
            </div>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
            An alert without examples is useless. Always include the failing queries.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Dashboard */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Full Hallucination + Drift Panel
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10 }}>
            Pull all signals into one panel. Top: the two trend thumbnails. Bottom: per-drift-type status and the worst
            recent queries. This is the dashboard the on-call engineer should see first.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "auto auto",
              gap: 12,
            }}
          >
            {/* Top-left: Faithfulness trend */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Faithfulness Trend (30 Days)
              </T>
              <svg viewBox="0 0 320 80" width="100%" style={{ marginTop: 8 }} role="img">
                <desc>Faithfulness trend thumbnail showing a steady decline from 0.92 to 0.84.</desc>
                <polyline
                  points={HD_TIME_SERIES[0].series
                    .map((v, i) => {
                      const x = 10 + (i / (HD_TIME_SERIES[0].series.length - 1)) * 300;
                      const y = 70 - ((v - 0.8) / 0.12) * 60;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  stroke={C.green}
                  strokeWidth="2"
                  fill="none"
                />
                <line x1="10" y1="25" x2="310" y2="25" stroke="#80e9b1" strokeDasharray="3 3" />
                <text x="312" y="28" fill="#80e9b1" fontSize="10">
                  0.85
                </text>
              </svg>
            </div>
            {/* Top-right: Refusal trend */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Refusal Rate Over Time
              </T>
              <svg viewBox="0 0 320 80" width="100%" style={{ marginTop: 8 }} role="img">
                <desc>Refusal rate trend thumbnail rising from 8 percent to 18 percent.</desc>
                <polyline
                  points={HD_TIME_SERIES[2].series
                    .map((v, i) => {
                      const x = 10 + (i / (HD_TIME_SERIES[2].series.length - 1)) * 300;
                      const y = 70 - ((v - 6) / 14) * 60;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  stroke={C.orange}
                  strokeWidth="2"
                  fill="none"
                />
                <line x1="10" y1="32" x2="310" y2="32" stroke="#ffcc80" strokeDasharray="3 3" />
                <text x="312" y="35" fill="#ffcc80" fontSize="10">
                  15%
                </text>
              </svg>
            </div>
            {/* Bottom-left: Drift status */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Drift Types Triggered
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {HD_DASHBOARD_DRIFT_STATUS.map((row) => (
                  <div
                    key={row.type}
                    style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}
                  >
                    <T color="#80e9b1" size={13}>
                      {row.type}
                    </T>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 10,
                        background: `${row.color}1a`,
                        color: row.color,
                        border: `1px solid ${row.color}33`,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom-right: Top hallucinated */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Top Hallucinated Queries Last 24h
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {HD_TOP_HALLUCINATED.map((row) => (
                  <div
                    key={row.query}
                    style={{ display: "grid", gridTemplateColumns: "1fr 60px", gap: 6, alignItems: "center" }}
                  >
                    <T color="#80e9b1" size={12}>
                      {row.query}
                    </T>
                    <T color={C.red} bold size={12} style={{ fontFamily: "ui-monospace, monospace" }}>
                      {row.score.toFixed(2)}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T color="#80e9b1" center size={14} style={{ marginTop: 12 }}>
            Hallucination detection + drift monitoring catches what users would not bother to report - the slow leak
            before the flood.
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
