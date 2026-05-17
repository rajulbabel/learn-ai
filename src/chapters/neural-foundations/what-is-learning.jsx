import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhatIsLearning(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            What Changes During Training?
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            When a neural network is first created, all weights and biases are random numbers. It knows nothing. It
            makes garbage predictions.
          </T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            Our network predicted 807k but the correct answer was 900k. That's how bad random weights are.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            A Network Starts Dumb
          </T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16 }}>
            Learning is adjusting weights and biases until predictions get good. The loop has 4 steps:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.cyan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.cyan} bold size={16}>
                  Forward Pass
                </T>
                <T color={C.dim} size={14}>
                  Feed input through network, get prediction
                </T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.yellow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.yellow} bold size={16}>
                  Calculate Loss
                </T>
                <T color={C.dim} size={14}>
                  Compare prediction with correct answer
                </T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.orange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold size={16}>
                  Backward Pass
                </T>
                <T color={C.dim} size={14}>
                  Figure out which weights caused the error
                </T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                4
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold size={16}>
                  Update Weights
                </T>
                <T color={C.dim} size={14}>
                  Nudge each weight to reduce error
                </T>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              background: `${C.purple}06`,
              borderRadius: 8,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold size={16}>
              ↻ Repeat until loss is small enough
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Backpropagation + Gradient Descent
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>
            This process has a name: "Backpropagation + Gradient Descent."
          </T>
          <div
            style={{
              marginTop: 16,
              padding: "12px",
              background: `${C.orange}06`,
              borderRadius: 8,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold size={16}>
              Backpropagation
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Step 3 - figuring out which weights to blame for the error
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              background: `${C.green}06`,
              borderRadius: 8,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={16}>
              Gradient Descent
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Step 4 - actually updating the weights
            </T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>
            Together, they are "training." When someone says "training a model," they mean running this loop millions of
            times.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={20}>
            After Millions of Loops
          </T>
          <T color="#ffb3e6" size={16} style={{ marginTop: 12 }}>
            After running this loop millions of times, the weights converge to values that make good predictions. The
            network has "learned."
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>
            Those final weight values are the model. When you download GPT-3, you are downloading 175 billion
            carefully-tuned weight values that have been optimized through this exact process.
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
