import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function SFT(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: The problem ── */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The problem: the model just predicts internet text
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            After pretraining, the model has read trillions of words from the internet. It can predict the next word
            really well. But it has no idea that it should be <strong>helpful</strong>.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            If you type "What is photosynthesis?", the model does not think "I should answer this question." It thinks:{" "}
            <strong>"what text would typically follow this on the internet?"</strong>
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <T color={C.dim} size={14} style={{ textAlign: "center", fontStyle: "italic" }}>
              You type: "What is photosynthesis?"
            </T>
            <T color={C.dim} size={14} style={{ textAlign: "center" }}>
              On the internet, this could be followed by...
            </T>
            {[
              { text: "A Wikipedia-style answer", prob: "15%", color: C.green },
              { text: 'Another question: "What about cellular respiration?"', prob: "12%", color: C.orange },
              { text: 'A Reddit comment: "just Google it lol"', prob: "10%", color: C.red },
              { text: "A spam link or ad", prob: "8%", color: C.red },
              { text: "A sarcastic reply", prob: "6%", color: C.red },
            ].map(({ text, prob, color }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} size={14} style={{ flex: 1 }}>
                  {text}
                </T>
                <T color={C.dim} size={14} bold>
                  {prob}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            The model gives probability to ALL of these because it saw all of them during pretraining. We need to change
            this.
          </T>
        </Box>
      )}

      {/* ── Sub 1: SFT training data ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            The fix: show it what a good assistant says
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Humans sit down and write ~100,000 example conversations. Each one has the exact format the model will see
            when deployed:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                q: "What is photosynthesis?",
                a: "Photosynthesis is the process where plants convert light energy into chemical energy. It happens in two stages: light-dependent reactions in the thylakoid, and the Calvin cycle in the stroma.",
                color: C.green,
              },
              {
                q: "Write a Python function to reverse a list.",
                a: "def reverse_list(lst):\n    return lst[::-1]",
                color: C.purple,
              },
            ].map(({ q, a, color }, idx) => (
              <div
                key={idx}
                style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.03)",
                    marginBottom: 6,
                  }}
                >
                  <T color={C.dim} size={13} bold>
                    User:
                  </T>
                  <T color={C.mid} size={15} style={{ marginTop: 2 }}>
                    {q}
                  </T>
                </div>
                <div style={{ padding: "8px 10px", borderRadius: 6, background: `${color}08` }}>
                  <T color={C.dim} size={13} bold>
                    Assistant:
                  </T>
                  <T
                    color={color}
                    size={15}
                    style={{
                      marginTop: 2,
                      whiteSpace: "pre-wrap",
                      fontFamily: q.includes("Python") ? "monospace" : "inherit",
                    }}
                  >
                    {a}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" style={{ marginTop: 10 }}>
            Each example says: "When a user asks this, <strong>this</strong> is what you should say." The model will now
            train on these conversations instead of random internet text.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 2: Loss only on assistant tokens ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The key trick: loss only on the assistant's words
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The model reads the full conversation and predicts the next word at every position - same as pretraining.
            But the loss is <strong>only calculated on the assistant's words</strong>. The user's question is just
            context.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { position: "User:", next: "What", loss: false },
              { position: "User: What", next: "is", loss: false },
              { position: "User: What is", next: "photosynthesis?", loss: false },
              { position: "...photosynthesis?", next: "Assistant:", loss: false },
              {
                position: "Assistant:",
                next: "Photosynthesis",
                loss: true,
                pred: "What",
                predProb: "12%",
                correctProb: "8%",
              },
              {
                position: "...Photosynthesis",
                next: "is",
                loss: true,
                pred: "is",
                predProb: "25%",
                correctProb: "25%",
              },
              {
                position: "...Photosynthesis is",
                next: "the",
                loss: true,
                pred: "a",
                predProb: "18%",
                correctProb: "15%",
              },
              { position: "...is the", next: "process", loss: true, pred: "study", predProb: "11%", correctProb: "9%" },
            ].map(({ position, next, loss, pred, predProb, correctProb }) => (
              <div
                key={position}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: loss ? "rgba(255,107,107,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${loss ? "rgba(255,107,107,0.12)" : "rgba(255,255,255,0.04)"}`,
                }}
              >
                <T color={C.dim} size={13} style={{ minWidth: 160, fontFamily: "monospace" }}>
                  {position}
                </T>
                <T color={C.mid} size={13}>
                  next: <strong style={{ color: loss ? C.green : C.dim }}>{next}</strong>
                </T>
                {loss ? (
                  <T color={C.red} size={12} bold style={{ marginLeft: "auto" }}>
                    LOSS (model guessed "{pred}" at {predProb}, correct was {correctProb})
                  </T>
                ) : (
                  <T color={C.dim} size={12} style={{ marginLeft: "auto" }}>
                    no loss - just reading
                  </T>
                )}
              </div>
            ))}
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            The model is never graded on predicting the user's question. It is{" "}
            <strong>only graded on how well it predicts the ideal assistant response</strong>. Backpropagation then
            nudges the weights to make the correct response words more likely next time.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 3: Before vs After probability shift ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Before vs After SFT: what changes in the output
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            After 100,000 training conversations, the weights have shifted. The model now strongly favors helpful
            assistant text after "Assistant:". Here is the same input, same model, different probabilities for the first
            word:
          </T>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              {
                label: "Before SFT",
                sublabel: "predicts generic internet text",
                color: C.red,
                probs: [
                  { word: "What", pct: 12 },
                  { word: "The", pct: 10 },
                  { word: "Photosynthesis", pct: 8 },
                  { word: "I", pct: 6 },
                  { word: "So", pct: 5 },
                  { word: "It", pct: 4 },
                ],
              },
              {
                label: "After SFT",
                sublabel: "predicts helpful assistant response",
                color: C.green,
                probs: [
                  { word: "Photosynthesis", pct: 35 },
                  { word: "The", pct: 8 },
                  { word: "It", pct: 5 },
                  { word: "What", pct: 2 },
                  { word: "I", pct: 2 },
                  { word: "So", pct: 1 },
                ],
              },
            ].map(({ label, sublabel, color, probs }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  minWidth: 250,
                  padding: "12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold size={16} center>
                  {label}
                </T>
                <T color={C.dim} size={12} style={{ textAlign: "center", marginBottom: 8 }}>
                  {sublabel}
                </T>
                {probs.map(({ word, pct }) => (
                  <div key={word} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <T
                      color={C.mid}
                      size={13}
                      style={{
                        width: 105,
                        flexShrink: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {word}
                    </T>
                    <div
                      style={{
                        flex: 1,
                        height: 14,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct * 2.5}%`,
                          height: "100%",
                          background: color,
                          borderRadius: 4,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <T color={C.dim} size={12} bold style={{ minWidth: 30, textAlign: "right" }}>
                      {pct}%
                    </T>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <T color="#80e8a5" style={{ marginTop: 10 }}>
            "Photosynthesis" jumped from 8% to 35% because in the SFT data, answers to "What is X?" almost always start
            with "X is..." The weights got nudged thousands of times in that direction. "What" dropped from 12% to 2%
            because good assistants don't repeat the question back.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 4: The hidden prompt template ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The hidden template: what you never see
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            When you type a message to ChatGPT or Claude, you never see the full text that goes to the model. Behind the
            scenes, your message gets wrapped in a template:
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              fontFamily: "monospace",
            }}
          >
            <T color={C.dim} size={14}>
              What you type:
            </T>
            <T color={C.bright} size={15} style={{ marginTop: 4 }}>
              "What is photosynthesis?"
            </T>
            <div style={{ margin: "12px 0", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
              <T color={C.dim} size={14}>
                What actually goes to the model:
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                <T color={C.purple} size={15}>
                  <strong>User:</strong> What is photosynthesis?
                </T>
                <T color={C.green} size={15}>
                  <strong>Assistant:</strong>
                </T>
              </div>
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            The model then starts predicting what comes after "Assistant:" one word at a time. Because SFT trained it on
            thousands of examples where helpful text followed "Assistant:", it now strongly favors producing that kind
            of text.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              fontFamily: "monospace",
            }}
          >
            <T color={C.dim} size={13}>
              Different models use different template formats. ChatGPT uses special tokens:
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
              <T color={C.orange} size={14}>
                {"<|im_start|>"}system
              </T>
              <T color={C.mid} size={14}>
                You are a helpful assistant.
              </T>
              <T color={C.orange} size={14}>
                {"<|im_end|>"}
              </T>
              <T color={C.orange} size={14}>
                {"<|im_start|>"}user
              </T>
              <T color={C.mid} size={14}>
                What is photosynthesis?
              </T>
              <T color={C.orange} size={14}>
                {"<|im_end|>"}
              </T>
              <T color={C.orange} size={14}>
                {"<|im_start|>"}assistant
              </T>
              <T color={C.green} size={14} style={{ fontStyle: "italic" }}>
                Photosynthesis is the process by which plants...
              </T>
              <T color={C.orange} size={14}>
                {"<|im_end|>"}{" "}
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontStyle: "italic" }}>
                  ← model generates this token to signal "I am done"
                </span>
              </T>
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 8 }}>
              Everything above {"<|im_start|>"}assistant is the template - sent to the model as input. The response text
              and the final {"<|im_end|>"} are generated by the model. It learns during SFT that after producing a
              complete answer, it should output {"<|im_end|>"} to stop.
            </T>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            This is also why <strong>system prompts</strong> work. The "You are a helpful assistant" text sits before
            the user's message. The model sees all of it as context and adjusts its style accordingly. Change it to "You
            are a pirate" and the model changes how it speaks.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 5: Why 100K is enough ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Why 100K examples is enough
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Pretraining needed trillions of words. SFT needs only ~100K conversations. That feels wrong. Why is so
            little data enough?
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Because SFT is not teaching new knowledge. The model already knows what photosynthesis is, already knows
            Python, already knows grammar. All of that was learned during pretraining and is stored deep in the weights.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            SFT only changes the <strong>surface behavior</strong> - the pattern of "when you see User: followed by a
            question, respond with a clear, helpful answer." That is a much simpler pattern than all of human language.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                phase: "Pretraining",
                data: "Trillions of words",
                learns: "All of language: grammar, facts, code, reasoning, style",
                change: "Builds the entire brain from scratch",
                color: C.orange,
              },
              {
                phase: "SFT",
                data: "~100K conversations",
                learns: "One pattern: question goes in, helpful answer comes out",
                change: "Nudges the surface weights slightly",
                color: C.green,
              },
            ].map(({ phase, data, learns, change, color }) => (
              <div
                key={phase}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold size={16}>
                  {phase}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  <strong>Data:</strong> {data}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  <strong>What it learns:</strong> {learns}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  <strong>What changes:</strong> {change}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 10 }}>
            SFT uses a very small learning rate (tiny nudges per step). The deep weights that store facts barely move.
            Only the surface-level behavior changes - the "style" of what follows "Assistant:". Same knowledge,
            expressed as a helpful conversation instead of random internet text.
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
