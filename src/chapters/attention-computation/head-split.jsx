import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function HeadSplit(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const headColors = [C.cyan, C.orange, C.purple, C.yellow, C.green, C.pink, C.red, C.blue];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The problem recap */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            One head = one Query arrow = one direction.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Each word's 512-dim embedding produces ONE Query vector through W_Q. That single arrow can only point one
            way, so it can only ask one type of question.
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.dim} size={16}>
              512-dim embedding → W_Q (512×512) → One 512-dim Query
            </T>
            <T color={C.red} bold center size={16} style={{ marginTop: 4 }}>
              One arrow. One question. Information lost.
            </T>
          </div>
          <T color="#ff8a80" style={{ marginTop: 8 }}>
            Solution: don't make one big arrow. Make <strong>8 smaller arrows</strong>, each pointing in its own
            direction.
          </T>
        </Box>
      )}

      {/* Sub 1: The visual split */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Split the 512 dimensions into 8 chunks of 64.
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 4 }}>
            Imagine the embedding as a long bar. We slice it into 8 equal pieces:
          </T>
          {/* Full 512-dim bar */}
          <div style={{ marginTop: 12, padding: "0 4px" }}>
            <T color={C.dim} size={12} center>
              512 dimensions
            </T>
            <div
              style={{
                height: 28,
                borderRadius: 6,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              {headColors.map((c, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: `${c}25`,
                    borderRight: i < 7 ? "2px solid rgba(0,0,0,0.5)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: c }}>H{i + 1}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: 2 }}>
              {headColors.map((c, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ fontSize: 9, color: C.dim }}>64</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            {[
              { l: "Total dimensions:", v: "512" },
              { l: "Number of heads:", v: "8" },
              { l: "Dims per head:", v: "512 / 8 = 64" },
            ].map(({ l, v }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <T color={C.mid} size={16}>
                  {l}
                </T>
                <T color={C.yellow} bold size={18}>
                  {v}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
            We don't run the full 512-dim attention 8 times. We split it - same total computation, but 8 independent
            perspectives.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Why the split works - cost vs quality */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            But wait - doesn't splitting lose precision?
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
            Why not give each head the full 512 dims? Let's compare:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Option A: 8 x 512 */}
            <div style={{ padding: "10px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>
                Option A: 8 heads × 512 dims each
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 20,
                      borderRadius: 3,
                      background: `${C.red}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 8, color: C.red }}>512</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Cost: 8 × 512 = <strong style={{ color: C.red }}>4,096 dims total</strong> (8x the compute!)
              </T>
              <T color={C.dim} size={14}>
                Quality per head: very high, but diminishing returns past ~64 dims
              </T>
            </div>
            {/* Option B: 8 x 64 (the split) */}
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}
            >
              <T color={C.green} bold size={16}>
                Option B: 8 heads × 64 dims each (the split)
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {headColors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 20,
                      borderRadius: 3,
                      background: `${c}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 8, color: c }}>64</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Cost: 8 × 64 = <strong style={{ color: C.green }}>512 dims total</strong> (same budget as one head!)
              </T>
              <T color={C.dim} size={14}>
                Quality per head: 64 dims is plenty - "is this the subject?" doesn't need 512 numbers to answer
              </T>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.yellow} bold center size={16}>
              The insight: more dims per head = diminishing returns.
            </T>
            <T color={C.dim} size={14} center style={{ marginTop: 2 }}>
              Going from 64 to 512 dims per head barely improves quality, but costs 8x more. The split gives you 8
              different perspectives for the price of 1 large one.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: Each chunk gets its own W matrices */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Each head gets its own W_Q, W_K, W_V.
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 4 }}>
            8 heads = 8 independent sets of weight matrices. Each set is smaller (512×64 instead of 512×512):
          </T>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const c = headColors[n - 1];
              return (
                <div
                  key={n}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${c}08`,
                    border: `1px solid ${c}15`,
                    minWidth: 80,
                    textAlign: "center",
                  }}
                >
                  <T color={c} bold center size={14}>
                    Head {n}
                  </T>
                  <div style={{ marginTop: 2 }}>
                    <T color={C.dim} size={10}>
                      W_Q W_K W_V
                    </T>
                    <T color={C.dim} size={9}>
                      512×64 each
                    </T>
                  </div>
                </div>
              );
            })}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10 }}>
            Same embedding goes into all 8 heads. Each head's different W matrices produce a different Query arrow -
            pointing in a different direction, asking a different question.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: 8 heads, 8 different questions */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            8 arrows, 8 questions, nothing lost.
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
            "sat" in "The cat sat on the mat last week" - each head's Query arrow points differently:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { h: 1, q: "who did the action?", finds: "cat", pct: 70, c: C.cyan },
              { h: 2, q: "where?", finds: "mat", pct: 65, c: C.orange },
              { h: 3, q: "when?", finds: "week", pct: 55, c: C.purple },
              { h: 4, q: "what comes next?", finds: "on", pct: 60, c: C.yellow },
            ].map(({ h, q, finds, pct, c }) => (
              <div
                key={h}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 70px",
                  gap: 6,
                  alignItems: "center",
                  padding: "5px 8px",
                  borderRadius: 5,
                  background: `${c}06`,
                  border: `1px solid ${c}10`,
                }}
              >
                <T color={c} bold center size={14}>
                  Head {h}
                </T>
                <div>
                  <T color={C.dim} size={13}>
                    asks: "{q}"
                  </T>
                  <div
                    style={{
                      height: 5,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 3,
                      overflow: "hidden",
                      marginTop: 2,
                    }}
                  >
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: c }} />
                  </div>
                </div>
                <T color={c} bold size={13} style={{ textAlign: "right" }}>
                  → {finds} {pct}%
                </T>
              </div>
            ))}
            <T color={C.dim} size={12} center>
              ...and heads 5-8 ask about grammar, coreference, proximity, etc.
            </T>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 8 }}>
            Each head specializes. Together they capture everything - no information lost.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Layers stacking - the big picture */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Now zoom out: layers.
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 4 }}>
            A Transformer doesn't have just one set of 8 heads. It stacks multiple layers, each with its own 8 heads:
          </T>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
            }}
          >
            {[
              { layer: "Layer 96", desc: "reasoning, generation", opacity: 1.0 },
              { layer: "...", desc: "", opacity: 0.4 },
              { layer: "Layer 3", desc: "meaning, sentiment", opacity: 0.7 },
              { layer: "Layer 2", desc: "syntax, clause structure", opacity: 0.8 },
              { layer: "Layer 1", desc: "word proximity, basic grammar", opacity: 0.9 },
            ].map(({ layer, desc, opacity }) => (
              <div key={layer} style={{ display: "flex", alignItems: "center", gap: 6, opacity }}>
                <T color={C.green} bold size={14} style={{ minWidth: 65 }}>
                  {layer}
                </T>
                <div style={{ display: "flex", gap: 2, flex: 1 }}>
                  {layer === "..." ? (
                    <T color={C.dim} size={14}>
                      ...
                    </T>
                  ) : (
                    headColors.map((c, i) => (
                      <div key={i} style={{ flex: 1, height: 14, borderRadius: 3, background: `${c}30` }} />
                    ))
                  )}
                </div>
                {desc && (
                  <T color={C.dim} size={11} style={{ minWidth: 80 }}>
                    {desc}
                  </T>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.green} bold center size={18}>
              96 layers × 8 heads = 768 attention patterns
            </T>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
              Each layer reads the previous layer's output. Early layers see raw words. Later layers see increasingly
              abstract, context-rich representations.
            </T>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
            Nobody told the model which layer should handle grammar or reasoning. It organized itself this way during
            training.
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
