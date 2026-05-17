import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function CrossAttention(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  /* English (encoder) and Hindi (decoder) tokens for translation example */
  const encWords = ["I", "love", "cats"];
  const encColors = [C.cyan, C.blue, C.purple];
  /* Hindi word order is SOV: "Mujhe billiyaan pasand hain" = "to-me cats liking are" */
  const decWords = ["Mujhe", "billiyaan", "pasand", "hain"];
  const decColors = [C.orange, C.yellow, C.orange, C.yellow];

  /* Fake scores: each decoder token's Q dot-producted with each encoder token's K */
  const crossScores = [
    [2.8, 0.4, 0.3] /* Mujhe → mostly looks at "I" (subject) */,
    [0.3, 0.7, 3.4] /* billiyaan → mostly looks at "cats" (direct object) */,
    [0.5, 3.1, 0.6] /* pasand → mostly looks at "love" (verb meaning) */,
    [0.4, 2.7, 0.5] /* hain → mostly looks at "love" (helper verb) */,
  ];

  /* Softmax each row */
  const softmaxRow = (row) => {
    const maxV = Math.max(...row);
    const exps = row.map((v) => Math.exp(v - maxV));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  };
  const crossProbs = crossScores.map((row) => softmaxRow(row));

  const Cell = ({ val, color, bold, size = 15 }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 2px",
        borderRadius: 5,
        background: `${color}08`,
        minWidth: 52,
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: size, color, fontWeight: bold ? 700 : 400 }}>{val}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The setup - encoder output meets decoder */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The setup: translating "I love cats" to Hindi
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The encoder has processed the English sentence. Each word is now a rich contextual vector - "love" doesn't
            just mean "love" anymore, it means "love in the context of I-love-cats".
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Encoder output */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Encoder output (English - fully processed)
              </T>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                {encWords.map((w, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "4px 14px",
                        borderRadius: 6,
                        background: `${encColors[i]}18`,
                        border: `1px solid ${encColors[i]}35`,
                        color: encColors[i],
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {w}
                    </span>
                    <span style={{ color: C.dim, fontSize: 11 }}>768 dims</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                These vectors are the encoder's final output - rich with context
              </T>
            </div>

            {/* Arrow */}
            <T color={C.dim} size={20} center>
              ↓ feeds into decoder's cross-attention
            </T>

            {/* Decoder in progress */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Decoder (Hindi - generating word by word)
              </T>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                {decWords.map((w, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "4px 14px",
                        borderRadius: 6,
                        background: `${decColors[i]}18`,
                        border: `1px solid ${decColors[i]}35`,
                        color: decColors[i],
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {w}
                    </span>
                    <span style={{ color: C.dim, fontSize: 11 }}>{i < 3 ? "generated" : "next?"}</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                The decoder needs to look at the English to know what to generate next
              </T>
            </div>
          </div>

          <T color="#80deea" style={{ marginTop: 10 }}>
            The decoder's self-attention lets Hindi words look at other Hindi words. But how does the decoder look at
            the <strong>English</strong> words? That's what cross-attention does.
          </T>
        </Box>
      )}

      {/* Sub 1: Q from decoder, K and V from encoder */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The key idea: Q from decoder, K and V from encoder
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            In self-attention, Q, K, and V all come from the same sentence. In cross-attention, they come from{" "}
            <strong>different</strong> sources:
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                role: "Query (Q)",
                source: "Decoder (Hindi)",
                why: 'The decoder is asking: "what English word should I pay attention to right now?"',
                color: C.orange,
                icon: "Q",
              },
              {
                role: "Key (K)",
                source: "Encoder (English)",
                why: "The encoder's words offer their 'labels' for matching - \"I'm the subject\", \"I'm the verb\"",
                color: C.cyan,
                icon: "K",
              },
              {
                role: "Value (V)",
                source: "Encoder (English)",
                why: "The encoder's words offer their actual content - the rich contextual meaning to borrow from",
                color: C.cyan,
                icon: "V",
              },
            ].map(({ role, source, why, color, icon }) => (
              <div
                key={role}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}15`,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${color}20`,
                    border: `1px solid ${color}40`,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color, fontWeight: 800, fontSize: 20 }}>{icon}</span>
                </div>
                <div>
                  <T color={color} bold size={16}>
                    {role} ← {source}
                  </T>
                  <T color={C.dim} size={15} style={{ marginTop: 2 }}>
                    {why}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center>
              Same formula: Attention(Q, K, V) = softmax( Q·K<sup>T</sup> / √d<sub>k</sub> ) · V
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 2 }}>
              The math is identical to self-attention. Only the source of Q, K, V changes.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 2: Concrete computation with scores */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Tracing cross-attention: Hindi Q meets English K
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Each Hindi word's Query asks "which English word is most relevant to me?" The score matrix is{" "}
            <strong>not square</strong> - it's 4 Hindi rows x 3 English columns:
          </T>

          {/* Score matrix */}
          <T color={C.dim} size={12} center style={{ marginTop: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
            cross-attention scores (Q·K<sup>T</sup> / √d<sub>k</sub>)
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `130px repeat(${encWords.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "right", paddingRight: 4 }}>
                <T color={C.dim} size={11}>
                  decoder Q ↓
                </T>
                <T color={C.dim} size={11}>
                  encoder K →
                </T>
              </div>
              {encWords.map((w, i) => (
                <T key={i} color={encColors[i]} size={15} bold center>
                  {w}
                </T>
              ))}
              {crossScores.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={decColors[ri]} size={14} bold style={{ textAlign: "right", paddingRight: 4 }}>
                    "{decWords[ri]}" →
                  </T>
                  {row.map((v, ci) => {
                    const isMax = v === Math.max(...row);
                    return <Cell key={ci} val={v.toFixed(1)} color={isMax ? C.green : C.dim} bold={isMax} />;
                  })}
                </div>
              ))}
            </div>
          </div>

          <T color={C.dim} size={20} center style={{ margin: "6px 0" }}>
            ↓ softmax (each row)
          </T>

          {/* Probability matrix */}
          <T color={C.dim} size={12} center style={{ letterSpacing: 1.5, textTransform: "uppercase" }}>
            attention weights
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `130px repeat(${encWords.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {encWords.map((w, i) => (
                <T key={i} color={encColors[i]} size={14} bold center>
                  {w}
                </T>
              ))}
              {crossProbs.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={decColors[ri]} size={14} bold style={{ textAlign: "right", paddingRight: 4 }}>
                    "{decWords[ri]}" →
                  </T>
                  {row.map((v, ci) => {
                    const isHigh = v > 0.5;
                    return <Cell key={ci} val={v.toFixed(2)} color={isHigh ? C.green : C.dim} bold={isHigh} />;
                  })}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              {
                hi: "Mujhe",
                en: "I",
                pct: crossProbs[0][0],
                c: C.orange,
                note: '"Mujhe" (I/to-me) focuses on "I" - the subject/experiencer',
              },
              {
                hi: "billiyaan",
                en: "cats",
                pct: crossProbs[1][2],
                c: C.yellow,
                note: '"billiyaan" (cats) focuses on "cats" - direct translation of the object',
              },
              {
                hi: "pasand",
                en: "love",
                pct: crossProbs[2][1],
                c: C.orange,
                note: '"pasand" (liking/love) focuses on "love" - the core verb meaning',
              },
              {
                hi: "hain",
                en: "love",
                pct: crossProbs[3][1],
                c: C.yellow,
                note: '"hain" (auxiliary "are/is") aligns with "love" to complete the predicate',
              },
            ].map(({ hi, en, pct, c, note }) => (
              <div
                key={hi}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 16, minWidth: 110 }}>"{hi}"</span>
                <span style={{ color: C.dim, fontSize: 14 }}>→</span>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 16 }}>
                  {(pct * 100).toFixed(0)}% on "{en}"
                </span>
                <T color={C.dim} size={13} style={{ marginLeft: "auto" }}>
                  {note}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: Self-attention vs cross-attention comparison */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Self-attention vs Cross-attention
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Same formula, different wiring:
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Self-attention */}
            <div
              style={{
                flex: 1,
                minWidth: 180,
                padding: "12px",
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
                  SELF-ATTENTION
                </T>
              </div>
              <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: `${C.cyan}10` }}>
                <T color={C.cyan} bold center size={14}>
                  Same Sentence
                </T>
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {["Q", "K", "V"].map((r) => (
                  <div key={r} style={{ padding: "4px 10px", borderRadius: 5, background: `${C.cyan}15` }}>
                    <T color={C.cyan} bold size={16} center>
                      {r}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                Q, K, V all from the same sentence. Words attend to each other within one language.
              </T>
              <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                Score matrix is <strong style={{ color: C.cyan }}>square</strong> (N x N)
              </T>
            </div>

            {/* Cross-attention */}
            <div
              style={{
                flex: 1,
                minWidth: 180,
                padding: "12px",
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
                  CROSS-ATTENTION
                </T>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.orange}10` }}>
                  <T color={C.orange} bold center size={14}>
                    Decoder
                  </T>
                </div>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.cyan}10` }}>
                  <T color={C.cyan} bold center size={14}>
                    Encoder
                  </T>
                </div>
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                <div style={{ padding: "4px 10px", borderRadius: 5, background: `${C.orange}15` }}>
                  <T color={C.orange} bold size={16} center>
                    Q
                  </T>
                </div>
                <div style={{ padding: "4px 10px", borderRadius: 5, background: `${C.cyan}15` }}>
                  <T color={C.cyan} bold size={16} center>
                    K
                  </T>
                </div>
                <div style={{ padding: "4px 10px", borderRadius: 5, background: `${C.cyan}15` }}>
                  <T color={C.cyan} bold size={16} center>
                    V
                  </T>
                </div>
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                Q from decoder, K and V from encoder. Decoder attends to encoder's output.
              </T>
              <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                Score matrix is <strong style={{ color: C.purple }}>rectangular</strong> (M x N)
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center>
              Each decoder layer has BOTH types of attention:
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
              1. <strong>Masked self-attention</strong> - Hindi words look at other Hindi words (with causal mask)
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 2 }}>
              2. <strong>Cross-attention</strong> - Hindi words look at English words (no mask - the full English
              sentence already exists)
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Encoder runs ONCE, all decoder layers reuse same K,V */}
      {/* Sub 4: Misconception vs Reality */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Critical detail: the encoder runs ONCE
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            A common misconception is that encoder layer 1 feeds decoder layer 1, encoder layer 2 feeds decoder layer 2,
            etc. That's <strong>not</strong> how it works.
          </T>

          {/* Misconception vs Reality side by side - centered */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            {/* WRONG: layer-to-layer */}
            <div
              style={{
                width: 200,
                padding: 16,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}25`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                WRONG
              </T>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Layer-to-layer mapping
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {[6, 5, 4, 3, 2, 1].map((n) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: C.cyan,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.cyan}12`,
                        fontWeight: 600,
                      }}
                    >
                      E{n}
                    </span>
                    <span style={{ fontSize: 13, color: C.dim }}>→</span>
                    <span
                      style={{
                        fontSize: 13,
                        color: C.orange,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.orange}12`,
                        fontWeight: 600,
                      }}
                    >
                      D{n}
                    </span>
                  </div>
                ))}
              </div>
              {/* X overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: 80, color: `${C.red}35`, fontWeight: 900, lineHeight: 1 }}>✗</span>
              </div>
            </div>

            {/* CORRECT: final output → all */}
            <div
              style={{
                width: 220,
                padding: 16,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}25`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                CORRECT
              </T>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Only the final layer matters
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    fontSize: 13,
                    color: C.cyan,
                    padding: "4px 12px",
                    borderRadius: 5,
                    background: `${C.cyan}15`,
                    border: `1px solid ${C.cyan}30`,
                    fontWeight: 600,
                  }}
                >
                  Encoder Layer 6 (final)
                </span>
                <span style={{ fontSize: 16, color: C.green, fontWeight: 700 }}>↓</span>
                <span
                  style={{
                    fontSize: 13,
                    color: C.green,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 5,
                    background: `${C.green}15`,
                    border: `1px solid ${C.green}35`,
                  }}
                >
                  K, V (computed once)
                </span>
                <div style={{ display: "flex", gap: 4, margin: "4px 0" }}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span key={n} style={{ fontSize: 14, color: `${C.green}70` }}>
                      ↓
                    </span>
                  ))}
                </div>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span
                    key={n}
                    style={{
                      fontSize: 12,
                      color: C.orange,
                      padding: "2px 10px",
                      borderRadius: 4,
                      background: `${C.orange}08`,
                      border: `1px solid ${C.orange}12`,
                    }}
                  >
                    Decoder Layer {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
              }}
            >
              <T color="#80deea" size={16}>
                <strong>Encoder:</strong> runs all 6 layers once on "I love cats". The output of layer 6 (the final
                layer) is the encoder's output - 3 contextual vectors, one per English word.
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color="#80e8a5" size={16}>
                <strong>K and V:</strong> computed once from the encoder's final output using W<sub>K</sub> and W
                <sub>V</sub> weight matrices. These are then cached and reused.
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
              }}
            >
              <T color="#ffcc80" size={16}>
                <strong>Decoder layers 1-6:</strong> each layer computes its own Q (because the decoder's representation
                changes layer by layer as it gets refined). But K and V are always the same - the encoder's final
                output.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Full architecture flow with SVG */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Complete data flow with dimensions
          </T>
          <T color={C.dim} center size={14} style={{ marginTop: 4 }}>
            d_model = 512, d_k = 64, 8 heads
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              background: "rgba(0,0,0,0.35)",
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 540 390" style={{ width: "100%", maxWidth: 560 }}>
              <desc>
                Cross-attention architecture showing encoder stack producing K and V projections fanned out to decoder
                layers, where Q comes from decoder while K and V come from encoder output
              </desc>
              {/* Encoder stack (left) - container centered at x=80 */}
              <rect
                x="15"
                y="10"
                width="130"
                height="220"
                rx="8"
                fill={`${C.cyan}08`}
                stroke={C.cyan}
                strokeOpacity="0.25"
              />
              <text x="80" y="30" fill={C.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                ENCODER
              </text>
              {[6, 5, 4, 3, 2, 1].map((n, i) => (
                <g key={n}>
                  <rect
                    x="30"
                    y={40 + i * 27}
                    width="100"
                    height="22"
                    rx="4"
                    fill={n === 6 ? `${C.cyan}20` : `${C.cyan}08`}
                    stroke={n === 6 ? C.cyan : `${C.cyan}30`}
                    strokeOpacity={n === 6 ? 0.6 : 0.2}
                  />
                  <text x="80" y={55 + i * 27} fill={n === 6 ? C.cyan : C.dim} fontSize="10" textAnchor="middle">
                    {n === 6 ? "Layer 6 (final)" : `Layer ${n}`}
                  </text>
                </g>
              ))}
              <text x="80" y="242" fill={C.dim} fontSize="10" textAnchor="middle">
                "I love cats"
              </text>
              <text x="80" y="256" fill={C.dim} fontSize="9" textAnchor="middle">
                [3 x 512]
              </text>

              {/* Arrow from encoder final to projection box */}
              <line
                x1="145"
                y1="52"
                x2="178"
                y2="52"
                stroke={C.cyan}
                strokeWidth="2"
                strokeOpacity="0.6"
                markerEnd="url(#arrowCyanCA)"
              />

              {/* Projection box: W_K, W_V - wider for dimension text */}
              <rect
                x="182"
                y="12"
                width="166"
                height="90"
                rx="8"
                fill={`${C.green}10`}
                stroke={C.green}
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
              <text x="265" y="30" fill={C.green} fontSize="11" fontWeight="700" textAnchor="middle">
                Projection (once)
              </text>
              <text x="265" y="47" fill="#80e8a5" fontSize="10" textAnchor="middle">
                K = encoder_out · W_K
              </text>
              <text x="265" y="63" fill="#80e8a5" fontSize="10" textAnchor="middle">
                V = encoder_out · W_V
              </text>
              <text x="265" y="82" fill={C.dim} fontSize="9" textAnchor="middle">
                [3 x 512] · [512 x 64] = [3 x 64]
              </text>
              <text x="265" y="96" fill={C.dim} fontSize="8" textAnchor="middle">
                (per head)
              </text>

              {/* Arrow from projection to K,V cache */}
              <line
                x1="265"
                y1="102"
                x2="265"
                y2="120"
                stroke={C.green}
                strokeWidth="1.5"
                strokeOpacity="0.5"
                markerEnd="url(#arrowGreenCA)"
              />

              {/* K,V cache box */}
              <rect
                x="205"
                y="122"
                width="120"
                height="42"
                rx="6"
                fill={`${C.green}15`}
                stroke={C.green}
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeDasharray="5,3"
              />
              <text x="265" y="141" fill={C.green} fontSize="11" fontWeight="700" textAnchor="middle">
                K, V CACHE
              </text>
              <text x="265" y="157" fill={C.dim} fontSize="9" textAnchor="middle">
                K: [3 x 64] V: [3 x 64]
              </text>

              {/* Fan-out arrows from K,V cache to all decoder layers */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="325"
                  y1={138 + i * 3}
                  x2="360"
                  y2={55 + i * 50}
                  stroke={C.green}
                  strokeWidth="1.2"
                  strokeOpacity={0.3}
                  strokeDasharray="4,3"
                />
              ))}

              {/* Decoder stack (right) - container centered at x=445 */}
              <rect
                x="360"
                y="10"
                width="170"
                height="340"
                rx="8"
                fill={`${C.orange}06`}
                stroke={C.orange}
                strokeOpacity="0.2"
              />
              <text x="445" y="30" fill={C.orange} fontSize="12" fontWeight="700" textAnchor="middle">
                DECODER
              </text>

              {[6, 5, 4, 3, 2, 1].map((n, i) => (
                <g key={n}>
                  <rect
                    x="372"
                    y={38 + i * 50}
                    width="146"
                    height="40"
                    rx="5"
                    fill={`${C.orange}08`}
                    stroke={C.orange}
                    strokeOpacity="0.2"
                  />
                  <text x="392" y={55 + i * 50} fill={C.dim} fontSize="10" textAnchor="start">
                    Layer {n}
                  </text>
                  {/* Q badge */}
                  <rect x="438" y={44 + i * 50} width="18" height="16" rx="3" fill={`${C.orange}25`} />
                  <text x="447" y={56 + i * 50} fill={C.orange} fontSize="10" fontWeight="700" textAnchor="middle">
                    Q
                  </text>
                  <text x="460" y={56 + i * 50} fill={C.dim} fontSize="9" textAnchor="start">
                    changes
                  </text>
                  {/* K,V badge */}
                  <rect x="438" y={62 + i * 50} width="30" height="14" rx="3" fill={`${C.green}18`} />
                  <text x="453" y={73 + i * 50} fill={C.green} fontSize="9" fontWeight="600" textAnchor="middle">
                    K,V
                  </text>
                  <text x="472" y={73 + i * 50} fill={C.dim} fontSize="9" textAnchor="start">
                    same
                  </text>
                </g>
              ))}

              <text x="445" y="367" fill={C.dim} fontSize="10" textAnchor="middle">
                "Mujhe billiyaan pasand hain"
              </text>
              <text x="445" y="382" fill={C.dim} fontSize="9" textAnchor="middle">
                [4 x 512]
              </text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowCyanCA" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                  <path d="M0,0 L7,2.5 L0,5" fill={C.cyan} fillOpacity="0.6" />
                </marker>
                <marker id="arrowGreenCA" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                  <path d="M0,0 L7,2.5 L0,5" fill={C.green} fillOpacity="0.6" />
                </marker>
              </defs>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* Sub 6: Layer-by-layer math + dimensions + efficiency */}
      <Reveal when={sub >= 6}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            What happens at each decoder layer
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Every decoder layer performs cross-attention with the <strong>exact same K and V</strong>, but a{" "}
            <strong>different Q</strong>:
          </T>
          <div
            style={{
              marginTop: 10,
              fontFamily: "monospace",
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.purple}15`,
            }}
          >
            {[1, 2, 6].map((n, i) => (
              <div
                key={n}
                style={{ marginTop: i > 0 ? 6 : 0, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}
              >
                <span style={{ color: C.orange, fontSize: 14 }}>Layer {n}:</span>
                <span style={{ color: C.dim, fontSize: 13 }}>Attn(</span>
                <span style={{ color: C.orange, fontSize: 14, fontWeight: 700 }}>
                  Q<sub style={{ fontSize: 10 }}>{n}</sub>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>,</span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>K</span>
                <span style={{ color: C.dim, fontSize: 13 }}>,</span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>V</span>
                <span style={{ color: C.dim, fontSize: 13 }}>) = softmax(</span>
                <span style={{ color: C.orange, fontSize: 14, fontWeight: 700 }}>
                  Q<sub style={{ fontSize: 10 }}>{n}</sub>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}> · </span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>
                  K<sup style={{ fontSize: 10 }}>T</sup>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}> / √64) · </span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>V</span>
                {n === 2 && <span style={{ color: C.dim, fontSize: 12, marginLeft: 8 }}>... same K, V</span>}
                {i === 1 && (
                  <div style={{ width: "100%", textAlign: "center", color: C.dim, fontSize: 12, margin: "2px 0" }}>
                    ⋮
                  </div>
                )}
              </div>
            ))}
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 8 }}>
            Q<sub>1</sub> comes from the decoder's layer 1 output. Q<sub>6</sub> comes from layer 6's output. The
            decoder's representation evolves layer by layer - Q captures "what I'm looking for" at each stage of
            refinement. K and V capture "what the encoder said" - and that never changes.
          </T>

          {/* Dimension walkthrough */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            <T color={C.yellow} bold center size={17}>
              Dimension walkthrough (d_model = 512, heads = 8, d_k = 64)
            </T>
            {[
              { label: "Encoder output", dims: "[3 x 512]", detail: "3 English tokens, each 512 dims", color: C.cyan },
              {
                label: "W_K projection",
                dims: "[512 x 64]",
                detail: "per head, learned during training",
                color: C.green,
              },
              { label: "K (cached)", dims: "[3 x 64]", detail: "3 keys, one per English token", color: C.green },
              { label: "V (cached)", dims: "[3 x 64]", detail: "3 values, one per English token", color: C.green },
              {
                label: "Decoder layer n",
                dims: "[4 x 512]",
                detail: "4 Hindi tokens, each 512 dims",
                color: C.orange,
              },
              { label: "Q_n (per layer)", dims: "[4 x 64]", detail: "4 queries, changes each layer", color: C.orange },
              {
                label: "Q_n · K^T scores",
                dims: "[4 x 3]",
                detail: "every Hindi word scores every English word",
                color: C.yellow,
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}12`,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: row.color, fontWeight: 700, fontSize: 14, minWidth: 140 }}>{row.label}</span>
                <span
                  style={{ fontFamily: "monospace", color: row.color, fontSize: 15, fontWeight: 700, minWidth: 70 }}
                >
                  {row.dims}
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>{row.detail}</span>
              </div>
            ))}
          </div>

          {/* Efficiency + weight matrix detail */}
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <T color={C.yellow} bold center>
                Why is this efficient?
              </T>
              <T color="#ffe082" size={15} style={{ marginTop: 4 }}>
                The encoder runs <strong>once</strong>. K and V are computed <strong>once</strong>. Only Q changes per
                decoder layer. For a 1000-token input, this saves computing 1000-token K and V six times - a 6x
                reduction in encoder-side computation.
              </T>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}15`,
              }}
            >
              <T color="#ef9a9a" bold center>
                6 weight matrices per layer
              </T>
              <T color="#ef9a9a" size={15} style={{ marginTop: 4 }}>
                Each decoder layer has <strong>6</strong> separate learned matrices: W<sub>Q</sub>, W<sub>K</sub>, W
                <sub>V</sub> for masked self-attention (Q, K, V all from Hindi) + W<sub>Q</sub>, W<sub>K</sub>, W
                <sub>V</sub> for cross-attention (Q from Hindi, K and V from English). All learned independently.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 7: Where cross-attention appears */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Where does cross-attention live?
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "12px",
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
                  Decoder-Only
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                GPT, Claude, LLaMA
              </T>
              <T color="#ffcc80" bold center size={18} style={{ marginTop: 6 }}>
                No cross-attention at all
              </T>
              <T color={C.dim} size={15} center style={{ marginTop: 4 }}>
                There's no encoder, so nothing to cross-attend to. The decoder handles everything with just
                self-attention. Your prompt and the response are one continuous sequence.
              </T>
            </div>

            <div
              style={{
                padding: "12px",
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
                  Encoder-Decoder
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Original Transformer, T5, BART
              </T>
              <T color="#b8a9ff" bold center size={18} style={{ marginTop: 6 }}>
                Cross-attention in every decoder layer
              </T>
              <T color={C.dim} size={15} center style={{ marginTop: 4 }}>
                Each decoder layer has three sub-layers in order:
              </T>
              <div
                style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 340 }}
              >
                {[
                  { n: "1", label: "Masked self-attention", desc: "Hindi looks at Hindi (causal)", color: C.orange },
                  { n: "2", label: "Cross-attention", desc: "Hindi looks at English (full)", color: C.purple },
                  { n: "3", label: "Feed-forward network", desc: "Process each position independently", color: C.blue },
                ].map(({ n, label, desc, color }) => (
                  <div
                    key={n}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${color}08`,
                      border: `1px solid ${color}15`,
                    }}
                  >
                    <span style={{ color, fontWeight: 800, fontSize: 18, minWidth: 20 }}>{n}.</span>
                    <div>
                      <T color={color} bold size={15}>
                        {label}
                      </T>
                      <T color={C.dim} size={13}>
                        {desc}
                      </T>
                    </div>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 6 }}>
                This is exactly what the architecture diagram in chapter 5.1 shows - the green arrow "K, V from encoder"
                connects to this cross-attention layer.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}15`,
            }}
          >
            <T color="#80e8a5" bold center>
              Cross-attention is elegant but optional
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 4 }}>
              Modern LLMs prove you can get world-class results without it. But for tasks with clear input/output
              separation (translation, summarization), the encoder-decoder architecture with cross-attention remains
              powerful.
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
    </div>
  );
}
