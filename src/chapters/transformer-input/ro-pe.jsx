import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function RoPE(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Clock-face SVG: Q = [0.8, 0.6] rotated at 4 positions with f = 0.3 rad/pos.
  const RotationClock = () => (
    <svg width="280" height="280" viewBox="-140 -140 280 280" style={{ maxWidth: "100%" }}>
      <desc>
        Clock-face diagram showing a 2D query vector Q = [0.8, 0.6] rotated by position times frequency. Four labeled
        arrows spread counter-clockwise across the upper quadrant of a dashed unit circle, representing the same vector
        at positions 0, 1, 2, and 3.
      </desc>
      <defs>
        {[
          { id: "ropeArrBr", color: C.bright },
          { id: "ropeArrCy", color: C.cyan },
          { id: "ropeArrYe", color: C.yellow },
          { id: "ropeArrGr", color: C.green },
        ].map(({ id, color }) => (
          <marker key={id} id={id} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={color} />
          </marker>
        ))}
      </defs>
      <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="-115" y1="0" x2="115" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="0" y1="-115" x2="0" y2="115" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="120" y="4" fontSize="11" fill={C.dim}>
        x
      </text>
      <text x="0" y="-120" fontSize="11" fill={C.dim} textAnchor="middle">
        y
      </text>
      <path
        d="M 66,-49 A 82,82 0 0,1 2,-82"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeDasharray="2,3"
      />
      <line x1="0" y1="0" x2="66" y2="-49" stroke={C.bright} strokeWidth="2.5" markerEnd="url(#ropeArrBr)" />
      <text x="86" y="-48" fontSize="12" fill={C.bright} fontWeight="700" textAnchor="middle">
        pos 0
      </text>
      <text x="86" y="-34" fontSize="10" fill={C.dim} textAnchor="middle">
        angle 0
      </text>
      <line x1="0" y1="0" x2="48" y2="-66" stroke={C.cyan} strokeWidth="2.5" markerEnd="url(#ropeArrCy)" />
      <text x="68" y="-78" fontSize="12" fill={C.cyan} fontWeight="700" textAnchor="middle">
        pos 1
      </text>
      <text x="68" y="-64" fontSize="10" fill={C.dim} textAnchor="middle">
        0.3 rad
      </text>
      <line x1="0" y1="0" x2="26" y2="-78" stroke={C.yellow} strokeWidth="2.5" markerEnd="url(#ropeArrYe)" />
      <text x="38" y="-100" fontSize="12" fill={C.yellow} fontWeight="700" textAnchor="middle">
        pos 2
      </text>
      <text x="38" y="-86" fontSize="10" fill={C.dim} textAnchor="middle">
        0.6 rad
      </text>
      <line x1="0" y1="0" x2="2" y2="-82" stroke={C.green} strokeWidth="2.5" markerEnd="url(#ropeArrGr)" />
      <text x="3" y="-118" fontSize="12" fill={C.green} fontWeight="700" textAnchor="middle">
        pos 3
      </text>
      <text x="3" y="-104" fontSize="10" fill={C.dim} textAnchor="middle">
        0.9 rad
      </text>
    </svg>
  );

  const PairFrequencyClocks = () => {
    const faces = [
      { cx: -140, label: "Pair 0", freq: "fast", color: C.red, end: { x: -30, y: -24 }, angle: "2.5 rad (143 deg)" },
      { cx: 0, label: "Pair 10", freq: "medium", color: C.yellow, end: { x: 33, y: -18 }, angle: "0.5 rad (29 deg)" },
      { cx: 140, label: "Pair 60", freq: "slow", color: C.purple, end: { x: 38, y: -2 }, angle: "0.05 rad (3 deg)" },
    ];
    return (
      <svg width="420" height="170" viewBox="-210 -80 420 170" style={{ maxWidth: "100%" }}>
        <desc>
          Three mini clock faces side by side showing pair 0 rotating fast, pair 10 rotating medium, and pair 60
          rotating slow. Each face has a vector at position 0 and position 10 to illustrate that early pairs rotate
          through large angles while late pairs barely move across the same 10 positions.
        </desc>
        {faces.map(({ cx, label, freq, color, end, angle }) => (
          <g key={label} transform={`translate(${cx},0)`}>
            <circle
              cx="0"
              cy="0"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="2,3"
            />
            <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="0" y1="0" x2="38" y2="0" stroke={C.bright} strokeWidth="2" />
            <text x="44" y="4" fontSize="9" fill={C.bright}>
              pos 0
            </text>
            <line x1="0" y1="0" x2={end.x} y2={end.y} stroke={color} strokeWidth="2.5" />
            <text x="0" y="58" fontSize="13" fill={color} fontWeight="700" textAnchor="middle">
              {label}
            </text>
            <text x="0" y="73" fontSize="10" fill={C.dim} textAnchor="middle">
              {freq}
            </text>
            <text x="0" y="86" fontSize="10" fill={color} textAnchor="middle">
              after 10 steps: {angle}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const TwoScenarioClocks = () => (
    <svg width="440" height="260" viewBox="0 0 440 260" style={{ maxWidth: "100%" }}>
      <desc>
        Two side-by-side clock faces comparing near versus far scenarios in RoPE. The left clock shows Query at position
        3 and Key at position 0; the right clock shows Query at position 10 and Key at position 7. In both cases the
        angular gap between the Q and K hands is the same 0.9 radians, illustrating that RoPE gives the same attention
        score whenever the relative distance is the same, regardless of absolute positions.
      </desc>
      <defs>
        <marker id="rsArrR" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={C.red} />
        </marker>
        <marker id="rsArrB" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={C.blue} />
        </marker>
      </defs>

      <text x="110" y="18" fontSize="13" fontWeight="700" fill={C.cyan} textAnchor="middle">
        Near: Q at pos 3, K at pos 0
      </text>
      <text x="330" y="18" fontSize="13" fontWeight="700" fill={C.cyan} textAnchor="middle">
        Far: Q at pos 10, K at pos 7
      </text>

      <circle
        cx="110"
        cy="120"
        r="70"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <line x1="30" y1="120" x2="190" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="110" y1="40" x2="110" y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="110" y1="120" x2="154" y2="65" stroke={C.red} strokeWidth="3" markerEnd="url(#rsArrR)" />
      <text x="160" y="58" fontSize="11" fontWeight="700" fill={C.red}>
        Q (pos 3)
      </text>
      <line x1="110" y1="120" x2="180" y2="120" stroke={C.blue} strokeWidth="3" markerEnd="url(#rsArrB)" />
      <text x="187" y="124" fontSize="11" fontWeight="700" fill={C.blue}>
        K (pos 0)
      </text>
      <path d="M 140,120 A 30,30 0 0,0 129,97" fill="none" stroke={C.yellow} strokeWidth="2.5" />
      <text x="152" y="106" fontSize="11" fontWeight="700" fill={C.yellow}>
        gap
      </text>

      <text x="110" y="225" fontSize="12" fill={C.mid} textAnchor="middle">
        Q spun 0.9 rad {"·"} K spun 0 rad
      </text>
      <text x="110" y="245" fontSize="13" fontWeight="700" fill={C.yellow} textAnchor="middle">
        gap between Q and K: 0.9 rad
      </text>

      <circle
        cx="330"
        cy="120"
        r="70"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <line x1="250" y1="120" x2="410" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="330" y1="40" x2="330" y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="330" y1="120" x2="261" y2="110" stroke={C.red} strokeWidth="3" markerEnd="url(#rsArrR)" />
      <text x="254" y="105" fontSize="11" fontWeight="700" fill={C.red} textAnchor="end">
        Q (pos 10)
      </text>
      <line x1="330" y1="120" x2="295" y2="60" stroke={C.blue} strokeWidth="3" markerEnd="url(#rsArrB)" />
      <text x="290" y="52" fontSize="11" fontWeight="700" fill={C.blue} textAnchor="end">
        K (pos 7)
      </text>
      <path d="M 315,94 A 30,30 0 0,0 300,116" fill="none" stroke={C.yellow} strokeWidth="2.5" />
      <text x="297" y="88" fontSize="11" fontWeight="700" fill={C.yellow} textAnchor="end">
        gap
      </text>

      <text x="330" y="225" fontSize="12" fill={C.mid} textAnchor="middle">
        Q spun 3.0 rad {"·"} K spun 2.1 rad
      </text>
      <text x="330" y="245" fontSize="13" fontWeight="700" fill={C.yellow} textAnchor="middle">
        gap between Q and K: 0.9 rad
      </text>
    </svg>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The problem with sinusoidal position encoding
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Recall chapters <ChapterLink to="8.3">8.3</ChapterLink>-<ChapterLink to="8.7">8.7</ChapterLink>: we compute a position vector using sin/cos and <strong>ADD</strong> it to each
            embedding. This gives every token a unique position signal.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            But there are two fundamental problems:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold size={16}>
                Problem 1: Absolute positioning
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                Position 5 always gets the same encoding vector, regardless of context. But "cats" at position 5 in a
                10-word sentence and "cats" at position 5 in a 1000-word sentence should feel different - the relative
                context is different.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold size={16}>
                Problem 2: Fixed length
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                If we train on sequences up to 2048 tokens, what happens at position 2049? The model has never seen that
                position encoding. Performance degrades badly - the model cannot extrapolate to longer contexts.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            RoPE (Rotary Position Embedding) solves both problems with a single elegant idea.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Think of each vector as a clock hand
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Picture every word's Query (and Key) vector as a clock hand. RoPE doesn't <strong>add</strong> anything to
            it - it simply <strong>turns</strong> the hand. How far? An angle equal to{" "}
            <strong>position {"·"} frequency</strong>. Position 1 is a small turn, position 10 is a bigger turn,
            position 100 is a huge turn.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            No new numbers are bolted on. No dimensions are inflated. The hand just points somewhere else.
          </T>

          <T color="#80e8a5" bold center size={17} style={{ marginTop: 14 }}>
            See it turn: Q = [0.8, 0.6], f = 0.3 rad per step
          </T>
          <T color={C.dim} size={14} center style={{ marginTop: 2 }}>
            Same vector, 4 different positions. Watch the hand sweep counter-clockwise.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <RotationClock />
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 90px 1fr",
                gap: 6,
                padding: "4px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <T color={C.mid} bold size={13}>
                pos
              </T>
              <T color={C.mid} bold size={13}>
                angle (rad)
              </T>
              <T color={C.mid} bold size={13}>
                rotated Q
              </T>
            </div>
            {[
              { p: 0, a: "0.0", q: "[0.800, 0.600]", color: C.bright },
              { p: 1, a: "0.3", q: "[0.587, 0.810]", color: C.cyan },
              { p: 2, a: "0.6", q: "[0.321, 0.947]", color: C.yellow },
              { p: 3, a: "0.9", q: "[0.027, 1.000]", color: C.green },
            ].map(({ p, a, q, color }) => (
              <div key={p} style={{ display: "grid", gridTemplateColumns: "60px 90px 1fr", gap: 6, padding: "4px 0" }}>
                <T color={color} bold size={14}>
                  {p}
                </T>
                <T color={C.bright} size={14}>
                  {a}
                </T>
                <T color={color} size={14}>
                  {q}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={15}>
              Key property: turning preserves length
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              All four rotated vectors still have the same length (1.0 in this example). Turning only changes{" "}
              <strong>direction</strong>, not length. Sinusoidal PE, by contrast, adds a position vector that changes
              both direction and length.
            </T>
          </div>

          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer", color: C.dim, fontSize: 13 }}>
              For the curious: the 2D rotation formula
            </summary>
            <div
              style={{
                marginTop: 6,
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.3)",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              <T color={C.bright} size={14} center style={{ lineHeight: 1.9 }}>
                R(t) {"·"} [q1, q2] = [q1 cos(t) - q2 sin(t), &nbsp; q1 sin(t) + q2 cos(t)]
              </T>
              <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                where t = position {"·"} frequency
              </T>
            </div>
          </details>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The magic: only the gap between Q and K matters
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The attention score between two words is just the dot product of their clock hands. And the dot product only
            cares about <strong>one thing</strong>: the angle between the two hands. Same angle = same score, no matter
            where the hands are pointing absolutely.
          </T>

          <T color="#ffe082" style={{ marginTop: 8 }}>
            Since RoPE spins both Q and K by their <strong>own</strong> positions, the common spin cancels out. Only the
            gap (position difference) is left. Watch two very different scenarios land on the same answer:
          </T>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <TwoScenarioClocks />
          </div>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold size={15}>
                Near (pos 3, pos 0)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                gap = 0.9 rad (same for both)
              </T>
              <T color={C.yellow} bold size={18} style={{ marginTop: 4 }}>
                score = cos(0.9) {"≈"} 0.62
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold size={15}>
                Far (pos 10, pos 7)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                gap = 0.9 rad (same for both)
              </T>
              <T color={C.yellow} bold size={18} style={{ marginTop: 4 }}>
                score = cos(0.9) {"≈"} 0.62
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold size={16}>
              Why the common spin cancels (one-line intuition)
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Imagine both Q and K are glued to the same spinning turntable. Whether the turntable is at position 0 or
              at position 97, the <strong>relative</strong> angle between Q and K on the table never changes. The dot
              product only sees that relative angle, so the score stays the same. The absolute rotation is invisible to
              attention.
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              The model gets <strong>relative position</strong> for free, with zero extra parameters.
            </T>
          </div>

          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer", color: C.dim, fontSize: 13 }}>
              For the curious: the actual algebra
            </summary>
            <div
              style={{
                marginTop: 6,
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              <T color={C.dim} size={13}>
                Q at position m is rotated by angle m{"·"}f. K at position n is rotated by n{"·"}f. Their dot product
                becomes:
              </T>
              <T color={C.bright} size={13} center style={{ marginTop: 6 }}>
                (R(m{"·"}f) Q) {"·"} (R(n{"·"}f) K) = Q {"·"} R((n - m){"·"}f) K
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                Rotation matrices are orthogonal, so R(a){"ᵀ"} R(b) = R(b - a). Only the gap (n - m) survives. For unit
                vectors at angular gap {"Δ"}, the dot product is exactly cos({"Δ"}).
              </T>
            </div>
          </details>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            How it works in practice
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Real embeddings have 128 dims (or more), not 2. RoPE handles this by processing dimensions{" "}
            <strong>in pairs</strong>, and each pair rotates at its own <strong>frequency</strong>. Fast frequencies for
            early pairs, slow ones for late pairs:
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
            <PairFrequencyClocks />
          </div>
          <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
            Each mini clock is one (x, y) pair out of 64. The white arrow is the pair at position 0; the colored arrow
            is the same pair at position 10. Fast pairs rotate far; slow pairs barely move.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
              <T color={C.bright} bold center size={15}>
                128-dim vector split into 64 pairs
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { pair: "(d0, d1)", freq: "fast", color: C.red },
                  { pair: "(d2, d3)", freq: "fast", color: C.orange },
                  { pair: "(d4, d5)", freq: "medium", color: C.yellow },
                  { pair: "...", freq: "", color: C.dim },
                  { pair: "(d124, d125)", freq: "slow", color: C.blue },
                  { pair: "(d126, d127)", freq: "very slow", color: C.purple },
                ].map(({ pair, freq, color }) => (
                  <div
                    key={pair}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${color}10`,
                      border: `1px solid ${color}20`,
                    }}
                  >
                    <T color={color} bold size={14} center>
                      {pair}
                    </T>
                    {freq && (
                      <T color={C.dim} size={11} center>
                        {freq}
                      </T>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <T color="#80deea" style={{ marginTop: 4 }}>
              Each pair gets its own 2D rotation. The key: each pair rotates at a <strong>different frequency</strong>,
              just like sinusoidal PE's fast and slow dimensions.
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                }}
              >
                <T color={C.red} bold size={15}>
                  Early pairs (d0, d1): rotate FAST
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  High frequency - sensitive to nearby position differences. "Is the next word 1 or 2 positions away?"
                </T>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                }}
              >
                <T color={C.purple} bold size={15}>
                  Late pairs (d126, d127): rotate SLOW
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  Low frequency - sensitive to distant position differences. "Is this word 500 or 1000 positions away?"
                </T>
              </div>
            </div>
            <T color="#80deea" style={{ marginTop: 6 }}>
              The frequency formula is the same idea as sinusoidal PE: f_i = 1 / 10000^(2i/d), where i is the pair index
              and d is the total dimension. Pair 0 rotates fastest, pair 63 rotates slowest.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Why RoPE won
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr 1fr",
                gap: 6,
                padding: "8px 10px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <T color={C.bright} bold size={14}></T>
              <T color={C.red} bold center size={14}>
                Sinusoidal
              </T>
              <T color={C.blue} bold center size={14}>
                Learned PE
              </T>
              <T color={C.green} bold center size={14}>
                RoPE
              </T>
            </div>
            {[
              { label: "Type", sin: "Absolute", learned: "Absolute", rope: "Relative" },
              {
                label: "Applied to",
                sin: "Embedding (add)",
                learned: "Embedding (add)",
                rope: "Q and K only (rotate)",
              },
              { label: "Max length", sin: "Fixed at training", learned: "Fixed at training", rope: "Can extrapolate" },
              {
                label: "Extrapolation",
                sin: "Fails beyond max",
                learned: "Fails beyond max",
                rope: "Works with scaling tricks",
              },
              { label: "Parameters", sin: "0 (fixed formula)", learned: "pos x dim", rope: "0 (fixed formula)" },
            ].map(({ label, sin, learned, rope }) => (
              <div
                key={label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr 1fr 1fr",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <T color={C.mid} bold size={13}>
                  {label}
                </T>
                <T color={C.dim} size={13}>
                  {sin}
                </T>
                <T color={C.dim} size={13}>
                  {learned}
                </T>
                <T color={C.dim} size={13}>
                  {rope}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              RoPE extrapolation: NTK-aware scaling
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              If a model trained on 4096 tokens needs to handle 16384, you can scale the rotation frequencies by a
              factor. The "NTK-aware" variant adjusts different frequency bands differently - slowing down the
              fast-rotating pairs while keeping the slow ones nearly unchanged. This extends context length 4x or more
              with minimal quality loss.
            </T>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              Models using RoPE
            </T>
            <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
              {["LLaMA", "LLaMA 2", "LLaMA 3", "Mistral", "Qwen", "GPT-NeoX", "PaLM"].map((m) => (
                <div
                  key={m}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 5,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}25`,
                  }}
                >
                  <T color={C.orange} bold size={14}>
                    {m}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Nearly every modern open-source LLM uses RoPE. It has become the default choice for position encoding
              since 2022.
            </T>
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
