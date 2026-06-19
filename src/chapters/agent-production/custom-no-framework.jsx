import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const CUSTOM_REASONS = [
  {
    name: "Control",
    accent: "cyan",
    why: "You Want Exact Control Of Every Behavior - No Framework Magic.",
    detail: "Frameworks Hide Decisions: When To Retry, When To Truncate, What To Cache.",
  },
  {
    name: "Cost",
    accent: "purple",
    why: "Frameworks Add 50-200ms Overhead Per Iteration.",
    detail: "For High-Volume Traffic, That Is Millions Of Dollars Per Year At Scale.",
  },
  {
    name: "Avoid Vendor Lock-In",
    accent: "green",
    why: "You Anticipate Moving Across LLM Providers.",
    detail: "A Custom LLM Adapter Lets You Swap Claude For OpenAI For Llama Without Rewrites.",
  },
];

const CUSTOM_MISSING_ROWS = [
  {
    piece: "Observability (Spans, Traces, Metrics)",
    status: "MUST BUILD",
    why: "Without Traces You Cannot Debug Production Failures.",
  },
  {
    piece: "Retries With Exp Backoff Per Tool Error Class",
    status: "MUST BUILD",
    why: "Transient Network Errors Are Real. Permanent Business-Rule Errors Are Not Retryable.",
  },
  {
    piece: "Checkpointing For Long-Running / Human-In-The-Loop",
    status: "CAN SKIP",
    why: "Skip If Every Run Is Sub-Second. Build Only If You Need Async Resumes.",
  },
  {
    piece: "Hand-Off Between Agents",
    status: "CAN SKIP",
    why: "Skip If You Have One Agent. Build Only If You Have Multi-Agent Workflows.",
  },
  {
    piece: "Eval Harness Integration",
    status: "MUST BUILD",
    why: "Without Evals You Ship Regressions. See 28.3 LLM-As-Judge And 28.4 Trace Evals.",
  },
];

const CUSTOM_DECISION_LEAVES = [
  {
    label: "High-Volume Traffic > 10K / Sec",
    verdict: "YES - CUSTOM",
    why: "Framework Overhead Becomes The Bottleneck.",
    accent: "green",
  },
  {
    label: "Tight Latency Budget P95 < 2s",
    verdict: "YES - CUSTOM",
    why: "Strip Every Wrapper, Inline Hot Paths.",
    accent: "green",
  },
  {
    label: "Multi-Vendor Strategy Required",
    verdict: "YES - CUSTOM",
    why: "Vendor-Agnostic Adapter Saves The Migration Later.",
    accent: "green",
  },
  {
    label: "One-Off Prototype, Ship This Week",
    verdict: "NO - USE FRAMEWORK",
    why: "Ship Fast. You Can Rebuild Later If It Sticks.",
    accent: "red",
  },
  {
    label: "Team Of Fewer Than 3 Engineers",
    verdict: "NO - USE FRAMEWORK",
    why: "You Cannot Maintain A Custom Harness AND Ship Features.",
    accent: "red",
  },
];

const CUSTOM_HYBRID_LAYERS = [
  {
    layer: "Buy: Scaffolding, Schema Validation, Basic Retries",
    detail: "Pip Install A Framework For The Boring 80 Percent.",
    accent: "cyan",
  },
  {
    layer: "Build: LLM Adapter For Vendor Swap",
    detail: "Wrap Claude / OpenAI / Local Behind A Single Call Interface.",
    accent: "purple",
  },
  {
    layer: "Build: Observability Stack",
    detail: "Plug Into Your Existing Monitoring Stack (OTel, Datadog, Honeycomb).",
    accent: "amber",
  },
  {
    layer: "Build: Domain-Specific Tool Gating",
    detail: "Gate Refund Tools, PII Tools, Customer-Specific Permissions In Your Layer.",
    accent: "green",
  },
];

export default function CustomNoFramework(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Three Reasons To Roll Your Own
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            No-framework agents exist for three reasons: total control over behavior, stripping framework overhead, and
            side-stepping vendor lock-in. Each reason is a real production trade-off, not a "we like writing code"
            excuse.
          </T>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            {CUSTOM_REASONS.map((r) => {
              const accent = C[r.accent];
              const soft = SOFT[r.accent];
              return (
                <div key={r.name} style={{ ...tintedCard(accent), padding: 14, textAlign: "center" }}>
                  <T color={accent} center bold size={17}>
                    {r.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {r.why}
                  </T>
                  <div
                    style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: `1px solid ${accent}22`,
                      color: soft,
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {r.detail}
                  </div>
                </div>
              );
            })}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Custom is not a default. Custom is what you reach for when one of these three reasons applies and you can
            afford the engineering cost. Otherwise: pick a framework and ship.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            50 Lines Of Loop
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The minimum-viable agent loop is short. A history list. A while loop. Tool dispatch when the model asks.
            Final text when the model stops. Termination on max iterations. Everything else (retries, observability,
            caching) is built on top of this skeleton.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center size={13} style={{ marginBottom: 8 }}>
              Framework Pattern (Shape) - Custom Loop
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                fontSize: 14,
                color: SOFT.cyan,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {`history = [system_prompt, user_msg]
for i in range(max_iter):
  response = llm.call(history, tools=TOOLS)
  history.append(response)
  if response.has_tool_calls():
    for tool_use in response.tool_calls:
      result = TOOLS[tool_use.name](**tool_use.input)
      history.append(tool_result_block(tool_use.id, result))
  else:
    return response.final_text
return "Max iterations reached - escalating to human."`}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            This is the entire reason-act-observe loop in 11 lines. Tool dispatch lives in the TOOLS dict. Termination
            is either a no-tool-call response or the max_iter cap with an escalation message. You own every line.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Missing Pieces You Now Own
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Frameworks ship a lot more than the loop. When you go custom, every framework feature is on your build list.
            Some are non-negotiable for production. Others you can defer until you actually need them.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.7fr 1.6fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Piece</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple, textAlign: "center" }}>
                Status
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Why</div>
              {CUSTOM_MISSING_ROWS.map((row, i) => {
                const statusColor = row.status === "MUST BUILD" ? C.red : C.green;
                return (
                  <Fragment key={row.piece}>
                    <div
                      style={{
                        padding: "10px",
                        borderTop: `1px solid ${C.purple}22`,
                        color: SOFT.purple,
                        background: i % 2 === 0 ? `${C.purple}06` : "transparent",
                      }}
                    >
                      {row.piece}
                    </div>
                    <div
                      style={{
                        padding: "10px",
                        borderTop: `1px solid ${C.purple}22`,
                        color: statusColor,
                        fontWeight: 700,
                        textAlign: "center",
                        background: i % 2 === 0 ? `${C.purple}06` : "transparent",
                      }}
                    >
                      {row.status}
                    </div>
                    <div
                      style={{
                        padding: "10px",
                        borderTop: `1px solid ${C.purple}22`,
                        color: SOFT.purple,
                        background: i % 2 === 0 ? `${C.purple}06` : "transparent",
                      }}
                    >
                      {row.why}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            "Must build" is the floor for a production custom agent. "Can skip" is the ceiling you can defer until
            traffic justifies it. Misjudge the floor and you ship a fragile agent that breaks the first time a flaky
            tool surfaces.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Stay Custom When...
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            The decision tree is short. Three signals say "go custom". Two signals say "use a framework". When the
            signals conflict, default to a framework and optimize only when you can prove framework overhead is the
            bottleneck.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 344" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Decision tree for staying custom. Five leaves: three say YES (high-volume traffic over 10K per second,
                tight latency budget P95 under 2 seconds, multi-vendor strategy required) and two say NO (one-off
                prototype shipping this week, team of fewer than 3 engineers).
              </desc>
              <text x={360} y={22} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Custom Or Framework?
              </text>
              {/* root */}
              <rect
                x={290}
                y={36}
                width={140}
                height={36}
                rx={8}
                fill={`${C.green}18`}
                stroke={C.green}
                strokeWidth={1.4}
              />
              <text x={360} y={59} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Five Signals
              </text>
              {/* leaves */}
              {CUSTOM_DECISION_LEAVES.map((leaf, i) => {
                const accent = C[leaf.accent];
                const soft = SOFT[leaf.accent];
                const y = 100 + i * 44;
                return (
                  <g key={leaf.label}>
                    <rect
                      x={30}
                      y={y}
                      width={250}
                      height={36}
                      rx={6}
                      fill={`${accent}10`}
                      stroke={accent}
                      strokeWidth={1.2}
                    />
                    <text x={42} y={y + 22} fill={soft} fontSize="12">
                      {leaf.label}
                    </text>
                    <rect
                      x={292}
                      y={y}
                      width={150}
                      height={36}
                      rx={6}
                      fill={`${accent}22`}
                      stroke={accent}
                      strokeWidth={1.2}
                    />
                    <text x={367} y={y + 22} fill={accent} fontSize="12" fontWeight="700" textAnchor="middle">
                      {leaf.verdict}
                    </text>
                    <text x={454} y={y + 22} fill={soft} fontSize="11">
                      {leaf.why.slice(0, 24)}
                    </text>
                  </g>
                );
              })}
              <text x={360} y={332} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Default To Framework Unless A Specific Reason Pushes You Custom
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            One-off prototypes and small teams are the most common "frame your work in a framework" cases. Production
            scale and vendor portability are the most common "go custom" cases. Match the path to your real constraint.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Build Some, Buy Some
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Most production teams end up hybrid. They lean on a framework for scaffolding and schema validation, then
            build custom for the parts the framework cannot do well: a vendor-agnostic LLM adapter, observability that
            integrates with the existing monitoring stack, and domain-specific tool gating.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 270" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Hybrid layer diagram. Stack of four layers showing what teams typically buy from a framework
                (scaffolding, schema validation, basic retries) and what they build custom (LLM adapter for vendor swap,
                observability that integrates with the monitoring stack, domain-specific tool gating).
              </desc>
              <text x={360} y={22} fill={SOFT.amber} fontSize="13" fontWeight="700" textAnchor="middle">
                Hybrid Stack - Most Production Teams Live Here
              </text>
              {CUSTOM_HYBRID_LAYERS.map((row, i) => {
                const accent = C[row.accent];
                const soft = SOFT[row.accent];
                const y = 50 + i * 50;
                return (
                  <g key={row.layer}>
                    <rect
                      x={60}
                      y={y}
                      width={600}
                      height={40}
                      rx={8}
                      fill={`${accent}12`}
                      stroke={accent}
                      strokeWidth={1.4}
                    />
                    <text x={80} y={y + 18} fill={accent} fontSize="13" fontWeight="700">
                      {row.layer}
                    </text>
                    <text x={80} y={y + 33} fill={soft} fontSize="11">
                      {row.detail}
                    </text>
                  </g>
                );
              })}
              <text x={360} y={254} fill={SOFT.amber} fontSize="12" textAnchor="middle">
                Production Reality: Most Teams Run On Top Of A Framework And Replace Hot Layers
              </text>
            </svg>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Hybrid is the smart default once you have one production agent and a working team. Buy what the framework
            does well. Build what differentiates you. Skip the rebuild-from-scratch trap.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
