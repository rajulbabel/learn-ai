import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function CausalMask(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const words = ["The", "cat", "sat", "on"];
  const wColors = [C.cyan, C.purple, C.orange, C.yellow];

  /* Fake raw scores (Q.K^T / sqrt(d_k)) for illustration */
  const rawScores = [
    [2.1, 0.5, 0.3, 0.8],
    [1.2, 2.4, 0.7, 0.4],
    [0.6, 1.8, 2.0, 1.1],
    [0.9, 0.3, 1.5, 2.3],
  ];

  /* Softmax helper for a row of scores (-Infinity becomes 0) */
  const softmaxRow = (row) => {
    const finite = row.filter((v) => v !== -Infinity);
    const maxV = Math.max(...finite);
    const exps = row.map((v) => (v === -Infinity ? 0 : Math.exp(v - maxV)));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  };

  /* Masked scores: lower-triangular (row i can see cols 0..i) */
  const maskedScores = rawScores.map((row, i) => row.map((v, j) => (j <= i ? v : -Infinity)));

  /* Softmax of masked scores */
  const maskedProbs = maskedScores.map((row) => softmaxRow(row));

  /* Softmax of full unmasked scores (for comparison) */
  const fullProbs = rawScores.map((row) => softmaxRow(row));

  /* Grid cell renderer */
  const Cell = ({ val, color, bold, size = 16 }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 2px",
        borderRadius: 5,
        background: `${color}08`,
        minWidth: 48,
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: size, color, fontWeight: bold ? 700 : 400 }}>{val}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The problem - why mask at all? */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The problem: during generation, future words don't exist yet
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            When the model generates text one token at a time, it has only produced the tokens so far. The next word
            hasn't been generated yet - it can't attend to something that doesn't exist.
          </T>
          <div style={{ marginTop: 12, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 10 }}>
            <T
              color={C.dim}
              size={14}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}
            >
              generating "The cat sat on the mat"
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { step: 1, seen: ["The"], gen: "cat", note: '"The" can only see itself' },
                { step: 2, seen: ["The", "cat"], gen: "sat", note: '"cat" sees "The" and itself' },
                { step: 3, seen: ["The", "cat", "sat"], gen: "on", note: '"sat" sees "The", "cat", and itself' },
                { step: 4, seen: ["The", "cat", "sat", "on"], gen: "the", note: '"on" sees all 4 previous tokens' },
              ].map(({ step, seen, gen, note }) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${wColors[step - 1]}06`,
                    border: `1px solid ${wColors[step - 1]}12`,
                  }}
                >
                  <span style={{ color: wColors[step - 1], fontWeight: 800, fontSize: 16, minWidth: 20 }}>{step}.</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {seen.map((w, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${C.green}15`,
                          color: C.green,
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {w}
                      </span>
                    ))}
                    <span style={{ color: C.dim, fontSize: 14, alignSelf: "center" }}>→</span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: `${wColors[step - 1]}15`,
                        color: wColors[step - 1],
                        fontSize: 16,
                        fontWeight: 700,
                        border: `1px dashed ${wColors[step - 1]}40`,
                      }}
                    >
                      {gen}?
                    </span>
                  </div>
                  <T color={C.dim} size={13} style={{ marginLeft: "auto" }}>
                    {note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            But during <strong>training</strong>, the model sees the entire sentence at once for efficiency. So we need
            to <strong>artificially hide</strong> future tokens - that's what the causal mask does.
          </T>
        </Box>
      )}

      {/* Sub 1: Who can look at whom - intuitive grid + score matrix */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Who can look at whom?
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Each row is a word asking "who can I attend to?" Each column is a word being looked at. A word can only see
            words generated <strong>before it</strong> (+ itself):
          </T>

          {/* Intuitive checkmark/cross grid */}
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `100px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              {/* Column headers */}
              <div style={{ padding: "4px", textAlign: "center" }}>
                <T color={C.dim} size={11}>
                  row asks →
                </T>
                <T color={C.dim} size={11}>
                  col answers ↓
                </T>
              </div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={15} bold center>
                  {w}
                </T>
              ))}

              {/* Grid rows with explanations */}
              {words.map((w, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={14} bold>
                    "{w}" asks →
                  </T>
                  {words.map((_, ci) => {
                    const allowed = ci <= ri;
                    return (
                      <div
                        key={ci}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 2px",
                          borderRadius: 6,
                          background: allowed ? `${C.green}15` : `${C.red}10`,
                          border: `1px solid ${allowed ? C.green : C.red}20`,
                        }}
                      >
                        <span style={{ fontSize: 20, color: allowed ? C.green : C.red }}>
                          {allowed ? "\u2713" : "\u2717"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Row-by-row explanation */}
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { w: "The", c: C.cyan, why: "1st word - only itself exists" },
              { w: "cat", c: C.purple, why: '2nd word - sees "The" + itself' },
              { w: "sat", c: C.orange, why: '3rd word - sees "The", "cat" + itself' },
              { w: "on", c: C.yellow, why: "4th word - sees everything before it + itself" },
            ].map(({ w, c, why }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 16, minWidth: 36 }}>"{w}"</span>
                <T color={C.dim} size={14}>
                  {why}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}15`,
            }}
          >
            <T color="#80e8a5" bold center>
              The diagonal = each word seeing itself (always allowed)
            </T>
            <T color="#80e8a5" center size={15} style={{ marginTop: 2 }}>
              Below diagonal = looking at earlier words (allowed - they already exist)
            </T>
            <T color="#ef9a9a" center size={15} style={{ marginTop: 2 }}>
              Above diagonal = looking at future words (forbidden - not generated yet)
            </T>
          </div>

          {/* Now the actual Q.K^T score matrix with same color coding */}
          <T color="#80deea" bold center size={18} style={{ marginTop: 14 }}>
            Now here is the actual Q·K<sup>T</sup> / √d<sub>k</sub> score matrix:
          </T>
          <div style={{ marginTop: 8, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={14} bold center>
                  {w}
                </T>
              ))}
              {rawScores.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={14} bold>
                    "{words[ri]}" →
                  </T>
                  {row.map((v, ci) => (
                    <Cell key={ci} val={v.toFixed(1)} color={ci <= ri ? C.green : C.red} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 12, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.green}30` }} />
              <T color={C.dim} size={13}>
                allowed (past + self) - keep these scores
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.red}30` }} />
              <T color={C.dim} size={13}>
                future - must be blocked!
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 2: The mask matrix */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The mask: a triangle of negative infinity
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            We add a mask matrix to the scores. The mask has <strong>0</strong> where a word is allowed to look, and{" "}
            <strong>-∞</strong> where it's forbidden:
          </T>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={14} bold center>
                  {w}
                </T>
              ))}
              {words.map((w, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={14} bold>
                    "{w}" →
                  </T>
                  {words.map((_, ci) => {
                    const allowed = ci <= ri;
                    return (
                      <Cell
                        key={ci}
                        val={allowed ? "0" : "-\u221E"}
                        color={allowed ? C.green : C.red}
                        bold={!allowed}
                        size={allowed ? 16 : 14}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            Adding -∞ to a score makes it -∞. When softmax sees -∞, it outputs <strong>exactly 0</strong> - zero
            attention, as if that word doesn't exist. The lower triangle (0s) keeps scores unchanged.
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}15`,
            }}
          >
            <T color="#b8a9ff" size={16} center>
              masked_scores = scores + mask
            </T>
            <T color={C.dim} size={14} center style={{ marginTop: 2 }}>
              Where mask[i][j] = 0 if j ≤ i, else -∞
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: Masked scores */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            After masking → softmax only sees allowed tokens
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Here are the masked scores - future positions are now -∞:
          </T>

          {/* Masked scores grid */}
          <T color={C.dim} size={12} center style={{ marginTop: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
            masked scores
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={13} bold center>
                  {w}
                </T>
              ))}
              {maskedScores.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={13} bold>
                    "{words[ri]}" →
                  </T>
                  {row.map((v, ci) => (
                    <Cell
                      key={ci}
                      val={v === -Infinity ? "-\u221E" : v.toFixed(1)}
                      color={v === -Infinity ? C.red : C.green}
                      bold={v === -Infinity}
                      size={14}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}15`,
            }}
          >
            <T color="#ffcc80" center size={16}>
              The green cells keep their original scores. The red -∞ cells will become exactly 0 after softmax - as if
              those future words don't exist.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Softmax → attention weights */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Softmax turns masked scores into attention weights
          </T>

          <T color={C.dim} size={20} center style={{ margin: "6px 0" }}>
            ↓ softmax (each row)
          </T>

          {/* Attention weights grid */}
          <T color={C.dim} size={12} center style={{ letterSpacing: 1.5, textTransform: "uppercase" }}>
            attention weights (probabilities)
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={13} bold center>
                  {w}
                </T>
              ))}
              {maskedProbs.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={13} bold>
                    "{words[ri]}" →
                  </T>
                  {row.map((v, ci) => {
                    const isZero = v < 0.001;
                    return (
                      <Cell
                        key={ci}
                        val={v.toFixed(2)}
                        color={isZero ? C.red : C.green}
                        bold={!isZero && v > 0.35}
                        size={14}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}15`,
            }}
          >
            <T color="#80e8a5" bold center>
              Every -∞ became exactly 0.00 after softmax!
            </T>
            <T color="#80e8a5" center size={16} style={{ marginTop: 2 }}>
              "The" puts 100% attention on itself. "cat" splits between "The" and itself. Each row still sums to 1.0 -
              but only across the visible tokens.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Side-by-side visual comparison */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Bidirectional vs Causal - see the difference
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The attention formula is identical. The ONLY difference is whether the upper triangle is masked:
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Bidirectional grid */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <T color={C.cyan} bold center size={16}>
                No mask (bidirectional)
              </T>
              <T color={C.dim} center size={13}>
                every word sees every word
              </T>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                {words.map((_, ri) =>
                  words.map((_, ci) => (
                    <div
                      key={`b${ri}${ci}`}
                      style={{
                        height: 28,
                        borderRadius: 4,
                        background: `${C.cyan}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: C.cyan, fontSize: 11, fontWeight: 600 }}>
                        {fullProbs[ri][ci].toFixed(2)}
                      </span>
                    </div>
                  )),
                )}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Full matrix - all cells active
              </T>
            </div>

            {/* Causal grid */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <T color={C.orange} bold center size={16}>
                Causal mask
              </T>
              <T color={C.dim} center size={13}>
                each word sees only past + self
              </T>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                {words.map((_, ri) =>
                  words.map((_, ci) => {
                    const allowed = ci <= ri;
                    return (
                      <div
                        key={`c${ri}${ci}`}
                        style={{
                          height: 28,
                          borderRadius: 4,
                          background: allowed ? `${C.orange}25` : "rgba(255,255,255,0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: allowed ? C.orange : "rgba(255,255,255,0.12)",
                            fontSize: 11,
                            fontWeight: allowed ? 600 : 400,
                          }}
                        >
                          {allowed ? maskedProbs[ri][ci].toFixed(2) : "0"}
                        </span>
                      </div>
                    );
                  }),
                )}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Lower triangle only - upper triangle is dark
              </T>
            </div>
          </div>

          <T color="#ffe082" style={{ marginTop: 10 }}>
            Same Q, K, V matrices. Same formula. Same softmax. The mask is a single triangle of -∞ values - and it
            completely changes what the model can do.
          </T>
        </Box>
      </Reveal>

      {/* Sub 6: The training insight - why causal mask gives you N valid predictions */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            The Training Insight: Every Position Makes a Prediction
          </T>
          <T color="#90caf9" style={{ marginTop: 6 }}>
            4 tokens go in, 4 output vectors come out - <strong>always</strong>, regardless of masking. Each output
            vector passes through Linear + Softmax to predict the next token. The mask determines whether those
            predictions are <strong>honest</strong>.
          </T>

          {/* Flow diagram: tokens → transformer → outputs → predictions */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.blue}15`,
            }}
          >
            <T
              color={C.dim}
              size={12}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}
            >
              one forward pass through the transformer
            </T>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {/* Input tokens */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {words.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 6,
                      background: `${wColors[i]}15`,
                      border: `1px solid ${wColors[i]}30`,
                    }}
                  >
                    <T color={wColors[i]} bold size={16} center>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={16}>
                {"↓  ".repeat(4).trim()}
              </T>
              {/* Transformer block */}
              <div
                style={{
                  padding: "8px 30px",
                  borderRadius: 8,
                  background: `${C.pink}10`,
                  border: `1px solid ${C.pink}25`,
                }}
              >
                <T color={C.pink} bold size={14} center>
                  Transformer Blocks (N layers)
                </T>
              </div>
              <T color={C.dim} size={16}>
                {"↓  ".repeat(4).trim()}
              </T>
              {/* Output vectors */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {words.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: `${wColors[i]}08`,
                      border: `1px dashed ${wColors[i]}25`,
                    }}
                  >
                    <T color={wColors[i]} size={14} center>
                      v<sub>{i + 1}</sub>
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={16}>
                {"↓  ".repeat(4).trim()}
              </T>
              <div style={{ padding: "6px 20px", borderRadius: 6, background: "rgba(255,255,255,0.03)" }}>
                <T color={C.dim} size={14} center>
                  Linear + Softmax → 4 next-token predictions
                </T>
              </div>
            </div>
          </div>

          {/* Side by side: what each position saw and predicted */}
          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Without mask */}
            <div
              style={{
                flex: 1,
                minWidth: 200,
                padding: 12,
                borderRadius: 10,
                background: `${C.red}06`,
                border: `1px solid ${C.red}20`,
              }}
            >
              <T color={C.red} bold center size={16}>
                No Mask (Bidirectional)
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
                Every position sees the full sequence
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {words.map((w, i) => (
                  <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: `${C.red}08` }}>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <T color={wColors[i]} bold size={14}>
                        "{w}"
                      </T>
                      <T color={C.dim} size={12}>
                        saw:
                      </T>
                      {words.map((sw, si) => (
                        <span
                          key={si}
                          style={{
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: `${C.green}15`,
                            color: C.green,
                            fontSize: 12,
                          }}
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                    <T color={C.red} size={12} style={{ marginTop: 3 }}>
                      → saw the answer before predicting
                    </T>
                  </div>
                ))}
              </div>
              <div
                style={{ marginTop: 10, padding: 8, borderRadius: 6, background: `${C.red}12`, textAlign: "center" }}
              >
                <T color={C.red} bold size={16}>
                  0 usable training examples
                </T>
                <T color={C.dim} size={13}>
                  Every prediction "saw the answer"
                </T>
              </div>
            </div>

            {/* With causal mask */}
            <div
              style={{
                flex: 1,
                minWidth: 200,
                padding: 12,
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Causal Mask
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
                Each position sees only past + self
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { sees: ["The"], pred: "cat" },
                  { sees: ["The", "cat"], pred: "sat" },
                  { sees: ["The", "cat", "sat"], pred: "on" },
                  { sees: ["The", "cat", "sat", "on"], pred: "the" },
                ].map(({ sees, pred }, i) => (
                  <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: `${C.green}08` }}>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <T color={wColors[i]} bold size={14}>
                        "{words[i]}"
                      </T>
                      <T color={C.dim} size={12}>
                        saw:
                      </T>
                      {sees.map((sw, si) => (
                        <span
                          key={si}
                          style={{
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: `${wColors[si]}15`,
                            color: wColors[si],
                            fontSize: 12,
                          }}
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <T color={C.dim} size={12}>
                        → predicts
                      </T>
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: 3,
                          background: `${C.green}20`,
                          color: C.green,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        "{pred}"
                      </span>
                      <span
                        style={{
                          padding: "1px 5px",
                          borderRadius: 3,
                          background: `${C.green}15`,
                          color: C.green,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        HONEST
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{ marginTop: 10, padding: 8, borderRadius: 6, background: `${C.green}12`, textAlign: "center" }}
              >
                <T color={C.green} bold size={16}>
                  4 usable training examples!
                </T>
                <T color={C.dim} size={13}>
                  Each prediction was made without peeking
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.blue}08`,
              border: `1px solid ${C.blue}20`,
            }}
          >
            <T color="#90caf9" bold center>
              This is why causal masking exists during training
            </T>
            <T color="#90caf9" center size={15} style={{ marginTop: 4 }}>
              From one forward pass with N tokens, you get <strong>N honest next-token predictions</strong> to learn
              from. Without the mask, you'd get zero - the model would "cheat" at every position, then completely fail
              at actual generation.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 7 && (
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

      {/* Sub 7: Encoder-only architecture */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Three architectures - who uses what mask and why
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Encoder-only */}
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.cyan}20`,
                  border: `1px solid ${C.cyan}40`,
                }}
              >
                <T color={C.cyan} bold size={14} center>
                  ENCODER-ONLY
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4, marginBottom: 8 }}>
                BERT, RoBERTa
              </T>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 24px)", gap: 3 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ width: 24, height: 24, borderRadius: 4, background: `${C.cyan}30` }} />
                ))}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Full matrix - all cells active
              </T>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <T color="#80deea" size={16}>
                  <strong>No mask</strong> - every word sees every other word (bidirectional).
                </T>
                <T color="#80deea" size={16} style={{ marginTop: 4 }}>
                  <strong>Why?</strong> The encoder's job is to <strong>understand</strong> the full input. When
                  classifying "The bank by the river", "bank" NEEDS to see "river" (which comes after it) to know it
                  means riverbank, not a financial bank. Hiding future words would cripple understanding.
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  Used for: text classification, sentiment analysis, question answering, named entity recognition.
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {sub === 7 && (
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

      {/* Sub 8: Decoder-only architecture */}
      <Reveal when={sub >= 8}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Decoder-only */}
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.orange}20`,
                  border: `1px solid ${C.orange}40`,
                }}
              >
                <T color={C.orange} bold size={14} center>
                  DECODER-ONLY
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4, marginBottom: 8 }}>
                GPT, Claude, LLaMA
              </T>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 24px)", gap: 3 }}>
                {Array.from({ length: 16 }).map((_, i) => {
                  const r = Math.floor(i / 4),
                    col = i % 4;
                  const on = col <= r;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        background: on ? `${C.orange}30` : "rgba(255,255,255,0.04)",
                      }}
                    />
                  );
                })}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Lower triangle only - upper triangle masked
              </T>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <T color="#ffcc80" size={16}>
                  <strong>Causal mask</strong> - each word only sees past words + itself.
                </T>
                <T color="#ffcc80" size={16} style={{ marginTop: 4 }}>
                  <strong>Why?</strong> The decoder <strong>generates</strong> text one token at a time. At generation
                  step 3, token 4 doesn't exist yet - attending to it would be looking at something that isn't there.
                  During training, the full sentence is fed at once for speed, so we use the mask to simulate the
                  generation condition. Without it, the model would "cheat" by seeing the answer, then fail at actual
                  generation.
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  Used for: text generation, chatbots, code completion, reasoning - all modern LLMs.
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {sub === 8 && (
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

      {/* Sub 9: Encoder-decoder architecture + core rule summary */}
      <Reveal when={sub >= 9}>
        <Box color={C.green} style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Encoder-decoder */}
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.purple}20`,
                  border: `1px solid ${C.purple}40`,
                }}
              >
                <T color={C.purple} bold size={14} center>
                  ENCODER-DECODER
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4, marginBottom: 8 }}>
                Original Transformer, T5, BART
              </T>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <T color={C.cyan} size={10} center>
                    encoder
                  </T>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 20px)", gap: 2 }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: 3, background: `${C.cyan}30` }} />
                    ))}
                  </div>
                </div>
                <T color={C.dim} size={16} style={{ paddingBottom: 16 }}>
                  +
                </T>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <T color={C.orange} size={10} center>
                    decoder
                  </T>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 20px)", gap: 2 }}>
                    {Array.from({ length: 16 }).map((_, i) => {
                      const r = Math.floor(i / 4),
                        col = i % 4;
                      const on = col <= r;
                      return (
                        <div
                          key={i}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 3,
                            background: on ? `${C.orange}30` : "rgba(255,255,255,0.04)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Encoder: full matrix + Decoder: lower triangle
              </T>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <T color="#b8a9ff" size={16}>
                  <strong>Both</strong> - encoder uses no mask, decoder uses causal mask, plus cross-attention
                  connecting them.
                </T>
                <T color="#b8a9ff" size={16} style={{ marginTop: 4 }}>
                  <strong>Why?</strong> The input (e.g., English sentence) already exists fully - the encoder should see
                  all of it. But the output (e.g., Hindi translation) is generated word by word - the decoder must not
                  peek ahead. Cross-attention lets the decoder look at the encoder's full understanding while still
                  generating left-to-right.
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  Used for: translation, summarization, any "input → different output" task.
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center>
              The core rule is simple
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
              If the text <strong>already exists</strong> (input you're reading) → no mask needed, let every word see
              everything for maximum understanding.
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 2 }}>
              If the text is <strong>being generated</strong> (output you're writing) → causal mask required, because
              future words don't exist yet.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
