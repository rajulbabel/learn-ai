import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function CompletePicture(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={21}>
            The complete picture in plain English:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { n: "1", step: "Words become numbers", desc: "(embedding lookup)", c: C.blue, icon: "📖" },
              {
                n: "2",
                step: "Those numbers × three grids",
                desc: "(W_Q, W_K, W_V → Query, Key, Value)",
                c: C.purple,
                icon: "🔧",
              },
              {
                n: "3",
                step: "Queries dot-product with Keys",
                desc: '(find "who is relevant to whom")',
                c: C.orange,
                icon: "🔍",
              },
              { n: "4", step: "Scores get normalized", desc: "(scale + softmax → percentages)", c: C.pink, icon: "📊" },
              {
                n: "5",
                step: "Percentages blend the Values",
                desc: "(weighted sum → context-aware output)",
                c: C.green,
                icon: "🎯",
              },
              {
                n: "6",
                step: "Steps 2-5 happen 8 times with different grids",
                desc: "(multi-head → 8 separate results)",
                c: C.cyan,
                icon: "🔀",
              },
              {
                n: "7",
                step: "Stick the 8 results end-to-end",
                desc: "(concatenate → 8 sealed envelopes taped together)",
                c: C.yellow,
                icon: "📎",
              },
              {
                n: "8",
                step: "That list × one more grid",
                desc: "(W_O → open all envelopes, write combined summary)",
                c: C.red,
                icon: "✉️",
              },
              {
                n: "9",
                step: "Output: one blended vector per word",
                desc: "(ready for the next layer)",
                c: C.green,
                icon: "✅",
              },
            ].map(({ n, step, desc, c, icon }) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <T color={c} bold center size={18}>
                    {n}. {step}
                  </T>
                  <T color={C.dim} size={14}>
                    {desc}
                  </T>
                </div>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff">
            Every single "grid" in this process (W_Q, W_K, W_V, W_O) is just a table of numbers that started random, got
            nudged into useful values during training, and then <strong>stays frozen forever after</strong>. They all
            work the same way - multiply input by grid, get output. The only difference is what each grid was trained to
            do:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { grid: "W_Q grids", learned: 'learned to extract "what a word is looking for"', c: C.blue },
              { grid: "W_K grids", learned: 'learned to extract "what a word can be found for"', c: C.orange },
              { grid: "W_V grids", learned: 'learned to extract "what actual info a word carries"', c: C.green },
              {
                grid: "W_O grid",
                learned: "learned to blend all heads' findings into one combined summary",
                c: C.yellow,
              },
            ].map(({ grid, learned, c }) => (
              <div
                key={grid}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold center size={18} style={{ minWidth: 66 }}>
                  {grid}
                </T>
                <T color={C.mid} size={16}>
                  {learned}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold size={21} center>
            The grids are the machine. Your sentence is the raw material.
          </T>
          <T color="#80deea" center style={{ marginTop: 6 }}>
            Same machine, different raw material, different product - every single time.
          </T>
        </Box>
      </Reveal>
      {sub < 2 && (
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
