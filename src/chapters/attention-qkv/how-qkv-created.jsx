import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function HowQKVCreated(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            So far, Q, K, V are just concepts in our head.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            We know each word needs:
          </T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
            <T color={C.blue} size={18}>
              🔍 Query - "what am I looking for?"
            </T>
            <T color={C.orange} size={18}>
              🏷️ Key - "what do I offer?"
            </T>
            <T color={C.green} size={18}>
              📦 Value - "what info do I carry?"
            </T>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            But each word starts as just <strong>one</strong> list of numbers - its embedding. For example:
          </T>
          <div
            style={{
              marginTop: 6,
              padding: "6px 10px",
              borderRadius: 6,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <T color={C.mid} size={18} mono center>
              "love" = [0.2, 0.9, 0.4, -0.1]
            </T>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            That's one list. We need three different lists from it (Query, Key, Value). How do you get three different
            things from one thing?
          </T>
          <T color="#b8a9ff" bold center style={{ marginTop: 6 }}>
            You <strong>transform</strong> it three different ways. And the tool for each transformation is: a{" "}
            <strong>grid of numbers</strong>.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            What is this "grid of numbers"?
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            It's called a <strong>W matrix</strong> (W = "weights"). But don't let the name scare you. It's just a{" "}
            <strong>table of numbers</strong>. Like a spreadsheet. Rows and columns filled with numbers:
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            <T color={C.dim} size={14} center style={{ marginBottom: 4 }}>
              Example: a W grid might look like this (tiny version):
            </T>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 3,
                maxWidth: 300,
                margin: "0 auto",
              }}
            >
              {[
                0.02, -0.15, 0.31, 0.08, 0.41, 0.07, -0.22, -0.19, -0.09, 0.33, 0.14, 0.27, 0.18, -0.05, 0.42, 0.11,
              ].map((v, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "4px",
                    borderRadius: 3,
                    background: `${v > 0 ? C.blue : C.red}08`,
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: C.mid,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>
            That's it. Just numbers in a grid. When you multiply a word's embedding by this grid, you get a new, smaller
            list of numbers - the Query (or Key, or Value, depending on which grid).
          </T>
          <T color="#ffe082" size={18} style={{ marginTop: 6 }}>
            <strong>Multiply input by a table → get an output.</strong> Nothing more complicated than that.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Think of it like a photo with three filters.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            You have a photo of a person. You want three different views:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                view: "View 1",
                highlight: "highlight only the eyes",
                what: "→ captures where the person is looking",
                c: C.blue,
              },
              { view: "View 2", highlight: "highlight only the nose", what: "→ captures the nose shape", c: C.orange },
              { view: "View 3", highlight: "highlight only the mouth", what: "→ captures the expression", c: C.green },
            ].map(({ view, highlight, what, c }) => (
              <div
                key={view}
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
                <T color={c} bold center size={18}>
                  {view}:
                </T>
                <T color={C.mid} size={16}>
                  {highlight}
                </T>
                <T color={C.dim} size={14}>
                  {what}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            How do you create these views? You apply three different <strong>filters</strong>. Each filter is a grid of
            numbers that, when multiplied with the photo, produces a different view.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            That's EXACTLY what W_Q, W_K, W_V are. They're three grids of numbers (filters).
          </T>
          <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.mid} size={18} mono>
              Word embedding: [1.0, 0.5, -0.3, 0.8] &nbsp; ← the "photo"
            </T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                { g: "Grid 1 (W_Q):", d: "a 4×2 grid of numbers", f: 'filter for "what am I looking for?"', c: C.blue },
                { g: "Grid 2 (W_K):", d: "a 4×2 grid of numbers", f: 'filter for "what do I offer?"', c: C.orange },
                { g: "Grid 3 (W_V):", d: "a 4×2 grid of numbers", f: 'filter for "what info do I carry?"', c: C.green },
              ].map(({ g, d, f, c }) => (
                <div
                  key={g}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: `${c}06`,
                  }}
                >
                  <T color={c} bold center size={14}>
                    {g}
                  </T>
                  <T color={C.dim} size={12}>
                    {d}
                  </T>
                  <T color={C.dim} size={12}>
                    ← {f}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            When you multiply the embedding by Grid 1, you get the <strong>Query</strong> - a 2-number list representing
            "what this word is looking for."
          </T>
          <T color="#80deea" style={{ marginTop: 4 }}>
            When you multiply the same embedding by Grid 2, you get the <strong>Key</strong> - a 2-number list
            representing "what this word can be found for."
          </T>
          <T color="#80deea" style={{ marginTop: 4 }}>
            When you multiply the same embedding by Grid 3, you get the <strong>Value</strong> - a 2-number list
            representing "what actual info this word carries."
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            <strong>The grids are just tables of numbers. Nothing magical.</strong> Multiply input by a table → get an
            output.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Now let's see the actual three grids in action:
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Same word embedding goes through three different grids - each produces a different output:
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <div
          style={{
            background: C.card,
            borderRadius: 12,
            padding: "14px",
            border: `1px solid ${C.border}`,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <Tag color={C.bright}>"love" embedding = [0.2, 0.9, 0.4, -0.1, ..., 0.3]</Tag>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
              512 numbers representing "love" (we'll use this exact word in our full computation later)
            </T>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <T color={C.dim} size={26}>
              ↓ multiply by 3 different grids ↓
            </T>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                filter: "Grid 1: W_Q",
                role: "Query",
                emphasis: '"what this word NEEDS from others"',
                result: "64 numbers",
                color: C.blue,
                icon: "🔍",
              },
              {
                filter: "Grid 2: W_K",
                role: "Key",
                emphasis: '"what this word can be MATCHED on"',
                result: "64 numbers",
                color: C.orange,
                icon: "🏷️",
              },
              {
                filter: "Grid 3: W_V",
                role: "Value",
                emphasis: '"what useful INFO this word carries"',
                result: "64 numbers",
                color: C.green,
                icon: "📦",
              },
            ].map(({ filter, role, emphasis, result, color, icon }) => (
              <div
                key={role}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: 8,
                  background: `${color}08`,
                  border: `1px solid ${color}18`,
                }}
              >
                <span style={{ fontSize: 29, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <T color={color} bold center size={18}>
                      {filter}
                    </T>
                    <T color={C.dim} size={14}>
                      → produces
                    </T>
                    <Tag color={color}>{role}</Tag>
                  </div>
                  <T color={C.dim} size={16} style={{ marginTop: 2 }}>
                    Emphasizes: {emphasis}
                  </T>
                  <T color={C.dim} size={14}>
                    Output: {result}
                  </T>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.yellow}>
          <T color="#ffe082" bold center>
            Same input (embedding), three different outputs depending on which grid you use.
          </T>
          <T color="#ffe082" size={18}>
            Each grid is 512×64 = 32,768 numbers. But where do these numbers come from?
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
