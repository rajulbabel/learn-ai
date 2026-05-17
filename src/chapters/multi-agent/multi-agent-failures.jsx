import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
const FOUR_FAILURE_MODES = [
  {
    name: "Drift",
    color: "teal",
    desc: "Agents Disagree On The Goal.",
  },
  {
    name: "Infinite Loop",
    color: "cyan",
    desc: "Agents Bounce Hand-Offs Forever.",
  },
  {
    name: "Deadlock",
    color: "blue",
    desc: "Agents Wait On Each Other.",
  },
  {
    name: "Cost Runaway",
    color: "red",
    desc: "Unbounded Recursion; Spend Vertical.",
  },
];

const DRIFT_INTERPRETATIONS = [
  { agent: "Agent A", interpretation: "Cancel Subscription Now.", color: "teal" },
  { agent: "Agent B", interpretation: "Refund The Last Invoice.", color: "cyan" },
  { agent: "Agent C", interpretation: "Save The Customer (Anti-Churn).", color: "blue" },
];

const ALERT_THRESHOLDS = [
  {
    failure: "Drift",
    color: "teal",
    signal: "Planner Outputs Disagree On Intent.",
    threshold: "Detected By Comparing Plan Summaries Across Agents.",
  },
  {
    failure: "Infinite Loop",
    color: "cyan",
    signal: "Hand-Off Rate Not Decreasing.",
    threshold: "> 5 Hand-Offs In A Single Turn.",
  },
  {
    failure: "Deadlock",
    color: "blue",
    signal: "Agents In WAITING State.",
    threshold: "> 30 Seconds With No State Change.",
  },
  {
    failure: "Cost Runaway",
    color: "red",
    signal: "Spend Rate Per Turn Climbing.",
    threshold: "> 3x Baseline Cost Per Turn.",
  },
];

export default function MultiAgentFailures(ctx) {
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
            How Multi-Agent Falls Apart
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Four failure modes show up in production multi-agent systems. Each has a distinct
            signature, a distinct signal, and a distinct fix. Knowing them is the difference
            between shipping multi-agent and leaving it in the lab.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two-by-two grid of four multi-agent failure modes: drift in top left, infinite loop
                in top right, deadlock in bottom left, and cost runaway in bottom right, each
                tinted with its own color.
              </desc>
              {FOUR_FAILURE_MODES.map((m, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = 40 + col * 250;
                const y = 20 + row * 90;
                const accent = C[m.color];
                const soft = SOFT[m.color];
                return (
                  <g key={`mode-${i}`}>
                    <rect x={x} y={y} width={230} height={70} rx={10} fill={`${accent}1f`} stroke={accent} strokeWidth={1.8} />
                    <text x={x + 115} y={y + 30} fill={soft} fontSize="15" fontWeight="700" textAnchor="middle">
                      {m.name}
                    </text>
                    <text x={x + 115} y={y + 52} fill={soft} fontSize="12" textAnchor="middle">
                      {m.desc}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Each subsequent sub-step zooms into one failure mode. The final sub-step maps each
            failure to a production alerting threshold.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Drift: Agents Pull In Different Directions
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Drift = different agents in the same run interpret the user&apos;s intent differently.
            They each work hard toward their own version of the goal. The final answer is
            incoherent.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three agents working on the same ticket pulling in three different directions: one
                interprets it as cancel subscription, another as refund invoice, a third as save
                the customer, with diverging arrows showing incoherent outcomes.
              </desc>
              {/* User ticket center */}
              <rect x={210} y={20} width={140} height={36} rx={8} fill={`${C.teal}24`} stroke={C.teal} strokeWidth={2} />
              <text x={280} y={42} fill={SOFT.teal} fontSize="13" fontWeight="700" textAnchor="middle">
                Ticket T4
              </text>

              {/* 3 diverging agents at bottom */}
              {DRIFT_INTERPRETATIONS.map((d, i) => {
                const x = 90 + i * 180;
                const accent = C[d.color];
                const soft = SOFT[d.color];
                return (
                  <g key={`drift-${i}`}>
                    <line x1={280} y1={56} x2={x} y2={120} stroke={accent} strokeWidth={1.6} />
                    <polygon points={`${x - 4},116 ${x + 4},116 ${x},124`} fill={accent} />
                    <rect x={x - 80} y={130} width={160} height={50} rx={8} fill={`${accent}1f`} stroke={accent} strokeWidth={1.6} />
                    <text x={x} y={152} fill={soft} fontSize="12" fontWeight="700" textAnchor="middle">
                      {d.agent}
                    </text>
                    <text x={x} y={170} fill={soft} fontSize="11" textAnchor="middle">
                      {d.interpretation}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Fix drift with a shared "plan summary" output that every agent must read before its
            first reasoning step. If two agents disagree about the goal, the alert fires before
            any tools run.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Hand-Off Ping-Pong
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Infinite loop = hand-off ring spins forever. Triage hands off to billing; billing
            hands off back to triage; triage hands off to billing again. No agent commits to
            handling the ticket. Symptom: hand-off rate per turn does not decrease.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two agents triage and billing hand off to each other back and forth in an infinite
                ping pong with arrows curving in both directions and a counter showing the hand-off
                rate not decreasing.
              </desc>
              <rect x={60} y={50} width={160} height={50} rx={10} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.8} />
              <text x={140} y={80} fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Triage
              </text>

              <rect x={340} y={50} width={160} height={50} rx={10} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.8} />
              <text x={420} y={80} fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Billing
              </text>

              {/* Hand-off arrows looping back */}
              <path d="M 220 60 Q 280 30 340 60" stroke={C.cyan} strokeWidth={1.8} fill="none" />
              <polygon points="336,57 344,57 340,65" fill={C.cyan} />
              <path d="M 340 90 Q 280 120 220 90" stroke={C.cyan} strokeWidth={1.8} fill="none" />
              <polygon points="216,87 224,87 220,95" fill={C.cyan} />

              <text x={280} y={148} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Hand-Off Rate Per Turn: 1, 2, 3, 4, 5, ...
              </text>
              <text x={280} y={166} fill={SOFT.red} fontSize="11" textAnchor="middle">
                NEVER DECREASES = Infinite Loop Detected.
              </text>
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Fix infinite loop with a hand-off counter per turn + a hand-off chain history. If the
            same edge fires twice in a row, halt and escalate to human.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Two Agents Wait Forever
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Deadlock = circular wait. Agent A is waiting on Agent B&apos;s result. Agent B is
            waiting on Agent A&apos;s result. Neither makes progress. Symptom: both agents in
            WAITING state simultaneously for &gt; 30 seconds.
          </T>

          <div style={{ ...tintedCard(C.blue), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 160"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two agents A and B locked in a deadlock: A waits on B's result, B waits on A's
                result, with circular waiting arrows and both agents marked in a WAITING state.
              </desc>
              <rect x={60} y={40} width={160} height={70} rx={10} fill={`${C.blue}1f`} stroke={C.blue} strokeWidth={1.8} />
              <text x={140} y={70} fill={SOFT.blue} fontSize="14" fontWeight="700" textAnchor="middle">
                Agent A
              </text>
              <text x={140} y={88} fill={SOFT.red} fontSize="11" textAnchor="middle">
                WAITING ON B
              </text>
              <text x={140} y={104} fill={SOFT.red} fontSize="10" textAnchor="middle">
                State Unchanged 30s
              </text>

              <rect x={340} y={40} width={160} height={70} rx={10} fill={`${C.blue}1f`} stroke={C.blue} strokeWidth={1.8} />
              <text x={420} y={70} fill={SOFT.blue} fontSize="14" fontWeight="700" textAnchor="middle">
                Agent B
              </text>
              <text x={420} y={88} fill={SOFT.red} fontSize="11" textAnchor="middle">
                WAITING ON A
              </text>
              <text x={420} y={104} fill={SOFT.red} fontSize="10" textAnchor="middle">
                State Unchanged 30s
              </text>

              {/* Circular wait arrows */}
              <path d="M 220 65 Q 280 35 340 65" stroke={C.red} strokeWidth={1.8} fill="none" />
              <polygon points="336,62 344,62 340,70" fill={C.red} />
              <path d="M 340 85 Q 280 115 220 85" stroke={C.red} strokeWidth={1.8} fill="none" />
              <polygon points="216,82 224,82 220,90" fill={C.red} />

              <text x={280} y={144} fill={SOFT.blue} fontSize="11" fontWeight="700" textAnchor="middle">
                Signal: Both Agents In WAITING State Simultaneously For &gt; 30 Seconds.
              </text>
            </svg>
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Fix deadlock with timeouts on every inter-agent wait. If A doesn&apos;t hear from B
            within N seconds, A surfaces "timeout waiting on B" and the runtime breaks the cycle.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Unbounded Recursion: Cost Goes Vertical
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Cost runaway = a parent agent spawns sub-agents; each sub-agent spawns more; cost grows
            exponentially. By iteration 20, a normal $0.50 run is $50. The signal is brutal: spend
            rate climbing per turn without a corresponding answer-quality gain.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Cost vs iteration chart with normal multi-agent run at fifty cents on a slow flat
                curve and a runaway scenario climbing exponentially to fifty dollars by iteration
                twenty.
              </desc>
              {/* X axis */}
              <line x1={40} y1={170} x2={520} y2={170} stroke={SOFT.indigo} strokeWidth={1.4} />
              {/* Y axis */}
              <line x1={40} y1={20} x2={40} y2={170} stroke={SOFT.indigo} strokeWidth={1.4} />
              <text x={20} y={170} fill={SOFT.indigo} fontSize="10" textAnchor="end">
                $0
              </text>
              <text x={20} y={100} fill={SOFT.indigo} fontSize="10" textAnchor="end">
                $5
              </text>
              <text x={20} y={30} fill={SOFT.indigo} fontSize="10" textAnchor="end">
                $50
              </text>
              <text x={40} y={188} fill={SOFT.indigo} fontSize="10" textAnchor="middle">
                Iter 0
              </text>
              <text x={520} y={188} fill={SOFT.indigo} fontSize="10" textAnchor="middle">
                Iter 20
              </text>

              {/* Normal curve - slow flat - mostly horizontal */}
              <path d="M 40 165 Q 200 162 520 158" stroke={C.green} strokeWidth={2.2} fill="none" />
              <text x={460} y={150} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Normal $0.50
              </text>

              {/* Runaway curve - exponential */}
              <path d="M 40 165 Q 350 160 460 100 Q 500 50 520 25" stroke={C.red} strokeWidth={2.2} fill="none" />
              <text x={460} y={70} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Runaway -&gt; $50
              </text>
            </svg>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Fix cost runaway with a recursion depth cap, a per-turn spend cap, and a circuit
            breaker that halts when either is hit. If the agent decides to spawn 12 sub-agents,
            something is wrong with the planner prompt.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            What To Alert On
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Each failure mode has a production signal. Each signal has a threshold. Each threshold
            crossing should page a human. This table is the entire reason multi-agent ships safely
            or doesn&apos;t.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {ALERT_THRESHOLDS.map((a) => {
              const accent = C[a.color];
              const soft = SOFT[a.color];
              return (
                <div key={a.failure} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{a.failure.toUpperCase()}</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    Signal: {a.signal}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    Alert Threshold: {a.threshold}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Every multi-agent system in production must monitor all four. Skipping any one is a
            bet that the corresponding failure mode will never bite - and it always eventually
            does. Alert thresholds are the price of multi-agent.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
