import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Three eval set decks (sub=0 of 28.5)
const EVAL_SET_DECKS = [
  {
    name: "Golden",
    count: 50,
    color: "yellow",
    detail: "Typical, Well-Defined Tickets. Reset Password, Refund, Cancel, Status Lookup.",
    use: "Regression Tests Run Before Every Deploy.",
  },
  {
    name: "Adversarial",
    count: 20,
    color: "red",
    detail: "Edge Cases, Ambiguous Wording, Multi-Intent, Prompt-Injection Attempts.",
    use: "Catches Failure Modes That Golden Misses.",
  },
  {
    name: "Regression",
    count: 10,
    color: "purple",
    detail: "Past Production Bugs. One Case Per Confirmed Incident.",
    use: "Grows Permanently. Each New Bug Adds A New Case Here.",
  },
];

export default function EvalSetsContinuous(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Golden + Adversarial + Regression
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            An eval set is the static portfolio of test cases you grade your agent against. The production composition
            uses three decks. Each catches a different class of failure. Skip any one and your dashboard has a blind
            spot.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {EVAL_SET_DECKS.map((d) => {
              const accent = C[d.color];
              const soft = SOFT[d.color];
              return (
                <div key={d.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`${d.count} CASES`}</span>
                  <T color={accent} bold center size={17} style={{ marginTop: 8 }}>
                    {d.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 10 }}>
                    {d.detail}
                  </T>
                  <T color={soft} bold center size={12} style={{ marginTop: 10 }}>
                    Use
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    {d.use}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={14} style={{ marginTop: 14 }}>
            Total eval set: 80 cases. Small enough to run cheaply on every deploy; large enough to capture distribution
            + adversarial + regression. Most production teams start with this size and grow gradually.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Eval Set Goes Stale
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            An eval set frozen at month 0 looks great. By month 3 real traffic has shifted: new product features, new
            customer segments, new attack patterns. Eval pass rate no longer predicts production success. Refresh 10-20%
            of cases per quarter from recent production traces.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 220" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Freshness timeline showing eval set score holding steady near 0.9 at month zero while real production
                distribution drifts away over time, causing the gap between eval-set predicted quality and actual
                production quality to widen by month three.
              </desc>
              {/* Timeline axis */}
              <line x1={50} y1={170} x2={510} y2={170} stroke={SOFT.orange} strokeWidth={1.5} />
              {/* Month ticks */}
              {[0, 1, 2, 3, 4, 5, 6].map((m) => (
                <Fragment key={`m-${m}`}>
                  <line x1={50 + m * 75} y1={166} x2={50 + m * 75} y2={174} stroke={SOFT.orange} strokeWidth={1} />
                  <text x={50 + m * 75} y={190} fill={SOFT.orange} fontSize="11" textAnchor="middle">
                    Month {m}
                  </text>
                </Fragment>
              ))}
              {/* Eval set score line (flat at top, illustrating the score on a frozen set) */}
              <path
                d="M 50 60 L 125 62 L 200 60 L 275 63 L 350 61 L 425 60 L 500 62"
                stroke={C.cyan}
                strokeWidth={2.5}
                fill="none"
              />
              <text x={500} y={50} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="end">
                Eval Set Score (Frozen)
              </text>
              {/* Actual production quality drifting down */}
              <path
                d="M 50 60 L 125 70 L 200 90 L 275 110 L 350 130 L 425 145 L 500 155"
                stroke={C.red}
                strokeWidth={2.5}
                fill="none"
                strokeDasharray="4 3"
              />
              <text x={500} y={165} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="end">
                Real Production Quality
              </text>
              {/* Gap indicator at month 3 */}
              <line x1={275} y1={63} x2={275} y2={110} stroke={C.amber} strokeWidth={2} />
              <text x={290} y={90} fill={SOFT.amber} fontSize="12" fontWeight="700" textAnchor="start">
                Gap = Distribution Shift
              </text>
            </svg>
          </div>

          <T color={SOFT.orange} center size={14} style={{ marginTop: 12 }}>
            Mitigation: every quarter, replace 10-20% of golden cases with recent production traces (anonymized).
            Adversarial set grows separately as new attack patterns surface. Regression set only grows.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Grade A Slice Of Production
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Offline eval covers known cases. Online eval samples live production traffic, grades it asynchronously with
            LLM-as-Judge, and writes the result back to the trace store for the dashboard. Sampling rate is a cost /
            detection tradeoff.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 760 200" style={{ width: "100%", maxWidth: 760, display: "block", margin: "0 auto" }}>
              <desc>
                Online sampling flow showing production traffic being sampled at a one to five percent rate into an
                async LLM-as-Judge grading stage, with results stored back to the trace store and rendered on the eval
                quality dashboard.
              </desc>
              {/* Stations - boxes 124 wide with 28 unit arrow gaps, centered in
                  the 760 viewBox so titles like "Production Traffic" fit. */}
              {[
                { label: "Production Traffic", sub: "100% Of Tickets" },
                { label: "Sampler", sub: "1-5% Selection" },
                { label: "Async Judge", sub: "LLM-As-Judge" },
                { label: "Trace Store", sub: "Results + Scores" },
                { label: "Dashboard", sub: "Drift Signal" },
              ].map((s, i) => {
                const boxW = 124;
                const arrowGap = 28;
                const x = 14 + i * (boxW + arrowGap);
                return (
                  <g key={`stn-${i}`}>
                    <rect
                      x={x}
                      y={60}
                      width={boxW}
                      height={70}
                      rx={8}
                      fill={`${C.yellow}22`}
                      stroke={C.yellow}
                      strokeWidth={1.6}
                    />
                    <text x={x + boxW / 2} y={88} fill={SOFT.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                      {s.label}
                    </text>
                    <text x={x + boxW / 2} y={108} fill={SOFT.yellow} fontSize="11" textAnchor="middle">
                      {s.sub}
                    </text>
                    {i < 4 && (
                      <path
                        d={`M ${x + boxW} 95 L ${x + boxW + arrowGap} 95`}
                        stroke={SOFT.yellow}
                        strokeWidth={2}
                        markerEnd="url(#flowArrow)"
                        fill="none"
                      />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker
                  id="flowArrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={SOFT.yellow} />
                </marker>
              </defs>
              <text x={380} y={170} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                1% Sample = Cheap But Slow. 5% Sample = Catches Issues In Hours But 5x Cost.
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={14} style={{ marginTop: 12 }}>
            Pick 1-5% as the default. Bump to 25% for the first week after a deploy; drop back once dashboard is stable.
            Async grading means production latency is unchanged - the judge runs after the user already got their
            answer.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Trigger When Quality Drops
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Online sampling produces a time series of composite scores. A drift detector watches the 7-day moving
            average against a baseline. Alert if the moving average drops more than 0.05 from the baseline. Page the
            engineer, freeze the deploy, investigate.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 240" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Time series of composite trace scores plotted over fourteen days, hovering around 0.85 until day ten
                where the moving average drops to 0.78, crossing the 0.05 drift threshold below the 0.85 baseline and
                firing an alert that engineers must investigate.
              </desc>
              {/* Axes */}
              <line x1={50} y1={180} x2={510} y2={180} stroke={SOFT.amber} strokeWidth={1.5} />
              <line x1={50} y1={40} x2={50} y2={180} stroke={SOFT.amber} strokeWidth={1.5} />
              {/* Y axis label */}
              <text x={20} y={110} fill={SOFT.amber} fontSize="11" textAnchor="middle" transform="rotate(-90 20 110)">
                Composite Score
              </text>
              {/* Y ticks */}
              {[
                { v: 0.7, y: 180 },
                { v: 0.8, y: 130 },
                { v: 0.85, y: 105 },
                { v: 0.9, y: 80 },
                { v: 1.0, y: 30 },
              ].map((t) => (
                <Fragment key={`yt-${t.v}`}>
                  <line x1={46} y1={t.y} x2={50} y2={t.y} stroke={SOFT.amber} />
                  <text x={42} y={t.y + 4} fill={SOFT.amber} fontSize="10" textAnchor="end">
                    {t.v.toFixed(2)}
                  </text>
                </Fragment>
              ))}
              {/* Baseline line at 0.85 */}
              <line x1={50} y1={105} x2={510} y2={105} stroke={C.green} strokeWidth={1.8} strokeDasharray="6 3" />
              <text x={500} y={100} fill={SOFT.green} fontSize="11" fontWeight="700" textAnchor="end">
                Baseline = 0.85
              </text>
              {/* Drift threshold at 0.80 (baseline - 0.05) */}
              <line x1={50} y1={130} x2={510} y2={130} stroke={C.red} strokeWidth={1.8} strokeDasharray="3 3" />
              <text x={500} y={125} fill={SOFT.red} fontSize="11" fontWeight="700" textAnchor="end">
                Alert Floor = 0.80
              </text>
              {/* Time series path: hovers near 0.85 until day 10, then drops */}
              <path
                d="M 65 110 L 95 102 L 125 108 L 155 100 L 185 106 L 215 103 L 245 108 L 275 105 L 305 110 L 335 108 L 365 120 L 395 130 L 425 138 L 455 140 L 485 140"
                stroke={C.amber}
                strokeWidth={2.5}
                fill="none"
              />
              {/* Day labels */}
              {[1, 4, 7, 10, 13].map((d) => (
                <text key={`d-${d}`} x={50 + d * 30} y={200} fill={SOFT.amber} fontSize="11" textAnchor="middle">
                  Day {d}
                </text>
              ))}
              {/* Alert marker */}
              <circle cx={395} cy={130} r={6} fill={C.red} stroke={SOFT.red} strokeWidth={2} />
              <text x={395} y={222} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">
                Day 10: Drift Alert Fires
              </text>
            </svg>
          </div>

          <T color={SOFT.amber} center size={14} style={{ marginTop: 12 }}>
            Real incident shape: an LLM provider rolled a silent model update overnight; the composite score drifted
            0.07 from baseline; alert fired the next morning; engineers switched to the pinned-version endpoint within 4
            hours. Without continuous eval the drop is invisible for weeks.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Build The Eval Set Before The Agent
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            The closing principle. The eval set is not an afterthought; it is the production-readiness gate. Production
            teams that skip eval ship more agents and watch more of them fail.
          </T>

          <div
            style={{
              ...tintedCard(C.purple),
              padding: 18,
              marginTop: 14,
            }}
          >
            <span style={pill(C.purple)}>SECTION 13 CLOSER</span>
            <T color={C.purple} bold center size={18} style={{ marginTop: 10 }}>
              The Principle
            </T>
            <T color={SOFT.purple} center size={16} style={{ marginTop: 12, fontStyle: "italic" }}>
              &quot;If you cannot write 20 test cases your agent must pass, you do not know what your agent is supposed
              to do. Build the eval set FIRST. Build the agent SECOND.&quot;
            </T>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div style={{ ...tintedCard(C.red), padding: 12 }}>
                <T color={C.red} bold center size={14}>
                  Anti-Pattern
                </T>
                <T color={SOFT.red} center size={13} style={{ marginTop: 6 }}>
                  Ship Agent. See What Breaks In Production. Build Eval Set Reactively. Repeat Until Customers Churn.
                </T>
              </div>
              <div style={{ ...tintedCard(C.green), padding: 12 }}>
                <T color={C.green} bold center size={14}>
                  Section 13 Way
                </T>
                <T color={SOFT.green} center size={13} style={{ marginTop: 6 }}>
                  Write 20 Test Cases Defining Success. Then Iterate Agent Until It Passes All 20. Then Ship. Then Add
                  Continuous Eval On Top.
                </T>
              </div>
            </div>
          </div>

          <T color={SOFT.purple} center size={14} style={{ marginTop: 12 }}>
            Every Section 13 chapter (prompting, tools, loops, memory, multi-agent, evals) was structured to give a
            production-ready playbook. The closing message is the discipline that ties it together: eval before ship.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
