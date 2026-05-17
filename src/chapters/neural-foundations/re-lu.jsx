import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { Graph } from "../../shared/plot.jsx";

export default function ReLU(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const neuron1 = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 1],
    [5, 2],
    [6, 3],
    [7, 4],
  ];
  const neuron2 = [
    [0, 5],
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1],
    [5, 0],
    [6, 0],
    [7, 0],
  ];
  const combined = neuron1.map((p, i) => [p[0], p[1] + neuron2[i][1]]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>
            Activation (ReLU)
          </T>
          <T color={C.bright} bold size={18}>
            The ReLU Rule
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 12, marginBottom: 16 }}>
            After each neuron's math, apply one simple rule:
          </T>
          <div
            style={{
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              border: `2px solid ${C.yellow}`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={17}>
              If negative → 0 | If positive → keep
            </T>
          </div>
          <T
            color="rgba(255,255,255,0.5)"
            size={14}
            style={{ marginTop: 16, textAlign: "center", fontStyle: "italic", fontFamily: "monospace" }}
          >
            Formally: ReLU(x) = max(0, x)
          </T>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: "#ef9a9a",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  -5
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  0
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: "#ef9a9a",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  -100
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  0
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  3
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  950
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  950
                </span>
              </div>
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>
              One Neuron with ReLU Gives a BENT Line
            </T>
            <T color="#80deea" size={16} style={{ marginBottom: 14 }}>
              Flat at 0 from inputs 0-3 (ReLU kills negatives), then rises. A bent line, not straight!
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {Graph({
                points: neuron1,
                color: C.cyan,
                title: "Neuron 1: flat, then rises",
                desc: "Line graph showing ReLU-activated neuron output that is flat at zero then linearly increases, with an annotated bend point",
                annotations: [{ x: 3, y: 0, text: "bend!", color: C.cyan }],
              })}
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>
              A Different Neuron: Different Bend
            </T>
            <T color="#ffe082" size={16} style={{ marginBottom: 14 }}>
              Different weights and bias create a different bend point.
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {Graph({
                points: neuron2,
                color: C.yellow,
                title: "Neuron 2: slopes down, then flat",
                desc: "Line graph showing a second ReLU neuron with a different bend point, demonstrating how different weights create different activation patterns",
                annotations: [{ x: 5, y: 0, text: "bend!", color: C.yellow }],
              })}
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>
              Add Both Neurons Together: a Valley Curve
            </T>
            <T color="#b8a9ff" size={16} style={{ marginBottom: 14 }}>
              Two bent lines create a valley shape - a curve. No straight line can do this.
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {Graph({
                points: combined,
                color: C.purple,
                title: "Combined: a valley shape",
                desc: "Line graph showing the combined output of two ReLU neurons creating a valley shape that no single straight line could produce",
                annotations: [
                  { x: 3, y: 2, text: "1st bend", color: C.cyan },
                  { x: 5, y: 2, text: "2nd bend", color: C.purple },
                ],
              })}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 15,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  0
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  5
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  4
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  7
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  4
                </span>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
              Scale This Up
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  2 neurons
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → 2 bends → valley/hill
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  10 neurons
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → 10 bends → waves, zigzags
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  1000 neurons
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → 1000 bends → any curve
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  Millions
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → millions of bends → language, images, anything
                </T>
              </div>
            </div>
            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}20`,
                borderRadius: 8,
              }}
            >
              <T color={C.orange} bold size={16}>
                Without ReLU: 100 layers = 1 layer (straight line)
              </T>
              <T color={C.orange} bold size={16} style={{ marginTop: 10 }}>
                With ReLU: each neuron adds a bend → millions of bends → learn ANY pattern
              </T>
            </div>
          </Box>
        </Reveal>
      )}
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
