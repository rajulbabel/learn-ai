import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function RNN(ctx) {
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
}
