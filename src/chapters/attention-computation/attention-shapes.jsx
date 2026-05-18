import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function AttentionShapes(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const WORDS = ["I", "love", "cats"];

  // A single matrix tile. Symmetric padding keeps the rect centered in the SVG
  // bounding box so rects line up vertically across different label configs.
  const Mat = ({ rows, cols, name, color, unit = 24, rowLabels = null, colLabels = null, nameSub = null }) => {
    const w = cols * unit;
    const h = rows * unit;
    const sidePad = rowLabels ? 44 : 0;
    const vPad = colLabels ? 18 : 0;
    const svgW = w + 2 * sidePad;
    const svgH = h + 2 * vPad;
    const lines = [];
    for (let r = 1; r < rows; r++) {
      lines.push(
        <line key={`h${r}`} x1={0} y1={r * unit} x2={w} y2={r * unit} stroke={`${color}66`} strokeWidth="0.75" />,
      );
    }
    for (let c = 1; c < cols; c++) {
      lines.push(
        <line key={`v${c}`} x1={c * unit} y1={0} x2={c * unit} y2={h} stroke={`${color}66`} strokeWidth="0.75" />,
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg
          width={svgW}
          height={svgH}
          viewBox={`${-sidePad} ${-vPad} ${svgW} ${svgH}`}
          style={{ overflow: "visible" }}
        >
          <desc>
            Matrix tile {name}: {rows} rows by {cols} columns.
          </desc>
          {rowLabels &&
            rowLabels.map((lbl, i) => (
              <text
                key={`rl-${i}`}
                x={-6}
                y={i * unit + unit / 2 + 4}
                fontSize="11"
                fill={color}
                textAnchor="end"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            ))}
          {colLabels &&
            colLabels.map((lbl, i) => (
              <text
                key={`cl-${i}`}
                x={i * unit + unit / 2}
                y={-5}
                fontSize="11"
                fill={color}
                textAnchor="middle"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            ))}
          <rect x={0} y={0} width={w} height={h} fill={`${color}18`} stroke={`${color}99`} strokeWidth="1.2" rx="4" />
          {lines}
        </svg>
        <T color={color} bold size={15} center>
          {name}
          {nameSub && <sub style={{ fontSize: "0.75em", marginLeft: 1 }}>{nameSub}</sub>}
        </T>
        <T color={C.dim} mono size={12} center>
          {rows} × {cols}
        </T>
      </div>
    );
  };

  // Op wraps its glyph in a flex column with an invisible spacer below. The
  // spacer matches the (name + shape) label block under every Mat, so when
  // Op sits in a flex row with alignItems:center, its glyph lines up with the
  // Mat's rect-center (not with the wrapper-center, which sits between rect
  // and labels).
  const Op = ({ children, size = 24 }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <T color={C.dim} bold size={size}>
        {children}
      </T>
      <span aria-hidden="true" style={{ visibility: "hidden", fontSize: 15, fontWeight: 700, lineHeight: 1.75 }}>
        &nbsp;
      </span>
      <span aria-hidden="true" style={{ visibility: "hidden", fontSize: 12, lineHeight: 1.75 }}>
        &nbsp;
      </span>
    </div>
  );

  // A straight down-arrow with an optional label beside it.
  const ArrowDown = ({ label, color = C.dim, labelColor, height = 38 }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width={24} height={height} viewBox={`0 0 24 ${height}`} style={{ overflow: "visible" }}>
        <desc>Downward arrow connector</desc>
        <line x1={12} y1={0} x2={12} y2={height - 6} stroke={color} strokeWidth="1.5" />
        <polygon points={`12,${height} 7,${height - 8} 17,${height - 8}`} fill={color} />
      </svg>
      {label && (
        <T color={labelColor || C.dim} size={12} center>
          {label}
        </T>
      )}
    </div>
  );

  // A one-to-many split arrow. Tips land at column centers of an n-equal-column
  // grid of the same width (i.e., at w/(2n), 3w/(2n), ..., (2n-1)w/(2n)) so the
  // arrows point at matrix columns exactly below them.
  const SplitDown = ({ n = 3, width = 420, color = C.dim, label, stemTop = 6, barY = 16, arrowBottom = 38 }) => {
    const positions = Array.from({ length: n }, (_, i) => Math.round(((2 * i + 1) * width) / (2 * n)));
    const centerX = Math.round(width / 2);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg width={width} height={arrowBottom + 4} viewBox={`0 0 ${width} ${arrowBottom + 4}`}>
          <desc>Split arrow from one source at top to {n} destinations below.</desc>
          <line x1={centerX} y1={stemTop} x2={centerX} y2={barY} stroke={color} strokeWidth="1.5" />
          <line x1={positions[0]} y1={barY} x2={positions[n - 1]} y2={barY} stroke={color} strokeWidth="1.5" />
          {positions.map((x, i) => (
            <g key={i}>
              <line x1={x} y1={barY} x2={x} y2={arrowBottom - 6} stroke={color} strokeWidth="1.5" />
              <polygon
                points={`${x},${arrowBottom} ${x - 5},${arrowBottom - 8} ${x + 5},${arrowBottom - 8}`}
                fill={color}
              />
            </g>
          ))}
        </svg>
        {label && (
          <T color={C.dim} size={12} center>
            {label}
          </T>
        )}
      </div>
    );
  };

  // A row with n equal columns. Each child lands centered in its column, so
  // the vertical line through a column passes through every element's center
  // (matrices in one row, arrows in the next row, matrices in the row after).
  const GridRow = ({ n, children }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        justifyItems: "center",
        alignItems: "start",
        rowGap: 0,
      }}
    >
      {children}
    </div>
  );

  // A many-to-one merge arrow: n stems come down, meet on a horizontal bar,
  // then a single arrow drops to the bottom-center destination. Stems land at
  // the same column centers as an n-equal-column grid of this width, so they
  // line up with matrix centers in the row above.
  const MergeDown = ({ n = 2, width = 360, color = C.dim, label, stemBottom = 16, arrowBottom = 38 }) => {
    const positions = Array.from({ length: n }, (_, i) => Math.round(((2 * i + 1) * width) / (2 * n)));
    const centerX = Math.round(width / 2);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg width={width} height={arrowBottom + 4} viewBox={`0 0 ${width} ${arrowBottom + 4}`}>
          <desc>Merge arrow from {n} sources above into one destination below.</desc>
          {positions.map((x, i) => (
            <line key={`s${i}`} x1={x} y1={0} x2={x} y2={stemBottom} stroke={color} strokeWidth="1.5" />
          ))}
          <line
            x1={positions[0]}
            y1={stemBottom}
            x2={positions[n - 1]}
            y2={stemBottom}
            stroke={color}
            strokeWidth="1.5"
          />
          <line x1={centerX} y1={stemBottom} x2={centerX} y2={arrowBottom - 6} stroke={color} strokeWidth="1.5" />
          <polygon
            points={`${centerX},${arrowBottom} ${centerX - 5},${arrowBottom - 8} ${centerX + 5},${arrowBottom - 8}`}
            fill={color}
          />
        </svg>
        {label && (
          <T color={C.dim} size={12} center>
            {label}
          </T>
        )}
      </div>
    );
  };

  // Row that lines up a list of matrices with a given horizontal gap. Used for
  // the per-head triples (W_Q, W_K, W_V) and (Q, K, V), and for the two-head
  // concat row.
  const MatRow = ({ children, gap = 40 }) => (
    <div style={{ display: "flex", gap, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Attention matrix computation - one full flow
          </T>
          <T color="#80deea" center style={{ marginTop: 6 }}>
            Teaching scale: <strong>3 tokens, d_model = 4, d_k = 2, 2 heads</strong>. Sentence:{" "}
            <strong>"I love cats"</strong>. In every matrix with 3 rows, row 1 is "I", row 2 is "love", row 3 is "cats"
            - each word keeps its row the whole way.
          </T>

          {/* ── Single-head flow: X -> W_Q/W_K/W_V -> Q/K/V -> Q·K^T -> softmax -> weights·V -> head output ── */}
          {/* Inner column is capped so the 3-column grid is narrow enough that
              split-arrow tips actually land under the matrices in the grid below. */}
          <div
            style={{
              marginTop: 18,
              width: "100%",
              maxWidth: 560,
              margin: "18px auto 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Row 1: X (single, centered) */}
            <Mat rows={3} cols={4} name="X" color={C.blue} rowLabels={WORDS} />

            {/* Split into three weight matrices - tips align with the 3-col grid below */}
            <SplitDown n={3} width={560} label="copy X, multiply by three different weight matrices" />

            {/* Row 2: W_Q, W_K, W_V - 3 equal-width columns */}
            <div style={{ width: "100%" }}>
              <GridRow n={3}>
                <Mat rows={4} cols={2} name="W_Q" color={C.purple} />
                <Mat rows={4} cols={2} name="W_K" color={C.orange} />
                <Mat rows={4} cols={2} name="W_V" color={C.green} />
              </GridRow>
            </div>

            {/* Three parallel down arrows - same 3-col grid so they land under
                the matrices above and above the matrices below. */}
            <div style={{ width: "100%", marginTop: 6 }}>
              <GridRow n={3}>
                <ArrowDown label="X · W_Q" height={32} />
                <ArrowDown label="X · W_K" height={32} />
                <ArrowDown label="X · W_V" height={32} />
              </GridRow>
            </div>

            {/* Row 3: Q, K, V - same 3-col grid */}
            <div style={{ width: "100%" }}>
              <GridRow n={3}>
                <Mat rows={3} cols={2} name="Q" color={C.purple} rowLabels={WORDS} />
                <Mat rows={3} cols={2} name="K" color={C.orange} rowLabels={WORDS} />
                <Mat rows={3} cols={2} name="V" color={C.green} rowLabels={WORDS} />
              </GridRow>
            </div>

            {/* Q · K^T = scores, then ÷ √d_k, softmax per row → weights */}
            <ArrowDown label="Q · K^T, then ÷ √d_k, softmax per row" />

            {/* Row 4: attention weights */}
            <Mat rows={3} cols={3} name="attention weights" color={C.yellow} rowLabels={WORDS} colLabels={WORDS} />

            {/* ArrowDown feeds into an explicit multiplication row below */}
            <ArrowDown label="blend V rows by each word's attention" />

            {/* Row 5: weights · V = head output (horizontal multiplication so V
                is visible here, not just in the Q/K/V row above). All three
                matrices share the same label layout (rowLabels only, no col
                labels) so their rects line up on the same horizontal axis and
                the · and = sit exactly at rect-center. */}
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 2,
              }}
            >
              <Mat rows={3} cols={3} name="weights" color={C.yellow} rowLabels={WORDS} />
              <Op>{"\u00B7"}</Op>
              <Mat rows={3} cols={2} name="V" color={C.green} rowLabels={WORDS} />
              <Op>=</Op>
              <Mat rows={3} cols={2} name="head output" color={C.red} rowLabels={WORDS} />
            </div>

            <T color="#80deea" size={13} center style={{ marginTop: 12 }}>
              That whole pipeline is <strong>one head</strong>. The model runs this in parallel for every head, each
              with its own W_Q, W_K, W_V.
            </T>
          </div>

          <T color="#80deea" center style={{ marginTop: 14 }}>
            Next we stack the heads. Continue to add the multi-head concat and the final W_O projection.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Multi-head: concat the heads, then project with W_O
          </T>
          <T color="#ffcc80" center style={{ marginTop: 6 }}>
            Every head produced a <strong>3 × 2</strong> output (3 tokens, d_k = 2). With <strong>h = 2 heads</strong>,
            we have two such tiles. Stack them side-by-side (concat along the column axis) to get a 3 × 4 block, then
            multiply by <strong>W_O</strong> to mix information across heads.
          </T>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              width: "100%",
            }}
          >
            {/* Row A: the two per-head outputs (H1, H2) */}
            <MatRow gap={72}>
              <Mat rows={3} cols={2} name="H" nameSub="1" color={C.red} rowLabels={WORDS} />
              <Mat rows={3} cols={2} name="H" nameSub="2" color={C.red} rowLabels={WORDS} />
            </MatRow>

            {/* Merge into concat block */}
            <div style={{ marginTop: 10 }}>
              <MergeDown n={2} width={260} label="concat along columns" />
            </div>

            {/* Row B: concatenated (3 x 4) */}
            <Mat rows={3} cols={4} name="concat(H₁, H₂)" color={C.yellow} rowLabels={WORDS} />

            <ArrowDown label="· W_O (4 × 4) - mixes info across heads" />

            {/* Row C: Final (3 x 4) - same shape as X */}
            <Mat rows={3} cols={4} name="Final (= attention output)" color={C.cyan} rowLabels={WORDS} />
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}25`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Shapes in one glance
            </T>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "4px 18px",
                fontFamily: "monospace",
                fontSize: 14,
                textAlign: "left",
                color: C.bright,
              }}
            >
              <span>X</span>
              <span style={{ color: C.dim }}>N × d_model</span>
              <span style={{ color: C.yellow }}>3 × 4</span>
              <span>W_Q, W_K, W_V (per head)</span>
              <span style={{ color: C.dim }}>d_model × d_k</span>
              <span style={{ color: C.yellow }}>4 × 2</span>
              <span>Q, K, V (per head)</span>
              <span style={{ color: C.dim }}>N × d_k</span>
              <span style={{ color: C.yellow }}>3 × 2</span>
              <span>Q · K^T</span>
              <span style={{ color: C.dim }}>N × N</span>
              <span style={{ color: C.yellow }}>3 × 3</span>
              <span>softmax(/√d_k)</span>
              <span style={{ color: C.dim }}>N × N (rows sum to 1)</span>
              <span style={{ color: C.yellow }}>3 × 3</span>
              <span>weights · V = H_i</span>
              <span style={{ color: C.dim }}>N × d_k</span>
              <span style={{ color: C.yellow }}>3 × 2</span>
              <span>concat(H₁ … H_h)</span>
              <span style={{ color: C.dim }}>N × (h · d_k) = N × d_model</span>
              <span style={{ color: C.yellow }}>3 × 4</span>
              <span>W_O</span>
              <span style={{ color: C.dim }}>d_model × d_model</span>
              <span style={{ color: C.yellow }}>4 × 4</span>
              <span>Final</span>
              <span style={{ color: C.dim }}>N × d_model</span>
              <span style={{ color: C.yellow }}>3 × 4</span>
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
              In a real Transformer the same pattern runs with N = sentence length, d_model = 512, h = 8 heads, d_k =
              64. The shape rules are identical.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 1 && (
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
