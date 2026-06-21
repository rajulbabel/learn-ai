import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by PromptVsTuneVsRagVsAgent (24.5)

const FOUR_APPROACHES = [
  {
    name: "Prompting",
    color: C.cyan,
    soft: SOFT.cyan,
    changes: "Nothing in the model. Nothing in the data.",
    detail: "Write better messages. Same base weights, same world knowledge, same call.",
    runtime: "1 LLM call",
  },
  {
    name: "Fine-Tuning",
    color: C.purple,
    soft: SOFT.purple,
    changes: "Model weights change. Data is baked in.",
    detail: "Train on examples of the new behavior. The new skill lives inside the parameters.",
    runtime: "1 LLM call (specialized model)",
  },
  {
    name: "RAG",
    color: C.blue,
    soft: SOFT.blue,
    changes: "Data is retrieved at call-time.",
    detail: "Vector search pulls fresh chunks into the prompt. Same base model, new context per call.",
    runtime: "1 retrieval + 1 LLM call",
  },
  {
    name: "Agent",
    color: C.orange,
    soft: SOFT.orange,
    changes: "Model uses tools in a loop.",
    detail: "LLM decides what to do, calls a tool, reads the result, loops until done.",
    runtime: "Multiple LLM calls + tool calls",
  },
];

const FRESHNESS_AXIS = [
  {
    name: "Fine-Tuning",
    color: C.purple,
    soft: SOFT.purple,
    pos: 0.05,
    freshness: "Never to weekly",
    note: "Retraining is slow and expensive.",
  },
  {
    name: "Prompting",
    color: C.cyan,
    soft: SOFT.cyan,
    pos: 0.18,
    freshness: "Never",
    note: "Whatever you wrote into the prompt is frozen.",
  },
  {
    name: "RAG",
    color: C.blue,
    soft: SOFT.blue,
    pos: 0.6,
    freshness: "Hourly",
    note: "Re-index docs and the model sees them next call.",
  },
  {
    name: "Agent",
    color: C.orange,
    soft: SOFT.orange,
    pos: 0.95,
    freshness: "Real-time per query",
    note: "Tools hit live APIs at the moment of the question.",
  },
];

const CAPABILITY_AXIS = [
  {
    name: "Prompting",
    color: C.cyan,
    soft: SOFT.cyan,
    band: "Already in base model",
    pos: 0.1,
    note: "Trigger the skill that's already there. Cheapest path.",
  },
  {
    name: "RAG",
    color: C.blue,
    soft: SOFT.blue,
    band: "Knows the skill, missing the facts",
    pos: 0.4,
    note: "Reading-comprehension is in the model. Your private docs are not.",
  },
  {
    name: "Agent",
    color: C.orange,
    soft: SOFT.orange,
    band: "Knows the skill, missing the actions",
    pos: 0.65,
    note: "Reasoning is in the model. Side-effects need tools.",
  },
  {
    name: "Fine-Tuning",
    color: C.purple,
    soft: SOFT.purple,
    band: "Specialized skill never seen",
    pos: 0.95,
    note: "Style, domain jargon, structured output the base model can't imitate.",
  },
];

const LATENCY_COST_QUADRANTS = [
  {
    quadrant: "Low Latency, Low Cost",
    color: C.cyan,
    soft: SOFT.cyan,
    pick: "Prompting",
    detail: "1 call, small prompt. Cheapest and fastest by default.",
  },
  {
    quadrant: "Low Latency, Higher Cost Upfront",
    color: C.purple,
    soft: SOFT.purple,
    pick: "Fine-Tuning",
    detail: "Training is expensive. Inference after that is short prompt + 1 call.",
  },
  {
    quadrant: "Higher Latency, Low Cost",
    color: C.blue,
    soft: SOFT.blue,
    pick: "RAG",
    detail: "Add vector search before the call. Tokens stay small, freshness is free.",
  },
  {
    quadrant: "Highest Latency, Variable Cost",
    color: C.orange,
    soft: SOFT.orange,
    pick: "Agent",
    detail: "Each loop is another call. Cost scales with tool steps.",
  },
];

const DECISION_TREE_LEAVES = [
  {
    q: "Does the model already know it well enough?",
    a: "Yes",
    pick: "Prompting alone",
    color: C.cyan,
    soft: SOFT.cyan,
  },
  {
    q: "Knowledge needs to stay current?",
    a: "Yes",
    pick: "RAG",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    q: "Need a specialized skill the model doesn't have?",
    a: "Yes",
    pick: "Fine-Tuning (plus RAG if data also moves)",
    color: C.purple,
    soft: SOFT.purple,
  },
  {
    q: "Need to take actions in the world via tools?",
    a: "Yes",
    pick: "Agent",
    color: C.orange,
    soft: SOFT.orange,
  },
];

const STACK_LAYERS = [
  {
    name: "Fine-Tuned Base Model",
    color: C.purple,
    soft: SOFT.purple,
    detail: "Teaches the support voice and the refund-policy JSON shape.",
  },
  {
    name: "+ RAG Layer",
    color: C.blue,
    soft: SOFT.blue,
    detail: "Pulls today's order history, today's billing record, today's playbook.",
  },
  {
    name: "+ Agent Loop",
    color: C.orange,
    soft: SOFT.orange,
    detail: "Reads tickets, issues refunds, sends emails. Real side-effects.",
  },
  {
    name: "+ Prompting / Few-Shot Per Task",
    color: C.cyan,
    soft: SOFT.cyan,
    detail: "System prompt + examples shape each individual call.",
  },
];

const ANTI_PATTERNS = [
  {
    name: "Fine-Tuning To Add Fresh Facts",
    bad: "Retraining every time the pricing page changes.",
    fix: "Use RAG. Facts that move belong outside the weights.",
  },
  {
    name: "RAG For Behavior The Model Doesn't Know",
    bad: "Stuffing style guides into the prompt and hoping the tone sticks.",
    fix: "Fine-tune. Behavior lives in weights, not in retrieved chunks.",
  },
  {
    name: "Agent Loop For A Simple Lookup",
    bad: "Multi-step planning to answer 'what's the refund window?'",
    fix: "Direct call + 1 tool. Loops are for tasks that branch.",
  },
  {
    name: "Massive Prompt Instead Of Fine-Tuning A Small Model",
    bad: "Sending 30 examples on every call to a frontier model.",
    fix: "Fine-tune a small model once. Cost runaway stops, latency drops.",
  },
];

export default function PromptVsTuneVsRagVsAgent(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Four Tools In The Toolbox
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Every customer-support feature you ship is one of four things: a prompt change, a weight change, a retrieval
            change, or a tool loop. Knowing which is which prevents months of wasted work.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {FOUR_APPROACHES.map((a) => (
              <div key={a.name} style={{ ...tintedCard(a.color), padding: 14 }}>
                <span style={pill(a.color)}>{a.name.toUpperCase()}</span>
                <T color={a.color} bold center size={15} style={{ marginTop: 8 }}>
                  {a.changes}
                </T>
                <T color={a.soft} center size={13} style={{ marginTop: 8 }}>
                  {a.detail}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${a.color}12`,
                    border: `1px solid ${a.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: a.soft,
                    textAlign: "center",
                  }}
                >
                  At inference: {a.runtime}
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            These aren&apos;t competitors. They solve different problems. The next four sub-steps lay out the axes that
            tell them apart.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Does The Data Change?
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Data freshness is the first filter. If the answer depends on facts that move - prices, inventory, the ticket
            the user just filed - those facts cannot live inside the model weights.
          </T>
          <div
            style={{
              marginTop: 16,
              padding: "16px 14px 18px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
            }}
          >
            <T color={SOFT.blue} center size={13}>
              Data freshness axis
            </T>
            <svg
              viewBox="0 0 520 140"
              style={{ width: "100%", maxWidth: 560, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Horizontal axis labeled Never on the left and Daily on the right, with four colored markers placed by
                how often each approach can refresh its data: Fine-Tuning and Prompting on the left, RAG in the
                middle-right, Agent on the far right.
              </desc>
              {/* Axis line */}
              <line x1="40" y1="80" x2="480" y2="80" stroke={C.dim} strokeWidth="2" />
              <polygon points="480,80 470,75 470,85" fill={C.dim} />
              {/* Axis labels */}
              <text x="40" y="105" fill="#80deea" fontSize="12" textAnchor="start">
                Never
              </text>
              <text x="260" y="105" fill="#80deea" fontSize="12" textAnchor="middle">
                Weekly
              </text>
              <text x="480" y="105" fill="#80deea" fontSize="12" textAnchor="end">
                Real-Time
              </text>
              <text x="260" y="128" fill={C.dim} fontSize="12" textAnchor="middle">
                How fresh can the data be?
              </text>
              {/* Markers */}
              {FRESHNESS_AXIS.map((m, i) => {
                const x = 40 + m.pos * 440;
                const y = i % 2 === 0 ? 56 : 22;
                return (
                  <g key={m.name}>
                    <line x1={x} y1="80" x2={x} y2={y + 10} stroke={m.color} strokeWidth="1.5" />
                    <circle cx={x} cy="80" r="6" fill={m.color} />
                    <rect x={x - 50} y={y - 14} width="100" height="20" rx="4" fill={`${m.color}24`} stroke={m.color} />
                    <text x={x} y={y} fill={m.soft} fontSize="11" textAnchor="middle" fontWeight="700">
                      {m.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {FRESHNESS_AXIS.map((m) => (
              <div key={m.name} style={{ ...tintedCard(m.color), padding: 12 }}>
                <T color={m.color} bold center size={14}>
                  {m.name}
                </T>
                <T color={m.soft} center size={13} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {m.freshness}
                </T>
                <T color={m.soft} center size={13} style={{ marginTop: 6 }}>
                  {m.note}
                </T>
              </div>
            ))}
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Rule of thumb: data that moves fast belongs OUTSIDE the model. Prompt and weights are frozen between calls;
            retrieval and tools are not.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Is The Capability Missing?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            The second axis is the capability gap. Ask: does the model already know how to do this, or is the skill
            itself missing? A missing capability needs different medicine than a missing fact.
          </T>
          <div
            style={{
              marginTop: 16,
              padding: "16px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={SOFT.purple} center size={13}>
              Capability gap axis (bottom = base model already does it, top = specialized skill)
            </T>
            <svg
              viewBox="0 0 520 280"
              style={{ width: "100%", maxWidth: 560, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Vertical axis showing how much new capability each approach unlocks. Bottom anchor is Already In Base
                Model, top anchor is Specialized Skill Never Seen. Prompting sits near the bottom; RAG and Agent in the
                middle; Fine-Tuning at the top.
              </desc>
              {/* Axis line */}
              <line x1="260" y1="30" x2="260" y2="250" stroke={C.dim} strokeWidth="2" />
              <polygon points="260,30 255,40 265,40" fill={C.dim} />
              {/* Bottom + top anchors */}
              <text x="260" y="268" fill="#b8a9ff" fontSize="12" textAnchor="middle">
                Base model already does it
              </text>
              <text x="260" y="22" fill="#b8a9ff" fontSize="12" textAnchor="middle">
                Skill never seen in training
              </text>
              {/* Markers - placed alternately left/right */}
              {CAPABILITY_AXIS.map((m, i) => {
                const y = 250 - m.pos * 220;
                const side = i % 2 === 0 ? -1 : 1;
                const labelX = 260 + side * 150;
                return (
                  <g key={m.name}>
                    <line x1="260" y1={y} x2={labelX + side * -50} y2={y} stroke={m.color} strokeWidth="1.5" />
                    <circle cx="260" cy={y} r="7" fill={m.color} />
                    <rect
                      x={labelX - 70}
                      y={y - 12}
                      width="140"
                      height="24"
                      rx="4"
                      fill={`${m.color}24`}
                      stroke={m.color}
                    />
                    <text x={labelX} y={y + 4} fill={m.soft} fontSize="12" textAnchor="middle" fontWeight="700">
                      {m.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            {CAPABILITY_AXIS.map((m) => (
              <div key={m.name} style={{ ...tintedCard(m.color), padding: 12 }}>
                <T color={m.color} bold center size={14}>
                  {m.name}
                </T>
                <T color={m.soft} center size={13} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {m.band}
                </T>
                <T color={m.soft} center size={13} style={{ marginTop: 6 }}>
                  {m.note}
                </T>
              </div>
            ))}
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            RAG fills factual gaps. Agent fills action gaps. Fine-tuning fills skill gaps. Prompting only works when the
            skill is already inside the model and you just need to point at it.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Latency And Cost Budget
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            The third and fourth axes are budgets. A real-time chat reply has a latency budget; a nightly batch job has
            a cost budget. The four approaches land in different quadrants.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {LATENCY_COST_QUADRANTS.map((q) => (
              <div key={q.quadrant} style={{ ...tintedCard(q.color), padding: 14 }}>
                <span style={pill(q.color)}>{q.pick.toUpperCase()}</span>
                <T color={q.color} bold center size={14} style={{ marginTop: 8 }}>
                  {q.quadrant}
                </T>
                <T color={q.soft} center size={13} style={{ marginTop: 6 }}>
                  {q.detail}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.indigo}06`,
              border: `1px solid ${C.indigo}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.indigo,
            }}
          >
            Latency: Prompting ~ Fine-Tune &lt; RAG &lt;&lt; Agent. Cost per call: same order, but Agent loops can
            balloon.
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Budgets break ties. If two approaches both work technically, the one that fits your latency floor and cost
            ceiling wins.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Which One? Walk The Tree
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Combine the axes into one decision tree. Walk it top to bottom. The first Yes is the answer - or the
            starting point if you need to stack.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            {DECISION_TREE_LEAVES.map((leaf, i) => (
              <div
                key={leaf.q}
                style={{
                  ...tintedCard(leaf.color),
                  padding: 14,
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <T color={SOFT.teal} center size={13}>
                  Question {i + 1}
                </T>
                <T color={leaf.color} bold center size={15} style={{ marginTop: 6 }}>
                  {leaf.q}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "monospace",
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: SOFT.teal }}>{leaf.a}</span>
                  <span style={{ color: C.dim }}>{"->"}</span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: `${leaf.color}24`,
                      border: `1px solid ${leaf.color}40`,
                      color: leaf.soft,
                      fontWeight: 700,
                    }}
                  >
                    {leaf.pick}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.teal,
            }}
          >
            Need to take actions via tools? That answer always points at an Agent.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Decision tree, not flowchart. Each leaf is a single technique. If two questions answer Yes, the next
            sub-step shows how to combine them.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Most Production Systems Stack Them
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            A real customer-support assistant rarely uses one technique. The shipping pattern is a stack: each layer
            covers what the layer below cannot.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            {STACK_LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                style={{
                  ...tintedCard(layer.color),
                  padding: 14,
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <T color={SOFT.cyan} center size={12}>
                  Layer {i + 1}
                </T>
                <T color={layer.color} bold center size={15} style={{ marginTop: 4 }}>
                  {layer.name}
                </T>
                <T color={layer.soft} center size={13} style={{ marginTop: 6 }}>
                  {layer.detail}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Stack pattern: fine-tune + RAG + agent loop + prompting combine into one system.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            These aren&apos;t either / or. Production systems pick what fits each axis and combine. Knowing each
            layer&apos;s job is how you debug the stack when something breaks.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Common Misuses
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Four anti-patterns show up over and over. Each one picks the wrong tool for an axis the team didn&apos;t
            think about. Recognizing them early saves weeks.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {ANTI_PATTERNS.map((p) => (
              <div key={p.name} style={{ ...tintedCard(C.red), padding: 14 }}>
                <span style={pill(C.red)}>ANTI-PATTERN</span>
                <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                  {p.name}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: SOFT.red,
                    textAlign: "center",
                  }}
                >
                  Wrong move: {p.bad}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: SOFT.green,
                    textAlign: "center",
                  }}
                >
                  Right fix: {p.fix}
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The pattern under every misuse is the same: someone picked their favorite tool instead of walking the four
            axes. Walk the tree first, then build.
          </T>
        </Box>
      </Reveal>

      {sub < 6 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
