import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function Matrices(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            From 1D to 2D: The Grid
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A matrix is a grid of numbers arranged in rows and columns.
          </T>
          <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", marginTop: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                A vector is 1D
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[38.5, 1.0, 0.8].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 54,
                      height: 54,
                      background: `${C.cyan}15`,
                      border: `1px solid ${C.cyan}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ color: C.cyan, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 32, color: C.mid, paddingTop: 20 }}>→</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                A matrix is 2D
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  [0.6, 0.3, 0.1],
                  [0.1, 0.5, 0.2],
                  [0.0, 0.2, 0.7],
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 4 }}>
                    {row.map((n, j) => (
                      <div
                        key={j}
                        style={{
                          width: 54,
                          height: 54,
                          background: `${C.cyan}15`,
                          border: `1px solid ${C.cyan}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                        }}
                      >
                        <span style={{ color: C.cyan, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>
                          {n}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#80deea" style={{ marginTop: 18, textAlign: "center" }}>
            The matrix on the right is 3 rows × 3 columns. We write this as a 3×3 matrix.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            A Matrix Transforms a Vector Into a New Vector
          </T>
          <T color="#b8a9ff" size={15} style={{ marginTop: 10 }}>
            Each ROW does a dot product with the input vector.
          </T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Weights (3 neurons)
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  [0.6, 0.3, 0.1],
                  [0.1, 0.5, 0.2],
                  [0.0, 0.2, 0.7],
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 4 }}>
                    {row.map((n, j) => (
                      <div
                        key={j}
                        style={{
                          width: 48,
                          height: 48,
                          background: `${C.purple}15`,
                          border: `1px solid ${C.purple}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          color: C.purple,
                          borderRadius: 6,
                        }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <T size={20} color={C.mid} style={{ paddingTop: 20 }}>
              ×
            </T>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Inputs
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[38.5, 1.0, 0.8].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 48,
                      height: 48,
                      background: `${C.purple}25`,
                      border: `1px solid ${C.purple}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      color: C.purple,
                      borderRadius: 6,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <T size={20} color={C.mid} style={{ paddingTop: 20 }}>
              =
            </T>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Outputs
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[23.48, 4.51, 0.76].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 54,
                      height: 48,
                      background: `${C.orange}15`,
                      border: `1px solid ${C.orange}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      color: C.orange,
                      borderRadius: 6,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            The Math Step-by-Step
          </T>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Flu neuron [0.6, 0.3, 0.1] · [38.5, 1.0, 0.8]:
            </T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.6
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.3
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.1
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                23.1
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.3
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.08
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                23.48
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Cold neuron [0.1, 0.5, 0.2] · [38.5, 1.0, 0.8]:
            </T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.1
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.2
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                3.85
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.16
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                4.51
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Allergy neuron [0.0, 0.2, 0.7] · [38.5, 1.0, 0.8]:
            </T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.2
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.7
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.2
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.56
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.76
              </span>
            </div>
          </div>
          <T size={15} color="#ef9a9a" style={{ marginTop: 14 }}>
            Result: [23.48, 4.51, 0.76] - the raw scores before bias and activation.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            This is What a Layer Does!
          </T>
          <T color="#ffe082" size={15} style={{ marginTop: 10 }}>
            In <ChapterLink to="1.3">chapter 1.3</ChapterLink>, a layer with weights [[0.6, 0.3, 0.1], [0.1, 0.5, 0.2], [0.0, 0.2, 0.7]] transforming input
            [38.5, 1.0, 0.8] is matrix multiplication.
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <T size={16} color={C.yellow} bold style={{ fontFamily: "monospace", marginBottom: 8 }}>
              Layer weights are a matrix.
            </T>
            <T size={14} color={C.dim}>
              Passing input through a layer is matrix multiplication.
            </T>
          </div>
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
