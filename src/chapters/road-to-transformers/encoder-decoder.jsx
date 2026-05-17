import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function EncoderDecoder(ctx) {
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
}
