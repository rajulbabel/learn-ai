import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const COST_BREAKDOWN = [
  { name: "Input Tokens", pct: 40, color: "red" },
  { name: "Output Tokens", pct: 35, color: "orange" },
  { name: "Retries", pct: 20, color: "yellow" },
  { name: "Tool Calls", pct: 5, color: "purple" },
];

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

export default function CostControl(ctx) {
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
            A typical multi-iter agent run on the customer-support corpus costs about $0.30 per ticket. Output tokens
            are usually the dominant slice because output is priced 5x input. Retries quietly compound. Tool calls
            themselves are negligible.
          </T>

          <div style={{ ...tintedCard(C.pink), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${barViewW} 200`}
              style={{ width: "100%", maxWidth: barViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Stacked horizontal cost bar showing a typical agent run: input tokens 40 percent, output tokens 35
                percent, retries 20 percent, tool calls 5 percent. Total cost annotated as 30 cents per ticket. Output
                tokens are the dominant slice because output is priced 5 times input.
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
                      <text x={x + w / 2} y={barY + barH + 22} fill={SOFT[seg.color]} fontSize="13" textAnchor="middle">
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
              <text x={barViewW / 2} y={barY + barH + 84} fill={SOFT.pink} fontSize="13" textAnchor="middle">
                Output Tokens Are The Dominant Slice (Priced 5x Input)
              </text>
            </svg>
          </div>

          <T color={SOFT.pink} center size={15} style={{ marginTop: 14 }}>
            The biggest wins target the biggest slices. Output tokens first (use smaller models where possible). Retries
            second (better error handling). Input tokens third (prompt caching). Tool calls almost never.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Cache The Prefix
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Every iteration sends the same system prompt + tool definitions + earlier history. Without caching, the
            model re-bills the prefix on every call. Prompt caching stores the prefix server-side and only bills the new
            turn.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox={`0 0 ${cacheViewW} 220`}
              style={{ width: "100%", maxWidth: cacheViewW, display: "block", margin: "0 auto" }}
            >
              <desc>
                Before-and-after diagram for prompt caching: before, every iteration is billed for the full 15k token
                context. After, the 12k prefix is cached and only the 3k new turn is billed fresh, yielding about 80
                percent savings on input tokens.
              </desc>
              {(() => {
                const beforeY = 30;
                const afterY = 130;
                const totalW = 480;
                const xStart = (cacheViewW - totalW) / 2;
                return (
                  <g>
                    {/* Before: one big block */}
                    <text
                      x={xStart - 8}
                      y={beforeY + 18}
                      fill={SOFT.red}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="end"
                    >
                      Before
                    </text>
                    <rect
                      x={xStart}
                      y={beforeY}
                      width={totalW}
                      height={40}
                      fill={`${C.red}55`}
                      stroke={C.red}
                      strokeWidth={1.5}
                    />
                    <text
                      x={xStart + totalW / 2}
                      y={beforeY + 25}
                      fill={SOFT.red}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Full Context Re-Billed Each Turn (15k Tokens)
                    </text>
                    {/* After: prefix cached + new turn */}
                    <text
                      x={xStart - 8}
                      y={afterY + 18}
                      fill={SOFT.red}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="end"
                    >
                      After
                    </text>
                    <rect
                      x={xStart}
                      y={afterY}
                      width={totalW * 0.8}
                      height={40}
                      fill={`${C.purple}33`}
                      stroke={C.purple}
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                    />
                    <text
                      x={xStart + (totalW * 0.8) / 2}
                      y={afterY + 25}
                      fill={SOFT.purple}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Cached Prefix (12k Tokens, ~Free)
                    </text>
                    <rect
                      x={xStart + totalW * 0.8}
                      y={afterY}
                      width={totalW * 0.2}
                      height={40}
                      fill={`${C.green}55`}
                      stroke={C.green}
                      strokeWidth={1.5}
                    />
                    <text
                      x={xStart + totalW * 0.8 + (totalW * 0.2) / 2}
                      y={afterY + 25}
                      fill={SOFT.green}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
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
            Section 12.36 covers prompt + semantic caching for RAG; the mechanism is identical for agents. The big
            difference: agents send a near-identical prefix on EVERY tool iteration, so the cache hit rate is even
            higher than RAG.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Cheap For Easy, Expensive For Hard
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Not every ticket needs the largest model. A tiny classifier routes by complexity. Simple lookups go to a
            small model. Complex multi-step cases get the large model. About 60% of tickets land on the small path. The
            blended cost is roughly half what it would be sending everything through the large model.
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
            Blended average across all routes: about $0.13 / ticket vs $0.30 without routing. Roughly 50% cost savings,
            with the same per-ticket quality on the hard cases (they still use the large model).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Hard Cap Per Ticket
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Beyond the average, you need a hard ceiling. The budget cap is a running tally of spend per ticket. When it
            hits a fixed limit (typically $1), the loop terminates with an escalation. The cap is the LAST line of
            defense against runaway iterations.
          </T>

          <div
            style={{
              ...tintedCard(C.yellow),
              padding: 14,
              marginTop: 14,
              maxWidth: 540,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <T color={SOFT.yellow} center size={13} style={{ marginBottom: 8 }}>
              Budget Bar Fills As Iterations Spend Tokens
            </T>
            <svg viewBox="0 0 540 80" style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
              <desc>
                Budget bar diagram showing a ticket consuming spend across iterations. At 80 percent the bar is yellow.
                At 100 percent ($1 cap) the bar turns red and the loop terminates with an escalation.
              </desc>
              <rect
                x={20}
                y={20}
                width={500}
                height={32}
                fill={`${C.yellow}11`}
                stroke={`${C.yellow}55`}
                strokeWidth={1.2}
                rx={4}
              />
              <rect
                x={20}
                y={20}
                width={400}
                height={32}
                fill={`${C.yellow}55`}
                stroke={C.yellow}
                strokeWidth={1.5}
                rx={4}
              />
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
            Combine the cost cap with the iteration cap (Section 13.23 max-iter) for belt-and-suspenders. One protects
            against expensive loops; the other protects against infinite loops with cheap models. You need both.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Don&apos;t Retry Expensive Failures
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Retries are the silent killer of cost. A naive busy-retry on every error doubles or triples the spend on the
            failing tickets. Classify the failure first; retry only when the next attempt is likely to succeed.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr 2fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Failure Kind</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Examples</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Decision</div>
              {COST_RETRY_RULES.map((r) => {
                const accent = C[r.color];
                const soft = SOFT[r.color];
                return (
                  <Fragment key={r.kind}>
                    <div
                      style={{
                        padding: "10px 10px",
                        borderTop: `1px solid ${C.purple}22`,
                        color: accent,
                        fontWeight: 700,
                      }}
                    >
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
            Section 13.11 covers the full error taxonomy and retry policies. The cost angle is the same lesson with
            money attached: a busy-retry on a permanent error can double the cost of a failed ticket without ever
            succeeding.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
