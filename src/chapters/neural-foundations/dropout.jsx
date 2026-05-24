import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function Dropout(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            What Are Training Loss and Validation Loss?
          </T>
          <T color="#90caf9" size={17} style={{ marginTop: 12 }}>
            Before training, we split our data into two groups. The model only ever learns from one group - the other is
            kept hidden as an honest test.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 90" style={{ display: "block", width: "100%", maxWidth: 380 }}>
              <desc>
                Dataset split bar showing 80% training data in green and 20% validation data in orange, with labeled
                counts
              </desc>
              {/* Full bar background */}
              <rect x={10} y={18} width={340} height={36} rx={6} fill="rgba(255,255,255,0.04)" />
              {/* Training portion - 80% */}
              <rect
                x={10}
                y={18}
                width={272}
                height={36}
                rx={6}
                fill={`${C.green}25`}
                stroke={C.green}
                strokeWidth={1.5}
              />
              <text x={146} y={41} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>
                Training Data (80%)
              </text>
              {/* Validation portion - 20% */}
              <rect
                x={282}
                y={18}
                width={68}
                height={36}
                rx={6}
                fill={`${C.orange}25`}
                stroke={C.orange}
                strokeWidth={1.5}
              />
              <text x={316} y={41} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                20%
              </text>
              {/* Labels below */}
              <text x={146} y={72} fill={C.green} fontSize={11} textAnchor="middle">
                800 examples
              </text>
              <text x={316} y={72} fill={C.orange} fontSize={11} textAnchor="middle">
                200 examples
              </text>
              {/* Total label */}
              <text x={180} y={12} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle">
                1,000 total examples
              </text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            <div
              style={{
                flex: 1,
                padding: "14px",
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold size={17} center>
                Training Loss
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg viewBox="0 0 120 50" style={{ width: 120, height: 50 }}>
                  <desc>
                    Icon showing an open eye with a checkmark, representing data the model sees during training
                  </desc>
                  {/* Eye icon - open */}
                  <ellipse cx={60} cy={25} rx={30} ry={16} fill="none" stroke={C.green} strokeWidth={2} />
                  <circle cx={60} cy={25} r={8} fill={`${C.green}30`} stroke={C.green} strokeWidth={1.5} />
                  <circle cx={60} cy={25} r={3} fill={C.green} />
                </svg>
              </div>
              <T color="#80e8a5" size={15} style={{ marginTop: 8 }}>
                Error measured on data the model trains on. The model sees these examples, makes predictions, and
                adjusts its weights.
              </T>
              <div
                style={{
                  padding: "6px 10px",
                  background: `${C.green}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.green}20`,
                  marginTop: 10,
                }}
              >
                <T color={C.green} bold size={14} center>
                  Always goes down with more training
                </T>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px",
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                borderRadius: 8,
              }}
            >
              <T color={C.orange} bold size={17} center>
                Validation Loss
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg viewBox="0 0 120 50" style={{ width: 120, height: 50 }}>
                  <desc>
                    Icon showing a closed eye with a lock, representing held-out data the model never sees during
                    training
                  </desc>
                  {/* Eye icon - closed/hidden */}
                  <path d="M 30 25 Q 60 40 90 25" fill="none" stroke={C.orange} strokeWidth={2} />
                  <path d="M 30 25 Q 60 10 90 25" fill="none" stroke={C.orange} strokeWidth={2} strokeDasharray="4,3" />
                  <line x1={42} y1={32} x2={38} y2={40} stroke={C.orange} strokeWidth={2} />
                  <line x1={60} y1={35} x2={60} y2={44} stroke={C.orange} strokeWidth={2} />
                  <line x1={78} y1={32} x2={82} y2={40} stroke={C.orange} strokeWidth={2} />
                </svg>
              </div>
              <T color="#ffcc80" size={15} style={{ marginTop: 8 }}>
                Error measured on data the model has NEVER seen. These examples are hidden during training - they are
                the honest test.
              </T>
              <div
                style={{
                  padding: "6px 10px",
                  background: `${C.orange}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.orange}20`,
                  marginTop: 10,
                }}
              >
                <T color={C.orange} bold size={14} center>
                  The real measure of learning
                </T>
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.blue}08`,
              border: `1px solid ${C.blue}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#90caf9" size={16}>
              Training loss tells you how well the model memorizes. Validation loss tells you how well it generalizes to
              new, unseen data. The gap between them is everything.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Overfitting Problem
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            Watch what happens as training continues. The model starts to memorize the training data instead of learning
            general patterns.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 220" style={{ display: "block", width: "100%", maxWidth: 400 }}>
              <desc>
                Combined line graph showing training loss and validation loss over 14 epochs, with annotated zones for
                both improving, sweet spot, and overfitting region where the curves diverge
              </desc>
              {/* Axes */}
              <line x1={45} y1={18} x2={45} y2={175} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <line x1={45} y1={175} x2={345} y2={175} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              {/* Y-axis label */}
              <text
                x={8}
                y={100}
                fill="rgba(255,255,255,0.4)"
                fontSize={10}
                textAnchor="middle"
                transform="rotate(-90, 8, 100)"
              >
                Loss
              </text>
              {/* X-axis label */}
              <text x={195} y={195} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle">
                Epoch
              </text>
              {/* X-axis ticks */}
              {[0, 2, 4, 6, 8, 10, 12, 14].map((v) => {
                const x = 45 + (v / 14) * 300;
                return (
                  <text key={v} x={x} y={188} fill="rgba(255,255,255,0.35)" fontSize={9} textAnchor="middle">
                    {v}
                  </text>
                );
              })}
              {/* Zone backgrounds */}
              {/* Both improving zone (epoch 0-6) */}
              <rect x={45} y={18} width={128} height={157} fill={`${C.green}06`} />
              {/* Overfitting zone (epoch 6-14) */}
              <rect x={173} y={18} width={172} height={157} fill={`${C.red}06`} />
              {/* Sweet spot line */}
              <line x1={173} y1={18} x2={173} y2={175} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="5,4" />
              {/* Zone labels */}
              <text x={109} y={210} fill={C.green} fontSize={10} textAnchor="middle" fontWeight={600}>
                Both improving
              </text>
              <text x={259} y={210} fill={C.red} fontSize={10} textAnchor="middle" fontWeight={600}>
                Overfitting zone
              </text>
              {/* Sweet spot label */}
              <text x={173} y={13} fill={C.yellow} fontSize={10} textAnchor="middle" fontWeight={700}>
                Sweet Spot
              </text>
              {/* Training loss line (green) - keeps dropping */}
              {(() => {
                const trainPts = [
                  [0, 2.5],
                  [2, 1.8],
                  [4, 1.2],
                  [6, 0.7],
                  [8, 0.3],
                  [10, 0.1],
                  [12, 0.05],
                  [14, 0.02],
                ];
                const sx = (v) => 45 + (v / 14) * 300;
                const sy = (v) => 28 + ((3.0 - v) / 3.0) * 145;
                const line = trainPts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ");
                return (
                  <g>
                    <polyline points={line} fill="none" stroke={C.green} strokeWidth={2.5} strokeLinejoin="round" />
                    {trainPts.map((p, i) => (
                      <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={3} fill={C.green} />
                    ))}
                  </g>
                );
              })()}
              {/* Validation loss line (red) - drops then rises */}
              {(() => {
                const valPts = [
                  [0, 2.6],
                  [2, 1.9],
                  [4, 1.4],
                  [6, 1.1],
                  [8, 1.3],
                  [10, 1.8],
                  [12, 2.3],
                  [14, 2.8],
                ];
                const sx = (v) => 45 + (v / 14) * 300;
                const sy = (v) => 28 + ((3.0 - v) / 3.0) * 145;
                const line = valPts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ");
                return (
                  <g>
                    <polyline points={line} fill="none" stroke={C.red} strokeWidth={2.5} strokeLinejoin="round" />
                    {valPts.map((p, i) => (
                      <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={3} fill={C.red} />
                    ))}
                  </g>
                );
              })()}
              {/* Gap annotation at epoch 14 */}
              {(() => {
                const sx = 45 + (14 / 14) * 300;
                const syTrain = 28 + ((3.0 - 0.02) / 3.0) * 145;
                const syVal = 28 + ((3.0 - 2.8) / 3.0) * 145;
                return (
                  <g>
                    <line x1={sx + 6} y1={syTrain} x2={sx + 6} y2={syVal} stroke={C.yellow} strokeWidth={2} />
                    <polygon
                      points={`${sx + 6},${syVal} ${sx + 3},${syVal + 6} ${sx + 9},${syVal + 6}`}
                      fill={C.yellow}
                    />
                    <polygon
                      points={`${sx + 6},${syTrain} ${sx + 3},${syTrain - 6} ${sx + 9},${syTrain - 6}`}
                      fill={C.yellow}
                    />
                    <text x={sx + 14} y={(syTrain + syVal) / 2 + 4} fill={C.yellow} fontSize={10} fontWeight={700}>
                      GAP
                    </text>
                  </g>
                );
              })()}
              {/* Legend */}
              <line x1={60} y1={33} x2={80} y2={33} stroke={C.green} strokeWidth={2.5} />
              <circle cx={70} cy={33} r={3} fill={C.green} />
              <text x={84} y={37} fill={C.green} fontSize={10} fontWeight={600}>
                Training Loss
              </text>
              <line x1={185} y1={33} x2={205} y2={33} stroke={C.red} strokeWidth={2.5} />
              <circle cx={195} cy={33} r={3} fill={C.red} />
              <text x={209} y={37} fill={C.red} fontSize={10} fontWeight={600}>
                Validation Loss
              </text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}15`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold size={15} center>
                Training: 0.02
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Memorized everything perfectly
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}15`,
                borderRadius: 8,
              }}
            >
              <T color={C.red} bold size={15} center>
                Validation: 2.80
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Fails completely on new data
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" size={16}>
              Like a student who memorizes every answer in the textbook but cannot solve a new problem on the exam. The
              network scores perfectly on data it has seen, but fails on anything new.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            The Solution - Randomly Zero Out Neurons
          </T>
          <T color="#80e8a5" size={17} style={{ marginTop: 12 }}>
            During training, randomly set some neurons to zero. Every forward pass uses a different random subset of the
            network.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 120" style={{ display: "block", width: "100%", maxWidth: 360 }}>
              <desc>Six-neuron layer with dropout showing alternating active and dropped neurons during training</desc>
              <text x={180} y={14} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle" fontWeight={600}>
                6-Neuron Layer with Dropout (p = 0.5)
              </text>
              {[
                { x: 30, active: true },
                { x: 90, active: false },
                { x: 150, active: true },
                { x: 210, active: false },
                { x: 270, active: true },
                { x: 330, active: false },
              ].map(({ x, active }, i) => (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={65}
                    r={22}
                    fill={active ? `${C.green}20` : "rgba(255,255,255,0.03)"}
                    stroke={active ? C.green : "rgba(255,255,255,0.15)"}
                    strokeWidth={2}
                  />
                  {active ? (
                    <text x={x} y={70} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>
                      n{i + 1}
                    </text>
                  ) : (
                    <g>
                      <line x1={x - 10} y1={55} x2={x + 10} y2={75} stroke={C.red} strokeWidth={3} />
                      <line x1={x + 10} y1={55} x2={x - 10} y2={75} stroke={C.red} strokeWidth={3} />
                    </g>
                  )}
                  <text
                    x={x}
                    y={105}
                    fill={active ? C.green : C.red}
                    fontSize={10}
                    textAnchor="middle"
                    fontWeight={600}
                  >
                    {active ? "ACTIVE" : "DROPPED"}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#80e8a5" size={16}>
              Dropout rate p = 0.5 means each neuron has a 50% chance of being zeroed out on each forward pass. Every
              training step sees a different random subset of the network.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Why This Works - Forced Redundancy
          </T>
          <T color="#b8a9ff" size={17} style={{ marginTop: 12 }}>
            No single neuron can become a "lone specialist" that the network depends on entirely. Every neuron must be
            useful even when its neighbors are missing.
          </T>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T color="#b8a9ff" bold size={16} center>
                Without Dropout
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                Neuron 3 memorizes a specific pattern. If neuron 3 fails, the network breaks. Knowledge is fragile and
                concentrated.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T color="#b8a9ff" bold size={16} center>
                With Dropout
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                All neurons learn overlapping representations. Any 3 of 6 can carry the signal. Knowledge is distributed
                and robust.
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" size={16}>
              Think of a team of 6 people where any 3 might be absent on any given day. Everyone must learn everyone
              else's job. The team becomes resilient - no single point of failure.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The Actual Math
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 12 }}>
            Start with an input vector and apply a random binary mask, then scale up:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ffe082" bold size={15}>
                Step 1: Input vector
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                {[0.8, 0.3, 0.5, 0.2, 0.7, 0.4].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: `${C.cyan}15`,
                      borderRadius: 4,
                      color: "#80deea",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
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
              <T color="#ffe082" bold size={15}>
                Step 2: Random Bernoulli mask (p = 0.5)
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[1, 0, 1, 0, 1, 0].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: v ? `${C.green}15` : `${C.red}15`,
                      borderRadius: 4,
                      color: v ? C.green : C.red,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
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
              <T color="#ffe082" bold size={15}>
                Step 3: Multiply element-wise
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[0.8, 0, 0.5, 0, 0.7, 0].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: v > 0 ? `${C.green}15` : `${C.red}15`,
                      borderRadius: 4,
                      color: v > 0 ? C.green : C.red,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.orange}08`,
                border: `1px solid ${C.orange}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ffcc80" bold size={15}>
                Step 4: Scale by 1/(1 - p) = 1/0.5 = 2
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[1.6, 0, 1.0, 0, 1.4, 0].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: v > 0 ? `${C.orange}15` : `${C.red}15`,
                      borderRadius: 4,
                      color: v > 0 ? "#ffcc80" : C.red,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" bold size={16}>
              Why scale?
            </T>
            <T color="#ffe082" size={15} style={{ marginTop: 4 }}>
              Without scaling, the expected output is only 0.5 x original (half the neurons are zero). Scaling by 2
              restores the expected value to match the original. This way, the network sees the same magnitude at
              training and inference.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            At Inference - No Dropout
          </T>
          <T color="#80deea" size={17} style={{ marginTop: 12 }}>
            When the model is deployed and making predictions, dropout is completely turned off. All neurons are active,
            no mask is applied, no scaling is needed.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 100" style={{ display: "block", width: "100%", maxWidth: 360 }}>
              <desc>
                Six-neuron layer at inference showing all neurons active, illustrating that dropout is turned off during
                prediction
              </desc>
              <text x={180} y={14} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle" fontWeight={600}>
                All 6 Neurons Active at Inference
              </text>
              {[30, 90, 150, 210, 270, 330].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={55} r={22} fill={`${C.cyan}20`} stroke={C.cyan} strokeWidth={2} />
                  <text x={x} y={60} fill={C.cyan} fontSize={14} textAnchor="middle" fontWeight={700}>
                    n{i + 1}
                  </text>
                  <text x={x} y={92} fill={C.green} fontSize={10} textAnchor="middle" fontWeight={600}>
                    ACTIVE
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#80deea" size={16}>
              The scaling during training (multiplying by 1/(1 - p)) already compensated for the missing neurons. So at
              inference, using all neurons with their original weights produces the correct expected output. This is
              called "inverted dropout."
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Where Dropout Lives in a Transformer
          </T>
          <T color="#ffcc80" size={17} style={{ marginTop: 12 }}>
            Dropout is applied at two key locations inside each transformer block:
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 280 320" style={{ display: "block", width: "100%", maxWidth: 280 }}>
              <desc>
                Vertical transformer block diagram showing where dropout is applied: after attention and after FFN
              </desc>
              {/* Input */}
              <rect
                x={70}
                y={5}
                width={140}
                height={30}
                rx={6}
                fill={`${C.cyan}15`}
                stroke={C.cyan}
                strokeWidth={1.5}
              />
              <text x={140} y={25} fill={C.cyan} fontSize={11} textAnchor="middle" fontWeight={600}>
                Input
              </text>

              {/* Arrow */}
              <line x1={140} y1={35} x2={140} y2={50} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Multi-Head Attention */}
              <rect
                x={50}
                y={50}
                width={180}
                height={35}
                rx={6}
                fill={`${C.purple}15`}
                stroke={C.purple}
                strokeWidth={1.5}
              />
              <text x={140} y={72} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={600}>
                Multi-Head Attention
              </text>

              {/* Arrow */}
              <line x1={140} y1={85} x2={140} y2={100} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* DROPOUT 1 */}
              <rect x={60} y={100} width={160} height={30} rx={6} fill={`${C.red}25`} stroke={C.red} strokeWidth={2} />
              <text x={140} y={120} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                DROPOUT (p = 0.1)
              </text>

              {/* Arrow */}
              <line x1={140} y1={130} x2={140} y2={145} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Add & Norm */}
              <rect
                x={60}
                y={145}
                width={160}
                height={30}
                rx={6}
                fill={`${C.blue}15`}
                stroke={C.blue}
                strokeWidth={1.5}
              />
              <text x={140} y={165} fill={C.blue} fontSize={11} textAnchor="middle" fontWeight={600}>
                Add & Norm
              </text>

              {/* Arrow */}
              <line x1={140} y1={175} x2={140} y2={190} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* FFN */}
              <rect
                x={50}
                y={190}
                width={180}
                height={35}
                rx={6}
                fill={`${C.yellow}15`}
                stroke={C.yellow}
                strokeWidth={1.5}
              />
              <text x={140} y={212} fill={C.yellow} fontSize={11} textAnchor="middle" fontWeight={600}>
                Feed-Forward Network
              </text>

              {/* Arrow */}
              <line x1={140} y1={225} x2={140} y2={240} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* DROPOUT 2 */}
              <rect x={60} y={240} width={160} height={30} rx={6} fill={`${C.red}25`} stroke={C.red} strokeWidth={2} />
              <text x={140} y={260} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                DROPOUT (p = 0.1)
              </text>

              {/* Arrow */}
              <line x1={140} y1={270} x2={140} y2={285} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Add & Norm 2 */}
              <rect
                x={60}
                y={285}
                width={160}
                height={30}
                rx={6}
                fill={`${C.blue}15`}
                stroke={C.blue}
                strokeWidth={1.5}
              />
              <text x={140} y={305} fill={C.blue} fontSize={11} textAnchor="middle" fontWeight={600}>
                Add & Norm
              </text>
            </svg>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffcc80" size={16}>
              Typical dropout rate in transformers: p = 0.1 (drop only 10%). This is much lower than the 0.5 used in
              earlier networks because transformers are already heavily regularized by their architecture.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 6 && (
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
