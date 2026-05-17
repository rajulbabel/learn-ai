import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { EXP_SCORES, EXP_SUM, SORTED_SCORES, SORTED_PROBS } from "../../shared/llm-training-helpers.jsx";

// Module-private helpers used by NNInAction (2.4)
const VOCAB = [
  "the",
  "cat",
  "sat",
  "on",
  "mat",
  "a",
  "dog",
  "ran",
  "is",
  "was",
  "big",
  "small",
  "red",
  "blue",
  "and",
  "in",
  "it",
  "my",
  "to",
  "with",
];

export default function NNInAction(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: Vocabulary grid ── */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Our tiny world: only 20 words exist
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Forget 50,000 words. Our model only knows these 20 words. Every word gets a number (its ID). The model never
            sees letters - only these numbers.
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {VOCAB.map((w, i) => (
              <div
                key={w}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  textAlign: "center",
                  background: `${C.cyan}10`,
                  border: `1px solid ${C.cyan}20`,
                }}
              >
                <T color="#80deea" size={13} bold>
                  <span style={{ opacity: 0.5, fontSize: 11 }}>[{i}]</span> {w}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ── Sub 1: Input sentence ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            The input: "The cat sat on" - predict what?
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            We feed in four words. The model's job: figure out what word #5 should be.
          </T>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["The", "cat", "sat", "on"].map((w, i) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: `${C.orange}20` }}>
                  <T color="#ffcc80" bold size={16}>
                    {w} <span style={{ fontSize: 11, opacity: 0.6 }}>[{i}]</span>
                  </T>
                </div>
                {i < 3 && (
                  <T color={C.dim} size={20}>
                    →
                  </T>
                )}
              </div>
            ))}
            <T color={C.dim} size={20}>
              →
            </T>
            <div
              style={{ padding: "8px 14px", borderRadius: 8, border: `2px dashed ${C.red}`, background: `${C.red}10` }}
            >
              <T color={C.red} bold size={16}>
                ???
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 2: Neural network diagram ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The neural network: what it actually looks like
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            The last input word ("on") gets converted to numbers, flows through hidden layers where every circle does:{" "}
            <strong>multiply inputs by weights → add up → apply activation</strong>. Then the output layer has{" "}
            <strong>one circle for every word in our vocabulary (all 20)</strong>.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              overflowX: "auto",
              padding: "10px 0",
            }}
          >
            {[
              {
                label: "Input",
                sublabel: "(word: 'on')",
                nodes: [
                  { l: "0", active: false },
                  { l: "0", active: false },
                  { l: "0", active: false },
                  { l: "1", active: true },
                ],
                color: "#ffcc80",
                bg: "rgba(255,171,64,0.15)",
              },
              {
                label: "Hidden 1",
                sublabel: "(8 circles)",
                nodes: Array(6)
                  .fill(null)
                  .map(() => ({ l: "", active: false })),
                color: "#b8a9ff",
                bg: "rgba(167,139,250,0.12)",
              },
              {
                label: "Hidden 2",
                sublabel: "(8 circles)",
                nodes: Array(6)
                  .fill(null)
                  .map(() => ({ l: "", active: false })),
                color: "#b8a9ff",
                bg: "rgba(167,139,250,0.12)",
              },
              {
                label: "Output",
                sublabel: "(20 words)",
                nodes: [
                  { l: "the", active: true },
                  { l: "cat", active: false },
                  { l: "sat", active: false },
                  { l: "on", active: false },
                  { l: "mat", active: true },
                  { l: "...", active: false },
                  { l: "with", active: false },
                ],
                color: "#80e8a5",
                bg: "rgba(0,230,118,0.12)",
              },
            ].map((layer, li) => (
              <div key={layer.label} style={{ display: "flex", alignItems: "center" }}>
                {li > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 40,
                      padding: "0 2px",
                    }}
                  >
                    <T color={C.dim} size={16}>
                      →
                    </T>
                    <T color={C.dim} size={10}>
                      weights
                    </T>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 70 }}>
                  <T color={layer.color} bold size={12}>
                    {layer.label}
                  </T>
                  <T color={C.dim} size={10} style={{ marginTop: -4 }}>
                    {layer.sublabel}
                  </T>
                  {layer.nodes.map((n, ni) => (
                    <div
                      key={ni}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: n.active ? layer.bg.replace("0.12", "0.35").replace("0.15", "0.35") : layer.bg,
                        border: `2px solid ${n.active ? layer.color : "rgba(255,255,255,0.1)"}`,
                        fontSize: li === 3 ? 9 : 11,
                        fontWeight: 600,
                        color: layer.color,
                      }}
                    >
                      {n.l}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            <strong>Every line is a weight</strong> - a number that was learned during training. The input (4 numbers
            representing "on") gets multiplied by weights, transformed, multiplied by more weights, transformed again,
            until it reaches the 20 output circles. Each output circle produces one score for one word.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 3: Output node computation ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Each output circle computes a score (called a "logit")
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            After the input flows through all the hidden layers, the final layer has 20 circles. Each circle collects
            numbers from the layer before it, multiplies each by its own weight, and adds them up. That sum is the score
            for that word.
          </T>

          <div style={{ marginTop: 12, padding: 16, borderRadius: 10, background: "rgba(0,0,0,0.3)" }}>
            <T color="#80e8a5" bold center size={15}>
              Example: How the "mat" circle computes its score
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontFamily: "'SF Mono', Consolas, monospace",
                fontSize: 14,
              }}
            >
              <T color={C.mid} size={14}>
                Values arriving from previous layer: [2.1, -0.8, 1.5, 0.3, -1.2, 0.9, 1.7, -0.4]
              </T>
              <T color={C.mid} size={14}>
                Weights for "mat" circle: [0.6, 0.3, 0.8, 0.1, -0.5, 0.2, 0.9, 0.4]
              </T>
              <T color="#80e8a5" style={{ marginTop: 8 }} size={14}>
                Score = (2.1 x 0.6) + (-0.8 x 0.3) + (1.5 x 0.8) + (0.3 x 0.1) + (-1.2 x -0.5) + (0.9 x 0.2) + (1.7 x
                0.9) + (-0.4 x 0.4)
              </T>
              <T color="#80e8a5" size={14}>
                = 1.26 + (-0.24) + 1.20 + 0.03 + 0.60 + 0.18 + 1.53 + (-0.16)
              </T>
              <T color={C.green} bold center size={18} style={{ marginTop: 8 }}>
                Score for "mat" = 4.40
              </T>
            </div>
          </div>

          <T color="#80e8a5" style={{ marginTop: 10 }}>
            The same thing happens for all 20 output circles, each with its <strong>own set of weights</strong>. So
            "the" circle has different weights, "cat" circle has different weights, etc. That's why they produce
            different scores.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 4: Raw scores for all 20 words ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Raw scores for all 20 words
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            Each output circle has computed its score. Here is what the model produced for input "The cat sat on":
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
            {SORTED_SCORES.map(([word, score]) => {
              const isHigh = score >= 3;
              const isLow = score <= -1.5;
              const color = isHigh ? C.green : isLow ? C.red : C.mid;
              const bg = isHigh ? `${C.green}08` : isLow ? `${C.red}08` : "rgba(255,255,255,0.02)";
              return (
                <div
                  key={word}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: bg,
                  }}
                >
                  <T color={color} bold size={14}>
                    {word}
                  </T>
                  <T color={color} bold size={14} style={{ fontFamily: "monospace" }}>
                    {score >= 0 ? "+" : ""}
                    {score.toFixed(1)}
                  </T>
                </div>
              );
            })}
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            Notice: "the" and "mat" have the highest scores. "my" is deeply negative. But these are not probabilities
            yet - they are just raw numbers. We need to convert them.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 5: Softmax conversion ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Convert scores to probabilities (softmax)
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Two simple steps: raise e (2.718) to the power of each score, then divide each result by the total. This
            makes everything positive and add up to 100%.
          </T>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 70px 30px 80px 30px 70px",
                gap: 2,
                fontSize: 13,
                fontFamily: "monospace",
              }}
            >
              {["Word", "Score", "", "e^score", "", "Prob"].map((h, i) => (
                <div key={i} style={{ color: "#ffe082", fontWeight: 700, padding: "6px 4px" }}>
                  {h}
                </div>
              ))}
              {[...SORTED_SCORES.slice(0, 8), null, ...SORTED_SCORES.slice(-2)].map((item, _idx) => {
                if (item === null)
                  return (
                    <div key="sep" style={{ gridColumn: "1 / -1", textAlign: "center", color: C.dim, padding: 2 }}>
                      ...
                    </div>
                  );
                const [word, score] = item;
                const eScore = EXP_SCORES[word];
                const prob = eScore / EXP_SUM;
                const isHigh = score >= 3;
                const color = isHigh ? "#ffe082" : C.mid;
                return [
                  <div key={`${word}-w`} style={{ color, padding: 4, fontWeight: isHigh ? 700 : 400 }}>
                    {word}
                  </div>,
                  <div key={`${word}-s`} style={{ color, padding: 4 }}>
                    {score >= 0 ? "+" : ""}
                    {score.toFixed(1)}
                  </div>,
                  <div key={`${word}-a1`} style={{ color: C.dim, padding: 4, textAlign: "center" }}>
                    →
                  </div>,
                  <div key={`${word}-e`} style={{ color, padding: 4 }}>
                    {eScore.toFixed(2)}
                  </div>,
                  <div key={`${word}-a2`} style={{ color: C.dim, padding: 4, textAlign: "center" }}>
                    →
                  </div>,
                  <div key={`${word}-p`} style={{ color, padding: 4, fontWeight: 700 }}>
                    {(prob * 100).toFixed(1)}%
                  </div>,
                ];
              })}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 10 }}>
              Sum of all e^score = {EXP_SUM.toFixed(2)} → each probability = e^score / {EXP_SUM.toFixed(2)}
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 6: Probability bars ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            The final answer: probability for each word
          </T>
          <T color="#90caf9" style={{ marginTop: 6 }}>
            This is what the model outputs. A probability for <strong>every single one</strong> of the 20 words. The
            highest probability is the model's best guess for the next word.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {SORTED_PROBS.slice(0, 10).map(([word, prob], i) => {
              const maxP = SORTED_PROBS[0][1];
              const widthPct = (prob / maxP) * 100;
              const isTop = i === 0;
              const barColor = isTop ? C.blue : i < 3 ? `${C.blue}99` : `${C.blue}4d`;
              const textColor = isTop ? "#90caf9" : C.mid;
              return (
                <div key={word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={textColor} bold size={14} style={{ minWidth: 60 }}>
                    {word}
                  </T>
                  <div
                    style={{
                      flex: 1,
                      height: 24,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: `${widthPct}%`, height: "100%", background: barColor, borderRadius: 6 }} />
                  </div>
                  <T color={textColor} bold size={14} style={{ minWidth: 50, textAlign: "right" }}>
                    {(prob * 100).toFixed(1)}%
                  </T>
                </div>
              );
            })}
            <T color={C.dim} size={13} center>
              ...plus 10 more words with less than 1% each
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 8,
              background: `${C.blue}10`,
              border: `1px solid ${C.blue}20`,
            }}
          >
            <T color="#90caf9" bold center size={16}>
              Model's prediction: "the" (46.0%) → "The cat sat on <u>the</u>"
            </T>
            <T color={C.mid} size={14} center style={{ marginTop: 6 }}>
              The actual next word in training was "the" → loss = -log(0.460) = 0.78
            </T>
            <T color={C.mid} size={14} center style={{ marginTop: 2 }}>
              Not bad! But not 100% confident. Backprop will nudge the weights to make it more confident next time.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 7: Key insight ── */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The key insight: it is ALL just multiply and add
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            The entire process - from input word to 20 probabilities - is nothing but:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                step: "1. Take numbers in",
                detail: 'the word "on" becomes [0, 0, 0, 1, 0, ...] or an embedding vector',
              },
              {
                step: "2. Multiply by weights, add up, apply activation",
                detail: "each circle in each hidden layer does this",
              },
              { step: "3. Repeat through every layer", detail: "GPT-2 has 12 layers, GPT-4 has ~100+ layers" },
              {
                step: "4. Last layer: one circle per vocabulary word",
                detail: "20 circles for us, 50,000 for real GPT",
              },
              { step: "5. Softmax to get probabilities", detail: "exponentiate and divide. Now they sum to 100%" },
            ].map(({ step, detail }) => (
              <div
                key={step}
                style={{ padding: 12, borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}15` }}
              >
                <T color="#80e8a5" bold size={15}>
                  {step}
                </T>
                <T color={C.mid} size={14}>
                  {" "}
                  - {detail}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" style={{ marginTop: 10 }}>
            That's it. No magic.{" "}
            <strong>The only "smart" part is the weights - the numbers on each connection line.</strong> Training
            (gradient descent) adjusts those weights trillions of times until the multiply-and-add chain produces good
            predictions.
          </T>
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
