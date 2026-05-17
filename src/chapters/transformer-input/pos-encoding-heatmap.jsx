import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PosEncodingHeatmap(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const DIMS = 128;
  const POSITIONS = 40;

  function peValue(pos, i) {
    const k = Math.floor(i / 2);
    const freq = 1 / Math.pow(10000, (2 * k) / DIMS);
    const angle = pos * freq;
    return i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
  }

  function peColor(val) {
    const t = Math.max(0, Math.min(1, (val + 1) / 2));
    const c1 = [103, 0, 31];
    const c2 = [247, 247, 247];
    const c3 = [5, 48, 97];
    let r, g, b;
    if (t < 0.5) {
      const u = t * 2;
      r = c1[0] + (c2[0] - c1[0]) * u;
      g = c1[1] + (c2[1] - c1[1]) * u;
      b = c1[2] + (c2[2] - c1[2]) * u;
    } else {
      const u = (t - 0.5) * 2;
      r = c2[0] + (c3[0] - c2[0]) * u;
      g = c2[1] + (c3[1] - c2[1]) * u;
      b = c2[2] + (c3[2] - c2[2]) * u;
    }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }

  const cellW = 4;
  const cellH = 8;
  const leftM = 34;
  const topM = 10;
  const botM = 30;
  const rightM = 70;
  const heatW = DIMS * cellW;
  const heatH = POSITIONS * cellH;
  const svgW = leftM + heatW + rightM;
  const svgH = topM + heatH + botM;

  const FullHeatmap = () => {
    const cells = [];
    for (let p = 0; p < POSITIONS; p++) {
      for (let i = 0; i < DIMS; i++) {
        cells.push(
          <rect
            key={`${p}-${i}`}
            x={leftM + i * cellW}
            y={topM + p * cellH}
            width={cellW}
            height={cellH}
            fill={peColor(peValue(p, i))}
          />,
        );
      }
    }
    const cbarX = leftM + heatW + 20;
    const cbarW = 14;
    const cbarSteps = 40;
    const cbarStepH = heatH / cbarSteps;
    const cbarCells = [];
    for (let s = 0; s < cbarSteps; s++) {
      const val = 1 - (2 * s) / (cbarSteps - 1);
      cbarCells.push(
        <rect
          key={`cb-${s}`}
          x={cbarX}
          y={topM + s * cbarStepH}
          width={cbarW}
          height={cbarStepH + 0.5}
          fill={peColor(val)}
        />,
      );
    }
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%", display: "block" }}>
        <desc>
          Full positional-encoding heatmap with rows as positions (0 to 39) and columns as embedding dimensions (0 to
          127). Each cell is colored by the sin or cos value at that position and dimension, ranging from dark red at
          negative one to white at zero to dark blue at positive one. The left side shows a fast checkerboard pattern
          while the right side shows slow vertical stripes.
        </desc>
        {cells}
        {cbarCells}
        {[0, 10, 20, 30, 39].map((p) => (
          <text
            key={`yl-${p}`}
            x={leftM - 6}
            y={topM + p * cellH + cellH / 2 + 3}
            fontSize="9"
            fill={C.dim}
            textAnchor="end"
          >
            {p}
          </text>
        ))}
        <text
          x={10}
          y={topM + heatH / 2}
          fontSize="11"
          fill={C.mid}
          textAnchor="middle"
          transform={`rotate(-90, 10, ${topM + heatH / 2})`}
        >
          Position (row)
        </text>
        {[0, 32, 64, 96, 127].map((d) => (
          <text
            key={`xl-${d}`}
            x={leftM + d * cellW + cellW / 2}
            y={topM + heatH + 12}
            fontSize="9"
            fill={C.dim}
            textAnchor="middle"
          >
            {d}
          </text>
        ))}
        <text x={leftM + heatW / 2} y={topM + heatH + 25} fontSize="11" fill={C.mid} textAnchor="middle">
          Dimension i (column)
        </text>
        <text x={cbarX + cbarW + 4} y={topM + 8} fontSize="9" fill={C.dim}>
          +1
        </text>
        <text x={cbarX + cbarW + 4} y={topM + heatH / 2 + 3} fontSize="9" fill={C.dim}>
          0
        </text>
        <text x={cbarX + cbarW + 4} y={topM + heatH - 2} fontSize="9" fill={C.dim}>
          -1
        </text>
      </svg>
    );
  };

  // Single row strip for "fingerprint" sub-step. Shows 1 position's PE as a horizontal bar.
  const PositionStrip = ({ pos, color }) => {
    const cells = [];
    for (let i = 0; i < DIMS; i++) {
      cells.push(
        <rect key={i} x={40 + i * cellW} y={0} width={cellW} height={cellH * 2} fill={peColor(peValue(pos, i))} />,
      );
    }
    return (
      <svg
        width={40 + heatW + 10}
        height={cellH * 2 + 4}
        viewBox={`0 0 ${40 + heatW + 10} ${cellH * 2 + 4}`}
        style={{ maxWidth: "100%", display: "block" }}
      >
        <text x={34} y={cellH + 4} fontSize="12" fill={color} fontWeight="700" textAnchor="end">
          pos {pos}
        </text>
        {cells}
      </svg>
    );
  };

  // Binary counting grid: rows are positions 0-15, columns are 4 bits (msb to lsb left-to-right)
  const BinaryGrid = () => {
    const cellSize = 34;
    const N = 16;
    const BITS = 4;
    const bitColors = [C.purple, C.blue, C.yellow, C.red];
    const bitLabels = ["bit 3 (slow)", "bit 2", "bit 1", "bit 0 (fast)"];
    const startX = 60;
    const startY = 30;
    const gridW = startX + BITS * cellSize + 20;
    const gridH = startY + N * cellSize + 10;
    const rows = [];
    for (let n = 0; n < N; n++) {
      const bits = n.toString(2).padStart(BITS, "0").split("").map(Number);
      rows.push(
        <g key={n}>
          <text
            x={startX - 8}
            y={startY + n * cellSize + cellSize / 2 + 4}
            fontSize="13"
            fill={C.dim}
            textAnchor="end"
            fontFamily="monospace"
          >
            {n}
          </text>
          {bits.map((b, bi) => (
            <g key={bi}>
              <rect
                x={startX + bi * cellSize + 2}
                y={startY + n * cellSize + 2}
                width={cellSize - 4}
                height={cellSize - 4}
                fill={b === 1 ? `${bitColors[bi]}50` : "rgba(255,255,255,0.02)"}
                stroke={b === 1 ? bitColors[bi] : "rgba(255,255,255,0.08)"}
                strokeWidth="1.5"
                rx="4"
              />
              <text
                x={startX + bi * cellSize + cellSize / 2}
                y={startY + n * cellSize + cellSize / 2 + 5}
                fontSize="16"
                fontFamily="monospace"
                fill={b === 1 ? bitColors[bi] : C.dim}
                fontWeight="700"
                textAnchor="middle"
              >
                {b}
              </text>
            </g>
          ))}
        </g>,
      );
    }
    return (
      <svg
        width={gridW}
        height={gridH}
        viewBox={`0 0 ${gridW} ${gridH}`}
        style={{ maxWidth: "100%", display: "block" }}
      >
        <desc>
          Binary counting table showing positions 0 through 15 with 4-bit binary representations. Each bit is colored:
          bit 0 (rightmost, fast) flips every step, bit 1 flips every 2 steps, bit 2 flips every 4 steps, bit 3
          (leftmost, slow) flips every 8 steps. Each position row gets a unique bit pattern, analogous to how each
          position in the heatmap gets a unique sin/cos signature.
        </desc>
        {bitLabels.map((lbl, bi) => (
          <text
            key={lbl}
            x={startX + bi * cellSize + cellSize / 2}
            y={20}
            fontSize="10"
            fill={bitColors[bi]}
            textAnchor="middle"
            fontWeight="700"
          >
            {lbl}
          </text>
        ))}
        {rows}
      </svg>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The famous heatmap: all positions, all dimensions, at once
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            So far we have seen bits and pieces: a formula, a few frequencies, one position vector. Now let's look at
            the <strong>entire</strong> positional-encoding matrix at once. Every row is one position's encoding, every
            column is one dimension across all positions, color shows the sin or cos value at that cell.
          </T>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <FullHeatmap />
          </div>
          <T color={C.dim} size={14} center style={{ marginTop: 8 }}>
            d_model = 128. Positions 0 to 39 shown. Red = -1, white = 0, blue = +1.
          </T>
          <T color="#80deea" style={{ marginTop: 10 }}>
            Two things jump out: the left side is a wild <strong>checkerboard</strong> that changes every step, and the
            right side is calm <strong>vertical stripes</strong> that barely change with position. Why?
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Why the left side flips fast
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            Each column uses its own <strong>frequency</strong>. The formula:
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color={C.bright} size={16}>
              f_i = 1 / 10000^(2 {"·"} floor(i/2) / d)
            </T>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            For small i (left side of the heatmap), the exponent is near 0, so f_i is close to <strong>1.0</strong>.
            Each step in position moves the angle by about 1 radian (roughly 57 degrees). sin and cos swing wildly.
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              fontFamily: "monospace",
            }}
          >
            <T color={C.bright} size={14}>
              Column i = 0 (f = 1.0): sin(pos {"·"} 1.0)
            </T>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "50px repeat(8, 1fr)",
                gap: 4,
                alignItems: "center",
              }}
            >
              <T color={C.dim} size={12}>
                pos
              </T>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
                <T key={p} color={C.dim} size={12} center>
                  {p}
                </T>
              ))}
              <T color={C.dim} size={12}>
                sin
              </T>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => {
                const v = Math.sin(p);
                return (
                  <div
                    key={p}
                    style={{
                      textAlign: "center",
                      padding: "4px",
                      borderRadius: 4,
                      background: peColor(v),
                      color: Math.abs(v) > 0.5 ? "#fff" : "#000",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {v.toFixed(2)}
                  </div>
                );
              })}
            </div>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            Look at those values jumping around: 0.00, 0.84, 0.91, 0.14, -0.76, -0.96, -0.28, 0.66. Every position is a
            very different number. That's the checkerboard on the left of the heatmap.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            Why the right side barely changes
          </T>
          <T color="#90caf9" style={{ marginTop: 6 }}>
            For large i (right side of the heatmap), the exponent approaches 1, so f_i approaches{" "}
            <strong>1 / 10000 = 0.0001</strong>. Across 40 positions the angle only moves by{" "}
            <strong>40 {"·"} 0.0001 = 0.004 radians</strong> (about 0.23 degrees). sin and cos barely move.
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              fontFamily: "monospace",
            }}
          >
            <T color={C.bright} size={14}>
              Column i = 127 (f {"≈"} 1/10000): cos(pos {"·"} 0.0001)
            </T>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "50px repeat(8, 1fr)",
                gap: 4,
                alignItems: "center",
              }}
            >
              <T color={C.dim} size={12}>
                pos
              </T>
              {[0, 5, 10, 15, 20, 25, 30, 39].map((p) => (
                <T key={p} color={C.dim} size={12} center>
                  {p}
                </T>
              ))}
              <T color={C.dim} size={12}>
                cos
              </T>
              {[0, 5, 10, 15, 20, 25, 30, 39].map((p) => {
                const f = 1 / Math.pow(10000, 126 / DIMS);
                const v = Math.cos(p * f);
                return (
                  <div
                    key={p}
                    style={{
                      textAlign: "center",
                      padding: "4px",
                      borderRadius: 4,
                      background: peColor(v),
                      color: Math.abs(v) > 0.5 ? "#fff" : "#000",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {v.toFixed(4)}
                  </div>
                );
              })}
            </div>
          </div>
          <T color="#90caf9" style={{ marginTop: 10 }}>
            All values stay near 1.0000. Every position looks nearly identical here. That's the solid blue stripe on the
            far right of the heatmap.
          </T>
          <T color={C.dim} size={14} style={{ marginTop: 8 }}>
            So what are these slow dimensions for? They encode <strong>very long-range</strong> position information.
            Two tokens 1000 positions apart differ meaningfully in the slow columns, even if they look identical across
            40 positions.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Every position is a unique fingerprint
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Pick any single row. That row <strong>is exactly</strong> the positional encoding vector for that position.
            It's 128 numbers, a unique barcode. Compare rows side by side:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <PositionStrip pos={5} color={C.cyan} />
            <PositionStrip pos={6} color={C.green} />
            <PositionStrip pos={25} color={C.orange} />
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 8 }}>
            Position 5 and position 6 are neighbors. Their left-side cells differ strongly (fast dims), but their
            right-side cells look identical (slow dims barely moved). Position 25 looks very different from both on the
            left, but still nearly identical on the far right.
          </T>
          <T color="#ffe082" style={{ marginTop: 10 }}>
            This is exactly the property we want: each position gets a unique vector, AND nearby positions have similar
            vectors. The model can learn both "which position is this" and "how far apart are these two positions."
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Binary counting: the same idea, one bit at a time
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            You have seen this pattern before. Count in binary. Every integer gets a unique bit pattern, and the bits
            flip at different speeds: the rightmost bit flips every step, the next one flips every 2 steps, the next
            every 4, and so on.
          </T>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <BinaryGrid />
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold size={16}>
              The mapping is direct:
            </T>
            <div
              style={{
                marginTop: 6,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <T color={C.bright} bold size={15}>
                  Binary encoding
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  Bit 0 (rightmost, fast) flips 1, 0, 1, 0, ...
                </T>
                <T color={C.dim} size={14}>
                  Bit 3 (leftmost, slow) flips every 8 steps
                </T>
                <T color={C.dim} size={14}>
                  Values: 0 or 1 (discrete)
                </T>
                <T color={C.dim} size={14}>
                  Each number = unique bit pattern
                </T>
              </div>
              <div>
                <T color={C.bright} bold size={15}>
                  Sin/cos encoding
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  Dim 0 (fast, f = 1.0) oscillates every step
                </T>
                <T color={C.dim} size={14}>
                  Dim 127 (slow, f = 0.0001) barely moves
                </T>
                <T color={C.dim} size={14}>
                  Values: any number in [-1, +1] (smooth)
                </T>
                <T color={C.dim} size={14}>
                  Each position = unique sin/cos signature
                </T>
              </div>
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            Sin/cos positional encoding is essentially <strong>binary counting made smooth and continuous</strong>. The
            fast dimensions play the role of low-order bits, the slow dimensions play the role of high-order bits. The
            magic of using sin/cos (instead of 0/1) is that the resulting vectors have nice geometric relationships: dot
            products capture relative distance, values stay bounded, and the encoding is differentiable so gradients
            flow through it cleanly during training.
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
