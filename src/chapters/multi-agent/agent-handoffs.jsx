import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
const HANDOFF_SHAPE = `Agent {
  name: "triage",
  instructions:
    "Classify intent. Hand off to billing
     for refund/invoice, troubleshooting
     for errors.",
  handoffs: [billing_agent, troubleshooting_agent]
}`;

const HANDOFF_PACKAGE = [
  { piece: "Full Conversation History", note: "All Turns Since Session Start." },
  { piece: "Working Memory Snapshot", note: "Current scratchpad state at hand-off time." },
  { piece: "Hand-Off Reason", note: "Why The Sender Decided To Hand Off (e.g. 'Classified As Billing')." },
];

const T4_HANDOFF_TRACE = [
  {
    step: 1,
    actor: "Triage Agent",
    color: "teal",
    detail: 'Receives T4 ("Cancel Subscription + Refund Last Invoice").',
  },
  {
    step: 2,
    actor: "Triage Agent",
    color: "teal",
    detail: "Classifies As Billing. Returns Hand-Off To billing_agent. Loop Switches.",
  },
  {
    step: 3,
    actor: "Billing Agent",
    color: "cyan",
    detail: "Receives Full Conversation History. Processes Cancel.",
  },
  {
    step: 4,
    actor: "Billing Agent",
    color: "cyan",
    detail: "Refund > $200; business_rule Error. Returns Hand-Off To escalation_agent.",
  },
  {
    step: 5,
    actor: "Escalation Agent",
    color: "blue",
    detail: "Receives Full Trace. Calls escalate_human With Cancel-And-Refund Context.",
  },
];

export default function AgentHandoffs(ctx) {
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
            Return The Next Agent
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            The Swarm pattern (now in the OpenAI Agents SDK): instead of an orchestrator routing sub-tasks, an agent
            finishes its part and RETURNS the next agent. The runtime then switches control directly. No central
            coordinator.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <span style={pill(C.purple)}>DELEGATION</span>
              <T color={C.purple} bold center size={15} style={{ marginTop: 10 }}>
                Orchestrator-Worker Style
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 8 }}>
                Orchestrator Picks Who Handles Next, Waits For Result, Picks Again. Central Control.
              </T>
            </div>

            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>HAND-OFF</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 10 }}>
                Swarm Style
              </T>
              <T color={SOFT.green} center size={13} style={{ marginTop: 8 }}>
                Agent A Returns &quot;next = agent B&quot;. Loop Switches Control Directly. No Central Coordinator.
              </T>
            </div>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            Hand-off is decentralized; orchestration is centralized. Both ship to production - the pick depends on
            whether you want a single "brain" or peer-to-peer routing.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Agents As Routes
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            In the Swarm pattern, each agent declares which other agents it can hand off to. The handoffs field is a
            list - similar to routes in a web framework.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <T color={C.teal} bold center size={14}>
              Agent Hand-Off (Shape)
            </T>
            <div
              style={{
                marginTop: 10,
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.teal,
                fontSize: 14,
                lineHeight: 1.5,
                background: `${C.teal}06`,
                border: `1px solid ${C.teal}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {HANDOFF_SHAPE}
            </div>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            `name` and `instructions` are this agent&apos;s own identity. `handoffs` is the set of other agents this
            agent can transfer control to - basically a small DAG of allowed transitions.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            What Travels With The Hand-Off
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            When agent A hands off to agent B, B does not start fresh. It receives a hand-off package with everything it
            needs to pick up cleanly.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {HANDOFF_PACKAGE.map((p) => (
              <div key={p.piece} style={{ ...tintedCard(C.cyan), padding: 12 }}>
                <span style={pill(C.cyan)}>PACKAGE PART</span>
                <T color={C.cyan} bold center size={14} style={{ marginTop: 8 }}>
                  {p.piece}
                </T>
                <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                  {p.note}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            The receiving agent reads the entire package before its first reasoning step. No "re-litigation from
            scratch". The conversation history plus working memory plus reason is the contract.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Trace: T4 With Triage And Billing Hand-Off
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Ticket T4 = "Cancel my subscription + refund last invoice." Watch the hand-off ring move control across
            three agents.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {T4_HANDOFF_TRACE.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`t4-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            Three agents, three hand-offs, one ticket. Each agent did its specialty. Hand-off package carried full
            context so the escalation_agent did not need to ask "what happened before".
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Ring When All Agents Are Peers
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Hand-off topology is a ring (or general graph) - any agent can transfer to any other, subject to the
            handoffs list. Different from tree topology, which has fixed parent- child relationships.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 220" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Hand-off ring topology with four agents arranged in a circle, each connected by bidirectional arrows to
                its neighbors and one diagonal cross-edge, showing peer-to- peer transfer with no central parent.
              </desc>
              {/* 4 peer agents in a ring */}
              {[
                { x: 280, y: 35, label: "Triage" },
                { x: 460, y: 110, label: "Billing" },
                { x: 280, y: 185, label: "Escalation" },
                { x: 100, y: 110, label: "Troubleshooting" },
              ].map((a, i) => (
                <g key={`peer-${i}`}>
                  <rect
                    x={a.x - 50}
                    y={a.y - 18}
                    width={100}
                    height={36}
                    rx={8}
                    fill={`${C.indigo}1f`}
                    stroke={C.indigo}
                    strokeWidth={1.8}
                  />
                  <text x={a.x} y={a.y + 5} fill={SOFT.indigo} fontSize="12" fontWeight="700" textAnchor="middle">
                    {a.label}
                  </text>
                </g>
              ))}
              {/* Ring edges - bidirectional hand-off arrows between neighboring corners.
                  Each endpoint already sits on a box corner; we add an arrowhead at BOTH
                  ends (tip on the corner) and run the shaft between the two arrowhead bases. */}
              {[
                [330, 53, 410, 92], // Triage -> Billing
                [410, 128, 330, 167], // Billing -> Escalation
                [230, 167, 150, 128], // Escalation -> Troubleshooting
                [150, 92, 230, 53], // Troubleshooting -> Triage
              ].map(([x1, y1, x2, y2], i) => {
                const dx = x2 - x1,
                  dy = y2 - y1;
                const len = Math.hypot(dx, dy);
                const ux = dx / len,
                  uy = dy / len;
                const px = -uy,
                  py = ux;
                const head = 10,
                  halfW = 4.5;
                // Arrowhead at end 2 (tip = x2,y2), base toward end 1.
                const b2x = x2 - ux * head,
                  b2y = y2 - uy * head;
                // Arrowhead at end 1 (tip = x1,y1), base toward end 2.
                const b1x = x1 + ux * head,
                  b1y = y1 + uy * head;
                return (
                  <g key={`ring-${i}`}>
                    <line x1={b1x} y1={b1y} x2={b2x} y2={b2y} stroke={C.indigo} strokeWidth={1.6} />
                    <polygon
                      points={`${(b2x + px * halfW).toFixed(1)},${(b2y + py * halfW).toFixed(1)} ${(b2x - px * halfW).toFixed(1)},${(b2y - py * halfW).toFixed(1)} ${x2},${y2}`}
                      fill={C.indigo}
                    />
                    <polygon
                      points={`${(b1x + px * halfW).toFixed(1)},${(b1y + py * halfW).toFixed(1)} ${(b1x - px * halfW).toFixed(1)},${(b1y - py * halfW).toFixed(1)} ${x1},${y1}`}
                      fill={C.indigo}
                    />
                  </g>
                );
              })}
              {/* Cross-edge: a secondary dashed transfer line between Triage and Troubleshooting. */}
              <line
                x1={330}
                y1={45}
                x2={150}
                y2={116}
                stroke={`${C.indigo}80`}
                strokeWidth={1.2}
                strokeDasharray="4,4"
              />
            </svg>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Tree topology fits when domains are nested (billing has refund/invoice as sub-areas). Ring topology fits
            when domains are equal peers (triage, billing, troubleshooting, escalation are at the same level, no
            nesting).
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
