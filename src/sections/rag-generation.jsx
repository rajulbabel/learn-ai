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

export const LostInTheMiddle = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            The Lost-in-the-Middle Problem (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const CitationsRefusal = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Citations, Refusal and Groundedness (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const MultiHopRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Multi-Hop Retrieval (stub)
          </T>
        </Box>
      )}
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
