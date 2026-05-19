import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function OutputLayer(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: What is a hidden state? Explained from scratch ── */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            What is a hidden state?
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            We keep saying the neural network "processes" the input. But what does that actually produce? The answer is
            a <strong>hidden state</strong> - and understanding it is the key to understanding this entire chapter.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Step 1: Input */}
            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.purple}06`, border: `1px solid ${C.purple}12` }}
            >
              <T color={C.purple} bold size={16}>
                Step 1: Input sentence enters the model
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["The", "cat", "sat", "on", "the"].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: `${C.purple}15`,
                      border: `1px solid ${C.purple}25`,
                    }}
                  >
                    <T color={C.purple} bold size={14}>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Each word gets converted to a vector of 768 numbers (the embedding from chapter 5.1). So "the" becomes
                [-0.14, 0.62, -0.38, ...]
              </T>
            </div>

            {/* Step 2: Layers process it */}
            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}
            >
              <T color={C.orange} bold size={16}>
                Step 2: Hidden layers transform these vectors, one layer at a time
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  {
                    layer: "Layer 1",
                    desc: 'Learns basic patterns: "the" is an article, "cat" is a noun',
                    color: "#ffcc80",
                  },
                  { layer: "Layer 2", desc: 'Learns combinations: "the cat" is a noun phrase', color: "#ffcc80" },
                  { layer: "Layer 6", desc: 'Learns grammar: "sat on the" expects a location next', color: "#ffa726" },
                  {
                    layer: "Layer 12 (final)",
                    desc: "Encodes the full understanding: what word should come next",
                    color: "#ff9800",
                  },
                ].map(({ layer, desc, color }) => (
                  <div
                    key={layer}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <T color={color} bold size={14} style={{ minWidth: 90 }}>
                      {layer}
                    </T>
                    <T color={C.dim} size={13}>
                      {desc}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Each layer takes in 768 numbers and outputs 768 new numbers. The vector gets refined and enriched at
                every step.
              </T>
            </div>

            {/* Step 3: The result */}
            <div style={{ padding: 12, borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
              <T color={C.green} bold size={16}>
                Step 3: The final layer's output = the hidden state
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                After ALL layers have processed the input, the last layer outputs a vector of 768 numbers for the last
                token ("the"). This final vector is called the <strong style={{ color: C.green }}>hidden state</strong>.
              </T>
              <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
                <T color={C.bright} bold size={14}>
                  Hidden state for "the" (768 numbers):
                </T>
                <T color={C.green} size={14} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  [-0.14, 0.62, -0.38, 1.05, -0.72, 0.91, ..., 0.21]
                </T>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                It is called "hidden" because you never see it - it lives inside the model between layers. It is called
                a "state" because it represents the model's current understanding. These 768 numbers encode everything:
                the meaning of "the cat sat on the", the grammar, the context, and a prediction of what word should come
                next.
              </T>
            </div>
          </div>

          <T color="#80deea" style={{ marginTop: 10 }}>
            Now we have this hidden state - 768 numbers that encode the model's understanding. But we need a{" "}
            <strong>word</strong>, not 768 numbers. The vocabulary has 50,000 tokens. How do we go from 768 numbers to a
            prediction?
          </T>
        </Box>
      )}

      {/* ── Sub 1: What are logits? ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            From hidden state to scores: what is a logit?
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            We have the hidden state: 768 numbers. The model needs to decide which word comes next. There are 50,000
            words in the vocabulary. So the model computes a <strong>score</strong> for every single word. Higher score
            = "I think this word is more likely to come next".
          </T>

          <div style={{ marginTop: 14, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold size={15}>
              Example: scores for "The cat sat on the ___"
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>
              The model computes one score for each of its 50,000 vocabulary words:
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { w: "mat", s: 8.2, c: C.green },
                { w: "floor", s: 7.5, c: C.green },
                { w: "sofa", s: 6.1, c: C.green },
                { w: "the", s: 0.3, c: C.yellow },
                { w: "because", s: -3.7, c: C.red },
                { w: "photosynthesis", s: -8.9, c: C.red },
              ].map(({ w, s, c }) => (
                <div
                  key={w}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 10px",
                    borderRadius: 6,
                    background: `${c}06`,
                  }}
                >
                  <T color={c} bold size={14} style={{ minWidth: 110 }}>
                    "{w}"
                  </T>
                  <div
                    style={{
                      flex: 1,
                      height: 10,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(0, ((s + 10) / 20) * 100)}%`,
                        height: "100%",
                        background: c,
                        borderRadius: 4,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <T color={c} bold size={14} style={{ minWidth: 45, textAlign: "right", fontFamily: "monospace" }}>
                    {s >= 0 ? "+" : ""}
                    {s.toFixed(1)}
                  </T>
                </div>
              ))}
              <T color={C.dim} size={12} center style={{ marginTop: 2 }}>
                ...and 49,994 more words, each with a score
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold size={15}>
              These scores are called "logits"
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              That is all a logit is - <strong>the raw score the model gives to a word</strong>. Nothing more. The name
              comes from mathematics ("log-odds"), but for our purposes: logit = score. Note: "logit" is the name for
              the <strong>value</strong> that comes out - not the layer and not the neuron. The layer is called the
              "output projection" or "LM head." The logit is the number it produces.
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: C.green }} />
                <T color={C.dim} size={14}>
                  <strong style={{ color: C.green }}>Positive logit</strong> (+8.2) = the model thinks this word is a
                  good fit
                </T>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: C.yellow }} />
                <T color={C.dim} size={14}>
                  <strong style={{ color: C.yellow }}>Near-zero logit</strong> (+0.3) = the model has no strong opinion
                </T>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: C.red }} />
                <T color={C.dim} size={14}>
                  <strong style={{ color: C.red }}>Negative logit</strong> (-8.9) = the model thinks this word is a
                  terrible fit
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold size={15}>
              Logits are NOT probabilities
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Logits are raw numbers. They can be -100 or +100 or anything. They do not add up to 100%. They are not
              percentages. To turn them into actual probabilities (where everything adds to 100%), we need one more step
              called <strong>softmax</strong> - which we will see in a later step of this chapter.
            </T>
          </div>

          <T color="#ffcc80" style={{ marginTop: 12 }}>
            So the pipeline so far: hidden state (768 numbers) → <strong>???</strong> → 50,000 logits → softmax →
            probabilities. The missing piece: how does the model go from 768 numbers to 50,000 logits? That is what the{" "}
            <strong>unembedding layer</strong> does.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 2: NN diagram - hidden layers → hidden state → unembedding → vocab ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The Unembedding Layer: from 768 numbers to 50,000 scores
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            There is one more layer after all the hidden layers. It is called the <strong>unembedding layer</strong> (or
            output projection). Here is what the full pipeline looks like:
          </T>

          {/* NN Diagram - proper deep network: L1 neurons → L2 neurons → ... → Ln neurons (= hidden state) → W → output */}
          <div style={{ marginTop: 16, padding: "10px 0", overflowX: "auto" }}>
            {(() => {
              /* Layer x-centers: L1, L2, dots, Ln(=hidden state), W, Output */
              const XL1 = 50,
                XL2 = 130,
                XDOT = 200,
                XLN = 270,
                XW = 370,
                XOUT = 470;
              /* 3 neurons per layer */
              const ly = [65, 120, 175];
              /* Output column: 4 neurons */
              const ouy = [45, 95, 130, 195];
              const R = 16;
              return (
                <svg viewBox="0 0 540 260" style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
                  <desc>
                    Deep neural network output layer diagram showing hidden state neurons connected through an
                    unembedding weight matrix to vocabulary output neurons
                  </desc>

                  {/* === Edges (drawn first, behind nodes) === */}

                  {/* L1 → L2: fully connected */}
                  {ly.map((sy) =>
                    ly.map((dy) => (
                      <line
                        key={`l1${sy}l2${dy}`}
                        x1={XL1 + R + 2}
                        y1={sy}
                        x2={XL2 - R - 2}
                        y2={dy}
                        stroke={`${C.cyan}${Math.abs(sy - dy) < 10 ? "35" : "15"}`}
                        strokeWidth={1.5}
                      />
                    )),
                  )}

                  {/* L2 → dots (fading lines) */}
                  {ly.map((sy) =>
                    ly.map((dy) => (
                      <line
                        key={`l2${sy}dot${dy}`}
                        x1={XL2 + R + 2}
                        y1={sy}
                        x2={XDOT - 8}
                        y2={dy}
                        stroke={`${C.cyan}${Math.abs(sy - dy) < 10 ? "20" : "08"}`}
                        strokeWidth={1}
                        strokeDasharray="3,4"
                      />
                    )),
                  )}

                  {/* dots → Ln (fading lines) */}
                  {ly.map((sy) =>
                    ly.map((dy) => (
                      <line
                        key={`dot${sy}ln${dy}`}
                        x1={XDOT + 8}
                        y1={sy}
                        x2={XLN - R - 2}
                        y2={dy}
                        stroke={`${C.purple}${Math.abs(sy - dy) < 10 ? "20" : "08"}`}
                        strokeWidth={1}
                        strokeDasharray="3,4"
                      />
                    )),
                  )}

                  {/* Ln (hidden state) → Output (through unembedding) */}
                  {ly.map((sy) =>
                    ouy.map((dy) => (
                      <line
                        key={`ln${sy}out${dy}`}
                        x1={XLN + R + 2}
                        y1={sy}
                        x2={XOUT - R - 2}
                        y2={dy}
                        stroke={`${C.orange}${Math.abs(sy - dy) < 20 ? "20" : "08"}`}
                        strokeWidth={1}
                      />
                    )),
                  )}

                  {/* === Column labels === */}
                  <text x={XL1} y={18} fill={C.cyan} fontSize={10} textAnchor="middle" fontWeight={700}>
                    Layer 1
                  </text>
                  <text x={XL2} y={18} fill={C.cyan} fontSize={10} textAnchor="middle" fontWeight={700}>
                    Layer 2
                  </text>
                  <text x={XLN} y={10} fill={C.purple} fontSize={10} textAnchor="middle" fontWeight={700}>
                    Layer N
                  </text>
                  <text x={XLN} y={22} fill={C.purple} fontSize={8} textAnchor="middle" opacity="0.7">
                    (= Hidden State)
                  </text>
                  <text x={XW} y={18} fill="#ffcc80" fontSize={10} textAnchor="middle" fontWeight={700}>
                    Unembedding
                  </text>
                  <text x={XOUT} y={18} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle" fontWeight={600}>
                    Output
                  </text>
                  <text x={XOUT} y={248} fill="rgba(255,255,255,0.25)" fontSize={8} textAnchor="middle">
                    (50K logits)
                  </text>

                  {/* === Dashed box around Ln to highlight it as hidden state === */}
                  <rect
                    x={XLN - 24}
                    y={40}
                    width={48}
                    height={160}
                    fill="none"
                    stroke={`${C.purple}30`}
                    strokeWidth={1.5}
                    strokeDasharray="5,5"
                    rx={8}
                  />

                  {/* === Unembedding W matrix box === */}
                  <rect
                    x={XW - 26}
                    y={35}
                    width={52}
                    height={175}
                    rx={10}
                    fill="rgba(255,171,64,0.12)"
                    stroke="#ffcc80"
                    strokeWidth={2}
                  />
                  <text
                    x={XW}
                    y={133}
                    fill="#ffcc80"
                    fontSize={16}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    W
                  </text>

                  {/* === Layer 1 neurons === */}
                  {ly.map((y, i) => (
                    <g key={`l1n${i}`}>
                      <circle cx={XL1} cy={y} r={R} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                      <text x={XL1} y={y + 4} fill={C.cyan} fontSize={10} fontWeight={700} textAnchor="middle">
                        {["n\u2081", "n\u2082", "n\u2083"][i]}
                      </text>
                    </g>
                  ))}

                  {/* === Layer 2 neurons === */}
                  {ly.map((y, i) => (
                    <g key={`l2n${i}`}>
                      <circle cx={XL2} cy={y} r={R} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                      <text x={XL2} y={y + 4} fill={C.cyan} fontSize={10} fontWeight={700} textAnchor="middle">
                        {["n\u2081", "n\u2082", "n\u2083"][i]}
                      </text>
                    </g>
                  ))}

                  {/* === Dots column (just 3 dots) === */}
                  {ly.map((y, i) => (
                    <text
                      key={`dot${i}`}
                      x={XDOT}
                      y={y + 4}
                      fill="rgba(255,255,255,0.35)"
                      fontSize={16}
                      fontWeight={700}
                      textAnchor="middle"
                    >
                      ...
                    </text>
                  ))}

                  {/* === Layer N neurons (= hidden state) === */}
                  {ly.map((y, i) => (
                    <g key={`lnn${i}`}>
                      <circle cx={XLN} cy={y} r={R} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
                      <text x={XLN} y={y + 4} fill="#b8a9ff" fontSize={10} fontWeight={700} textAnchor="middle">
                        {["h\u2081", "h\u2082", "h\u2087\u2086\u2088"][i]}
                      </text>
                    </g>
                  ))}

                  {/* === Output neurons === */}
                  {[
                    { y: ouy[0], l: "the", a: false },
                    { y: ouy[1], l: "mat", a: true },
                    { y: ouy[2], l: "...", a: false },
                    { y: ouy[3], l: "dog", a: false },
                  ].map(({ y, l, a }) => (
                    <g key={`out${l}`}>
                      <circle
                        cx={XOUT}
                        cy={y}
                        r={R}
                        fill={a ? `${C.green}25` : `${C.green}08`}
                        stroke={a ? C.green : `${C.green}40`}
                        strokeWidth={2}
                      />
                      <text
                        x={XOUT}
                        y={y + 4}
                        fill={a ? C.green : "#80e8a5"}
                        fontSize={10}
                        fontWeight={700}
                        textAnchor="middle"
                      >
                        {l}
                      </text>
                    </g>
                  ))}

                  {/* Bottom label */}
                  <text x={270} y={250} fill="rgba(255,255,255,0.3)" fontSize={10} textAnchor="middle">
                    each layer has 768 neurons - only 3 shown for clarity
                  </text>
                </svg>
              );
            })()}
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            The hidden state (768 numbers) gets multiplied by the <strong>unembedding matrix</strong> (768 x 50,000).
            The result: one logit for every word in the vocabulary.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 3: How the unembedding matrix works - concrete dot product ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            How does it actually work? One dot product per word
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            The unembedding matrix has 50,000 rows. Each row is a 768-dimensional vector that represents one vocabulary
            word. To get the logit for a word, we take the dot product of the hidden state with that word's row.
          </T>

          <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color="#ffcc80" bold center size={15}>
              Example: computing the logit for "mat"
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <T color={C.mid} size={14}>
                Hidden state (768 values): [-0.14, 0.62, -0.38, 1.05, ...]
              </T>
              <T color={C.mid} size={14}>
                Row for "mat" in unembedding matrix: [0.45, 0.82, -0.21, 0.67, ...]
              </T>
              <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                <T color="#ffcc80" size={14}>
                  logit = dot product = (-0.14 x 0.45) + (0.62 x 0.82) + (-0.38 x -0.21) + (1.05 x 0.67) + ...
                </T>
                <T color="#ffcc80" size={14} style={{ marginTop: 4 }}>
                  = -0.063 + 0.508 + 0.080 + 0.704 + ... (768 terms added up)
                </T>
                <T color={C.green} bold size={16} center style={{ marginTop: 6 }}>
                  logit for "mat" = 8.2
                </T>
              </div>
            </div>
          </div>

          <T color="#ffcc80" style={{ marginTop: 10 }}>
            This happens for ALL 50,000 words in parallel. Each word has its own row, its own dot product, its own
            logit. Words whose rows are "similar" to the hidden state get high scores. Words whose rows point in a
            different direction get low scores.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 4: Raw logits for sample tokens ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The result: logits for every word in the vocabulary
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            After computing all 50,000 dot products for "The cat sat on the", we get raw scores (logits):
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { token: "mat", logit: 8.2, color: C.green },
              { token: "floor", logit: 7.5, color: C.green },
              { token: "sofa", logit: 6.1, color: C.green },
              { token: "table", logit: 5.8, color: C.yellow },
              { token: "bed", logit: 5.2, color: C.yellow },
              { token: "she", logit: -1.4, color: C.red },
              { token: "because", logit: -3.7, color: C.red },
              { token: "photosynthesis", logit: -8.9, color: C.red },
            ].map(({ token, logit, color }) => (
              <div
                key={token}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                }}
              >
                <T color={color} bold size={14} style={{ minWidth: 110 }}>
                  {token}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, ((logit + 10) / 20) * 100)}%`,
                      height: "100%",
                      background: color,
                      borderRadius: 4,
                      opacity: 0.6,
                    }}
                  />
                </div>
                <T color={color} bold size={14} style={{ minWidth: 45, textAlign: "right", fontFamily: "monospace" }}>
                  {logit >= 0 ? "+" : ""}
                  {logit.toFixed(1)}
                </T>
              </div>
            ))}
            <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
              ...plus 49,992 more tokens with their own scores
            </T>
          </div>

          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            These are just raw numbers - they can be negative, large, or small. They are not probabilities yet. We need
            softmax to convert them.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 5: Softmax conversion ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Softmax: from raw logits to probability distribution
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Softmax does two things: makes every number positive (using e^score), then divides by the total so
            everything adds up to 100%.
          </T>

          <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color="#ffe082" bold center size={15}>
              Worked example for the top 5 tokens:
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { token: "mat", logit: 8.2, exp: 3641, prob: 56.8 },
                { token: "floor", logit: 7.5, exp: 1808, prob: 28.2 },
                { token: "sofa", logit: 6.1, exp: 446, prob: 7.0 },
                { token: "table", logit: 5.8, exp: 330, prob: 5.2 },
                { token: "bed", logit: 5.2, exp: 181, prob: 2.8 },
              ].map(({ token, logit, exp, prob }) => (
                <div
                  key={token}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: `${C.yellow}06`,
                  }}
                >
                  <T color="#ffe082" bold size={13} style={{ minWidth: 55 }}>
                    {token}
                  </T>
                  <T color={C.dim} size={13}>
                    logit={logit.toFixed(1)}
                  </T>
                  <T color={C.dim} size={13}>
                    → e^{logit.toFixed(1)} = {exp}
                  </T>
                  <T color={C.dim} size={13}>
                    →
                  </T>
                  <T color="#ffe082" bold size={13}>
                    {prob}%
                  </T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 8 }}>
              probability = e^logit / sum of ALL e^logits across 50,000 tokens
            </T>
          </div>

          <T color="#ffe082" style={{ marginTop: 10 }}>
            The model predicts "mat" with 56.8% confidence. This is the final output - a probability distribution over
            the entire vocabulary. During training, we compare this to the actual next word and compute the loss.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 6: Why one linear layer works + parameter count ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Why does one simple layer work? The hidden layers did the hard part
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            The output layer is just a matrix multiply - no activation function, no non-linearity. It seems too simple.
            But the hidden layers already did all the hard work.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                layer: "All hidden layers (many layers deep)",
                job: "Understand context, grammar, meaning. Encode 'what should come next' into the 768-dim hidden state.",
                params: "billions of parameters",
                color: C.cyan,
              },
              {
                layer: "Output layer (1 matrix)",
                job: "Translate the hidden state into a logit for each vocabulary word. Just one dot product per word.",
                params: "768 x 50K = 38.4M parameters",
                color: C.orange,
              },
            ].map(({ layer, job, params, color }) => (
              <div
                key={layer}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold size={15}>
                  {layer}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  {job}
                </T>
                <T color={color} size={13} style={{ marginTop: 4 }}>
                  parameter count: {params}
                </T>
              </div>
            ))}
          </div>

          <T color="#80e8a5" style={{ marginTop: 10 }}>
            The output layer has less than 0.02% of the total parameters. It is tiny. All the intelligence lives in the
            hidden layers.
          </T>
        </Box>
      </Reveal>

      {/* ── Sub 7: Weight tying with visual similarity example ── */}
      <Reveal when={sub >= 7}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            The clever trick: weight tying
          </T>
          <T color="#5eb3ff" style={{ marginTop: 6 }}>
            Remember the embedding layer from chapter 5.1? It converts tokens to vectors. The embedding matrix has shape
            50,000 x 768 - one 768-dim row per word.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color="#80deea" bold size={15}>
                Embedding matrix (input side)
              </T>
              <T color={C.mid} size={14} style={{ marginTop: 4 }}>
                Shape: 50,000 x 768. Converts word → vector.
              </T>
              <T color={C.mid} size={14}>
                Row for "mat" = [0.45, 0.82, -0.21, 0.67, ...]
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color="#ffcc80" bold size={15}>
                Unembedding matrix (output side)
              </T>
              <T color={C.mid} size={14} style={{ marginTop: 4 }}>
                Shape: 768 x 50,000. Converts hidden state → one logit per word.
              </T>
              <T color={C.mid} size={14}>
                This is just the embedding matrix <strong>transposed</strong>!
              </T>
            </div>
          </div>

          <T color="#5eb3ff" style={{ marginTop: 10 }}>
            This is called <strong>weight tying</strong>. The same matrix is used for both embedding and unembedding
            (just transposed). The model only needs to learn one set of word vectors, not two.
          </T>

          {/* Visual: why weight tying works */}
          <div style={{ marginTop: 14, padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              Why does this work? A visual example
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 8 }}>
              Imagine the hidden state encodes: "something you sit on, on the floor". During embedding, similar words
              were placed near each other in the 768-dim space:
            </T>

            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { w: "mat", v: "[0.45, 0.82, -0.21, ...]", sim: 0.92, c: C.green },
                { w: "rug", v: "[0.43, 0.79, -0.19, ...]", sim: 0.89, c: C.green },
                { w: "carpet", v: "[0.41, 0.80, -0.23, ...]", sim: 0.87, c: C.green },
                { w: "table", v: "[0.30, 0.55, 0.12, ...]", sim: 0.58, c: C.yellow },
                { w: "sky", v: "[-0.60, 0.10, 0.85, ...]", sim: 0.05, c: C.red },
              ].map(({ w, v, sim, c }) => (
                <div
                  key={w}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${c}06`,
                  }}
                >
                  <T color={c} bold size={14} style={{ minWidth: 60 }}>
                    "{w}"
                  </T>
                  <T color={C.dim} size={12} style={{ flex: 1, fontFamily: "monospace" }}>
                    {v}
                  </T>
                  <div
                    style={{
                      width: 60,
                      height: 8,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{ width: `${sim * 100}%`, height: "100%", background: c, borderRadius: 4, opacity: 0.7 }}
                    />
                  </div>
                  <T color={c} bold size={13} style={{ minWidth: 35 }}>
                    {(sim * 100).toFixed(0)}%
                  </T>
                </div>
              ))}
            </div>

            <T color={C.dim} size={14} style={{ marginTop: 10 }}>
              The dot product between the hidden state and each word's embedding measures similarity. "mat", "rug", and
              "carpet" have embeddings pointing in a similar direction to the hidden state, so their dot products
              (logits) are high. "sky" points in a completely different direction, so its logit is near zero.
            </T>
            <T color="#5eb3ff" size={14} style={{ marginTop: 6 }}>
              Weight tying enforces this: if "mat" and "rug" were learned as similar meanings at input, they will
              automatically get similar logits at output. The model only learns one definition per word, and it works in
              both directions.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 7 && (
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
