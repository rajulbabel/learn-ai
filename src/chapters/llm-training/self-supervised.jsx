import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function SelfSupervised(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Self-Supervised Learning: the trick behind GPT
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            GPT learns from raw text with NO labels. It doesn't need humans to annotate. Instead, it creates its own
            training signal by predicting the next token.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            <strong>One simple rule:</strong> given all the words so far, predict what comes next.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Example: "The cat sat on the mat"
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            One sentence becomes FIVE training examples. Each one says: "given these words, the next word is..."
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { input: "The", target: "cat", target_id: "3797", loss_high: true },
              { input: "The cat", target: "sat", target_id: "2906", loss_high: true },
              { input: "The cat sat", target: "on", target_id: "319", loss_high: false },
              { input: "The cat sat on", target: "the", target_id: "262", loss_high: false },
              { input: "The cat sat on the", target: "mat", target_id: "4416", loss_high: false },
            ].map(({ input, target, target_id, loss_high }, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${loss_high ? C.red : C.green}06`,
                  border: `1px solid ${loss_high ? C.red : C.green}12`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <T color={C.dim} size={14} bold style={{ minWidth: 120 }}>
                    INPUT:
                  </T>
                  <T color={C.mid} size={14} style={{ fontStyle: "italic" }}>
                    "{input}"
                  </T>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={C.dim} size={14} bold style={{ minWidth: 120 }}>
                    PREDICT:
                  </T>
                  <T color={loss_high ? C.red : C.green} size={16} bold>
                    {target}
                  </T>
                  <T color={C.dim} size={12}>
                    [{target_id}]
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            From a tiny 8-word sentence, we get 5 (input, target) pairs. From 1 billion words, we get 1 billion training
            examples. For FREE.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Inside the model: raw prediction
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            When we give the model "The cat sat on", it outputs probabilities for the next token. Let's say its
            distribution is:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { word: "the", prob: 0.35, actual: true },
              { word: "cat", prob: 0.15, actual: false },
              { word: "mat", prob: 0.12, actual: false },
              { word: "on", prob: 0.1, actual: false },
              { word: "(all others)", prob: 0.28, actual: false },
            ].map(({ word, prob, actual }) => (
              <div
                key={word}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: actual ? `${C.green}12` : "rgba(255,255,255,0.02)",
                }}
              >
                <span style={{ color: C.dim, fontSize: 14, minWidth: 100 }}>{word}</span>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${prob * 100}%`,
                      height: "100%",
                      background: actual ? C.green : C.mid,
                      borderRadius: 6,
                    }}
                  />
                </div>
                <T color={C.mid} bold size={14} style={{ minWidth: 40, textAlign: "right" }}>
                  {(prob * 100).toFixed(0)}%
                </T>
                {actual && <span style={{ fontSize: 20, color: C.green }}>✓</span>}
              </div>
            ))}
          </div>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The model predicted "the" with 35% confidence. The correct answer is "the". Good! But not perfect - 35% is
            not 100%.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Loss: how wrong was the prediction?
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            We use <strong>cross-entropy loss</strong> to measure the gap. For this example:
          </T>
          <div style={{ marginTop: 12, padding: "12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} size={16} center>
              <strong>Loss = -log(0.35) = 1.05</strong>
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6, textAlign: "center" }}>
              Higher probability → lower loss. If we predicted 1.0 (100%), loss = 0. If 0.1 (10%), loss ≈ 2.3.
            </T>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { pred: 1.0, loss: 0.0, meaning: "Perfect prediction" },
              { pred: 0.5, loss: 0.69, meaning: "So-so prediction" },
              { pred: 0.35, loss: 1.05, meaning: "Our example" },
              { pred: 0.1, loss: 2.3, meaning: "Bad prediction" },
            ].map(({ pred, loss, meaning }) => (
              <div
                key={pred}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <T color={C.yellow} bold size={15} style={{ minWidth: 50 }}>
                  P={pred.toFixed(2)}
                </T>
                <T color={C.dim} size={15}>
                  Loss={loss.toFixed(2)}
                </T>
                <T color={C.mid} size={14} style={{ fontStyle: "italic" }}>
                  {meaning}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Why self-supervised works
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            The model learns to predict next words by trial and error on BILLIONS of examples. Through this alone, it
            learns:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                icon: "📖",
                what: "Grammar",
                why: "Predicting next word requires understanding subject-verb agreement, tenses",
              },
              {
                icon: "🧠",
                what: "Facts",
                why: "To predict 'The capital of India is ___', it must memorize that Delhi is the answer",
              },
              {
                icon: "🎯",
                what: "Reasoning",
                why: "To predict output of a math problem, it must perform the computation internally",
              },
              {
                icon: "💬",
                what: "Style transfer",
                why: "After SFT, the model uses this learned knowledge to follow human instructions",
              },
            ].map(({ icon, what, why }) => (
              <div
                key={what}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <T color={C.green} bold size={16}>
                      {what}
                    </T>
                    <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                      {why}
                    </T>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            During training: gradient descent
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            After each batch of examples, the model computes loss, then uses backprop to adjust weights to reduce future
            loss.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace" }}>
            <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={15}>
                <strong>Iteration 1:</strong> avg loss on batch = 4.2 → adjust weights
              </T>
            </div>
            <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={15}>
                <strong>Iteration 2:</strong> avg loss on batch = 3.8 → adjust weights
              </T>
            </div>
            <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={15}>
                <strong>Iteration 3:</strong> avg loss on batch = 3.1 → adjust weights
              </T>
            </div>
            <div
              style={{ padding: "10px", borderRadius: 6, background: `${C.green}06`, border: `1px solid ${C.green}12` }}
            >
              <T color={C.bright} size={15}>
                <strong>...</strong>
              </T>
            </div>
            <div style={{ padding: "10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} size={15}>
                <strong>After 1 trillion tokens:</strong> avg loss on batch = 0.8
              </T>
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The model gets better at predicting. This is "pretraining" - GPT-3 trained for 300+ billion tokens.
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
}
