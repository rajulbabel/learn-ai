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

export const SelfRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Self-RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const CorrectiveRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            CRAG - Corrective RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const GraphRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            GraphRAG (Microsoft 2024) (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const AgenticRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tool-Augmented and Agentic RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const LongContextVsRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Long-Context vs RAG (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
