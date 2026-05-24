import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

const randomGrid = [
  0.47, -0.82, 0.15, -0.63, 0.91, -0.24, 0.38, -0.71, 0.56, -0.09, 0.77, -0.45, -0.33, 0.62, -0.88, 0.19,
];
const trainedGrid = [
  0.02, -0.15, 0.31, 0.08, 0.41, 0.07, -0.22, -0.19, -0.09, 0.33, 0.14, 0.27, 0.18, -0.05, 0.42, 0.11,
];

const GridViz = ({ numbers, label, labelColor, highlight = -1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    {label && (
      <T color={labelColor} bold center size={14}>
        {label}
      </T>
    )}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, width: 180 }}>
      {numbers.map((v, i) => (
        <div
          key={i}
          style={{
            textAlign: "center",
            padding: "5px 2px",
            borderRadius: 4,
            background: highlight === i ? `${C.yellow}25` : `${v > 0 ? C.blue : C.red}08`,
            fontFamily: "monospace",
            fontSize: 13,
            color: highlight === i ? C.yellow : C.mid,
            border: highlight === i ? `1px solid ${C.yellow}40` : "1px solid transparent",
            transition: "all 0.3s",
          }}
        >
          {v > 0 ? "+" : ""}
          {v.toFixed(2)}
        </div>
      ))}
    </div>
  </div>
);

export default function WMatrices(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The question */}
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Where did those numbers in the grids come from?
          </T>
          <T color={C.orange} style={{ marginTop: 8 }}>
            Last chapter, we saw three grids (W_Q, W_K, W_V) - each a table of numbers. Multiply an embedding by a grid,
            get Q or K or V.
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            But who decided what numbers go in those grids?
          </T>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "W_Q", color: C.blue, icon: "🔍" },
              { label: "W_K", color: C.orange, icon: "🏷️" },
              { label: "W_V", color: C.green, icon: "📦" },
            ].map(({ label, color, icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: `${color}08`,
                  border: `1px solid ${color}18`,
                }}
              >
                <span style={{ fontSize: 24 }}>{icon}</span>
                <T color={color} bold center size={16}>
                  {label}
                </T>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 6 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 3,
                        background: `${color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        color: color,
                      }}
                    >
                      ?
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <T color={C.orange} bold center style={{ marginTop: 10 }}>
            Answer: <strong>nobody</strong> decided. The numbers were <strong>learned</strong> during training.
          </T>
        </Box>
      )}

      {/* Sub 1: Day 1 - Random initialization */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            Day 1: Start with random garbage
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Before training begins, every grid is filled with <strong>random numbers</strong>. Nobody thought about
            these. A random number generator just spit them out:
          </T>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <GridViz numbers={randomGrid} label="W_Q (random)" labelColor={C.blue} />
            <GridViz
              numbers={randomGrid.map((v, i) => randomGrid[(i + 5) % 16])}
              label="W_K (random)"
              labelColor={C.orange}
            />
            <GridViz
              numbers={randomGrid.map((v, i) => randomGrid[(i + 11) % 16])}
              label="W_V (random)"
              labelColor={C.green}
            />
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.dim} size={16} center>
              With random grids, the model computes:
            </T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <T color={C.red} size={16}>
                random W_Q x embedding = <strong>garbage Query</strong>
              </T>
              <T color={C.red} size={16}>
                random W_K x embedding = <strong>garbage Key</strong>
              </T>
              <T color={C.red} size={16}>
                random W_V x embedding = <strong>garbage Value</strong>
              </T>
            </div>
            <T color={C.dim} size={16} center style={{ marginTop: 6 }}>
              Garbage Q, K, V → garbage attention → garbage predictions
            </T>
          </div>
          <T color="#ff8a80" bold center style={{ marginTop: 8 }}>
            The model is terrible at this point. And that's completely fine.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: The training loop */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The training loop: predict, fail, nudge
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The model reads millions of sentences and tries to predict the next word each time. Here's what happens on
            every single attempt:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { step: "1", text: 'Model sees: "The cat sat on the"', icon: "📖", c: C.cyan },
              { step: "2", text: "Uses its current (bad) grids to compute attention", icon: "⚙️", c: C.blue },
              { step: "3", text: 'Predicts next word: "elephant" (wrong! should be "mat")', icon: "❌", c: C.red },
              { step: "4", text: "Calculates error: how wrong was that prediction?", icon: "📏", c: C.orange },
              { step: "5", text: "Error flows backward through every grid number", icon: "⬅️", c: C.yellow },
              { step: "6", text: "Each number gets nudged slightly to reduce the error", icon: "🔧", c: C.green },
            ].map(({ step, text, icon, c }, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `${c}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <T color={C.mid} size={16}>
                  {text}
                </T>
                {i < 5 && (
                  <span style={{ position: "absolute", left: 28, marginTop: 36, color: C.dim, fontSize: 14 }}></span>
                )}
              </div>
            ))}
          </div>
          <T color="#ffe082" bold center style={{ marginTop: 10 }}>
            This loop repeats <strong>billions</strong> of times. Every repetition nudges the numbers a tiny bit closer
            to useful values.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Zoom into one nudge */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Zoom in: what does one "nudge" look like?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Let's look at a single number in W_Q - say row 3, column 2:
          </T>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <GridViz numbers={randomGrid} label="W_Q grid (one number highlighted)" labelColor={C.blue} highlight={9} />
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                before: "-0.09",
                after: "-0.07",
                reason:
                  "The error signal says: \"If this number were slightly larger, the Query for 'cat' would have paid more attention to 'sat' - and the prediction would have been a little better.\"",
                c: C.yellow,
              },
            ].map(({ before, after, reason, c }) => (
              <div
                key={before}
                style={{ padding: "12px 14px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}15` }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: `${C.red}12`,
                      border: `1px solid ${C.red}25`,
                    }}
                  >
                    <T color={C.red} mono bold center size={18}>
                      {before}
                    </T>
                  </div>
                  <T color={C.dim} size={22}>
                    →
                  </T>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}25`,
                    }}
                  >
                    <T color={C.green} mono bold center size={18}>
                      {after}
                    </T>
                  </div>
                </div>
                <T color={C.mid} size={15} style={{ marginTop: 8 }}>
                  {reason}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            That's it. Just +0.02. A tiny nudge. But multiply that by every number in every grid, across billions of
            training examples, and the grids slowly transform from random noise into something meaningful.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: After training - grids have settled */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            After billions of examples: the grids have settled
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            After training, the random numbers have been nudged millions of times. They've settled into values that
            actually mean something:
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "180px 40px 180px",
              columnGap: 20,
              rowGap: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <T color={C.red} bold center size={13}>
              BEFORE (random)
            </T>
            <div />
            <T color={C.green} bold center size={13}>
              AFTER (trained)
            </T>
            <T color={C.dim} bold center size={14}>
              W_Q
            </T>
            <div />
            <T color={C.blue} bold center size={14}>
              W_Q
            </T>
            <GridViz numbers={randomGrid} label={null} labelColor={C.dim} />
            <T color={C.dim} size={28} center>
              →
            </T>
            <GridViz numbers={trainedGrid} label={null} labelColor={C.blue} />
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                grid: "W_Q",
                result: 'now produces Queries that correctly capture "what am I looking for?"',
                c: C.blue,
              },
              { grid: "W_K", result: 'now produces Keys that correctly capture "what do I offer?"', c: C.orange },
              { grid: "W_V", result: 'now produces Values that correctly capture "what info do I carry?"', c: C.green },
            ].map(({ grid, result, c }) => (
              <div
                key={grid}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${c}08`,
                  border: `1px solid ${c}15`,
                }}
              >
                <Tag color={c}>{grid}</Tag>
                <T color={C.mid} size={15}>
                  {result}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: The key insight */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The key insight
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <T color={C.cyan} bold center size={18}>
              Nobody programmed these numbers.
            </T>
            <T color={C.mid} size={16} center style={{ marginTop: 6 }}>
              No human sat down and said "row 3, column 2 should be 0.14." The numbers <strong>emerged</strong> from the
              nudging process (backpropagation) over billions of examples.
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            This is what "learned" means in machine learning. The model figured out, on its own, what numbers to put in
            each grid so that the resulting Q, K, V vectors produce useful attention patterns.
          </T>
          <T color="#80deea" bold center style={{ marginTop: 8 }}>
            Random noise in → billions of nudges → meaningful grids out.
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
