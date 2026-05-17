import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function WhatTransformerDoes(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={21}>
            What is a Transformer actually doing?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            You give it a sentence: <strong>"I love cats"</strong>
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            It needs to understand what each word means <strong>in context</strong>. The word "love" alone could mean
            many things - romantic love, love of food, a tennis score. But in "I love cats" it specifically means
            personal affection for cats.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The Transformer figures this out through a pipeline of steps:
          </T>
          <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { w: "I", c: C.red },
              { w: "love", c: C.purple },
              { w: "cats", c: C.cyan },
            ].map(({ w, c }) => (
              <div
                key={w}
                style={{ padding: "6px 14px", borderRadius: 8, background: `${c}12`, border: `1px solid ${c}25` }}
              >
                <T color={c} bold size={18}>
                  {w}
                </T>
              </div>
            ))}
            <T color={C.dim} size={22} style={{ display: "flex", alignItems: "center" }}>
              {"→"}
            </T>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: `${C.green}12`,
                border: `1px solid ${C.green}25`,
              }}
            >
              <T color={C.green} bold size={16}>
                Contextual Understanding
              </T>
            </div>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Step 1: Each word becomes a vector (embedding)
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The model's embedding table maps each token to a vector of numbers. These numbers capture meaning{" "}
            <strong>in isolation</strong> - "love" doesn't know about "I" or "cats" yet.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { w: "I", c: C.red, v: [0.2, -0.5, 0.8, 0.1] },
              { w: "love", c: C.purple, v: [0.9, 0.1, -0.3, 0.6] },
              { w: "cats", c: C.cyan, v: [0.4, 0.7, 0.2, -0.4] },
            ].map(({ w, c, v }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <div
                  style={{
                    minWidth: 50,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: `${c}12`,
                    border: `1px solid ${c}25`,
                  }}
                >
                  <T color={c} bold size={17} center>
                    {w}
                  </T>
                </div>
                <T color={C.dim} size={18}>
                  {"→"}
                </T>
                <code style={{ color: `${c}cc`, fontSize: 15 }}>[{v.join(", ")}, ...]</code>
                <T color={C.dim} size={13} style={{ marginLeft: "auto" }}>
                  512 dims
                </T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 8 }}>
            Similar words get similar vectors. "cat" and "dog" are nearby in this 512-dimensional space. But "love" here
            is generic - it could be any kind of love.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            Step 2: Add position information
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Without position, "I love cats" and "cats love I" look identical to the model - same words, same embeddings.
            Order matters!
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Positional encoding adds WHERE each word sits in the sentence:
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.dim} size={15} center>
              Example for "love" at position 1:
            </T>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${C.purple}12`,
                  border: `1px solid ${C.purple}25`,
                }}
              >
                <T color={C.purple} size={14} bold>
                  embedding
                </T>
                <T color={C.dim} size={13} center>
                  [0.9, 0.1, -0.3, ...]
                </T>
              </div>
              <T color={C.bright} size={20} bold>
                +
              </T>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${C.yellow}12`,
                  border: `1px solid ${C.yellow}25`,
                }}
              >
                <T color={C.yellow} size={14} bold>
                  position
                </T>
                <T color={C.dim} size={13} center>
                  [0.84, 0.54, 0.00, ...]
                </T>
              </div>
              <T color={C.bright} size={20} bold>
                =
              </T>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}25`,
                }}
              >
                <T color={C.green} size={14} bold>
                  positioned
                </T>
                <T color={C.dim} size={13} center>
                  [1.74, 0.64, -0.30, ...]
                </T>
              </div>
            </div>
          </div>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Result: each word now knows WHAT it means AND WHERE it sits. "love" at position 1 is different from "love"
            at position 5.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            Step 3: Self-attention - words look at each other
          </T>
          <T color="#a5d6a7" style={{ marginTop: 6 }}>
            This is the magic step. Each word sends a Query ("what am I looking for?"), every word offers a Key ("here
            is what I can offer"), and the model computes attention scores - how relevant is each word to every other?
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.bright} bold center size={16}>
              Attention scores for "I love cats"
            </T>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
                <div />
                {["I", "love", "cats"].map((w) => (
                  <T key={w} color={C.bright} bold center size={14}>
                    {w}
                  </T>
                ))}
              </div>
              {[
                { w: "I", scores: [0.6, 0.25, 0.15], colors: [C.red, C.dim, C.dim] },
                { w: "love", scores: [0.15, 0.3, 0.55], colors: [C.dim, C.dim, C.cyan] },
                { w: "cats", scores: [0.1, 0.55, 0.35], colors: [C.dim, C.purple, C.dim] },
              ].map(({ w, scores, colors }) => (
                <div
                  key={w}
                  style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr", gap: 4, marginBottom: 3 }}
                >
                  <T color={C.bright} bold size={14}>
                    {w}
                  </T>
                  {scores.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px 0",
                        borderRadius: 4,
                        background: `${colors[i]}${Math.round(s * 40)
                          .toString(16)
                          .padStart(2, "0")}`,
                      }}
                    >
                      <T color={s > 0.4 ? colors[i] : C.dim} center bold size={14}>
                        {s.toFixed(2)}
                      </T>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              "love" attends strongly to "cats" (0.55) - loves WHAT? And "cats" attends to "love" (0.55) - cats in what
              context?
            </T>
          </div>
          <T color="#a5d6a7" style={{ marginTop: 8 }}>
            After the weighted sum of Values: "love" is no longer generic. It now means "I-have-affection-for-cats" -
            encoded as a completely new vector shaped by its context.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Step 4: Add & Norm + FFN
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Two important things happen after attention:
          </T>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 6,
              alignItems: "stretch",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "Attention Output", c: C.green, desc: "Context-aware vectors" },
              { label: "+", c: C.bright, desc: "" },
              { label: "Original (residual)", c: C.purple, desc: "Pre-attention vectors" },
              { label: "→", c: C.bright, desc: "" },
              { label: "Add & Norm", c: C.orange, desc: "Stabilize values" },
              { label: "→", c: C.bright, desc: "" },
              { label: "FFN", c: C.blue, desc: "Two linear + GELU" },
              { label: "→", c: C.bright, desc: "" },
              { label: "Add & Norm", c: C.orange, desc: "Stabilize again" },
            ].map(({ label, c, desc }, i) =>
              desc ? (
                <div
                  key={i}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: `${c}06`,
                    border: `1px solid ${c}12`,
                    minWidth: 80,
                  }}
                >
                  <T color={c} bold center size={14}>
                    {label}
                  </T>
                  <T color={C.dim} center size={12}>
                    {desc}
                  </T>
                </div>
              ) : (
                <T key={i} color={c} bold size={20} style={{ display: "flex", alignItems: "center" }}>
                  {label}
                </T>
              ),
            )}
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold size={15}>
                Residual connection
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                Adds the ORIGINAL vector (before attention) back to the output. This prevents information loss and helps
                gradients flow during training. Without it, deep networks cannot learn.
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
              }}
            >
              <T color={C.blue} bold size={15}>
                FFN (Feed-Forward Network)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                Two linear layers with GELU activation. Processes each word INDEPENDENTLY. Attention mixed words
                together - the FFN thinks about each word alone, creating richer features.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            Step 5: Repeat N times
          </T>
          <T color="#90caf9" style={{ marginTop: 6 }}>
            One attention + FFN block is ONE transformer layer. Real models repeat this block many times. Each layer
            refines understanding further.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Layer 1-2", desc: "Basic syntax, word boundaries", c: C.red, pct: 15 },
              { label: "Layer 3-6", desc: "Grammar, subject-verb agreement", c: C.orange, pct: 35 },
              { label: "Layer 7-10", desc: "Semantic meaning, analogies", c: C.yellow, pct: 65 },
              { label: "Layer 11-12", desc: "Complex reasoning, long-range dependencies", c: C.green, pct: 95 },
            ].map(({ label, desc, c, pct }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ minWidth: 80 }}>
                  <Tag color={c}>{label}</Tag>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: `${c}40` }} />
                </div>
                <T color={C.dim} size={13} style={{ minWidth: 200 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
            }}
          >
            <T color={C.dim} size={15}>
              <strong style={{ color: C.bright }}>GPT-2:</strong> 12 layers.{" "}
              <strong style={{ color: C.bright }}>GPT-3:</strong> 96 layers.{" "}
              <strong style={{ color: C.bright }}>LLaMA 3 70B:</strong> 80 layers.
            </T>
            <T color="#90caf9" size={15} style={{ marginTop: 4 }}>
              After all layers: "love" has been refined from "generic positive emotion" to "specific first-person
              affection directed at small furry animals in this particular sentence."
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Step 6: Predict the next token
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            After all layers, each position holds a rich context-aware vector (512 numbers). The model takes the LAST
            position's vector and projects it through a Linear layer.
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.dim} size={15} center>
              <strong style={{ color: C.red }}>Linear:</strong> 512 dims {"→"} 50,257 (one score per word in
              vocabulary)
            </T>
            <T color={C.dim} size={15} center style={{ marginTop: 4 }}>
              <strong style={{ color: C.red }}>Softmax:</strong> converts raw scores into probabilities that sum to 1
            </T>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }} bold>
            Top predictions after "I love cats":
          </T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { word: "very", prob: 35, c: C.green },
              { word: "so", prob: 22, c: C.cyan },
              { word: "a", prob: 12, c: C.yellow },
              { word: "the", prob: 8, c: C.orange },
              { word: "really", prob: 5, c: C.purple },
            ].map(({ word, prob, c }) => (
              <div key={word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={c} bold size={16} style={{ minWidth: 55 }}>
                  {word}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 18,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: `${prob}%`, height: "100%", borderRadius: 4, background: `${c}60` }} />
                </div>
                <T color={C.dim} size={14} style={{ minWidth: 35 }}>
                  {prob}%
                </T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>
            The highest probability word becomes the prediction. The model picks "very" - "I love cats very..." and then
            repeats the whole process for the next token.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 7}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The complete pipeline
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Here is every step connected end to end:
          </T>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[
              { label: '"I love cats"', c: C.bright },
              { label: "Tokenize", c: C.purple },
              { label: "Embed", c: C.cyan },
              { label: "+Position", c: C.yellow },
              { label: "Self-Attention", c: C.green },
              { label: "Add & Norm", c: C.orange },
              { label: "FFN", c: C.blue },
              { label: "Add & Norm", c: C.orange },
              { label: "×N layers", c: C.blue },
              { label: "Linear", c: C.red },
              { label: "Softmax", c: C.red },
              { label: '"very" (35%)', c: C.green },
            ].map(({ label, c }, i, arr) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: `${c}12`,
                    border: `1px solid ${c}25`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <T color={c} bold size={14}>
                    {label}
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
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color="#b8a9ff" bold size={16}>
              The key insight
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 4 }}>
              The word "love" entered as a generic 512-number vector and exited as a completely different 512-number
              vector that encodes "first-person affection directed at cats in a casual sentence."
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              This is what "understanding context" means - every word's vector is reshaped by all the other words around
              it. That reshaping is the pipeline you just saw.
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
