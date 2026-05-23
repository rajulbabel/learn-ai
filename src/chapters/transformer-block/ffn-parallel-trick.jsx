import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

// Module-private helper: render a matrix as a colored grid
const MatrixGrid = ({ rows, label, color, dimLabel }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    {label && (
      <T color={color} bold center size={13}>
        {label}
      </T>
    )}
    <div style={{ borderRadius: 8, border: `1px solid ${color}30`, overflow: "hidden" }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex" }}>
          {row.map((val, ci) => (
            <div
              key={ci}
              style={{
                width: 44,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${color}06`,
                borderRight: ci < row.length - 1 ? `1px solid ${color}12` : "none",
                borderBottom: ri < rows.length - 1 ? `1px solid ${color}12` : "none",
              }}
            >
              <T color={`${color}cc`} size={11}>
                {val}
              </T>
            </div>
          ))}
        </div>
      ))}
    </div>
    {dimLabel && (
      <T color={C.dim} size={10}>
        {dimLabel}
      </T>
    )}
  </div>
);

// Module-private helper: multiplication arrow
const TimesArrow = () => (
  <div style={{ display: "flex", alignItems: "center", padding: "0 6px" }}>
    <T color={C.dim} size={22} bold>
      &times;
    </T>
  </div>
);

const EqualsArrow = () => (
  <div style={{ display: "flex", alignItems: "center", padding: "0 6px" }}>
    <T color={C.dim} size={22} bold>
      =
    </T>
  </div>
);

export default function FFNParallelTrick(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Recap - one word through FFN */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Recap: FFN With Just One Word
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 6 }}>
            In <ChapterLink to="12.3">chapter 12.3</ChapterLink> we traced one word ("cats") through FFN. Let's make the matrix shapes explicit. Say "cats"
            is a 3-dimensional vector:
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <MatrixGrid
              rows={[["0.5", "-0.3", "0.9"]]}
              label={'"cats"'}
              color={C.cyan}
              dimLabel="1x3 (one word, 3 dims)"
            />
            <TimesArrow />
            <MatrixGrid
              rows={[
                ["w", "w", "w", "w", "w", "w"],
                ["w", "w", "w", "w", "w", "w"],
                ["w", "w", "w", "w", "w", "w"],
              ]}
              label="W1"
              color={C.pink}
              dimLabel="3x6 (3 dims in, 6 dims out)"
            />
            <EqualsArrow />
            <MatrixGrid
              rows={[["h", "h", "h", "h", "h", "h"]]}
              label="Hidden"
              color={C.yellow}
              dimLabel="1x6 (expanded)"
            />
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <T color="#80deea" size={15} center>
              One word: <strong>1x3</strong> times <strong>3x6</strong> = <strong>1x6</strong>. The weight matrix W1 has{" "}
              <strong>3 x 6 = 18 weights</strong>. These 18 weights are the same for every single word that ever goes
              through this FFN.
            </T>
          </div>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: Stack 3 words */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            The Trick: Stack Words Into a Matrix
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            What if we have 3 words? We don't run the FFN 3 times. We <strong>stack</strong> all 3 word vectors into a
            single matrix and multiply once:
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <MatrixGrid
              rows={[
                ["0.5", "-0.3", "0.9"],
                ["0.2", "0.8", "-0.1"],
                ["0.7", "-0.5", "0.3"],
              ]}
              label="3 words stacked"
              color={C.green}
              dimLabel='3x3 ("I", "love", "cats")'
            />
            <TimesArrow />
            <MatrixGrid
              rows={[
                ["w", "w", "w", "w", "w", "w"],
                ["w", "w", "w", "w", "w", "w"],
                ["w", "w", "w", "w", "w", "w"],
              ]}
              label="same W1"
              color={C.pink}
              dimLabel="3x6 (unchanged!)"
            />
            <EqualsArrow />
            <MatrixGrid
              rows={[
                ["h", "h", "h", "h", "h", "h"],
                ["h", "h", "h", "h", "h", "h"],
                ["h", "h", "h", "h", "h", "h"],
              ]}
              label="3 outputs"
              color={C.yellow}
              dimLabel="3x6 (one row per word)"
            />
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color="#a5d6a7" size={15} center>
              <strong>3x3</strong> times <strong>3x6</strong> = <strong>3x6</strong>. Still the same W1. Still{" "}
              <strong>18 weights</strong>. Row 1 of the input only interacts with W to produce row 1 of the output. No
              mixing between words - that's how matrix multiplication works.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: 6 words */}
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            6 Words: "The cat sat on the mat"
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 6 }}>
            Now let's use our full example sentence. 6 words, each a 3-dim vector. Stack them into a 6x3 matrix:
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <MatrixGrid
              rows={[
                ["0.2", "-0.9", "0.5"],
                ["0.6", "0.3", "-0.2"],
                ["-0.5", "0.9", "0.1"],
                ["0.1", "-0.4", "0.8"],
                ["0.2", "-0.9", "0.5"],
                ["0.7", "0.2", "-0.6"],
              ]}
              label="6 words"
              color={C.orange}
              dimLabel="6x3"
            />
            <TimesArrow />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <T color={C.pink} bold size={13}>
                same W1
              </T>
              <div
                style={{
                  width: 60,
                  height: 80,
                  borderRadius: 8,
                  border: `1px solid ${C.pink}30`,
                  background: `${C.pink}08`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color={C.pink} size={14} bold>
                  3x6
                </T>
              </div>
              <T color={C.dim} size={10}>
                18 weights
              </T>
            </div>
            <EqualsArrow />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <T color={C.yellow} bold size={13}>
                6 outputs
              </T>
              <div
                style={{
                  width: 80,
                  height: 100,
                  borderRadius: 8,
                  border: `1px solid ${C.yellow}30`,
                  background: `${C.yellow}08`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color={C.yellow} size={14} bold>
                  6x6
                </T>
              </div>
              <T color={C.dim} size={10}>
                one row per word
              </T>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{ padding: 10, borderRadius: 8, background: `${C.orange}08`, border: `1px solid ${C.orange}20` }}
            >
              <T color="#ffcc80" size={15} center>
                <strong>6x3</strong> times <strong>3x6</strong> = <strong>6x6</strong>. The W1 matrix is still{" "}
                <strong>3x6 = 18 weights</strong>. Doesn't matter that we went from 3 words to 6 - the weight matrix
                stays the same size.
              </T>
            </div>
            <div
              style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.25)", border: `1px solid ${C.dim}20` }}
            >
              <T color={C.dim} size={14} center>
                Think about it: row 1 ("The") hits W and produces its own output. Row 4 ("on") hits the{" "}
                <strong>exact same W</strong> and produces its own output. The rows never interact. Each word is
                independently transformed by the same 18 weights.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: 10 words - the key insight */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            10 Words? 1000 Words? Same 18 Weights.
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            This is the key insight. The number of words is just the number of <strong>rows</strong> in the input
            matrix. The weight matrix W never changes:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { words: 1, color: C.cyan },
              { words: 3, color: C.green },
              { words: 6, color: C.orange },
              { words: 10, color: C.purple },
              { words: 1000, color: C.pink },
            ].map(({ words, color }) => (
              <div
                key={words}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                }}
              >
                <div style={{ minWidth: 70 }}>
                  <T color={color} bold size={14}>
                    {words} word{words > 1 ? "s" : ""}
                  </T>
                </div>
                <T color={C.dim} size={13}>
                  {words}x3
                </T>
                <T color={C.dim} size={14} bold>
                  &times;
                </T>
                <T color={C.pink} size={13} bold>
                  3x6
                </T>
                <T color={C.dim} size={14} bold>
                  =
                </T>
                <T color={color} size={13}>
                  {words}x6
                </T>
                <div style={{ marginLeft: "auto" }}>
                  <T color={C.dim} size={12}>
                    W1 = <strong style={{ color: C.pink }}>18 weights</strong>
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 10,
              background: `${C.purple}08`,
              border: `1px solid ${C.purple}25`,
            }}
          >
            <T color="#b8a9ff" bold center size={16}>
              The Pattern
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              (num_words x d_model) &times; W1 (d_model x d_ff) = (num_words x d_ff)
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              The "num_words" dimension is a <strong>free variable</strong>. It can be anything. W1 only cares about
              d_model (3 in our toy example, 512 in real transformers). That's why the model can accept any length input
              with the same 18 parameters.
            </T>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color={C.yellow} size={14} center>
              In GPT-2 (d_model=512, d_ff=2048): W1 has <strong>512 x 2048 = 1,048,576 weights</strong>. That number
              stays the same whether you feed it 10 words or 100,000 words.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Scaling back down - W2 */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Scaling Back Down: W2 Has the Inverse Shape
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>
            After GELU activation, we need to compress back to the original dimension. W2 simply has the{" "}
            <strong>flipped shape</strong>:
          </T>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* 6 words example */}
            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.orange}06`, border: `1px solid ${C.orange}20` }}
            >
              <T color={C.orange} bold center size={15}>
                6 words: expand then compress
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <T color={C.orange} size={12} bold>
                    Input
                  </T>
                  <br />
                  <T color={C.orange} size={14}>
                    6x3
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  &times;
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.pink} size={12} bold>
                    W1
                  </T>
                  <br />
                  <T color={C.pink} size={14}>
                    3x6
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  =
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.yellow} size={12} bold>
                    Expanded
                  </T>
                  <br />
                  <T color={C.yellow} size={14}>
                    6x6
                  </T>
                </div>
                <T color={C.dim} size={16} bold style={{ padding: "0 4px" }}>
                  →
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.yellow} size={12} bold>
                    GELU'd
                  </T>
                  <br />
                  <T color={C.yellow} size={14}>
                    6x6
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  &times;
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.green} size={12} bold>
                    W2
                  </T>
                  <br />
                  <T color={C.green} size={14}>
                    6x3
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  =
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.orange} size={12} bold>
                    Output
                  </T>
                  <br />
                  <T color={C.orange} size={14}>
                    6x3
                  </T>
                </div>
              </div>
            </div>

            {/* 10 words example */}
            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.purple}06`, border: `1px solid ${C.purple}20` }}
            >
              <T color={C.purple} bold center size={15}>
                10 words: same W1, same W2
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <T color={C.purple} size={12} bold>
                    Input
                  </T>
                  <br />
                  <T color={C.purple} size={14}>
                    10x3
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  &times;
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.pink} size={12} bold>
                    W1
                  </T>
                  <br />
                  <T color={C.pink} size={14}>
                    3x6
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  =
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.yellow} size={12} bold>
                    Expanded
                  </T>
                  <br />
                  <T color={C.yellow} size={14}>
                    10x6
                  </T>
                </div>
                <T color={C.dim} size={16} bold style={{ padding: "0 4px" }}>
                  →
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.yellow} size={12} bold>
                    GELU'd
                  </T>
                  <br />
                  <T color={C.yellow} size={14}>
                    10x6
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  &times;
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.green} size={12} bold>
                    W2
                  </T>
                  <br />
                  <T color={C.green} size={14}>
                    6x3
                  </T>
                </div>
                <T color={C.dim} size={14} bold>
                  =
                </T>
                <div style={{ textAlign: "center" }}>
                  <T color={C.purple} size={12} bold>
                    Output
                  </T>
                  <br />
                  <T color={C.purple} size={14}>
                    10x3
                  </T>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 10,
              background: `${C.red}08`,
              border: `1px solid ${C.red}25`,
            }}
          >
            <T color="#ef9a9a" bold center size={16}>
              The General Pattern
            </T>
            <div style={{ marginTop: 8, fontFamily: "monospace", textAlign: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                <T color={C.pink} size={14}>
                  Layer 1: (words x d_model) &times; W1 (d_model x d_ff) = (words x d_ff)
                </T>
                <T color={C.yellow} size={14}>
                  GELU: (words x d_ff) → (words x d_ff)
                </T>
                <T color={C.green} size={14}>
                  Layer 2: (words x d_ff) &times; W2 (d_ff x d_model) = (words x d_model)
                </T>
              </div>
            </div>
            <T color="#ef9a9a" size={15} center style={{ marginTop: 10 }}>
              Word count flows through as the row dimension. W1 and W2 only depend on d_model and d_ff. In, expand,
              compress back out - same size going in and coming out, regardless of how many words.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 4 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 5: Why this matters - GPU parallelism */}
      <Reveal when={sub >= 5}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            Why This Matters: Massive GPU Parallelism
          </T>
          <T color="#90caf9" size={16} style={{ marginTop: 6 }}>
            The reason we stack words into a matrix isn't just math elegance - it's about hardware speed.
          </T>

          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.red}06`,
                border: `1px solid ${C.red}20`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Without stacking (for loop)
              </T>
              <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 13, color: C.dim }}>
                <div>for word in words:</div>
                <div style={{ paddingLeft: 16 }}>output = word &times; W</div>
              </div>
              <T color={C.red} size={13} style={{ marginTop: 8 }}>
                1000 words = 1000 sequential matrix multiplies. Each one waits for the previous to finish. The GPU sits
                mostly idle because each multiply is tiny (1x3 &times; 3x6).
              </T>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={15}>
                With stacking (one multiply)
              </T>
              <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 13, color: C.dim }}>
                <div>output = all_words &times; W</div>
              </div>
              <T color={C.green} size={13} style={{ marginTop: 8 }}>
                1000 words = one massive parallel matrix multiply (1000x3 &times; 3x6). GPU processes all rows
                simultaneously across thousands of cores. One instruction, all words done.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 10,
              background: `${C.blue}08`,
              border: `1px solid ${C.blue}25`,
            }}
          >
            <T color="#90caf9" bold center size={16}>
              The Deep Insight
            </T>
            <T color="#90caf9" size={15} style={{ marginTop: 6 }}>
              This parallel trick works <strong>because FFN treats each word independently</strong>. No word's output
              depends on any other word. That's the fundamental difference from Attention, which creates cross-word
              dependencies (Q &middot; K). You can't parallelize Attention the same way because token 3's output depends
              on tokens 1 and 2.
            </T>
            <T color="#90caf9" size={15} style={{ marginTop: 8 }}>
              But FFN? Each row hits the same W, gets the same GELU, comes out independently. It's embarrassingly
              parallel - the GPU's dream workload.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color={C.yellow} size={14} center>
              This is also why the <strong>KV cache</strong> during generation only caches attention K,V - not FFN
              outputs. FFN has no cross-word state to remember. Run it on the new word, get the answer. Previous words'
              FFN results are already baked into the K,V cache.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
