import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function IsWOConstant(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={21}>
            Is W_O constant? Does it change?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            There are two phases in a model's life: <strong>training</strong> and <strong>usage</strong>. The answer
            depends on which phase you're asking about.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
          <Box color={C.orange} style={{ flex: 1 }}>
            <T color={C.orange} bold center size={18}>
              During training: W_O changes.
            </T>
            <T color={C.orange} size={16} style={{ marginTop: 6 }}>
              Every time the model sees a new batch of sentences and makes prediction errors, every number in W_O gets
              nudged slightly. Over billions of examples, W_O gradually improves. It changes millions of times during
              training - getting better and better at blending heads.
            </T>
          </Box>
          <Box color={C.green} style={{ flex: 1 }}>
            <T color="#80e8a5" bold center size={18}>
              After training is done: W_O is FROZEN. Completely constant.
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 6 }}>
              Once training is complete, the model is saved to a file. W_O's numbers are written to disk and they NEVER
              change again. When you use the model (send it a sentence), W_O is loaded from disk and used as-is.
            </T>
          </Box>
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <div style={{ padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.mid} size={18} style={{ lineHeight: 2.2 }}>
              You type "I love cats" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ model uses the{" "}
              <strong style={{ color: C.green }}>same</strong> W_O
              <br />
              You type "dogs are great" &nbsp;&nbsp;&nbsp;→ model uses the{" "}
              <strong style={{ color: C.green }}>same</strong> W_O
              <br />
              You type "the weather is nice" → model uses the <strong style={{ color: C.green }}>same</strong> W_O
              <br />
              Someone else types anything &nbsp;→ model uses the <strong style={{ color: C.green }}>same</strong> W_O
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The same grid of numbers. Every input. Every user. Every sentence. Forever (until someone retrains the
            model).
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            This is true for all grids, not just W_O:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}
            >
              <T color={C.green} bold center size={18}>
                CONSTANT after training (stored on disk, never changes):
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Embedding dictionary",
                  "W_Q₁ through W_Q₈ ← same grid for every input",
                  "W_K₁ through W_K₈ ← same grid for every input",
                  "W_V₁ through W_V₈ ← same grid for every input",
                  "W_O ← same grid for every input",
                  "All other layer weights",
                ].map((item) => (
                  <div key={item} style={{ padding: "3px 8px", borderRadius: 3, background: `${C.green}06` }}>
                    <T color={C.mid} size={14}>
                      ├── {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={18}>
                Different for every input (computed live, then thrown away):
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Q, K, V vectors ← different because the words are different",
                  "Attention scores ← different because Q, K are different",
                  "Softmax weights ← different because scores are different",
                  "Blended outputs ← different because weights and V are different",
                  "Final output ← different because everything above is different",
                ].map((item) => (
                  <div key={item} style={{ padding: "3px 8px", borderRadius: 3, background: `${C.yellow}06` }}>
                    <T color={C.mid} size={14}>
                      ├── {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Why do different sentences get different results if the grids are constant?
          </T>
          <T color={C.blue} style={{ marginTop: 6 }}>
            Because the grids are like a <strong>coffee machine</strong>. The machine (W_O) is always the same. But the
            coffee beans you put in (your sentence) are different each time. Same machine + different beans = different
            coffee.
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.red}06` }}>
              <T color={C.mid} size={16}>
                Same W_O × "I love cats" embeddings <strong style={{ color: C.red }}>= one output</strong>
              </T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.purple}06` }}>
              <T color={C.mid} size={16}>
                Same W_O × "dogs are great" embeddings{" "}
                <strong style={{ color: C.purple }}>= completely different output</strong>
              </T>
            </div>
          </div>
          <T color={C.blue} style={{ marginTop: 8 }}>
            The grids don't need to change. They've already learned the GENERAL SKILL of "how to blend heads" or "how to
            extract queries." That skill works on ANY input. Just like a coffee machine doesn't need to be rebuilt for
            each type of bean - it already knows how to grind and brew.
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
