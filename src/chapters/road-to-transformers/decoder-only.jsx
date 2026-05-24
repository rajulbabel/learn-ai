import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function DecoderOnly(ctx) {
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
}
