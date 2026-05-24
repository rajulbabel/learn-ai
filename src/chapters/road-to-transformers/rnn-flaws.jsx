import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function RNNFlaws(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Flaw #1: Vanishing Gradient (Information Loss)
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The hidden state is like a game of telephone. Information gets corrupted with each pass.
          </T>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.red}15`,
            }}
          >
            <T color={C.dim} size={13}>
              Example: "The cat that I saw yesterday was sleeping."
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 6 }}>
              When training, the gradient (error signal) flows backward through time. At step 7 ("was"), the gradient
              tries to adjust weights to make the model understand that "cat" is the subject. But it has to flow back
              through 6 steps of gradient multiplication.
            </T>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { word: "was", grad: 1.0, label: "Full gradient" },
              { word: "yesterday", grad: 0.8, label: "Still strong" },
              { word: "saw", grad: 0.64, label: "Getting weaker" },
              { word: "I", grad: 0.51, label: "Weak" },
              { word: "that", grad: 0.41, label: "Very weak" },
              { word: "cat", grad: 0.33, label: "Nearly vanished" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}15`,
                }}
              >
                <T color={C.dim} size={13} style={{ minWidth: 60 }}>
                  {item.word}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.grad * 100}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${C.orange}, ${C.red})`,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <T color={C.dim} size={12} style={{ minWidth: 40 }}>
                  {item.grad.toFixed(2)}
                </T>
              </div>
            ))}
          </div>

          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            <strong>Result:</strong> The weights that should learn "cat → subject" barely get updated. The model
            struggles to remember long-distance dependencies.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The math: why gradients vanish
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            In RNN backpropagation, the chain rule multiplies gradients through every time step:
          </T>
          <div
            style={{
              margin: "12px 0",
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={20} center>
              ∂L/∂W<sub style={{ fontSize: 12 }}>h</sub> = (∂L/∂h<sub style={{ fontSize: 12 }}>t</sub>) × (∂h
              <sub style={{ fontSize: 12 }}>t</sub>/∂h<sub style={{ fontSize: 12 }}>t-1</sub>) × ...
            </T>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 6 }}>
            Each ∂h<sub>t</sub>/∂h<sub>t-1</sub> term is often less than 1.0 (typical range: 0.1 to 0.9). Multiply seven
            of them together:
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.yellow}20`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={18} center style={{ fontFamily: "monospace" }}>
              0.8 × 0.8 × 0.8 × 0.8 × 0.8 × 0.8 × 0.8 = 0.21
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 6 }}>
              The gradient is now 79% lost before it reaches the early weights.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Flaw #2: It's SLOW (sequential processing)
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            A modern GPU has 1000+ cores. If you're processing a sequence one word at a time, you're using 1 core and
            leaving 999 idle.
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { name: "RNN", time: "10 seconds", cores: "1 / 1000", explain: "One word per step. Sequential." },
              { name: "Parallel", time: "0.01 seconds", cores: "1000 / 1000", explain: "All words at once." },
            ].map((item) => (
              <div
                key={item.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${item.name === "RNN" ? C.red : C.green}06`,
                  border: `1px solid ${item.name === "RNN" ? C.red : C.green}15`,
                }}
              >
                <T color={item.name === "RNN" ? C.red : C.green} bold center size={14}>
                  {item.name}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  Time: {item.time}
                </T>
                <T color={C.dim} size={12}>
                  GPU: {item.cores}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                  {item.explain}
                </T>
              </div>
            ))}
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            For a 1000-word document, RNN processes it 1000× sequentially. A parallel system could process all 1000 at
            once (with attention). That's <strong>potentially 1000× speedup</strong>.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            Partial solution: LSTM (Long Short-Term Memory)
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            LSTM added "gates" to the hidden state - forget gate, input gate, output gate. These gates let the model
            decide what to remember and what to forget.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>
            Result: vanishing gradient is reduced (not eliminated). You can now model sequences up to ~100-200 words
            reliably instead of ~10-20.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>
            <strong>But:</strong> LSTM still processes sequentially. Still slow. Still has vanishing gradient for very
            long sequences (500+ words).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            What we need: no sequence dependency
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            We need a model where:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Every word can directly look at every other word (no information loss through hidden states)",
              "All words are processed in parallel (use all GPU cores)",
              "Distance between words doesn't matter (word 1 and word 100 communicate equally well)",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  padding: "6px 10px",
                  borderRadius: 4,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <span style={{ color: C.green, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                <T color={C.dim} size={13}>
                  {item}
                </T>
              </div>
            ))}
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
