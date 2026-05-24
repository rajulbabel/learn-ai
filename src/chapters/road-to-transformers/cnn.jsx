import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function CNN(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Convolutional Neural Networks (CNN)
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Built for images. A small rectangular "filter" (like a magnifying glass) slides across the entire image,
            spotting patterns at each position.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The key insight: <strong>local patterns matter.</strong> A corner of a cat's ear is detected the same way
            everywhere in the image.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            How a convolution works: step by step
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Let's convolve a 5×5 image with a 3×3 filter. The filter slides left-to-right, top-to-bottom, and at each
            position we multiply and sum.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            {/* Image and filter side by side, centered */}
            <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <T color={C.cyan} bold center size={15} style={{ marginBottom: 8 }}>
                  5×5 Image (pixel values)
                </T>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 40px)", gap: 3 }}>
                  {[
                    [1, 0, 2, 1, 0],
                    [0, 2, 1, 0, 1],
                    [1, 0, 2, 0, 1],
                    [0, 1, 0, 2, 0],
                    [1, 1, 0, 0, 2],
                  ].map((row, r) =>
                    row.map((v, c) => (
                      <div
                        key={`${r}${c}`}
                        style={{
                          width: 40,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                          background: `${C.cyan}${v > 0 ? "20" : "08"}`,
                          border: `1px solid ${C.cyan}25`,
                          fontSize: 15,
                          color: C.cyan,
                          fontWeight: 700,
                        }}
                      >
                        {v}
                      </div>
                    )),
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <T color={C.purple} bold center size={15} style={{ marginBottom: 8 }}>
                  3×3 Filter
                </T>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 52px)", gap: 3 }}>
                  {[
                    [0.1, -0.2, 0.3],
                    [-0.1, 0.5, -0.2],
                    [0.2, -0.3, 0.1],
                  ].map((row, r) =>
                    row.map((v, c) => (
                      <div
                        key={`f${r}${c}`}
                        style={{
                          width: 52,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                          background: `${C.purple}15`,
                          border: `1px solid ${C.purple}30`,
                          fontSize: 14,
                          color: C.purple,
                          fontWeight: 700,
                        }}
                      >
                        {v.toFixed(1)}
                      </div>
                    )),
                  )}
                </div>
              </div>
            </div>

            {/* Convolution computation at position (0,0) */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
                width: "100%",
              }}
            >
              <T color={C.orange} bold center size={16}>
                Convolution at position (0,0) - top-left corner
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                Multiply filter by the 3×3 corner, then sum:
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6, fontFamily: "monospace" }}>
                (1×0.1) + (0×-0.2) + (2×0.3) + (0×-0.1) + (2×0.5) + (1×-0.2) + (1×0.2) + (0×-0.3) + (2×0.1)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                = 0.1 + 0 + 0.6 + 0 + 1.0 - 0.2 + 0.2 + 0 + 0.2 = <strong style={{ color: C.orange }}>1.9</strong>
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 8 }}>
                This single number (1.9) becomes the top-left pixel of the output "feature map".
              </T>
            </div>

            {/* All 9 positions */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
                width: "100%",
              }}
            >
              <T color={C.green} bold center size={16}>
                Filter slides to all 9 positions (5×5 - 3×3 + 1 = 3×3 output)
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 52px)",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {[
                  [1.9, -0.4, 0.2],
                  [-0.9, 1.4, -0.6],
                  [1.1, -0.7, 1.7],
                ].map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`o${r}${c}`}
                      style={{
                        width: 52,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        background: `${C.green}20`,
                        border: `1px solid ${C.green}35`,
                        fontSize: 15,
                        color: C.green,
                        fontWeight: 700,
                      }}
                    >
                      {v.toFixed(1)}
                    </div>
                  )),
                )}
              </div>
              <T color={C.dim} size={13} style={{ marginTop: 8 }}>
                This 3×3 grid is the output "feature map". High values = strong pattern detected.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            What does the filter detect?
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Different filters learn to detect different features:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { f: "Filter 1", detect: "Vertical edges (left-dark, right-bright)", nums: "[-1, 0, 1]" },
              { f: "Filter 2", detect: "Horizontal edges (top-dark, bottom-bright)", nums: "[−1, 0, 1]ᵀ" },
              { f: "Filter 3", detect: "Corners and corners", nums: "small staggered grid" },
              { f: "Filter 4+", detect: "Textures, shapes, then full objects", nums: "learned by training" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.yellow}08`,
                  border: `1px solid ${C.yellow}15`,
                }}
              >
                <T color={C.yellow} bold size={14}>
                  {item.f}:
                </T>
                <T color={C.dim} size={13}>
                  {item.detect}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" style={{ marginTop: 10 }}>
            <strong>The stack:</strong> Layer 1 finds edges → Layer 2 combines edges into shapes → Layer 3 combines
            shapes into parts (eyes, nose) → Layer 4 combines parts into objects (cat face).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Pooling: shrinking the feature map
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            After convolution, CNNs usually "pool" - taking the max or average over small regions to:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "Reduce computation (shrink image by 2x or 4x)",
              "Keep the strongest signals (max pooling)",
              "Make the network robust to small shifts (if pattern moves 1 pixel, we still detect it)",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  padding: "6px 10px",
                  borderRadius: 4,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <span style={{ color: C.green, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                <T color={C.dim} size={13}>
                  {item}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            ❌ CNN Fatal Flaw: Local window
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            CNN filters are small (3×3, 5×5, at most 7×7). They only look at <strong>nearby pixels</strong>. This is
            perfect for images but <strong>breaks for language</strong>.
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.red}15`,
            }}
          >
            <T color={C.dim} size={13}>
              Example sentence:
            </T>
            <T color="#ff8a80" bold size={14} style={{ marginTop: 4 }}>
              "The cat <em style={{ fontStyle: "italic", color: "#ffcdd2" }}>that I saw yesterday in the park</em> was
              sleeping."
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 6 }}>
              "cat" and "was" are grammatically linked (cat is sleeping), but they're 9 words apart. A 3×3 filter on
              tokens cannot see from word 1 to word 10. A 5×5 filter struggles too.
            </T>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            You'd need a huge filter (17×1 to see all 17 words at once), and even then, the filter would need to learn{" "}
            <strong>every possible relative position</strong> of "subject" and "verb" separately. That's wasteful.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            <strong>Conclusion:</strong> CNNs work great for images. They don't work for language.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#5eb3ff" bold center size={20}>
            What we need for language:
          </T>
          <T color="#5eb3ff" style={{ marginTop: 8 }}>
            A network where every word can directly look at every other word, no matter how far apart. And it should
            work the same way whether words are 1 position or 100 positions apart.
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
