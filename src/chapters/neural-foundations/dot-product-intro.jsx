import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function DotProductIntro(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Multiplying Vectors Together
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            How do you compare two vectors? The dot product.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>
            It is the most important operation in all of AI.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            The Recipe: Multiply Matching Positions, Then Add Up
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <T size={17} bold color={C.purple}>
              A = [2, 3] B = [4, 1]
            </T>
            <div style={{ marginTop: 12, fontSize: 15 }}>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <T color="#b8a9ff" bold size={15}>
                  Step 1:
                </T>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  4
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#80e8a5",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  8
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  1
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#80e8a5",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
              </div>
              <div
                style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}
              >
                <T color="#b8a9ff" bold size={15}>
                  Step 2:
                </T>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#80e8a5",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  8
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#80e8a5",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.cyan}15`,
                    borderRadius: 4,
                    color: "#80deea",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  11
                </span>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.purple}30` }}>
              <T size={18} bold color={C.purple}>
                A · B = 11
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            What Does It Mean?
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [4, 6] = 26
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.green}40`, borderRadius: 4 }} />
              <T size={13} color={C.green} style={{ marginTop: 6 }}>
                Same direction (similar)
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [4, 1] = 11
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.yellow}40`, borderRadius: 4 }} />
              <T size={13} color={C.yellow} style={{ marginTop: 6 }}>
                Somewhat similar
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [0, 0] = 0
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.mid}40`, borderRadius: 4 }} />
              <T size={13} color={C.mid} style={{ marginTop: 6 }}>
                Zero vector
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [-2, -3] = -13
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.red}40`, borderRadius: 4 }} />
              <T size={13} color={C.red} style={{ marginTop: 6 }}>
                Opposite direction
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 12px",
              background: `${C.red}06`,
              border: `1px solid ${C.red}15`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T size={14} color={C.dim}>
              <span style={{ color: "#ef9a9a", fontWeight: "bold" }}>Note on cosine similarity:</span> The dot product
              is affected by magnitude. When you only care about direction, normalize to length 1 first. That is cosine
              similarity.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Wait - This is What a Neuron Does!
          </T>
          <T color="#ffe082" size={15} style={{ marginTop: 12 }}>
            A neuron takes inputs [38.5, 1.0, 0.8] and weights [0.6, 0.3, 0.1] and computes:
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                0.6
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.yellow}15`,
                  borderRadius: 4,
                  color: "#ffe082",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                0.3
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.purple}15`,
                  borderRadius: 4,
                  color: "#b8a9ff",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                0.1
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.cyan}15`,
                  borderRadius: 4,
                  color: "#80deea",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                23.48
              </span>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 12 }}>
            That is a dot product! A neuron is a dot product machine.
          </T>
        </Box>
      </Reveal>

      {sub < 3 && (
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
