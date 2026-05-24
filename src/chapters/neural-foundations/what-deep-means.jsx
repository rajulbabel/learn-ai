import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhatDeepMeans(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Layers on Layers on Layers
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A "deep" network has many layers stacked on top of each other.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>
            The depth is the number of layers.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            Shallow vs Deep
          </T>
          <div style={{ display: "flex", gap: 16, marginTop: 14, alignItems: "flex-start" }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#b8a9ff" style={{ marginBottom: 10 }}>
                Shallow (1-2 layers)
              </T>
              <T size={13} color={C.dim}>
                Input → Hidden → Output
              </T>
              <T size={13} color={C.dim} style={{ marginTop: 8 }}>
                Limited feature learning. Can only learn simple patterns.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#b8a9ff" style={{ marginBottom: 10 }}>
                Deep (50+ layers)
              </T>
              <T size={13} color={C.dim}>
                Input → H1 → H2 → ... → H50 → Output
              </T>
              <T size={13} color={C.dim} style={{ marginTop: 8 }}>
                Each layer learns richer, more abstract features.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            Feature Abstraction Through Depth
          </T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>
            Early layers learn low-level features. Later layers learn high-level concepts.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Layer 1
              </T>
              <T size={13} color={C.dim}>
                Detects edges, colors, simple shapes
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
              <T size={14} color="#ef9a9a">
                Layers 2-5
              </T>
              <T size={13} color={C.dim}>
                Detects textures, parts (eyes, ears, nose)
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
              <T size={14} color="#ef9a9a">
                Layers 6+
              </T>
              <T size={13} color={C.dim}>
                Detects objects (cat, dog, person)
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Why Does Depth Matter?
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>
                Composability
              </T>
              <T size={13} color={C.dim}>
                Each layer builds on the previous. Layers can reuse and combine earlier features.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>
                Efficiency
              </T>
              <T size={13} color={C.dim}>
                Deep networks solve problems with fewer parameters than shallow ones.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>
                Expressiveness
              </T>
              <T size={13} color={C.dim}>
                Some functions cannot be learned by shallow networks at all.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={19}>
            Training vs Inference
          </T>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#80e8a5" style={{ marginBottom: 8 }}>
                Training
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Update weights
                  </T>
                  <T size={12} color={C.dim}>
                    Backprop changes every parameter
                  </T>
                </div>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Dropout active
                  </T>
                  <T size={12} color={C.dim}>
                    Random units deactivated
                  </T>
                </div>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#80e8a5" style={{ marginBottom: 8 }}>
                Inference
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Weights FROZEN
                  </T>
                  <T size={12} color={C.dim}>
                    No changes, no gradients
                  </T>
                </div>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Dropout off
                  </T>
                  <T size={12} color={C.dim}>
                    All units active
                  </T>
                </div>
              </div>
            </div>
          </div>
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
