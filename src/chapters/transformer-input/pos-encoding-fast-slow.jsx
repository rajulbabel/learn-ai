import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PosEncodingFastSlow(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  // Counting grid data
  const countingRows = [
    { pos: 0, digits: [0, 0, 0] },
    { pos: 1, digits: [0, 0, 1] },
    { pos: 2, digits: [0, 0, 2] },
    { pos: 9, digits: [0, 0, 9] },
    { pos: 10, digits: [0, 1, 0] },
    { pos: 11, digits: [0, 1, 1] },
    { pos: 99, digits: [0, 9, 9] },
    { pos: 100, digits: [1, 0, 0] },
    { pos: 101, digits: [1, 0, 1] },
  ];
  const digitColors = [C.purple, C.orange, C.yellow];
  const digitLabels = ["Hundreds (slow)", "Tens (medium)", "Ones (fast)"];

  const Digit = ({ value, colIdx, highlight = false }) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 6,
        fontFamily: "monospace",
        fontSize: 22,
        fontWeight: 800,
        color: digitColors[colIdx],
        background: `${digitColors[colIdx]}${highlight ? "25" : "10"}`,
        border: `1.5px solid ${digitColors[colIdx]}${highlight ? "60" : "20"}`,
        transition: "all 0.2s",
      }}
    >
      {value}
    </span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Step 0: How you count */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Think about how you count: ones, tens, hundreds.
          </T>
          <T color="#80deea" style={{ marginTop: 4 }}>
            Each column changes at a different speed:
          </T>
        </Box>
      )}

      {sub >= 0 && (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "12px 14px",
            width: "100%",
          }}
        >
          {/* Column labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "52px repeat(3, 1fr)",
              gap: 6,
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <span></span>
            {digitLabels.map((lbl, i) => (
              <T key={i} color={digitColors[i]} bold size={14} center>
                {lbl}
              </T>
            ))}
          </div>
          {/* Rows */}
          {countingRows.map(({ pos, digits }, ri) => {
            const prevDigits = ri > 0 ? countingRows[ri - 1].digits : null;
            const showGap = ri === 3 || ri === 6;
            return (
              <div key={ri}>
                {showGap && (
                  <div style={{ textAlign: "center", padding: "4px 0" }}>
                    <T color={C.dim} size={14} center>
                      ···
                    </T>
                  </div>
                )}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px repeat(3, 1fr)",
                    gap: 6,
                    marginBottom: 4,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                    pos {pos}
                  </span>
                  {digits.map((d, ci) => {
                    const changed = prevDigits && prevDigits[ci] !== d;
                    return (
                      <div key={ci} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <Digit value={d} colIdx={ci} highlight={changed} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sub >= 0 && (
        <div style={{ display: "flex", gap: 6, width: "100%" }}>
          {[
            { label: "Ones", color: C.yellow, desc: "Changes every step" },
            { label: "Tens", color: C.orange, desc: "Changes every 10 steps" },
            { label: "Hundreds", color: C.purple, desc: "Changes every 100 steps" },
          ].map(({ label, color, desc }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: `${color}08`,
                border: `1px solid ${color}18`,
                borderRadius: 8,
                padding: "8px",
                textAlign: "center",
              }}
            >
              <T color={color} bold size={16} center>
                {label}
              </T>
              <T color={C.dim} size={12} center>
                {desc}
              </T>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: What if ONLY ones? */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>
            ❌ What if you ONLY had the ones column?
          </T>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              marginTop: 8,
              padding: "10px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 8,
            }}
          >
            {[
              { pos: 0, d: 0 },
              { pos: 1, d: 1 },
              { pos: 2, d: 2 },
              { pos: "...", d: "..." },
              { pos: 9, d: 9 },
              { pos: 10, d: 0, dup: "Same as pos 0!" },
              { pos: 11, d: 1, dup: "Same as pos 1!" },
            ].map(({ pos, d, dup }, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "52px 36px 1fr", gap: 10, alignItems: "center" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                  {pos === "..." ? "" : `pos ${pos}`}
                </span>
                {d === "..." ? (
                  <T color={C.dim} size={14}>
                    ···
                  </T>
                ) : (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: 5,
                        fontFamily: "monospace",
                        fontSize: 20,
                        fontWeight: 800,
                        color: dup ? C.red : C.yellow,
                        background: dup ? `${C.red}20` : `${C.yellow}10`,
                        border: `1.5px solid ${dup ? C.red : C.yellow}${dup ? "50" : "20"}`,
                      }}
                    >
                      {d}
                    </span>
                    {dup && <span style={{ fontSize: 16, color: C.red, fontWeight: 700 }}>← {dup}</span>}
                  </>
                )}
              </div>
            ))}
          </div>
          <T color="#ff8a80" size={18} style={{ marginTop: 8 }}>
            After 10 positions, the ones column <strong>repeats</strong>. Position 0 and position 10 look identical. You
            can only count to 9. <strong>Stuck.</strong>
          </T>
        </Box>
      </Reveal>

      {/* Step 2: What if ONLY hundreds? */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>
            ❌ What if you ONLY had the hundreds column?
          </T>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              marginTop: 8,
              padding: "10px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 8,
            }}
          >
            {[
              { pos: 0, d: 0, dup: null },
              { pos: 1, d: 0, dup: "Same!" },
              { pos: 2, d: 0, dup: "Same!" },
              { pos: "...", d: "..." },
              { pos: 99, d: 0, dup: "still same!" },
              { pos: 100, d: 1, dup: "finally changes" },
            ].map(({ pos, d, dup }, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "52px 36px 1fr", gap: 10, alignItems: "center" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                  {pos === "..." ? "" : `pos ${pos}`}
                </span>
                {d === "..." ? (
                  <T color={C.dim} size={14}>
                    ···
                  </T>
                ) : (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: 5,
                        fontFamily: "monospace",
                        fontSize: 20,
                        fontWeight: 800,
                        color: dup === "finally changes" ? C.green : dup ? C.red : C.purple,
                        background: dup === "finally changes" ? `${C.green}20` : dup ? `${C.red}15` : `${C.purple}10`,
                        border: `1.5px solid ${dup === "finally changes" ? C.green : dup ? C.red : C.purple}40`,
                      }}
                    >
                      {d}
                    </span>
                    {dup && (
                      <span
                        style={{ fontSize: 16, color: dup === "finally changes" ? C.green : C.red, fontWeight: 700 }}
                      >
                        ← {dup}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <T color="#ff8a80" size={18} style={{ marginTop: 8 }}>
            Positions 0 through 99 <strong>all look identical</strong> - the hundreds column just shows 0 for all of
            them. You can't tell neighboring words apart at all.
          </T>
        </Box>
      </Reveal>

      {/* Step 3: Combine = magic */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            ✅ But COMBINE all three columns?
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Every position from <strong>000 to 999</strong> has a unique combination. That's{" "}
            <strong>1000 unique positions</strong> using just 3 digits!
          </T>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              padding: "10px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 8,
            }}
          >
            {[
              { pos: 0, d: [0, 0, 0] },
              { pos: 1, d: [0, 0, 1] },
              { pos: 10, d: [0, 1, 0] },
              { pos: 11, d: [0, 1, 1] },
              { pos: 100, d: [1, 0, 0] },
              { pos: 101, d: [1, 0, 1] },
            ].map(({ pos, d }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, minWidth: 68, textAlign: "right" }}>
                  pos {String(pos).padStart(3, " ")}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  {d.map((v, ci) => (
                    <Digit key={ci} value={v} colIdx={ci} />
                  ))}
                </div>
                <span style={{ fontSize: 14, color: C.green }}>✓ unique</span>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
            The fast column (ones) tells close positions apart (0 vs 1).
            <br />
            The slow column (hundreds) tells distant positions apart (0 vs 100).
            <br />
            <strong>Together, every position is unique.</strong>
          </T>
        </Box>
      </Reveal>

      {/* Step 4: Connect back to positional encoding */}
      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            This is EXACTLY what positional encoding does.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                left: "Ones column",
                leftSub: "changes every step, repeats after 10",
                right: "Fast dimensions (dim 0, 1)",
                rightSub: "sine wave changes fast, repeats quickly",
                color: C.yellow,
              },
              {
                left: "Tens column",
                leftSub: "changes every 10 steps",
                right: "Medium dimensions",
                rightSub: "sine wave at medium speed",
                color: C.orange,
              },
              {
                left: "Hundreds column",
                leftSub: "changes every 100 steps",
                right: "Slow dimensions (dim 510, 511)",
                rightSub: "sine wave barely changes",
                color: C.purple,
              },
            ].map(({ left, leftSub, right, rightSub, color }) => (
              <div
                key={left}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 30px 1fr",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div style={{ textAlign: "right", paddingRight: 8 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 19 }}>{left}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{leftSub}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <span style={{ color, fontSize: 20, fontWeight: 800 }}>=</span>
                </div>
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 19 }}>{right}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{rightSub}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px",
              background: "rgba(0,230,118,0.06)",
              borderRadius: 8,
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color="#80e8a5" bold center>
              Instead of 3 digits (0-9) → 1,000 unique positions
            </T>
            <T color="#80e8a5" center size={18}>
              Positional encoding uses 512 dimensions (sine waves -1 to +1)
            </T>
            <T color="#80e8a5" center size={18}>
              → practically <strong>unlimited</strong> unique positions
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            That's the entire point of fast vs slow. Nothing more, nothing less.
            <br />
            Different speeds exist so the combination is always unique, no matter how long the sentence is.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
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
