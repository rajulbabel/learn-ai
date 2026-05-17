import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function TransformerArrives(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            2017: "Attention Is All You Need"
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The Transformer paper introduced a completely different architecture: drop RNN, drop CNN, use only
            attention.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Core insight: every word should be able to directly attend to (look at) every other word, simultaneously, in
            parallel.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Side-by-side: RNN vs Transformer
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Processing "I love cats":
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}15`,
              }}
            >
              <T color={C.red} bold center size={16}>
                RNN
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {["I", "love", "cats"].map((w, i) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <T color={C.dim} size={12} style={{ minWidth: 24 }}>
                      Step {i + 1}:
                    </T>
                    <div
                      style={{
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: `${C.red}15`,
                        fontSize: 12,
                        color: C.red,
                        fontWeight: 600,
                      }}
                    >
                      {i === 0 ? "Processing" : "⏳"}
                    </div>
                    <T color={C.dim} size={12}>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={12} style={{ marginTop: 8, textAlign: "center" }}>
                Sequential
              </T>
              <T color={C.dim} size={12} style={{ textAlign: "center" }}>
                1 GPU core active
              </T>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Transformer
              </T>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {["I", "love", "cats"].map((w) => (
                  <div
                    key={w}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: `${C.green}15`,
                      fontSize: 12,
                      color: C.green,
                      fontWeight: 600,
                    }}
                  >
                    {w}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {["I", "love", "cats"].map((from) => (
                  <div key={from} style={{ position: "relative", width: 24, height: 24 }}>
                    {["I", "love", "cats"].map((to, i) => {
                      const opacity = from === to ? 0.5 : from === "love" && to !== "love" ? 0.6 : 0.2;
                      return (
                        <div
                          key={`${from}-${to}`}
                          style={{
                            position: "absolute",
                            top: i * 8,
                            left: 12,
                            width: 2,
                            height: 2,
                            background: C.green,
                            borderRadius: "50%",
                            opacity,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <T color={C.dim} size={11} style={{ marginTop: 6, textAlign: "center" }}>
                All attend to all
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 2, textAlign: "center" }}>
                (arrows show attention)
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 2, textAlign: "center" }}>
                All GPU cores active
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            How attention works: the core idea
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Each word (Query) compares itself to every word (Keys) and asks "how relevant are you?" The answers
            (attention scores) weight the values (word meanings) to produce a context-aware representation.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "love", k1: "I", score: 0.1, why: "less relevant" },
              { q: "love", k2: "love", score: 0.8, why: "self - very relevant" },
              { q: "love", k3: "cats", score: 0.5, why: "object - moderately relevant" },
            ].map((item) => (
              <div
                key={`${item.q}-${item.k1}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 60px 60px 80px 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "6px 8px",
                  borderRadius: 4,
                  background: `${C.purple}08`,
                  border: `1px solid ${C.purple}12`,
                }}
              >
                <T color={C.blue} bold size={12}>
                  Q:{item.q}
                </T>
                <T color={C.orange} bold size={12}>
                  K:{item.k2}
                </T>
                <T color={C.yellow} bold size={12}>
                  Score:
                </T>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{ width: `${item.score * 100}%`, height: "100%", background: C.yellow, borderRadius: 2 }}
                    />
                  </div>
                  <T color={C.yellow} bold size={12} style={{ minWidth: 24 }}>
                    {item.score.toFixed(1)}
                  </T>
                </div>
                <T color={C.dim} size={12}>
                  {item.why}
                </T>
              </div>
            ))}
          </div>

          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            <strong>Key difference from RNN:</strong> this happens all at once for all words and all positions. No
            sequential dependency. Full parallelization.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Speed comparison: concrete numbers
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Processing a 1000-word document with timestep 1ms per word:
          </T>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { arch: "RNN", total: "1000 ms", cores: "1 / 1000", reason: "1000 sequential steps × 1ms" },
              { arch: "Transformer", total: "1 ms", cores: "1000 / 1000", reason: "All 1000 words parallel" },
            ].map((item) => (
              <div
                key={item.arch}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${item.arch === "RNN" ? C.red : C.green}06`,
                  border: `1px solid ${item.arch === "RNN" ? C.red : C.green}15`,
                }}
              >
                <T color={item.arch === "RNN" ? C.red : C.green} bold center size={14}>
                  {item.arch}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  Total time: <strong style={{ color: item.arch === "RNN" ? C.red : C.green }}>{item.total}</strong>
                </T>
                <T color={C.dim} size={12}>
                  GPU: {item.cores} cores
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  {item.reason}
                </T>
              </div>
            ))}
          </div>

          <T color="#ffe082" style={{ marginTop: 10 }}>
            <strong>1000× faster</strong> for long sequences. This is why Transformers enable training on massive
            datasets.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            No more vanishing gradient
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            In attention, information flows directly from every word to every other word. No sequential multiplication
            of gradients. The model can learn dependencies over 500+ words without gradient degradation.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>
            This solves the RNN fundamental problem: long-distance dependencies are now as easy to learn as short ones.
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
