import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";
export const CNN = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && <Box color={C.cyan}><T color="#80deea" bold center>Built for images. A small "filter" slides across the image detecting patterns.</T></Box>}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
        <svg width="320" height="120">
          {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 5 }).map((_, c2) => (<rect key={`${r}${c2}`} x={10 + c2 * 20} y={8 + r * 20} width={18} height={18} rx={2} fill={`${C.cyan}${Math.random() > 0.5 ? '22' : '10'}`} stroke={`${C.cyan}25`} strokeWidth={0.5} />)))}
          <rect x="12" y="10" width="56" height="56" rx={3} fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="5,3" />
          <text x="40" y="4" fill={C.red} fontSize="8" textAnchor="middle" fontWeight="700">filter slides →</text>
          <text x="140" y="55" fill={C.dim} fontSize="16">→</text>
          {Array.from({ length: 3 }).map((_, r) => Array.from({ length: 3 }).map((_, c2) => (<rect key={`f${r}${c2}`} x={170 + c2 * 22} y={15 + r * 22} width={20} height={20} rx={3} fill={`${C.green}${Math.random() > 0.3 ? '22' : '10'}`} stroke={`${C.green}25`} strokeWidth={0.5} />)))}
          <text x="230" y="55" fill={C.dim} fontSize="16">→</text>
          <text x="270" y="38" fill={C.green} fontSize="12" fontWeight="700">🐱 Cat</text>
          <text x="270" y="55" fill={C.dim} fontSize="11">🐶 Dog</text>
          <text x="55" y="115" fill={C.dim} fontSize="9" textAnchor="middle">image</text>
          <text x="192" y="95" fill={C.dim} fontSize="9" textAnchor="middle">features</text>
        </svg>
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.purple}><T color="#b8a9ff" bold center>Layers build on each other:</T><T color="#b8a9ff">Layer 1: <strong>edges</strong> → Layer 2: <strong>shapes</strong> → Layer 3: <strong>parts</strong> (eyes) → Layer 4: <strong>objects</strong> (face)</T></Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.red}><T color="#ff8a80" bold center>❌ Not great for language:</T><T color="#ff8a80">Related words can be far apart: "The cat <em>that I saw yesterday</em> <strong>was</strong> sleeping." - "cat" and "was" are 6 words apart but grammatically linked. CNN only looks at local windows.</T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ 1.11 RNN ═══════

export const RNN = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const words = ["The", "cat", "sat", "on", "mat"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.pink}><T color="#ce93d8" bold center>Built for sequences. Reads one word at a time, passing "memory" forward.</T><T>Like reading a book left-to-right, remembering what you read.</T></Box>}
      <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px 6px", border: `1px solid ${C.border}`, overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}>
          <svg width="370" height="110">
            {words.map((w, i) => {
              const x = 15 + i * 72;
              const op = Math.max(0.15, 0.7 - i * 0.14);
              return (<g key={i}><text x={x + 20} y="100" fill={C.pink} fontSize="12" textAnchor="middle" fontWeight="600">{w}</text><line x1={x + 20} y1="88" x2={x + 20} y2="65" stroke={`${C.pink}40`} strokeWidth="1.5" /><rect x={x} y="32" width="40" height="30" rx="7" fill={`${C.pink}12`} stroke={`${C.pink}45`} strokeWidth="1.5" /><text x={x + 20} y="51" fill={C.pink} fontSize="9" textAnchor="middle" fontWeight="700">RNN</text>{i < 4 && <><line x1={x + 42} y1="47" x2={x + 68} y2="47" stroke={`rgba(224,64,251,${op})`} strokeWidth="2" /><polygon points={`${x + 66},43 ${x + 72},47 ${x + 66},51`} fill={`rgba(224,64,251,${op})`} /></>}<text x={x + 20} y="26" fill={`rgba(224,64,251,${op})`} fontSize="7" textAnchor="middle">{i === 0 ? "memory" : i >= 3 ? "fading..." : "memory"}</text></g>);
            })}
            <text x="185" y="14" fill={C.dim} fontSize="9" textAnchor="middle">→ must finish word 1 before starting word 2 →</text>
          </svg>
        </div></Reveal>
      <Reveal when={sub >= 2}><Box color={C.green}><T color="#80cbc4" bold center>✅ Understands order!</T><T color="#80cbc4">"Dog bites man" ≠ "Man bites dog" because the memory builds differently.</T></Box></Reveal>
      {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ 1.12 RNN Flaws ═══════

export const RNNFlaws = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={21}>Flaw #1: It's SLOW</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Must process word 1, then word 2, then word 3... sequentially. On a GPU with thousands of cores, only ONE core works at a time.</T>
        <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["The", "cat", "sat", "on", "the", "mat"].map((w, i) => (
            <div key={i} style={{ padding: "3px 7px", borderRadius: 4, fontSize: 14, background: i === 0 ? `${C.green}18` : `${C.red}08`, border: `1px solid ${i === 0 ? `${C.green}35` : `${C.red}12`}`, color: i === 0 ? C.green : C.dim }}>{w} {i === 0 ? "⬅ processing" : "⏳"}</div>
          ))}
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={21}>Flaw #2: It FORGETS</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>Memory passes through every step. By word 100, word 1's information is essentially lost.</T>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 8, padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          {[1, 0.8, 0.6, 0.4, 0.2, 0.08, 0.02].map((op, i) => (
            <div key={i} style={{ width: 30, height: 22, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(255,215,64,${op * 0.3})`, border: `1px solid rgba(255,215,64,${op * 0.3})` }}>
              <span style={{ fontSize: 10, color: `rgba(255,215,64,${op})` }}>w{i + 1}</span>
            </div>
          ))}
          <T color={C.dim} size={12} style={{ marginLeft: 4 }}>← memory fading</T>
        </div>
        <T color="#ffe082" size={16} style={{ marginTop: 6 }}>This is the <strong>"vanishing gradient"</strong> problem.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green}><T color="#80e8a5" bold center>We need: ⚡ parallel processing + 🧠 perfect memory + 📍 order awareness</T><T color={C.yellow} center bold size={21} style={{ marginTop: 6 }}>Enter: The Transformer →</T></Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ 1.13 Transformer Arrives ═══════

export const TransformerArrives = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const words = ["The", "cat", "sat", "on", "mat"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.green}><T color="#80e8a5" bold center size={20}>2017 - "Attention Is All You Need"</T><T color="#80e8a5">The key idea: let every word look at every other word <strong>simultaneously</strong>.</T></Box>}
      <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px 6px", border: `1px solid ${C.border}`, width: "100%", display: "flex", justifyContent: "center" }}>
          <svg width="360" height="130">
            {words.map((w, i) => {
              const x = 20 + i * 68;
              return (<g key={i}><rect x={x} y="72" width="48" height="26" rx="6" fill={`${C.green}10`} stroke={`${C.green}35`} strokeWidth="1.5" /><text x={x + 24} y="89" fill={C.green} fontSize="11" textAnchor="middle" fontWeight="700">{w}</text>
                {words.map((_, j) => { if (i === j) return null; const x2 = 20 + j * 68; const op = (i === 1 && (j === 0 || j === 2)) ? 0.45 : 0.08; const mid = Math.min(72, 72 - Math.abs(i - j) * 10); return <path key={j} d={`M${x + 24},72 Q${(x + 24 + x2 + 24) / 2},${mid} ${x2 + 24},72`} fill="none" stroke={`rgba(0,230,118,${op})`} strokeWidth={op > 0.2 ? 2 : 0.7} />; })}
              </g>);
            })}
            <text x="180" y="120" fill={C.dim} fontSize="9" textAnchor="middle">"cat" attends most to "The" and "sat" (bright lines)</text>
            <text x="180" y="15" fill={`${C.green}60`} fontSize="10" textAnchor="middle">⚡ ALL processed in parallel</text>
          </svg>
        </div></Reveal>
      <Reveal when={sub >= 2}><div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
          <Box color={C.red} style={{ flex: 1 }}><T color="#ff8a80" bold center size={16}>RNN</T><T color={C.dim} size={14} center>Sequential, slow<br />Forgets distant words</T></Box>
          <Box color={C.green} style={{ flex: 1 }}><T color="#80e8a5" bold center size={16}>Transformer</T><T color={C.mid} size={14} center>Parallel, blazing fast<br />Every word sees every word</T></Box>
        </div></Reveal>
      <Reveal when={sub >= 3}><Box color={C.yellow}><T color={C.yellow} bold center>Powers GPT, Claude, LLaMA, Gemini - ALL modern AI.</T><T center size={18} style={{ marginTop: 4 }}>Now let's see the full architecture →</T></Box></Reveal>
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ 2.1 Full Architecture (faithful SVG diagram) ═══════
