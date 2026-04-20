import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

// ═══════ 4.1 CNN ═══════

export const CNN = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Convolutional Neural Networks (CNN)
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Built for images. A small rectangular "filter" (like a magnifying glass) slides across the entire image,
            spotting patterns at each position.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The key insight: <strong>local patterns matter.</strong> A corner of a cat's ear is detected the same way
            everywhere in the image.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            How a convolution works: step by step
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Let's convolve a 5×5 image with a 3×3 filter. The filter slides left-to-right, top-to-bottom, and at each
            position we multiply and sum.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            {/* Image and filter side by side, centered */}
            <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <T color={C.cyan} bold center size={15} style={{ marginBottom: 8 }}>
                  5×5 Image (pixel values)
                </T>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 40px)", gap: 3 }}>
                  {[
                    [1, 0, 2, 1, 0],
                    [0, 2, 1, 0, 1],
                    [1, 0, 2, 0, 1],
                    [0, 1, 0, 2, 0],
                    [1, 1, 0, 0, 2],
                  ].map((row, r) =>
                    row.map((v, c) => (
                      <div
                        key={`${r}${c}`}
                        style={{
                          width: 40,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                          background: `${C.cyan}${v > 0 ? "20" : "08"}`,
                          border: `1px solid ${C.cyan}25`,
                          fontSize: 15,
                          color: C.cyan,
                          fontWeight: 700,
                        }}
                      >
                        {v}
                      </div>
                    )),
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <T color={C.purple} bold center size={15} style={{ marginBottom: 8 }}>
                  3×3 Filter
                </T>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 52px)", gap: 3 }}>
                  {[
                    [0.1, -0.2, 0.3],
                    [-0.1, 0.5, -0.2],
                    [0.2, -0.3, 0.1],
                  ].map((row, r) =>
                    row.map((v, c) => (
                      <div
                        key={`f${r}${c}`}
                        style={{
                          width: 52,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                          background: `${C.purple}15`,
                          border: `1px solid ${C.purple}30`,
                          fontSize: 14,
                          color: C.purple,
                          fontWeight: 700,
                        }}
                      >
                        {v.toFixed(1)}
                      </div>
                    )),
                  )}
                </div>
              </div>
            </div>

            {/* Convolution computation at position (0,0) */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
                width: "100%",
              }}
            >
              <T color={C.orange} bold center size={16}>
                Convolution at position (0,0) - top-left corner
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                Multiply filter by the 3×3 corner, then sum:
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6, fontFamily: "monospace" }}>
                (1×0.1) + (0×-0.2) + (2×0.3) + (0×-0.1) + (2×0.5) + (1×-0.2) + (1×0.2) + (0×-0.3) + (2×0.1)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                = 0.1 + 0 + 0.6 + 0 + 1.0 - 0.2 + 0.2 + 0 + 0.2 = <strong style={{ color: C.orange }}>1.9</strong>
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 8 }}>
                This single number (1.9) becomes the top-left pixel of the output "feature map".
              </T>
            </div>

            {/* All 9 positions */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
                width: "100%",
              }}
            >
              <T color={C.green} bold center size={16}>
                Filter slides to all 9 positions (5×5 - 3×3 + 1 = 3×3 output)
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 52px)",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {[
                  [1.9, -0.4, 0.2],
                  [-0.9, 1.4, -0.6],
                  [1.1, -0.7, 1.7],
                ].map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`o${r}${c}`}
                      style={{
                        width: 52,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        background: `${C.green}20`,
                        border: `1px solid ${C.green}35`,
                        fontSize: 15,
                        color: C.green,
                        fontWeight: 700,
                      }}
                    >
                      {v.toFixed(1)}
                    </div>
                  )),
                )}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 8 }}>
                This 3×3 grid is the output "feature map". High values = strong pattern detected.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            What does the filter detect?
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Different filters learn to detect different features:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { f: "Filter 1", detect: "Vertical edges (left-dark, right-bright)", nums: "[-1, 0, 1]" },
              { f: "Filter 2", detect: "Horizontal edges (top-dark, bottom-bright)", nums: "[−1, 0, 1]ᵀ" },
              { f: "Filter 3", detect: "Corners and corners", nums: "small staggered grid" },
              { f: "Filter 4+", detect: "Textures, shapes, then full objects", nums: "learned by training" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}15`,
                }}
              >
                <T color={C.yellow} bold size={14}>
                  {item.f}:
                </T>
                <T color={C.dim} size={13}>
                  {item.detect}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 10 }}>
            <strong>The stack:</strong> Layer 1 finds edges → Layer 2 combines edges into shapes → Layer 3 combines
            shapes into parts (eyes, nose) → Layer 4 combines parts into objects (cat face).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Pooling: shrinking the feature map
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            After convolution, CNNs usually "pool" - taking the max or average over small regions to:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Reduce computation (shrink image by 2x or 4x)",
              "Keep the strongest signals (max pooling)",
              "Make the network robust to small shifts (if pattern moves 1 pixel, we still detect it)",
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

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            ❌ CNN Fatal Flaw: Local window
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            CNN filters are small (3×3, 5×5, at most 7×7). They only look at <strong>nearby pixels</strong>. This is
            perfect for images but <strong>breaks for language</strong>.
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.red}15`,
            }}
          >
            <T color={C.dim} size={13}>
              Example sentence:
            </T>
            <T color="#ff8a80" bold size={14} style={{ marginTop: 4 }}>
              "The cat <em style={{ fontStyle: "italic", color: "#ffcdd2" }}>that I saw yesterday in the park</em> was
              sleeping."
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 6 }}>
              "cat" and "was" are grammatically linked (cat is sleeping), but they're 9 words apart. A 3×3 filter on
              tokens cannot see from word 1 to word 10. A 5×5 filter struggles too.
            </T>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            You'd need a huge filter (17×1 to see all 17 words at once), and even then, the filter would need to learn{" "}
            <strong>every possible relative position</strong> of "subject" and "verb" separately. That's wasteful.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            <strong>Conclusion:</strong> CNNs work great for images. They don't work for language.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            What we need for language:
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            A network where every word can directly look at every other word, no matter how far apart. And it should
            work the same way whether words are 1 position or 100 positions apart.
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
};

// ═══════ 4.2 RNN ═══════

export const RNN = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Recurrent Neural Networks (RNN)
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Built for sequences. Processes words one at a time, left-to-right. At each step, it maintains a hidden state
            (memory) that carries information forward.
          </T>
          <div
            style={{
              margin: "14px 0",
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold size={24} center>
              h<sub style={{ fontSize: 14 }}>t</sub> = tanh( W<sub style={{ fontSize: 14 }}>h</sub> · h
              <sub style={{ fontSize: 14 }}>t-1</sub> + W<sub style={{ fontSize: 14 }}>x</sub> · x
              <sub style={{ fontSize: 14 }}>t</sub> + b )
            </T>
          </div>
          <T color={C.dim} size={14} style={{ textAlign: "center" }}>
            New hidden state = function of (previous hidden state + current word embedding)
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Tracing "The cat sat" - one word at a time
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Let's process with hidden state dimension = 3 (real models: 256, 512, 1024+)
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                t: 1,
                word: "The",
                x: "[0.2, 0.1, -0.4]",
                h_prev: "[0, 0, 0]",
                h_new: "[0.3, -0.1, 0.2]",
                calc: "h_1 = tanh(W_h·[0,0,0] + W_x·[0.2,0.1,-0.4] + b)",
              },
              {
                t: 2,
                word: "cat",
                x: "[-0.1, 0.5, 0.3]",
                h_prev: "[0.3, -0.1, 0.2]",
                h_new: "[0.1, 0.4, -0.3]",
                calc: "h_2 = tanh(W_h·[0.3,-0.1,0.2] + W_x·[-0.1,0.5,0.3] + b)",
              },
              {
                t: 3,
                word: "sat",
                x: "[0.4, -0.2, 0.1]",
                h_prev: "[0.1, 0.4, -0.3]",
                h_new: "[0.5, 0.2, 0.0]",
                calc: "h_3 = tanh(W_h·[0.1,0.4,-0.3] + W_x·[0.4,-0.2,0.1] + b)",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}15`,
                }}
              >
                <T color={C.yellow} bold size={15}>
                  Step {item.t}: "{item.word}"
                </T>
                <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                  <div>
                    <T color={C.dim} size={12}>
                      Word embedding x_t:
                    </T>
                    <T color={C.cyan} bold style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {item.x}
                    </T>
                  </div>
                  <div>
                    <T color={C.dim} size={12}>
                      {"Prev hidden h_{t-1}:"}
                    </T>
                    <T color={C.orange} bold style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {item.h_prev}
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  {item.calc}
                </T>
                <div
                  style={{
                    marginTop: 6,
                    padding: "6px 8px",
                    borderRadius: 4,
                    background: `${C.green}10`,
                    border: `1px solid ${C.green}20`,
                  }}
                >
                  <T color={C.green} bold style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {"→ h_"}
                    {item.t}
                    {" = "}
                    {item.h_new}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <T color="#80deea" style={{ marginTop: 10 }}>
            Notice: the hidden state changes as we process each word. By step 3, it has incorporated meaning from all
            three words. Information flows forward in time.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Processing order matters: "Dog bites man" vs "Man bites dog"
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            The same three word embeddings, but in different order, produce different hidden states. The network learns
            which word is the subject (first) and which is the object (last).
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { words: ["Dog", "bites", "man"], h3: "[0.8, 0.1, -0.2]", meaning: "dog is actor" },
              { words: ["Man", "bites", "dog"], h3: "[-0.2, 0.7, 0.1]", meaning: "man is actor" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}15`,
                }}
              >
                <T color={C.purple} bold center size={14}>
                  {item.words.join(" ")}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  Final hidden state:
                </T>
                <T color={C.purple} bold style={{ fontFamily: "monospace", fontSize: 13, marginTop: 2 }}>
                  {item.h3}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  Semantically: {item.meaning}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            ✓ RNN understands order!
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            This solves the CNN problem. Now every word can indirectly influence every other word through the hidden
            state.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            "The cat <em>that I saw yesterday</em> was sleeping." - as we read from left to right, "cat" shapes the
            hidden state, which then processes all the intermediate words, and influences the final prediction that it
            "was sleeping".
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The RNN algorithm: strict sequential processing
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Process word 1 → get h_1 → process word 2 (using h_1) → get h_2 → process word 3 (using h_2) → ...
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            <strong>Cannot parallelize.</strong> Word 2's computation depends on word 1's output. Word 3 depends on word
            2. No amount of GPU cores helps.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 8 }}>
            On a GPU with 1000 cores: only 1 core is actually computing at a time. The other 999 sit idle. This is a
            massive waste.
          </T>
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
};

// ═══════ 4.3 RNNFlaws ═══════

export const RNNFlaws = (ctx) => {
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
};

// ═══════ 4.4 TransformerArrives ═══════

export const TransformerArrives = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            2017: "Attention Is All You Need"
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The Transformer paper introduced a completely different architecture: drop RNN, drop CNN, use only
            attention.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Core insight: every word should be able to directly attend to (look at) every other word, simultaneously, in
            parallel.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Side-by-side: RNN vs Transformer
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Processing "I love cats":
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}15`,
              }}
            >
              <T color={C.red} bold center size={16}>
                RNN
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {["I", "love", "cats"].map((w, i) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <T color={C.dim} size={12} style={{ minWidth: 24 }}>
                      Step {i + 1}:
                    </T>
                    <div
                      style={{
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: `${C.red}15`,
                        fontSize: 12,
                        color: C.red,
                        fontWeight: 600,
                      }}
                    >
                      {i === 0 ? "Processing" : "⏳"}
                    </div>
                    <T color={C.dim} size={12}>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={12} style={{ marginTop: 8, textAlign: "center" }}>
                Sequential
              </T>
              <T color={C.dim} size={12} style={{ textAlign: "center" }}>
                1 GPU core active
              </T>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Transformer
              </T>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {["I", "love", "cats"].map((w) => (
                  <div
                    key={w}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: `${C.green}15`,
                      fontSize: 12,
                      color: C.green,
                      fontWeight: 600,
                    }}
                  >
                    {w}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {["I", "love", "cats"].map((from) => (
                  <div key={from} style={{ position: "relative", width: 24, height: 24 }}>
                    {["I", "love", "cats"].map((to, i) => {
                      const opacity = from === to ? 0.5 : from === "love" && to !== "love" ? 0.6 : 0.2;
                      return (
                        <div
                          key={`${from}-${to}`}
                          style={{
                            position: "absolute",
                            top: i * 8,
                            left: 12,
                            width: 2,
                            height: 2,
                            background: C.green,
                            borderRadius: "50%",
                            opacity,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <T color={C.dim} size={11} style={{ marginTop: 6, textAlign: "center" }}>
                All attend to all
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 2, textAlign: "center" }}>
                (arrows show attention)
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 2, textAlign: "center" }}>
                All GPU cores active
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            How attention works: the core idea
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Each word (Query) compares itself to every word (Keys) and asks "how relevant are you?" The answers
            (attention scores) weight the values (word meanings) to produce a context-aware representation.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "love", k1: "I", score: 0.1, why: "less relevant" },
              { q: "love", k2: "love", score: 0.8, why: "self - very relevant" },
              { q: "love", k3: "cats", score: 0.5, why: "object - moderately relevant" },
            ].map((item) => (
              <div
                key={`${item.q}-${item.k1}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 60px 60px 80px 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 8px",
                  borderRadius: 4,
                  background: `${C.purple}08`,
                  border: `1px solid ${C.purple}12`,
                }}
              >
                <T color={C.blue} bold size={12}>
                  Q:{item.q}
                </T>
                <T color={C.orange} bold size={12}>
                  K:{item.k2}
                </T>
                <T color={C.yellow} bold size={12}>
                  Score:
                </T>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{ width: `${item.score * 100}%`, height: "100%", background: C.yellow, borderRadius: 2 }}
                    />
                  </div>
                  <T color={C.yellow} bold size={12} style={{ minWidth: 24 }}>
                    {item.score.toFixed(1)}
                  </T>
                </div>
                <T color={C.dim} size={12}>
                  {item.why}
                </T>
              </div>
            ))}
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            <strong>Key difference from RNN:</strong> this happens all at once for all words and all positions. No
            sequential dependency. Full parallelization.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Speed comparison: concrete numbers
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Processing a 1000-word document with timestep 1ms per word:
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { arch: "RNN", total: "1000 ms", cores: "1 / 1000", reason: "1000 sequential steps × 1ms" },
              { arch: "Transformer", total: "1 ms", cores: "1000 / 1000", reason: "All 1000 words parallel" },
            ].map((item) => (
              <div
                key={item.arch}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${item.arch === "RNN" ? C.red : C.green}06`,
                  border: `1px solid ${item.arch === "RNN" ? C.red : C.green}15`,
                }}
              >
                <T color={item.arch === "RNN" ? C.red : C.green} bold center size={14}>
                  {item.arch}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  Total time: <strong style={{ color: item.arch === "RNN" ? C.red : C.green }}>{item.total}</strong>
                </T>
                <T color={C.dim} size={12}>
                  GPU: {item.cores} cores
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  {item.reason}
                </T>
              </div>
            ))}
          </div>

          <T color="#ffe082" style={{ marginTop: 10 }}>
            <strong>1000× faster</strong> for long sequences. This is why Transformers enable training on massive
            datasets.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            No more vanishing gradient
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            In attention, information flows directly from every word to every other word. No sequential multiplication
            of gradients. The model can learn dependencies over 500+ words without gradient degradation.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>
            This solves the RNN fundamental problem: long-distance dependencies are now as easy to learn as short ones.
          </T>
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
};

// ═══════ 4.5 EncoderDecoder ═══════

export const EncoderDecoder = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The original Transformer: 2017 "Attention Is All You Need"
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The paper that introduced Transformers was solving <strong>machine translation</strong>. It needed two
            different operations:
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.cyan}15`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.cyan}15` }}>
                <T color={C.cyan} bold size={13}>
                  "I love cats"
                </T>
                <T color={C.dim} size={11}>
                  English input
                </T>
              </div>
              <T color={C.yellow} size={20}>
                →
              </T>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.yellow}10` }}>
                <T color={C.yellow} bold size={13}>
                  Transformer
                </T>
              </div>
              <T color={C.yellow} size={20}>
                →
              </T>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.green}15` }}>
                <T color={C.green} bold size={13}>
                  "Mujhe billiyaan pasand hain"
                </T>
                <T color={C.dim} size={11}>
                  Hindi output
                </T>
              </div>
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            The key problem: English and Hindi are different languages. You must fully <strong>understand</strong> the
            English input before you can <strong>generate</strong> Hindi output. These are two separate tasks.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Solution: Two separate components
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            <strong>Encoder:</strong> reads the input, builds deep understanding → outputs compressed representation
          </T>
          <T color="#ffe082" style={{ marginTop: 4 }}>
            <strong>Decoder:</strong> reads the encoder's output, generates the translation one word at a time
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}15`,
              }}
            >
              <T color={C.blue} bold center size={16}>
                Encoder
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={12}>
                  ✓ Process input in parallel
                </T>
                <T color={C.dim} size={12}>
                  ✓ All words attend to all words
                </T>
                <T color={C.dim} size={12}>
                  ✓ Build context for each word
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: "6px 8px",
                  borderRadius: 4,
                  background: `${C.blue}12`,
                  border: `1px solid ${C.blue}25`,
                  textAlign: "center",
                }}
              >
                <T color={C.blue} bold size={12}>
                  Encoder output: rich representations of "I", "love", "cats"
                </T>
              </div>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Decoder
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={12}>
                  ✓ Read encoder output
                </T>
                <T color={C.dim} size={12}>
                  ✓ Generate translation token by token
                </T>
                <T color={C.dim} size={12}>
                  ✓ Use attention to look back at input
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: "6px 8px",
                  borderRadius: 4,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}25`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold size={12}>
                  Decoder: "Mujhe" → "billiyaan" → "pasand" → "hain"
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Cross-Attention: the bridge
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            The decoder doesn't just generate from nothing. It looks back at the encoder's output using a special
            connection called <strong>cross-attention</strong>.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: `${C.blue}12`,
                border: `1px solid ${C.blue}25`,
                width: "100%",
                maxWidth: 300,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              <T color={C.blue} bold size={13}>
                Encoder output: [rich understanding of "I", "love", "cats"]
              </T>
            </div>
            <T color={C.purple} size={12}>
              ↓ (Keys & Values)
            </T>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: `${C.purple}12`,
                border: `2px solid ${C.purple}30`,
                width: "100%",
                maxWidth: 300,
                textAlign: "center",
                marginBottom: 8,
                marginTop: 8,
              }}
            >
              <T color={C.purple} bold size={13}>
                Cross-Attention Layer
              </T>
              <T color={C.dim} size={11}>
                Decoder's Q asks encoder: "What's relevant now?"
              </T>
            </div>
            <T color={C.purple} size={12}>
              ↓
            </T>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: `${C.green}12`,
                border: `1px solid ${C.green}25`,
                width: "100%",
                maxWidth: 300,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              <T color={C.green} bold size={13}>
                Decoder generates: "Mujhe billiyaan pasand hain"
              </T>
            </div>
          </div>

          <T color="#b8a9ff" style={{ marginTop: 12 }}>
            When generating "les", the decoder's Query asks "what noun am I translating?" The encoder's Keys/Values
            answer: "you're translating the idea of 'love' and 'cats'". The decoder uses that context to choose the
            right Hindi word.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            The full encoder-decoder stack
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            The 2017 Transformer stacks both halves:
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "stretch" }}>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}15`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <T color={C.blue} bold center size={14}>
                Encoder Stack
              </T>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                6 layers
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                {["Attention", "Add & Norm", "Feed-Forward", "Add & Norm"].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px",
                      borderRadius: 4,
                      background: `${C.blue}12`,
                      border: `1px solid ${C.blue}25`,
                    }}
                  >
                    <T color={C.dim} size={11} center>
                      {s}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Wrapper is a stretched flex item; inner flex centers the arrow
                vertically between the two stacked boxes. */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
              <T color={C.purple} bold size={16}>
                →
              </T>
            </div>

            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <T color={C.green} bold center size={14}>
                Decoder Stack
              </T>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                6 layers
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                {["Masked Attention", "Add & Norm", "Cross-Attention", "Add & Norm", "Feed-Forward", "Add & Norm"].map(
                  (s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px",
                        borderRadius: 4,
                        background: `${C.green}12`,
                        border: `1px solid ${C.green}25`,
                      }}
                    >
                      <T color={C.dim} size={11} center>
                        {s}
                      </T>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <T color="#ffcc80" style={{ marginTop: 10 }}>
            (Masked Attention = can only look at past tokens; Cross-Attention = looks at encoder output)
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Why two halves? Different model types.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The encoder-decoder design is great for translation, but there are other tasks:
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { type: "Encoder-Decoder", task: "Translation (T5, BART)", input: "English", output: "Hindi" },
              {
                type: "Encoder-Only",
                task: "Classification (BERT, RoBERTa)",
                input: "Sentence",
                output: "Sentiment score",
              },
              { type: "Decoder-Only", task: "Generation (GPT, Claude)", input: "Prompt", output: "Continued text" },
            ].map((item) => (
              <div
                key={item.type}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}15`,
                }}
              >
                <T color={C.yellow} bold size={13}>
                  {item.type}
                </T>
                <T color={C.dim} size={12}>
                  {item.task}
                </T>
                <T color={C.dim} size={11}>
                  Input: {item.input} → Output: {item.output}
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
};

// ═══════ 4.6 DecoderOnly ═══════

export const DecoderOnly = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Plot twist: Modern LLMs are decoder-only
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            ChatGPT, Claude, LLaMA, Gemini - they all use <strong>only</strong> the Decoder half. They threw away the
            Encoder.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            Why throw away half the architecture? Because translation and chatting are fundamentally different.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Translation vs Chatting: different tasks
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            <strong>Translation:</strong> input (English) and output (Hindi) are different languages. You must fully
            process the input before generating output.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            <strong>Chatting:</strong> input (your prompt) and output (my response) are both English. They're part of
            one continuous conversation, not two separate things.
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}15`,
              }}
            >
              <T color={C.blue} bold center size={14}>
                Translation
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                English input (complete)
              </T>
              <T color={C.dim} size={12}>
                ↓
              </T>
              <T color={C.dim} size={12}>
                Hindi output (generated)
              </T>
              <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                Two separate "sides"
              </T>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Chatting
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                Prompt: "What is 2+2?"
              </T>
              <T color={C.dim} size={12}>
                Response: "The answer is 4."
              </T>
              <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                One continuous stream
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Causal masking: the key difference
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            In a decoder-only model, when generating token N, you can only look at tokens 0 through N-1 (the past and
            present). You cannot look at future tokens.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            This is called <strong>causal masking</strong> - causality: effect cannot precede cause.
          </T>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.purple}15`,
            }}
          >
            <T color={C.dim} size={12} style={{ marginBottom: 8 }}>
              Processing "What is 2+2?" sequentially:
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { step: 1, gen: "What", sees: "[]", can_see: "nothing" },
                { step: 2, gen: "is", sees: "[What]", can_see: "What" },
                { step: 3, gen: "2+2", sees: "[What, is]", can_see: "What, is" },
                { step: 4, gen: "?", sees: "[What, is, 2+2]", can_see: "What, is, 2+2" },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    padding: "4px 6px",
                    borderRadius: 3,
                    background: `${C.cyan}08`,
                    border: `1px solid ${C.cyan}12`,
                  }}
                >
                  <T color={C.dim} size={11} style={{ minWidth: 40 }}>
                    Step {item.step}:
                  </T>
                  <div
                    style={{
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: `${C.purple}15`,
                      fontSize: 11,
                      color: C.purple,
                      fontWeight: 600,
                      minWidth: 50,
                    }}
                  >
                    Generate
                  </div>
                  <T color={C.dim} size={11} style={{ minWidth: 30 }}>
                    {item.gen}
                  </T>
                  <T color={C.dim} size={10}>
                    by looking at
                  </T>
                  <T color={C.cyan} size={11}>
                    {item.can_see}
                  </T>
                </div>
              ))}
            </div>
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            This is the fundamental constraint of LLMs: they generate one token at a time, and each new token is based
            only on what came before.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            Why decoder-only wins
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            Decoder-only is simpler (half the architecture) but it turns out that a large decoder trained on enough data
            can:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Read and understand your prompt (implicit encoder task)",
              "Generate natural, coherent responses (explicit decoder task)",
              "Reason, code, translate, summarize (with prompting/fine-tuning)",
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
                <span style={{ color: C.blue, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                <T color={C.dim} size={13}>
                  {item}
                </T>
              </div>
            ))}
          </div>

          <T color="#5eb3ff" style={{ marginTop: 10 }}>
            <strong>The result:</strong> decoder-only models are more general-purpose than any other architecture.
            They're simpler, faster, and more scalable.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Three architectures: the complete picture
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                arch: "Encoder-Decoder",
                task: "Translation",
                models: "T5, BART, mT5",
                best_for: "When input and output are different languages or modes",
              },
              {
                arch: "Encoder-Only",
                task: "Understanding",
                models: "BERT, RoBERTa, DistilBERT",
                best_for: "Classification, sentiment, similarity - no generation",
              },
              {
                arch: "Decoder-Only",
                task: "Generation",
                models: "GPT-4, Claude, LLaMA, Gemini",
                best_for: "Chat, writing, reasoning, all modern LLMs",
              },
            ].map((item) => (
              <div
                key={item.arch}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}15`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <T color={C.yellow} bold size={14}>
                    {item.arch}
                  </T>
                  <div style={{ display: "flex", gap: 3 }}>
                    {item.arch === "Encoder-Decoder" && (
                      <>
                        <div
                          style={{
                            padding: "2px 6px",
                            borderRadius: 3,
                            background: `${C.blue}20`,
                            fontSize: 10,
                            color: C.blue,
                            fontWeight: 600,
                          }}
                        >
                          E
                        </div>
                        <div
                          style={{
                            padding: "2px 6px",
                            borderRadius: 3,
                            background: `${C.green}20`,
                            fontSize: 10,
                            color: C.green,
                            fontWeight: 600,
                          }}
                        >
                          D
                        </div>
                      </>
                    )}
                    {item.arch === "Encoder-Only" && (
                      <div
                        style={{
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: `${C.blue}20`,
                          fontSize: 10,
                          color: C.blue,
                          fontWeight: 600,
                        }}
                      >
                        E
                      </div>
                    )}
                    {item.arch === "Decoder-Only" && (
                      <div
                        style={{
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: `${C.green}20`,
                          fontSize: 10,
                          color: C.green,
                          fontWeight: 600,
                        }}
                      >
                        D
                      </div>
                    )}
                  </div>
                </div>
                <T color={C.dim} size={12}>
                  <strong>Task:</strong> {item.task}
                </T>
                <T color={C.dim} size={12}>
                  <strong>Models:</strong> {item.models}
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  Best for: {item.best_for}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            You now understand the complete evolution
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            CNN (local patterns) → RNN (sequential memory, slow) → Transformer (attention, parallel) → Decoder-only (the
            architecture of modern AI).
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            You now have the full history. The upcoming sections go deep into each piece of the Transformer: how input
            enters, how attention works, and how the complete encoder and decoder blocks are built.
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
};
