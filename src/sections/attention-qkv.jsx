import { C } from "../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../components.jsx";
export const ContextProblem = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx;
  const sentences = [
    { words: ["I", "sat", "by", "the", "river", "bank"], highlight: 5, context: [1, 2, 4], meaning: "edge of a river", color: C.cyan },
    { words: ["I", "deposited", "money", "in", "the", "bank"], highlight: 5, context: [1, 2], meaning: "financial institution", color: C.yellow },
  ];
  const s = sentences[bankIdx];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.red} style={{ width: "100%" }}><T color="#ff8a80" bold center size={20}>Words alone are meaningless. Context is everything.</T><T color="#ff8a80" style={{ marginTop: 6 }}>After embedding, every instance of the same word gets the <strong>exact same vector</strong>. But the same word can mean completely different things depending on surrounding words.</T></Box>}
      <Reveal when={sub >= 1}><div style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
            {[0, 1].map(i => (<button key={i} onClick={() => setBankIdx(i)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${sentences[i].color}${bankIdx === i ? '60' : '20'}`, background: bankIdx === i ? `${sentences[i].color}15` : "transparent", color: sentences[i].color, fontSize: 18, fontWeight: 600, cursor: "pointer" }}>Sentence {i + 1}</button>))}
          </div>
          <div style={{ background: C.card, borderRadius: 10, padding: "14px", border: `1px solid ${C.border}`, width: "100%" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
              {s.words.map((w, i) => {
                const hl = i === s.highlight;
                const ctx = s.context.includes(i);
                return (<span key={i} style={{ padding: "6px 10px", borderRadius: 6, fontSize: 21, fontWeight: hl ? 800 : 500, background: hl ? `${s.color}20` : ctx ? `${C.green}10` : "rgba(255,255,255,0.03)", border: `1px solid ${hl ? `${s.color}50` : ctx ? `${C.green}25` : "rgba(255,255,255,0.05)"}`, color: hl ? s.color : ctx ? C.green : C.mid, transition: "all 0.3s" }}>{w}</span>);
              })}
            </div>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              {s.context.map((ci, i) => (<span key={i} style={{ color: C.green, fontSize: 16 }}>{s.words[ci]} </span>))}
              <span style={{ color: C.dim, fontSize: 16 }}> → tells us "bank" means:</span>
            </div>
            <div style={{ textAlign: "center", padding: "8px", background: `${s.color}10`, borderRadius: 8, border: `1px solid ${s.color}25` }}>
              <T color={s.color} bold center size={21}>"{s.meaning}"</T>
            </div>
          </div>
        </div></Reveal>
      <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>This isn't just about "bank" - it's about EVERY word.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>The model has a big dictionary (learned during training) that maps every word to a fixed list of numbers. Take "love": after embedding, "love" always gets the same numbers, no matter what sentence it's in. But "love" in "I love cats" is different from "love" in "love is blind."</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>These numbers capture the word's meaning <strong>in isolation</strong>. It has no idea what words are around it. That's a problem - because we need context.</T>
          <T color="#ffe082" style={{ marginTop: 6 }}>The <strong>goal</strong>: take "love" = [0.2, 0.9, 0.4, -0.1] and transform it into a <strong>NEW</strong> list of numbers that represents "love in the context of I and cats."</T>
        </Box></Reveal>
      <Reveal when={sub >= 3}><Box color={C.green} style={{ width: "100%" }}><T color="#80e8a5" bold center>This is what Attention solves.</T><T color="#80e8a5" style={{ marginTop: 6 }}>It lets each word <strong>look around</strong> at the other words and ask <strong>"which other words are relevant to me?"</strong> and then absorb context - absorbing information from the relevant ones. After attention: "love" in "I love cats" absorbs info from "I" and "cats" → now represents <strong>"affection from me toward cats"</strong>. Same input vector, different output vector depending on context.</T></Box></Reveal>
      {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ CH 2: How does a word look at others ═══════

export const WordLookup = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx;
  const words = ["The", "cat", "sat", "because", "it", "was", "tired"];
  const scores = {
    0: [0.1, 0.3, 0.2, 0.1, 0.05, 0.15, 0.1],
    1: [0.15, 0.1, 0.35, 0.05, 0.1, 0.15, 0.1],
    2: [0.05, 0.4, 0.05, 0.1, 0.1, 0.2, 0.1],
    3: [0.05, 0.1, 0.15, 0.05, 0.25, 0.15, 0.25],
    4: [0.05, 0.55, 0.1, 0.05, 0.05, 0.1, 0.1],
    5: [0.05, 0.2, 0.1, 0.05, 0.3, 0.05, 0.25],
    6: [0.05, 0.35, 0.05, 0.1, 0.15, 0.2, 0.1],
  };
  const curScores = scores[hovered] || [];
  const maxScore = Math.max(...curScores);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && <Box color={C.purple} style={{ width: "100%" }}><T color="#b8a9ff" bold center>Think about how YOU read.</T><T color="#b8a9ff" style={{ marginTop: 6 }}>When you see "it" in a sentence, your brain scans for what "it" refers to. You focus on <strong>nouns</strong>, not every word equally. Attention does the same thing - computes a <strong>relevance score</strong> for every other word.</T></Box>}
      <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 10, padding: "14px", border: `1px solid ${C.border}`, width: "100%" }}>
          <T color={C.dim} size={14} center style={{ marginBottom: 8 }}>Click any word to see what it attends to:</T>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
            {words.map((w, i) => (<span key={i} onClick={() => setHovered(i)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s", background: i === hovered ? `${C.purple}20` : "rgba(255,255,255,0.03)", border: `1.5px solid ${i === hovered ? C.purple : "rgba(255,255,255,0.06)"}`, color: i === hovered ? C.purple : C.mid, fontSize: 21, fontWeight: i === hovered ? 700 : 500 }}>{w}</span>))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {words.map((w, i) => {
              const score = curScores[i] || 0;
              const isMax = score === maxScore;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ minWidth: 70, fontSize: 18, color: isMax ? C.yellow : C.dim, fontWeight: isMax ? 700 : 400, textAlign: "right" }}>{w}</span>
                  <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${score * 100}%`, height: "100%", borderRadius: 4, background: isMax ? `linear-gradient(90deg, ${C.yellow}, ${C.orange})` : `${C.purple}40`, transition: "width 0.4s ease" }} />
                  </div>
                  <span style={{ fontSize: 16, color: isMax ? C.yellow : C.dim, fontWeight: isMax ? 700 : 400, minWidth: 30 }}>{(score * 100).toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
          <T color={C.dim} size={14} center style={{ marginTop: 8 }}>When "it" is selected → "cat" gets 55%. The model figures out "it" = "cat".</T>
        </div></Reveal>
      <Reveal when={sub >= 2}><Box color={C.cyan}><T color="#80deea" bold center>But how do we compute these scores mathematically?</T><T color="#80deea">We need a tool for measuring "relevance" between two vectors. Enter: the <strong>dot product</strong> →</T></Box></Reveal>
      {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// ═══════ CH 3: Dot Product ═══════

export const DotProduct = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Here's the problem.</T>
        <T color={C.orange} style={{ marginTop: 6 }}>We have three lists of numbers (one per word). We need some mathematical operation that computes "how relevant is word A to word B?"</T>
        <T color={C.orange} style={{ marginTop: 6 }}>The tool is the <strong>dot product</strong> - multiply pairs, add them up. Big result = related. Small result = unrelated.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={20}>Given two vectors, multiply pairs and sum:</T>
        <div style={{ margin: "12px 0", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <Tag color={C.cyan}>A = [1, 2, 3]</Tag>
            <Tag color={C.purple}>B = [4, 5, 6]</Tag>
          </div>
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <T color={C.dim} size={18} center>Multiply each pair:</T>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "10px 0" }}>
              {[[1,4,4],[2,5,10],[3,6,18]].map(([a, b, r], i) => (
                <div key={i} style={{ textAlign: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
                  <div><span style={{ color: C.cyan, fontSize: 20 }}>{a}</span><span style={{ color: C.dim, fontSize: 20 }}> × </span><span style={{ color: C.purple, fontSize: 20 }}>{b}</span></div>
                  <div style={{ marginTop: 4, color: C.yellow, fontWeight: 700, fontSize: 22 }}>{r}</div>
                </div>
              ))}
            </div>
            <T color={C.dim} size={18} center>Sum them up:</T>
            <T color={C.yellow} bold size={29} center>4 + 10 + 18 = 32</T>
          </div>
        </div>
        <T color="#ffe082" size={18}>That's it. Multiply pairs, add them up, get one number.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center>What does this number mean?</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>It measures <strong>how similar two vectors are in direction</strong>. Think of you and a friend both pointing somewhere:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { dir: "→  →", label: "Both point same way", val: "Large positive", desc: "\"These are similar!\"", color: C.green },
            { dir: "→  ←", label: "Opposite directions", val: "Large negative", desc: "\"These are opposites!\"", color: C.red },
            { dir: "→  ↑", label: "Perpendicular (unrelated)", val: "Close to zero", desc: "\"Nothing in common\"", color: C.dim },
          ].map(({ dir, label, val, desc, color }) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}15` }}>
              <span style={{ fontSize: 22, textAlign: "center", fontFamily: "monospace" }}>{dir}</span>
              <div>
                <T color={color} bold center size={18}>{label} → {val}</T>
                <T color={C.dim} size={16}>{desc}</T>
              </div>
            </div>
          ))}
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple}><T color="#b8a9ff" bold center>But we can't just dot product the raw word numbers directly.</T><T color="#b8a9ff">"I" = pronoun, "love" = verb - their raw meanings aren't similar, but they ARE related (I is the one who loves). We need to compare them on a different basis.</T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 4: Why not embeddings directly ═══════

export const WhyNotDirectDot = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>We can't just dot product the raw word numbers.</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>In "I love cats": "I" = pronoun, "love" = verb, "cats" = noun. Their raw meanings aren't similar at all - the dot product of "I" and "love" would be low.</T>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <Tag color={C.red}>"I" = pronoun, self-reference</Tag>
          <Tag color={C.purple}>"love" = verb, emotion</Tag>
        </div>
        <T color="#ff8a80" style={{ marginTop: 10 }}>But they ARE related - "I" is the one who loves! Their <strong>meanings</strong> are different, but their <strong>relationship</strong> is strong. Raw dot product can't capture this.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
      <T color={C.yellow} bold center>We need to compare on a DIFFERENT basis:</T>
      <T color="#ffe082" style={{ marginTop: 6 }}>Instead of comparing what words mean, compare what one is <strong>looking for</strong> vs what the other <strong>offers</strong>:</T>
      <div style={{ marginTop: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", alignItems: "center", gap: 6 }}>
          <div style={{ textAlign: "right", padding: "10px", borderRadius: 8, background: `${C.blue}10`, border: `1px solid ${C.blue}20` }}>
            <T color={C.blue} bold size={18} style={{ textAlign: "right" }}>"love" is LOOKING FOR</T>
            <T color={C.dim} size={16} style={{ textAlign: "right" }}>"who is doing the loving?"</T>
            <T color={C.dim} size={14} style={{ textAlign: "right" }}>(a subject, a person)</T>
          </div>
          <T color={C.yellow} size={26} center>↔</T>
          <div style={{ padding: "10px", borderRadius: 8, background: `${C.orange}10`, border: `1px solid ${C.orange}20` }}>
            <T color={C.orange} bold size={18}>"I" OFFERS</T>
            <T color={C.dim} size={16}>"I am a subject, a person"</T>
            <T color={C.green} size={14} bold>→ HIGH MATCH!</T>
          </div>
        </div>
      </div>
      <T color="#ffe082" style={{ marginTop: 10 }}>Not "what do these words mean?" but "what is one <strong>looking for</strong> vs what does the other <strong>offer</strong>?"</T>
    </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.green}><T color="#80e8a5" bold center>That's why we need three separate views of each word →</T></Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 5: Classroom Analogy ═══════

export const QKVClassroom = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Imagine a classroom. 30 students.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>Student <strong>Riya</strong> has a question: "who has yesterday's notes?"<br />She looks around at everyone.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Riya */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: `${C.blue}10`, border: `1px solid ${C.blue}25` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.blue}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>👩‍🎓</div>
            <div style={{ flex: 1 }}>
              <T color={C.blue} bold center size={19}>Riya's Question <Tag color={C.blue}>= Query</Tag></T>
              <T color={C.dim} size={16}>"Who has yesterday's notes?"</T>
            </div>
          </div>
          {/* Other students */}
          {[
            { name: "Priya", label: "I know the homework", match: false },
            { name: "Aman", label: "I have yesterday's notes", match: true },
            { name: "Rahul", label: "I know the canteen menu", match: false },
          ].map(({ name, label, match }) => (
            <div key={name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: match ? `${C.green}08` : "rgba(255,255,255,0.02)", border: `1px solid ${match ? `${C.green}25` : "rgba(255,255,255,0.05)"}` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: match ? `${C.orange}20` : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🧑‍🎓</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <T color={match ? C.orange : C.dim} bold center size={18}>{name}'s label <Tag color={C.orange}>= Key</Tag></T>
                </div>
                <T color={C.dim} size={16}>"{label}"</T>
              </div>
              <span style={{ fontSize: 18, color: match ? C.green : C.red, fontWeight: 700 }}>{match ? "✓ MATCH" : "✗"}</span>
            </div>
          ))}
          {/* Aman hands over notes */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}25` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.green}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>📦</div>
            <div style={{ flex: 1 }}>
              <T color={C.green} bold center size={19}>Aman hands over the actual notes <Tag color={C.green}>= Value</Tag></T>
              <T color={C.dim} size={16}>Physics equations, dates, diagrams - the real content</T>
            </div>
          </div>
        </div>
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Mapping to attention:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { left: "Riya's question", leftSub: "who has the notes?", right: "Query", rightSub: "\"what am I looking for?\"", color: C.blue, icon: "🔍" },
            { left: "Each student's label", leftSub: "what they can help with", right: "Key", rightSub: "\"what can I be found for?\"", color: C.orange, icon: "🏷️" },
            { left: "Notes handed over", leftSub: "the actual content", right: "Value", rightSub: "\"here's my actual info\"", color: C.green, icon: "📦" },
          ].map(({ left, leftSub, right, rightSub, color, icon }) => (
            <div key={left} style={{
              display: "grid", gridTemplateColumns: "1fr 36px 1fr", alignItems: "center",
              padding: "10px 12px", borderRadius: 8,
              background: `${color}06`, border: `1px solid ${color}12`,
            }}>
              <div style={{ textAlign: "right", paddingRight: 8 }}>
                <div style={{ color: C.mid, fontWeight: 600, fontSize: 18 }}>{left}</div>
                <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{leftSub}</div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: "50%",
                background: `${color}15`, border: `1px solid ${color}30`,
                fontSize: 20,
              }}>{icon}</div>
              <div style={{ paddingLeft: 8 }}>
                <div style={{ color, fontWeight: 700, fontSize: 19 }}>{right}</div>
                <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{rightSub}</div>
              </div>
            </div>
          ))}
        </div>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 6: Every word is both ═══════

export const AskerAnswerer = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.pink} style={{ width: "100%" }}>
        <T color="#ce93d8" bold center size={20}>Here's what confuses people:</T>
        <T color="#ce93d8" style={{ marginTop: 6 }}>In our classroom, every student is BOTH an asker AND an answerer, <strong>simultaneously</strong>.</T>
        <T color="#ce93d8" style={{ marginTop: 6 }}>Riya has a Query (her question), but she ALSO has a Key (what she can offer others) and a Value (her actual info). Aman has a Key and Value, but ALSO has his own Query (maybe he's looking for homework help).</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><div style={{ background: C.card, borderRadius: 10, padding: "14px", border: `1px solid ${C.border}`, width: "100%" }}>
        <T color={C.dim} size={14} center style={{ marginBottom: 6 }}>EVERY student produces ALL THREE:</T>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "Riya", q: "\"who has notes?\"", k: "\"I know Hindi grammar\"", v: "her Hindi grammar knowledge" },
            { name: "Aman", q: "\"who can help with homework?\"", k: "\"I have yesterday's notes\"", v: "his actual notes content" },
            { name: "Priya", q: "\"who knows the schedule?\"", k: "\"I know the homework\"", v: "her homework answers" },
          ].map(({ name, q, k, v }) => (
            <div key={name} style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr 1fr", gap: 6, alignItems: "center" }}>
              <Tag color={C.bright}>{name}</Tag>
              <div style={{ padding: "6px", borderRadius: 6, background: `${C.blue}08`, border: `1px solid ${C.blue}15`, textAlign: "center" }}>
                <T color={C.blue} size={12} bold center>Query</T>
                <T color={C.dim} size={11} center>{q}</T>
              </div>
              <div style={{ padding: "6px", borderRadius: 6, background: `${C.orange}08`, border: `1px solid ${C.orange}15`, textAlign: "center" }}>
                <T color={C.orange} size={12} bold center>Key</T>
                <T color={C.dim} size={11} center>{k}</T>
              </div>
              <div style={{ padding: "6px", borderRadius: 6, background: `${C.green}08`, border: `1px solid ${C.green}15`, textAlign: "center" }}>
                <T color={C.green} size={12} bold center>Value</T>
                <T color={C.dim} size={11} center>{v}</T>
              </div>
            </div>
          ))}
        </div>
      </div></Reveal>
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center>Same thing happens with words in a Transformer.</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>In the sentence "The cat sat because it was tired", every word simultaneously produces a Query, Key, and Value. "cat" asks its own question while also advertising itself and carrying its own information.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.green}><T color="#80e8a5" bold center>Each student - and each word - simultaneously asks a question AND advertises itself AND carries information.</T><T color="#80e8a5" size={18}>But why do we need Key and Value to be <strong>separate</strong>? Why can't they be the same thing?</T></Box></Reveal>
    {sub < 3 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 7: Why K ≠ V (Restaurant analogy) ═══════

export const WhyKVDifferent = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Think about ordering food at a restaurant.</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.orange}08`, border: `1px solid ${C.orange}18` }}>
            <span style={{ fontSize: 34, flexShrink: 0 }}>📋</span>
            <div style={{ flex: 1 }}>
              <T color={C.orange} bold center size={19}>The menu description <Tag color={C.orange}>= Key</Tag></T>
              <T color={C.dim} size={18} style={{ marginTop: 4 }}>"Paneer Tikka Masala - rich tomato-based gravy, smoky grilled paneer, mildly spiced, served with naan"</T>
              <T color={C.orange} size={16} style={{ marginTop: 4 }}>This helped you <strong>decide</strong> - yes, this matches what I'm craving. It's optimized for <strong>matching</strong> your preference (your Query) to the right dish.</T>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}18` }}>
            <span style={{ fontSize: 34, flexShrink: 0 }}>🍛</span>
            <div style={{ flex: 1 }}>
              <T color={C.green} bold center size={19}>The actual food on your plate <Tag color={C.green}>= Value</Tag></T>
              <T color={C.dim} size={18} style={{ marginTop: 4 }}>The smoky charred paneer cubes, the creamy gravy, the aroma, the nourishment</T>
              <T color={C.green} size={16} style={{ marginTop: 4 }}>This is the <strong>actual content</strong> you receive. What you actually consume.</T>
            </div>
          </div>
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center>If Key and Value were the same thing:</T>
        <div style={{ marginTop: 8, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8, textAlign: "center" }}>
          <span style={{ fontSize: 34 }}>🍽️</span>
          <T color="#ff8a80" style={{ marginTop: 6 }}>The waiter brings a plate with the words:<br /><em style={{ color: C.dim }}>"rich tomato-based gravy, smoky grilled paneer, mildly spiced, served with naan"</em><br />printed on it.</T>
          <T color={C.red} bold center style={{ marginTop: 6 }}>That's useless! You wanted the ACTUAL FOOD, not the description.</T>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>Now let's connect this back to the Transformer.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>Take the sentence: "The cat sat because <strong>it</strong> was tired." The word "it" needs to find what it refers to. It finds "cat". Now:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.orange}06`, border: `1px solid ${C.orange}12` }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>📋</span>
            <div style={{ flex: 1 }}>
              <T color={C.orange} bold center size={18}>"cat"'s Key <span style={{ color: C.dim, fontWeight: 400 }}>(the menu description)</span></T>
              <T color={C.dim} size={16} style={{ marginTop: 2 }}>Encodes: "I'm a noun, I'm a subject, I'm animate" - this is what helped "it" <strong>find</strong> "cat" in the first place. Optimized for matching.</T>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>🍛</span>
            <div style={{ flex: 1 }}>
              <T color={C.green} bold center size={18}>"cat"'s Value <span style={{ color: C.dim, fontWeight: 400 }}>(the actual food)</span></T>
              <T color={C.dim} size={16} style={{ marginTop: 2 }}>Carries: rich semantic content - small, furry, four-legged, alive, domesticated - this is the <strong>actual information</strong> that "it" absorbs after finding the match.</T>
            </div>
          </div>
        </div>
        <T color="#80deea" size={18} bold center style={{ marginTop: 10 }}>Key helped "it" FIND "cat" (menu description). Value is what "it" actually GOT from "cat" (the actual food).</T>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 8: How QKV are created ═══════

export const GoogleAnalogy = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Another way to see it - Google Search:</T>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { step: "1", label: "Your search query", desc: "\"best pizza near me\"", role: "= Query", color: C.blue, icon: "🔍" },
            { step: "2", label: "Each page's keywords/tags", desc: "\"pizza delivery NYC\", \"pizza recipes\"...", role: "= Key", color: C.orange, icon: "🏷️" },
            { step: "3", label: "Google matches query ↔ keywords", desc: "finds the best-matching pages", role: "= Dot Product", color: C.yellow, icon: "⚡" },
            { step: "4", label: "Matched page's CONTENT", desc: "the actual text you read", role: "= Value", color: C.green, icon: "📦" },
          ].map(({ step, label, desc, role, color, icon }) => (
            <div key={step} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}>
              <span style={{ fontSize: 26 }}>{icon}</span>
              <div style={{ flex: 1 }}><T color={color} bold center size={18}>{label}</T><T color={C.dim} size={16}>{desc}</T></div>
              <Tag color={color}>{role}</Tag>
            </div>
          ))}
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.green}><T color="#80e8a5" bold center>Three analogies, same concept:</T><T color="#80e8a5" style={{ marginTop: 4 }}>🎓 Classroom: question / label / notes<br />🍛 Restaurant: craving / menu description / actual food<br />🔍 Google: search query / page keywords / page content<br /><br />Now let's compute the full attention step by step with real numbers →</T></Box></Reveal>
    {sub < 1 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 12–19: Computation steps (same as before but renumbered) ═══════

export const HowQKVCreated = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>So far, Q, K, V are just concepts in our head.</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>We know each word needs:</T>
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
          <T color={C.blue} size={18}>🔍 Query - "what am I looking for?"</T>
          <T color={C.orange} size={18}>🏷️ Key - "what do I offer?"</T>
          <T color={C.green} size={18}>📦 Value - "what info do I carry?"</T>
        </div>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>But each word starts as just <strong>one</strong> list of numbers - its embedding. For example:</T>
        <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: 6, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.mid} size={18} mono>"love" = [0.2, 0.9, 0.4, -0.1]</T>
        </div>
        <T color="#b8a9ff" style={{ marginTop: 8 }}>That's ONE list. We need THREE different lists from it (Query, Key, Value). How do you get three different things from one thing?</T>
        <T color="#b8a9ff" bold center style={{ marginTop: 6 }}>You <strong>transform</strong> it three different ways. And the tool for each transformation is: a <strong>grid of numbers</strong>.</T>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color={C.yellow} bold center size={20}>What IS this "grid of numbers"?</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>It's called a <strong>W matrix</strong> (W = "weights"). But don't let the name scare you. It's just a <strong>table of numbers</strong>. Like a spreadsheet. Rows and columns filled with numbers:</T>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8, overflowX: "auto" }}>
          <T color={C.dim} size={14} center style={{ marginBottom: 4 }}>Example: a W grid might look like this (tiny version):</T>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, maxWidth: 300, margin: "0 auto" }}>
            {[0.02, -0.15, 0.31, 0.08, 0.41, 0.07, -0.22, -0.19, -0.09, 0.33, 0.14, 0.27, 0.18, -0.05, 0.42, 0.11].map((v, i) => (
              <div key={i} style={{ textAlign: "center", padding: "4px", borderRadius: 3, background: `${v > 0 ? C.blue : C.red}08`, fontFamily: "monospace", fontSize: 14, color: C.mid }}>{v.toFixed(2)}</div>
            ))}
          </div>
        </div>
        <T color="#ffe082" size={18} style={{ marginTop: 8 }}>That's it. Just numbers in a grid. When you multiply a word's embedding by this grid, you get a new, smaller list of numbers - the Query (or Key, or Value, depending on which grid).</T>
        <T color="#ffe082" size={18} style={{ marginTop: 6 }}><strong>Multiply input by a table → get an output.</strong> Nothing more complicated than that.</T>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Think of it like a photo with three filters.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>You have a photo of a person. You want three different views:</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { view: "View 1", highlight: "highlight only the eyes", what: "→ captures where the person is looking", c: C.blue },
            { view: "View 2", highlight: "highlight only the nose", what: "→ captures the nose shape", c: C.orange },
            { view: "View 3", highlight: "highlight only the mouth", what: "→ captures the expression", c: C.green },
          ].map(({ view, highlight, what, c }) => (
            <div key={view} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${c}08`, border: `1px solid ${c}15` }}>
              <T color={c} bold center size={18}>{view}:</T>
              <T color={C.mid} size={16}>{highlight}</T>
              <T color={C.dim} size={14}>{what}</T>
            </div>
          ))}
        </div>
        <T color="#80deea" style={{ marginTop: 8 }}>How do you create these views? You apply three different <strong>filters</strong>. Each filter is a grid of numbers that, when multiplied with the photo, produces a different view.</T>
        <T color="#80deea" style={{ marginTop: 6 }}>That's EXACTLY what W_Q, W_K, W_V are. They're three grids of numbers (filters).</T>
        <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.mid} size={18} mono>Word embedding: [1.0, 0.5, -0.3, 0.8] &nbsp; ← the "photo"</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { g: "Grid 1 (W_Q):", d: "a 4×2 grid of numbers", f: "filter for \"what am I looking for?\"", c: C.blue },
              { g: "Grid 2 (W_K):", d: "a 4×2 grid of numbers", f: "filter for \"what do I offer?\"", c: C.orange },
              { g: "Grid 3 (W_V):", d: "a 4×2 grid of numbers", f: "filter for \"what info do I carry?\"", c: C.green },
            ].map(({ g, d, f, c }) => (
              <div key={g} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 4, background: `${c}06` }}>
                <T color={c} bold center size={14}>{g}</T>
                <T color={C.dim} size={12}>{d}</T>
                <T color={C.dim} size={12}>← {f}</T>
              </div>
            ))}
          </div>
        </div>
        <T color="#80deea" style={{ marginTop: 8 }}>When you multiply the embedding by Grid 1, you get the <strong>Query</strong> - a 2-number list representing "what this word is looking for."</T>
        <T color="#80deea" style={{ marginTop: 4 }}>When you multiply the SAME embedding by Grid 2, you get the <strong>Key</strong> - a 2-number list representing "what this word can be found for."</T>
        <T color="#80deea" style={{ marginTop: 4 }}>When you multiply the SAME embedding by Grid 3, you get the <strong>Value</strong> - a 2-number list representing "what actual info this word carries."</T>
        <T color="#80deea" style={{ marginTop: 6 }}><strong>The grids are just tables of numbers. Nothing magical.</strong> Multiply input by a table → get an output.</T>
      </Box></Reveal>
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Now let's see the actual three grids in action:</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>Same word embedding goes through three different grids - each produces a different output:</T>
      </Box></Reveal>
    <Reveal when={sub >= 4}><div style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <Tag color={C.bright}>"love" embedding = [0.2, 0.9, 0.4, -0.1, ..., 0.3]</Tag>
          <T color={C.dim} size={14} center style={{ marginTop: 4 }}>512 numbers representing "love" (we'll use this exact word in our full computation later)</T>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <T color={C.dim} size={26}>↓ multiply by 3 different grids ↓</T>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { filter: "Grid 1: W_Q", role: "Query", emphasis: "\"what this word NEEDS from others\"", result: "64 numbers", color: C.blue, icon: "🔍" },
            { filter: "Grid 2: W_K", role: "Key", emphasis: "\"what this word can be MATCHED on\"", result: "64 numbers", color: C.orange, icon: "🏷️" },
            { filter: "Grid 3: W_V", role: "Value", emphasis: "\"what useful INFO this word carries\"", result: "64 numbers", color: C.green, icon: "📦" },
          ].map(({ filter, role, emphasis, result, color, icon }) => (
            <div key={role} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}18` }}>
              <span style={{ fontSize: 29, flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <T color={color} bold center size={18}>{filter}</T>
                  <T color={C.dim} size={14}>→ produces</T>
                  <Tag color={color}>{role}</Tag>
                </div>
                <T color={C.dim} size={16} style={{ marginTop: 2 }}>Emphasizes: {emphasis}</T>
                <T color={C.dim} size={14}>Output: {result}</T>
              </div>
            </div>
          ))}
        </div>
      </div></Reveal>
    <Reveal when={sub >= 5}><Box color={C.yellow}><T color="#ffe082" bold center>Same input (embedding), three different outputs depending on which grid you use.</T><T color="#ffe082" size={18}>Each grid is 512×64 = 32,768 numbers. But where do these numbers come from?</T></Box></Reveal>
    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 9: Learned during training ═══════

export const WMatrices = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx;
  const randomGrid = [0.47, -0.82, 0.15, -0.63, 0.91, -0.24, 0.38, -0.71, 0.56, -0.09, 0.77, -0.45, -0.33, 0.62, -0.88, 0.19];
  const trainedGrid = [0.02, -0.15, 0.31, 0.08, 0.41, 0.07, -0.22, -0.19, -0.09, 0.33, 0.14, 0.27, 0.18, -0.05, 0.42, 0.11];
  const GridViz = ({ numbers, label, labelColor, highlight = -1 }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <T color={labelColor} bold center size={14}>{label}</T>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, width: 180 }}>
        {numbers.map((v, i) => (
          <div key={i} style={{ textAlign: "center", padding: "5px 2px", borderRadius: 4, background: highlight === i ? `${C.yellow}25` : `${v > 0 ? C.blue : C.red}08`, fontFamily: "monospace", fontSize: 13, color: highlight === i ? C.yellow : C.mid, border: highlight === i ? `1px solid ${C.yellow}40` : "1px solid transparent", transition: "all 0.3s" }}>{v > 0 ? "+" : ""}{v.toFixed(2)}</div>
        ))}
      </div>
    </div>
  );
  return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {/* Sub 0: The question */}
    {sub >= 0 && (
      <Box color={C.orange} style={{ width: "100%" }}>
        <T color={C.orange} bold center size={20}>Where did those numbers in the grids come from?</T>
        <T color={C.orange} style={{ marginTop: 8 }}>Last chapter, we saw three grids (W_Q, W_K, W_V) - each a table of numbers. Multiply an embedding by a grid, get Q or K or V.</T>
        <T color={C.orange} style={{ marginTop: 6 }}>But who decided what numbers go in those grids?</T>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "W_Q", color: C.blue, icon: "🔍" },
            { label: "W_K", color: C.orange, icon: "🏷️" },
            { label: "W_V", color: C.green, icon: "📦" },
          ].map(({ label, color, icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 16px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}18` }}>
              <span style={{ fontSize: 24 }}>{icon}</span>
              <T color={color} bold center size={16}>{label}</T>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 6 }}>
                {[1,2,3,4,5,6,7,8,9].map(i => (
                  <div key={i} style={{ width: 22, height: 22, borderRadius: 3, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: color }}>?</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <T color={C.orange} bold center style={{ marginTop: 10 }}>Answer: <strong>nobody</strong> decided. The numbers were <strong>learned</strong> during training.</T>
      </Box>
    )}

    {/* Sub 1: Day 1 - Random initialization */}
    <Reveal when={sub >= 1}><Box color={C.red} style={{ width: "100%" }}>
        <T color="#ff8a80" bold center size={20}>Day 1: Start with random garbage</T>
        <T color="#ff8a80" style={{ marginTop: 6 }}>Before training begins, every grid is filled with <strong>random numbers</strong>. Nobody thought about these. A random number generator just spit them out:</T>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <GridViz numbers={randomGrid} label="W_Q (random)" labelColor={C.blue} />
          <GridViz numbers={randomGrid.map((v, i) => randomGrid[(i + 5) % 16])} label="W_K (random)" labelColor={C.orange} />
          <GridViz numbers={randomGrid.map((v, i) => randomGrid[(i + 11) % 16])} label="W_V (random)" labelColor={C.green} />
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
          <T color={C.dim} size={16} center>With random grids, the model computes:</T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            <T color={C.red} size={16}>random W_Q  x  embedding  =  <strong>garbage Query</strong></T>
            <T color={C.red} size={16}>random W_K  x  embedding  =  <strong>garbage Key</strong></T>
            <T color={C.red} size={16}>random W_V  x  embedding  =  <strong>garbage Value</strong></T>
          </div>
          <T color={C.dim} size={16} center style={{ marginTop: 6 }}>Garbage Q, K, V  →  garbage attention  →  garbage predictions</T>
        </div>
        <T color="#ff8a80" bold center style={{ marginTop: 8 }}>The model is terrible at this point. And that's completely fine.</T>
      </Box></Reveal>

    {/* Sub 2: The training loop */}
    <Reveal when={sub >= 2}><Box color={C.yellow} style={{ width: "100%" }}>
        <T color="#ffe082" bold center size={20}>The training loop: predict, fail, nudge</T>
        <T color="#ffe082" style={{ marginTop: 6 }}>The model reads millions of sentences and tries to predict the next word each time. Here's what happens on every single attempt:</T>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: "1", text: "Model sees: \"The cat sat on the\"", icon: "📖", c: C.cyan },
            { step: "2", text: "Uses its current (bad) grids to compute attention", icon: "⚙️", c: C.blue },
            { step: "3", text: "Predicts next word: \"elephant\" (wrong! should be \"mat\")", icon: "❌", c: C.red },
            { step: "4", text: "Calculates error: how wrong was that prediction?", icon: "📏", c: C.orange },
            { step: "5", text: "Error flows backward through every grid number", icon: "⬅️", c: C.yellow },
            { step: "6", text: "Each number gets nudged slightly to reduce the error", icon: "🔧", c: C.green },
          ].map(({ step, text, icon, c }, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${c}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
              <T color={C.mid} size={16}>{text}</T>
              {i < 5 && <span style={{ position: "absolute", left: 28, marginTop: 36, color: C.dim, fontSize: 14 }}></span>}
            </div>
          ))}
        </div>
        <T color="#ffe082" bold center style={{ marginTop: 10 }}>This loop repeats <strong>billions</strong> of times. Every repetition nudges the numbers a tiny bit closer to useful values.</T>
      </Box></Reveal>

    {/* Sub 3: Zoom into one nudge */}
    <Reveal when={sub >= 3}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center size={20}>Zoom in: what does one "nudge" look like?</T>
        <T color="#b8a9ff" style={{ marginTop: 6 }}>Let's look at a single number in W_Q - say row 2, column 3:</T>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <GridViz numbers={randomGrid} label="W_Q grid (one number highlighted)" labelColor={C.blue} highlight={9} />
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { before: "-0.09", after: "-0.07", reason: "The error signal says: \"If this number were slightly larger, the Query for 'cat' would have paid more attention to 'sat' - and the prediction would have been a little better.\"", c: C.yellow },
          ].map(({ before, after, reason, c }) => (
            <div key={before} style={{ padding: "12px 14px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}15` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ padding: "6px 12px", borderRadius: 6, background: `${C.red}12`, border: `1px solid ${C.red}25` }}>
                  <T color={C.red} mono bold center size={18}>{before}</T>
                </div>
                <T color={C.dim} size={22}>→</T>
                <div style={{ padding: "6px 12px", borderRadius: 6, background: `${C.green}12`, border: `1px solid ${C.green}25` }}>
                  <T color={C.green} mono bold center size={18}>{after}</T>
                </div>
              </div>
              <T color={C.mid} size={15} style={{ marginTop: 8 }}>{reason}</T>
            </div>
          ))}
        </div>
        <T color="#b8a9ff" style={{ marginTop: 10 }}>That's it. Just +0.02. A tiny nudge. But multiply that by every number in every grid, across billions of training examples, and the grids slowly transform from random noise into something meaningful.</T>
      </Box></Reveal>

    {/* Sub 4: After training - grids have settled */}
    <Reveal when={sub >= 4}><Box color={C.green} style={{ width: "100%" }}>
        <T color="#80e8a5" bold center size={20}>After billions of examples: the grids have settled</T>
        <T color="#80e8a5" style={{ marginTop: 6 }}>After training, the random numbers have been nudged millions of times. They've settled into values that actually mean something:</T>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <T color={C.red} bold center size={13}>BEFORE (random)</T>
            <GridViz numbers={randomGrid} label="W_Q" labelColor={C.dim} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <T color={C.dim} size={28}>→</T>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <T color={C.green} bold center size={13}>AFTER (trained)</T>
            <GridViz numbers={trainedGrid} label="W_Q" labelColor={C.blue} />
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { grid: "W_Q", result: "now produces Queries that correctly capture \"what am I looking for?\"", c: C.blue },
            { grid: "W_K", result: "now produces Keys that correctly capture \"what do I offer?\"", c: C.orange },
            { grid: "W_V", result: "now produces Values that correctly capture \"what info do I carry?\"", c: C.green },
          ].map(({ grid, result, c }) => (
            <div key={grid} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: `${c}08`, border: `1px solid ${c}15` }}>
              <Tag color={c}>{grid}</Tag>
              <T color={C.mid} size={15}>{result}</T>
            </div>
          ))}
        </div>
      </Box></Reveal>

    {/* Sub 5: The key insight */}
    <Reveal when={sub >= 5}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>The key insight</T>
        <div style={{ marginTop: 10, padding: "14px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.cyan}20` }}>
          <T color={C.cyan} bold center size={18}>Nobody programmed these numbers.</T>
          <T color={C.mid} size={16} center style={{ marginTop: 6 }}>No human sat down and said "row 2, column 3 should be 0.14." The numbers <strong>emerged</strong> from the nudging process (backpropagation) over billions of examples.</T>
        </div>
        <T color="#80deea" style={{ marginTop: 10 }}>This is what "learned" means in machine learning. The model figured out, on its own, what numbers to put in each grid so that the resulting Q, K, V vectors produce useful attention patterns.</T>
        <T color="#80deea" bold center style={{ marginTop: 8 }}>Random noise in → billions of nudges → meaningful grids out.</T>
      </Box></Reveal>

    {sub < 5 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 10: Trace complete example ═══════

export const TracingExample = (ctx) => { const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx, hovered, setHovered } = ctx; return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    {sub >= 0 && (
      <Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center size={20}>Sentence: "The cat sat" - let's trace "sat" attending to "cat"</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {[{ w: '"The"', v: "[0.1, 0.8, -0.2, 0.5]", c: C.dim }, { w: '"cat"', v: "[0.7, -0.3, 0.6, 0.1]", c: C.purple }, { w: '"sat"', v: "[-0.4, 0.5, 0.2, 0.9]", c: C.cyan }].map(({ w, v, c }) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 4, background: `${c}06` }}>
              <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 36 }}>{w}</span>
              <code style={{ color: `${c}bb`, fontSize: 16 }}>{v}</code>
            </div>
          ))}
        </div>
      </Box>
    )}
    <Reveal when={sub >= 1}><Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold center>Creating Q, K, V for "cat" (via matrix multiplication):</T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.blue}06` }}>
            <T color={C.blue} bold center size={18}>Q_cat = embedding × W_Q = [0.4, 0.8]</T>
            <T color={C.dim} size={16}>"cat is looking for words related to actions/verbs"</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.orange}06` }}>
            <T color={C.orange} bold center size={18}>K_cat = embedding × W_K = [0.9, 0.3]</T>
            <T color={C.dim} size={16}>"I can be found as: a noun, a subject, an animal"</T>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}06` }}>
            <T color={C.green} bold center size={18}>V_cat = embedding × W_V = [0.6, -0.2]</T>
            <T color={C.dim} size={16}>Rich semantic content about "cat" - the actual information</T>
          </div>
        </div>
      </Box></Reveal>
    <Reveal when={sub >= 2}><Box color={C.cyan} style={{ width: "100%" }}>
        <T color="#80deea" bold center>"sat" makes its Query:</T>
        <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 6, background: `${C.blue}06` }}>
          <T color={C.blue} bold center size={18}>Q_sat = embedding × W_Q = [0.2, 0.7]</T>
          <T color={C.dim} size={16}>"Who is performing this action? I'm looking for a subject."</T>
        </div>
        <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <T color={C.dim} size={18}>Score = dot product: Q_sat · K_cat</T>
          <T color={C.yellow} size={19} style={{ marginTop: 4 }}>(0.2 × 0.9) + (0.7 × 0.3) = 0.18 + 0.21 = <strong style={{ fontSize: 22 }}>0.39</strong> → HIGH MATCH!</T>
        </div>
        <T color="#80deea" size={18} style={{ marginTop: 8 }}>"sat"'s question (<em>"who is my subject?"</em>) matched with "cat"'s ad (<em>"I'm a subject noun"</em>). So "sat" pays high attention to "cat" and absorbs cat's <strong>Value</strong> - the actual semantic content.</T>
        <T color="#80deea" size={18} style={{ marginTop: 6 }}>After this, "sat" knows: <strong>"I'm an action being performed by a cat."</strong></T>
      </Box></Reveal>
    {sub < 2 && <SubBtn key={sub} onClick={() => { setSubBtnRipple(Date.now()); navigate("forward"); }} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
  </div>
); }

// ═══════ CH 11: Google Analogy ═══════
