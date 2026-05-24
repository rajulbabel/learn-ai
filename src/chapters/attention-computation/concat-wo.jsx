import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function ConcatWO(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Step 7 - outputs are separate */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The outputs are separate - we need to combine them.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            After the 8 heads finish, each word has 8 separate results. For "love":
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { head: "Head 1 gave:", v: "[0.3, 0.5]", info: 'figured out "I" is the one who loves', c: C.blue },
              { head: "Head 2 gave:", v: "[-0.2, 0.8]", info: 'figured out "cats" is what\'s loved', c: C.purple },
              { head: "Head 3 gave:", v: "[0.7, -0.1]", info: "figured out the sentiment is positive", c: C.orange },
            ].map(({ head, v, info, c }) => (
              <div
                key={head}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 5,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold center size={16}>
                  {head}
                </T>
                <code style={{ color: `${c}bb`, fontSize: 16 }}>{v}</code>
                <T color={C.dim} size={14}>
                  ← {info}
                </T>
              </div>
            ))}
            <T color={C.dim} size={14} center>
              ... 8 results total
            </T>
          </div>
          <T color="#ffe082" bold center style={{ marginTop: 8 }}>
            We stick them end-to-end (concatenate):
          </T>
          <div
            style={{
              marginTop: 4,
              padding: "8px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.mid} size={16} mono center>
              [0.3, 0.5, -0.2, 0.8, 0.7, -0.1, ..., 0.1, 0.4]
            </T>
          </div>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            One long list - 512 numbers. But there's a problem.
          </T>
        </Box>
      )}

      {/* Sub 1: Step 8 - Sealed envelopes */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            The problem - these results are like 8 sealed envelopes.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            8 detectives investigated the same crime. Each wrote findings and sealed them:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {[
              { head: 1, finding: "suspect is male, 30s", c: C.cyan },
              { head: 2, finding: "happened at the park", c: C.orange },
              { head: 3, finding: "Tuesday evening", c: C.purple },
              { head: 4, finding: "weapon was a knife", c: C.yellow },
            ].map(({ head, finding, c }) => (
              <div
                key={head}
                data-envelope="true"
                style={{
                  width: "calc(50% - 6px)",
                  padding: "8px",
                  borderRadius: 8,
                  background: `${c}08`,
                  border: `2px solid ${c}20`,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>✉️</span>
                  <T color={c} bold size={14}>
                    Head {head}
                  </T>
                </div>
                <div
                  style={{
                    padding: "4px 6px",
                    borderRadius: 4,
                    background: "rgba(0,0,0,0.3)",
                    border: "1px dashed rgba(255,255,255,0.1)",
                  }}
                >
                  <T color={C.dim} size={12}>
                    "{finding}"
                  </T>
                </div>
                <div style={{ position: "absolute", top: 4, right: 6 }}>
                  <span style={{ fontSize: 10, color: C.red }}>sealed</span>
                </div>
              </div>
            ))}
          </div>
          <T color="#ff8a80" size={16} style={{ marginTop: 10 }}>
            Tape them together (concatenation):
          </T>
          <div
            data-concat-bar="true"
            style={{
              marginTop: 6,
              display: "flex",
              height: 36,
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[C.cyan, C.orange, C.purple, C.yellow, C.green, C.pink, C.red, C.blue].map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: `${c}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: i < 7 ? "3px solid rgba(0,0,0,0.8)" : "none",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, color: c }}>H{i + 1}</span>
              </div>
            ))}
          </div>
          <T color={C.dim} size={12} center style={{ marginTop: 2 }}>
            thick black walls between each section - they can't see each other
          </T>
          <T color="#ff8a80" style={{ marginTop: 8 }}>
            They're physically side by side, but each section is still <strong>sealed</strong>. H1's numbers have no
            idea what H2 found. H3 can't see H4. They're taped together but not talking.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Boss asks: "one-line summary?" No envelope has the full picture. H1 only knows the suspect. H2 only knows
            the location. Nobody can combine them.
          </T>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 6 }}>
            We need someone to open all the envelopes, read everything, and write one combined summary.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Step 9 - W_O */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            W_O - the person who opens all the envelopes.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            W_O is just another weight matrix - a grid of numbers, same as W_Q, W_K, W_V. Multiply input by grid, get
            output. Nothing new in how it works.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            But what it <strong>does</strong> is special. When you multiply the concatenated list by W_O, every number
            in the output is computed from all numbers in the input.
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color="#ff8a80" bold size={16} center>
                Before W_O
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Position 1 = 0.3
              </T>
              <T color={C.dim} size={12} center>
                (only knows Head 1's finding)
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color="#80e8a5" bold size={16} center>
                After W_O
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Position 1 = blend of 0.3 + (-0.2) + 0.7 + ... all positions
              </T>
              <T color={C.dim} size={12} center>
                = knows Head 1 + Head 2 + Head 3 + ... everything
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
            It's like the combined summary:{" "}
            <em>"A male suspect in his 30s used a knife at the park on Tuesday evening."</em> One sentence that contains
            information from all envelopes.
          </T>
          <T color="#80e8a5" size={18} style={{ marginTop: 6 }}>
            After W_O, every single position in the output carries a mix of what all 8 heads found. The envelopes have
            been opened, read, and combined.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Step 10 - W_O training */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Where did W_O's numbers come from?
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            Same exact process as all other grids:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { n: 1, text: "Start with random numbers", c: C.red },
              { n: 2, text: "Model tries to predict next word, gets it wrong", c: C.orange },
              { n: 3, text: "Error flows backward, nudges each number in W_O", c: C.yellow },
              {
                n: 4,
                text: '"If this number were 0.31 instead of 0.30, the blending would have been better → change to 0.31"',
                c: C.purple,
              },
              { n: 5, text: "Repeat billions of times", c: C.blue },
              { n: 6, text: "W_O settles into numbers that produce good blends", c: C.green },
            ].map(({ n, text, c }) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  padding: "5px 8px",
                  borderRadius: 5,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 800, fontSize: 16, minWidth: 16 }}>{n}.</span>
                <T color={C.mid} size={16}>
                  {text}
                </T>
              </div>
            ))}
          </div>
          <T color={C.orange} style={{ marginTop: 8 }}>
            The training discovers the best way to combine the 8 heads' findings into one useful output. Nobody programs
            this - it emerges from training.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: Connect back to I love cats */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Back to "I love cats" - what W_O does for "love":
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            After 8 heads run, "love"'s concatenated vector has:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { range: "Dims 1–64", info: 'Head 1 found: "I" is the subject who loves', c: C.cyan },
              { range: "Dims 65–128", info: 'Head 2 found: "cats" is the object being loved', c: C.orange },
              { range: "Dims 129–192", info: "Head 3 found: this is a positive sentiment", c: C.purple },
            ].map(({ range, info, c }) => (
              <div
                key={range}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 5,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold center size={14} style={{ minWidth: 68 }}>
                  {range}
                </T>
                <T color={C.dim} size={14}>
                  {info}
                </T>
              </div>
            ))}
          </div>
          <T color={C.orange} style={{ marginTop: 8 }}>
            Without W_O: each section is isolated. Dim 1 has no idea "cats" is involved.
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            After W_O: <strong>every dimension</strong> of "love"'s output encodes the combined meaning: "affection from
            'I' directed at 'cats', with positive sentiment." One rich, integrated vector.
          </T>
          <T color={C.orange} size={18} style={{ marginTop: 6 }}>
            This is what we set out to do in Chapter 1 - transform "love" from an isolated word into a context-aware
            representation.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Why W_O is learned, not hardcoded */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>
            W_O is LEARNED - not hardcoded.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The model discovers during training which combinations of head outputs are useful. Different layers learn
            different W_O matrices:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { layer: "Layer 1's W_O", learns: "might focus on combining basic syntax patterns", c: C.cyan },
              { layer: "Layer 3's W_O", learns: "might focus on combining semantic relationships", c: C.orange },
              { layer: "Layer 6's W_O", learns: "might focus on combining abstract reasoning", c: C.purple },
            ].map(({ layer, learns, c }) => (
              <div key={layer} style={{ padding: "6px 10px", borderRadius: 5, background: `${c}06` }}>
                <T color={C.dim} size={16}>
                  <strong style={{ color: c }}>{layer}</strong> {learns}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>
            Nobody programs what to combine. W_O's 512×512 = 262,144 weights are all learned through backpropagation -
            the same process from chapters <ChapterLink to="1.3">1.3</ChapterLink>–
            <ChapterLink to="1.9">1.9</ChapterLink>.
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
