import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Four stop conditions for sub=0 (2x2 grid).
const STOP_CONDITIONS = [
  {
    name: "Success",
    color: "green",
    desc: "Model Emits Final Answer.",
  },
  {
    name: "Max-Iters",
    color: "yellow",
    desc: "Hit The Cap (E.g., 10).",
  },
  {
    name: "Budget",
    color: "orange",
    desc: "Token / Cost Exhausted.",
  },
  {
    name: "Explicit Stop",
    color: "red",
    desc: "Tool Returns A 'Halt' Signal, Or User Cancels.",
  },
];

// Budget bar stops for sub=3.
const BUDGET_STOPS = [
  { pct: 30, label: "Iter 1-2 Consumed $0.15", color: "amber" },
  { pct: 60, label: "Iter 3-4 Consumed $0.30", color: "amber" },
  { pct: 100, label: "Budget Exhausted - STOP At $0.50", color: "red" },
];

// Escalation flow steps for sub=5.
const ESCALATION_STEPS = [
  {
    label: "Loop Terminates",
    note: "Any Non-Success Stop (Max-Iters / Budget / Halt).",
    color: "red",
  },
  {
    label: "Agent Emits Final Message To User",
    note: "\"I Wasn't Able To Fully Resolve This. A Human Agent Will Follow Up.\"",
    color: "amber",
  },
  {
    label: "Call escalate_human With Partial Transcript",
    note: "Hands Off The Full Chain Of Reasoning So The Human Can Resume.",
    color: "cyan",
  },
];

export default function LoopTermination(ctx) {
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
            Four Ways A Loop Ends
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            An agent loop is a process that must stop. There are exactly four reasons it does. Three
            of them are non-success: the loop ran out of room, ran out of money, or was told to
            halt. Knowing which one fired tells you what to do next.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {STOP_CONDITIONS.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={s.name} style={{ ...tintedCard(accent), padding: 14 }}>
                  <span style={pill(accent)}>{s.name.toUpperCase()}</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 10 }}>
                    {s.name}
                  </T>
                  <T color={soft} center size={14} style={{ marginTop: 8 }}>
                    {s.desc}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            One of these four conditions fires on every agent run. Every production agent must
            detect each one and respond differently. The remaining sub-steps walk through detection
            and the fail-safe pattern.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Success: The Model Stops Calling Tools
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The happy path is also the subtlest. The model never says "I'm done" out loud. It just
            stops asking for tools. The runtime watches the most recent response and detects the
            absence of any tool_use block.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ ...tintedCard(C.yellow), padding: 14 }}>
              <span style={pill(C.yellow)}>ITERATION N-1</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 8 }}>
                Iteration N-1: Model Emits tool_use + Text
              </T>
              <T color={SOFT.yellow} center size={14} style={{ marginTop: 6 }}>
                Still Working. Runtime Runs The Tool, Feeds The Result Back, Loops Again.
              </T>
            </div>

            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>ITERATION N</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                Iteration N: Model Emits ONLY Text (No tool_use). That&apos;s Success - The Model
                Decided No More Tools Needed.
              </T>
              <T color={SOFT.green} center size={14} style={{ marginTop: 6 }}>
                Stop Reason From The API Is &quot;end_turn&quot; Instead Of &quot;tool_use&quot;.
              </T>
            </div>
          </div>

          <div style={{ ...tintedCard(C.green), padding: 12, marginTop: 12 }}>
            <T color={SOFT.green} center size={14}>
              The Final Text Is The Answer To The User.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            This is the only stop condition that does not require an escalation message. Everything
            else is partial completion and the user needs to be told what happened.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Hard Cap: 10-20 Iterations
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            The max iter cap (also called max-iters) is the dumbest safety net but also the most
            important. A counter ticks up every loop pass. When it hits the cap, the runtime
            force-terminates the loop without asking the model.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 140"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Horizontal counter from one to ten showing iteration count with the tenth iteration
                highlighted as the forced termination point.
              </desc>

              {/* 10 cells width 40, gap 12. Total = 10*40 + 9*12 = 508. Pad = (560-508)/2 = 26 */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                const x = 26 + i * (40 + 12);
                const isLast = i === 9;
                const accent = isLast ? C.red : C.yellow;
                const soft = isLast ? SOFT.red : SOFT.yellow;
                return (
                  <g key={`iter-${i}`}>
                    <rect
                      x={x}
                      y={40}
                      width={40}
                      height={40}
                      rx={6}
                      fill={isLast ? `${C.red}38` : `${C.yellow}22`}
                      stroke={accent}
                      strokeWidth={isLast ? 2.5 : 1.4}
                    />
                    <text
                      x={x + 20}
                      y={64}
                      fill={soft}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {i + 1}
                    </text>
                    {isLast && (
                      <>
                        {/* STOP badge above */}
                        <rect
                          x={x - 4}
                          y={14}
                          width={48}
                          height={18}
                          rx={4}
                          fill={C.red}
                          stroke={C.red}
                          strokeWidth="1"
                        />
                        <text
                          x={x + 20}
                          y={27}
                          fill="#08080d"
                          fontSize="11"
                          fontWeight="800"
                          textAnchor="middle"
                        >
                          STOP
                        </text>
                        {/* Bold X mark over the cell */}
                        <line
                          x1={x + 8}
                          y1={48}
                          x2={x + 32}
                          y2={72}
                          stroke={C.red}
                          strokeWidth="2.5"
                        />
                        <line
                          x1={x + 32}
                          y1={48}
                          x2={x + 8}
                          y2={72}
                          stroke={C.red}
                          strokeWidth="2.5"
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Arrows between cells */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                const x1 = 26 + i * (40 + 12) + 40;
                const x2 = 26 + (i + 1) * (40 + 12);
                return (
                  <line
                    key={`arr-${i}`}
                    x1={x1}
                    y1={60}
                    x2={x2}
                    y2={60}
                    stroke={`${SOFT.yellow}99`}
                    strokeWidth="1.4"
                  />
                );
              })}

              <text
                x={280}
                y={108}
                fill={SOFT.red}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Iteration Counter - Force-Terminate At Iter 10
              </text>
            </svg>
          </div>

          <div style={{ ...tintedCard(C.red), padding: 12, marginTop: 12 }}>
            <span style={pill(C.red)}>PRODUCTION RULE</span>
            <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
              Production Rule: 10-20 Typical Max-Iter Cap. Higher = Pay-To-Think; Lower = Miss
              Answers.
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            The cap protects against runaway loops where the model can&apos;t make progress and
            keeps re-trying the same tool. Without a cap a single buggy ticket can bill thousands of
            dollars in an hour.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Token / Cost Budget
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Iteration count is a proxy for cost; the real number is dollars. A budget cap measures
            the total tokens (or dollars) spent across all iterations and stops the loop when the
            wallet is empty. Sample budget: $0.50 per agent run.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Horizontal budget bar filling from zero to one hundred percent with markers at
                thirty sixty and one hundred percent showing iteration cost consumption stopping at
                budget exhaustion.
              </desc>

              {/* Budget bar: width 440, x_start = (560-440)/2 = 60. height 28 at y=60 */}
              <rect
                x={60}
                y={60}
                width={440}
                height={28}
                rx={6}
                fill={`${C.amber}14`}
                stroke={C.amber}
                strokeWidth="1.5"
              />

              {/* Filled portion all the way to 100% (showing exhausted state) */}
              <rect
                x={60}
                y={60}
                width={440}
                height={28}
                rx={6}
                fill={`${C.red}40`}
                stroke="none"
              />

              {/* Gradient-ish fill: green 0-30, amber 30-60, red 60-100 */}
              <rect x={60} y={60} width={132} height={28} fill={`${C.green}30`} />
              <rect x={192} y={60} width={132} height={28} fill={`${C.amber}30`} />
              <rect x={324} y={60} width={176} height={28} fill={`${C.red}40`} />

              {/* Bar outline on top */}
              <rect
                x={60}
                y={60}
                width={440}
                height={28}
                rx={6}
                fill="none"
                stroke={C.amber}
                strokeWidth="1.5"
              />

              {/* Stop markers at 30%, 60%, 100% */}
              {[
                { pct: 30, x: 60 + 0.3 * 440, label: "Iter 1-2 Consumed $0.15", color: "amber" },
                { pct: 60, x: 60 + 0.6 * 440, label: "Iter 3-4 Consumed $0.30", color: "amber" },
                {
                  pct: 100,
                  x: 60 + 1.0 * 440,
                  label: "Budget Exhausted - STOP At $0.50",
                  color: "red",
                },
              ].map((m, i) => {
                const accent = C[m.color];
                const soft = SOFT[m.color];
                return (
                  <g key={`mark-${i}`}>
                    <line
                      x1={m.x}
                      y1={56}
                      x2={m.x}
                      y2={94}
                      stroke={accent}
                      strokeWidth="2"
                    />
                    <circle cx={m.x} cy={74} r={5} fill={accent} stroke={C.bg} strokeWidth="1.5" />
                    <text
                      x={m.x}
                      y={46}
                      fill={accent}
                      fontSize="11"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {m.pct}%
                    </text>
                    <text
                      x={m.x}
                      y={114}
                      fill={soft}
                      fontSize="11"
                      fontWeight="600"
                      textAnchor={i === 2 ? "end" : "middle"}
                    >
                      {m.label}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis label */}
              <text
                x={60}
                y={46}
                fill={SOFT.amber}
                fontSize="11"
                fontWeight="700"
                textAnchor="start"
              >
                $0
              </text>
              <text
                x={500}
                y={46}
                fill={SOFT.red}
                fontSize="11"
                fontWeight="700"
                textAnchor="end"
              >
                $0.50
              </text>

              <text
                x={280}
                y={148}
                fill={SOFT.amber}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Budget Bar - Loop Terminates When Bar Hits 100%
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {BUDGET_STOPS.map((b) => {
              const accent = C[b.color];
              const soft = SOFT[b.color];
              return (
                <div
                  key={b.pct}
                  style={{
                    ...tintedCard(accent),
                    padding: "10px 12px",
                    display: "grid",
                    gridTemplateColumns: "70px 1fr",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <T color={accent} bold center size={14}>
                    {b.pct}%
                  </T>
                  <T color={soft} center size={14}>
                    {b.label}
                  </T>
                </div>
              );
            })}
          </div>

          <div style={{ ...tintedCard(C.red), padding: 12, marginTop: 12 }}>
            <T color={SOFT.red} center size={14}>
              Budget Is The SAFER Cap Than Iterations - Real Cost Can Vary 10x Per Iteration.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            One iteration that triggers a thinking burst can spend 10k tokens; the next might spend
            500. Iteration count doesn&apos;t see that. A dollar budget does.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Tools Can Say Stop
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Some tools are terminal by design. An escalate_human tool, for example, hands the
            conversation to a human and there is nothing left for the agent to do. The tool result
            includes a halt flag, and the runtime respects it.
          </T>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 16,
              marginTop: 14,
              textAlign: "left",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              Tool Result (Shape) - Halt Signal
            </T>
            <div
              style={{
                marginTop: 10,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                borderRadius: 8,
                padding: "12px 16px",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 14,
                color: SOFT.cyan,
                lineHeight: 1.7,
                whiteSpace: "pre",
              }}
            >
              {`{
  "tool": "escalate_human",
  "result": { "ticket_id": "T4", "human_assigned": true },
  "halt": true
}`}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ ...tintedCard(C.cyan), padding: 12 }}>
              <T color={SOFT.cyan} center size={14}>
                The Loop Respects This Signal And Terminates Cleanly.
              </T>
            </div>
            <div style={{ ...tintedCard(C.purple), padding: 12 }}>
              <T color={SOFT.purple} center size={14}>
                Similar Pattern: A User Cancellation Injects A Halt Event.
              </T>
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Explicit stops are the cleanest non-success case. The model doesn&apos;t get confused,
            the runtime doesn&apos;t guess, and there is a clear handoff record in the transcript.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When The Loop Gives Up, Escalate
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Any non-success termination (max-iters, budget, or explicit halt that wasn&apos;t a
            successful resolution) must trigger the same fail-safe pattern. The user gets a clear
            message, and a human gets the transcript to pick up where the agent stopped.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 280"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Fail-safe escalation flow from any non-success termination to user message and
                escalate_human call with partial transcript.
              </desc>

              {/* 3 stacked boxes, width 400, x_start = (560-400)/2 = 80 */}
              {ESCALATION_STEPS.map((step, i) => {
                const accent = C[step.color];
                const soft = SOFT[step.color];
                const y = 20 + i * 80;
                return (
                  <g key={`esc-${i}`}>
                    <rect
                      x={80}
                      y={y}
                      width={400}
                      height={60}
                      rx={8}
                      fill={`${accent}1f`}
                      stroke={accent}
                      strokeWidth="1.8"
                    />
                    {/* Step number badge */}
                    <circle cx={108} cy={y + 30} r={14} fill={accent} />
                    <text
                      x={108}
                      y={y + 35}
                      fill="#08080d"
                      fontSize="13"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {i + 1}
                    </text>
                    <text
                      x={280}
                      y={y + 24}
                      fill={accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {step.label}
                    </text>
                    <text
                      x={280}
                      y={y + 46}
                      fill={soft}
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {step.note}
                    </text>
                    {/* Down arrow connecting to next step */}
                    {i < ESCALATION_STEPS.length - 1 && (
                      <>
                        <line
                          x1={280}
                          y1={y + 60}
                          x2={280}
                          y2={y + 76}
                          stroke={SOFT.orange}
                          strokeWidth="1.6"
                        />
                        <polygon
                          points={`280,${y + 80} 276,${y + 74} 284,${y + 74}`}
                          fill={SOFT.orange}
                        />
                      </>
                    )}
                  </g>
                );
              })}

              <text
                x={280}
                y={268}
                fill={SOFT.orange}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Fail-Safe Pattern - Triggered By ANY Non-Success Termination
              </text>
            </svg>
          </div>

          <div
            style={{
              ...tintedCard(C.red),
              padding: 16,
              marginTop: 14,
              border: `2px solid ${C.red}`,
            }}
          >
            <span style={pill(C.red)}>PRODUCTION RULE</span>
            <T color={C.red} bold center size={20} style={{ marginTop: 10 }}>
              No Silent Failures.
            </T>
            <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
              Every non-success termination produces a user-visible message AND an escalate_human
              call with the full partial transcript. Silent failures are how agent bugs hide in
              production for weeks.
            </T>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            The transcript is the load-bearing artifact: it carries the agent&apos;s reasoning,
            every tool call, every result, so the human picking up the ticket has full context. No
            re-litigating from scratch.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
