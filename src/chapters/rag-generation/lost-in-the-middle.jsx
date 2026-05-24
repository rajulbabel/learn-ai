import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
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

const LITM_FAILURE_CARDS = [
  {
    title: "Truly Long Multi-Fact Queries",
    body: (
      <>
        30 chunks all needed; even sandwich leaves middle facts ignored. Fix: hierarchical summarization or multi-hop
        retrieval (<ChapterLink to="22.4">chapter 22.4</ChapterLink>).
      </>
    ),
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

export default function LostInTheMiddle(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

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
      {sub < 4 && (
        <SubBtn
          key={sub}
          onClick={() => {
            setSubBtnRipple(Date.now());
            navigate("forward");
          }}
          rippleKey={subBtnRipple}
          registerSubBtn={registerSubBtn}
        />
      )}
    </div>
  );
}
