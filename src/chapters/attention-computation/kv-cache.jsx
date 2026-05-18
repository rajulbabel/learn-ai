import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function KVCache(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const subBtn = (s) =>
    sub === s && (
      <SubBtn
        key={sub}
        onClick={() => {
          setSubBtnRipple(Date.now());
          navigate("forward");
        }}
        rippleKey={subBtnRipple}
        registerSubBtn={registerSubBtn}
      />
    );

  const inner = (color, children, extra = {}) => (
    <div
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        background: `${color}08`,
        border: `1px solid ${color}20`,
        ...extra,
      }}
    >
      {children}
    </div>
  );

  const mono = (color, text, size = 14) => (
    <div style={{ textAlign: "center", marginTop: 6 }}>
      <code style={{ color, fontSize: size }}>{text}</code>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: Naive Generation Redoes History ── */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Problem - Naive Generation Redoes History
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            To generate each new word, the naive approach re-processes every previous word from scratch. Watch the work
            pile up across three steps of generating "I love cats":
          </T>

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={15}>
                Work at each step (green = new, red = redundant)
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg data-viz="work-bars" width="520" height="180" viewBox="0 0 520 180">
                  <desc>
                    Three stacked work rows showing naive generation redoing history: step 1 with 1 green new block,
                    step 2 with 1 red redundant block and 1 green new block, step 3 with 2 red redundant blocks and 1
                    green new block, illustrating how computation piles up quadratically when the KV cache is not used
                  </desc>
                  {[
                    { y: 10, label: 'Step 1 ("I")', blocks: ["new"] },
                    { y: 68, label: 'Step 2 ("love")', blocks: ["red", "new"] },
                    { y: 126, label: 'Step 3 ("cats")', blocks: ["red", "red", "new"] },
                  ].map(({ y, label, blocks }) => (
                    <g key={y}>
                      <text x="10" y={y + 30} fill={C.dim} fontSize="14">
                        {label}
                      </text>
                      {blocks.map((kind, i) => (
                        <rect
                          key={`r${i}`}
                          data-block={kind}
                          x={150 + i * 56}
                          y={y}
                          width="48"
                          height="44"
                          rx="6"
                          fill={kind === "new" ? C.green : C.red}
                          fillOpacity="0.32"
                          stroke={kind === "new" ? C.green : C.red}
                          strokeWidth="1.5"
                        />
                      ))}
                      {blocks.map((kind, i) => (
                        <text
                          key={`t${i}`}
                          x={150 + i * 56 + 24}
                          y={y + 28}
                          fill={kind === "new" ? C.green : C.red}
                          fontSize="12"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {kind === "new" ? "new" : "redo"}
                        </text>
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                Each block = one token's Q, K, V computed. Green blocks are real new work. Red blocks are identical to
                work done in earlier steps.
              </T>
            </>,
          )}

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={15}>
                Counting the waste across 3 steps
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3, textAlign: "center" }}>
                <T color={C.dim} center size={14}>
                  Total work: 1 + 2 + 3 = <strong style={{ color: "#ef9a9a" }}>6 blocks</strong>
                </T>
                <T color={C.dim} center size={14}>
                  Actually useful: <strong style={{ color: C.green }}>3 blocks</strong>
                </T>
                <T color="#ef9a9a" center size={14} bold>
                  Wasted: 3 blocks (50%)
                </T>
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                At 1000 tokens: 500,500 blocks of work, only 1000 are useful. 99.8% wasted.
              </T>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Naive generation recomputes identical numbers every step. This chapter shows the one-line fix that makes
                ChatGPT feel instant.
              </T>
            </>,
          )}
        </Box>
      )}
      {subBtn(0)}

      {/* ── Sub 1: Same Input Same Output ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            The Lightbulb - Same Input, Same Output, Always
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 8 }}>
            When step 2 re-processes the token "I", does it get the same numbers as step 1 did? Let's check.
          </T>

          {inner(
            C.yellow,
            <>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}30`,
                    minWidth: 200,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" bold center size={14}>
                    Step 1 computed
                  </T>
                  <code style={{ color: C.cyan, fontSize: 14, display: "block", marginTop: 6, textAlign: "center" }}>
                    q_I = W_Q · x_I
                  </code>
                  <code
                    style={{
                      color: C.cyan,
                      fontSize: 15,
                      display: "block",
                      marginTop: 4,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    = [0.5, 0.2]
                  </code>
                </div>
                <div style={{ fontSize: 32, color: "#fff176", fontWeight: 700 }}>=</div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}30`,
                    minWidth: 200,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" bold center size={14}>
                    Step 2 re-computed
                  </T>
                  <code style={{ color: C.cyan, fontSize: 14, display: "block", marginTop: 6, textAlign: "center" }}>
                    q_I = W_Q · x_I
                  </code>
                  <code
                    style={{
                      color: C.cyan,
                      fontSize: 15,
                      display: "block",
                      marginTop: 4,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    = [0.5, 0.2]
                  </code>
                </div>
              </div>
              <T color="#fff176" bold center size={15} style={{ marginTop: 10 }}>
                Identical. Every. Single. Time.
              </T>
            </>,
          )}

          {inner(
            C.purple,
            <>
              <T color="#b8a9ff" bold center size={14}>
                Why identical? Because neither input has changed.
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={14}>
                  <strong style={{ color: "#b8a9ff" }}>x_I</strong> (embedding for "I") is frozen: tokens don't change
                  their embedding mid-generation.
                </T>
                <T color={C.dim} size={14}>
                  <strong style={{ color: "#b8a9ff" }}>W_Q</strong> (weight matrix) is frozen: trained weights don't
                  change during inference.
                </T>
                <T color="#b8a9ff" size={14} bold style={{ marginTop: 4 }}>
                  Same input · same weights = same output, ALWAYS.
                </T>
              </div>
            </>,
          )}

          {inner(
            C.green,
            <>
              <T color="#a5d6a7" bold center size={15}>
                So stop recomputing. Save the answer the first time. That's a cache.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(1)}

      {/* ── Sub 2: The Matrix View (Star Sub) ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The Matrix View - Only the Last Row Is New
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
            Attention is matrix multiplication. Let's draw the full matmul at step 3 (generating "cats") and see which
            parts of the matrices we actually need.
          </T>

          {inner(
            C.purple,
            <>
              <T color="#b8a9ff" bold center size={15}>
                Q · Kᵀ = Scores, and Scores · V = Output
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10, overflowX: "auto" }}>
                <svg data-viz="matrix-view" width="680" height="400" viewBox="0 0 680 400">
                  <desc>
                    Side by side attention matrix multiplications at generation step 3: Q times K transpose equals
                    Scores (3 by 3) with rows for I and love dimmed because they were already computed at earlier steps
                    and only the last row for cats glows, and Scores times V equals Output with only the last row
                    highlighted as the new result
                  </desc>

                  <text x="340" y="16" fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
                    Scores = Q · Kᵀ
                  </text>

                  {/* Q matrix */}
                  <g transform="translate(20, 28)">
                    <text x="50" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Q (3×d)
                    </text>
                    {[
                      { label: "q_I", dim: true },
                      { label: "q_love", dim: true },
                      { label: "q_cats", dim: false },
                    ].map((row, i) => (
                      <g key={`q${i}`}>
                        <rect
                          x="0"
                          y={i * 32}
                          width="100"
                          height="28"
                          rx="4"
                          fill={row.dim ? "#666" : C.purple}
                          fillOpacity={row.dim ? 0.12 : 0.4}
                          stroke={row.dim ? "#666" : C.purple}
                          strokeWidth={row.dim ? 1 : 2}
                        />
                        <text
                          x="50"
                          y={i * 32 + 18}
                          fill={row.dim ? C.dim : "#fff"}
                          fontSize="13"
                          textAnchor="middle"
                          fontWeight={row.dim ? 400 : 700}
                        >
                          {row.label}
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="135" y="74" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    ·
                  </text>

                  {/* Kᵀ matrix */}
                  <g transform="translate(155, 28)">
                    <text x="100" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Kᵀ (d×3)
                    </text>
                    {["k_I", "k_love", "k_cats"].map((label, i) => (
                      <g key={`kt${i}`}>
                        <rect
                          x={i * 68}
                          y="0"
                          width="60"
                          height="92"
                          rx="4"
                          fill={C.blue}
                          fillOpacity="0.3"
                          stroke={C.blue}
                          strokeWidth="1.5"
                        />
                        <text x={i * 68 + 30} y="50" fill="#fff" fontSize="13" textAnchor="middle" fontWeight="700">
                          {label}
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="385" y="74" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    =
                  </text>

                  {/* Scores 3x3 */}
                  <g transform="translate(410, 28)">
                    <text x="135" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Scores (3×3)
                    </text>
                    {[0, 1, 2].map((r) => {
                      const rowDim = r < 2;
                      return (
                        <g key={`sr${r}`}>
                          {[0, 1, 2].map((c) => (
                            <rect
                              key={`sc${r}-${c}`}
                              x={c * 90}
                              y={r * 32}
                              width="86"
                              height="28"
                              rx="4"
                              fill={rowDim ? "#444" : "#e040fb"}
                              fillOpacity={rowDim ? 0.1 : 0.5}
                              stroke={rowDim ? "#555" : "#e040fb"}
                              strokeWidth={rowDim ? 1 : 2}
                            />
                          ))}
                          {[0, 1, 2].map((c) => (
                            <text
                              key={`st${r}-${c}`}
                              x={c * 90 + 43}
                              y={r * 32 + 18}
                              fill={rowDim ? C.dim : "#fff"}
                              fontSize="11"
                              textAnchor="middle"
                            >
                              {rowDim ? "(already)" : ["·k_I", "·k_love", "·k_cats"][c]}
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </g>

                  <text x="340" y="155" fill="#e040fb" fontSize="13" fontWeight="700" textAnchor="middle">
                    ↑ only this row is new: 3 dot products (not 9)
                  </text>

                  <text x="340" y="190" fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
                    Output = softmax(Scores) · V
                  </text>

                  {/* Scores (compressed) */}
                  <g transform="translate(20, 240)">
                    <text x="50" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Scores (3×3)
                    </text>
                    {[0, 1, 2].map((r) => {
                      const rowDim = r < 2;
                      return (
                        <rect
                          key={`scl${r}`}
                          x="0"
                          y={r * 32}
                          width="100"
                          height="28"
                          rx="4"
                          fill={rowDim ? "#444" : "#e040fb"}
                          fillOpacity={rowDim ? 0.1 : 0.5}
                          stroke={rowDim ? "#555" : "#e040fb"}
                          strokeWidth={rowDim ? 1 : 2}
                        />
                      );
                    })}
                    {["row_I (old)", "row_love (old)", "row_cats (NEW)"].map((label, i) => (
                      <text
                        key={`slt${i}`}
                        x="50"
                        y={i * 32 + 18}
                        fill={i < 2 ? C.dim : "#fff"}
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight={i === 2 ? 700 : 400}
                      >
                        {label}
                      </text>
                    ))}
                  </g>

                  <text x="135" y="286" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    ·
                  </text>

                  {/* V matrix - all rows bright */}
                  <g transform="translate(155, 240)">
                    <text x="100" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      V (3×d)
                    </text>
                    {["v_I", "v_love", "v_cats"].map((label, i) => (
                      <g key={`v${i}`}>
                        <rect
                          x="0"
                          y={i * 32}
                          width="200"
                          height="28"
                          rx="4"
                          fill={C.green}
                          fillOpacity="0.3"
                          stroke={C.green}
                          strokeWidth="1.5"
                        />
                        <text x="100" y={i * 32 + 18} fill="#fff" fontSize="13" textAnchor="middle" fontWeight="700">
                          {label} (all needed)
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="385" y="286" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    =
                  </text>

                  {/* Output 3xd */}
                  <g transform="translate(410, 240)">
                    <text x="135" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Output (3×d)
                    </text>
                    {[
                      { label: "out_I (old, discarded)", dim: true },
                      { label: "out_love (old, discarded)", dim: true },
                      { label: "out_cats (the ONLY one we need)", dim: false },
                    ].map((row, i) => (
                      <g key={`o${i}`}>
                        <rect
                          x="0"
                          y={i * 32}
                          width="270"
                          height="28"
                          rx="4"
                          fill={row.dim ? "#444" : "#e040fb"}
                          fillOpacity={row.dim ? 0.1 : 0.5}
                          stroke={row.dim ? "#555" : "#e040fb"}
                          strokeWidth={row.dim ? 1 : 2}
                        />
                        <text
                          x="135"
                          y={i * 32 + 18}
                          fill={row.dim ? C.dim : "#fff"}
                          fontSize="12"
                          textAnchor="middle"
                          fontWeight={row.dim ? 400 : 700}
                        >
                          {row.label}
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="340" y="376" fill="#e040fb" fontSize="13" fontWeight="700" textAnchor="middle">
                    ↑ only this row is new: 1 weighted sum (not 3)
                  </text>
                </svg>
              </div>
            </>,
          )}

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={16}>
                Counting cells at step 3
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Without cache", val: "18 cells", sub: "9 score + 9 output", c: C.red },
                  { label: "Actually needed", val: "6 cells", sub: "3 score + 3 output", c: C.green },
                  { label: "Wasted", val: "12 cells (66%)", sub: "", c: C.orange },
                ].map((x) => (
                  <div
                    key={x.label}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: `${x.c}10`,
                      border: `1px solid ${x.c}30`,
                      minWidth: 150,
                      textAlign: "center",
                    }}
                  >
                    <T color={x.c} bold center size={13}>
                      {x.label}
                    </T>
                    <T color={C.dim} size={16} bold center style={{ marginTop: 4 }}>
                      {x.val}
                    </T>
                    {x.sub && (
                      <T color={C.dim} size={11} center style={{ marginTop: 2 }}>
                        {x.sub}
                      </T>
                    )}
                  </div>
                ))}
              </div>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Cost per step scales as N² without cache. With cache, cost per step stays O(N). Now we just need to
                figure out what to save so we can skip the gray rows.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(2)}

      {/* ── Sub 3: What to Save, What to Throw Away ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            What to Save, What to Throw Away
          </T>
          <T color="#90caf9" size={16} style={{ marginTop: 8 }}>
            We compute three things per token: Q, K, V. For each, do we need the OLD ones to build the new output row?
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              {
                name: "Q",
                color: C.purple,
                hex: "#b8a9ff",
                verdict: "Don't cache",
                icon: "✗",
                iconColor: C.red,
                desc: "Only the new query q_cats appears in the new output row's formula. Old queries q_I and q_love are never used again.",
                tag: "dead weight",
              },
              {
                name: "K",
                color: C.blue,
                hex: "#90caf9",
                verdict: "Cache it",
                icon: "✓",
                iconColor: C.green,
                desc: "The new row of Scores = q_new · every old K. Missing one key = missing one attention score.",
                tag: "every old K needed",
              },
              {
                name: "V",
                color: C.green,
                hex: "#a5d6a7",
                verdict: "Cache it",
                icon: "✓",
                iconColor: C.green,
                desc: "The new output row = weighted sum of every old V. Missing one value = losing that token's contribution.",
                tag: "every old V needed",
              },
            ].map(({ name, color, hex, verdict, icon, iconColor, desc, tag }) => (
              <div
                key={name}
                style={{
                  flex: "1 1 200px",
                  maxWidth: 260,
                  padding: 14,
                  borderRadius: 10,
                  background: `${color}10`,
                  border: `2px solid ${color}40`,
                  textAlign: "center",
                }}
              >
                <T color={hex} bold center size={22}>
                  {name}
                </T>
                <div style={{ fontSize: 48, color: iconColor, fontWeight: 700, lineHeight: 1 }}>{icon}</div>
                <T color={hex} bold center size={16} style={{ marginTop: 4 }}>
                  {verdict}
                </T>
                <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                  {tag}
                </T>
                <T color={C.dim} center size={13} style={{ marginTop: 8 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={16}>
                That is why it is called the <span style={{ color: "#fff176" }}>KV cache</span>.
              </T>
              <T color="#fff176" center size={15} style={{ marginTop: 4 }}>
                We save K and V. Never Q.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(3)}

      {/* ── Sub 4: The Cache Is a Growing Notebook ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            The Cache Is a Growing Notebook
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 8 }}>
            The KV cache is literally two tables that grow by exactly one row at every step. Nothing moves, nothing gets
            recomputed. We just append to the notebook.
          </T>

          {inner(
            C.green,
            <>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 4, overflowX: "auto" }}>
                <svg data-viz="notebook" width="780" height="170" viewBox="0 0 780 170">
                  <desc>
                    Three frame growing notebook diagram showing the K cache and V cache tables appending one row per
                    generation step: after I has 1 row, after love has 2 rows with the older row dimmed, after cats has
                    3 rows with only the newest row highlighted
                  </desc>
                  <defs>
                    <marker
                      id="kv-arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5d6a7" />
                    </marker>
                  </defs>
                  {[
                    {
                      x: 10,
                      title: "After 'I'",
                      k: [{ val: "[0.3, 0.4]", bright: true }],
                      v: [{ val: "[0.8, 0.3]", bright: true }],
                    },
                    {
                      x: 280,
                      title: "After 'love'",
                      k: [
                        { val: "[0.3, 0.4]", bright: false },
                        { val: "[0.7, 0.2]", bright: true },
                      ],
                      v: [
                        { val: "[0.8, 0.3]", bright: false },
                        { val: "[0.1, 0.9]", bright: true },
                      ],
                    },
                    {
                      x: 550,
                      title: "After 'cats'",
                      k: [
                        { val: "[0.3, 0.4]", bright: false },
                        { val: "[0.7, 0.2]", bright: false },
                        { val: "[0.5, 0.3]", bright: true },
                      ],
                      v: [
                        { val: "[0.8, 0.3]", bright: false },
                        { val: "[0.1, 0.9]", bright: false },
                        { val: "[0.45, 0.6]", bright: true },
                      ],
                    },
                  ].map(({ x, title, k, v }, frameIdx) => {
                    const nRows = k.length;
                    // Center rows vertically around y=100 (frame coords) so Frame 1's single
                    // row aligns with Frame 3's middle row. Row height 22, pitch 26.
                    const rowStartY = 100 - (nRows * 22 + (nRows - 1) * 4) / 2;
                    return (
                      <g key={`frame${frameIdx}`} transform={`translate(${x}, 10)`}>
                        <text x="110" y="14" fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                          {title}
                        </text>
                        {/* Labels fixed at y=46 across all frames so they line up horizontally */}
                        <text x="50" y="46" fill={C.blue} fontSize="11" textAnchor="middle" fontWeight="700">
                          K cache
                        </text>
                        <text x="170" y="46" fill={C.green} fontSize="11" textAnchor="middle" fontWeight="700">
                          V cache
                        </text>
                        {k.map((row, i) => (
                          <g key={`k${frameIdx}-${i}`}>
                            <rect
                              x="10"
                              y={rowStartY + i * 26}
                              width="80"
                              height="22"
                              rx="3"
                              fill={C.blue}
                              fillOpacity={row.bright ? 0.45 : 0.12}
                              stroke={C.blue}
                              strokeWidth={row.bright ? 2 : 1}
                            />
                            <text
                              x="50"
                              y={rowStartY + 15 + i * 26}
                              fill={row.bright ? "#fff" : C.dim}
                              fontSize="10"
                              textAnchor="middle"
                              fontWeight={row.bright ? 700 : 400}
                            >
                              {row.val}
                            </text>
                          </g>
                        ))}
                        {v.map((row, i) => (
                          <g key={`v${frameIdx}-${i}`}>
                            <rect
                              x="130"
                              y={rowStartY + i * 26}
                              width="80"
                              height="22"
                              rx="3"
                              fill={C.green}
                              fillOpacity={row.bright ? 0.45 : 0.12}
                              stroke={C.green}
                              strokeWidth={row.bright ? 2 : 1}
                            />
                            <text
                              x="170"
                              y={rowStartY + 15 + i * 26}
                              fill={row.bright ? "#fff" : C.dim}
                              fontSize="10"
                              textAnchor="middle"
                              fontWeight={row.bright ? 700 : 400}
                            >
                              {row.val}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })}
                  {/* Arrows drawn outside frame translate. Abs y = frame translate y (10) + row center y (100) = 110.
                      Aligns with Frame 1's single row, Frame 2's gap between rows, Frame 3's middle row.
                      Horizontal center of each gap: Frame content ends at x=translate+220, next starts at x=translate+10. */}
                  {[
                    { cx: 255 }, // between frame 0 (ends abs 220) and frame 1 (K cache starts abs 290) → center 255
                    { cx: 525 }, // between frame 1 (ends abs 490) and frame 2 (K cache starts abs 560) → center 525
                  ].map(({ cx }, i) => (
                    <g key={`arrow${i}`}>
                      <text x={cx} y="98" fill="#a5d6a7" fontSize="11" textAnchor="middle" fontWeight="700">
                        append
                      </text>
                      <line
                        x1={cx - 16}
                        y1="110"
                        x2={cx + 16}
                        y2="110"
                        stroke="#a5d6a7"
                        strokeWidth="2"
                        markerEnd="url(#kv-arrow)"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                One append per step. The existing rows don't move, don't change, don't get recomputed. They just sit
                there in memory, ready to be read.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(4)}

      {/* ── Sub 5: Before vs After - Step 3 Side by Side ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Before vs After - Step 3 Side by Side
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 8 }}>
            Generating "cats" with and without the cache. Identical output, very different amounts of work.
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Without cache */}
            <div
              style={{
                flex: "1 1 280px",
                padding: 14,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}30`,
              }}
            >
              <T color="#ef9a9a" bold center size={16}>
                Without Cache
              </T>
              <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                Recompute everything from scratch
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { code: "q_I = W_Q · x_I", wasted: true },
                  { code: "q_love = W_Q · x_love", wasted: true },
                  { code: "q_cats = W_Q · x_cats", wasted: false },
                  { code: "k_I = W_K · x_I", wasted: true },
                  { code: "k_love = W_K · x_love", wasted: true },
                  { code: "k_cats = W_K · x_cats", wasted: false },
                  { code: "v_I = W_V · x_I", wasted: true },
                  { code: "v_love = W_V · x_love", wasted: true },
                  { code: "v_cats = W_V · x_cats", wasted: false },
                ].map(({ code, wasted }, i) => (
                  <div
                    key={`w${i}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "2px 8px",
                      borderRadius: 3,
                      background: wasted ? `${C.red}10` : "transparent",
                      textDecoration: wasted ? "line-through" : "none",
                    }}
                  >
                    <code style={{ color: wasted ? C.red : C.green, fontSize: 12 }}>{code}</code>
                    <span style={{ color: wasted ? C.red : C.green, fontSize: 10, fontWeight: 700 }}>
                      {wasted ? "wasted" : "used"}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color="#ef9a9a" bold center size={13}>
                  9 projections + 9 score cells + 3 output rows
                </T>
                <T color="#ef9a9a" center size={13}>
                  <strong>15 operations wasted</strong>
                </T>
              </div>
            </div>

            {/* With cache */}
            <div
              style={{
                flex: "1 1 280px",
                padding: 14,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}30`,
              }}
            >
              <T color="#a5d6a7" bold center size={16}>
                With Cache
              </T>
              <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                Read old rows, compute only the new one
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.blue}10` }}>
                  <T color={C.blue} size={12} bold>
                    Read from cache: k_I, k_love, v_I, v_love
                  </T>
                </div>
                <div style={{ padding: "4px 8px", marginTop: 4 }}>
                  <T color={C.dim} size={11} bold>
                    Compute only for new token:
                  </T>
                </div>
                {[
                  { code: "q_cats = W_Q · x_cats", c: C.purple },
                  { code: "k_cats = W_K · x_cats", c: C.blue },
                  { code: "v_cats = W_V · x_cats", c: C.green },
                ].map(({ code, c }, i) => (
                  <code key={`wc${i}`} style={{ color: c, fontSize: 12, padding: "2px 8px" }}>
                    {code}
                  </code>
                ))}
                <div style={{ padding: "4px 8px", marginTop: 4, borderTop: `1px solid ${C.dim}20` }}>
                  <T color={C.dim} size={11} bold>
                    Append k_cats, v_cats to cache. Then:
                  </T>
                </div>
                <code style={{ color: C.dim, fontSize: 12, padding: "2px 8px" }}>
                  scores = q_cats · Kᵀ (last row only, 1×N)
                </code>
                <code style={{ color: C.dim, fontSize: 12, padding: "2px 8px" }}>
                  output_cats = softmax(scores) · V (1×d)
                </code>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" bold center size={13}>
                  3 projections + 3 score cells + 1 output row
                </T>
                <T color="#a5d6a7" center size={13}>
                  <strong>0 operations wasted</strong>
                </T>
              </div>
            </div>
          </div>

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={15}>
                The output vector for "cats" is identical in both.
              </T>
              <T color="#80deea" size={14} center style={{ marginTop: 4 }}>
                Same numbers come out. The cache just changes where the old K and V values come from (freshly recomputed
                vs memory read).
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(5)}

      {/* ── Sub 6: Trace It with Real Numbers ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#f48fb1" bold center size={20}>
            Trace It with Real Numbers (d = 2)
          </T>
          <T color="#f48fb1" size={16} style={{ marginTop: 8 }}>
            Let's walk through the complete computation with tiny 2-dim vectors, watching the cache fill up and seeing
            the identical output that the naive method would have produced.
          </T>

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={14}>
                Embeddings (d = 2) and weights
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_I = [1.0, 0.0]</code>
                  <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_love = [0.0, 1.0]</code>
                  <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_cats = [0.5, 0.5]</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <code style={{ color: C.purple, fontSize: 12, display: "block" }}>
                    W_Q rows: [0.5, 0.1] [0.2, 0.6]
                  </code>
                  <code style={{ color: C.blue, fontSize: 12, display: "block" }}>W_K rows: [0.3, 0.7] [0.4, 0.2]</code>
                  <code style={{ color: C.green, fontSize: 12, display: "block" }}>
                    W_V rows: [0.8, 0.1] [0.3, 0.9]
                  </code>
                </div>
              </div>
            </>,
          )}

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={14}>
                Step 1: process "I"
              </T>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <code style={{ color: C.purple, fontSize: 12 }}>q_I = W_Q · [1.0, 0.0] = [0.5, 0.2]</code>
                <code style={{ color: C.blue, fontSize: 12 }}>k_I = W_K · [1.0, 0.0] = [0.3, 0.4]</code>
                <code style={{ color: C.green, fontSize: 12 }}>v_I = W_V · [1.0, 0.0] = [0.8, 0.3]</code>
              </div>
              <div
                style={{
                  marginTop: 4,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.blue}08`,
                  textAlign: "center",
                }}
              >
                <T color={C.dim} center size={12}>
                  Cache after step 1:
                </T>
                <T color={C.blue} center size={12} bold>
                  K = [[0.3, 0.4]]
                </T>
                <T color={C.green} center size={12} bold>
                  V = [[0.8, 0.3]]
                </T>
              </div>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Step 2: process "love" (reuse cache for "I")
              </T>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <code style={{ color: C.purple, fontSize: 12 }}>q_love = W_Q · [0.0, 1.0] = [0.1, 0.6]</code>
                <code style={{ color: C.blue, fontSize: 12 }}>k_love = W_K · [0.0, 1.0] = [0.7, 0.2]</code>
                <code style={{ color: C.green, fontSize: 12 }}>v_love = W_V · [0.0, 1.0] = [0.1, 0.9]</code>
              </div>
              <div
                style={{
                  marginTop: 4,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.blue}08`,
                  textAlign: "center",
                }}
              >
                <T color={C.blue} center size={12} bold>
                  K = [[0.3, 0.4], [0.7, 0.2]]
                </T>
                <T color={C.green} center size={12} bold>
                  V = [[0.8, 0.3], [0.1, 0.9]]
                </T>
              </div>
            </>,
          )}

          {inner(
            C.green,
            <>
              <T color="#a5d6a7" bold center size={14}>
                Step 3: process "cats" and compute full attention
              </T>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <code style={{ color: C.purple, fontSize: 12 }}>q_cats = W_Q · [0.5, 0.5] = [0.3, 0.4]</code>
                <code style={{ color: C.blue, fontSize: 12 }}>k_cats = W_K · [0.5, 0.5] = [0.5, 0.3]</code>
                <code style={{ color: C.green, fontSize: 12 }}>v_cats = W_V · [0.5, 0.5] = [0.45, 0.6]</code>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.purple}08`,
                  textAlign: "center",
                }}
              >
                <T color={C.purple} center size={12} bold>
                  Scores (last row only): q_cats · each key
                </T>
                <code style={{ color: C.dim, fontSize: 11, display: "block", marginTop: 2 }}>
                  q_cats · k_I = 0.3×0.3 + 0.4×0.4 = 0.25
                </code>
                <code style={{ color: C.dim, fontSize: 11, display: "block" }}>
                  q_cats · k_love = 0.3×0.7 + 0.4×0.2 = 0.29
                </code>
                <code style={{ color: C.dim, fontSize: 11, display: "block" }}>
                  q_cats · k_cats = 0.3×0.5 + 0.4×0.3 = 0.27
                </code>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.yellow}08`,
                  textAlign: "center",
                }}
              >
                <T color="#fff176" center size={12} bold>
                  Scale by √2, then softmax:
                </T>
                <code style={{ color: "#fff176", fontSize: 12, display: "block", marginTop: 2 }}>
                  softmax = [0.329, 0.338, 0.333]
                </code>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" center size={12} bold>
                  Weighted sum of values:
                </T>
                <code style={{ color: C.dim, fontSize: 11, display: "block", marginTop: 2 }}>
                  0.329 × [0.8, 0.3] + 0.338 × [0.1, 0.9] + 0.333 × [0.45, 0.6]
                </code>
                <code style={{ color: "#a5d6a7", fontSize: 14, display: "block", marginTop: 4, fontWeight: 700 }}>
                  output_cats = [0.447, 0.603]
                </code>
              </div>
            </>,
          )}

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={13}>
                This exact [0.447, 0.603] would also come out without the cache. The cache never changes what is
                computed. It only changes where k_I, k_love, v_I, v_love came from (cached vs recomputed).
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(6)}

      {/* ── Sub 7: The Cost - 10.7 GB Per Conversation ── */}
      <Reveal when={sub >= 7}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The Cost - 10.7 GB Per Conversation
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
            The cache isn't free. It has a specific memory cost that depends on model size and sequence length.
          </T>

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={14}>
                The formula
              </T>
              {mono("#ef9a9a", "cache_bytes = 2 (K+V) × layers × d_model × seq_len × bytes_per_param", 13)}
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Example: LLaMA 70B
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { label: "layers", val: "80", c: C.green },
                  { label: "d_model", val: "8,192", c: C.purple },
                  { label: "seq_len (max)", val: "4,096 tokens", c: C.cyan },
                  { label: "precision", val: "FP16 (2 bytes)", c: C.orange },
                ].map(({ label, val, c }) => (
                  <div key={label} style={{ display: "flex", gap: 8, padding: "2px 8px" }}>
                    <T color={c} bold size={13} style={{ minWidth: 110 }}>
                      {label}:
                    </T>
                    <T color={C.dim} size={13}>
                      {val}
                    </T>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.25)",
                  textAlign: "center",
                }}
              >
                <code style={{ color: C.dim, fontSize: 13 }}>2 × 80 × 8,192 × 4,096 × 2 bytes</code>
                <T color="#ef9a9a" bold size={18} style={{ marginTop: 4 }}>
                  = 10.7 GB per sequence
                </T>
              </div>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "center", overflowX: "auto" }}>
                <svg data-viz="memory-bar" width="520" height="110" viewBox="0 0 520 110">
                  <desc>
                    Horizontal memory meter filling with gradient showing KV cache memory cost scaling with sequence
                    length, with tick marks at 1024 4096 and 32768 tokens and GB values 2.7 10.7 and 86 for LLaMA 70B
                    sized models
                  </desc>
                  <defs>
                    <linearGradient id="memgrad" x1="0" x2="1">
                      <stop offset="0" stopColor={C.green} stopOpacity="0.5" />
                      <stop offset="0.3" stopColor={C.yellow} stopOpacity="0.5" />
                      <stop offset="1" stopColor={C.red} stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="20"
                    y="40"
                    width="480"
                    height="24"
                    rx="4"
                    fill="rgba(255,255,255,0.05)"
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <rect x="20" y="40" width="480" height="24" rx="4" fill="url(#memgrad)" />
                  {[
                    { x: 50, tokens: "1K", gb: "2.7 GB" },
                    { x: 180, tokens: "4K", gb: "10.7 GB" },
                    { x: 420, tokens: "32K", gb: "86 GB" },
                  ].map(({ x, tokens, gb }) => (
                    <g key={`tick${x}`}>
                      <line x1={x} y1="64" x2={x} y2="72" stroke={C.dim} strokeWidth="1" />
                      <text x={x} y="86" fill={C.dim} fontSize="11" textAnchor="middle">
                        {tokens}
                      </text>
                      <text x={x} y="100" fill="#ef9a9a" fontSize="12" textAnchor="middle" fontWeight="700">
                        {gb}
                      </text>
                    </g>
                  ))}
                  <text x="20" y="28" fill={C.dim} fontSize="12">
                    KV cache size grows with sequence length (LLaMA 70B, FP16)
                  </text>
                </svg>
              </div>
            </>,
          )}

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={15}>
                And every concurrent user needs their own cache
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "1 user", val: "10.7 GB" },
                  { label: "10 users", val: "107 GB" },
                  { label: "100 users", val: "1,070 GB" },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: `${C.red}10`,
                      border: `1px solid ${C.red}30`,
                      minWidth: 110,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.dim} center size={12}>
                      {label}
                    </T>
                    <T color="#ef9a9a" center size={14} bold>
                      {val}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 8 }}>
                Long-context models (128K tokens) consume enormous memory. This is a major reason why serving LLMs is
                expensive, and why techniques like grouped-query attention exist to shrink the cache.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(7)}

      {/* ── Sub 8: The Deal - Memory for Speed ── */}
      <Reveal when={sub >= 8}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Deal - Memory for Speed
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            The KV cache is a trade. It costs memory and pays back speed. Here's the final ledger.
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 240px",
                padding: 14,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}30`,
              }}
            >
              <T color="#ef9a9a" bold center size={16}>
                Without KV Cache
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.red} size={14} bold style={{ minWidth: 70 }}>
                    Speed:
                  </T>
                  <T color={C.dim} size={14}>
                    slow, O(N²) per step, O(N³) total
                  </T>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.green} size={14} bold style={{ minWidth: 70 }}>
                    Memory:
                  </T>
                  <T color={C.dim} size={14}>
                    low, nothing stored
                  </T>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: "1 1 240px",
                padding: 14,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}30`,
              }}
            >
              <T color="#a5d6a7" bold center size={16}>
                With KV Cache
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.green} size={14} bold style={{ minWidth: 70 }}>
                    Speed:
                  </T>
                  <T color={C.dim} size={14}>
                    fast, O(N) per step, O(N²) total
                  </T>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.red} size={14} bold style={{ minWidth: 70 }}>
                    Memory:
                  </T>
                  <T color={C.dim} size={14}>
                    GB-scale, grows per token
                  </T>
                </div>
              </div>
            </div>
          </div>

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={16}>
                At 1000 tokens:
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.red}10`,
                    minWidth: 140,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    Without cache
                  </T>
                  <T color={C.dim} center size={13}>
                    ~333 million ops
                  </T>
                </div>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.green}10`,
                    minWidth: 140,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold center size={13}>
                    With cache
                  </T>
                  <T color={C.dim} center size={13}>
                    ~500 thousand ops
                  </T>
                </div>
              </div>
              <T color="#fff176" bold center size={18} style={{ marginTop: 10 }}>
                ~660× faster
              </T>
            </>,
          )}

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={15}>
                Every fast LLM you've ever used runs on this trick.
              </T>
              <T color="#80deea" size={14} center style={{ marginTop: 4 }}>
                Without it, ChatGPT would take minutes per response instead of seconds.
              </T>
            </>,
          )}

          {inner(
            C.purple,
            <>
              <T color="#b8a9ff" size={13} center>
                A note on scope: the cache only exists at inference time. During training, all tokens are processed in
                parallel, so there's nothing to cache.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
    </div>
  );
}
