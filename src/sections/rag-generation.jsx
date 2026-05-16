import { Box, T, Reveal } from "../components.jsx";
import { C } from "../config.js";

// Section 12 Milestone 4 - Acts 6 & 7
// Act 6 (Context & Generation): 12.22-12.24
// Act 7 (Advanced Retrieval Patterns): 12.25-12.30

// ───────────────────────────────────────────────────────────────
// 12.22 ContextPacking - token budget, ordering strategies, MMR
// ───────────────────────────────────────────────────────────────

// Token-budget segments for the 8k context window stacked bar in sub=0.
// Real ballpark numbers a production RAG would budget. Sums to 8000.
const CP_BUDGET_SEGMENTS = [
  { label: "System Prompt", tokens: 200, color: C.cyan, accent: "#80deea" },
  { label: "Retrieved Context", tokens: 5000, color: C.green, accent: "#a5d6a7" },
  { label: "User Question", tokens: 50, color: C.purple, accent: "#b8a9ff" },
  { label: "Reserved Completion", tokens: 1500, color: C.orange, accent: "#ffcc80" },
  { label: "Headroom", tokens: 1250, color: C.yellow, accent: "#ffe082" },
];
const CP_BUDGET_TOTAL = 8000;

// Top-3 retrieved chunks for the password-reset running query (sub=1).
const CP_CHUNKS = [
  {
    id: "[doc-1, chunk 1]",
    score: 0.91,
    text: "To reset your password, go to Settings then Security.",
  },
  {
    id: "[doc-1, chunk 2]",
    score: 0.84,
    text: "An email with a reset link will be sent to your registered address.",
  },
  {
    id: "[doc-1, chunk 3]",
    score: 0.77,
    text: "Click the link within 24 hours to set a new password.",
  },
];

// MMR before/after demo data (sub=4). "Before" has 5 chunks where chunk 4
// duplicates chunk 2 (both about the reset link). "After" drops the dup
// and brings in an MFA chunk for diversity.
const CP_MMR_BEFORE = [
  { id: "[doc-1, chunk 1]", text: "To reset your password, go to Settings then Security.", duplicate: false },
  { id: "[doc-1, chunk 2]", text: "An email with a reset link will be sent.", duplicate: false },
  { id: "[doc-1, chunk 3]", text: "Click the link within 24 hours.", duplicate: false },
  { id: "[doc-1, chunk 4]", text: "A reset email is sent with a clickable link.", duplicate: true },
  { id: "[doc-1, chunk 5]", text: "Set a strong new password to finish.", duplicate: false },
];
const CP_MMR_AFTER = [
  { id: "[doc-1, chunk 1]", text: "To reset your password, go to Settings then Security." },
  { id: "[doc-1, chunk 2]", text: "An email with a reset link will be sent." },
  { id: "[doc-1, chunk 3]", text: "Click the link within 24 hours." },
  { id: "[doc-9, chunk 1]", text: "MFA must be re-verified after a reset (different but related)." },
];

export const ContextPacking = (ctx) => {
  const { sub } = ctx;

  // Sub=0 stacked-bar geometry. ViewBox 800x180; the bar is centered with
  // symmetric left/right padding so segment proportions add up to bar_w.
  const CP_BAR_VB_W = 800;
  const CP_BAR_VB_H = 180;
  const CP_BAR_W = 720;
  const CP_BAR_H = 64;
  const CP_BAR_X = (CP_BAR_VB_W - CP_BAR_W) / 2;
  const CP_BAR_Y = 40;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Token budget breakdown */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Every Prompt Has A Token Budget
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            An 8000-token context window splits across four jobs: the system prompt that frames the model, the retrieved
            context with the answer, the user question, and the reserved tokens the model will use to write its answer.
            Headroom is the slack you keep so a long answer never overflows.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${CP_BAR_VB_W} ${CP_BAR_VB_H}`} width="100%" style={{ maxWidth: 800, height: "auto" }}>
              <desc>
                Stacked horizontal bar visualizing how an 8000-token LLM context budget splits across system prompt,
                retrieved chunks, user question, and reserved completion tokens.
              </desc>

              {(() => {
                let x = CP_BAR_X;
                return CP_BUDGET_SEGMENTS.map((seg) => {
                  const segW = (seg.tokens / CP_BUDGET_TOTAL) * CP_BAR_W;
                  const cx = x + segW / 2;
                  const segX = x;
                  x += segW;
                  return (
                    <g key={seg.label}>
                      <rect
                        x={segX}
                        y={CP_BAR_Y}
                        width={segW}
                        height={CP_BAR_H}
                        fill={seg.color}
                        fillOpacity="0.28"
                        stroke={seg.color}
                        strokeOpacity="0.7"
                        strokeWidth="1.5"
                      />
                      {segW >= 60 && (
                        <text
                          x={cx}
                          y={CP_BAR_Y + CP_BAR_H / 2 + 5}
                          fill={seg.accent}
                          fontSize="13"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {seg.tokens}
                        </text>
                      )}
                    </g>
                  );
                });
              })()}

              {/* Bar label above */}
              <text
                x={CP_BAR_VB_W / 2}
                y={CP_BAR_Y - 14}
                fill="#ffe082"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                8000-Token Context Window
              </text>

              {/* Legend row below */}
              {(() => {
                const legendY = CP_BAR_Y + CP_BAR_H + 28;
                const swatchW = 14;
                const colW = CP_BAR_W / CP_BUDGET_SEGMENTS.length;
                return CP_BUDGET_SEGMENTS.map((seg, i) => {
                  const cx = CP_BAR_X + colW * i + colW / 2;
                  return (
                    <g key={`legend-${seg.label}`}>
                      <rect
                        x={cx - swatchW / 2 - 60}
                        y={legendY - 11}
                        width={swatchW}
                        height={swatchW}
                        fill={seg.color}
                        fillOpacity="0.28"
                        stroke={seg.color}
                        strokeOpacity="0.7"
                      />
                      <text x={cx - 40} y={legendY} fill={seg.accent} fontSize="12" textAnchor="start">
                        {seg.label}
                      </text>
                    </g>
                  );
                });
              })()}
            </svg>
          </div>

          {/* Numeric breakdown table */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr",
                gap: 10,
                fontSize: 14,
              }}
            >
              <T color="#ffe082" bold size={14}>
                Slot
              </T>
              <T color="#ffe082" bold size={14}>
                Tokens
              </T>
              <T color="#ffe082" bold size={14}>
                Share Of Budget
              </T>
              {CP_BUDGET_SEGMENTS.flatMap((seg) => [
                <T key={`${seg.label}-l`} color={seg.accent} size={14}>
                  {seg.label}
                </T>,
                <T key={`${seg.label}-t`} color={seg.accent} size={14}>
                  {seg.tokens.toLocaleString()}
                </T>,
                <T key={`${seg.label}-p`} color={seg.accent} size={14}>
                  {((seg.tokens / CP_BUDGET_TOTAL) * 100).toFixed(1)}%
                </T>,
              ])}
            </div>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Top-3 retrieved chunks for the password reset query */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Pack Top-3 Chunks For The Password Reset Query
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The running query "How do I reset my password?" returned these three chunks from doc-1 with their cosine
            scores. The scores tell us how to order; the chunks tell us what to pack.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {CP_CHUNKS.map((chunk) => (
              <div
                key={chunk.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {chunk.id} - Score {chunk.score}
                </T>
                <T color="#80deea" center size={14} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  {chunk.text}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Ordering option 1: Relevance-first */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Ordering Option 1: Relevance-First
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Sort by retrieval score, highest first. The most-relevant chunk lands at position 1 where the model attends
            best. Default for single-best-answer queries.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Packed Order (Relevance-First)
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {CP_CHUNKS.map((chunk, i) => (
                <T key={chunk.id} color="#b8a9ff" center size={14} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {i + 1}. {chunk.id} (Score {chunk.score})
                </T>
              ))}
            </div>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
            Most relevant first. Cheap to do (just sort by score). Risk: tail-position chunks lose attention weight.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Ordering option 2: Chronological */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Ordering Option 2: Chronological
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Sort by publication date or document position. Useful for time-sensitive docs - changelogs, policy
            histories, incident timelines - where the natural reading order helps the model follow cause-effect.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={15}>
              Packed Order (Chronological)
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {CP_CHUNKS.map((chunk, i) => (
                <T key={chunk.id} color="#a5d6a7" center size={14} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {i + 1}. {chunk.id} - Document Position {i + 1}
                </T>
              ))}
            </div>
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 10 }}>
            Time-sensitive ordering preserves the natural sequence so the model reads cause then effect.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Ordering option 3: Deduplicate with MMR */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Ordering Option 3: Deduplicate With MMR
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Maximal Marginal Relevance keeps high-score chunks while dropping near-duplicates. Same budget, more unique
            information.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Before MMR (5 Chunks, Redundant)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {CP_MMR_BEFORE.map((c) => (
                  <T
                    key={c.id}
                    color="#ef9a9a"
                    center
                    size={13}
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      textDecoration: c.duplicate ? "line-through" : "none",
                    }}
                  >
                    {c.id} {c.duplicate ? "(Duplicate - Wastes Budget)" : ""}
                  </T>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                After MMR (4 Chunks, Diverse)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {CP_MMR_AFTER.map((c) => (
                  <T key={c.id} color="#a5d6a7" center size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                    {c.id}
                  </T>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              The MMR Formula
            </T>
            <T color="#ffcc80" center size={15} style={{ marginTop: 10, fontFamily: "ui-monospace, monospace" }}>
              MMR = lambda x sim(chunk, query) - (1 - lambda) x max(sim(chunk, already_picked))
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 10 }}>
              Lambda = 0.7 weights relevance over diversity. Lambda = 0.3 weights diversity over relevance. Tune per
              workload.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── The final packed prompt */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The Final Packed Prompt
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            All the pieces packed into one prompt - system instruction, retrieved chunks with citation markers, the user
            question, and a refusal phrase the model is allowed to use.
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
            <T color={C.pink} bold center size={15}>
              Prompt Template
            </T>
            <pre
              style={{
                marginTop: 10,
                padding: 14,
                background: `${C.pink}08`,
                borderRadius: 6,
                color: "#f48fb1",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                textAlign: "left",
                overflow: "auto",
              }}
            >
              {`You are a helpful support assistant. Use the documentation below to answer.
If the docs don't contain the answer, say "I don't have enough information".

Documentation:
[doc-1, chunk 1] To reset your password, go to Settings then Security.
[doc-1, chunk 2] An email with a reset link will be sent to your address.
[doc-1, chunk 3] Click the link within 24 hours to set a new password.

Question: How do I reset my password?
Answer:`}
            </pre>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "8px 14px",
                borderRadius: 18,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Within Budget: ~4,800 / 8,000 Tokens (60%)
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.23 LostInTheMiddle - U-shaped attention curve + mitigations
// ───────────────────────────────────────────────────────────────

// 20-position U-curve data (sub=0). Position 1 starts high, dips in the middle,
// recovers near the end. Numbers are approximate but match Liu et al 2023 trend.
const LITM_CURVE_POINTS = [
  { pos: 1, acc: 85 },
  { pos: 2, acc: 80 },
  { pos: 3, acc: 75 },
  { pos: 4, acc: 70 },
  { pos: 5, acc: 65 },
  { pos: 6, acc: 60 },
  { pos: 7, acc: 56 },
  { pos: 8, acc: 55 },
  { pos: 9, acc: 55 },
  { pos: 10, acc: 56 },
  { pos: 11, acc: 56 },
  { pos: 12, acc: 58 },
  { pos: 13, acc: 60 },
  { pos: 14, acc: 64 },
  { pos: 15, acc: 68 },
  { pos: 16, acc: 72 },
  { pos: 17, acc: 75 },
  { pos: 18, acc: 78 },
  { pos: 19, acc: 80 },
  { pos: 20, acc: 82 },
];

// 10-slot strip color codings used in sub=2 (front-load) and sub=3 (sandwich).
const LITM_FRONTLOAD_SLOTS = [
  { pos: 1, score: 0.91, accent: C.green, label: "Top-1" },
  { pos: 2, score: 0.88, accent: C.green, label: "Top-2" },
  { pos: 3, score: 0.84, accent: C.green, label: "Top-3" },
  { pos: 4, score: 0.78, accent: "#a5d6a7", label: "" },
  { pos: 5, score: 0.71, accent: "#a5d6a7", label: "" },
  { pos: 6, score: 0.66, accent: "#a5d6a7", label: "" },
  { pos: 7, score: 0.59, accent: "#a5d6a7", label: "" },
  { pos: 8, score: 0.52, accent: "#a5d6a7", label: "" },
  { pos: 9, score: 0.45, accent: "#a5d6a7", label: "" },
  { pos: 10, score: 0.38, accent: "#a5d6a7", label: "" },
];
const LITM_SANDWICH_SLOTS = [
  { pos: 1, score: 0.91, accent: C.cyan, label: "Top-1" },
  { pos: 2, score: 0.88, accent: C.cyan, label: "Top-2" },
  { pos: 3, score: 0.66, accent: "#80deea", label: "" },
  { pos: 4, score: 0.59, accent: "#80deea", label: "" },
  { pos: 5, score: 0.52, accent: "#80deea", label: "" },
  { pos: 6, score: 0.45, accent: "#80deea", label: "" },
  { pos: 7, score: 0.38, accent: "#80deea", label: "" },
  { pos: 8, score: 0.31, accent: "#80deea", label: "" },
  { pos: 9, score: 0.84, accent: C.cyan, label: "Top-3" },
  { pos: 10, score: 0.78, accent: C.cyan, label: "Top-4" },
];

// Sub=4 failure-mode cards.
const LITM_FAILURE_CARDS = [
  {
    title: "Truly Long Multi-Fact Queries",
    body: "30 chunks all needed; even sandwich leaves middle facts ignored. Fix: hierarchical summarization or multi-hop retrieval (chapter 12.25).",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    title: "Tail-Buried Critical Detail",
    body: "The killer fact lives at chunk 18; both strategies miss it. Fix: rerank harder, fetch fewer.",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    title: "Model-Specific Curve Shape",
    body: "Some models have flatter curves than others; benchmark on your own model. Lost-in-middle is a model fingerprint, not a universal law.",
    color: C.purple,
    accent: "#b8a9ff",
  },
];

export const LostInTheMiddle = (ctx) => {
  const { sub } = ctx;

  // Sub=0 U-curve plot geometry. ViewBox 720x320; symmetric padding.
  const UC_VB_W = 720;
  const UC_VB_H = 320;
  const UC_PAD_L = 70;
  const UC_PAD_R = 30;
  const UC_PAD_T = 30;
  const UC_PAD_B = 60;
  const UC_PLOT_W = UC_VB_W - UC_PAD_L - UC_PAD_R;
  const UC_PLOT_H = UC_VB_H - UC_PAD_T - UC_PAD_B;
  const xOf = (pos) => UC_PAD_L + ((pos - 1) / 19) * UC_PLOT_W;
  const yOf = (acc) => UC_PAD_T + (1 - acc / 100) * UC_PLOT_H;
  const curvePath = LITM_CURVE_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.pos)} ${yOf(p.acc)}`).join(" ");

  // Sub=2/3 strip geometry. ViewBox 720x90; 10 evenly spaced slots.
  const STRIP_VB_W = 720;
  const STRIP_VB_H = 110;
  const STRIP_SLOT_GAP = 6;
  const STRIP_SLOT_W = (640 - 9 * STRIP_SLOT_GAP) / 10;
  const STRIP_X_START = (STRIP_VB_W - (10 * STRIP_SLOT_W + 9 * STRIP_SLOT_GAP)) / 2;
  const STRIP_SLOT_H = 56;
  const STRIP_SLOT_Y = 28;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── U-shaped accuracy curve */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Accuracy By Position Of The Relevant Chunk
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Liu et al. (2023) showed that LLMs attend best to the start and end of a long context window. The middle
            gets ignored. Plot 20 packed chunks: answer accuracy is highest when the relevant chunk is at position 1 or
            position 20, and lowest in the middle. The curve is U-shaped.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${UC_VB_W} ${UC_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                U-shaped accuracy curve plotting answer correctness against the position of the relevant chunk within a
                20-chunk context, showing high accuracy at the start and end and a dip in the middle from the Liu et al.
                2023 lost-in-the-middle finding.
              </desc>

              {/* Y axis */}
              <line
                x1={UC_PAD_L}
                y1={UC_PAD_T}
                x2={UC_PAD_L}
                y2={UC_PAD_T + UC_PLOT_H}
                stroke="#ffe082"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
              {/* X axis */}
              <line
                x1={UC_PAD_L}
                y1={UC_PAD_T + UC_PLOT_H}
                x2={UC_PAD_L + UC_PLOT_W}
                y2={UC_PAD_T + UC_PLOT_H}
                stroke="#ffe082"
                strokeOpacity="0.5"
                strokeWidth="1"
              />

              {/* Y axis ticks */}
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line x1={UC_PAD_L - 4} y1={yOf(v)} x2={UC_PAD_L} y2={yOf(v)} stroke="#ffe082" strokeOpacity="0.5" />
                  <text x={UC_PAD_L - 8} y={yOf(v) + 4} fill="#ffe082" fontSize="11" textAnchor="end">
                    {v}
                  </text>
                </g>
              ))}
              {/* X axis ticks */}
              {[1, 5, 10, 15, 20].map((v) => (
                <g key={v}>
                  <line
                    x1={xOf(v)}
                    y1={UC_PAD_T + UC_PLOT_H}
                    x2={xOf(v)}
                    y2={UC_PAD_T + UC_PLOT_H + 4}
                    stroke="#ffe082"
                    strokeOpacity="0.5"
                  />
                  <text x={xOf(v)} y={UC_PAD_T + UC_PLOT_H + 18} fill="#ffe082" fontSize="11" textAnchor="middle">
                    {v}
                  </text>
                </g>
              ))}

              {/* Axis labels */}
              <text
                x={UC_PAD_L + UC_PLOT_W / 2}
                y={UC_PAD_T + UC_PLOT_H + 44}
                fill="#ffe082"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Position Of Relevant Chunk
              </text>
              <text
                x={20}
                y={UC_PAD_T + UC_PLOT_H / 2}
                fill="#ffe082"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                transform={`rotate(-90 20 ${UC_PAD_T + UC_PLOT_H / 2})`}
              >
                Accuracy (%)
              </text>

              {/* Curve */}
              <path d={curvePath} fill="none" stroke={C.yellow} strokeWidth="2.5" strokeOpacity="0.9" />
              {/* Points */}
              {LITM_CURVE_POINTS.map((p) => (
                <circle key={p.pos} cx={xOf(p.pos)} cy={yOf(p.acc)} r="3" fill={C.yellow} />
              ))}

              {/* Mid baseline label */}
              <line
                x1={xOf(8)}
                y1={yOf(55)}
                x2={xOf(8) + 80}
                y2={yOf(55) - 30}
                stroke="#ffe082"
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />
              <text x={xOf(8) + 84} y={yOf(55) - 30} fill="#ffe082" fontSize="12" textAnchor="start">
                Middle Dip ~55%
              </text>

              {/* Source label */}
              <text
                x={UC_VB_W - UC_PAD_R}
                y={UC_PAD_T + 14}
                fill="#ffe082"
                fontSize="11"
                fontStyle="italic"
                textAnchor="end"
              >
                Liu Et Al. 2023
              </text>
            </svg>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Same context, two outcomes */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Same Answer In Context, Two Outcomes
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Query: "Does the Pro plan include SSO?" The answer-bearing chunk is "SSO is Enterprise-only" (doc-15, chunk
            3). With 10 packed chunks, the position of that chunk decides whether the model finds the fact or not.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Row A: Answer At Position 5 (Middle)
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                10 packed chunks; the SSO chunk lands at position 5.
              </T>
              <T
                color="#ef9a9a"
                center
                size={14}
                style={{
                  marginTop: 10,
                  fontFamily: "ui-monospace, monospace",
                  padding: 8,
                  background: `${C.red}06`,
                  borderRadius: 6,
                }}
              >
                Model: "I don't see SSO mentioned for the Pro plan."
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 6 }}>
                Wrong - the model ignored the middle chunk.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Row B: Answer At Position 1 (Front)
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Same 10 chunks reordered; the SSO chunk lands at position 1.
              </T>
              <T
                color="#a5d6a7"
                center
                size={14}
                style={{
                  marginTop: 10,
                  fontFamily: "ui-monospace, monospace",
                  padding: 8,
                  background: `${C.green}06`,
                  borderRadius: 6,
                }}
              >
                Model: "No, SSO is Enterprise-only."
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                Correct - same chunk, better position.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Strategy 1: Front-load */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Strategy 1: Front-Load The Most Relevant Chunk
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Relevance-first ordering: sort by retrieval score descending. The top-scored chunks land in positions 1, 2,
            3 - the high-attention region. Tail positions hold the lowest-scored chunks.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${STRIP_VB_W} ${STRIP_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Front-load strategy: 10 chunk slots in a horizontal strip with the top-3 scored chunks highlighted in
                bright green at positions 1, 2, 3 and the lowest-scored chunks faded toward position 10.
              </desc>
              {LITM_FRONTLOAD_SLOTS.map((slot, i) => {
                const x = STRIP_X_START + i * (STRIP_SLOT_W + STRIP_SLOT_GAP);
                return (
                  <g key={slot.pos}>
                    <rect
                      x={x}
                      y={STRIP_SLOT_Y}
                      width={STRIP_SLOT_W}
                      height={STRIP_SLOT_H}
                      rx="6"
                      fill={slot.accent}
                      fillOpacity={slot.label ? "0.3" : "0.12"}
                      stroke={slot.accent}
                      strokeOpacity="0.7"
                    />
                    <text
                      x={x + STRIP_SLOT_W / 2}
                      y={STRIP_SLOT_Y + STRIP_SLOT_H / 2 - 4}
                      fill="#a5d6a7"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Pos {slot.pos}
                    </text>
                    <text
                      x={x + STRIP_SLOT_W / 2}
                      y={STRIP_SLOT_Y + STRIP_SLOT_H / 2 + 12}
                      fill="#a5d6a7"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {slot.score}
                    </text>
                  </g>
                );
              })}
              <text
                x={STRIP_VB_W / 2}
                y={STRIP_SLOT_Y - 8}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Sort By Score Descending
              </text>
            </svg>
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 10 }}>
            Cheap. Helps single-best-answer queries. Risk: tail context still ignored, but the top-scored chunks land in
            the attention sweet spot.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Strategy 2: Sandwich */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Strategy 2: Sandwich The Best Chunks At Start And End
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Put the top-2 chunks at the front and the next-best two at the back. The middle dip on the U-curve becomes
            the least-relevant region. Same total tokens; reordering is negligible compute.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${STRIP_VB_W} ${STRIP_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Sandwich strategy: top-2 scored chunks at positions 1-2 (front), next-best 2 chunks at positions 9-10
                (back), and lower-scored chunks filling positions 3-8 in the middle dip region.
              </desc>
              {LITM_SANDWICH_SLOTS.map((slot, i) => {
                const x = STRIP_X_START + i * (STRIP_SLOT_W + STRIP_SLOT_GAP);
                return (
                  <g key={slot.pos}>
                    <rect
                      x={x}
                      y={STRIP_SLOT_Y}
                      width={STRIP_SLOT_W}
                      height={STRIP_SLOT_H}
                      rx="6"
                      fill={slot.accent}
                      fillOpacity={slot.label ? "0.3" : "0.12"}
                      stroke={slot.accent}
                      strokeOpacity="0.7"
                    />
                    <text
                      x={x + STRIP_SLOT_W / 2}
                      y={STRIP_SLOT_Y + STRIP_SLOT_H / 2 - 4}
                      fill="#80deea"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Pos {slot.pos}
                    </text>
                    <text
                      x={x + STRIP_SLOT_W / 2}
                      y={STRIP_SLOT_Y + STRIP_SLOT_H / 2 + 12}
                      fill="#80deea"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {slot.score}
                    </text>
                  </g>
                );
              })}
              <text
                x={STRIP_VB_W / 2}
                y={STRIP_SLOT_Y - 8}
                fill="#80deea"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Best Chunks Bookend Start And End
              </text>
            </svg>
          </div>

          <T color="#80deea" center size={14} style={{ marginTop: 10 }}>
            More robust for multi-fact queries. Same total tokens. Costs reordering compute (negligible).
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When neither helps */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            When Reordering Isn't Enough
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Front-load and sandwich help most workloads but not all. Three failure modes need different fixes than
            position tricks.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {LITM_FAILURE_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <T color={card.accent} center size={13} style={{ marginTop: 8 }}>
                  {card.body}
                </T>
              </div>
            ))}
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            Always benchmark on your own model and workload. Lost-in-middle is a fingerprint, not a universal law.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.24 CitationsRefusal - prompt artifacts for inline citations + refusal
// ───────────────────────────────────────────────────────────────

// Citation prompt template (sub=1).
const CR_PROMPT_CITATION = `You are a helpful support assistant. Use the documentation below
to answer the user's question.

For every claim you make, cite the source as [doc-N], where N is
the doc number from the Documentation section. Do NOT cite a doc
you did not use.

Documentation:
{context}

Question: {query}
Answer:`;

// Structured JSON output schema (sub=2).
const CR_PROMPT_JSON = `{
  "answer": "Your account locks after 5 failed logins.",
  "citations": [
    { "doc_id": "doc-12", "chunk_id": 3, "quote": "5 failed login attempts" }
  ],
  "confidence": 0.92
}`;

// Refusal prompt template (sub=3).
const CR_PROMPT_REFUSAL = `If the documentation does not contain enough information to answer,
respond with EXACTLY this sentence and nothing else:
"I don't have enough information to answer that."

Do not invent facts. Do not guess. Do not cite a doc you didn't use.`;

// Production combined template (sub=6).
const CR_PROMPT_PRODUCTION = `You are a helpful support assistant. Use ONLY the documentation
below to answer the user's question.

RULES:
1. Cite every claim inline as [doc-N], where N is the doc number.
2. Quote 3-7 words from the cited chunk after each [doc-N].
3. If the docs do not answer the question, respond with EXACTLY:
   "I don't have enough information to answer that."
4. Do not invent facts. Do not paraphrase what isn't in the docs.

Documentation:
{context}

Question: {query}
Answer:`;

// Helper to render a styled monospace prompt-template block. NOT a code block.
function PromptTemplateBlock({ color, accent, title, template }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: `${color}06`,
        border: `1px solid ${color}12`,
      }}
    >
      <T color={color} bold center size={15}>
        {title}
      </T>
      <pre
        style={{
          marginTop: 10,
          padding: 14,
          background: `${color}08`,
          borderRadius: 6,
          color: accent,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          textAlign: "left",
          overflow: "auto",
        }}
      >
        {template}
      </pre>
    </div>
  );
}

// Faithfulness audit steps (sub=4).
const CR_AUDIT_STEPS = [
  {
    n: 1,
    label: "Parse Answer Into Atomic Claims",
    detail: 'Example: "5 failed logins triggers a lock" / "Billing issues hold for 24 hours".',
  },
  {
    n: 2,
    label: "Locate The Cited Chunk For Each Claim",
    detail: "Follow the [doc-N] marker back to the retrieved chunk text.",
  },
  {
    n: 3,
    label: "Score: claim_supported = LLMJudge(claim, chunk)",
    detail: "Aggregate per-claim scores into a faithfulness number from 0 to 1.",
  },
];

// Citation parser table (sub=5).
const CR_PARSER_ROWS = [
  { marker: "[doc-12]", doc: "doc-12 (Account Lockouts)", chunk: 3, quote: "5 failed login attempts" },
  { marker: "[doc-7]", doc: "doc-7 (Billing Holds)", chunk: 1, quote: "24-hour hold after a failed charge" },
];

export const CitationsRefusal = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why citations matter */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Why Citations Are A Production Requirement
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Without citations, the user cannot verify the answer and a reviewer cannot audit it. Hallucinations slip
            through silently. With inline [doc-N] markers, every claim is traceable. The same answer with citations is
            an artifact you can review, replay, and trust.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                No Citations
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                Query: "Why is my account locked?"
              </T>
              <T
                color="#ef9a9a"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.red}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "Your account may be locked due to too many failed logins or a billing issue."
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                User cannot verify. Reviewer cannot audit. Hallucination has nowhere to land.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                With Citations
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Query: "Why is my account locked?"
              </T>
              <T
                color="#a5d6a7"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.green}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "Your account locks after 5 failed logins [doc-12]. Billing issues trigger a 24-hour hold [doc-7]."
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Every claim traces to a specific chunk. Audit-friendly. Hallucinations exposed.
              </T>
            </div>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Citation instruction prompt template */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Tell The Model To Cite Inline
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The citation instruction lives in the system prompt. Use a literal [doc-N] marker the model can emit inline.
            Specify that N must come from the Documentation block, not be invented.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.cyan}
              accent="#80deea"
              title="Prompt Template"
              template={CR_PROMPT_CITATION}
            />
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Structured JSON output */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Or Ask For Structured Citations
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            JSON output is machine-parseable and downstream audit pipelines can ingest it without regex. The schema
            below pairs the answer with its citations and a confidence score.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.purple}
              accent="#b8a9ff"
              title="Prompt Template - Structured JSON Output"
              template={CR_PROMPT_JSON}
            />
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
            Structured output makes citations machine-parseable. Better for downstream audit pipelines.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Refusal instruction */}
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Tell The Model To Refuse When Context Is Missing
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Without an explicit refusal instruction, models tend to invent. With one, the model has an authorized exit
            for "I don't know". The exact wording matters - models follow the most precise instructions in the prompt.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.red}
              accent="#ef9a9a"
              title="Prompt Template - Refusal Instruction"
              template={CR_PROMPT_REFUSAL}
            />
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Without Refusal Instruction
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                Query: "What's the refund window for monthly plans?" (no matching doc)
              </T>
              <T
                color="#ef9a9a"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.red}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "Monthly plans have a 7-day refund window."
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                Hallucinated. The model guessed because it had no exit.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                With Refusal Instruction
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Same query, same missing doc.
              </T>
              <T
                color="#a5d6a7"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.green}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "I don't have enough information to answer that."
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Safe. The user knows the system was honest about its limit.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Faithfulness preview */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Faithfulness: Every Claim Must Trace To A Chunk
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Faithfulness is the share of claims in an answer that are supported by the retrieved chunks. A 3-step audit
            converts citations into a measurable score. Chapters 12.31-12.35 cover RAGAS faithfulness in depth.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {CR_AUDIT_STEPS.map((step) => (
              <div
                key={step.n}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={15}>
                  Step {step.n}: {step.label}
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                  {step.detail}
                </T>
              </div>
            ))}
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            Output is a single number from 0 (none supported) to 1 (every claim has evidence in the retrieved chunks).
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Citation parser */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Parse Citations Back Out Of The Answer
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            After generation, parse [doc-N] markers out of the answer with a regex. Map each marker back to the
            retrieved chunk and render as footnotes or hover tooltips in the UI.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Model Output (Highlighted)
            </T>
            <T
              color="#ffcc80"
              center
              size={14}
              style={{
                marginTop: 10,
                fontFamily: "ui-monospace, monospace",
                padding: 10,
                background: `${C.orange}08`,
                borderRadius: 6,
              }}
            >
              Your account locks after 5 failed logins <span style={{ color: C.orange }}>[doc-12]</span>. Billing issues
              trigger a 24-hour hold <span style={{ color: C.orange }}>[doc-7]</span>.
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 12, fontFamily: "ui-monospace, monospace" }}>
              Regex: \[doc-\d+\]
            </T>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Resolved Citation Table
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.7fr 1.6fr 0.6fr 2fr",
                gap: 8,
                fontSize: 13,
              }}
            >
              <T color="#ffcc80" bold size={13}>
                Marker
              </T>
              <T color="#ffcc80" bold size={13}>
                Doc
              </T>
              <T color="#ffcc80" bold size={13}>
                Chunk
              </T>
              <T color="#ffcc80" bold size={13}>
                Quoted Span
              </T>
              {CR_PARSER_ROWS.flatMap((row) => [
                <T key={`${row.marker}-m`} color="#ffcc80" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {row.marker}
                </T>,
                <T key={`${row.marker}-d`} color="#ffcc80" size={13}>
                  {row.doc}
                </T>,
                <T key={`${row.marker}-c`} color="#ffcc80" size={13}>
                  {row.chunk}
                </T>,
                <T key={`${row.marker}-q`} color="#ffcc80" size={13}>
                  "{row.quote}"
                </T>,
              ])}
            </div>
          </div>

          <T color="#ffcc80" center size={14} style={{ marginTop: 12 }}>
            Render as footnotes or inline tooltips in your UI. Now the user can click a citation and see exactly what
            the model used to write that sentence.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── Production combined template */}
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Production Template: Citations Plus Refusal
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            One combined template that does both. Numbered RULES make the contract explicit so the model treats
            citations and refusal as non-optional.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.pink}
              accent="#f48fb1"
              title="Prompt Template - Production"
              template={CR_PROMPT_PRODUCTION}
            />
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Numbered rules survive long context better than prose instructions. The model attends to short structured
            constraints more reliably than to a paragraph.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.25 MultiHopRetrieval - iterative retrieve-evaluate-retrieve loop
// ───────────────────────────────────────────────────────────────

// Sufficiency-check prompt (sub=3).
const MH_SUFFICIENCY_PROMPT = `You are an assistant deciding whether you have enough information.

Question: {query}
Retrieved so far:
{context}

Respond with EXACTLY one of:
- SUFFICIENT (you can answer the question from the retrieved text)
- INSUFFICIENT: <one short follow-up query to retrieve more>

Do not answer the question yet.`;

// Sub=1 hop trace data.
const MH_HOPS = [
  {
    n: 1,
    query: "How do I reset my password if I forgot my email?",
    retrieved: "doc-1 (password reset)",
    reasoning:
      "Reset requires email access. The user says they forgot email - need email recovery info before answering.",
    decision: "INSUFFICIENT",
    followUp: "How do I recover access if I forgot my email?",
  },
  {
    n: 2,
    query: "How do I recover access if I forgot my email?",
    retrieved: "doc-3 (email change / recovery)",
    reasoning: "Now both pieces are in hand: the reset flow (doc-1) and the email-recovery path (doc-3).",
    decision: "SUFFICIENT",
    followUp: null,
  },
];

// Sub=4 worth-it grid.
const MH_WORTH_CARDS = [
  {
    title: "Worth It",
    color: C.green,
    accent: "#a5d6a7",
    bullets: [
      "Compound questions (password reset if you forgot your email)",
      "Cross-doc reasoning (compare Pro vs Enterprise plans)",
      "Step-dependent flows (cancel subscription then refund)",
    ],
  },
  {
    title: "Not Worth It",
    color: C.red,
    accent: "#ef9a9a",
    bullets: ["Single-doc lookups", "Simple FAQ-style queries", "Cost outweighs benefit when one hop already answers"],
  },
  {
    title: "Cost Multiplier",
    color: C.orange,
    accent: "#ffcc80",
    bullets: [
      "Each hop = 1 retrieval + 1 LLM call",
      "3 hops = ~3x latency, ~3x cost vs single-hop",
      "Budget per query becomes a hard constraint",
    ],
  },
  {
    title: "Mitigations",
    color: C.cyan,
    accent: "#80deea",
    bullets: ["Cap max_hops at 3", "Cache reformulated queries", "Use a smaller model for the sufficiency check"],
  },
];

// Sub=5 failure-mode cards.
const MH_FAILURE_CARDS = [
  {
    title: "Infinite Loop",
    color: C.red,
    accent: "#ef9a9a",
    body: "Model never says SUFFICIENT. Each hop reformulates without making progress. Mitigation: hard cap on max_hops + log every reformulation.",
  },
  {
    title: "Divergence",
    color: C.orange,
    accent: "#ffcc80",
    body: 'Each reformulation drifts farther from the original intent. "How do I reset my password?" becomes "How do I configure SSO?" by hop 3. Mitigation: keep the ORIGINAL query in the reformulation prompt as an anchor.',
  },
  {
    title: "Stuck Sufficiency Judge",
    color: C.purple,
    accent: "#b8a9ff",
    body: "Model always says SUFFICIENT after hop 1 even when context is incomplete (overconfident). Mitigation: separate judge model, calibrate via a golden dataset.",
  },
];

export const MultiHopRetrieval = (ctx) => {
  const { sub } = ctx;

  // Sub=2 control-loop flowchart geometry.
  const LOOP_VB_W = 720;
  const LOOP_VB_H = 460;
  // 4 boxes vertically: Retrieve (top), Diamond (mid-upper), Generate (mid-lower), Refuse (bottom)
  // Diamond center at (vb_w/2, ~180); Retrieve box above; Generate to the right; Refuse to the left
  const BOX_W = 220;
  const BOX_H = 48;
  const CENTER_X = LOOP_VB_W / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why one retrieval isn't always enough */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Some Queries Need More Than One Retrieval
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Single-hop retrieval works when the answer fits in one chunk. Multi-hop retrieval kicks in when the question
            depends on a chain of facts that live in different docs. The signal you need it: even a perfect retrieval
            returns only half of what is needed.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Single-Hop Works
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                Query: "How do I reset my password?"
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                1 retrieval finds doc-1 (password reset).
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                Answer: "Go to Settings then Security, click Reset Password."
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Multi-Hop Needed
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                Query: "How do I reset my password if I forgot my email?"
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                1 retrieval finds doc-1 (password reset) - but the question also needs doc-3 (email change / recovery).
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                One retrieval misses half. Multiple retrievals needed.
              </T>
            </div>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── 2-hop trace */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two Hops On The Running Query
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Hop 1 retrieves doc-1, reads it, realizes it needs more. The LLM reformulates the query as a follow-up
            request and Hop 2 fires. After Hop 2 both pieces are in hand and the final answer combines them with
            citations.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {MH_HOPS.map((hop) => (
              <div
                key={hop.n}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  Hop {hop.n}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
                  Query: "{hop.query}"
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  Retrieved: {hop.retrieved}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  Reasoning: {hop.reasoning}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  Decision: <span style={{ color: C.cyan, fontWeight: 700 }}>{hop.decision}</span>
                  {hop.followUp ? ` -> Reformulate as: "${hop.followUp}"` : ""}
                </T>
              </div>
            ))}
          </div>

          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            Final answer combines doc-1 + doc-3 with citations. Each hop reformulates the query to fetch the missing
            piece.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Control loop flowchart */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Multi-Hop Control Loop
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Loop structure: retrieve, check sufficiency, generate or reformulate. A hard cap on max_hops prevents
            infinite loops. If the cap is hit without sufficiency, the system refuses.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LOOP_VB_W} ${LOOP_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Multi-hop retrieval control-loop flowchart: retrieve, check sufficiency, either generate the answer or
                reformulate the query and loop again until max_hops is reached.
              </desc>

              {/* Start: User Query */}
              <rect
                x={CENTER_X - BOX_W / 2}
                y={20}
                width={BOX_W}
                height={BOX_H}
                rx="8"
                fill={C.purple}
                fillOpacity="0.2"
                stroke={C.purple}
                strokeOpacity="0.7"
              />
              <text
                x={CENTER_X}
                y={20 + BOX_H / 2 + 5}
                fill="#b8a9ff"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>

              {/* Box: Retrieve top-k */}
              <line
                x1={CENTER_X}
                y1={20 + BOX_H}
                x2={CENTER_X}
                y2={100}
                stroke="#b8a9ff"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow)"
              />
              <rect
                x={CENTER_X - BOX_W / 2}
                y={100}
                width={BOX_W}
                height={BOX_H}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.2"
                stroke={C.cyan}
                strokeOpacity="0.7"
              />
              <text
                x={CENTER_X}
                y={100 + BOX_H / 2 + 5}
                fill="#80deea"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                Retrieve Top-K For Current Query
              </text>

              {/* Diamond: Sufficient? */}
              <line
                x1={CENTER_X}
                y1={100 + BOX_H}
                x2={CENTER_X}
                y2={190}
                stroke="#b8a9ff"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow)"
              />
              <polygon
                points={`${CENTER_X},190 ${CENTER_X + 100},250 ${CENTER_X},310 ${CENTER_X - 100},250`}
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X} y={245} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Does Context
              </text>
              <text x={CENTER_X} y={262} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Answer The Question?
              </text>

              {/* YES branch -> Generate answer */}
              <line
                x1={CENTER_X + 100}
                y1={250}
                x2={CENTER_X + 220}
                y2={250}
                stroke={C.green}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow-green)"
              />
              <text x={CENTER_X + 105} y={240} fill="#a5d6a7" fontSize="12" fontWeight="700" textAnchor="start">
                YES
              </text>
              <rect
                x={CENTER_X + 220}
                y={250 - BOX_H / 2}
                width={140}
                height={BOX_H}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X + 290} y={250 + 5} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                Generate Answer
              </text>

              {/* NO + hops < max -> Reformulate -> loop back to Retrieve */}
              <line
                x1={CENTER_X - 100}
                y1={250}
                x2={CENTER_X - 220}
                y2={250}
                stroke={C.orange}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow-orange)"
              />
              <text x={CENTER_X - 105} y={240} fill="#ffcc80" fontSize="12" fontWeight="700" textAnchor="end">
                NO + Hops &lt; max_hops
              </text>
              <rect
                x={CENTER_X - 360}
                y={250 - BOX_H / 2}
                width={140}
                height={BOX_H}
                rx="8"
                fill={C.orange}
                fillOpacity="0.2"
                stroke={C.orange}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X - 290} y={250 + 5} fill="#ffcc80" fontSize="13" fontWeight="700" textAnchor="middle">
                Reformulate Query
              </text>
              {/* Loop back arrow */}
              <path
                d={`M ${CENTER_X - 290} ${250 - BOX_H / 2} L ${CENTER_X - 290} 124 L ${CENTER_X - BOX_W / 2} 124`}
                stroke={C.orange}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#mh-arrow-orange)"
              />

              {/* NO + hops >= max -> Refuse */}
              <line
                x1={CENTER_X}
                y1={310}
                x2={CENTER_X}
                y2={370}
                stroke={C.red}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow-red)"
              />
              <text x={CENTER_X + 8} y={345} fill="#ef9a9a" fontSize="12" fontWeight="700" textAnchor="start">
                NO + Hops &gt;= max_hops
              </text>
              <rect
                x={CENTER_X - BOX_W / 2}
                y={370}
                width={BOX_W}
                height={BOX_H}
                rx="8"
                fill={C.red}
                fillOpacity="0.2"
                stroke={C.red}
                strokeOpacity="0.7"
              />
              <text
                x={CENTER_X}
                y={370 + BOX_H / 2 + 5}
                fill="#ef9a9a"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                Refuse: "I Don't Have Enough Information"
              </text>

              {/* Arrow marker defs */}
              <defs>
                <marker
                  id="mh-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#b8a9ff" opacity="0.7" />
                </marker>
                <marker
                  id="mh-arrow-green"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green} opacity="0.8" />
                </marker>
                <marker
                  id="mh-arrow-orange"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.orange} opacity="0.8" />
                </marker>
                <marker
                  id="mh-arrow-red"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.red} opacity="0.8" />
                </marker>
              </defs>
            </svg>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            max_hops typically 3-5. Each hop adds 1 retrieval + 1 LLM call latency. Tune based on workload and budget.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Sufficiency-check prompt */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Asking The Model: Do You Have Enough?
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The sufficiency check is a small structured task. The model decides whether the retrieved text answers the
            question. SUFFICIENT means "I can answer now"; INSUFFICIENT means "fetch this follow-up".
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.green}
              accent="#a5d6a7"
              title="Prompt Template - Sufficiency Check"
              template={MH_SUFFICIENCY_PROMPT}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={15}>
              Example Trace
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
              Hop 1: "INSUFFICIENT: How do I recover access if I forgot my email?"
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 4, fontFamily: "ui-monospace, monospace" }}>
              Hop 2: "SUFFICIENT"
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When to reach for multi-hop */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When To Reach For Multi-Hop
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Multi-hop is not free. Each hop multiplies latency and cost. Use it only when the query genuinely needs
            chained facts, and always with a hard cap on hops.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {MH_WORTH_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.bullets.map((b, i) => (
                    <T key={i} color={card.accent} center size={13}>
                      {b}
                    </T>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Failure modes */}
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Failure Modes: Infinite Loops And Divergence
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Three known failure modes show up in production multi-hop systems. Each has a known mitigation that costs
            either an extra check or stricter caps.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {MH_FAILURE_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <T color={card.accent} center size={13} style={{ marginTop: 8 }}>
                  {card.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.26 SelfRAG - Asai et al 2023; model decides retrieve + self-critique
// ───────────────────────────────────────────────────────────────

const SR_GATE_QUERIES = [
  {
    q: "What is 2 + 2?",
    decision: "<no-retrieve>",
    color: C.red,
    accent: "#ef9a9a",
    why: "Factoid the model already knows from pre-training.",
  },
  {
    q: "How do I reset my password?",
    decision: "<retrieve>",
    color: C.green,
    accent: "#a5d6a7",
    why: "Custom-corpus knowledge the model cannot answer without retrieval.",
  },
  {
    q: "Summarize what we just discussed.",
    decision: "<no-retrieve>",
    color: C.red,
    accent: "#ef9a9a",
    why: "Context already in the conversation; no external lookup needed.",
  },
];

const SR_TOKENS = [
  { name: "<retrieve>", color: C.green, accent: "#a5d6a7", def: "Retrieve a document now." },
  {
    name: "<no-retrieve>",
    color: C.red,
    accent: "#ef9a9a",
    def: "Do not retrieve. Answer from the model's own knowledge.",
  },
  {
    name: "<isrel>",
    color: C.cyan,
    accent: "#80deea",
    def: "Is this retrieved doc relevant? Emitted after each retrieved doc.",
  },
  {
    name: "<issup>",
    color: C.purple,
    accent: "#b8a9ff",
    def: "Is the answer supported by the retrieved doc? Emitted with the answer.",
  },
];

const SR_TIMELINE = [
  { label: "<retrieve>", role: "Model gates retrieval", color: C.green },
  { label: "Reformulate", role: "Tokens 2-3 produce a search query", color: C.cyan },
  { label: "doc-1 In", role: "Retriever returns top doc", color: "#80deea" },
  { label: "<isrel>", role: "Model judges doc-1 relevant", color: C.cyan },
  { label: "Answer", role: "Tokens 6-20 generate answer text", color: C.yellow },
  { label: "<issup>", role: "Model judges answer supported", color: C.purple },
];

const SR_CRITIQUE = [
  { doc: "doc-1 (Password Reset)", isrel: "RELEVANT", color: C.green, accent: "#a5d6a7", action: "Keep" },
  {
    doc: "doc-9 (Login Troubleshooting)",
    isrel: "PARTIALLY RELEVANT",
    color: C.yellow,
    accent: "#ffe082",
    action: "Keep But De-Weight",
  },
  { doc: "doc-22 (Rate Limits)", isrel: "IRRELEVANT", color: C.red, accent: "#ef9a9a", action: "Drop" },
];

const SR_WINS = [
  "Mixed-knowledge corpora (some queries need retrieval, some don't)",
  "Latency-sensitive workloads (skips retrieval for ~40% of queries)",
  "Adaptive depth (decides how many docs to fetch)",
];
const SR_LIMITS = [
  "Requires a model trained for Self-RAG (not plug-and-play)",
  "Token vocabulary increases serialization cost",
  "Calibration of the special-token classifier is the bottleneck",
];

export const SelfRAG = (ctx) => {
  const { sub } = ctx;

  // Sub=2 timeline geometry.
  const TL_VB_W = 720;
  const TL_VB_H = 220;
  const TL_LINE_Y = 90;
  const TL_LEFT = 60;
  const TL_RIGHT = 660;
  const TL_STEP = (TL_RIGHT - TL_LEFT) / (SR_TIMELINE.length - 1);

  // Sub=3 gate geometry.
  const GATE_VB_W = 720;
  const GATE_VB_H = 300;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── The retrieval gate problem */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Should The Model Retrieve, Or Just Answer?
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Always-retrieve wastes tokens and latency. Never-retrieve risks hallucination. Self-RAG (Asai et al. 2023)
            teaches the model to decide per-query whether retrieval is needed.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {SR_GATE_QUERIES.map((q, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${q.color}06`,
                  border: `1px solid ${q.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={q.color} bold center size={14} style={{ fontFamily: "ui-monospace, monospace" }}>
                  "{q.q}"
                </T>
                <T
                  color={q.color}
                  bold
                  center
                  size={14}
                  style={{ marginTop: 10, fontFamily: "ui-monospace, monospace" }}
                >
                  {q.decision}
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8 }}>
                  {q.why}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Four special tokens */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Four Special Tokens
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Self-RAG extends the model vocabulary with four control tokens. The model emits them inline as part of
            generation. The runtime intercepts each one and acts.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SR_TOKENS.map((tok) => (
              <div
                key={tok.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${tok.color}06`,
                  border: `1px solid ${tok.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={tok.color} bold center size={18} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {tok.name}
                </T>
                <T color={tok.accent} center size={13} style={{ marginTop: 8 }}>
                  {tok.def}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Token emission timeline */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Token Emission Timeline On A Real Query
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            For "How do I reset my password?" the model emits a sequence of control tokens interleaved with regular
            answer text. Each marker is a decision point the runtime watches.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TL_VB_W} ${TL_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Self-RAG token-emission timeline showing the model alternating between special control tokens like
                {" <retrieve>, <isrel>, and <issup>"} across the generation sequence.
              </desc>
              <line
                x1={TL_LEFT}
                y1={TL_LINE_Y}
                x2={TL_RIGHT}
                y2={TL_LINE_Y}
                stroke="#b8a9ff"
                strokeOpacity="0.6"
                strokeWidth="2"
              />
              {SR_TIMELINE.map((ev, i) => {
                const x = TL_LEFT + i * TL_STEP;
                const isAbove = i % 2 === 0;
                const labelY = isAbove ? TL_LINE_Y - 30 : TL_LINE_Y + 36;
                const roleY = isAbove ? TL_LINE_Y - 14 : TL_LINE_Y + 52;
                return (
                  <g key={i}>
                    <circle cx={x} cy={TL_LINE_Y} r="8" fill={ev.color} stroke={ev.color} strokeOpacity="0.7" />
                    <text
                      x={x}
                      y={labelY}
                      fill={ev.color}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                    >
                      {ev.label}
                    </text>
                    <text x={x} y={roleY} fill="#b8a9ff" fontSize="11" textAnchor="middle">
                      {ev.role}
                    </text>
                  </g>
                );
              })}
              <text
                x={TL_VB_W / 2}
                y={TL_VB_H - 16}
                fill="#b8a9ff"
                fontSize="12"
                fontStyle="italic"
                textAnchor="middle"
              >
                Generation Order Left-To-Right
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Retrieve / no-retrieve gate */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Retrieve / No-Retrieve Gate
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The decision diamond sits at the top of every generation. Trained via instruction tuning plus RL on
            retrieval decisions, the gate reduces unnecessary retrievals by ~40% in the original Asai et al. paper.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${GATE_VB_W} ${GATE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Retrieve / no-retrieve decision diamond that gates whether the Self-RAG model fetches external context
                for a given query.
              </desc>

              <rect
                x={260}
                y={10}
                width={200}
                height={42}
                rx="8"
                fill={C.blue}
                fillOpacity="0.2"
                stroke={C.blue}
                strokeOpacity="0.7"
              />
              <text x={360} y={36} fill="#90caf9" fontSize="13" fontWeight="700" textAnchor="middle">
                User Query
              </text>

              <line x1={360} y1={52} x2={360} y2={80} stroke="#a5d6a7" strokeOpacity="0.6" />
              <polygon
                points="360,80 480,140 360,200 240,140"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={135} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Need External
              </text>
              <text x={360} y={153} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Knowledge?
              </text>

              <line x1={480} y1={140} x2={555} y2={140} stroke={C.green} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={520} y={132} fill="#a5d6a7" fontSize="12" fontWeight="700" textAnchor="middle">
                YES
              </text>
              <rect
                x={555}
                y={120}
                width={155}
                height={42}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text
                x={632}
                y={146}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {"<retrieve> -> <isrel> -> <issup>"}
              </text>

              <line x1={240} y1={140} x2={165} y2={140} stroke={C.red} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={200} y={132} fill="#ef9a9a" fontSize="12" fontWeight="700" textAnchor="middle">
                NO
              </text>
              <rect
                x={10}
                y={120}
                width={155}
                height={42}
                rx="8"
                fill={C.red}
                fillOpacity="0.2"
                stroke={C.red}
                strokeOpacity="0.7"
              />
              <text
                x={88}
                y={146}
                fill="#ef9a9a"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {"<no-retrieve> -> Answer"}
              </text>

              <text x={360} y={240} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                Trained Via Instruction Tuning + RL
              </text>
              <text x={360} y={262} fill="#a5d6a7" fontSize="12" textAnchor="middle">
                Reduces Unnecessary Retrievals ~40% (Asai Et Al. 2023)
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Self-critique loop */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Self-Critique: Re-Score Every Retrieved Doc
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            After retrieval, the model emits an &lt;isrel&gt; token per doc to grade relevance. Irrelevant docs are
            dropped; partially relevant docs are kept but down-weighted. After the answer, the model emits an
            &lt;issup&gt; token to grade whether the answer is supported.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Per-Doc Critique
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.6fr 1.2fr 1fr",
                gap: 8,
                fontSize: 13,
              }}
            >
              <T color="#ffcc80" bold size={13}>
                Doc
              </T>
              <T color="#ffcc80" bold size={13}>
                &lt;isrel&gt; Verdict
              </T>
              <T color="#ffcc80" bold size={13}>
                Action
              </T>
              {SR_CRITIQUE.flatMap((row, i) => [
                <T key={`${i}-d`} color={row.accent} size={13}>
                  {row.doc}
                </T>,
                <T key={`${i}-v`} color={row.color} bold size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {row.isrel}
                </T>,
                <T key={`${i}-a`} color={row.accent} size={13}>
                  {row.action}
                </T>,
              ])}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              &lt;issup&gt; Final Verdict
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
              FULLY-SUPPORTED | PARTIALLY-SUPPORTED | NO-SUPPORT
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 8 }}>
              Emitted after the answer to label how grounded the answer is in the kept docs.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Wins and limits */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Self-RAG Wins And Limits
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Self-RAG is a model contract, not a prompting trick. Use it when you can fine-tune. The wins are real but
            the cost is owning the special-token classifier calibration.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Wins
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {SR_WINS.map((w, i) => (
                  <T key={i} color="#a5d6a7" center size={13}>
                    {w}
                  </T>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Limits
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {SR_LIMITS.map((l, i) => (
                  <T key={i} color="#ef9a9a" center size={13}>
                    {l}
                  </T>
                ))}
              </div>
            </div>
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Pick Self-RAG when fine-tuning is on the table and the workload mixes retrieval-needing and already-knew-it
            queries.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.27 CorrectiveRAG (CRAG) - retrieval evaluator with 3-branch tree
// ───────────────────────────────────────────────────────────────

// Sub=0 scored docs for "What is our cancellation policy for monthly plans?"
const CRAG_SCORED_DOCS = [
  {
    doc: "doc-7 (Refunds + Cancellation)",
    score: 0.92,
    verdict: "CORRECT",
    color: C.green,
    accent: "#a5d6a7",
    snippet: "Customers can cancel monthly plans any time before the next billing cycle.",
  },
  {
    doc: "doc-22 (API Rate Limits)",
    score: 0.31,
    verdict: "INCORRECT",
    color: C.red,
    accent: "#ef9a9a",
    snippet: "Free tier allows 100 requests per minute; Pro tier 1000 per minute.",
  },
  {
    doc: "doc-15 (Subscription Tiers)",
    score: 0.62,
    verdict: "AMBIGUOUS",
    color: C.yellow,
    accent: "#ffe082",
    snippet: "Monthly and annual plans differ in pricing and feature access.",
  },
];

// Sub=4 strip rows for doc-7 decomposition.
const CRAG_STRIPS = [
  { n: 1, title: "Refund Eligibility", action: "KEEP", color: C.green, accent: "#a5d6a7" },
  { n: 2, title: "Annual Plans Prorating", action: "KEEP", color: C.green, accent: "#a5d6a7" },
  { n: 3, title: "Refund Processing Time", action: "KEEP", color: C.green, accent: "#a5d6a7" },
  { n: 4, title: "Tax Handling", action: "DROP", color: C.red, accent: "#ef9a9a" },
  { n: 5, title: "Legal Disclaimers", action: "DROP", color: C.red, accent: "#ef9a9a" },
  { n: 6, title: "Chargeback Policy", action: "DROP", color: C.red, accent: "#ef9a9a" },
];

export const CorrectiveRAG = (ctx) => {
  const { sub } = ctx;

  // Sub=5 decision tree geometry.
  const TREE_VB_W = 720;
  const TREE_VB_H = 460;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Retrieval evaluator */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Score Every Retrieved Doc Before Using It
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            CRAG (Yan et al. 2024) adds a retrieval evaluator between retrieval and generation. Each doc is scored and
            classified: CORRECT (use it), AMBIGUOUS (combine with external sources), or INCORRECT (fall back to web).
            Query: "What is our cancellation policy for monthly plans?"
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {CRAG_SCORED_DOCS.map((d) => (
              <div
                key={d.doc}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${d.color}06`,
                  border: `1px solid ${d.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={d.color} bold center size={15}>
                  {d.doc} - Score {d.score} - {d.verdict}
                </T>
                <T color={d.accent} center size={13} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  "{d.snippet}"
                </T>
              </div>
            ))}
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            The evaluator can be a small classifier model or an LLM judge. Threshold below 0.5 = INCORRECT, above 0.8 =
            CORRECT, between = AMBIGUOUS.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── CORRECT branch */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Correct: Use Retrieved Docs Directly
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Highest-confidence path. Doc passes the evaluator; CRAG routes it through knowledge refinement (next
            sub-step) and then to the LLM with citations. Same flow as baseline RAG once the doc passes.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Retrieved Doc -&gt; Knowledge Refinement -&gt; Generate Answer With Citations
            </T>
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            Highest-confidence path. Same as baseline RAG once the docs pass the evaluator.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── INCORRECT branch */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Incorrect: Fall Back To Web Search
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Doc fails the evaluator. CRAG rewrites the query for web search, calls an external search API, and uses the
            web results in place of the internal doc. Trade-off versus admitting "I don't know".
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Failed Doc -&gt; Rewrite Query -&gt; External Web Search -&gt; Use Web Results -&gt; Generate Answer
            </T>
          </div>

          <T color="#ef9a9a" center size={14} style={{ marginTop: 12 }}>
            Web fallback costs latency (300-800 ms) and requires a search API. Use when refusal is unacceptable.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── AMBIGUOUS branch */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Ambiguous: Combine Internal + Web
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Doc partially answers. CRAG keeps it AND also fetches external web results, then merges both into the
            generation prompt. The hedge bet: highest cost path, lowest miss rate.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Partial Doc + Web Results -&gt; Merge Into Context -&gt; Generate Answer
            </T>
          </div>

          <T color="#ffcc80" center size={14} style={{ marginTop: 12 }}>
            Hedge bet. Highest cost. Use when refusal is unacceptable but confidence in internal docs is low.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Knowledge refinement: strips */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Decompose Retrieved Docs Into Strips
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            CRAG knowledge refinement splits each retrieved doc into 100-150 token strips and scores each strip
            individually. Off-topic strips are dropped; on-topic strips are packed. Doc-7 (Refunds) starts at 800
            tokens; after refinement, only 3 of 6 strips are kept (~50% reduction).
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={15}>
              Doc-7 Strip Breakdown
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.4fr 2fr 0.8fr",
                gap: 8,
                fontSize: 13,
              }}
            >
              <T color="#b8a9ff" bold size={13}>
                Strip
              </T>
              <T color="#b8a9ff" bold size={13}>
                Title
              </T>
              <T color="#b8a9ff" bold size={13}>
                Action
              </T>
              {CRAG_STRIPS.flatMap((s) => [
                <T key={`${s.n}-n`} color={s.accent} size={13}>
                  {s.n}
                </T>,
                <T key={`${s.n}-t`} color={s.accent} size={13}>
                  {s.title}
                </T>,
                <T key={`${s.n}-a`} color={s.color} bold size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {s.action}
                </T>,
              ])}
            </div>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            Final: 3 kept strips, ~50% of original tokens, all on-topic. Packed into the prompt for generation.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── 3-branch decision tree */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The CRAG Decision Tree
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            One evaluator, three branches, one knowledge refinement step before generation. The full Yan et al. 2024
            pipeline.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TREE_VB_W} ${TREE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                CRAG three-branch decision tree: an evaluator score routes retrieved docs to a CORRECT path (use
                directly), an AMBIGUOUS path (combine internal + web), or an INCORRECT path (web-search fallback), all
                converging into knowledge refinement before generation.
              </desc>

              {/* Root: Query + Docs */}
              <rect
                x={260}
                y={10}
                width={200}
                height={42}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.2"
                stroke={C.cyan}
                strokeOpacity="0.7"
              />
              <text x={360} y={36} fill="#80deea" fontSize="13" fontWeight="700" textAnchor="middle">
                Query + Retrieved Docs
              </text>

              {/* Diamond: Evaluator Score */}
              <line x1={360} y1={52} x2={360} y2={80} stroke="#80deea" strokeOpacity="0.6" />
              <polygon
                points="360,80 480,140 360,200 240,140"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={135} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Evaluator
              </text>
              <text x={360} y={153} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Score
              </text>

              {/* Branches */}
              {/* CORRECT */}
              <line x1={300} y1={195} x2={140} y2={250} stroke={C.green} strokeOpacity="0.7" strokeWidth="1.5" />
              <rect
                x={40}
                y={250}
                width={200}
                height={42}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text x={140} y={276} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                CORRECT -&gt; Use Docs
              </text>

              {/* AMBIGUOUS */}
              <line x1={360} y1={200} x2={360} y2={250} stroke={C.yellow} strokeOpacity="0.7" strokeWidth="1.5" />
              <rect
                x={260}
                y={250}
                width={200}
                height={42}
                rx="8"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={276} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                AMBIGUOUS -&gt; Combine
              </text>

              {/* INCORRECT */}
              <line x1={420} y1={195} x2={580} y2={250} stroke={C.red} strokeOpacity="0.7" strokeWidth="1.5" />
              <rect
                x={480}
                y={250}
                width={200}
                height={42}
                rx="8"
                fill={C.red}
                fillOpacity="0.2"
                stroke={C.red}
                strokeOpacity="0.7"
              />
              <text x={580} y={276} fill="#ef9a9a" fontSize="13" fontWeight="700" textAnchor="middle">
                INCORRECT -&gt; Web
              </text>

              {/* Converge into Knowledge Refinement */}
              <line x1={140} y1={292} x2={360} y2={340} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1" />
              <line x1={360} y1={292} x2={360} y2={340} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1" />
              <line x1={580} y1={292} x2={360} y2={340} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1" />
              <rect
                x={240}
                y={340}
                width={240}
                height={42}
                rx="8"
                fill={C.purple}
                fillOpacity="0.2"
                stroke={C.purple}
                strokeOpacity="0.7"
              />
              <text x={360} y={366} fill="#b8a9ff" fontSize="13" fontWeight="700" textAnchor="middle">
                Knowledge Refinement (Strips)
              </text>

              {/* Generate Answer */}
              <line x1={360} y1={382} x2={360} y2={410} stroke="#80deea" strokeOpacity="0.5" strokeWidth="1.5" />
              <rect
                x={260}
                y={410}
                width={200}
                height={42}
                rx="8"
                fill={C.blue}
                fillOpacity="0.2"
                stroke={C.blue}
                strokeOpacity="0.7"
              />
              <text x={360} y={436} fill="#90caf9" fontSize="13" fontWeight="700" textAnchor="middle">
                Generate Answer
              </text>
            </svg>
          </div>

          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            3 branches. 1 evaluator. All converge into knowledge refinement and generation (Yan et al. 2024).
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.28 GraphRAG - Microsoft Edge et al 2024; entity-relationship graph
// ───────────────────────────────────────────────────────────────

// 15-node legal citation graph layout. Positions hand-laid in a 800x500 viewBox
// so nodes are evenly spaced and citation edges remain legible.
// Communities: Civil Rights (red/pink, ids 1-6), Contract Law (cyan, 7-11),
// IP Law (orange, 12-15).
const GRAG_NODES = [
  { id: 1, name: "Smith v Jones", x: 130, y: 80, community: 0 },
  { id: 2, name: "Doe v Acme", x: 270, y: 60, community: 0 },
  { id: 3, name: "Roe v Tech", x: 420, y: 70, community: 0 },
  { id: 4, name: "Brown v Board", x: 200, y: 180, community: 0 },
  { id: 5, name: "Garcia v State", x: 360, y: 180, community: 0 },
  { id: 6, name: "Miller v EEOC", x: 540, y: 150, community: 0 },
  { id: 7, name: "Apex v Beta", x: 90, y: 290, community: 1 },
  { id: 8, name: "Cosmos v Stellar", x: 230, y: 320, community: 1 },
  { id: 9, name: "Delta v Epsilon", x: 370, y: 310, community: 1 },
  { id: 10, name: "Falcon v GoTech", x: 510, y: 290, community: 1 },
  { id: 11, name: "Hera v Olympus", x: 640, y: 250, community: 1 },
  { id: 12, name: "Aurora v Beacon", x: 130, y: 420, community: 2 },
  { id: 13, name: "Cipher v Decode", x: 290, y: 440, community: 2 },
  { id: 14, name: "Eagle v Falcon IP", x: 460, y: 420, community: 2 },
  { id: 15, name: "Sigma v Tau", x: 620, y: 410, community: 2 },
];

// 27 directed citation edges. Subgraph for sub=3 highlights nodes 1, 2, 3, 4, 5.
const GRAG_EDGES = [
  [1, 4],
  [2, 1],
  [2, 4],
  [3, 1],
  [3, 2],
  [4, 6],
  [5, 4],
  [5, 6],
  [6, 4],
  [3, 5],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 8],
  [9, 7],
  [10, 8],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 12],
  [12, 14],
  [13, 15],
  [7, 12],
  [9, 13],
  [11, 15],
  [2, 7],
];
const GRAG_SUBGRAPH_NODES = new Set([1, 2, 3, 4, 5]);

const GRAG_COMMUNITY_COLORS = [
  { name: "Civil Rights", color: C.red, accent: "#ef9a9a" },
  { name: "Contract Law", color: C.cyan, accent: "#80deea" },
  { name: "IP Law", color: C.orange, accent: "#ffcc80" },
];

// Sub=4 community summaries.
const GRAG_COMMUNITY_SUMMARIES = [
  {
    name: "Civil Rights",
    nodeCount: 6,
    color: C.red,
    accent: "#ef9a9a",
    summary: "Cases established protected-class precedents under Title VII and the Equal Protection Clause.",
  },
  {
    name: "Contract Law",
    nodeCount: 5,
    color: C.cyan,
    accent: "#80deea",
    summary: "Cases interpreted breach-of-contract remedies, specific performance, and damages caps.",
  },
  {
    name: "IP Law",
    nodeCount: 4,
    color: C.orange,
    accent: "#ffcc80",
    summary: "Cases shaped fair-use boundaries, trademark dilution, and software copyrightability.",
  },
];

// Sub=5 global vs local examples.
const GRAG_GLOBAL_LOCAL = [
  {
    type: "Local Query",
    color: C.green,
    accent: "#a5d6a7",
    query: "How did the court rule in Smith v Jones?",
    plan: "Retrieve the Smith v Jones node + 1-hop neighbors (5 nodes total).",
    answer: "Direct answer from the subgraph.",
  },
  {
    type: "Global Query",
    color: C.purple,
    accent: "#b8a9ff",
    query: "What are the main themes across this corpus?",
    plan: "Retrieve all 3 community summaries; map-reduce summarize them.",
    answer: "High-level themes answer the question without retrieving every doc.",
  },
];

// Sub=6 worth-it grid (2x2).
const GRAG_WORTH_CARDS = [
  {
    title: "Worth It",
    color: C.green,
    accent: "#a5d6a7",
    bullets: [
      "Rich entity-relationship corpus (legal, biomedical, code)",
      "Global queries common (themes, summaries, comparisons)",
      "Long-term value (build the graph once, query many times)",
    ],
  },
  {
    title: "Not Worth It",
    color: C.red,
    accent: "#ef9a9a",
    bullets: [
      "Mostly self-contained docs (FAQ, support KB - like our primary corpus)",
      "Only local / factoid queries",
      "Schema churn (entities change weekly)",
    ],
  },
  {
    title: "Cost",
    color: C.orange,
    accent: "#ffcc80",
    bullets: [
      "Per-doc LLM extraction at index time (~$0.02 per doc)",
      "Re-extract on doc changes",
      "Graph storage + community detection compute",
    ],
  },
  {
    title: "Mitigations",
    color: C.cyan,
    accent: "#80deea",
    bullets: [
      "Cache extractions",
      "Run community detection nightly, not per-query",
      "Hybrid: GraphRAG for global queries, naive RAG for local",
    ],
  },
];

export const GraphRAG = (ctx) => {
  const { sub } = ctx;
  const GR_VB_W = 800;
  const GR_VB_H = 500;

  const renderGraph = (highlightSet = null, useCommunityColors = false, descText) => (
    <svg viewBox={`0 0 ${GR_VB_W} ${GR_VB_H}`} width="100%" style={{ maxWidth: 800, height: "auto" }}>
      <desc>{descText}</desc>
      {/* Edges */}
      {GRAG_EDGES.map(([from, to], i) => {
        const fromNode = GRAG_NODES.find((n) => n.id === from);
        const toNode = GRAG_NODES.find((n) => n.id === to);
        const isHighlighted = highlightSet && highlightSet.has(from) && highlightSet.has(to);
        return (
          <line
            key={i}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke={isHighlighted ? C.orange : "#80deea"}
            strokeOpacity={isHighlighted ? "0.9" : "0.25"}
            strokeWidth={isHighlighted ? "2.5" : "1"}
          />
        );
      })}
      {/* Nodes */}
      {GRAG_NODES.map((n) => {
        const isHighlighted = highlightSet && highlightSet.has(n.id);
        const fillColor = useCommunityColors ? GRAG_COMMUNITY_COLORS[n.community].color : C.purple;
        const accentColor = useCommunityColors ? GRAG_COMMUNITY_COLORS[n.community].accent : "#b8a9ff";
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={isHighlighted ? "14" : "10"}
              fill={isHighlighted ? C.orange : fillColor}
              fillOpacity={isHighlighted ? "0.6" : "0.3"}
              stroke={isHighlighted ? C.orange : fillColor}
              strokeWidth={isHighlighted ? "2.5" : "1.5"}
            />
            <text
              x={n.x}
              y={n.y + 26}
              fill={isHighlighted ? "#ffcc80" : accentColor}
              fontSize="11"
              textAnchor="middle"
              fontWeight={isHighlighted ? "700" : "400"}
            >
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Corpus switch */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Why This Chapter Uses A Different Corpus
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The customer-support corpus is mostly self-contained how-to pages. Relationships are sparse, so GraphRAG
            over it would build a thin graph. This chapter switches to a 15-node legal-citation network because the
            customer-support corpus lacks rich entity-relationship structure.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Customer Support Corpus - Won't Fit
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                30 docs, mostly self-contained how-to pages. Relationships sparse. A graph here would have few edges and
                demonstrate nothing.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Legal Citation Network - Fits
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                15 case decisions where each cites 2-5 prior cases. Rich entities (Plaintiff, Defendant, Court, Statute)
                and a real graph topology.
              </T>
            </div>
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            The customer-support corpus returns in chapter 12.29. This chapter only uses the legal-citation secondary
            corpus.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Entity + relation extraction */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Offline: Extract Entities And Relations With An LLM
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Each case runs through an LLM extraction prompt once at index time. The LLM emits entities (people,
            organizations, statutes) and relations (sued, decided-in, applies, holding). Cost is ~$0.02 per doc.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={15}>
              Example: "Smith v Jones (2018)"
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <T color="#80deea" bold size={14}>
                  Entities
                </T>
                <T color="#80deea" size={13} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  Smith (Plaintiff)
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Jones (Defendant)
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Northern District Court
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Title VII (Statute)
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  "Discrimination Found" (Holding)
                </T>
              </div>
              <div style={{ textAlign: "center" }}>
                <T color="#80deea" bold size={14}>
                  Relations
                </T>
                <T color="#80deea" size={13} style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                  Smith -- sued --&gt; Jones
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Smith v Jones -- decided-in --&gt; Northern District Court
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Smith v Jones -- applies --&gt; Title VII
                </T>
                <T color="#80deea" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Smith v Jones -- holding --&gt; Discrimination Found
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── 15-node graph */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The 15-Node Citation Graph
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Built once offline. Each node is a case; each directed edge is a citation from the citing case to the cited
            case. Updated incrementally as new cases come in.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            {renderGraph(
              null,
              false,
              "Fifteen-node legal citation graph used as the GraphRAG running corpus, with cases as nodes and directed citation edges between them.",
            )}
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            15 cases, 27 citation edges. Built once offline; updated incrementally as new cases arrive.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Subgraph retrieval */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Query Time: Retrieve A Subgraph
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Query: "What is the precedent chain for workplace discrimination cases?" The retriever finds a 5-node
            subgraph (Smith v Jones, Doe v Acme, Roe v Tech, Brown v Board, Garcia v State) and sends only those nodes +
            their edges to the LLM. Entity-aware retrieval; the graph topology is the signal.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            {renderGraph(
              GRAG_SUBGRAPH_NODES,
              false,
              "Subgraph retrieval highlight on the 15-node citation graph showing how a query selects a 5-node connected component (a precedent chain) as the retrieved context.",
            )}
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            5 nodes highlighted in orange. The LLM reads only the highlighted subgraph - not the whole 15-node corpus.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Communities */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Communities: Cluster The Graph For Global Queries
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Community detection (Leiden or Louvain) groups densely-connected nodes into clusters. Each community gets an
            LLM-generated summary at index time. Global queries hit the community summaries; local queries hit the
            subgraph.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            {renderGraph(
              null,
              true,
              "Same 15-node citation graph re-colored into three communities (Civil Rights, Contract Law, IP Law) for global-query summarization.",
            )}
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {GRAG_COMMUNITY_SUMMARIES.map((c) => (
              <div
                key={c.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${c.color}06`,
                  border: `1px solid ${c.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={c.color} bold center size={15}>
                  {c.name} ({c.nodeCount} Nodes)
                </T>
                <T color={c.accent} center size={13} style={{ marginTop: 6 }}>
                  {c.summary}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Global vs local */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Global Queries Use Communities, Local Queries Use Subgraphs
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Two query patterns, two routing paths. Local queries need a specific subgraph; global queries need an
            overview that no single subgraph contains.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {GRAG_GLOBAL_LOCAL.map((q) => (
              <div
                key={q.type}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${q.color}06`,
                  border: `1px solid ${q.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={q.color} bold center size={15}>
                  {q.type}
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
                  "{q.query}"
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8 }}>
                  Plan: {q.plan}
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8 }}>
                  Output: {q.answer}
                </T>
              </div>
            ))}
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Global queries are GraphRAG's killer feature. Naive RAG cannot answer them without retrieving everything;
            GraphRAG answers from the community summaries.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── When worth it */}
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            When To Reach For GraphRAG
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            GraphRAG is expensive to build and maintain. Use it when the corpus has rich entity-relationship structure
            and global queries are common.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {GRAG_WORTH_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.bullets.map((b, i) => (
                    <T key={i} color={card.accent} center size={13}>
                      {b}
                    </T>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.29 AgenticRAG - tool-augmented loop; retrieval is one tool of many
// ───────────────────────────────────────────────────────────────

const AR_TOOLS = [
  {
    name: "Vector Search",
    color: C.cyan,
    accent: "#80deea",
    desc: "Semantic retrieval over your embedded chunks. The RAG we have been building.",
  },
  {
    name: "SQL Query",
    color: C.green,
    accent: "#a5d6a7",
    desc: "Structured lookups over a relational store. Pricing tables, user accounts.",
  },
  {
    name: "Calculator",
    color: C.orange,
    accent: "#ffcc80",
    desc: "Precise arithmetic. Models are bad at math; calculators are not.",
  },
  {
    name: "Web Search",
    color: C.purple,
    accent: "#b8a9ff",
    desc: "Fresh or out-of-corpus info. Used as a fallback or for time-sensitive queries.",
  },
];

const AR_TRACE = `User: Compare the Pro and Enterprise plans.

Model: I need the pricing table. Calling tool.
  tool_call: sql_query(table="plans", filter="name in ('Pro','Enterprise')")
  tool_response: [{"plan":"Pro","price":29,"users":10},
                  {"plan":"Enterprise","price":199,"users":"unlimited"}]

Model: I also need feature comparison docs. Calling tool.
  tool_call: vector_search(query="Pro vs Enterprise features", k=3)
  tool_response: [doc-15 chunk 1, doc-15 chunk 2, doc-19 chunk 1]

Model: Now I can answer. Generating response with citations.`;

const AR_TURNS = [
  {
    n: 1,
    tool: "vector_search",
    args: '("Pro Enterprise comparison")',
    output: "3 chunks (doc-15 + doc-19)",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    n: 2,
    tool: "sql_query",
    args: "(SELECT price FROM plans WHERE name='Pro')",
    output: "$29 per seat",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    n: 3,
    tool: "calculator",
    args: "(25 x 29)",
    output: "725",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    n: 4,
    tool: "Final Answer",
    args: "",
    output:
      "Pro is $29/seat. 25 users => $725/month. Pro includes features X, Y, Z [doc-15]; Enterprise adds SSO + audit logs [doc-19].",
    color: C.pink,
    accent: "#f48fb1",
  },
];

const AR_CONTROL_CARDS = [
  {
    title: "Hard Caps",
    color: C.red,
    accent: "#ef9a9a",
    bullets: [
      "max_iterations (typically 5-10)",
      "Total tool calls per query (rate-limit by tool)",
      "Wall-clock budget (timeout in seconds)",
    ],
  },
  {
    title: "Soft Signals",
    color: C.yellow,
    accent: "#ffe082",
    bullets: [
      "Model emits 'final answer' marker",
      "Same tool called with same args twice in a row -> divergence flag",
      "Tool error rate above threshold -> abort and refuse",
    ],
  },
  {
    title: "Cost Tracking",
    color: C.purple,
    accent: "#b8a9ff",
    bullets: [
      "Each tool call has a fixed cost; sum across iterations",
      "Alert if over per-query budget",
      "Bill chargebacks to feature owners",
    ],
  },
  {
    title: "Mitigations",
    color: C.cyan,
    accent: "#80deea",
    bullets: [
      "Cap iterations strictly",
      "Cache tool responses by exact args (especially vector_search)",
      "Use a smaller orchestrator model",
    ],
  },
];

export const AgenticRAG = (ctx) => {
  const { sub } = ctx;

  const LOOP_VB_W = 720;
  const LOOP_VB_H = 380;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Retrieval as one tool */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Retrieval Is One Tool. Add More.
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Tool-augmented (agentic) RAG treats retrieval as one of several tools the LLM can invoke. SQL, calculators,
            web search, and internal APIs sit alongside it. The model picks the right tool per query.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {AR_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${tool.color}06`,
                  border: `1px solid ${tool.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={tool.color} bold center size={14}>
                  {tool.name}
                </T>
                <T color={tool.accent} center size={12} style={{ marginTop: 6 }}>
                  {tool.desc}
                </T>
              </div>
            ))}
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            The LLM decides which tool to call. Function-calling pattern. Each tool returns text the model can read.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Function-calling pattern */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Function-Calling: How The Model Picks A Tool
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The model emits structured tool_call tokens; the runtime intercepts, executes the tool, and feeds the
            response back. The loop continues until the model emits a final answer or hits max_iterations.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock color={C.cyan} accent="#80deea" title="Function-Calling Trace" template={AR_TRACE} />
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Tool-call loop */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Tool-Call Loop
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The control loop runs until the model declares done or max_iterations is reached. A loopback path lets the
            model chain multiple tool calls.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LOOP_VB_W} ${LOOP_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Tool-call loop flowchart for agentic RAG: model emits a tool_call, the runtime executes the tool and
                feeds the response back, looping until the model emits a final answer or hits max_iterations.
              </desc>

              <rect
                x={260}
                y={10}
                width={200}
                height={42}
                rx="8"
                fill={C.blue}
                fillOpacity="0.2"
                stroke={C.blue}
                strokeOpacity="0.7"
              />
              <text x={360} y={36} fill="#90caf9" fontSize="13" fontWeight="700" textAnchor="middle">
                User Query
              </text>

              <line x1={360} y1={52} x2={360} y2={80} stroke="#b8a9ff" strokeOpacity="0.6" />
              <rect
                x={260}
                y={80}
                width={200}
                height={42}
                rx="8"
                fill={C.purple}
                fillOpacity="0.2"
                stroke={C.purple}
                strokeOpacity="0.7"
              />
              <text x={360} y={106} fill="#b8a9ff" fontSize="13" fontWeight="700" textAnchor="middle">
                Model
              </text>

              <line x1={360} y1={122} x2={360} y2={150} stroke="#b8a9ff" strokeOpacity="0.6" />
              <polygon
                points="360,150 470,200 360,250 250,200"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={195} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Need A
              </text>
              <text x={360} y={213} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Tool?
              </text>

              <line x1={470} y1={200} x2={555} y2={200} stroke={C.cyan} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={510} y={192} fill="#80deea" fontSize="12" fontWeight="700" textAnchor="middle">
                YES
              </text>
              <rect
                x={555}
                y={180}
                width={155}
                height={42}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.2"
                stroke={C.cyan}
                strokeOpacity="0.7"
              />
              <text
                x={633}
                y={206}
                fill="#80deea"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                tool_call(...)
              </text>
              <path
                d={`M ${633} ${222} L ${633} ${290} L ${360} ${290} L ${360} ${122}`}
                stroke={C.cyan}
                strokeOpacity="0.6"
                strokeWidth="1.5"
                fill="none"
              />
              <text x={500} y={285} fill="#80deea" fontSize="11" textAnchor="middle">
                tool_response Fed Back
              </text>

              <line x1={250} y1={200} x2={165} y2={200} stroke={C.green} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={210} y={192} fill="#a5d6a7" fontSize="12" fontWeight="700" textAnchor="middle">
                NO
              </text>
              <rect
                x={10}
                y={180}
                width={155}
                height={42}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text x={87} y={206} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                Final Answer
              </text>

              <text x={360} y={330} fill="#b8a9ff" fontSize="13" fontWeight="700" textAnchor="middle">
                max_iterations = 10
              </text>
              <text x={360} y={350} fill="#b8a9ff" fontSize="12" textAnchor="middle">
                Hard Cap Prevents Runaway Loops
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Worked multi-tool trace */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Worked Example: Multi-Tool Trace
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Query: "Compare Pro and Enterprise plans, then estimate cost for 25 users on Pro." Four turns, three tools,
            one final answer.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {AR_TURNS.map((turn) => (
              <div
                key={turn.n}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${turn.color}06`,
                  border: `1px solid ${turn.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={turn.color} bold center size={15}>
                  Turn {turn.n}: {turn.tool}
                  {turn.args}
                </T>
                <T color={turn.accent} center size={13} style={{ marginTop: 6 }}>
                  {turn.output}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Loop control */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Loop Control: Termination Criteria
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Termination is a layered defense. Hard caps stop runaway loops; soft signals catch loops that are
            technically progressing but diverging; cost tracking catches expensive flows; mitigations cut the rate.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {AR_CONTROL_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.bullets.map((b, i) => (
                    <T key={i} color={card.accent} center size={13}>
                      {b}
                    </T>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Orchestration */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Orchestration: Frameworks Like LangGraph
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Pick orchestration last. The patterns above work without any framework. Frameworks are a productivity
            choice, not a correctness one. Chapters 12.36-12.40 cover framework choice in depth.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={15}>
                DIY (Custom While Loop)
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                You implement the function-calling parse, tool dispatch, max_iterations check, response merge yourself.
                Full control. More code.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={15}>
                LangGraph And Similar Frameworks
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 8 }}>
                Graph-shaped state machine for tool flows. Nodes are tool calls, edges are transitions. Built-in
                checkpointing, retries, human-in-the-loop. Less code. Framework lock-in.
              </T>
            </div>
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Pick a framework when it saves more time than it costs. Patterns above are framework-agnostic.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.30 LongContextVsRAG - compare long-context-only, RAG-only, hybrid
// ───────────────────────────────────────────────────────────────

// Sub=4 grouped bar chart data.
const LCR_METRICS = [
  {
    name: "Cost (Per Query)",
    unit: "$",
    bars: [
      { label: "RAG-Only", value: 0.008, color: C.green, accent: "#a5d6a7" },
      { label: "Hybrid", value: 0.15, color: C.yellow, accent: "#ffe082" },
      { label: "Long-Context-Only", value: 0.36, color: C.red, accent: "#ef9a9a" },
    ],
    max: 0.4,
    fmt: (v) => `$${v.toFixed(3)}`,
  },
  {
    name: "Latency P50 (Seconds)",
    unit: "s",
    bars: [
      { label: "RAG-Only", value: 1.5, color: C.green, accent: "#a5d6a7" },
      { label: "Hybrid", value: 3.0, color: C.yellow, accent: "#ffe082" },
      { label: "Long-Context-Only", value: 6.0, color: C.red, accent: "#ef9a9a" },
    ],
    max: 7.0,
    fmt: (v) => `${v.toFixed(1)}s`,
  },
  {
    name: "Accuracy (Golden Recall)",
    unit: "%",
    bars: [
      { label: "RAG-Only", value: 78, color: C.green, accent: "#a5d6a7" },
      { label: "Hybrid", value: 92, color: C.green, accent: "#a5d6a7" },
      { label: "Long-Context-Only", value: 84, color: C.yellow, accent: "#ffe082" },
    ],
    max: 100,
    fmt: (v) => `${v}%`,
  },
];

// Sub=5 decision cards.
const LCR_DECISION_CARDS = [
  {
    title: "RAG Only",
    color: C.green,
    accent: "#a5d6a7",
    bullets: [
      "Cost-critical at scale (~$0.008/query)",
      "Latency-critical (~1.5s p50)",
      "Large multi-doc corpus",
      "Citations required (chunk-level provenance)",
    ],
  },
  {
    title: "Hybrid",
    color: C.yellow,
    accent: "#ffe082",
    bullets: [
      "Default for production",
      "Best accuracy on accuracy-critical workloads",
      "Acceptable cost + latency tradeoff",
      "Citations still feasible",
    ],
  },
  {
    title: "Long-Context Only",
    color: C.red,
    accent: "#ef9a9a",
    bullets: [
      "Single long document corpus",
      "Low query volume (cost not pressing)",
      "Citations not required (or post-extracted)",
      "No retrieval infrastructure available",
    ],
  },
];

export const LongContextVsRAG = (ctx) => {
  const { sub } = ctx;

  // Sub=4 bar chart geometry.
  const CHART_VB_W = 800;
  const CHART_VB_H = 480;
  const CHART_PAD_L = 60;
  const CHART_PAD_R = 30;
  const CHART_PAD_T = 30;
  const CHART_PAD_B = 60;
  const GROUP_GAP = 36;
  const BAR_W = 56;
  const BARS_PER_GROUP = 3;
  const GROUP_W = BARS_PER_GROUP * BAR_W + (BARS_PER_GROUP - 1) * 8;
  const GROUPS = LCR_METRICS.length;
  const TOTAL_BARS_W = GROUPS * GROUP_W + (GROUPS - 1) * GROUP_GAP;
  const CHART_PLOT_W = CHART_VB_W - CHART_PAD_L - CHART_PAD_R;
  const CHART_PLOT_H = CHART_VB_H - CHART_PAD_T - CHART_PAD_B;
  const X_START = CHART_PAD_L + (CHART_PLOT_W - TOTAL_BARS_W) / 2;
  const BAR_BOTTOM = CHART_PAD_T + CHART_PLOT_H;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Corpus switch */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            This Chapter Uses A 200-Page Product Manual
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The customer-support corpus has 30 small docs that retrieval handles cleanly. To compare retrieval against
            "just stuff it in the prompt", this chapter switches to a single 200-page product manual that fits in a
            modern context window.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={15}>
                Customer Support Corpus - 30 Small Docs
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 8 }}>
                30 docs at 500-2000 tokens each. Total ~50k tokens. Already fits in modern context windows BUT
                distributed across 30 distinct docs - retrieval is the natural pattern.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={15}>
                200-Page Product Manual - 1 Large Doc
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                A single 200-page reference, ~120k tokens. Fits in a 200k context window. The "do I even need RAG?" test
                case for the secondary corpus.
              </T>
            </div>
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            When the entire knowledge base is one long document and fits in the context window, the retrieval question
            changes shape.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Long-context only */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Long-Context Only: Stuff Everything In
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Pack ALL 120k tokens of the manual into the prompt. The LLM reads everything and answers. Simple. Expensive.
            Slow. And subject to lost-in-the-middle (chapter 12.23) for facts buried in the middle pages.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              User Query -&gt; Pack ALL 120k Tokens -&gt; LLM Reads -&gt; Answer
            </T>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Cost
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                At $3 per 1M input tokens, this is $0.36 per query.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Latency
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                120k tokens to read -&gt; 5-8 seconds first-token latency.
              </T>
            </div>
          </div>

          <T color="#ef9a9a" center size={14} style={{ marginTop: 12 }}>
            Simple. Expensive. Slow. And subject to lost-in-the-middle for facts buried mid-document.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── RAG only */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            RAG Only: Chunk, Retrieve, Pack Small
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Chunk the 200-page manual into 240 chunks of 512 tokens. At query time, embed the query, retrieve top-5
            (2,560 tokens), pack into prompt. Massively cheaper. Massively faster. Risk: if the relevant chunk isn't in
            top-5, you get the wrong answer.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Chunk Manual Into 240 Chunks -&gt; Retrieve Top-5 -&gt; Pack ~2,560 Tokens -&gt; LLM Reads -&gt; Answer
            </T>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Cost
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                ~$0.008 per query - ~45x cheaper than long-context-only.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Latency
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                50ms retrieval + 1-2s generation = ~1.5s.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Risk
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                If relevant chunk missed by top-5, the answer is wrong.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Hybrid */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Hybrid: Retrieve Top-30, Pack 50k Tokens
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The pragmatic middle. Retrieve top-30 chunks (15,000 tokens), optionally rerank, then pack 50k tokens into
            the prompt. Reorder using lost-in-middle strategies (front-load or sandwich, from chapter 12.23). Cost and
            latency sit between the extremes; accuracy is highest because more candidate chunks lowers miss rate.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Retrieve Top-30 -&gt; Optional Rerank -&gt; Pack 50k Tokens -&gt; Front-Load Or Sandwich -&gt; LLM -&gt;
              Answer
            </T>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}30`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Cost
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                ~$0.15 per query (5x cheaper than long-context-only).
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}30`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Latency
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                80ms retrieval + 3s generation = ~3s.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                Accuracy
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Highest. More candidates = lower miss rate.
              </T>
            </div>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            The pragmatic middle. Most production systems land here.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Cost / latency / accuracy chart */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Cost, Latency, Accuracy: Side By Side
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Three metrics, three strategies. Each bar group shows RAG-only (green), Hybrid (yellow), and
            Long-Context-Only (red) side by side. Hybrid wins on accuracy; RAG-only wins on cost and latency.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${CHART_VB_W} ${CHART_VB_H}`} width="100%" style={{ maxWidth: 800, height: "auto" }}>
              <desc>
                Grouped bar chart comparing cost, latency, and accuracy across three strategies for the 200-page product
                manual: RAG-only, hybrid retrieve-broadly, and long-context-only stuffing of the full document.
              </desc>

              {/* Baseline */}
              <line
                x1={CHART_PAD_L}
                y1={BAR_BOTTOM}
                x2={CHART_VB_W - CHART_PAD_R}
                y2={BAR_BOTTOM}
                stroke="#ffcc80"
                strokeOpacity="0.5"
              />

              {LCR_METRICS.map((metric, gi) => {
                const groupX = X_START + gi * (GROUP_W + GROUP_GAP);
                return (
                  <g key={metric.name}>
                    {/* Group label */}
                    <text
                      x={groupX + GROUP_W / 2}
                      y={BAR_BOTTOM + 24}
                      fill="#ffcc80"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {metric.name}
                    </text>
                    {metric.bars.map((bar, bi) => {
                      const x = groupX + bi * (BAR_W + 8);
                      const h = (bar.value / metric.max) * CHART_PLOT_H;
                      const y = BAR_BOTTOM - h;
                      return (
                        <g key={bar.label}>
                          <rect
                            x={x}
                            y={y}
                            width={BAR_W}
                            height={h}
                            fill={bar.color}
                            fillOpacity="0.3"
                            stroke={bar.color}
                            strokeOpacity="0.7"
                          />
                          <text
                            x={x + BAR_W / 2}
                            y={y - 6}
                            fill={bar.accent}
                            fontSize="12"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {metric.fmt(bar.value)}
                          </text>
                          <text
                            x={x + BAR_W / 2}
                            y={BAR_BOTTOM + 40}
                            fill={bar.accent}
                            fontSize="10"
                            textAnchor="middle"
                            transform={`rotate(-12 ${x + BAR_W / 2} ${BAR_BOTTOM + 40})`}
                          >
                            {bar.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          <T color="#ffcc80" center size={14} style={{ marginTop: 12 }}>
            Hybrid is the production default. Long-context-only is a niche path. RAG-only is for high-volume,
            cost-sensitive systems.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Decision */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Decision: When Each One Wins
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Three strategies, three sweet spots. Pick by which trade-off your workload cares about most. Hybrid is the
            production default; RAG-only and long-context-only are intentional choices for specific shapes.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {LCR_DECISION_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.bullets.map((b, i) => (
                    <T key={i} color={card.accent} center size={13}>
                      {b}
                    </T>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            Hybrid is the production default. Long-context-only is a niche. RAG-only is for high-volume cost-sensitive
            systems.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};
