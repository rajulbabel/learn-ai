import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function AutoregressiveGeneration(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: Training sees everything at once, but generation builds one word at a time ── */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Two very different modes
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The model has two lives. During <strong>training</strong>, it sees entire sentences and learns to predict
            the next word at every position. But when you actually <strong>use</strong> it (generation), it has to build
            the answer one word at a time.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>
                Training (learning phase)
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["The", "cat", "sat", "on", "the", "mat"].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: `${C.green}15`,
                      border: `1px solid ${C.green}25`,
                    }}
                  >
                    <T color={C.green} bold size={14}>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                The model sees ALL words at once. At each position, it predicts the next word and checks if it was
                right. Fast - one pass through the whole sentence.
              </T>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}
            >
              <T color={C.orange} bold size={16}>
                Generation (using the model)
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                {["The", "cat", "sat", "on"].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: `${C.orange}15`,
                      border: `1px solid ${C.orange}25`,
                    }}
                  >
                    <T color={C.orange} bold size={14}>
                      {w}
                    </T>
                  </div>
                ))}
                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: `${C.yellow}20`,
                    border: `2px dashed ${C.yellow}50`,
                  }}
                >
                  <T color={C.yellow} bold size={14}>
                    ???
                  </T>
                </div>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                The model only has the prompt. It must predict the next word, add it, then predict the next, add it...
                one word at a time. This is called <strong>autoregressive generation</strong>.
              </T>
            </div>
          </div>
        </Box>
      )}

      {/* ── Sub 1: Step-by-step generation with full pipeline visible ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Watch it build the sentence, word by word
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Prompt: <strong>"The cat sat on"</strong>. At each step, the full pipeline runs: tokens go in, hidden layers
            process them, output layer produces 50,000 probabilities via softmax, and the model picks one word.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                step: 1,
                input: ["The", "cat", "sat", "on"],
                pred: "the",
                prob: 72,
                topAlt: [
                  { w: "a", p: 15 },
                  { w: "that", p: 8 },
                ],
              },
              {
                step: 2,
                input: ["The", "cat", "sat", "on", "the"],
                pred: "mat",
                prob: 68,
                topAlt: [
                  { w: "floor", p: 18 },
                  { w: "sofa", p: 7 },
                ],
              },
              {
                step: 3,
                input: ["The", "cat", "sat", "on", "the", "mat"],
                pred: "last",
                prob: 45,
                topAlt: [
                  { w: "all", p: 22 },
                  { w: "and", p: 15 },
                ],
              },
              {
                step: 4,
                input: ["The", "cat", "sat", "on", "the", "mat", "last"],
                pred: "week",
                prob: 91,
                topAlt: [
                  { w: "night", p: 5 },
                  { w: "time", p: 2 },
                ],
              },
            ].map(({ step, input, pred, prob, topAlt }) => (
              <div key={step} style={{ padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
                <T color={C.orange} bold size={16}>
                  Step {step}
                </T>
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                  {input.map((w, i) => (
                    <div key={i} style={{ padding: "3px 8px", borderRadius: 5, background: `${C.cyan}12` }}>
                      <T color={C.mid} size={13}>
                        {w}
                      </T>
                    </div>
                  ))}
                  <T color={C.dim} size={16} style={{ margin: "0 4px" }}>
                    →
                  </T>
                  <T color={C.dim} size={13}>
                    hidden layers → output layer → softmax →
                  </T>
                </div>
                {/* Probability bars */}
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <T color={C.green} bold size={14} style={{ minWidth: 50 }}>
                      "{pred}"
                    </T>
                    <div
                      style={{
                        flex: 1,
                        height: 12,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${prob}%`,
                          height: "100%",
                          background: C.green,
                          borderRadius: 4,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <T color={C.green} bold size={13} style={{ minWidth: 35 }}>
                      {prob}%
                    </T>
                  </div>
                  {topAlt.map(({ w, p }) => (
                    <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <T color={C.dim} size={13} style={{ minWidth: 50 }}>
                        "{w}"
                      </T>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{ width: `${p}%`, height: "100%", background: C.dim, borderRadius: 4, opacity: 0.4 }}
                        />
                      </div>
                      <T color={C.dim} size={12} style={{ minWidth: 35 }}>
                        {p}%
                      </T>
                    </div>
                  ))}
                </div>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                  Pick <strong style={{ color: C.green }}>"{pred}"</strong> → append it to the input for the next step
                </T>
              </div>
            ))}

            <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>
                Final result
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["The", "cat", "sat", "on", "the", "mat", "last", "week"].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: i < 4 ? `${C.cyan}12` : `${C.green}15`,
                      border: `1px solid ${i < 4 ? C.cyan : C.green}25`,
                    }}
                  >
                    <T color={i < 4 ? C.mid : C.green} bold size={14}>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                Cyan = original prompt. Green = generated by the model, one at a time.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 2: How the model picks - greedy vs sampling vs top-k ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            How does the model pick a word?
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The model outputs a probability for every word. But how do we choose one? There are three strategies:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>
                Greedy: always pick the highest probability
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { w: "the", p: 72 },
                  { w: "a", p: 15 },
                  { w: "that", p: 8 },
                  { w: "his", p: 3 },
                ].map(({ w, p }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <T color={w === "the" ? C.green : C.dim} bold={w === "the"} size={14} style={{ minWidth: 50 }}>
                      "{w}"
                    </T>
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${p}%`,
                          height: "100%",
                          background: w === "the" ? C.green : C.dim,
                          borderRadius: 4,
                          opacity: w === "the" ? 0.7 : 0.3,
                        }}
                      />
                    </div>
                    <T color={w === "the" ? C.green : C.dim} size={13} style={{ minWidth: 35 }}>
                      {p}%
                    </T>
                    {w === "the" && (
                      <T color={C.green} bold size={13}>
                        ← always this one
                      </T>
                    )}
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                Same input always gives same output. Safe and consistent, but can get repetitive - the model might loop
                the same phrase.
              </T>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}
            >
              <T color={C.purple} bold size={16}>
                Sampling: roll the dice (weighted by probability)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Imagine spinning a wheel where "the" takes up 72% of the wheel, "a" takes 15%, and so on. Wherever the
                wheel lands, that is the word we pick.
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {[
                  { w: "the", p: "72%", c: C.cyan },
                  { w: "a", p: "15%", c: C.purple },
                  { w: "that", p: "8%", c: C.orange },
                  { w: "his", p: "3%", c: C.red },
                  { w: "...", p: "2%", c: C.dim },
                ].map(({ w, p, c }) => (
                  <div
                    key={w}
                    style={{ padding: "4px 10px", borderRadius: 6, background: `${c}10`, border: `1px solid ${c}25` }}
                  >
                    <T color={c} size={13}>
                      {w}: {p}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                More creative and diverse. But sometimes picks low-probability words that make no sense.
              </T>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}
            >
              <T color={C.orange} bold size={16}>
                Top-K: sample, but only from the best K options
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Keep only the top 10 (or 40, or 100) most likely words. Throw out the rest. Then sample from those.
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { w: "the", p: "72%", keep: true },
                  { w: "a", p: "15%", keep: true },
                  { w: "that", p: "8%", keep: true },
                  { w: "photosynthesis", p: "0.001%", keep: false },
                ].map(({ w, p, keep }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, opacity: keep ? 1 : 0.4 }}>
                    <T color={keep ? C.orange : C.dim} size={14} style={{ minWidth: 120 }}>
                      "{w}"
                    </T>
                    <T color={keep ? C.orange : C.dim} size={13}>
                      {p}
                    </T>
                    <T color={keep ? C.green : C.red} size={13}>
                      {keep ? "kept" : "removed"}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                The sweet spot: creative enough to surprise you, but never picks something completely absurd.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 3: Temperature - the creativity dial ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Temperature: the creativity dial
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            Before softmax, we divide each logit by a number called <strong>temperature</strong>. This controls how
            "spread out" the probabilities are.
          </T>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              Same logits, different temperatures
            </T>
            <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
              Raw logits: "the"=4.2, "a"=2.8, "that"=1.5
            </T>
          </div>

          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                temp: "0.2 (cold)",
                label: "Nearly greedy",
                probs: [
                  { w: "the", p: 99 },
                  { w: "a", p: 1 },
                  { w: "that", p: 0 },
                ],
                color: C.blue,
                desc: "Dividing by 0.2 makes logits huge (21, 14, 7.5). Softmax crushes everything onto the winner.",
              },
              {
                temp: "1.0 (default)",
                label: "Balanced",
                probs: [
                  { w: "the", p: 72 },
                  { w: "a", p: 18 },
                  { w: "that", p: 10 },
                ],
                color: C.green,
                desc: "Logits stay the same. Probabilities reflect the model's true confidence.",
              },
              {
                temp: "2.0 (hot)",
                label: "Creative",
                probs: [
                  { w: "the", p: 45 },
                  { w: "a", p: 30 },
                  { w: "that", p: 25 },
                ],
                color: C.red,
                desc: "Dividing by 2.0 makes logits small (2.1, 1.4, 0.75). Softmax spreads probability more evenly.",
              },
            ].map(({ temp, label: _label, probs, color, desc }) => (
              <div
                key={temp}
                style={{ padding: 12, borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}
              >
                <T color={color} bold size={16}>
                  Temperature = {temp}
                </T>
                <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                  {desc}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {probs.map(({ w, p }) => (
                    <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <T color={color} size={14} style={{ minWidth: 50 }}>
                        "{w}"
                      </T>
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{ width: `${p}%`, height: "100%", background: color, borderRadius: 4, opacity: 0.6 }}
                        />
                      </div>
                      <T color={color} bold size={13} style={{ minWidth: 30 }}>
                        {p}%
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              The formula
            </T>
            <T color={C.bright} size={16} center style={{ marginTop: 6, fontFamily: "monospace" }}>
              softmax( logit / temperature )
            </T>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              Low temperature → winner takes all. High temperature → more even distribution. Temperature = 0 can't go
              into the formula (division by zero!), so in practice T=0 means argmax - just pick the highest logit, skip
              softmax entirely. Most APIs use T=0.2 as the lowest practical value.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ── Sub 4: Why it works + when it stops ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Why does this work? And when does it stop?
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Predicting one word at a time sounds fragile. But it works because of two key facts:
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
              <T color={C.cyan} bold size={16}>
                Full context at every step
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                At step 4, the model does not just see "last". It sees ALL previous words: "The cat sat on the mat
                last". Every generated word gets the benefit of the entire history. The hidden layers process all of
                these words together, so the model never "forgets" what came before.
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["The", "cat", "sat", "on", "the", "mat", "last"].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 5,
                      background: `${C.cyan}12`,
                      border: `1px solid ${C.cyan}20`,
                    }}
                  >
                    <T color={C.cyan} size={13}>
                      {w}
                    </T>
                  </div>
                ))}
                <T color={C.yellow} bold size={14} style={{ alignSelf: "center" }}>
                  → all visible at step 4
                </T>
              </div>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}
            >
              <T color={C.purple} bold size={16}>
                Training matches generation
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                The model was trained on exactly this task: given the words so far, predict the next one. So generation
                is not some new challenge - it is the exact thing the model practiced trillions of times during
                training.
              </T>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}
            >
              <T color={C.orange} bold size={16}>
                Self-correction is built in
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Even if the model picks a slightly unexpected word at step 2, it adjusts at step 3. The full context
                includes the "mistake", and the model learned during training how to continue coherently from any
                plausible word. Errors rarely compound.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold size={16}>
              When does it stop?
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              The vocabulary includes a special stop token (like {"<END>"} or {"<|endoftext|>"}). When the model assigns
              the highest probability to this token, generation stops. It is a learned behavior - the model saw
              thousands of sentences ending during training and learned to predict the stop token at natural endpoints.
            </T>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.mid} size={14}>
                Step 5 input: "The cat sat on the mat last week"
              </T>
              <T color={C.mid} size={14} style={{ marginTop: 2 }}>
                Model predicts: {"<END>"} with 85% confidence →{" "}
                <strong style={{ color: C.green }}>generation complete</strong>
              </T>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              In practice, there is also a <strong>max length limit</strong> (like 4096 tokens). If the model has not
              produced a stop token by then, generation is cut off.
            </T>
          </div>
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
