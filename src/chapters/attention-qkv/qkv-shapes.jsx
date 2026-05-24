import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

const Bar = ({ n, color, cellW = 22, cellH = 26, label, nums }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    {label && (
      <T color={color} bold center size={12}>
        {label}
      </T>
    )}
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{
            width: cellW,
            height: cellH,
            background: `${color}22`,
            border: `1px solid ${color}55`,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontFamily: "monospace",
            color: color,
          }}
        >
          {nums[i]}
        </div>
      ))}
    </div>
  </div>
);

const Matrix = ({ rows, cols, color, cellW = 22, cellH = 22, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    {label && (
      <T color={color} bold center size={12}>
        {label}
      </T>
    )}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
        gap: 2,
      }}
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <div
          key={i}
          style={{
            width: cellW,
            height: cellH,
            background: `${color}18`,
            border: `1px solid ${color}40`,
            borderRadius: 3,
          }}
        />
      ))}
    </div>
  </div>
);

const Op = ({ symbol }) => (
  <T color={C.dim} size={24} bold>
    {symbol}
  </T>
);

export default function QKVShapes(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The puzzle: why is W_Q shaped 4×2, not 4×4?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            In the last chapter we saw W_Q written as a <strong>4×2 grid</strong>. That might feel odd. If the embedding
            has 4 numbers, shouldn't the query also have 4 numbers? Shouldn't W_Q be 4×4?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Short answer: no. Q (and K and V) are <strong>smaller than the embedding</strong>. W_Q's job is to{" "}
            <strong>project</strong> the 4-number embedding <strong>down</strong> to a 2-number query. The input and
            output sizes do not have to match.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Bar n={4} color={C.blue} label="embedding (4 numbers)" nums={["1.0", "0.5", "-.3", "0.8"]} />
            <Op symbol="×" />
            <Matrix rows={4} cols={2} color={C.purple} label="W_Q (4×2)" />
            <Op symbol="=" />
            <Bar n={2} color={C.cyan} label="query (2 numbers)" nums={["0.3", "0.7"]} />
          </div>
          <T color={C.dim} size={14} center style={{ marginTop: 8 }}>
            4 numbers in, 2 numbers out. The matrix shape tells you exactly that: <strong>4 rows = input size</strong>,{" "}
            <strong>2 columns = output size</strong>.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The embedding stays big. Q, K, V are small views.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Think of the embedding as the word's <strong>full profile</strong> - it stays 4 numbers long for the entire
            journey through the Transformer. Q, K, V are three <strong>compressed lenses</strong> on that profile, built
            only for the attention step.
          </T>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Bar n={4} color={C.bright} label="embedding (always 4 numbers)" nums={["1.0", "0.5", "-.3", "0.8"]} />
              <svg width="360" height="44" viewBox="0 0 360 44" style={{ maxWidth: "100%" }}>
                <desc>
                  Three arrows fanning out from the embedding down to Q, K, and V. Each arrow is labeled with its
                  projection matrix, illustrating three parallel compressed views of the same embedding.
                </desc>
                <line x1="180" y1="0" x2="70" y2="40" stroke={C.blue} strokeWidth="1.5" />
                <line x1="180" y1="0" x2="180" y2="40" stroke={C.orange} strokeWidth="1.5" />
                <line x1="180" y1="0" x2="290" y2="40" stroke={C.green} strokeWidth="1.5" />
                <text x="115" y="18" fontSize="11" fill={C.blue} fontWeight="700">
                  × W_Q
                </text>
                <text x="186" y="18" fontSize="11" fill={C.orange} fontWeight="700">
                  × W_K
                </text>
                <text x="240" y="18" fontSize="11" fill={C.green} fontWeight="700">
                  × W_V
                </text>
              </svg>
              <div style={{ display: "flex", gap: 50, alignItems: "flex-start" }}>
                <Bar n={2} color={C.blue} label="Query (2)" nums={["0.3", "0.7"]} />
                <Bar n={2} color={C.orange} label="Key (2)" nums={["0.9", "0.4"]} />
                <Bar n={2} color={C.green} label="Value (2)" nums={["0.6", "-.2"]} />
              </div>
            </div>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            Three different W matrices, three different 2-number views. The 4-number embedding itself is untouched; it
            continues through the rest of the network in its full original size.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Why smaller? Multi-head attention splits the budget
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Here is the real reason for the smaller shape. The Transformer runs{" "}
            <strong>several heads in parallel</strong> on the same embedding. Each head gets its own set of W_Q, W_K,
            W_V and works independently, looking at the embedding through its own 2-number lens.
          </T>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Bar n={4} color={C.bright} label="one embedding, 4 numbers" nums={["1.0", "0.5", "-.3", "0.8"]} />
              <svg width="360" height="40" viewBox="0 0 360 40" style={{ maxWidth: "100%" }}>
                <desc>
                  Two arrows fanning out from the embedding to two different heads, each with its own W_Q matrix.
                </desc>
                <line x1="180" y1="0" x2="100" y2="36" stroke={C.cyan} strokeWidth="1.5" />
                <line x1="180" y1="0" x2="260" y2="36" stroke={C.pink} strokeWidth="1.5" />
                <text x="108" y="22" fontSize="11" fill={C.cyan} fontWeight="700">
                  × W_Q₁
                </text>
                <text x="220" y="22" fontSize="11" fill={C.pink} fontWeight="700">
                  × W_Q₂
                </text>
              </svg>
              <div style={{ display: "flex", gap: 90, alignItems: "flex-start" }}>
                <Bar n={2} color={C.cyan} label="Head 1: Q₁" nums={["0.3", "0.7"]} />
                <Bar n={2} color={C.pink} label="Head 2: Q₂" nums={["-.4", "0.2"]} />
              </div>
            </div>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            Two heads, each with its own W_Q (4×2). Each produces a different 2-number Query because W_Q₁ and W_Q₂
            learned different things. After both heads do their attention, their outputs are{" "}
            <strong>concatenated</strong> back to 4 numbers total (2 + 2) and fed forward.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={15}>
              The budget intuition
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              Fixed budget: 4 output numbers per token. Options: one big head with a 4-number Q, or two small heads each
              with a 2-number Q. Multi-head picks the second: more heads, each specialized.{" "}
              <strong>d_k = d_model / num_heads</strong>.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Real Transformer numbers (GPT-style)
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Scale everything up. The chapter's 4 becomes 512. The chapter's 2 becomes 64. The chapter's 2 heads become
            8.
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}20`,
              }}
            >
              <T color={C.orange} bold center size={15}>
                This chapter (teaching)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                d_model = 4 (embedding size)
              </T>
              <T color={C.dim} size={14}>
                num_heads = 2
              </T>
              <T color={C.dim} size={14}>
                d_k = 4 / 2 = <strong style={{ color: C.yellow }}>2</strong> (Q/K/V per head)
              </T>
              <T color={C.dim} size={14}>
                W_Q per head = <strong style={{ color: C.yellow }}>4 × 2</strong>
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}20`,
              }}
            >
              <T color={C.orange} bold center size={15}>
                Real GPT (typical)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                d_model = 512 (embedding size)
              </T>
              <T color={C.dim} size={14}>
                num_heads = 8
              </T>
              <T color={C.dim} size={14}>
                d_k = 512 / 8 = <strong style={{ color: C.yellow }}>64</strong> (Q/K/V per head)
              </T>
              <T color={C.dim} size={14}>
                W_Q per head = <strong style={{ color: C.yellow }}>512 × 64</strong>
              </T>
            </div>
          </div>
          <T color="#ffcc80" style={{ marginTop: 10 }}>
            8 heads × 64 numbers each = 512 numbers total, which fits exactly back into the embedding size. The budget
            is preserved across heads.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Shapes recap
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                what: "Embedding",
                shape: "d_model (4 here, 512 in real)",
                life: "lives through the whole Transformer",
                color: C.bright,
              },
              {
                what: "Q, K, V (per head)",
                shape: "d_k (2 here, 64 in real)",
                life: "temporary, only inside attention",
                color: C.cyan,
              },
              {
                what: "W_Q, W_K, W_V (per head)",
                shape: "d_model × d_k (4×2 here, 512×64 in real)",
                life: "projects embedding → Q / K / V",
                color: C.purple,
              },
              {
                what: "Multi-head concat + W_O",
                shape: "back to d_model (4 here, 512 in real)",
                life: "returns to the main residual stream",
                color: C.green,
              },
            ].map(({ what, shape, life, color }) => (
              <div
                key={what}
                style={{
                  display: "grid",
                  gridTemplateColumns: "170px 210px 1fr",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${color}06`,
                  border: `1px solid ${color}20`,
                }}
              >
                <T color={color} bold size={14}>
                  {what}
                </T>
                <T color={C.bright} size={14} mono>
                  {shape}
                </T>
                <T color={C.dim} size={13}>
                  {life}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 12 }}>
            Bottom line: W_Q is <strong>not square</strong>. It's a rectangular projection from embedding space into a
            smaller query space. The embedding keeps its original size; the query is a compressed view used only for the
            attention computation.
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
