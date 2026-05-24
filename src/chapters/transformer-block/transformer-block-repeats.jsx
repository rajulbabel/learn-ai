import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag, ChapterLink } from "../../components.jsx";

export default function TransformerBlockRepeats(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: One block isn't enough */}
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            One Block Does Not Repeat Enough
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 6 }}>
            We've now seen all 4 steps inside one Transformer block: Attention, Add & Norm, FFN, Add & Norm. But one
            block can only learn simple patterns. To understand language, the model needs to <strong>repeat</strong>{" "}
            this entire block many times.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}20`,
            }}
          >
            <T color="#ffcc80" bold center size={16}>
              Think of it like this:
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { block: "1 block", learns: 'basic word associations ("cat" relates to "sat")', color: C.dim },
                { block: "4 blocks", learns: "grammar structure (subject-verb agreement)", color: C.yellow },
                { block: "12 blocks", learns: "context and nuance (sarcasm, tone)", color: C.orange },
                { block: "96 blocks", learns: "deep reasoning, world knowledge, complex inference", color: C.red },
              ].map(({ block, learns, color }) => (
                <div
                  key={block}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${color}08`,
                    border: `1px solid ${color}15`,
                  }}
                >
                  <Tag color={color}>{block}</Tag>
                  <T color={C.dim} size={14}>
                    {learns}
                  </T>
                </div>
              ))}
            </div>
          </div>

          <T color="#ffcc80" size={15} center style={{ marginTop: 12 }}>
            Each repeat of the block refines the token representations further. The output of block 1 becomes the input
            of block 2, and so on.
          </T>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: The stack with real model sizes */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Stack - How Many Blocks?
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 6 }}>
            Different models use different numbers of blocks. In the original paper and in practice, this number is
            called N (hence "Nx" in architecture diagrams).
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { model: "GPT-2 Small", blocks: 12, dModel: 768, color: C.green, pct: 12.5 },
              { model: "GPT-2 Medium", blocks: 24, dModel: 1024, color: C.yellow, pct: 25 },
              { model: "GPT-2 Large", blocks: 36, dModel: 1280, color: C.orange, pct: 37.5 },
              { model: "GPT-3", blocks: 96, dModel: 12288, color: C.red, pct: 100 },
            ].map(({ model, blocks, dModel, color, pct }) => (
              <div key={model} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color, fontSize: 13, fontWeight: 700, minWidth: 110 }}>{model}</span>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.04)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color, opacity: 0.4 }} />
                  <span
                    style={{ position: "absolute", left: 8, top: 2, fontSize: 12, color: "white", fontWeight: 600 }}
                  >
                    {blocks} blocks
                  </span>
                </div>
                <code style={{ color: C.dim, fontSize: 12, minWidth: 80 }}>d={dModel}</code>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <T color="#80deea" bold center size={15}>
              What This Means
            </T>
            <T color="#80deea" size={14} style={{ marginTop: 4 }}>
              In GPT-3, every single token in your prompt passes through 96 identical blocks in sequence. Each block
              runs the full Attention → Add & Norm → FFN → Add & Norm pipeline. That's 96 rounds of attention, 96 rounds
              of FFN, and 192 Add & Norm operations per token.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: Same structure, different weights */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Same Structure, Different Weights
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Every block has the same structure: Attention → Add & Norm → FFN → Add & Norm. But every learnable weight
            inside each block is unique - learned separately during training. Here's every weight and where it lives:
          </T>

          {/* Weight map: which step owns which weights */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Attention weights */}
            <div style={{ padding: 12, borderRadius: 10, background: `${C.pink}06`, border: `1px solid ${C.pink}20` }}>
              <T color={C.pink} bold size={15}>
                Multi-Head Attention
              </T>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { name: "W_Q", role: 'Creates Queries - "what am I looking for?"', ref: "ch 9.9" },
                  { name: "W_K", role: 'Creates Keys - "what do I contain?"', ref: "ch 9.9" },
                  { name: "W_V", role: 'Creates Values - "what info do I pass along?"', ref: "ch 9.9" },
                  { name: "W_O", role: "Blends all 8 heads back together", ref: "ch 11.4" },
                ].map(({ name, role, ref }) => (
                  <div
                    key={name}
                    style={{
                      flex: "1 1 45%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${C.pink}08`,
                      border: `1px solid ${C.pink}15`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code style={{ color: C.pink, fontSize: 14, fontWeight: 700 }}>{name}</code>
                      <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                    </div>
                    <T color={C.dim} size={12}>
                      {role}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Add & Norm #1 weights */}
            <div style={{ padding: 12, borderRadius: 10, background: `${C.blue}06`, border: `1px solid ${C.blue}20` }}>
              <T color={C.blue} bold size={15}>
                Add & Norm #1 (after Attention)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  {
                    name: "γ₁ (gamma)",
                    role: "Learnable scale per dimension - stretches or shrinks normalized values",
                    ref: "ch 12.2",
                  },
                  {
                    name: "β₁ (beta)",
                    role: "Learnable shift per dimension - moves the center up or down",
                    ref: "ch 12.2",
                  },
                ].map(({ name, role, ref }) => (
                  <div
                    key={name}
                    style={{
                      flex: "1 1 45%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${C.blue}08`,
                      border: `1px solid ${C.blue}15`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code style={{ color: C.blue, fontSize: 14, fontWeight: 700 }}>{name}</code>
                      <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                    </div>
                    <T color={C.dim} size={12}>
                      {role}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* FFN weights */}
            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.orange}06`, border: `1px solid ${C.orange}20` }}
            >
              <T color={C.orange} bold size={15}>
                Feed-Forward Network
              </T>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  {
                    name: "W₁, b₁",
                    role: "First layer - expands from 512 to 2048 dims (the thinking space)",
                    ref: "ch 12.3",
                  },
                  {
                    name: "W₂, b₂",
                    role: "Second layer - compresses from 2048 back to 512 dims",
                    ref: "ch 12.3",
                  },
                ].map(({ name, role, ref }) => (
                  <div
                    key={name}
                    style={{
                      flex: "1 1 45%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${C.orange}08`,
                      border: `1px solid ${C.orange}15`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code style={{ color: C.orange, fontSize: 14, fontWeight: 700 }}>{name}</code>
                      <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                    </div>
                    <T color={C.dim} size={12}>
                      {role}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Add & Norm #2 weights */}
            <div style={{ padding: 12, borderRadius: 10, background: `${C.blue}06`, border: `1px solid ${C.blue}20` }}>
              <T color={C.blue} bold size={15}>
                Add & Norm #2 (after FFN)
              </T>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  {
                    name: "γ₂ (gamma)",
                    role: "Same role as gamma above, but a separate copy learned independently",
                    ref: "ch 12.5",
                  },
                  {
                    name: "β₂ (beta)",
                    role: "Same role as beta above, but a separate copy learned independently",
                    ref: "ch 12.5",
                  },
                ].map(({ name, role, ref }) => (
                  <div
                    key={name}
                    style={{
                      flex: "1 1 45%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${C.blue}08`,
                      border: `1px solid ${C.blue}15`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code style={{ color: C.blue, fontSize: 14, fontWeight: 700 }}>{name}</code>
                      <span style={{ color: C.dim, fontSize: 11 }}>({ref})</span>
                    </div>
                    <T color={C.dim} size={12}>
                      {role}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The key point */}
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color="#fff176" bold center size={15}>
              Every block has its own copy of ALL these weights
            </T>
            <T color="#fff176" size={14} style={{ marginTop: 4 }}>
              Block 1 has its own W_Q, W_K, W_V, W_O, W<sub>1</sub>, W<sub>2</sub>, gammas, and betas. Block 2 has
              completely different weights. Block 96 has yet another set. If they shared the same weights, stacking 96
              blocks would be no better than having one - you'd just repeat the same transformation. Each block's unique
              weights let it specialize: Block 1 learns different patterns than Block 50.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: What each layer learns */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            What Each Layer Learns - Shallow to Deep
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            Research on Transformer internals has revealed a clear pattern: early blocks learn simple things, deep
            blocks learn abstract things.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                range: "Blocks 1-4",
                title: "Surface Patterns",
                items: [
                  "Part-of-speech (noun, verb, adjective)",
                  "Basic grammar and word order",
                  'Simple co-occurrence ("New" near "York")',
                ],
                color: C.green,
                barW: 20,
              },
              {
                range: "Blocks 5-12",
                title: "Syntax & Structure",
                items: [
                  "Subject-verb agreement across distance",
                  "Clause boundaries and nesting",
                  'Pronoun resolution ("she" refers to "Alice")',
                ],
                color: C.yellow,
                barW: 50,
              },
              {
                range: "Blocks 13-24",
                title: "Semantics & Meaning",
                items: [
                  'Word sense disambiguation ("bank" = river vs money)',
                  "Sentiment and tone detection",
                  "Entity relationships and facts",
                ],
                color: C.orange,
                barW: 75,
              },
              {
                range: "Blocks 25-96",
                title: "Abstract Reasoning",
                items: [
                  "Multi-step inference and logic",
                  "World knowledge and common sense",
                  "Task-specific meaning and generation",
                ],
                color: C.red,
                barW: 100,
              },
            ].map(({ range, title, items, color, barW }, idx) => (
              <div key={range}>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${color}06`,
                    border: `1px solid ${color}15`,
                  }}
                >
                  <div style={{ minWidth: 80 }}>
                    <T color={color} bold size={13}>
                      {range}
                    </T>
                    <div
                      style={{
                        marginTop: 4,
                        height: 6,
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.04)",
                        width: 80,
                      }}
                    >
                      <div
                        style={{ width: `${barW}%`, height: "100%", borderRadius: 3, background: color, opacity: 0.5 }}
                      />
                    </div>
                  </div>
                  <div>
                    <T color={color} bold size={14}>
                      {title}
                    </T>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 4, alignItems: "flex-start", marginTop: 2 }}>
                        <span style={{ color, fontSize: 10, marginTop: 3 }}>&#9679;</span>
                        <T color={C.dim} size={12}>
                          {item}
                        </T>
                      </div>
                    ))}
                  </div>
                </div>
                {idx < 3 && <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>↓</div>}
              </div>
            ))}
          </div>

          <T color="#a5d6a7" size={14} center style={{ marginTop: 10 }}>
            This is why depth matters - you need many blocks to build from grammar all the way up to meaning and
            reasoning. It's the same principle as "deep" networks from <ChapterLink to="4.1">chapter 4.1</ChapterLink>, but now each block has both
            attention (for context) and FFN (for knowledge).
          </T>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Complete picture - clean SVG pipeline */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The Complete Picture - Token to Output Through N Blocks
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>
            Here's the full journey of a single token from input to output:
          </T>

          {(() => {
            const w = 580,
              cx = w / 2,
              boxW = 420;
            const stepW = 88,
              stepH = 20;
            const embedTop = 10,
              embedH = 44;
            const b1Top = 76,
              blockH = 56;
            const b2Top = 154;
            const dotsY = 238;
            const bNTop = 268;
            const outTop = 346,
              outH = 44;
            const svgH = 400;
            const stepClr = [C.pink, C.blue, C.orange, C.blue];
            const stepLbl = ["Attention", "Add & Norm", "FFN", "Add & Norm"];
            const bracketX = cx + boxW / 2 + 18;
            const renderBlock = (top, label, color) => {
              const bx = cx - boxW / 2;
              const totalSW = 4 * stepW + 3 * 8;
              return (
                <g>
                  <rect
                    x={bx}
                    y={top}
                    width={boxW}
                    height={blockH}
                    rx={10}
                    fill={`${color}08`}
                    stroke={`${color}40`}
                    strokeWidth={1.5}
                  />
                  <text x={cx} y={top + 18} fill={color} fontSize={14} fontWeight={700} textAnchor="middle">
                    {label}
                  </text>
                  {stepLbl.map((sl, si) => {
                    const sx = cx - totalSW / 2 + si * (stepW + 8);
                    return (
                      <g key={si}>
                        <rect
                          x={sx}
                          y={top + 28}
                          width={stepW}
                          height={stepH}
                          rx={5}
                          fill={`${stepClr[si]}15`}
                          stroke={`${stepClr[si]}30`}
                          strokeWidth={1}
                        />
                        <text
                          x={sx + stepW / 2}
                          y={top + 28 + stepH / 2 + 4}
                          fill={stepClr[si]}
                          fontSize={10}
                          fontWeight={600}
                          textAnchor="middle"
                        >
                          {sl}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            };
            const arrow = (fromY, toY) => (
              <line
                x1={cx}
                y1={fromY + 2}
                x2={cx}
                y2={toY - 3}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={1.5}
                markerEnd="url(#arr2)"
              />
            );
            return (
              <svg
                viewBox={`0 0 ${w} ${svgH}`}
                style={{ display: "block", width: "100%", maxWidth: 650, margin: "14px auto 0" }}
              >
                <desc>
                  Vertical Transformer encoder block stack showing token embedding plus positional encoding feeding
                  through repeated blocks with self-attention, add and norm, and FFN layers
                </desc>
                <defs>
                  <marker id="arr2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.25)" />
                  </marker>
                </defs>

                {/* Token Embedding box */}
                <rect
                  x={cx - boxW / 2}
                  y={embedTop}
                  width={boxW}
                  height={embedH}
                  rx={10}
                  fill={`${C.cyan}08`}
                  stroke={`${C.cyan}40`}
                  strokeWidth={1.5}
                />
                <text x={cx} y={embedTop + 22} fill={C.cyan} fontSize={14} fontWeight={700} textAnchor="middle">
                  Token Embedding + Positional Encoding
                </text>
                <text x={cx} y={embedTop + 37} fill={C.dim} fontSize={10} textAnchor="middle">
                  (Sections 8.2-8.7)
                </text>

                {/* Arrows */}
                {arrow(embedTop + embedH, b1Top)}
                {arrow(b1Top + blockH, b2Top)}
                {arrow(b2Top + blockH, dotsY - 10)}
                {arrow(dotsY + 10, bNTop)}
                {arrow(bNTop + blockH, outTop)}

                {/* Blocks */}
                {renderBlock(b1Top, "Block 1", C.green)}
                {renderBlock(b2Top, "Block 2", C.yellow)}
                {renderBlock(bNTop, "Block N", C.red)}

                {/* Dots */}
                <text x={cx} y={dotsY + 5} fill={C.dim} fontSize={20} textAnchor="middle" letterSpacing={10}>
                  ...
                </text>

                {/* Output box */}
                <rect
                  x={cx - boxW / 2}
                  y={outTop}
                  width={boxW}
                  height={outH}
                  rx={10}
                  fill={`${C.orange}08`}
                  stroke={`${C.orange}40`}
                  strokeWidth={1.5}
                />
                <text x={cx} y={outTop + 22} fill={C.orange} fontSize={14} fontWeight={700} textAnchor="middle">
                  Encoder Output
                </text>
                <text x={cx} y={outTop + 37} fill={C.dim} fontSize={10} textAnchor="middle">
                  contextual hidden states for each token
                </text>

                {/* N x bracket */}
                <line x1={bracketX} y1={b1Top} x2={bracketX} y2={bNTop + blockH} stroke={C.dim} strokeWidth={1.5} />
                <line x1={bracketX - 7} y1={b1Top} x2={bracketX + 7} y2={b1Top} stroke={C.dim} strokeWidth={1.5} />
                <line
                  x1={bracketX - 7}
                  y1={bNTop + blockH}
                  x2={bracketX + 7}
                  y2={bNTop + blockH}
                  stroke={C.dim}
                  strokeWidth={1.5}
                />
                <text
                  x={bracketX + 14}
                  y={(b1Top + bNTop + blockH) / 2 + 5}
                  fill={C.dim}
                  fontSize={16}
                  fontWeight={700}
                  textAnchor="start"
                >
                  Nx
                </text>
              </svg>
            );
          })()}

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <div
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
              }}
            >
              <T color={C.blue} bold center size={14}>
                GPT-2 Small
              </T>
              <T color={C.dim} center size={12}>
                N = 12 blocks, 117M parameters
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
              }}
            >
              <T color={C.purple} bold center size={14}>
                GPT-3
              </T>
              <T color={C.dim} center size={12}>
                N = 96 blocks, 175B parameters
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
            }}
          >
            <T color="#ef9a9a" bold center size={15}>
              The full recipe of a Transformer encoder:
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 4 }}>
              Tokenize → Embed → Add positions → Pass through N blocks (each: Self-Attention → Add & Norm → FFN → Add &
              Norm) → Rich contextual hidden states. The encoder uses bidirectional attention - every word can see every
              other word, no masking. This gives the encoder a full understanding of the entire input.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
