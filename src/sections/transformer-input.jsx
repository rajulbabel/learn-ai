import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";
export const FullArchitecture = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const ArchDiagram = () => (
    <svg width="420" height="580" viewBox="0 0 420 580" style={{ maxWidth: "100%", overflow: "visible" }}>
      <defs>
        <marker id="arrowW" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="rgba(255,255,255,0.45)" /></marker>
        <marker id="arrowG" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill={`${C.green}90`} /></marker>
      </defs>

      {/* ═══ ENCODER (left) ═══ */}
      <text x="107" y="16" fill={C.cyan} fontSize="12" textAnchor="middle" fontWeight="700">ENCODER</text>

      {/* Encoder outer stack box */}
      <rect x="22" y="188" width="170" height="240" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="6,3" />
      <text x="180" y="420" fill={C.dim} fontSize="9" textAnchor="end">×N</text>

      {/* --- Encoder boxes (bottom to top) --- */}
      {/* E: Multi-Head Attention */}
      <rect x="45" y="350" width="125" height="44" rx="8" fill="rgba(0,184,212,0.15)" stroke={C.cyan} strokeWidth="1.5" />
      <text x="107" y="368" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Multi-Head</text>
      <text x="107" y="382" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Attention</text>

      {/* E: Add & Norm 1 (above attention) */}
      <rect x="45" y="306" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
      <text x="107" y="323" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

      {/* E: FFN */}
      <rect x="45" y="256" width="125" height="36" rx="8" fill="rgba(100,149,237,0.12)" stroke="cornflowerblue" strokeWidth="1.2" />
      <text x="107" y="271" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">Point-wise</text>
      <text x="107" y="284" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">FFN</text>

      {/* E: Add & Norm 2 (above FFN) */}
      <rect x="45" y="212" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
      <text x="107" y="229" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

      {/* --- Encoder MAIN flow arrows (bottom to top, center) --- */}
      {/* Input area → Attention */}
      <line x1="107" y1="430" x2="107" y2="396" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Attention → Add&Norm1 */}
      <line x1="107" y1="350" x2="107" y2="334" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Add&Norm1 → FFN */}
      <line x1="107" y1="306" x2="107" y2="294" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* FFN → Add&Norm2 */}
      <line x1="107" y1="256" x2="107" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Add&Norm2 → out of stack */}
      <line x1="107" y1="212" x2="107" y2="185" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

      {/* --- Encoder RESIDUAL skip connections --- */}
      {/* Skip around Attention: from below attention, go left, up to Add&Norm1 */}
      <path d="M45,396 L30,396 L30,319 L43,319" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Skip around FFN: from below FFN (=Add&Norm1 out), go left, up to Add&Norm2 */}
      <path d="M45,294 L30,294 L30,225 L43,225" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

      {/* --- Encoder bottom: Positional Encoding + Embedding --- */}
      <circle cx="107" cy="448" r="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
      <text x="107" y="452" fill="rgba(255,255,255,0.5)" fontSize="14" textAnchor="middle">⊕</text>
      <text x="27" y="448" fill={C.dim} fontSize="8" textAnchor="middle">Positional</text>
      <text x="27" y="459" fill={C.dim} fontSize="8" textAnchor="middle">Encoding</text>
      <line x1="50" y1="448" x2="91" y2="448" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />

      <rect x="57" y="480" width="100" height="34" rx="8" fill="rgba(0,230,118,0.12)" stroke={C.green} strokeWidth="1.5" />
      <text x="107" y="493" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Encoder</text>
      <text x="107" y="506" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Embedding</text>

      {/* Embedding → ⊕ */}
      <line x1="107" y1="480" x2="107" y2="464" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Inputs label */}
      <text x="107" y="540" fill={C.dim} fontSize="11" textAnchor="middle">Inputs</text>
      <line x1="107" y1="530" x2="107" y2="516" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />


      {/* ═══ DECODER (right) ═══ */}
      <text x="312" y="16" fill={C.red} fontSize="12" textAnchor="middle" fontWeight="700">DECODER</text>

      {/* Output head: Linear & SoftMax */}
      <rect x="252" y="34" width="120" height="36" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <text x="312" y="49" fill={C.bright} fontSize="10" textAnchor="middle" fontWeight="700">Linear &</text>
      <text x="312" y="62" fill={C.bright} fontSize="10" textAnchor="middle" fontWeight="700">SoftMax</text>
      <text x="312" y="26" fill={C.dim} fontSize="9" textAnchor="middle">Output Probabilities</text>
      <line x1="312" y1="26" x2="312" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" markerEnd="url(#arrowW)" />

      {/* Decoder outer stack box */}
      <rect x="228" y="86" width="170" height="340" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="6,3" />
      <text x="386" y="420" fill={C.dim} fontSize="9" textAnchor="end">×N</text>

      {/* --- Decoder boxes (bottom to top) --- */}
      {/* D: Masked Multi-Head Attention */}
      <rect x="252" y="348" width="125" height="44" rx="8" fill="rgba(255,152,0,0.12)" stroke="#ff9800" strokeWidth="1.5" />
      <text x="314" y="364" fill="#ff9800" fontSize="9" textAnchor="middle" fontWeight="700">Masked</text>
      <text x="314" y="377" fill="#ff9800" fontSize="9" textAnchor="middle" fontWeight="700">Multi-Head Attn</text>

      {/* D: Add & Norm 1 (above masked attn) */}
      <rect x="252" y="306" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
      <text x="314" y="323" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

      {/* D: Cross-Attention (Multi-Head Attention) */}
      <rect x="252" y="250" width="125" height="44" rx="8" fill="rgba(0,184,212,0.15)" stroke={C.cyan} strokeWidth="1.5" />
      <text x="314" y="268" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Multi-Head</text>
      <text x="314" y="282" fill={C.cyan} fontSize="10" textAnchor="middle" fontWeight="700">Attention</text>

      {/* D: Add & Norm 2 (above cross-attn) */}
      <rect x="252" y="210" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
      <text x="314" y="227" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

      {/* D: FFN */}
      <rect x="252" y="160" width="125" height="36" rx="8" fill="rgba(100,149,237,0.12)" stroke="cornflowerblue" strokeWidth="1.2" />
      <text x="314" y="175" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">Point-wise</text>
      <text x="314" y="188" fill="cornflowerblue" fontSize="10" textAnchor="middle" fontWeight="700">FFN</text>

      {/* D: Add & Norm 3 (above FFN) */}
      <rect x="252" y="118" width="125" height="26" rx="6" fill="rgba(255,165,0,0.12)" stroke="#ff9800" strokeWidth="1.2" />
      <text x="314" y="135" fill="#ff9800" fontSize="10" textAnchor="middle" fontWeight="600">Add & Norm</text>

      {/* --- Decoder MAIN flow arrows (bottom to top, center) --- */}
      {/* Input area → Masked Attn */}
      <line x1="314" y1="430" x2="314" y2="394" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Masked Attn → Add&Norm1 */}
      <line x1="314" y1="348" x2="314" y2="334" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Add&Norm1 → Cross-Attn */}
      <line x1="314" y1="306" x2="314" y2="296" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Cross-Attn → Add&Norm2 */}
      <line x1="314" y1="250" x2="314" y2="238" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Add&Norm2 → FFN */}
      <line x1="314" y1="210" x2="314" y2="198" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* FFN → Add&Norm3 */}
      <line x1="314" y1="160" x2="314" y2="146" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Add&Norm3 → out of stack → Linear */}
      <line x1="314" y1="118" x2="314" y2="86" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <line x1="314" y1="86" x2="314" y2="72" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

      {/* --- Decoder RESIDUAL skip connections --- */}
      {/* Skip around Masked Attn: left side, from below masked attn up to Add&Norm1 */}
      <path d="M252,394 L236,394 L236,319 L250,319" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Skip around Cross-Attn: left side, from below cross-attn up to Add&Norm2 */}
      <path d="M252,296 L236,296 L236,223 L250,223" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Skip around FFN: left side, from below FFN up to Add&Norm3 */}
      <path d="M252,198 L236,198 L236,131 L250,131" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" markerEnd="url(#arrowW)" />

      {/* --- CROSS-ATTENTION: Encoder output → Decoder cross-attention --- */}
      {/* Encoder top output goes right to decoder cross-attention */}
      <path d="M107,185 L107,172 L210,172 L210,272 L250,272" fill="none" stroke={`${C.green}55`} strokeWidth="2" markerEnd="url(#arrowG)" />
      <text x="210" y="166" fill={`${C.green}70`} fontSize="8" textAnchor="middle">K, V from encoder</text>

      {/* --- Decoder bottom: Positional Encoding + Embedding --- */}
      <circle cx="314" cy="448" r="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
      <text x="314" y="452" fill="rgba(255,255,255,0.5)" fontSize="14" textAnchor="middle">⊕</text>
      <text x="393" y="448" fill={C.dim} fontSize="8" textAnchor="middle">Positional</text>
      <text x="393" y="459" fill={C.dim} fontSize="8" textAnchor="middle">Encoding</text>
      <line x1="374" y1="448" x2="330" y2="448" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />

      <rect x="264" y="480" width="100" height="34" rx="8" fill="rgba(0,230,118,0.12)" stroke={C.green} strokeWidth="1.5" />
      <text x="314" y="493" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Decoder</text>
      <text x="314" y="506" fill={C.green} fontSize="10" textAnchor="middle" fontWeight="700">Embedding</text>

      {/* Embedding → ⊕ */}
      <line x1="314" y1="480" x2="314" y2="464" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arrowW)" />
      {/* Outputs label */}
      <text x="314" y="540" fill={C.dim} fontSize="10" textAnchor="middle">Outputs</text>
      <text x="314" y="553" fill={C.dim} fontSize="10" textAnchor="middle">(shifted right)</text>
      <line x1="314" y1="530" x2="314" y2="516" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#arrowW)" />
    </svg>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <T center color={C.mid} size={19}>The complete Transformer - matching your original diagram:</T>}
      {sub >= 0 && (
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: "10px 4px", border: `1px solid ${C.border}`, overflowX: "auto", display: "flex", justifyContent: "center" }}>
          <ArchDiagram />
        </div>
      )}
      <Reveal when={sub >= 1}><Box color={C.green}><T color="#80e8a5" bold center>🔍 Let's zoom into the bottom first - the green "Embedding" boxes.</T><T color="#80e8a5">This is where words enter the Transformer as numbers.</T></Box></Reveal>
      {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ 2.2 Embeddings ═══════

export const Embeddings = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.red}><T color="#ff8a80" bold center>Problem: Neural networks only do math on numbers, not words.</T><T color="#ff8a80">We need 3 stages to convert words → numbers the network can use:</T></Box>}
    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
        <T color={C.purple} bold center>Stage 1: Tokenization</T>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ padding: "5px 12px", borderRadius: 6, background: `${C.red}12`, border: `1px solid ${C.red}25` }}><T color={C.red} size={19} bold center>"I love cats"</T></div>
          <T color={C.dim} size={26}>→</T>
          {["I", "love", "cats"].map((t, i) => (<div key={i} style={{ padding: "5px 10px", borderRadius: 6, background: `${C.purple}12`, border: `1px solid ${C.purple}25` }}><T color={C.purple} size={18} bold center>"{t}"</T></div>))}
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 4 }}>Real LLMs: "unbelievable" → ["un", "believ", "able"]</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>Stage 2: Token → ID (vocabulary lookup)</T>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          {[{ t: '"I"', id: 4 }, { t: '"love"', id: 6 }, { t: '"cats"', id: 2 }].map(({ t, id }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: C.purple, fontSize: 18 }}>{t}</span>
              <span style={{ color: C.dim, fontSize: 14 }}>→</span>
              <span style={{ color: C.green, fontWeight: 700, fontSize: 20, background: `${C.green}12`, padding: "2px 8px", borderRadius: 4 }}>{id}</span>
            </div>
          ))}
        </div>
        <T color={C.dim} size={16} style={{ marginTop: 4 }}>These IDs are arbitrary - the number 6 doesn't "mean" love yet.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Stage 3: ID → Embedding (the KEY step)</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>Each ID looks up a row in a learned matrix. Each row = 512 numbers representing that word's meaning.</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {[{ w: '"I"', c: C.red, v: "[ 0.12, -0.34, 0.78, ..., 0.91]" }, { w: '"love"', c: C.purple, v: "[ 0.56,  0.23, -0.11, ..., 0.53]" }, { w: '"cats"', c: C.cyan, v: "[-0.45,  0.89,  0.33, ..., 0.67]" }].map(({ w, c, v }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 4, background: `${c}06` }}>
              <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 40 }}>{w}</span>
              <span style={{ color: C.dim, fontSize: 14 }}>→</span>
              <code style={{ color: `${c}aa`, fontSize: 14 }}>{v}</code>
            </div>
          ))}
        </div>
        <T color="#ffe082" size={16} style={{ marginTop: 6 }}>Similar words (cat/dog) get similar vectors. Learned during training.</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><Box color={C.green}><T color="#80e8a5" bold center>✅ Words are now 512-number vectors!</T><T color="#80e8a5" center size={18}>But still no position info. "I love cats" = "cats love I". Next: Positional Encoding →</T></Box></Reveal>
    {sub < 4 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ 2.3 Pos Enc - Problem ═══════

export const PosEncodingProblem = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center>The Transformer sees all words at the SAME TIME.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>It receives three embedding vectors simultaneously. Nothing tells it which is first, second, or third.</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <T color={C.dim} size={18}>"I love cats" → [vec_I, vec_love, vec_cats]</T>
          <T color={C.dim} size={18}>"cats love I" → [vec_cats, vec_love, vec_I]</T>
          <T color={C.red} size={18} bold center style={{ marginTop: 4 }}>Same vectors, different order - but model CAN'T SEE ORDER!</T>
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Why simple solutions fail:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
            <T color="#ff8a80" bold center size={18}>❌ Use [1,1,...], [2,2,...], [3,3,...]?</T>
            <T color={C.dim} size={16}>Values grow forever. At position 1000, you add 1000 to every dimension - drowns out the word meaning.</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
            <T color="#ff8a80" bold center size={18}>❌ Use pos/max_length (0.0, 0.01, 0.02...)?</T>
            <T color={C.dim} size={16}>Step size depends on sentence length. Model can't learn consistent patterns.</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
            <T color="#ff8a80" bold center size={18}>❌ Use random vectors?</T>
            <T color={C.dim} size={16}>No relationship between positions. Can't learn "pos 5 is near pos 6".</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green}><T color="#80e8a5" bold center>We need: bounded values, unique per position, relative distances learnable.</T><T color="#80e8a5" center size={18} style={{ marginTop: 4 }}>Solution: Sine & Cosine waves →</T></Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ 2.4 Pos Enc - Formula ═══════

export const PosEncodingFormula = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.cyan}20`, borderRadius: 10, padding: "16px", width: "100%" }}>
        <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>The Formula</T>
        <div style={{ fontFamily: "monospace", fontSize: 19, color: "#80cbc4", textAlign: "center", lineHeight: 2.2 }}>
          <div>Even dims (0,2,4...): <strong>sin</strong>( pos / 10000<sup style={{ fontSize: 12 }}>i/d_model</sup> )</div>
          <div>Odd dims (1,3,5...): <strong>cos</strong>( pos / 10000<sup style={{ fontSize: 12 }}>i/d_model</sup> )</div>
        </div>
      </div>
    )}
    <Reveal when={sub >= 1}><div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {[
          { term: "pos", desc: "Position of word in sentence (0, 1, 2...)", c: C.red },
          { term: "i", desc: "Which of the 512 dimensions we're computing", c: C.purple },
          { term: "d_model", desc: "Size of embedding (512)", c: C.cyan },
          { term: "10000^(i/d)", desc: "Controls wave speed. Small i = fast. Large i = slow.", c: C.yellow },
          { term: "sin/cos", desc: "Output always between -1 and +1. Never explodes!", c: C.green },
        ].map(({ term, desc, c }) => (
          <div key={term} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: `${c}06` }}>
            <code style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 72, background: `${c}10`, padding: "2px 6px", borderRadius: 4 }}>{term}</code>
            <T color={C.mid} size={16}>{desc}</T>
          </div>
        ))}
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow}><T color={C.yellow} bold center>The KEY insight: 10000^(i/d_model)</T><T color="#ffe082">When i=0, divisor=1 → pos/1 = pos → wave oscillates FAST.<br />When i=510, divisor≈10000 → pos/10000 ≈ tiny → wave changes BARELY.<br /><br />Like a clock: <strong style={{ color: C.cyan }}>seconds hand</strong> (fast) + <strong style={{ color: C.purple }}>hours hand</strong> (slow) = exact time.</T></Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ 2.5 Pos Enc - Computing ═══════

export const PosEncodingCompute = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const d = 8;
  const computeRow = (pos) => {
    const vals = [];
    for (let i = 0; i < d; i++) {
      const di = Math.floor(i / 2) * 2;
      const div = Math.pow(10000, di / d);
      const angle = pos / div;
      vals.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
    }
    return vals;
  };
  const rows = [
    { pos: 0, word: "I", c: C.red, vals: computeRow(0) },
    { pos: 1, word: "love", c: C.purple, vals: computeRow(1) },
    { pos: 2, word: "cats", c: C.cyan, vals: computeRow(2) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <T center color={C.mid} size={18}>Using 8 dimensions (real model uses 512, same idea). Actual computed values:</T>}
      {sub >= 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 8px", width: "100%", overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 2, marginBottom: 6 }}>
            <span></span>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{ fontSize: 11, color: i < 2 ? C.yellow : i < 4 ? C.orange : i < 6 ? C.cyan : C.purple, textAlign: "center", fontFamily: "monospace" }}>d{i} {i % 2 === 0 ? "sin" : "cos"}</span>
            ))}
          </div>
          {rows.map(({ pos, word, c, vals }, ri) => (
            <div key={pos} style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 2, padding: "4px 0", borderRadius: 4, background: `${c}06`, marginBottom: 2 }}>
              <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>Pos {pos} ({word})</span>
              {vals.map((v, i) => {
                const prev = ri > 0 ? rows[ri - 1].vals[i] : null;
                const change = prev !== null ? Math.abs(v - prev) : 0;
                return <span key={i} style={{ fontFamily: "monospace", fontSize: 14, textAlign: "center", color: change > 0.2 ? C.yellow : `${c}bb`, fontWeight: change > 0.2 ? 700 : 400 }}>{v.toFixed(3)}</span>;
              })}
            </div>
          ))}
        </div>
      )}
      <Reveal when={sub >= 1}><Box color={C.yellow}><T color={C.yellow} bold center>Yellow values = big change between positions.</T><T color="#ffe082">Left columns (d0, d1) change dramatically. Right columns (d6, d7) barely move. Each position has a unique fingerprint.</T></Box></Reveal>
      <Reveal when={sub >= 2}><Box color={C.green}>
          <T color="#80e8a5" bold center>Position 0: all sin(0)=0, cos(0)=1 → clean [0, 1, 0, 1, 0, 1, 0, 1]</T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>Position 1: d0 jumps 0→0.841 (fast!), d6 barely moves 0→0.001 (slow!)</T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>Position 2: d0 goes 0.841→0.909, d6 goes 0.001→0.002</T>
        </Box></Reveal>
      {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ 2.6 Fast vs Slow ═══════

export const PosEncodingFastSlow = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  // Counting grid data
  const countingRows = [
    { pos: 0, digits: [0, 0, 0] }, { pos: 1, digits: [0, 0, 1] }, { pos: 2, digits: [0, 0, 2] },
    { pos: 9, digits: [0, 0, 9] }, { pos: 10, digits: [0, 1, 0] }, { pos: 11, digits: [0, 1, 1] },
    { pos: 99, digits: [0, 9, 9] }, { pos: 100, digits: [1, 0, 0] }, { pos: 101, digits: [1, 0, 1] },
  ];
  const digitColors = [C.purple, C.orange, C.yellow];
  const digitLabels = ["Hundreds (slow)", "Tens (medium)", "Ones (fast)"];

  const Digit = ({ value, colIdx, highlight = false }) => (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: 6, fontFamily: "monospace", fontSize: 22, fontWeight: 800,
      color: digitColors[colIdx], background: `${digitColors[colIdx]}${highlight ? '25' : '10'}`,
      border: `1.5px solid ${digitColors[colIdx]}${highlight ? '60' : '20'}`,
      transition: "all 0.2s",
    }}>{value}</span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Step 0: How you count */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>Think about how you count: ones, tens, hundreds.</T>
          <T color="#80deea" style={{ marginTop: 4 }}>Each column changes at a different speed:</T>
        </Box>
      )}

      {sub >= 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", width: "100%" }}>
          {/* Column labels */}
          <div style={{ display: "grid", gridTemplateColumns: "52px repeat(3, 1fr)", gap: 6, marginBottom: 8, alignItems: "center" }}>
            <span></span>
            {digitLabels.map((lbl, i) => (
              <T key={i} color={digitColors[i]} bold size={14} center>{lbl}</T>
            ))}
          </div>
          {/* Rows */}
          {countingRows.map(({ pos, digits }, ri) => {
            const prevDigits = ri > 0 ? countingRows[ri - 1].digits : null;
            const showGap = ri === 3 || ri === 6;
            return (
              <div key={ri}>
                {showGap && <div style={{ textAlign: "center", padding: "4px 0" }}><T color={C.dim} size={14} center>···</T></div>}
                <div style={{ display: "grid", gridTemplateColumns: "52px repeat(3, 1fr)", gap: 6, marginBottom: 4, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>pos {pos}</span>
                  {digits.map((d, ci) => {
                    const changed = prevDigits && prevDigits[ci] !== d;
                    return (
                      <div key={ci} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <Digit value={d} colIdx={ci} highlight={changed} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sub >= 0 && (
        <div style={{ display: "flex", gap: 6, width: "100%" }}>
          {[
            { label: "Ones", color: C.yellow, desc: "Changes EVERY step" },
            { label: "Tens", color: C.orange, desc: "Changes every 10 steps" },
            { label: "Hundreds", color: C.purple, desc: "Changes every 100 steps" },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{ flex: 1, background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
              <T color={color} bold size={16} center>{label}</T>
              <T color={C.dim} size={12} center>{desc}</T>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: What if ONLY ones? */}
      <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>❌ What if you ONLY had the ones column?</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            {[
              { pos: 0, d: 0 }, { pos: 1, d: 1 }, { pos: 2, d: 2 },
              { pos: "...", d: "..." },
              { pos: 9, d: 9 },
              { pos: 10, d: 0, dup: "SAME as pos 0!" },
              { pos: 11, d: 1, dup: "SAME as pos 1!" },
            ].map(({ pos, d, dup }, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 36px 1fr", gap: 10, alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                  {pos === "..." ? "" : `pos ${pos}`}
                </span>
                {d === "..." ? (
                  <T color={C.dim} size={14}>···</T>
                ) : (
                  <>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 26, height: 26, borderRadius: 5, fontFamily: "monospace", fontSize: 20, fontWeight: 800,
                      color: dup ? C.red : C.yellow,
                      background: dup ? `${C.red}20` : `${C.yellow}10`,
                      border: `1.5px solid ${dup ? C.red : C.yellow}${dup ? '50' : '20'}`,
                    }}>{d}</span>
                    {dup && <span style={{ fontSize: 16, color: C.red, fontWeight: 700 }}>← {dup}</span>}
                  </>
                )}
              </div>
            ))}
          </div>
          <T color="#ff8a80" size={18} style={{ marginTop: 8 }}>
            After 10 positions, the ones column <strong>repeats</strong>. Position 0 and position 10 look identical. You can only count to 9. <strong>Stuck.</strong>
          </T>
        </Box></Reveal>

      {/* Step 2: What if ONLY hundreds? */}
      <Reveal when={sub >= 2}><Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>❌ What if you ONLY had the hundreds column?</T>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            {[
              { pos: 0, d: 0, dup: null },
              { pos: 1, d: 0, dup: "SAME!" },
              { pos: 2, d: 0, dup: "SAME!" },
              { pos: "...", d: "..." },
              { pos: 99, d: 0, dup: "still SAME!" },
              { pos: 100, d: 1, dup: "finally changes" },
            ].map(({ pos, d, dup }, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 36px 1fr", gap: 10, alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, textAlign: "right" }}>
                  {pos === "..." ? "" : `pos ${pos}`}
                </span>
                {d === "..." ? (
                  <T color={C.dim} size={14}>···</T>
                ) : (
                  <>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 26, height: 26, borderRadius: 5, fontFamily: "monospace", fontSize: 20, fontWeight: 800,
                      color: dup === "finally changes" ? C.green : (dup ? C.red : C.purple),
                      background: dup === "finally changes" ? `${C.green}20` : (dup ? `${C.red}15` : `${C.purple}10`),
                      border: `1.5px solid ${dup === "finally changes" ? C.green : (dup ? C.red : C.purple)}40`,
                    }}>{d}</span>
                    {dup && <span style={{ fontSize: 16, color: dup === "finally changes" ? C.green : C.red, fontWeight: 700 }}>← {dup}</span>}
                  </>
                )}
              </div>
            ))}
          </div>
          <T color="#ff8a80" size={18} style={{ marginTop: 8 }}>
            Positions 0 through 99 <strong>all look identical</strong> - the hundreds column just shows 0 for all of them. You can't tell neighboring words apart at all.
          </T>
        </Box></Reveal>

      {/* Step 3: Combine = magic */}
      <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>✅ But COMBINE all three columns?</T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Every position from <strong>000 to 999</strong> has a unique combination.
            That's <strong>1000 unique positions</strong> using just 3 digits!
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            {[
              { pos: 0, d: [0, 0, 0] }, { pos: 1, d: [0, 0, 1] },
              { pos: 10, d: [0, 1, 0] }, { pos: 11, d: [0, 1, 1] },
              { pos: 100, d: [1, 0, 0] }, { pos: 101, d: [1, 0, 1] },
            ].map(({ pos, d }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, color: C.dim, minWidth: 68, textAlign: "right" }}>pos {String(pos).padStart(3, "\u2007")}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {d.map((v, ci) => <Digit key={ci} value={v} colIdx={ci} />)}
                </div>
                <span style={{ fontSize: 14, color: C.green }}>✓ unique</span>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
            The fast column (ones) tells close positions apart (0 vs 1).<br />
            The slow column (hundreds) tells distant positions apart (0 vs 100).<br />
            <strong>Together, every position is unique.</strong>
          </T>
        </Box></Reveal>

      {/* Step 4: Connect back to positional encoding */}
      <Reveal when={sub >= 4}><Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>This is EXACTLY what positional encoding does.</T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { left: "Ones column", leftSub: "changes every step, repeats after 10", right: "Fast dimensions (dim 0, 1)", rightSub: "sine wave changes fast, repeats quickly", color: C.yellow },
              { left: "Tens column", leftSub: "changes every 10 steps", right: "Medium dimensions", rightSub: "sine wave at medium speed", color: C.orange },
              { left: "Hundreds column", leftSub: "changes every 100 steps", right: "Slow dimensions (dim 510, 511)", rightSub: "sine wave barely changes", color: C.purple },
            ].map(({ left, leftSub, right, rightSub, color }) => (
              <div key={left} style={{
                display: "grid", gridTemplateColumns: "1fr 30px 1fr", alignItems: "center",
                padding: "10px 12px", borderRadius: 8,
                background: `${color}06`, border: `1px solid ${color}12`,
              }}>
                <div style={{ textAlign: "right", paddingRight: 8 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 19 }}>{left}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{leftSub}</div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 28, height: 28, borderRadius: "50%",
                  background: `${color}15`, border: `1px solid ${color}30`,
                }}>
                  <span style={{ color, fontSize: 20, fontWeight: 800 }}>=</span>
                </div>
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 19 }}>{right}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{rightSub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px", background: "rgba(0,230,118,0.06)", borderRadius: 8, border: `1px solid ${C.green}20` }}>
            <T color="#80e8a5" bold center>Instead of 3 digits (0-9) → 1,000 unique positions</T>
            <T color="#80e8a5" center size={18}>Positional encoding uses 512 dimensions (sine waves -1 to +1)</T>
            <T color="#80e8a5" center size={18}>→ practically <strong>unlimited</strong> unique positions</T>
          </div>
        </Box></Reveal>

      <Reveal when={sub >= 5}><Box color={C.green}>
          <T color="#80e8a5" bold center>
            That's the entire point of fast vs slow. Nothing more, nothing less.<br />
            Different speeds exist so the combination is always unique, no matter how long the sentence is.
          </T>
        </Box></Reveal>

      {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ 2.7 Final Addition ═══════

export const PosEncodingFinal = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const emb = [0.56, 0.23, -0.11, 0.42, 0.88, -0.33, 0.71, 0.53];
  const pe = [0.841, 0.540, 0.100, 0.995, 0.010, 1.000, 0.001, 1.000];
  const final_ = emb.map((e, i) => (e + pe[i]).toFixed(2));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>The addition for "love" at position 1:</T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Embedding", color: C.purple, vals: emb.map(v => v.toFixed(3)) },
              { op: "+" },
              { label: "Pos Enc (pos=1)", color: C.green, vals: pe.map(v => v.toFixed(3)) },
              { op: "=" },
              { label: "Final Vector", color: C.yellow, vals: final_, bold: true },
            ].map((row, i) => row.op ? (
              <div key={i} style={{ padding: "4px 0", display: "flex", justifyContent: "center" }}>
                <span style={{ color: row.op === "+" ? C.green : C.yellow, fontWeight: 800, fontSize: 22 }}>{row.op}</span>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", padding: "6px 0" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: row.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{row.label}</span>
                <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                  {row.vals.map((v, j) => (
                    <span key={j} style={{
                      fontFamily: "monospace", fontSize: 13, textAlign: "center",
                      padding: "4px 6px", borderRadius: 5, minWidth: 48,
                      color: row.bold ? row.color : `${row.color}cc`,
                      fontWeight: row.bold ? 700 : 500,
                      background: row.bold ? `${row.color}18` : `${row.color}08`,
                      border: `1px solid ${row.bold ? `${row.color}30` : `${row.color}12`}`,
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}><Box color={C.green}><T color="#80e8a5" bold center>This vector now carries BOTH:</T><T color="#80e8a5">✅ <strong style={{ color: C.purple }}>Meaning</strong> - it mostly represents "love" (embedding dominates)<br />✅ <strong style={{ color: C.green }}>Position</strong> - nudged slightly to encode "I'm at position 1"</T></Box></Reveal>
      <Reveal when={sub >= 2}><Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>4 reasons this design is genius:</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { n: "1", t: "Bounded", d: "sin/cos always between -1 and +1. Never explodes." },
              { n: "2", t: "Unique", d: "Every position gets a unique pattern across 512 dims." },
              { n: "3", t: "Relative distances", d: "sin(a+b) = linear combo of sin(a),cos(a). Model can learn relative positions." },
              { n: "4", t: "Generalizes", d: "Works for longer sequences than seen in training - sin/cos are smooth and continuous." },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 8px" }}>
                <span style={{ color: C.purple, fontWeight: 800, fontSize: 18 }}>{n}.</span>
                <T color={C.mid} size={16}><strong style={{ color: C.purple }}>{t}</strong> - {d}</T>
              </div>
            ))}
          </div>
        </Box></Reveal>
      <Reveal when={sub >= 3}><Box color={C.green}><T color="#80e8a5" bold center>✅ This is what enters the Transformer layers.</T><T color="#80e8a5" center size={18} style={{ marginTop: 4 }}>Next up: <strong>Section 6 - Attention</strong>, the heart of the Transformer!</T></Box></Reveal>
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ CHAPTER ROUTER ═══════

// ═══════════════════════════════════════
// SECTION 6: ATTENTION - THE HEART
// ═══════════════════════════════════════

export const WhatTransformerDoes = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={21}>What is a Transformer actually doing?</T>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>You give it a sentence: <strong>"I love cats"</strong></T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>It needs to understand what each word means <strong>in context</strong>. The word "love" alone could mean many things. But "love" in "I love cats" specifically means "I have affection for cats." The Transformer needs to figure this out.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Step 1: Each word starts as a list of numbers.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>The model has a big dictionary (learned during training) that maps every word to a fixed list of numbers. These numbers capture the word's meaning in isolation.</T>
      </Box></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 1: The Problem ═══════
