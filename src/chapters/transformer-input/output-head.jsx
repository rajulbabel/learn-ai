import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function OutputHead(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The gap between vectors and words */}
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={21}>
            From vectors to words - the final step
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            After all transformer layers, every position holds a rich, context-aware vector of{" "}
            <strong>512 numbers</strong>. This vector encodes everything the model understood about that position.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            But we need an actual <strong>word</strong>, not 512 numbers. The model's vocab has <strong>50,257</strong>{" "}
            possible tokens. How does it choose one?
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: `${C.cyan}08`,
                border: `1px solid ${C.cyan}20`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold size={16}>
                Decoder output
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                [0.82, -0.31, 0.57, 0.14, ...]
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 2 }}>
                512 numbers
              </T>
            </div>
            <T color={C.bright} bold size={24}>
              {"→"}
            </T>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold size={16}>
                ?
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Which of 50,257 words?
              </T>
            </div>
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            That is exactly what the <strong>output head</strong> does. It has two parts: a <strong>Linear</strong>{" "}
            layer and <strong>Softmax</strong>. These are the two blocks sitting at the very top of the architecture
            diagram.
          </T>
        </Box>
      )}

      {/* Sub 1: The Linear layer */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Linear layer - one giant matrix multiply
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The Linear layer is a weight matrix W with <strong>512 rows</strong> and <strong>50,257 columns</strong>.
            Each column represents one word in the vocabulary.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <T color="#80deea" bold center size={16}>
              The matrix multiplication
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}15`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold size={14}>
                  hidden state
                </T>
                <T color={C.dim} size={13}>
                  [1 x 512]
                </T>
              </div>
              <T color={C.bright} bold size={20}>
                {"×"}
              </T>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}15`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold size={14}>
                  W
                </T>
                <T color={C.dim} size={13}>
                  [512 x 50,257]
                </T>
              </div>
              <T color={C.bright} bold size={20}>
                =
              </T>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}15`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold size={14}>
                  logits
                </T>
                <T color={C.dim} size={13}>
                  [1 x 50,257]
                </T>
              </div>
            </div>
          </div>

          <T color="#80deea" style={{ marginTop: 10 }}>
            One matrix multiply. That is it. No activation function, no non-linearity - just multiply the 512-dim hidden
            state by this giant matrix and you get <strong>50,257 raw scores</strong>, one for every word in the
            vocabulary.
          </T>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>
            This single matrix has 512 x 50,257 = <strong>25.7 million</strong> parameters. It is the second largest
            weight matrix in the model (after the embedding table).
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: What logits mean */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            What logits mean - dot product similarity
          </T>
          <T color="#fff176" style={{ marginTop: 6 }}>
            Each logit is a <strong>dot product</strong> between the hidden state and one column of W. A high dot
            product means the hidden state is pointing in the same direction as that word's template.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color="#fff176" bold center size={16}>
              Computing one logit
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${C.green}06`,
                }}
              >
                <T color={C.green} size={14} bold>
                  hidden state:
                </T>
                <T color={C.dim} size={13} style={{ fontFamily: "monospace" }}>
                  [0.82, -0.31, 0.57, 0.14, ... 512 dims]
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${C.cyan}06`,
                }}
              >
                <T color={C.cyan} size={14} bold>
                  W column for "cats":
                </T>
                <T color={C.dim} size={13} style={{ fontFamily: "monospace" }}>
                  [0.71, -0.25, 0.63, 0.08, ... 512 dims]
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${C.yellow}06`,
                }}
              >
                <T color={C.yellow} size={14} bold>
                  logit = dot product:
                </T>
                <T color={C.dim} size={13}>
                  (0.82)(0.71) + (-0.31)(-0.25) + (0.57)(0.63) + ... = <strong style={{ color: C.yellow }}>4.2</strong>
                </T>
              </div>
            </div>
          </div>

          <T color="#fff176" style={{ marginTop: 10 }} bold>
            This happens for all 50,257 words simultaneously:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { word: "cats", logit: 4.2, c: C.green },
              { word: "dogs", logit: 3.1, c: C.cyan },
              { word: "the", logit: 1.5, c: C.yellow },
              { word: "love", logit: -0.3, c: C.orange },
              { word: "banana", logit: -2.1, c: C.red },
            ].map(({ word, logit, c }) => (
              <div
                key={word}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold size={15} style={{ minWidth: 60 }}>
                  {word}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 14,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.04)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max((logit + 3) * 14, 2)}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: `${c}50`,
                    }}
                  />
                </div>
                <T color={C.dim} size={13} style={{ minWidth: 35, fontFamily: "monospace" }}>
                  {logit > 0 ? "+" : ""}
                  {logit.toFixed(1)}
                </T>
              </div>
            ))}
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>
              ... and 50,252 more words, each with a logit score
            </T>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 8 }}>
            High logit = the model's hidden state is similar to that word's representation. Low or negative =
            dissimilar. But these raw numbers are hard to interpret - we need probabilities.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Softmax */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            Softmax - from scores to probabilities
          </T>
          <T color="#a5d6a7" style={{ marginTop: 6 }}>
            Raw logits can be any number: positive, negative, huge, tiny. <strong>Softmax</strong> converts them into
            probabilities that are all positive and sum to exactly 1.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color="#a5d6a7" bold center size={16}>
              The softmax formula
            </T>
            <T color={C.bright} center size={17} style={{ marginTop: 8, fontFamily: "monospace" }}>
              P(word_i) = e<sup>logit_i</sup> / {"Σ"} e<sup>logit_j</sup>
            </T>
            <T color={C.dim} center size={14} style={{ marginTop: 6 }}>
              Exponentiate each logit, then divide by the sum of all exponentiated logits.
            </T>
          </div>

          <T color="#a5d6a7" style={{ marginTop: 12 }} bold>
            Watch the transformation:
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: 3 }}>
              <T color={C.yellow} bold center size={14}>
                Raw logits
              </T>
              {[
                { word: "cats", val: "+4.2", c: C.green },
                { word: "dogs", val: "+3.1", c: C.cyan },
                { word: "the", val: "+1.5", c: C.yellow },
                { word: "love", val: "-0.3", c: C.orange },
                { word: "banana", val: "-2.1", c: C.red },
              ].map(({ word, val, c }) => (
                <div
                  key={word}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: `${c}06`,
                  }}
                >
                  <T color={c} size={14}>
                    {word}
                  </T>
                  <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                    {val}
                  </T>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <T color={C.bright} bold size={20}>
                {"→"}
              </T>
            </div>
            <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: 3 }}>
              <T color={C.green} bold center size={14}>
                After softmax
              </T>
              {[
                { word: "cats", val: "70.8%", pct: 70.8, c: C.green },
                { word: "dogs", val: "23.6%", pct: 23.6, c: C.cyan },
                { word: "the", val: "4.8%", pct: 4.8, c: C.yellow },
                { word: "love", val: "0.8%", pct: 0.8, c: C.orange },
                { word: "banana", val: "0.1%", pct: 0.1, c: C.red },
              ].map(({ word, val, pct, c }) => (
                <div
                  key={word}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: `${c}06`,
                  }}
                >
                  <T color={c} size={14} style={{ minWidth: 50 }}>
                    {word}
                  </T>
                  <div
                    style={{
                      flex: 1,
                      height: 12,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.04)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: `${c}50` }} />
                  </div>
                  <T color={C.dim} size={13} style={{ minWidth: 40, textAlign: "right" }}>
                    {val}
                  </T>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.dim} size={14}>
              Notice how softmax <strong style={{ color: C.green }}>amplifies differences</strong>. A logit gap of just
              1.1 between "cats" (4.2) and "dogs" (3.1) becomes a 3x probability difference (71% vs 24%). The
              exponential function makes the winner win big.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Temperature */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Temperature - the creativity dial
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Before softmax, divide each logit by a number called <strong>temperature (T)</strong>. This controls how
            "peaked" or "spread out" the resulting probabilities are.
          </T>

          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}20`,
            }}
          >
            <T color={C.bright} center size={16} style={{ fontFamily: "monospace" }}>
              softmax( logit / temperature )
            </T>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              {
                temp: "T = 0.2",
                label: "Focused",
                desc: "Almost deterministic",
                probs: [
                  { w: "cats", p: 100 },
                  { w: "dogs", p: 0 },
                  { w: "the", p: 0 },
                ],
                c: C.blue,
              },
              {
                temp: "T = 1.0",
                label: "Default",
                desc: "Balanced",
                probs: [
                  { w: "cats", p: 71 },
                  { w: "dogs", p: 24 },
                  { w: "the", p: 5 },
                ],
                c: C.green,
              },
              {
                temp: "T = 2.0",
                label: "Creative",
                desc: "More spread out",
                probs: [
                  { w: "cats", p: 50 },
                  { w: "dogs", p: 29 },
                  { w: "the", p: 13 },
                ],
                c: C.orange,
              },
            ].map(({ temp, label, desc, probs, c }) => (
              <div
                key={temp}
                style={{
                  flex: "1 1 140px",
                  padding: 10,
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}15`,
                }}
              >
                <T color={c} bold center size={15}>
                  {temp}
                </T>
                <T color={C.dim} center size={12}>
                  {label} - {desc}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {probs.map(({ w, p }) => (
                    <div key={w} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <T color={C.dim} size={12} style={{ minWidth: 32 }}>
                        {w}
                      </T>
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.04)",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ width: `${p}%`, height: "100%", borderRadius: 3, background: `${c}50` }} />
                      </div>
                      <T color={C.dim} size={11} style={{ minWidth: 28, textAlign: "right" }}>
                        {p}%
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.dim} size={14}>
              <strong style={{ color: C.orange }}>Low temperature</strong> (0.2): divides logits by 0.2, making
              differences 5x larger before softmax. The top word dominates.{" "}
              <strong style={{ color: C.orange }}>High temperature</strong> (2.0): divides by 2.0, shrinking
              differences. More words get a fair chance. Temperature = 0 would be pure greedy (pick the top word every
              time).
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Sampling strategies */}
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Sampling strategies - how to pick the next token
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            After softmax gives us probabilities, we still need to decide: which word do we actually pick? There are
            three main strategies:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Greedy */}
            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20` }}
            >
              <T color={C.yellow} bold size={16}>
                Greedy decoding
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Always pick the highest probability word. Simple but boring - the same input always produces the same
                output.
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { w: "cats", p: 71, pick: true },
                  { w: "dogs", p: 24, pick: false },
                  { w: "the", p: 5, pick: false },
                  { w: "love", p: 1, pick: false },
                ].map(({ w, p, pick }) => (
                  <div
                    key={w}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: pick ? `${C.green}15` : `${C.dim}08`,
                      border: `1px solid ${pick ? C.green : C.dim}25`,
                    }}
                  >
                    <T color={pick ? C.green : C.dim} bold={pick} size={13}>
                      {w} {p}% {pick ? "✓" : ""}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-k */}
            <div style={{ padding: 12, borderRadius: 10, background: `${C.cyan}06`, border: `1px solid ${C.cyan}20` }}>
              <T color={C.cyan} bold size={16}>
                Top-k sampling (e.g., k = 3)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Keep only the k highest-probability words. Re-normalize their probabilities and randomly sample from
                them. Balances quality with variety.
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { w: "cats", p: 71, keep: true },
                  { w: "dogs", p: 24, keep: true },
                  { w: "the", p: 5, keep: true },
                  { w: "love", p: 1, keep: false },
                ].map(({ w, p, keep }) => (
                  <div
                    key={w}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: keep ? `${C.cyan}15` : `${C.red}08`,
                      border: `1px solid ${keep ? C.cyan : C.red}25`,
                      textDecoration: keep ? "none" : "line-through",
                    }}
                  >
                    <T color={keep ? C.cyan : C.red} size={13}>
                      {w} {p}%
                    </T>
                  </div>
                ))}
                <T color={C.dim} size={12}>
                  {"→"} sample from top 3
                </T>
              </div>
            </div>

            {/* Top-p */}
            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}20` }}
            >
              <T color={C.green} bold size={16}>
                Top-p sampling / nucleus (e.g., p = 0.9)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Keep adding words (highest probability first) until their cumulative probability reaches p. More
                adaptive than Top-k - uses fewer words when the model is confident, more when uncertain.
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { w: "cats", p: 71, cum: 71, keep: true },
                  { w: "dogs", p: 24, cum: 95, keep: true },
                  { w: "the", p: 5, cum: 100, keep: false },
                  { w: "love", p: 1, cum: 101, keep: false },
                ].map(({ w, p, cum, keep }) => (
                  <div
                    key={w}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: keep ? `${C.green}15` : `${C.red}08`,
                      border: `1px solid ${keep ? C.green : C.red}25`,
                    }}
                  >
                    <T color={keep ? C.green : C.red} size={13}>
                      {w} {p}%{" "}
                      <span style={{ color: C.dim, fontSize: 11 }}>
                        ({"Σ"}
                        {cum}%)
                      </span>
                    </T>
                  </div>
                ))}
                <T color={C.dim} size={12}>
                  {"→"} stop at 87% (under 90%)
                </T>
              </div>
            </div>
          </div>

          <T color={C.dim} size={14} style={{ marginTop: 10 }}>
            In practice, most APIs combine temperature + Top-p. ChatGPT defaults: temperature = 1.0, Top-p = 1.0 (no
            filtering). For more focused output: temperature = 0.7, Top-p = 0.9.
          </T>
        </Box>
      </Reveal>

      {/* Sub 6: Weight tying */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            Weight tying - the elegant shortcut
          </T>
          <T color="#90caf9" style={{ marginTop: 6 }}>
            Here is a surprising fact: the output Linear layer's weight matrix W is <strong>the same matrix</strong> as
            the embedding table from the input - just transposed.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: `${C.cyan}08`,
                border: `1px solid ${C.cyan}20`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold size={15}>
                Embedding (input)
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                word {"→"} vector
              </T>
              <T color={C.dim} size={12}>
                [50,257 x 512]
              </T>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <T color={C.bright} bold size={14}>
                SAME MATRIX
              </T>
              <T color={C.yellow} size={20}>
                {"⇆"}
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                textAlign: "center",
              }}
            >
              <T color={C.blue} bold size={15}>
                Linear (output)
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                vector {"→"} word scores
              </T>
              <T color={C.dim} size={12}>
                [512 x 50,257]
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
            }}
          >
            <T color="#90caf9" bold size={15}>
              Why does this work?
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              The embedding table maps each word to a point in 512-dimensional space. The output layer asks: "which
              word's point is closest to this hidden state?" That is the same operation in reverse.
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              If the embedding for "cats" is [0.71, -0.25, 0.63, ...] and our hidden state is [0.82, -0.31, 0.57, ...],
              the dot product is high because they point in similar directions. The model is literally asking: "which
              embedding vector is this hidden state most similar to?"
            </T>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={14}>
              Parameter savings from weight tying
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              Without tying: 50,257 x 512 = 25.7M extra parameters. With tying:{" "}
              <strong style={{ color: C.green }}>zero extra parameters</strong> - the output layer reuses the embedding
              matrix. GPT-2 and most modern LLMs use this trick.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 7: Complete output pipeline */}
      <Reveal when={sub >= 7}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The complete output pipeline
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Here is every step from hidden state to predicted token:
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[
              { label: "hidden state", desc: "512 dims", c: C.green },
              { label: "Linear (Wᵀ)", desc: "512 → 50,257", c: C.cyan },
              { label: "logits", desc: "50,257 scores", c: C.yellow },
              { label: "÷ T", desc: "temperature", c: C.orange },
              { label: "softmax", desc: "→ probabilities", c: C.green },
              { label: "sample", desc: "Top-k / Top-p", c: C.red },
              { label: "next token", desc: '"cats"', c: C.purple },
            ].map(({ label, desc, c }, i, arr) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: `${c}10`,
                    border: `1px solid ${c}25`,
                    textAlign: "center",
                  }}
                >
                  <T color={c} bold size={14}>
                    {label}
                  </T>
                  <T color={C.dim} size={11}>
                    {desc}
                  </T>
                </span>
                {i < arr.length - 1 && (
                  <T color={C.dim} size={16}>
                    {"→"}
                  </T>
                )}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color="#b8a9ff" bold size={15}>
                During training
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                The model computes this output head at <strong>every</strong> position simultaneously. At position 1
                ("I"), it should predict "love". At position 2 ("love"), it should predict "cats". Cross-entropy loss
                measures how wrong each prediction was, and backprop updates the weights.
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color="#80deea" bold size={15}>
                During inference
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Only the <strong>last position's</strong> hidden state goes through the output head. That is the
                position where the model predicts the next token. This single prediction gets sampled, appended to the
                input, and the whole process repeats - one token at a time.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color="#fff176" bold size={15}>
              The big picture
            </T>
            <T color="#fff176" size={14} style={{ marginTop: 4 }}>
              The entire transformer - embeddings, positional encoding, attention, FFN, layer stacking - exists to
              produce one good hidden state at the final position. The output head then converts that single
              512-dimensional vector into a probability distribution over 50,257 words. One matrix multiply, one
              softmax. That is all it takes to go from "understanding" to "speaking."
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
