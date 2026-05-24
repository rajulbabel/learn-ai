import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function KTranspose(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The question - what does T mean? */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            In the attention formula, you'll see this:
          </T>
          <div
            style={{
              margin: "14px 0",
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={24} center>
              score = Q · K<sup style={{ fontSize: 16 }}>T</sup>
            </T>
          </div>
          <T color={C.blue} size={19}>
            That little <strong style={{ color: C.yellow }}>T</strong> is not "to the power of T". It stands for{" "}
            <strong style={{ color: C.yellow }}>Transpose</strong> - flipping a matrix on its side.
          </T>
          <T color={C.dim} size={18} style={{ marginTop: 8 }}>
            But why do we need to flip K? Let's build up to it step by step.
          </T>
        </Box>
      )}

      {/* Sub 1: What is a transpose - visual flip */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            What does "transpose" mean?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            It means: <strong>rows become columns, columns become rows.</strong> That's it. No math changes - just a
            flip.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 16,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Before */}
            <div style={{ textAlign: "center" }}>
              <T
                color={C.dim}
                size={13}
                center
                style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}
              >
                Original K
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: 10,
                  background: `${C.orange}08`,
                  border: `1px solid ${C.orange}20`,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "50px 50px", gap: 4 }}>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.3
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.7
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.6
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.4
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.8
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.5
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                  3 rows × 2 cols
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color={C.dim} size={12} center>
                  row 1 = K<sub>I</sub>
                </T>
                <T color={C.dim} size={12} center>
                  row 2 = K<sub>love</sub>
                </T>
                <T color={C.dim} size={12} center>
                  row 3 = K<sub>cats</sub>
                </T>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <T color={C.yellow} bold center size={28}>
                →
              </T>
              <T color={C.yellow} size={12} bold center>
                transpose
              </T>
            </div>

            {/* After */}
            <div style={{ textAlign: "center" }}>
              <T
                color={C.dim}
                size={13}
                center
                style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}
              >
                K<sup>T</sup>
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: 10,
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}20`,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "50px 50px 50px", gap: 4 }}>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.3
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.6
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.8
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.7
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.4
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.5
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                  2 rows × 3 cols
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color={C.dim} size={12} center>
                  col 1 = K<sub>I</sub>
                </T>
                <T color={C.dim} size={12} center>
                  col 2 = K<sub>love</sub>
                </T>
                <T color={C.dim} size={12} center>
                  col 3 = K<sub>cats</sub>
                </T>
              </div>
            </div>
          </div>

          <T color="#b8a9ff" size={18} style={{ marginTop: 12 }}>
            Same numbers. Same order within each word's vector. Just <strong>rotated</strong> - rows became columns.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Why - shapes must align for matrix multiplication */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            The problem: shapes don't match.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            We want every Query to compute a dot product with every Key. Let's try Q · K directly:
          </T>

          <div
            style={{
              marginTop: 12,
              padding: "14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.red}25`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <T color={C.blue} bold center size={16}>
                  Q
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.blue}12`,
                    border: `1px solid ${C.blue}25`,
                  }}
                >
                  <T color={C.blue} bold center size={20}>
                    3 × 2
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  3 words, 2 dims
                </T>
              </div>
              <T color={C.dim} size={24}>
                ×
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.orange} bold center size={16}>
                  K
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}25`,
                  }}
                >
                  <T color={C.orange} bold center size={20}>
                    3 × 2
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  3 words, 2 dims
                </T>
              </div>
              <T color={C.dim} size={24}>
                =
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.red} bold center size={16}>
                  &nbsp;
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}25`,
                  }}
                >
                  <T color={C.red} bold center size={20}>
                    ❌
                  </T>
                </div>
                <T color={C.red} size={12} center>
                  Can't multiply!
                </T>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: `${C.red}08` }}>
              <T color="#ff8a80" size={16} center>
                Matrix multiplication rule: the <strong>inner dimensions</strong> must match.
              </T>
              <T color="#ff8a80" size={16} center style={{ marginTop: 2 }}>
                (3×<strong style={{ color: C.red }}>2</strong>) × (<strong style={{ color: C.red }}>3</strong>×2) → 2 ≠
                3. <strong>Broken.</strong>
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: The fix - transpose makes it work */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The fix: transpose K, then multiply.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.green}25`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <T color={C.blue} bold center size={16}>
                  Q
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.blue}12`,
                    border: `1px solid ${C.blue}25`,
                  }}
                >
                  <T color={C.blue} bold center size={20}>
                    3 × 2
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  3 words, 2 dims
                </T>
              </div>
              <T color={C.dim} size={24}>
                ×
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.green} bold center size={16}>
                  K<sup style={{ fontSize: 12 }}>T</sup>
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}25`,
                  }}
                >
                  <T color={C.green} bold center size={20}>
                    2 × 3
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  2 dims, 3 words
                </T>
              </div>
              <T color={C.dim} size={24}>
                =
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.yellow} bold center size={16}>
                  Scores
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.yellow}12`,
                    border: `1px solid ${C.yellow}25`,
                  }}
                >
                  <T color={C.yellow} bold center size={20}>
                    3 × 3
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  every word → every word
                </T>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: `${C.green}08` }}>
              <T color="#80e8a5" size={16} center>
                (3×<strong style={{ color: C.green }}>2</strong>) × (<strong style={{ color: C.green }}>2</strong>×3) →
                inner dims both 2. <strong>Works!</strong>
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>
            The result is a <strong style={{ color: C.yellow }}>3×3 score matrix</strong> - one score for every pair of
            words. Exactly what we need.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: What each cell means - visual score matrix */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            What does Q · K<sup style={{ fontSize: 14 }}>T</sup> actually compute?
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Each cell in the 3×3 result = the dot product of one Query with one Key. That's the "relevance score".
          </T>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto repeat(3, 1fr)", gap: 4, minWidth: 300 }}>
              <div style={{ padding: "4px 8px" }}></div>
              {["K_I", "K_love", "K_cats"].map((h) => (
                <div key={h} style={{ padding: "4px", borderRadius: 4, background: `${C.orange}08` }}>
                  <T color={C.orange} size={13} bold center>
                    {h}
                  </T>
                </div>
              ))}
              {[
                { q: "Q_I", scores: [0.38, 0.56, 0.74], best: 2 },
                { q: "Q_love", scores: [0.66, 0.42, 0.53], best: 0 },
                { q: "Q_cats", scores: [0.57, 0.54, 0.7], best: 2 },
              ].map(({ q, scores, best }) => (
                <div key={q} style={{ display: "contents" }}>
                  <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.blue}08` }}>
                    <T color={C.blue} size={13} bold center>
                      {q}
                    </T>
                  </div>
                  {scores.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 4px",
                        borderRadius: 6,
                        textAlign: "center",
                        background: i === best ? `${C.yellow}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${i === best ? `${C.yellow}25` : "transparent"}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 18,
                          color: i === best ? C.yellow : C.mid,
                          fontWeight: i === best ? 700 : 400,
                        }}
                      >
                        {s.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>
            Row = one word asking. Column = one word answering. Cell = how relevant the answer-word is to the asker.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Analogy - the classroom seating chart */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Analogy: the classroom seating chart
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}15`,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔍</span>
              <div>
                <T color={C.blue} bold size={17}>
                  Q (Queries) = each student's question list
                </T>
                <T color={C.dim} size={15}>
                  3 students, each with a question that has 2 traits (topic, urgency)
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔑</span>
              <div>
                <T color={C.orange} bold size={17}>
                  K (Keys) = each student's expertise card
                </T>
                <T color={C.dim} size={15}>
                  Same 3 students, each has expertise described by 2 traits
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
              <div>
                <T color={C.yellow} bold size={17}>
                  Q · K<sup style={{ fontSize: 12 }}>T</sup> = the compatibility chart
                </T>
                <T color={C.dim} size={15}>
                  Every student's question matched against every student's expertise → a 3×3 grid of "how well can you
                  help me?"
                </T>
              </div>
            </div>
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 10 }}>
            The transpose just makes this matching possible. Without it, you can't compare every question to every
            expertise - the shapes won't fit.
          </T>
        </Box>
      </Reveal>

      {/* Sub 6: Summary */}
      <Reveal when={sub >= 6}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            K<sup style={{ fontSize: 14 }}>T</sup> in one sentence
          </T>
          <div
            style={{
              margin: "12px 0",
              padding: "14px 16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}25`,
            }}
          >
            <T color={C.bright} size={19} center>
              <strong style={{ color: C.yellow }}>
                K<sup style={{ fontSize: 13 }}>T</sup>
              </strong>{" "}
              is just K with its rows and columns swapped - so that Q · K<sup style={{ fontSize: 13 }}>T</sup> produces
              a score for <strong>every word pair</strong>.
            </T>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {[
              { q: "What is T?", a: "Transpose - flip rows ↔ columns", c: C.purple },
              { q: "Why do it?", a: "So the matrix shapes align for multiplication", c: C.blue },
              { q: "Does K change?", a: "No - same numbers, just rearranged", c: C.orange },
              { q: "What's the result?", a: "A word×word score matrix (every pair gets a score)", c: C.yellow },
            ].map(({ q, a, c }) => (
              <div
                key={q}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <T color={c} bold size={16} style={{ minWidth: 120, flexShrink: 0 }}>
                  {q}
                </T>
                <T color={C.dim} size={16}>
                  {a}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {sub < 6 && (
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
