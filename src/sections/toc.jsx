import { C, chapters } from "../config.js";
import { Box, T } from "../components.jsx";
export const TOC = (ctx) => { const { goTo, expanded, setExpanded } = ctx;
  const sections = [
    { num: 1, name: "Neural Network Foundations", color: C.red, desc: "What neural networks are, how they learn, forward/backward pass" },
    { num: 2, name: "How LLMs Actually Train", color: C.cyan, desc: "Tokenization, self-supervised learning, cross-entropy, SFT, RLHF, batches" },
    { num: 3, name: "Scaling & Modern Techniques", color: C.yellow, desc: "Scaling laws, parameters at scale, distillation, contrastive learning" },
    { num: 4, name: "The Road to Transformers", color: C.purple, desc: "CNN → RNN → why RNN fails → the Transformer arrives" },
    { num: 5, name: "Transformer Input Pipeline", color: C.orange, desc: "Architecture overview, embeddings, positional encoding" },
    { num: 6, name: "Attention - Understanding Q, K, V", color: C.green, desc: "Why attention works, Query/Key/Value concepts, analogies" },
    { num: 7, name: "Attention - The Full Computation", color: C.pink, desc: "Step-by-step math, multi-head, W_O, the complete picture" },
  ];
  const sectionChapters = {};
  chapters.forEach((c, i) => { if (c.section > 0) { if (!sectionChapters[c.section]) sectionChapters[c.section] = []; sectionChapters[c.section].push({ ...c, idx: i }); } });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold size={21} center>Your roadmap to understanding AI from scratch.</T>
        <T color="#b8a9ff" center style={{ marginTop: 6 }}>{chapters.length - 1} chapters. Zero prerequisites. Every concept built on the one before it.</T>
      </Box>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {sections.map(p => {
          const isOpen = expanded === p.num;
          const chs = sectionChapters[p.num];
          return (
            <div key={p.num} style={{ borderRadius: 10, background: `${p.color}06`, border: `1px solid ${isOpen ? `${p.color}35` : `${p.color}15`}`, overflow: "hidden", transition: "all 0.3s" }}>
              <div
                onClick={() => setExpanded(isOpen ? null : p.num)}
                style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: `${p.color}20`, color: p.color, fontWeight: 800, fontSize: 21, width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.num}</span>
                  <div>
                    <T color={p.color} bold size={18}>{p.name}</T>
                    {!isOpen && <T color={C.dim} size={12}>{p.desc}</T>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <T color={C.dim} size={12}>{chs.length} {chs.length === 1 ? "Chapter" : "Chapters"}</T>
                  <span style={{ color: C.dim, fontSize: 14, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                  <T color={C.dim} size={12} style={{ marginBottom: 4, paddingLeft: 40 }}>{p.desc}</T>
                  {chs.map(c => (
                    <div
                      key={c.id}
                      onClick={(e) => { e.stopPropagation(); goTo(c.idx); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 40px", borderRadius: 6, cursor: "pointer", background: "transparent", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = `${p.color}10`}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ color: `${p.color}88`, fontSize: 14, fontWeight: 700, minWidth: 24 }}>{c.id}</span>
                      <T color={C.mid} size={16}>{c.title}</T>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <T color={C.dim} size={16} center style={{ marginTop: 4 }}>Tap any section to expand, tap a chapter to jump there.</T>
    </div>
  );
};
