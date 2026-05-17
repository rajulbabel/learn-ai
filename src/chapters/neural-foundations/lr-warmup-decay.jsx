import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { Graph } from "../../shared/plot.jsx";

export default function LRWarmupDecay(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            Why a Constant Learning Rate Fails
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            No single learning rate works well for the entire training process. Too high and you diverge. Too low and
            you never converge.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  lr = 0.01
                </span>
                <T color={C.dim} size={15}>
                  Loss explodes to NaN after a few steps
                </T>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "100%", height: "100%", background: `${C.red}60`, borderRadius: 4 }} />
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.yellow}15`,
                    borderRadius: 4,
                    color: C.yellow,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  lr = 0.0001
                </span>
                <T color={C.dim} size={15}>
                  Training crawls - still not converged after 100K steps
                </T>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "20%", height: "100%", background: `${C.yellow}60`, borderRadius: 4 }} />
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: C.green,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  lr = 0.001
                </span>
                <T color={C.dim} size={15}>
                  Works OK... but still not optimal for the whole run
                </T>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "65%", height: "100%", background: `${C.green}60`, borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 14 }}>
            The best learning rate changes over the course of training. Early on you need small steps. In the middle,
            larger steps. Near the end, small steps again.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Warmup - Start Tiny, Ramp Up
          </T>
          <T color="#5eb3ff" size={17} style={{ marginTop: 12 }}>
            At step 1, weights are random garbage. Gradients are noisy and unreliable. A large learning rate plus bad
            gradients equals immediate divergence.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Graph
              points={[
                [0, 0],
                [400, 0.0002],
                [800, 0.0004],
                [1200, 0.0006],
                [1600, 0.0008],
                [2000, 0.001],
              ]}
              color={C.blue}
              width={300}
              height={140}
              xLabel="Step"
              yLabel="LR"
              title="Linear Warmup (2000 steps)"
              desc="Line graph showing learning rate increasing linearly from zero during warmup phase over 2000 training steps"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <div
              style={{
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.blue}15`,
                  borderRadius: 4,
                  color: "#5eb3ff",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Step 0
              </span>
              <T color={C.dim} size={14}>
                lr = 0 (no updates yet)
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.blue}15`,
                  borderRadius: 4,
                  color: "#5eb3ff",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Step 1000
              </span>
              <T color={C.dim} size={14}>
                lr = 0.0005 (halfway to peak)
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: C.green,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Step 2000
              </span>
              <T color={C.dim} size={14}>
                lr = 0.001 (peak reached)
              </T>
            </div>
          </div>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>
            Small LR lets the model "find its footing" before taking bigger steps. The gradients stabilize as the
            weights move toward a reasonable region of the loss landscape.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Cosine Decay - Smooth Descent
          </T>
          <T color="#80e8a5" size={17} style={{ marginTop: 12 }}>
            After warmup, smoothly decrease the LR following a cosine curve. The formula:
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}25`,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={16} style={{ fontFamily: "monospace" }}>
              lr = lr_min + 0.5 x (lr_max - lr_min) x (1 + cos(pi x step / total))
            </T>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Graph
              points={[
                [0, 0],
                [500, 0.00025],
                [1000, 0.0005],
                [1500, 0.00075],
                [2000, 0.001],
                [3000, 0.000927],
                [4000, 0.000854],
                [5000, 0.000691],
                [6000, 0.0005],
                [7000, 0.000309],
                [8000, 0.000146],
                [9000, 0.000024],
                [10000, 0],
              ]}
              color={C.green}
              width={320}
              height={150}
              xLabel="Step"
              yLabel="LR"
              title="Warmup + Cosine Decay"
              desc="Line graph showing learning rate with linear warmup to a peak then smooth cosine decay to zero, illustrating the complete LR schedule"
              annotations={[{ x: 2000, y: 0.001, text: "Peak", color: C.yellow }]}
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
              }}
            >
              <T color="#5eb3ff" bold size={14} center>
                Warmup Phase
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Steps 0-2000: Linear ramp from 0 to peak
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <T color="#80e8a5" bold size={14} center>
                Decay Phase
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Steps 2000+: Cosine curve gently reduces to minimum
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Real-World Schedule: GPT-3
          </T>
          <T color="#ffe082" size={17} style={{ marginTop: 12 }}>
            Here is the actual schedule used to train GPT-3 (175 billion parameters):
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            {[
              { label: "Warmup", value: "375M tokens (~2,000 steps)", color: C.blue },
              { label: "Peak LR", value: "6 x 10^-4 (0.0006)", color: C.green },
              { label: "Decay over", value: "300B tokens (cosine schedule)", color: C.purple },
              { label: "Min LR", value: "6 x 10^-5 (10% of peak)", color: C.orange },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  padding: "10px 14px",
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  borderRadius: 8,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "4px 12px",
                    background: `${color}15`,
                    borderRadius: 4,
                    minWidth: 100,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <T color={color} bold size={14}>
                    {label}
                  </T>
                </div>
                <T color={C.dim} size={15}>
                  {value}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#ffe082" bold size={16}>
              Why cosine and not linear decay?
            </T>
            <T color="#ffe082" size={15} style={{ marginTop: 6 }}>
              Cosine spends more time at useful learning rates (the middle range) and approaches zero very gradually.
              Linear decay spends equal time at every LR, wasting steps at near-zero rates where no meaningful learning
              occurs.
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
