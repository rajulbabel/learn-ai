import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function BatchNormVsLayerNorm(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Batch Normalization */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Batch Normalization (Ioffe & Szegedy, 2015)
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 6 }}>
            Batch Norm normalizes across the <strong>batch dimension</strong>. Given a batch of examples, for each
            feature, compute the mean and variance <strong>across all examples in the batch</strong>.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <T color="#80deea" bold center size={16}>
              Batch of 4 examples, each with 3 features:
            </T>

            {/* Grid visualization */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {/* Column headers */}
              <div style={{ display: "flex", gap: 0, marginLeft: 70 }}>
                {["Feature 1", "Feature 2", "Feature 3"].map((f, ci) => (
                  <div key={f} style={{ width: 80, textAlign: "center" }}>
                    <T color={ci === 1 ? C.yellow : C.dim} bold={ci === 1} size={11}>
                      {f}
                    </T>
                  </div>
                ))}
              </div>
              {/* Grid rows */}
              {[
                { label: "Example 1", vals: [0.5, 1.2, -0.3] },
                { label: "Example 2", vals: [0.8, 0.9, 0.1] },
                { label: "Example 3", vals: [0.3, 1.5, -0.5] },
                { label: "Example 4", vals: [0.6, 0.6, 0.2] },
              ].map(({ label, vals }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <T color={C.dim} size={11} style={{ minWidth: 70, textAlign: "right", paddingRight: 6 }}>
                    {label}
                  </T>
                  {vals.map((v, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 80,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: ci === 1 ? `${C.yellow}18` : `${C.cyan}06`,
                        border: ci === 1 ? `2px solid ${C.yellow}50` : `1px solid ${C.cyan}12`,
                      }}
                    >
                      <code
                        style={{ color: ci === 1 ? C.yellow : C.dim, fontSize: 13, fontWeight: ci === 1 ? 700 : 400 }}
                      >
                        {v.toFixed(1)}
                      </code>
                    </div>
                  ))}
                </div>
              ))}
              {/* Batch Norm annotation */}
              <div style={{ marginLeft: 70, display: "flex", gap: 0 }}>
                {[0, 1, 2].map((ci) => (
                  <div key={ci} style={{ width: 80, textAlign: "center", paddingTop: 4 }}>
                    {ci === 1 && (
                      <T color={C.yellow} bold size={11}>
                        ↑ Normalize this column ↑
                      </T>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <T color="#80deea" size={14} center style={{ marginTop: 10 }}>
              Batch Norm picks one feature (one column) and computes the mean and variance{" "}
              <strong>across the 4 examples</strong>. For Feature 2: mean = (1.2 + 0.9 + 1.5 + 0.6) / 4 ={" "}
              <strong>1.05</strong>. Then it normalizes each example's value for that feature.
            </T>
          </div>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: Why BN works for CNNs */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            Why Batch Norm Works for Images and CNNs
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 6 }}>
            In a CNN processing images, batch normalization works beautifully. Here's why:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                reason: "Shared statistics",
                detail:
                  'Images in a batch share similar structure. The feature "edge detector at position (3,5)" has a meaningful distribution across a batch of cat photos - they all have edges in roughly similar places.',
                color: C.green,
              },
              {
                reason: "Fixed input size",
                detail:
                  "Images are always the same dimensions (e.g., 224x224). Position (3,5) means the same thing in every image. Computing statistics across the batch at that position makes sense.",
                color: C.blue,
              },
              {
                reason: "Training speedup",
                detail:
                  "BN reduced internal covariate shift (layer inputs changing distribution during training), letting CNNs train 10-14x faster. It also acted as a mild regularizer.",
                color: C.orange,
              },
            ].map(({ reason, detail, color }) => (
              <div
                key={reason}
                style={{ padding: 12, borderRadius: 8, background: `${color}06`, border: `1px solid ${color}15` }}
              >
                <T color={color} bold size={15}>
                  {reason}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  {detail}
                </T>
              </div>
            ))}
          </div>

          <T color="#fff176" size={15} style={{ marginTop: 10 }}>
            Batch Norm revolutionized CNN training when it was introduced in 2015. It made training deep image models
            much faster and more stable. But language is a fundamentally different domain...
          </T>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: Why BN fails for language */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Why Batch Norm Fails for Language
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>
            Three fundamental problems make Batch Norm a poor fit for text:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}15` }}>
              <T color={C.red} bold size={15}>
                1. Variable Sequence Lengths
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Sentences have different lengths. In a batch of 4 sentences:
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { s: '"I love cats"', len: 3 },
                  { s: '"The cat sat on the mat last week"', len: 8 },
                  { s: '"Hello"', len: 1 },
                  { s: '"Deep learning is fascinating"', len: 4 },
                ].map(({ s, len }) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.red}06`,
                    }}
                  >
                    <T color={C.dim} size={12}>
                      {s}
                    </T>
                    <Tag color={C.red}>{len} tokens</Tag>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                What is "position 5" across this batch? Only one sentence even has a position 5. Normalizing across the
                batch at position 5 is meaningless - there's nothing to compare.
              </T>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}15` }}
            >
              <T color={C.orange} bold size={15}>
                2. Batch Size 1 at Inference
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                When you chat with an LLM, your prompt is batch size 1. There's no batch to compute statistics over.
                Batch Norm must fall back to running averages stored from training - a fragile approximation that can
                drift from the true distribution.
              </T>
            </div>

            <div
              style={{ padding: 12, borderRadius: 8, background: `${C.yellow}06`, border: `1px solid ${C.yellow}15` }}
            >
              <T color={C.yellow} bold size={15}>
                3. Tokens Are Fundamentally Different
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Normalizing feature 42 across "the", "cat", "sat", and "love" from different sentences treats them as
                comparable. But they're completely different words with different roles. Unlike pixels at the same
                position in different images, tokens at position 3 across different sentences share nothing
                semantically.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: Layer Normalization */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            Layer Normalization (Ba et al., 2016)
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            Layer Norm normalizes across the <strong>feature dimension</strong>. For each token independently, compute
            the mean and variance across <strong>its own features</strong>.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color="#a5d6a7" bold center size={16}>
              Same 4x3 grid, different dimension:
            </T>

            {/* Grid visualization */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {/* Column headers */}
              <div style={{ display: "flex", gap: 0, marginLeft: 70 }}>
                {["Feature 1", "Feature 2", "Feature 3"].map((f) => (
                  <div key={f} style={{ width: 80, textAlign: "center" }}>
                    <T color={C.dim} size={11}>
                      {f}
                    </T>
                  </div>
                ))}
              </div>
              {/* Grid rows */}
              {[
                { label: "Example 1", vals: [0.5, 1.2, -0.3], highlight: false },
                { label: "Example 2", vals: [0.8, 0.9, 0.1], highlight: true },
                { label: "Example 3", vals: [0.3, 1.5, -0.5], highlight: false },
                { label: "Example 4", vals: [0.6, 0.6, 0.2], highlight: false },
              ].map(({ label, vals, highlight }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <T
                    color={highlight ? C.green : C.dim}
                    bold={highlight}
                    size={11}
                    style={{ minWidth: 70, textAlign: "right", paddingRight: 6 }}
                  >
                    {label}
                  </T>
                  {vals.map((v, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 80,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: highlight ? `${C.green}18` : `${C.cyan}06`,
                        border: highlight ? `2px solid ${C.green}50` : `1px solid ${C.cyan}12`,
                      }}
                    >
                      <code
                        style={{ color: highlight ? C.green : C.dim, fontSize: 13, fontWeight: highlight ? 700 : 400 }}
                      >
                        {v.toFixed(1)}
                      </code>
                    </div>
                  ))}
                </div>
              ))}
              {/* Layer Norm annotation */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <T color={C.green} bold size={11} style={{ minWidth: 70, textAlign: "right", paddingRight: 6 }}></T>
                <div style={{ width: 240, textAlign: "center" }}>
                  <T color={C.green} bold size={11}>
                    ← Normalize this row →
                  </T>
                </div>
              </div>
            </div>

            <T color="#a5d6a7" size={14} center style={{ marginTop: 10 }}>
              Layer Norm picks one example (one row) and computes mean and variance{" "}
              <strong>across its 3 features</strong>. For Example 2: mean = (0.8 + 0.9 + 0.1) / 3 ={" "}
              <strong>0.60</strong>. Each token normalizes itself independently.
            </T>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              {
                point: "No batch dependency",
                detail: "Each token normalizes using only its own features. Works with batch size 1.",
                color: C.green,
              },
              {
                point: "Any sequence length",
                detail: "Token 5 normalizes itself the same way whether the sentence has 5 or 500 tokens.",
                color: C.green,
              },
              {
                point: "Semantically meaningful",
                detail:
                  "Normalizing across a single token's features rescales its representation without mixing different words' statistics.",
                color: C.green,
              },
            ].map(({ point, detail, color }) => (
              <div
                key={point}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "flex-start",
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: `${color}06`,
                }}
              >
                <span style={{ color, fontSize: 10, marginTop: 4 }}>&#9679;</span>
                <T color={C.dim} size={13}>
                  <strong style={{ color }}>{point}:</strong> {detail}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Side-by-side summary */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The Key Difference - Which Dimension?
          </T>

          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 14,
                borderRadius: 10,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}20`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                Batch Norm
              </T>
              <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.yellow}08` }}>
                <T color={C.yellow} center size={13}>
                  Normalizes <strong>down columns</strong>
                </T>
                <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                  (across examples in the batch)
                </T>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[0, 1, 2, 3].map((r) => (
                      <div key={r} style={{ display: "flex", gap: 1 }}>
                        {[0, 1, 2].map((c) => (
                          <div
                            key={c}
                            style={{
                              width: 24,
                              height: 18,
                              background: c === 1 ? `${C.yellow}40` : `${C.dim}15`,
                              borderRadius: 2,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <T color={C.dim} center size={11} style={{ marginTop: 6 }}>
                  highlighted column = one BN operation
                </T>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                <T color={C.dim} size={12}>
                  Needs a batch of examples
                </T>
                <T color={C.dim} size={12}>
                  Used in CNNs (image models)
                </T>
                <T color={C.dim} size={12}>
                  Fragile at batch size 1
                </T>
              </div>
            </div>

            <div
              style={{
                flex: "1 1 200px",
                padding: 14,
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Layer Norm
              </T>
              <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.green}08` }}>
                <T color={C.green} center size={13}>
                  Normalizes <strong>across rows</strong>
                </T>
                <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                  (across features of one token)
                </T>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[0, 1, 2, 3].map((r) => (
                      <div key={r} style={{ display: "flex", gap: 1 }}>
                        {[0, 1, 2].map((c) => (
                          <div
                            key={c}
                            style={{
                              width: 24,
                              height: 18,
                              background: r === 1 ? `${C.green}40` : `${C.dim}15`,
                              borderRadius: 2,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <T color={C.dim} center size={11} style={{ marginTop: 6 }}>
                  highlighted row = one LN operation
                </T>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                <T color={C.dim} size={12}>
                  Independent per token
                </T>
                <T color={C.dim} size={12}>
                  Used in Transformers (LLMs)
                </T>
                <T color={C.dim} size={12}>
                  Works with any batch size
                </T>
              </div>
            </div>
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
              The Key Insight
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              Layer Norm treats each token as its own universe. Its mean and variance depend only on that token's own
              feature values - not on what other sentences happen to be in the same batch, not on how long other
              sequences are, and not on what other tokens exist. This independence is exactly what Transformers need:
              each token's normalization should be a property of that token alone.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
