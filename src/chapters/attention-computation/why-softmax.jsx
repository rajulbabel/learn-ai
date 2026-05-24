import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhySoftmax(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: We have raw scores, need to fill in ???s */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            After dot products, we have raw scores:
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
            {[
              { w: "I", s: "0.38" },
              { w: "love", s: "0.56" },
              { w: "cats", s: "0.74" },
            ].map(({ w, s }) => (
              <div
                key={w}
                style={{
                  textAlign: "center",
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid rgba(255,255,255,0.06)`,
                }}
              >
                <T color={C.dim} size={14}>
                  I → {w}
                </T>
                <T color={C.bright} bold center size={20}>
                  {s}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            Now we need to <strong>use these scores to blend the Values</strong>:
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "10px 14px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.bright} size={19} center>
              output = <strong style={{ color: C.yellow }}>???</strong> × V_I +{" "}
              <strong style={{ color: C.yellow }}>???</strong> × V_love +{" "}
              <strong style={{ color: C.yellow }}>???</strong> × V_cats
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            What should those <strong style={{ color: C.yellow }}>???</strong> be? Can we just plug in the raw scores?
          </T>
        </Box>
      )}

      {/* Sub 1: Budget analogy */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Think of it like a budget.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            You have <strong>₹100</strong> to distribute among three friends based on how helpful they were.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Helpfulness scores: Riya=38, Aman=56, Priya=74
          </T>
          <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.red} bold center size={18}>
              ❌ Can't give ₹38 + ₹56 + ₹74 = ₹168 total. You only have ₹100.
            </T>
            <T color={C.dim} size={18} style={{ marginTop: 8 }}>
              You need to convert scores into <strong>shares of ₹100</strong> - percentages that add up to 100%.
            </T>
            <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
              <T color={C.dim} size={18}>
                Total = 38 + 56 + 74 = 168
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { name: "Riya", score: 38, pct: 23, color: C.cyan },
                  { name: "Aman", score: 56, pct: 33, color: C.orange },
                  { name: "Priya", score: 74, pct: 44, color: C.yellow },
                ].map(({ name, score, pct, color }) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.dim, fontSize: 16, minWidth: 36 }}>{name}</span>
                    <span style={{ color: C.dim, fontSize: 16, minWidth: 50 }}>{score}/168</span>
                    <span style={{ color: C.dim, fontSize: 16 }}>=</span>
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: 5,
                          background: color,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span style={{ color, fontWeight: 700, fontSize: 18, minWidth: 30 }}>{pct}%</span>
                    <span style={{ color: C.dim, fontSize: 16 }}>→ ₹{pct}</span>
                  </div>
                ))}
              </div>
              <T color={C.green} bold center size={18} style={{ marginTop: 6 }}>
                ✅ Total: ₹100. This works!
              </T>
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>
            That's basically what softmax does - convert raw scores into shares that add up to 100%. But with one extra
            trick...
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: The problem - negative scores */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            The problem: dot products CAN be negative.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Our example had positive scores. But what if they were:
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
            {[
              { w: "word_A", s: "-3" },
              { w: "word_B", s: "1" },
              { w: "word_C", s: "5" },
            ].map(({ w, s }) => (
              <div
                key={w}
                style={{
                  textAlign: "center",
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${parseFloat(s) < 0 ? C.red : C.green}08`,
                  border: `1px solid ${parseFloat(s) < 0 ? C.red : C.green}15`,
                }}
              >
                <T color={C.dim} size={12}>
                  {w}
                </T>
                <T color={parseFloat(s) < 0 ? C.red : C.mid} bold center size={20}>
                  {s}
                </T>
              </div>
            ))}
          </div>
          <T color="#ff8a80" style={{ marginTop: 10 }}>
            Simple division: total = -3 + 1 + 5 = 3
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { w: "A", calc: "-3/3 = -100%", problem: "NEGATIVE? Can't pay minus attention!", color: C.red },
              { w: "B", calc: "1/3 = 33%", problem: "", color: C.mid },
              { w: "C", calc: "5/3 = 167%", problem: "More than 100%? Nonsense!", color: C.red },
            ].map(({ w, calc, problem, color }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: problem ? `${C.red}06` : "rgba(255,255,255,0.02)",
                }}
              >
                <span style={{ color: C.dim, fontSize: 16, minWidth: 14 }}>{w}:</span>
                <T color={color} size={18} bold center>
                  {calc}
                </T>
                {problem && (
                  <T color={C.red} size={14}>
                    ← {problem}
                  </T>
                )}
              </div>
            ))}
          </div>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>
            Simple division is broken. We need something better.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: The Softmax Formula - e^x trick */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The Solution: Softmax
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Before dividing, put each score through <strong>e^score</strong> (e ≈ 2.718). This magical function makes
            ANY number positive.
          </T>
          {/* ── Formula SVG ── */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.green}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <T color={C.dim} size={13} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              The Softmax Formula
            </T>
            <svg viewBox="0 0 420 120" style={{ width: "100%", maxWidth: 380, height: "auto" }}>
              <desc>
                Softmax formula showing e to the power of each score divided by sum of all e scores, converting raw
                attention scores to probabilities
              </desc>
              {/* σ(z)_i = */}
              <text x="10" y="62" fill={C.bright} fontSize="22" fontFamily="serif" fontStyle="italic">
                σ
              </text>
              <text x="26" y="62" fill={C.dim} fontSize="18" fontFamily="serif">
                (
              </text>
              <text x="34" y="62" fill={C.cyan} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                z
              </text>
              <text x="50" y="62" fill={C.dim} fontSize="18" fontFamily="serif">
                )
              </text>
              <text x="60" y="72" fill={C.purple} fontSize="14" fontFamily="serif" fontStyle="italic">
                i
              </text>
              <text x="82" y="62" fill={C.dim} fontSize="22" fontFamily="serif">
                =
              </text>
              {/* Fraction line */}
              <line x1="115" y1="55" x2="300" y2="55" stroke={C.bright} strokeWidth="1.5" />
              {/* Numerator: e^z_i */}
              <text
                x="185"
                y="40"
                fill={C.green}
                fontSize="22"
                fontFamily="serif"
                fontStyle="italic"
                textAnchor="middle"
                fontWeight="700"
              >
                e
              </text>
              <text x="202" y="26" fill={C.cyan} fontSize="16" fontFamily="serif" fontStyle="italic">
                z
              </text>
              <text x="214" y="32" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                i
              </text>
              {/* Denominator: Σ e^z_j */}
              <text x="155" y="90" fill={C.yellow} fontSize="22" fontFamily="serif">
                Σ
              </text>
              {/* j=1 below sigma */}
              <text x="157" y="108" fill={C.dim} fontSize="11" fontFamily="serif" fontStyle="italic">
                j=1
              </text>
              {/* K above sigma */}
              <text x="158" y="76" fill={C.dim} fontSize="11" fontFamily="serif" fontStyle="italic">
                K
              </text>
              <text x="185" y="90" fill={C.green} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                e
              </text>
              <text x="202" y="78" fill={C.cyan} fontSize="16" fontFamily="serif" fontStyle="italic">
                z
              </text>
              <text x="214" y="84" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                j
              </text>
              {/* Labels */}
              <text x="320" y="34" fill={C.green} fontSize="11" fontFamily="sans-serif">
                ← this word's e^score
              </text>
              <text x="320" y="90" fill={C.yellow} fontSize="11" fontFamily="sans-serif">
                ← sum of all e^scores
              </text>
            </svg>
          </div>
          <T color="#80e8a5" size={18}>
            In plain English:{" "}
            <strong>take e to the power of this score, then divide by the sum of e to the power of every score.</strong>
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: Why e^x - the magic property */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why e^x? It's ALWAYS positive.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            No matter what you feed it - negative, zero, huge - the output is always a positive number.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { input: -3, output: 0.05, note: "negative → small positive" },
              { input: 0, output: 1.0, note: "zero → exactly 1" },
              { input: 1, output: 2.72, note: "positive → bigger positive" },
              { input: 5, output: 148.4, note: "large → much larger" },
            ].map(({ input, output, note }) => (
              <div
                key={input}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ minWidth: 60, textAlign: "right" }}>
                  <span style={{ fontFamily: "monospace", color: input < 0 ? C.red : C.mid, fontSize: 19 }}>
                    {input}
                  </span>
                </div>
                <span style={{ color: C.dim, fontSize: 20 }}>→</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "monospace", color: C.dim, fontSize: 15 }}>e^({input}) =</span>
                  <span
                    style={{ fontFamily: "monospace", color: C.green, fontWeight: 700, fontSize: 20, minWidth: 50 }}
                  >
                    {output}
                  </span>
                </div>
                {/* Mini bar - e^x is always positive, so bar always has content */}
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                    minWidth: 40,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min((output / 148.4) * 100, 100)}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: C.green,
                      minWidth: 2,
                    }}
                  />
                </div>
                <T color={C.dim} size={13}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}08`,
              border: `1px solid ${C.purple}15`,
            }}
          >
            <T color="#b8a9ff" size={18} center>
              Notice the pattern: <strong>higher input → exponentially bigger output</strong>. This means softmax
              naturally amplifies the winner.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Full walkthrough with negative scores */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Full Walkthrough: scores [-3, 1, 5]
          </T>
          {/* Step 1 */}
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.purple}20`,
            }}
          >
            <T color={C.purple} bold size={16}>
              Step 1: Apply e^score to each
            </T>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "10px 0" }}>
              {[
                { s: -3, e: "0.05", c: C.red },
                { s: 1, e: "2.72", c: C.mid },
                { s: 5, e: "148.4", c: C.green },
              ].map(({ s, e, c }) => (
                <div key={s} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ padding: "4px 6px", borderRadius: 4, background: `${c}08`, marginBottom: 4 }}>
                    <T color={c} bold center size={18}>
                      {s}
                    </T>
                  </div>
                  <T color={C.dim} size={12} center>
                    ↓ e^({s})
                  </T>
                  <div style={{ padding: "4px 6px", borderRadius: 4, background: `${C.green}08`, marginTop: 4 }}>
                    <T color={C.green} bold center size={18}>
                      {e}
                    </T>
                  </div>
                </div>
              ))}
            </div>
            <T color={C.dim} size={15} center>
              All negative numbers became positive!
            </T>
          </div>
          {/* Step 2 */}
          <div
            style={{
              marginTop: 8,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color={C.yellow} bold size={16}>
              Step 2: Sum them all up (the denominator)
            </T>
            <div style={{ marginTop: 6, textAlign: "center" }}>
              <T color={C.dim} size={18} center>
                0.05 + 2.72 + 148.4 = <strong style={{ color: C.yellow, fontSize: 22 }}>151.17</strong>
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 6: Step 3 - divide by sum + checkmarks */}
      <Reveal when={sub >= 6}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Full Walkthrough: scores [-3, 1, 5]
          </T>
          {/* Step 3 */}
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color={C.green} bold size={16}>
              Step 3: Divide each e^score by the sum
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { w: "A", score: -3, eVal: "0.05", pct: 0.03, color: C.cyan },
                { w: "B", score: 1, eVal: "2.72", pct: 1.8, color: C.orange },
                { w: "C", score: 5, eVal: "148.4", pct: 98.2, color: C.yellow },
              ].map(({ w, score, eVal, pct, color }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 14, minWidth: 52 }}>
                    {w} ({score})
                  </span>
                  <span style={{ fontFamily: "monospace", color: C.dim, fontSize: 14, minWidth: 80 }}>
                    {eVal}/151.17
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <div
                    style={{
                      flex: 1,
                      height: 12,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(pct, 0.5)}%`,
                        height: "100%",
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: 17, minWidth: 44, textAlign: "right" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}>
              <T color={C.green} size={15} bold center>
                All positive ✓
              </T>
            </div>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}>
              <T color={C.green} size={15} bold center>
                Sum = 100% ✓
              </T>
            </div>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}>
              <T color={C.green} size={15} bold center>
                Ranking preserved ✓
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 7: Amplification + why scale first */}
      <Reveal when={sub >= 7}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Softmax amplifies differences - by design.
          </T>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={13}>
                Raw scores
              </T>
              <T color={C.mid} bold size={20} center>
                -3, 1, 5
              </T>
              <T color={C.dim} size={12} center>
                Gap: 1 to 5 = just 4
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <T color={C.dim} size={24}>
                →
              </T>
            </div>
            <div
              style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.yellow}08`, textAlign: "center" }}
            >
              <T color={C.dim} size={13}>
                After e^x
              </T>
              <T color={C.yellow} bold size={20} center>
                0.05, 2.72, 148.4
              </T>
              <T color={C.dim} size={12} center>
                Gap: 2.72 to 148 = 145!
              </T>
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 10 }}>
            The highest score doesn't just win - it <strong>dominates</strong>. This is good: the most relevant word
            SHOULD stand out.
          </T>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>
            <strong>But</strong> - if scores are too huge (like 12, 18, 25), softmax amplifies TOO aggressively → 99.99%
            on one word. That's why we <strong>scale first</strong> (next chapter) to keep scores in a useful range.
          </T>
        </Box>
      </Reveal>

      {/* Sub 8: Formula recap with visual summary */}
      <Reveal when={sub >= 8}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Softmax: the complete picture
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}15`,
              }}
            >
              <span
                style={{
                  background: `${C.purple}20`,
                  color: C.purple,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 19,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                1
              </span>
              <div style={{ flex: 1 }}>
                <T color={C.purple} bold size={18}>
                  e^score for each score
                </T>
                <T color={C.dim} size={15}>
                  Makes everything positive - even e^(-1000) is positive
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <span
                style={{
                  background: `${C.yellow}20`,
                  color: C.yellow,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 19,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                2
              </span>
              <div style={{ flex: 1 }}>
                <T color={C.yellow} bold size={18}>
                  Divide each by the total sum
                </T>
                <T color={C.dim} size={15}>
                  Now everything adds up to exactly 1.0 (100%)
                </T>
              </div>
            </div>
          </div>
          {/* Mini formula reminder */}
          <div
            style={{
              marginTop: 12,
              padding: "10px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.dim} size={13} center style={{ letterSpacing: 1 }}>
              FORMULA
            </T>
            <T color={C.bright} bold center size={20} style={{ fontFamily: "serif", marginTop: 4 }}>
              softmax(z<sub style={{ fontSize: 14 }}>i</sub>) = e
              <sup style={{ fontSize: 14 }}>
                z<sub style={{ fontSize: 10 }}>i</sub>
              </sup>{" "}
              / Σ e
              <sup style={{ fontSize: 14 }}>
                z<sub style={{ fontSize: 10 }}>j</sub>
              </sup>
            </T>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>
            Output: valid percentages (all positive, sum to 100%) that respect the original ranking. But raw scores can
            be too big for softmax - that's the next problem to solve →
          </T>
        </Box>
      </Reveal>

      {sub < 8 && (
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
