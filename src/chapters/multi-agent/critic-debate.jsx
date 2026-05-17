import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
const REFUND_CRITIC_TRACE = [
  {
    step: 1,
    actor: "Customer",
    color: "teal",
    detail: "Requests Refund For Invoice #INV-9924, $180.",
  },
  {
    step: 2,
    actor: "Refund Agent",
    color: "cyan",
    detail: '"Approved, Processing $180 Refund Now."',
  },
  {
    step: 3,
    actor: "Policy Critic",
    color: "red",
    detail:
      '"Hold. Check If Invoice Was Paid > 30 Days Ago. If Yes, Partial Refund Only (60% Policy For >30 Days).",',
  },
  {
    step: 4,
    actor: "Refund Agent (Revised)",
    color: "green",
    detail: '"Confirmed >30 Days. Approved For $120 (60% Policy)."',
  },
];

const CRITIC_VS_DEBATE_VS_SKIP = [
  {
    pattern: "Use Critic",
    color: "blue",
    when: "High-Stakes Mutations.",
    examples: "Refunds, Escalations, Contract Changes.",
    cost: "+1 LLM Call Per Draft.",
  },
  {
    pattern: "Use Debate",
    color: "purple",
    when: "Contested Decisions With Multiple Readings.",
    examples: "Policy Edge Cases, Customer-Vs-Business Tension.",
    cost: "+3 LLM Calls Per Round.",
  },
  {
    pattern: "Skip Both",
    color: "green",
    when: "Simple, Low-Stakes Tasks.",
    examples: "Lookups, Classifications, Factual Recall.",
    cost: "No Overhead.",
  },
];

export default function CriticDebate(ctx) {
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
            A Second Agent Checks The First
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Critic is reflection-as-multi-agent: instead of one agent self-critiquing (13.22), a
            separate critic agent reviews the worker&apos;s draft. Same idea, more isolation - the
            critic does not share working memory with the worker.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two-agent pair where the worker agent on the left produces a draft answer and the
                critic agent on the right reads the draft and the original question, then scores or
                rewrites it.
              </desc>
              <rect x={40} y={50} width={180} height={80} rx={10} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.8} />
              <text x={130} y={80} fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Worker Agent
              </text>
              <text x={130} y={100} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Produces Draft Answer
              </text>
              <text x={130} y={116} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                For The Customer.
              </text>

              <line x1={220} y1={90} x2={340} y2={90} stroke={C.green} strokeWidth={1.8} />
              <polygon points="336,87 344,87 340,83 340,97 336,93" fill={C.green} />
              <text x={280} y={82} fill={SOFT.green} fontSize="11" fontWeight="700" textAnchor="middle">
                Draft
              </text>

              <rect x={340} y={50} width={180} height={80} rx={10} fill={`${C.red}1f`} stroke={C.red} strokeWidth={1.8} />
              <text x={430} y={80} fill={SOFT.red} fontSize="14" fontWeight="700" textAnchor="middle">
                Critic Agent
              </text>
              <text x={430} y={100} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Reads Draft + Question.
              </text>
              <text x={430} y={116} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Scores Or Rewrites.
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            The critic has a different system prompt - it is told to be SKEPTICAL of the
            worker&apos;s draft. The separation makes it less likely the model just rubber-stamps
            its own earlier output.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Loop: Draft - Critique - Revise
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The critic-revise loop is bounded. Worker drafts; critic scores 0-10 with reasoning;
            if below threshold, worker revises with critic&apos;s feedback; critic re-scores. Loop
            until score is high enough OR the retry cap is hit.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Circular flow with four stations: worker drafts, critic scores zero through ten,
                conditional revise if below seven, then critic re-scores, with a loop arrow back to
                the worker until score is high enough or retry cap is reached.
              </desc>
              {/* 4 stations in a circle */}
              {[
                { x: 280, y: 30, label: "Worker Drafts" },
                { x: 470, y: 100, label: "Critic Scores 0-10" },
                { x: 280, y: 170, label: "If < 7, Revise" },
                { x: 90, y: 100, label: "Critic Re-Scores" },
              ].map((s, i) => (
                <g key={`stn-${i}`}>
                  <rect x={s.x - 70} y={s.y - 16} width={140} height={32} rx={8} fill={`${C.teal}1f`} stroke={C.teal} strokeWidth={1.6} />
                  <text x={s.x} y={s.y + 4} fill={SOFT.teal} fontSize="12" fontWeight="700" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              ))}
              {/* Arrows clockwise */}
              <path d="M 350 30 Q 440 50 460 80" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="456,76 464,76 460,84" fill={C.teal} />
              <path d="M 470 120 Q 440 160 350 170" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="354,166 354,174 346,170" fill={C.teal} />
              <path d="M 210 170 Q 120 160 100 120" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="96,124 104,124 100,116" fill={C.teal} />
              <path d="M 90 80 Q 120 50 210 30" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="206,34 214,34 210,26" fill={C.teal} />
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            The retry cap matters. Without it, a worker that can&apos;t please the critic loops
            forever - one of the cost-runaway failure modes covered in 13.35.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two Agents Argue, Judge Decides
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Debate is a 3-agent variant. Agent Pro argues for a position; Agent Con argues against;
            Judge agent reads both arguments and the original question and picks. Useful when the
            answer is contested or high-stakes enough to be worth two views.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three-agent debate setup: agent Pro on the left and agent Con on the right both
                argue toward a Judge agent in the bottom center, which reads both arguments and
                picks one.
              </desc>
              {/* Pro left */}
              <rect x={40} y={40} width={140} height={50} rx={10} fill={`${C.green}1f`} stroke={C.green} strokeWidth={1.8} />
              <text x={110} y={62} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent Pro
              </text>
              <text x={110} y={78} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Argues FOR
              </text>

              {/* Con right */}
              <rect x={380} y={40} width={140} height={50} rx={10} fill={`${C.red}1f`} stroke={C.red} strokeWidth={1.8} />
              <text x={450} y={62} fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent Con
              </text>
              <text x={450} y={78} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Argues AGAINST
              </text>

              {/* Judge bottom center */}
              <rect x={200} y={140} width={160} height={50} rx={10} fill={`${C.purple}24`} stroke={C.purple} strokeWidth={2} />
              <text x={280} y={162} fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Judge Agent
              </text>
              <text x={280} y={178} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Reads Both, Picks One
              </text>

              {/* Arrows down */}
              <line x1={110} y1={90} x2={230} y2={140} stroke={C.purple} strokeWidth={1.6} />
              <polygon points="226,136 234,136 230,144" fill={C.purple} />
              <line x1={450} y1={90} x2={330} y2={140} stroke={C.purple} strokeWidth={1.6} />
              <polygon points="326,136 334,136 330,144" fill={C.purple} />
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Debate triples the LLM bill vs single-agent. Use it sparingly - high-stakes contested
            decisions where you genuinely want two voices, not noise-reduction on a routine task.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Policy Critic For The Refund Agent
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Concrete example: a refund agent makes a draft decision; a policy critic catches that
            the invoice is &gt;30 days old; the refund gets revised down. This is exactly the kind
            of thing the worker alone would miss.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {REFUND_CRITIC_TRACE.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`r-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            The critic caught $60 the worker would have over-refunded. Multiplied across thousands
            of refunds per month, the policy critic pays for its own LLM bill many times over.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Critic Adds Cost; Pick Battles
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Critic and debate are not free. Each extra agent doubles or triples the LLM bill and
            adds latency. Pick where they earn their cost, skip where they do not.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {CRITIC_VS_DEBATE_VS_SKIP.map((p) => {
              const accent = C[p.color];
              const soft = SOFT[p.color];
              return (
                <div key={p.pattern} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{p.pattern.toUpperCase()}</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    {p.pattern}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    When: {p.when}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Examples: {p.examples}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Cost: {p.cost}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Rule of thumb: if a wrong answer is worth less than the extra LLM cost, skip the
            critic. If a wrong answer can cost $200 in refund overage, paying $0.01 for a critic
            call is the easiest trade you will ever make.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
