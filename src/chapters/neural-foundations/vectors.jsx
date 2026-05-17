import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function Vectors(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            From One Number to Many
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A vector is just a list of numbers.
          </T>
          <div style={{ marginTop: 20, display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Scalar (one number)
              </T>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: `${C.cyan}15`,
                  border: `1px solid ${C.cyan}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <T size={24} bold color={C.cyan}>
                  42
                </T>
              </div>
            </div>
            <div data-arrow style={{ marginTop: 25 }}>
              <T size={28} color={C.mid}>
                →
              </T>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Vector (list)
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[3, 7, 2, 5].map((num, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: 70,
                      background: `${[C.cyan, C.green, C.yellow, C.orange][i]}15`,
                      border: `1px solid ${[C.cyan, C.green, C.yellow, C.orange][i]}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                    }}
                  >
                    <T size={20} bold color={[C.cyan, C.green, C.yellow, C.orange][i]}>
                      {num}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#80deea" style={{ marginTop: 18, textAlign: "center" }}>
            A single number describes one thing. A vector bundles multiple numbers together.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            In Neural Networks, Everything is Vectors
          </T>
          <T color="#b8a9ff" size={15} style={{ marginTop: 12 }}>
            Inputs? A vector. Hidden layer outputs? Vectors. Every layer takes a vector in and produces a vector out.
          </T>
          <div style={{ marginTop: 18, display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Input Vector
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[1500, 3].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: 50,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      fontSize: 14,
                      color: C.green,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <div data-arrow style={{ marginTop: 25 }}>
              <T size={24} color={C.mid}>
                →
              </T>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Output Vector
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[950, 185].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: 50,
                      background: `${C.orange}20`,
                      border: `1px solid ${C.orange}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      fontSize: 14,
                      color: C.orange,
                      fontFamily: "monospace",
                      fontWeight: "bold",
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
            Words Become Vectors
          </T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 12 }}>
            A word like "cat" can't go into a neural network as letters. Instead, it becomes a vector of 512 numbers,
            where each number captures some aspect of meaning.
          </T>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 10 }}>
              The word "cat" - first 8 of 512 numbers:
            </T>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[0.8, -0.2, 0.5, 0.1, -0.7, 0.3, 0.9, -0.4].map((num, i) => {
                const bgColor = num > 0 ? C.green : C.red;
                return (
                  <div
                    key={i}
                    style={{
                      background: `${bgColor}25`,
                      border: `1px solid ${bgColor}40`,
                      padding: "6px 10px",
                      borderRadius: 4,
                      color: bgColor,
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {num.toFixed(1)}
                  </div>
                );
              })}
            </div>
            <T size={13} color={C.dim} style={{ marginTop: 8 }}>
              ...504 more numbers
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Similar Words Have Similar Vectors
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} bold color={C.green}>
                "cat"
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {[0.8, -0.2, 0.5, 0.1].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}40`,
                      padding: 8,
                      borderRadius: 4,
                      color: C.green,
                      fontSize: 13,
                      fontFamily: "monospace",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} bold color={C.green}>
                "kitten"
              </T>
              <T size={13} color={C.dim} style={{ marginBottom: 8 }}>
                Very similar to cat
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[0.75, -0.18, 0.48, 0.08].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}40`,
                      padding: 8,
                      borderRadius: 4,
                      color: C.green,
                      fontSize: 13,
                      fontFamily: "monospace",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} bold color={C.red}>
                "pizza"
              </T>
              <T size={13} color={C.dim} style={{ marginBottom: 8 }}>
                Completely different
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[-0.3, 0.6, -0.1, 0.9].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `${C.red}20`,
                      border: `1px solid ${C.red}40`,
                      padding: 8,
                      borderRadius: 4,
                      color: C.red,
                      fontSize: 13,
                      fontFamily: "monospace",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 16, textAlign: "center" }}>
            The network learns these numbers during training. Similar meanings lead to similar vectors.
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
