import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function FullArchitecture(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const ArchDiagram = () => (
    <svg width="420" height="580" viewBox="0 0 420 580" style={{ maxWidth: "100%", overflow: "visible" }}>
      <desc>
        Complete Transformer architecture diagram showing encoder and decoder halves with multi-head attention, add and
        norm, FFN layers, positional encoding, embeddings, residual connections, and output head
      </desc>
      <defs>
        <marker id="arrowW" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="rgba(255,255,255,0.45)" />
        </marker>
        <marker id="arrowG" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill={`${C.green}90`} />
        </marker>
      </defs>

      {/* ═══ ENCODER (left) ═══ */}
      <text x="107" y="16" fill={C.cyan} fontSize="12" textAnchor="middle" fontWeight="700">
        ENCODER
      </text>

      {/* Encoder outer stack box */}
      <rect
        x="22"
        y="188"
        width="170"
        height="240"
        rx="12"
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
        strokeDasharray="6,3"
      />
      <text x="180" y="420" fill={C.dim} fontSize="9" textAnchor="end">
        ×N
      </text>

      {/* --- Encoder boxes (bottom to top) --- */}
      {/* E: Multi-Head Attention */}
      <rect
        x="45"
        y="350"
        width="125"
        height="44"
        rx="8"
        fill="rgba(0,184,212,0.15)"
        stroke={C.cyan}
        strokeWidth="1.5"
      />
      <text x="107" y="368" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">
        Multi-Head
      </text>
      <text x="107" y="382" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">
        Attention
      </text>

      {/* E: Add & Norm 1 (above attention) */}
      <rect
        x="45"
        y="306"
        width="125"
        height="26"
        rx="6"
        fill="rgba(255,165,0,0.12)"
        stroke="#ff9800"
        strokeWidth="1.2"
      />
      <text x="107" y="323" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">
        Add & Norm
      </text>

      {/* E: FFN */}
      <rect
        x="45"
        y="256"
        width="125"
        height="36"
        rx="8"
        fill="rgba(100,149,237,0.12)"
        stroke="cornflowerblue"
        strokeWidth="1.2"
      />
      <text x="107" y="271" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">
        Point-wise
      </text>
      <text x="107" y="284" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">
        FFN
      </text>

      {/* E: Add & Norm 2 (above FFN) */}
      <rect
        x="45"
        y="212"
        width="125"
        height="26"
        rx="6"
        fill="rgba(255,165,0,0.12)"
        stroke="#ff9800"
        strokeWidth="1.2"
      />
      <text x="107" y="229" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">
        Add & Norm
      </text>

      {/* --- Encoder MAIN flow arrows (bottom to top, center) --- */}
      {/* Input area → Attention */}
      <line
        x1="107"
        y1="430"
        x2="107"
        y2="396"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Attention → Add&Norm1 */}
      <line
        x1="107"
        y1="350"
        x2="107"
        y2="334"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Add&Norm1 → FFN */}
      <line
        x1="107"
        y1="306"
        x2="107"
        y2="294"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* FFN → Add&Norm2 */}
      <line
        x1="107"
        y1="256"
        x2="107"
        y2="240"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Add&Norm2 → out of stack */}
      <line
        x1="107"
        y1="212"
        x2="107"
        y2="185"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />

      {/* --- Encoder RESIDUAL skip connections --- */}
      {/* Skip around Attention: from below attention, go left, up to Add&Norm1 */}
      <path
        d="M45,396 L30,396 L30,319 L43,319"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Skip around FFN: from below FFN (=Add&Norm1 out), go left, up to Add&Norm2 */}
      <path
        d="M45,294 L30,294 L30,225 L43,225"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />

      {/* --- Encoder bottom: Positional Encoding + Embedding --- */}
      <circle
        cx="107"
        cy="448"
        r="14"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
      />
      <text x="107" y="452" fill="rgba(255,255,255,0.5)" fontSize="14" textAnchor="middle">
        ⊕
      </text>
      <text x="27" y="448" fill={C.dim} fontSize="8" textAnchor="middle">
        Positional
      </text>
      <text x="27" y="459" fill={C.dim} fontSize="8" textAnchor="middle">
        Encoding
      </text>
      <line
        x1="50"
        y1="448"
        x2="91"
        y2="448"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
        markerEnd="url(#arrowW)"
      />

      <rect
        x="57"
        y="480"
        width="100"
        height="34"
        rx="8"
        fill="rgba(0,230,118,0.12)"
        stroke={C.green}
        strokeWidth="1.5"
      />
      <text x="107" y="493" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">
        Encoder
      </text>
      <text x="107" y="506" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">
        Embedding
      </text>

      {/* Embedding → ⊕ */}
      <line
        x1="107"
        y1="480"
        x2="107"
        y2="464"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Inputs label */}
      <text x="107" y="540" fill={C.dim} fontSize="11" textAnchor="middle">
        Inputs
      </text>
      <line
        x1="107"
        y1="530"
        x2="107"
        y2="516"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
        markerEnd="url(#arrowW)"
      />

      {/* ═══ DECODER (right) ═══ */}
      <text x="380" y="6" fill={C.red} fontSize="12" textAnchor="middle" fontWeight="700">
        DECODER
      </text>

      {/* Output head: Linear & SoftMax */}
      <rect
        x="252"
        y="34"
        width="120"
        height="36"
        rx="8"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />
      <text x="312" y="49" fill={C.bright} fontSize="10" textAnchor="middle" fontWeight="700">
        Linear &
      </text>
      <text x="312" y="62" fill={C.bright} fontSize="10" textAnchor="middle" fontWeight="700">
        SoftMax
      </text>
      <text x="312" y="27" fill={C.dim} fontSize="9" textAnchor="middle">
        Output Probabilities
      </text>
      <line
        x1="312"
        y1="34"
        x2="312"
        y2="8"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.2"
        markerEnd="url(#arrowW)"
      />

      {/* Decoder outer stack box */}
      <rect
        x="228"
        y="86"
        width="170"
        height="340"
        rx="12"
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
        strokeDasharray="6,3"
      />
      <text x="386" y="420" fill={C.dim} fontSize="9" textAnchor="end">
        ×N
      </text>

      {/* --- Decoder boxes (bottom to top) --- */}
      {/* D: Masked Multi-Head Attention */}
      <rect
        x="252"
        y="348"
        width="125"
        height="44"
        rx="8"
        fill="rgba(255,152,0,0.12)"
        stroke="#ff9800"
        strokeWidth="1.5"
      />
      <text x="314" y="364" fill="#ff9800" fontSize="9" textAnchor="middle" fontWeight="700">
        Masked
      </text>
      <text x="314" y="377" fill="#ff9800" fontSize="9" textAnchor="middle" fontWeight="700">
        Multi-Head Attn
      </text>

      {/* D: Add & Norm 1 (above masked attn) */}
      <rect
        x="252"
        y="306"
        width="125"
        height="26"
        rx="6"
        fill="rgba(255,165,0,0.12)"
        stroke="#ff9800"
        strokeWidth="1.2"
      />
      <text x="314" y="323" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">
        Add & Norm
      </text>

      {/* D: Cross-Attention (Multi-Head Attention) */}
      <rect
        x="252"
        y="250"
        width="125"
        height="44"
        rx="8"
        fill="rgba(0,184,212,0.15)"
        stroke={C.cyan}
        strokeWidth="1.5"
      />
      <text x="314" y="268" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">
        Multi-Head
      </text>
      <text x="314" y="282" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">
        Attention
      </text>

      {/* D: Add & Norm 2 (above cross-attn) */}
      <rect
        x="252"
        y="210"
        width="125"
        height="26"
        rx="6"
        fill="rgba(255,165,0,0.12)"
        stroke="#ff9800"
        strokeWidth="1.2"
      />
      <text x="314" y="227" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">
        Add & Norm
      </text>

      {/* D: FFN */}
      <rect
        x="252"
        y="160"
        width="125"
        height="36"
        rx="8"
        fill="rgba(100,149,237,0.12)"
        stroke="cornflowerblue"
        strokeWidth="1.2"
      />
      <text x="314" y="175" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">
        Point-wise
      </text>
      <text x="314" y="188" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">
        FFN
      </text>

      {/* D: Add & Norm 3 (above FFN) */}
      <rect
        x="252"
        y="118"
        width="125"
        height="26"
        rx="6"
        fill="rgba(255,165,0,0.12)"
        stroke="#ff9800"
        strokeWidth="1.2"
      />
      <text x="314" y="135" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">
        Add & Norm
      </text>

      {/* --- Decoder MAIN flow arrows (bottom to top, center) --- */}
      {/* Input area → Masked Attn */}
      <line
        x1="314"
        y1="430"
        x2="314"
        y2="394"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Masked Attn → Add&Norm1 */}
      <line
        x1="314"
        y1="348"
        x2="314"
        y2="334"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Add&Norm1 → Cross-Attn */}
      <line
        x1="314"
        y1="306"
        x2="314"
        y2="296"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Cross-Attn → Add&Norm2 */}
      <line
        x1="314"
        y1="250"
        x2="314"
        y2="238"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Add&Norm2 → FFN */}
      <line
        x1="314"
        y1="210"
        x2="314"
        y2="198"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* FFN → Add&Norm3 */}
      <line
        x1="314"
        y1="160"
        x2="314"
        y2="146"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Add&Norm3 → out of stack → Linear */}
      <line x1="314" y1="118" x2="314" y2="86" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <line
        x1="314"
        y1="86"
        x2="314"
        y2="72"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />

      {/* --- Decoder RESIDUAL skip connections --- */}
      {/* Skip around Masked Attn: left side, from below masked attn up to Add&Norm1 */}
      <path
        d="M252,394 L236,394 L236,319 L250,319"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Skip around Cross-Attn: left side, from below cross-attn up to Add&Norm2 */}
      <path
        d="M252,296 L236,296 L236,223 L250,223"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Skip around FFN: left side, from below FFN up to Add&Norm3 */}
      <path
        d="M252,198 L236,198 L236,131 L250,131"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />

      {/* --- CROSS-ATTENTION: Encoder output → Decoder cross-attention --- */}
      {/* Encoder top output goes right to decoder cross-attention */}
      <path
        d="M107,185 L107,172 L210,172 L210,272 L250,272"
        fill="none"
        stroke={`${C.green}55`}
        strokeWidth="2"
        markerEnd="url(#arrowG)"
      />
      <text x="160" y="166" fill={`${C.green}70`} fontSize="8" textAnchor="middle">
        K, V from encoder
      </text>

      {/* --- Decoder bottom: Positional Encoding + Embedding --- */}
      <circle
        cx="314"
        cy="448"
        r="14"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
      />
      <text x="314" y="452" fill="rgba(255,255,255,0.5)" fontSize="14" textAnchor="middle">
        ⊕
      </text>
      <text x="393" y="448" fill={C.dim} fontSize="8" textAnchor="middle">
        Positional
      </text>
      <text x="393" y="459" fill={C.dim} fontSize="8" textAnchor="middle">
        Encoding
      </text>
      <line
        x1="374"
        y1="448"
        x2="330"
        y2="448"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
        markerEnd="url(#arrowW)"
      />

      <rect
        x="264"
        y="480"
        width="100"
        height="34"
        rx="8"
        fill="rgba(0,230,118,0.12)"
        stroke={C.green}
        strokeWidth="1.5"
      />
      <text x="314" y="493" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">
        Decoder
      </text>
      <text x="314" y="506" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">
        Embedding
      </text>

      {/* Embedding → ⊕ */}
      <line
        x1="314"
        y1="480"
        x2="314"
        y2="464"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        markerEnd="url(#arrowW)"
      />
      {/* Outputs label */}
      <text x="314" y="540" fill={C.dim} fontSize="10" textAnchor="middle">
        Outputs
      </text>
      <text x="314" y="553" fill={C.dim} fontSize="10" textAnchor="middle">
        (shifted right)
      </text>
      <line
        x1="314"
        y1="530"
        x2="314"
        y2="516"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.2"
        markerEnd="url(#arrowW)"
      />
    </svg>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <T center color={C.mid} size={19}>
          The complete Transformer - matching your original diagram:
        </T>
      )}
      {sub >= 0 && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: 14,
            padding: "10px 4px",
            border: `1px solid ${C.border}`,
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ArchDiagram />
        </div>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            🔍 Let's zoom into the bottom first - the green "Embedding" boxes.
          </T>
          <T color="#80e8a5">This is where words enter the Transformer as numbers.</T>
          <T color={C.dim} size={14} style={{ marginTop: 8 }}>
            The diagram shows both an Encoder and a Decoder side - we will learn what these are and how they differ in
            Sections 8 and 9. For now, focus on the building blocks inside each block: Attention, Add & Norm, and FFN.
          </T>
        </Box>
      </Reveal>
      {sub < 1 && (
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
