import { useRef, useEffect, useCallback } from "react";
import { SubBtn } from "../components.jsx";

const R = 16, DX = 42, DIMX = [-DX, 0, DX], CX = 450;

// Shared SVG builder factory - returns helper functions identical to the HTML originals
function B(svg) {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    svg.appendChild(e);
    return e;
  };
  const node = (cx, cy, fill, stroke, lbl, lblColor, r = R) => {
    el("circle", { cx, cy, r, fill, stroke, "stroke-width": 1.5 });
    if (lbl !== undefined && lbl !== "") el("text", { x: cx, y: cy + 4, fill: lblColor || "#fff", "font-size": r >= 14 ? 10 : 7, "text-anchor": "middle", "font-family": "monospace", "font-weight": "600" }).textContent = lbl;
  };
  const edge = (x1, y1, x2, y2, color = "rgba(255,255,255,0.08)", width = 1) => {
    el("line", { x1, y1, x2, y2, stroke: color, "stroke-width": width });
  };
  const label = (x, y, text, color = "rgba(255,255,255,0.4)", size = 17, weight = "600", anchor = "middle") => {
    el("text", { x, y, fill: color, "font-size": size, "text-anchor": anchor, "font-weight": weight, "font-family": "sans-serif" }).textContent = text;
  };
  const sectionBox = (x, y, w, h, color = "rgba(255,255,255,0.06)", strokeColor = "rgba(255,255,255,0.1)") => {
    el("rect", { x, y, width: w, height: h, rx: 12, fill: color, stroke: strokeColor, "stroke-width": 1.5, "stroke-dasharray": "6,4" });
  };
  const layerLabel = (y, text, color) => {
    const w = Math.max(260, text.length * 10 + 40);
    const x = CX - w / 2;
    el("rect", { x, y: y - 17, width: w, height: 34, rx: 6, fill: "#08080d", stroke: color || "rgba(255,255,255,0.15)", "stroke-width": 1 });
    label(CX, y + 5, text, color || "rgba(255,255,255,0.45)", 16, "700");
  };
  const tNodes = (cx, y) => DIMX.map(dx => ({ x: cx + dx, y }));
  const fcEdges = (from, to, color, width = 0.8) => {
    for (const f of from) for (const t of to) edge(f.x, f.y + R, t.x, t.y - R, color, width);
  };
  const o2oEdges = (from, to, color, width = 1) => {
    for (let i = 0; i < from.length; i++) edge(from[i].x, from[i].y + R, to[i].x, to[i].y - R, color, width);
  };
  const callout = (x, y, text, color = "rgba(0,188,212,0.7)", bg = "rgba(0,188,212,0.06)") => {
    const w = text.length * 8.5 + 32;
    el("rect", { x: x - w / 2, y: y - 15, width: w, height: 30, rx: 10, fill: bg, stroke: color, "stroke-width": 0.8 });
    label(x, y + 5, text, color, 15, "600");
  };
  const parallelBadge = (y, text = "ALL 6 VECTORS IN PARALLEL (one matrix multiply)") => {
    callout(CX, y, text, "rgba(0,230,118,0.7)", "rgba(0,230,118,0.06)");
  };
  const explainBox = (x, y, w, lines, bc = "rgba(255,152,0,0.6)", bg = "rgba(255,152,0,0.04)") => {
    const h = lines.length * 26 + 24;
    el("rect", { x: x - w / 2, y: y - 6, width: w, height: h, rx: 8, fill: bg, stroke: bc, "stroke-width": 2.5 });
    lines.forEach((line, i) => {
      const [t, c, s, wt] = Array.isArray(line) ? line : [line, "rgba(255,255,255,0.4)", 13, "400"];
      label(x, y + 16 + i * 26, t, c, s || 13, wt || "400");
    });
    return h;
  };
  const cachedNode = (cx, cy, fill, stroke, lbl, lblColor, r = R) => {
    node(cx, cy, fill, stroke, lbl, lblColor, r);
    el("circle", { cx, cy, r: r + 3, fill: "none", stroke: "rgba(255,152,0,0.25)", "stroke-width": 0.8, "stroke-dasharray": "3,2" });
  };
  const cacheBadge = (x, y, text = "CACHED") => {
    const w = text.length * 9.5 + 12;
    el("rect", { x: x - w / 2, y: y - 12, width: w, height: 24, rx: 8, fill: "rgba(255,152,0,0.08)", stroke: "rgba(255,152,0,0.4)", "stroke-width": 0.8 });
    label(x, y + 4, text, "rgba(255,152,0,0.7)", 12, "700");
  };
  const newBadge = (x, y, text = "NEW - flows through network") => {
    const w = text.length * 8.5 + 16;
    el("rect", { x: x - w / 2, y: y - 12, width: w, height: 24, rx: 8, fill: "rgba(0,230,118,0.06)", stroke: "rgba(0,230,118,0.4)", "stroke-width": 0.8 });
    label(x, y + 4, text, "rgba(0,230,118,0.7)", 12, "700");
  };
  return { el, node, edge, label, sectionBox, layerLabel, tNodes, fcEdges, o2oEdges, callout, parallelBadge, explainBox, cachedNode, cacheBadge, newBadge };
}

// ═══════════════════════════════════════════════════════════════
// Training Flow Diagram
// ═══════════════════════════════════════════════════════════════

function TrainingDiagram({ sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn }) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const { el, node, edge, label, sectionBox, layerLabel, tNodes, fcEdges, o2oEdges, callout, parallelBadge, explainBox } = B(svg);

    const tokens = [
      { name: '"The"', id: 1042, cx: 80, color: "#f44336", light: "#ef9a9a", bg: "rgba(244,67,54," },
      { name: '"cat"', id: 5829, cx: 230, color: "#ffc107", light: "#ffe082", bg: "rgba(255,193,7," },
      { name: '"sat"', id: 3820, cx: 380, color: "#4caf50", light: "#80e8a5", bg: "rgba(76,175,80," },
      { name: '"on"', id: 322, cx: 530, color: "#00bcd4", light: "#80deea", bg: "rgba(0,188,212," },
      { name: '"the"', id: 1042, cx: 680, color: "#9c27b0", light: "#ce93d8", bg: "rgba(156,39,176," },
      { name: '"mat"', id: 9382, cx: 830, color: "#ff9800", light: "#ffb74d", bg: "rgba(255,152,0," },
    ];
    const N = tokens.length;
    let Y = 30;

    // ═══ sub 0: Title + Raw Input + Tokenization ═══
    el("rect", { x: 20, y: Y - 5, width: 860, height: 52, rx: 10, fill: "rgba(0,230,118,0.03)", stroke: "rgba(0,230,118,0.2)", "stroke-width": 1.5 });
    label(CX, Y + 15, "TRAINING / PREFILL MODE", "rgba(0,230,118,0.7)", 22, "700");
    label(CX, Y + 37, "All tokens flow as one matrix through every layer simultaneously.", "rgba(0,230,118,0.5)", 15, "600");

    Y += 103;
    label(CX, Y, "Step 0: Raw Input String", "rgba(255,255,255,0.5)", 19, "700");
    Y += 32;
    el("rect", { x: 20, y: Y - 2, width: 860, height: 28, rx: 8, fill: "rgba(255,255,255,0.03)", stroke: "rgba(255,255,255,0.1)", "stroke-width": 1 });
    label(CX, Y + 16, '"The cat sat on the mat"', "#80deea", 22, "700");

    Y += 70;
    label(CX, Y, "Step 1: Tokenization (lookup table, no neural network)", "rgba(255,255,255,0.5)", 19, "700");
    Y += 30;
    label(CX, Y, "Split text into tokens, map each to an integer ID", "rgba(255,255,255,0.25)", 15, "400");
    Y += 49;
    const tokY = Y;
    for (const tok of tokens) {
      label(tok.cx, Y - 26, tok.name, tok.light, 16, "700");
      el("rect", { x: tok.cx - 30, y: Y - 10, width: 60, height: 28, rx: 6, fill: tok.bg + "0.1)", stroke: tok.color, "stroke-width": 1 });
      label(tok.cx, Y + 8, "ID:" + tok.id, tok.light, 11, "600");
    }
    callout(CX, Y + 46, "Each word becomes one integer. Nothing neural yet.");

    if (sub < 1) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 1: Embedding Lookup ═══
    Y += 95;
    label(CX, Y, "Step 2: Embedding Lookup (one matrix row per token)", "rgba(255,255,255,0.5)", 19, "700");
    Y += 30;
    label(CX, Y, "Each token ID selects a row from the embedding matrix (learned during training)", "rgba(255,255,255,0.25)", 15, "400");
    Y += 49;
    const embY = Y;
    const embVecs = [[0.21, -0.87, 0.45], [0.62, 0.34, -0.18], [-0.55, 0.91, 0.12], [0.08, -0.43, 0.77], [0.21, -0.87, 0.45], [0.73, 0.15, -0.61]];
    for (let t = 0; t < N; t++) {
      const tok = tokens[t];
      edge(tok.cx, tokY + 12, tok.cx, embY - R - 4, tok.bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(tok.cx + dx, embY, tok.bg + "0.15)", tok.color, embVecs[t][i], tok.light));
    }
    parallelBadge(Y + 46, "ALL 6 lookups happen at once - just row selection from a table");
    label(CX, Y + 80, '"The" (ID 1042) and "the" (ID 1042) get the SAME embedding - same word, same row', "rgba(255,255,255,0.2)", 13, "400");

    if (sub < 2) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 2: Positional Encoding ═══
    Y += 105;
    label(CX, Y, "Step 3: Add Positional Encoding (pure math, not learned)", "rgba(255,255,255,0.5)", 19, "700");
    Y += 30;
    label(CX, Y, "sin/cos values based on position index, added element-wise to embeddings", "rgba(255,255,255,0.25)", 15, "400");
    Y += 49;
    const posY = Y;
    const posVecs = [[0.21, -0.87, 1.45], [1.47, 0.34, -0.17], [-0.46, 0.91, 0.13], [0.16, -0.43, 1.77], [0.30, -0.87, 0.46], [1.58, 0.15, -0.60]];
    for (let t = 0; t < N; t++) {
      const tok = tokens[t];
      o2oEdges(tNodes(tok.cx, embY), tNodes(tok.cx, posY), tok.bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(tok.cx + dx, posY, tok.bg + "0.15)", tok.color, posVecs[t][i], tok.light));
    }
    parallelBadge(Y + 46, "ALL 6 additions happen at once - element-wise, no dependencies");
    label(CX, Y + 80, '"The" (pos 0) = [0.21,-0.87,1.45] vs "the" (pos 4) = [0.30,-0.87,0.46] - now different!', "rgba(255,255,255,0.2)", 13, "400");

    if (sub < 3) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 3: Encoder Self-Attention (Q, K, V, scores, softmax, W_O) ═══
    Y += 103;
    label(CX, Y + 30, "ENCODER BLOCK (x6 in original Transformer, x96 in GPT-scale)", "#80deea", 19, "700");
    Y += 30;
    label(CX, Y + 30, "Input: 6x512 matrix (6 tokens, each a 512-dim vector). Shown as 6x3 for clarity.", "rgba(255,255,255,0.25)", 15, "400");

    Y += 65;
    label(CX, Y + 28, "Encoder Self-Attention (bidirectional - NO causal mask)", "#ef9a9a", 17, "700");
    Y += 30;
    label(CX, Y + 32, "Every token can attend to EVERY other token (including future ones)", "rgba(255,255,255,0.25)", 15, "400");

    // W_Q
    Y += 65;
    layerLabel(Y, "x W_Q (learned) -> Query vectors", "#ef9a9a");
    Y += 52;
    const qY = Y;
    const qVecs = [[0.7, 1.5, 1.1], [0.5, 0.3, 0.8], [-0.3, 0.9, 0.1], [0.1, -0.4, 0.7], [0.6, 1.4, 1.0], [0.8, 0.2, -0.5]];
    for (let t = 0; t < N; t++) {
      fcEdges(tNodes(tokens[t].cx, posY), tNodes(tokens[t].cx, qY), "rgba(244,67,54,0.08)", 0.5);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, qY, "rgba(244,67,54,0.12)", "#f44336", qVecs[t][i], "#ef9a9a"));
    }
    parallelBadge(Y + 46, "Q = X * W_Q  (one matrix multiply: 6x3 * 3x3 = 6x3)");

    // W_K
    Y += 95;
    layerLabel(Y, "x W_K (learned) -> Key vectors", "#ffe082");
    Y += 52;
    const kY = Y;
    const kVecs = [[0.9, 2.4, 0.1], [0.4, 0.5, 0.6], [-0.2, 0.8, 0.3], [0.3, -0.3, 0.5], [0.8, 2.3, 0.0], [0.5, 0.1, -0.4]];
    for (let t = 0; t < N; t++) {
      fcEdges(tNodes(tokens[t].cx, posY), tNodes(tokens[t].cx, kY), "rgba(255,193,7,0.06)", 0.5);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, kY, "rgba(255,193,7,0.12)", "#ffc107", kVecs[t][i], "#ffe082"));
    }
    parallelBadge(Y + 46, "K = X * W_K  (one matrix multiply: 6x3 * 3x3 = 6x3)");

    // W_V
    Y += 95;
    layerLabel(Y, "x W_V (learned) -> Value vectors", "#80e8a5");
    Y += 52;
    const vY = Y;
    const vVecs = [[1.4, 0.6, 1.5], [0.8, 0.3, 0.9], [-0.4, 0.7, 0.2], [0.2, -0.5, 0.8], [1.3, 0.5, 1.4], [0.9, 0.2, -0.3]];
    for (let t = 0; t < N; t++) {
      fcEdges(tNodes(tokens[t].cx, posY), tNodes(tokens[t].cx, vY), "rgba(76,175,80,0.06)", 0.5);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, vY, "rgba(76,175,80,0.12)", "#4caf50", vVecs[t][i], "#80e8a5"));
    }
    parallelBadge(Y + 46, "V = X * W_V  (one matrix multiply: 6x3 * 3x3 = 6x3)");

    // Q.K^T attention edges
    Y += 95;
    layerLabel(Y, "Q . K^T -> Attention Scores (every token to every token)", "rgba(255,255,255,0.5)");
    Y += 36;
    label(CX, Y, 'NO causal mask in encoder - "The" can look at "mat", "sat" can look at "cat"', "rgba(244,67,54,0.4)", 12, "600");
    for (let qi = 0; qi < N; qi++) {
      for (let ki = 0; ki < N; ki++) {
        const op = qi === ki ? 0.2 : 0.06;
        const w = qi === ki ? 0.8 : 0.4;
        for (const qn of tNodes(tokens[qi].cx, qY))
          for (const kn of tNodes(tokens[ki].cx, kY))
            edge(qn.x, qn.y + R, kn.x, kn.y - R, tokens[qi].bg + op + ")", w);
      }
    }

    // Softmax + weighted V
    Y += 52;
    layerLabel(Y, "Scale by 1/sqrt(d_k), Softmax, Weighted Sum of V", "rgba(0,188,212,0.6)");
    Y += 52;
    const attnOutY = Y;
    const attnOutVecs = [[1.2, 0.5, 1.3], [0.9, 0.4, 0.8], [-0.3, 0.6, 0.3], [0.3, -0.4, 0.7], [1.1, 0.4, 1.2], [0.8, 0.1, -0.2]];
    for (let t = 0; t < N; t++) {
      for (let v = 0; v < N; v++) {
        const op = v === t ? 0.2 : 0.04;
        const w = v === t ? 1.0 : 0.3;
        for (let d = 0; d < 3; d++)
          edge(tokens[v].cx + DIMX[d], vY + R, tokens[t].cx + DIMX[d], attnOutY - R, tokens[t].bg + op + ")", w);
      }
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, attnOutY, tokens[t].bg + "0.15)", tokens[t].color, attnOutVecs[t][i], tokens[t].light));
    }
    parallelBadge(Y + 46, "Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V");

    // W_O
    Y += 95;
    layerLabel(Y, "x W_O (learned) -> Multi-Head Output", "#b8a9ff");
    Y += 52;
    const woY = Y;
    const woVecs = [[0.8, -0.3, 1.2], [0.5, -0.1, 0.6], [-0.2, 0.4, 0.2], [0.2, -0.3, 0.5], [0.7, -0.2, 1.1], [0.5, 0.0, -0.1]];
    for (let t = 0; t < N; t++) {
      fcEdges(tNodes(tokens[t].cx, attnOutY), tNodes(tokens[t].cx, woY), "rgba(156,120,255,0.08)", 0.5);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, woY, "rgba(156,120,255,0.12)", "#9c78ff", woVecs[t][i], "#b8a9ff"));
    }

    if (sub < 4) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 4: Add & Norm + FFN + Add & Norm 2 + Encoder Output ═══
    Y += 76;
    layerLabel(Y, "Add & LayerNorm (residual + normalize)", "#ffb74d");
    Y += 52;
    const an1Y = Y;
    const an1Vecs = [[-1.1, 0.1, 1.0], [-0.9, 0.0, 0.9], [-0.8, -0.2, 1.0], [-0.7, 0.1, 0.6], [-1.0, 0.0, 1.0], [-0.6, -0.1, 0.7]];
    for (let t = 0; t < N; t++) {
      const side = tokens[t].cx + 38;
      el("path", { d: `M ${side},${posY + R + 2} L ${side + 8},${posY + R + 8} L ${side + 8},${an1Y - R - 8} L ${side},${an1Y - R - 2}`, fill: "none", stroke: tokens[t].bg + "0.12)", "stroke-width": 1.2, "stroke-dasharray": "4,3" });
    }
    for (let t = 0; t < N; t++) {
      o2oEdges(tNodes(tokens[t].cx, woY), tNodes(tokens[t].cx, an1Y), tokens[t].bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, an1Y, "rgba(255,152,0,0.12)", "#ff9800", an1Vecs[t][i], "#ffb74d"));
    }
    parallelBadge(Y + 46, "LayerNorm(X + Attention(X)) - applied independently per vector, all at once");

    // FFN
    Y += 95;
    label(CX, Y + 28, "Feed-Forward Network (FFN)", "#90caf9", 17, "700");
    Y += 30;
    label(CX, Y + 28, "Same weights applied to EACH vector independently. No cross-token mixing.", "rgba(255,255,255,0.25)", 12, "400");
    Y += 30;
    label(CX, Y + 28, "All 6 go through simultaneously as a batched matrix multiply.", "rgba(0,230,118,0.4)", 12, "600");
    Y += 57;
    layerLabel(Y, "FFN Layer 1: 3 -> 6 dims + ReLU (expand)", "#90caf9");
    Y += 52;
    const ffn1Y = Y;
    const ffnDX = [-36, -22, -7, 7, 22, 36];
    for (let t = 0; t < N; t++) {
      const from = tNodes(tokens[t].cx, an1Y);
      for (const fn of from) for (const dx of ffnDX) edge(fn.x, fn.y + R, tokens[t].cx + dx, ffn1Y - 8, "rgba(100,149,237,0.06)", 0.4);
      for (const dx of ffnDX) node(tokens[t].cx + dx, ffn1Y, "rgba(100,149,237,0.12)", "rgba(100,149,237,0.5)", "", "", 8);
    }
    Y += 65;
    layerLabel(Y, "FFN Layer 2: 6 -> 3 dims (compress back)", "#90caf9");
    Y += 52;
    const ffn2Y = Y;
    const ffn2Vecs = [[0.5, -0.3, 0.9], [0.3, -0.1, 0.4], [-0.1, 0.3, 0.1], [0.1, -0.2, 0.4], [0.4, -0.2, 0.8], [0.3, 0.0, -0.1]];
    for (let t = 0; t < N; t++) {
      const to = tNodes(tokens[t].cx, ffn2Y);
      for (const dx of ffnDX) for (const tn of to) edge(tokens[t].cx + dx, ffn1Y + 8, tn.x, ffn2Y - R, "rgba(100,149,237,0.06)", 0.4);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, ffn2Y, "rgba(100,149,237,0.12)", "rgba(100,149,237,0.6)", ffn2Vecs[t][i], "#90caf9"));
    }

    // Add & Norm 2
    Y += 76;
    layerLabel(Y, "Add & LayerNorm (residual + normalize)", "#ffb74d");
    Y += 52;
    const an2Y = Y;
    const an2Vecs = [[-0.8, -0.5, 1.3], [-0.7, -0.3, 1.0], [-0.5, -0.1, 0.6], [-0.4, 0.0, 0.4], [-0.7, -0.4, 1.1], [-0.3, -0.1, 0.4]];
    for (let t = 0; t < N; t++) {
      const side = tokens[t].cx - 38;
      el("path", { d: `M ${side},${an1Y + R + 2} L ${side - 8},${an1Y + R + 8} L ${side - 8},${an2Y - R - 8} L ${side},${an2Y - R - 2}`, fill: "none", stroke: tokens[t].bg + "0.12)", "stroke-width": 1.2, "stroke-dasharray": "4,3" });
    }
    for (let t = 0; t < N; t++) {
      o2oEdges(tNodes(tokens[t].cx, ffn2Y), tNodes(tokens[t].cx, an2Y), tokens[t].bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(tokens[t].cx + dx, an2Y, "rgba(255,152,0,0.12)", "#ff9800", an2Vecs[t][i], "#ffb74d"));
    }

    // Encoder Output
    Y += 76;
    el("rect", { x: 20, y: Y - 8, width: 860, height: 120, rx: 10, fill: "rgba(0,188,212,0.04)", stroke: "rgba(0,188,212,0.3)", "stroke-width": 1.5 });
    label(CX, Y + 30, "ENCODER OUTPUT: 6 context-enriched vectors (6x512 matrix)", "#80deea", 19, "700");
    label(CX, Y + 54, "These become K and V for the decoder cross-attention. Computed ONCE, reused every decoder step.", "rgba(255,255,255,0.3)", 12, "400");
    label(CX, Y + 72, 'Each vector now "knows" about all other words thanks to bidirectional self-attention.', "rgba(0,188,212,0.5)", 12, "600");

    if (sub < 5) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 5: Decoder Block: Input + Masked Self-Attention ═══
    Y += 135;
    label(CX, Y + 30, "DECODER BLOCK (x6 in original Transformer)", "#b8a9ff", 19, "700");
    Y += 30;
    label(CX, Y + 30, "During TRAINING: all decoder tokens processed in parallel (teacher forcing).", "rgba(0,230,118,0.5)", 15, "600");
    Y += 30;
    label(CX, Y + 30, "Showing decoder input: <s> The cat - predicting next token at each position.", "rgba(255,255,255,0.25)", 15, "400");
    Y += 70;
    label(CX, Y, "Decoder Input (target sequence, shifted right, + positional encoding)", "rgba(255,255,255,0.45)", 16, "700");
    Y += 56;

    const decTokens = [
      { name: '"<s>"', cx: 200, color: "#78909c", light: "#b0bec5", bg: "rgba(120,144,156," },
      { name: '"The"', cx: 450, color: "#e91e63", light: "#f48fb1", bg: "rgba(233,30,99," },
      { name: '"cat"', cx: 700, color: "#ffc107", light: "#ffe082", bg: "rgba(255,193,7," },
    ];
    const decN = decTokens.length;
    const decTokY = Y;
    const decPosVecs = [[0.50, -0.10, 0.80], [0.95, 0.42, -0.31], [1.47, 0.34, -0.17]];
    for (let t = 0; t < decN; t++) {
      label(decTokens[t].cx, Y - 26, decTokens[t].name, decTokens[t].light, 16, "700");
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, Y, decTokens[t].bg + "0.15)", decTokens[t].color, decPosVecs[t][i], decTokens[t].light));
    }
    callout(CX, Y + 46, "Already embedded + positional encoding applied");

    // Masked Self-Attention
    Y += 95;
    label(CX, Y + 28, "Masked Self-Attention (causal - can only look backward)", "#f48fb1", 17, "700");
    Y += 30;
    label(CX, Y + 28, '"cat" can see "<s>" and "The", but NOT future tokens. Prevents cheating during training.', "rgba(255,255,255,0.25)", 12, "400");

    Y += 65;
    layerLabel(Y, "x W_Q -> Decoder Query", "#f48fb1");
    Y += 52;
    const dqY = Y;
    const dqVecs = [[0.3, -0.1, 0.5], [0.6, 0.3, 0.2], [0.4, 0.2, 0.6]];
    for (let t = 0; t < decN; t++) {
      fcEdges(tNodes(decTokens[t].cx, decTokY), tNodes(decTokens[t].cx, dqY), "rgba(233,30,99,0.08)", 0.5);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dqY, "rgba(233,30,99,0.12)", "#e91e63", dqVecs[t][i], "#f48fb1"));
    }
    Y += 95;
    layerLabel(Y, "x W_K -> Decoder Key", "#ffe082");
    Y += 52;
    const dkY = Y;
    const dkVecs = [[0.4, 0.0, 0.3], [0.7, 0.2, 0.1], [0.3, 0.4, 0.5]];
    for (let t = 0; t < decN; t++) {
      fcEdges(tNodes(decTokens[t].cx, decTokY), tNodes(decTokens[t].cx, dkY), "rgba(255,193,7,0.06)", 0.5);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dkY, "rgba(255,193,7,0.12)", "#ffc107", dkVecs[t][i], "#ffe082"));
    }
    Y += 95;
    layerLabel(Y, "x W_V -> Decoder Value", "#80e8a5");
    Y += 52;
    const dvY = Y;
    const dvVecs = [[0.5, -0.2, 0.6], [0.8, 0.1, 0.4], [0.6, 0.3, 0.7]];
    for (let t = 0; t < decN; t++) {
      fcEdges(tNodes(decTokens[t].cx, decTokY), tNodes(decTokens[t].cx, dvY), "rgba(76,175,80,0.06)", 0.5);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dvY, "rgba(76,175,80,0.12)", "#4caf50", dvVecs[t][i], "#80e8a5"));
    }

    // Causal attention edges
    Y += 48;
    layerLabel(Y, "Q . K^T with CAUSAL MASK (lower triangle only)", "rgba(255,255,255,0.5)");
    for (const qn of tNodes(decTokens[0].cx, dqY))
      for (const kn of tNodes(decTokens[0].cx, dkY))
        edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(120,144,156,0.15)", 0.6);
    for (const qn of tNodes(decTokens[1].cx, dqY)) {
      for (const kn of tNodes(decTokens[0].cx, dkY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(233,30,99,0.06)", 0.4);
      for (const kn of tNodes(decTokens[1].cx, dkY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(233,30,99,0.15)", 0.6);
    }
    for (const qn of tNodes(decTokens[2].cx, dqY)) {
      for (const kn of tNodes(decTokens[0].cx, dkY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.04)", 0.3);
      for (const kn of tNodes(decTokens[1].cx, dkY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.08)", 0.4);
      for (const kn of tNodes(decTokens[2].cx, dkY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.15)", 0.6);
    }

    Y += 52;
    layerLabel(Y, "Softmax + Weighted Sum of V", "rgba(0,188,212,0.6)");
    Y += 52;
    const dattnOutY = Y;
    const dattnVecs = [[0.5, -0.2, 0.6], [0.7, 0.0, 0.5], [0.6, 0.1, 0.6]];
    for (let t = 0; t < decN; t++) {
      for (let v = 0; v <= t; v++) {
        const op = v === t ? 0.2 : 0.05;
        const w = v === t ? 1.0 : 0.3;
        for (let d = 0; d < 3; d++) edge(decTokens[v].cx + DIMX[d], dvY + R, decTokens[t].cx + DIMX[d], dattnOutY - R, decTokens[t].bg + op + ")", w);
      }
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dattnOutY, decTokens[t].bg + "0.15)", decTokens[t].color, dattnVecs[t][i], decTokens[t].light));
    }

    Y += 95;
    layerLabel(Y, "Add & LayerNorm", "#ffb74d");
    Y += 52;
    const dan1Y = Y;
    const dan1Vecs = [[-0.9, 0.2, 0.7], [-0.5, 0.1, 0.4], [-0.3, 0.3, 0.0]];
    for (let t = 0; t < decN; t++) {
      o2oEdges(tNodes(decTokens[t].cx, dattnOutY), tNodes(decTokens[t].cx, dan1Y), decTokens[t].bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dan1Y, "rgba(255,152,0,0.12)", "#ff9800", dan1Vecs[t][i], "#ffb74d"));
    }

    if (sub < 6) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 6: Cross-Attention ═══
    Y += 76;
    label(CX, Y + 28, "Cross-Attention: Decoder asks questions, Encoder provides answers", "#80deea", 17, "700");
    Y += 30;
    label(CX, Y + 28, "Q = from decoder.  K, V = from encoder output (computed once, reused).", "rgba(255,255,255,0.3)", 12, "400");
    Y += 30;
    label(CX, Y + 28, 'This is how the decoder "reads" the input sentence.', "rgba(0,188,212,0.5)", 12, "600");
    Y += 59;
    layerLabel(Y, "Decoder x W_Q -> Cross-Attention Query", "#f48fb1");
    Y += 52;
    const cqY = Y;
    const cqVecs = [[-0.6, 0.1, 0.5], [-0.3, 0.1, 0.3], [-0.2, 0.2, 0.0]];
    for (let t = 0; t < decN; t++) {
      fcEdges(tNodes(decTokens[t].cx, dan1Y), tNodes(decTokens[t].cx, cqY), "rgba(233,30,99,0.08)", 0.5);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, cqY, "rgba(233,30,99,0.12)", "#e91e63", cqVecs[t][i], "#f48fb1"));
    }
    label(CX, cqY + 46, "Q from decoder (3 vectors) attends to K,V from encoder (6 vectors)", "#f48fb1", 12, "600");

    Y += 81;
    el("rect", { x: 20, y: Y - 10, width: 860, height: 48, rx: 8, fill: "rgba(0,188,212,0.04)", stroke: "rgba(0,188,212,0.2)", "stroke-width": 1 });
    label(CX, Y + 18, "K and V come from ENCODER OUTPUT (the 6 context-enriched vectors). No mask - full access.", "#80deea", 15, "700");
    Y += 73;
    layerLabel(Y, "Cross-Attention: decoder Q . encoder K^T, weighted sum of encoder V", "rgba(0,188,212,0.6)");
    Y += 36;
    label(CX, Y, "Each decoder token can attend to ALL 6 encoder tokens (no causal mask here)", "rgba(255,255,255,0.25)", 12, "400");
    Y += 40;
    const crossOutY = Y;
    const crossVecs = [[0.4, -0.1, 0.8], [0.6, 0.0, 0.5], [0.5, 0.2, 0.3]];
    for (let t = 0; t < decN; t++) {
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, crossOutY, "rgba(0,188,212,0.15)", "#00bcd4", crossVecs[t][i], "#80deea"));
    }
    callout(CX, Y + 46, '"cat" can now see encoder "The", "cat", "sat", "on", "the", "mat" - the full input');
    Y += 95;
    layerLabel(Y, "Add & LayerNorm", "#ffb74d");
    Y += 52;
    const dan2Y = Y;
    const dan2Vecs = [[-0.4, 0.1, 0.3], [-0.2, 0.0, 0.2], [0.0, 0.1, -0.1]];
    for (let t = 0; t < decN; t++) {
      o2oEdges(tNodes(decTokens[t].cx, crossOutY), tNodes(decTokens[t].cx, dan2Y), decTokens[t].bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dan2Y, "rgba(255,152,0,0.12)", "#ff9800", dan2Vecs[t][i], "#ffb74d"));
    }

    if (sub < 7) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 7: Decoder FFN + Final Add & Norm ═══
    Y += 76;
    label(CX, Y + 28, "Decoder FFN (same structure as encoder FFN)", "#90caf9", 16, "700");
    Y += 30;
    label(CX, Y + 28, "Each vector processed independently. Same weights for all positions.", "rgba(255,255,255,0.25)", 12, "400");
    Y += 57;
    layerLabel(Y, "FFN Layer 1: 3 -> 6 + ReLU", "#90caf9");
    Y += 52;
    const dffn1Y = Y;
    for (let t = 0; t < decN; t++) {
      const from = tNodes(decTokens[t].cx, dan2Y);
      for (const fn of from) for (const dx of ffnDX) edge(fn.x, fn.y + R, decTokens[t].cx + dx, dffn1Y - 8, "rgba(100,149,237,0.06)", 0.4);
      for (const dx of ffnDX) node(decTokens[t].cx + dx, dffn1Y, "rgba(100,149,237,0.12)", "rgba(100,149,237,0.5)", "", "", 8);
    }
    Y += 65;
    layerLabel(Y, "FFN Layer 2: 6 -> 3", "#90caf9");
    Y += 52;
    const dffn2Y = Y;
    const dffn2Vecs = [[0.3, -0.2, 0.5], [0.2, 0.0, 0.3], [0.1, 0.1, 0.0]];
    for (let t = 0; t < decN; t++) {
      const to = tNodes(decTokens[t].cx, dffn2Y);
      for (const dx of ffnDX) for (const tn of to) edge(decTokens[t].cx + dx, dffn1Y + 8, tn.x, dffn2Y - R, "rgba(100,149,237,0.06)", 0.4);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dffn2Y, "rgba(100,149,237,0.12)", "rgba(100,149,237,0.6)", dffn2Vecs[t][i], "#90caf9"));
    }
    Y += 76;
    layerLabel(Y, "Add & LayerNorm (final decoder layer output)", "#ffb74d");
    Y += 52;
    const dan3Y = Y;
    const dan3Vecs = [[-0.2, 0.0, 0.2], [0.0, 0.1, 0.1], [0.1, 0.2, -0.3]];
    for (let t = 0; t < decN; t++) {
      o2oEdges(tNodes(decTokens[t].cx, dffn2Y), tNodes(decTokens[t].cx, dan3Y), decTokens[t].bg + "0.2)", 1);
      DIMX.forEach((dx, i) => node(decTokens[t].cx + dx, dan3Y, "rgba(255,152,0,0.12)", "#ff9800", dan3Vecs[t][i], "#ffb74d"));
    }

    if (sub < 8) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 8: Output Head ═══
    Y += 97;
    label(CX, Y + 18, "Output Head - TRAINING: Every Position Predicts the Next Token", "#b8a9ff", 19, "700");
    Y += 30;
    label(CX, Y + 18, "During training, we compute loss at ALL positions simultaneously (not just the last one).", "rgba(0,230,118,0.5)", 15, "600");
    Y += 54;
    explainBox(CX, Y, 840, [
      ["WHY USE ALL POSITIONS (not just the last)?", "rgba(255,152,0,0.8)", 16, "700"],
      ['During TRAINING, each position predicts the NEXT token. Position 0 (<s>) predicts "The", position 1 ("The") predicts "cat", position 2 ("cat") predicts "sat".', "rgba(255,255,255,0.45)", 12, "400"],
      ["This gives us 3 training signals from 1 forward pass (one per position). Much more efficient than using just the last.", "rgba(0,230,118,0.5)", 12, "600"],
      ['The causal mask ensures each position can only see past tokens, so every prediction is a fair "test".', "rgba(255,255,255,0.35)", 12, "400"],
    ], "rgba(255,152,0,0.6)", "rgba(255,152,0,0.04)");
    Y += 176;

    const pred0X = 200;
    label(pred0X, Y, 'Position 0: "<s>"', decTokens[0].light, 15, "700");
    Y += 6;
    layerLabel(Y + 16, "Linear + Softmax", "#b8a9ff");
    Y += 56;
    const p0Y = Y;
    const vocab0 = ['"The"', '"A"', '"cat"'], vocab0X = [160, 200, 240], prob0 = ["78%", "12%", "4%"];
    for (const dx of DIMX) for (const vx of vocab0X) edge(decTokens[0].cx + dx, dan3Y + R, vx, p0Y - R, "rgba(120,144,156,0.1)", 0.5);
    vocab0X.forEach((vx, i) => {
      const w = i === 0;
      node(vx, p0Y, w ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)", w ? "#4caf50" : "rgba(255,255,255,0.2)", prob0[i], w ? "#80e8a5" : "rgba(255,255,255,0.3)");
      label(vx, p0Y + 38, vocab0[i], "rgba(255,255,255,0.35)", 13, "600");
    });
    label(pred0X, p0Y + 56, 'Target: "The"', "rgba(0,230,118,0.6)", 14, "700");
    label(pred0X, p0Y + 74, "Loss = -log(0.78) = 0.25", "rgba(255,255,255,0.3)", 13, "400");

    const pred1X = 450;
    label(pred1X, Y - 56, 'Position 1: "The"', decTokens[1].light, 15, "700");
    const vocab1 = ['"cat"', '"dog"', '"sat"'], vocab1X = [400, 450, 500], prob1 = ["71%", "12%", "8%"];
    for (const dx of DIMX) for (const vx of vocab1X) edge(decTokens[1].cx + dx, dan3Y + R, vx, p0Y - R, "rgba(233,30,99,0.1)", 0.5);
    vocab1X.forEach((vx, i) => {
      const w = i === 0;
      node(vx, p0Y, w ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)", w ? "#4caf50" : "rgba(255,255,255,0.2)", prob1[i], w ? "#80e8a5" : "rgba(255,255,255,0.3)");
      label(vx, p0Y + 38, vocab1[i], "rgba(255,255,255,0.35)", 13, "600");
    });
    label(pred1X, p0Y + 56, 'Target: "cat"', "rgba(0,230,118,0.6)", 14, "700");
    label(pred1X, p0Y + 74, "Loss = -log(0.71) = 0.34", "rgba(255,255,255,0.3)", 13, "400");

    const pred2X = 700;
    label(pred2X, Y - 56, 'Position 2: "cat"', decTokens[2].light, 15, "700");
    const vocab2 = ['"sat"', '"is"', '"ran"'], vocab2X = [660, 700, 740], prob2 = ["72%", "5%", "11%"];
    for (const dx of DIMX) for (const vx of vocab2X) edge(decTokens[2].cx + dx, dan3Y + R, vx, p0Y - R, "rgba(255,193,7,0.1)", 0.5);
    vocab2X.forEach((vx, i) => {
      const w = i === 0;
      node(vx, p0Y, w ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)", w ? "#4caf50" : "rgba(255,255,255,0.2)", prob2[i], w ? "#80e8a5" : "rgba(255,255,255,0.3)");
      label(vx, p0Y + 38, vocab2[i], "rgba(255,255,255,0.35)", 13, "600");
    });
    label(pred2X, p0Y + 56, 'Target: "sat"', "rgba(0,230,118,0.6)", 14, "700");
    label(pred2X, p0Y + 74, "Loss = -log(0.72) = 0.33", "rgba(255,255,255,0.3)", 13, "400");

    Y = p0Y + 100;
    el("rect", { x: 150, y: Y - 8, width: 600, height: 28, rx: 8, fill: "rgba(244,67,54,0.06)", stroke: "rgba(244,67,54,0.3)", "stroke-width": 1 });
    label(CX, Y + 10, "Total Loss = avg(0.25 + 0.34 + 0.33) = 0.31 -> backprop updates ALL weights", "#ef9a9a", 15, "700");
    Y += 65;
    explainBox(CX, Y, 840, [
      ["During PRODUCTION (generation), we DO only use the last position output.", "rgba(255,152,0,0.7)", 15, "700"],
      ['Because we already know all previous tokens (we generated them). Only the last position is "new".', "rgba(255,255,255,0.4)", 12, "400"],
      ["But during TRAINING we use ALL positions because the causal mask makes every position a valid prediction task.", "rgba(0,230,118,0.5)", 12, "600"],
      ["3 positions = 3 training examples from 1 forward pass. 1000 tokens = 999 free training signals!", "rgba(255,255,255,0.45)", 12, "400"],
    ], "rgba(255,152,0,0.6)", "rgba(255,152,0,0.04)");

    if (sub < 9) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 9: Summary ═══
    Y += 158;
    el("rect", { x: 20, y: Y, width: 860, height: 350, rx: 10, fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.2)", "stroke-width": 1.5 });
    label(CX, Y + 30, "Summary: Training Phase Flow", "rgba(255,255,255,0.5)", 19, "700");
    const sY = Y + 56;
    [
      ["Encoder:", "ALL 6 input tokens flow as one 6x512 matrix through every layer. Bidirectional attention (no mask).", "rgba(0,188,212,0.7)"],
      ["Decoder:", 'ALL 3 target tokens (<s>, "The", "cat") flow together (teacher forcing). Causal mask prevents cheating.', "#b8a9ff"],
      ["Cross-Attention:", "Decoder Q attends to encoder K,V. Each decoder token can see ALL encoder tokens.", "#80deea"],
      ["Self-Attention:", "MIXES information between tokens. Q.K^T creates cross-token connections.", "#ef9a9a"],
      ["FFN:", "Does NOT mix tokens. Same weights applied independently to each vector. No cross-talk.", "#90caf9"],
      ["Add & Norm:", "Per-vector operation. Adds residual, normalizes. No cross-token interaction.", "#ffb74d"],
      ["Output Head (train):", "ALL positions produce predictions. Loss computed everywhere. 3 signals from 1 pass.", "rgba(0,230,118,0.6)"],
      ["Output Head (gen):", "Only LAST position predicts next token. Others already known.", "rgba(255,152,0,0.6)"],
      ["Encoder runs ONCE", "Its output is reused as K,V for every decoder step. Decoder runs once (train) or N times (gen).", "#80deea"],
    ].forEach(([title, desc, color], i) => {
      label(40, sY + i * 34, title, color, 15, "700", "start");
      label(220, sY + i * 34, desc, "rgba(255,255,255,0.35)", 12, "400", "start");
    });
    svg.setAttribute("viewBox", "-10 0 900 " + (Y + 370));
  }, [sub]);

  const endRef = useRef(null);
  useEffect(() => { if (sub > 0 && endRef.current && endRef.current.scrollIntoView) endRef.current.scrollIntoView({ behavior: "smooth", block: "end" }); }, [sub]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center" }}>
      <svg ref={ref} style={{ width: "100%", maxWidth: 1100, display: "block" }} />
      {sub < 9 && <SubBtn onClick={() => setSub(sub + 1)} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
      <div ref={endRef} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Inference Flow Diagram
// ═══════════════════════════════════════════════════════════════

function InferenceDiagram({ sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn }) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const { el, node, edge, label, sectionBox, layerLabel, tNodes, fcEdges, o2oEdges, callout, explainBox, cachedNode, cacheBadge, newBadge } = B(svg);

    let Y = 30;

    // ═══ sub 0: Title + Big Picture ═══
    el("rect", { x: 20, y: Y - 5, width: 860, height: 52, rx: 10, fill: "rgba(255,152,0,0.04)", stroke: "rgba(255,152,0,0.3)", "stroke-width": 1.5 });
    label(CX, Y + 15, "PRODUCTION / INFERENCE MODE (autoregressive generation)", "rgba(255,152,0,0.8)", 22, "700");
    label(CX, Y + 37, "Only ONE new token flows through the decoder at each step. Previous K,V are cached.", "rgba(255,152,0,0.5)", 15, "600");

    Y += 70;
    explainBox(CX, Y, 840, [
      ["HOW INFERENCE WORKS - THE BIG PICTURE", "rgba(255,152,0,0.8)", 17, "700"],
      ['1. ENCODER runs ONCE on the full input "The cat sat on the mat" (6 tokens, all in parallel).', "rgba(0,188,212,0.6)", 12, "600"],
      ["2. Encoder output (6 vectors) becomes K,V for cross-attention. Cached permanently.", "rgba(0,188,212,0.5)", 12, "400"],
      ["3. DECODER runs in a LOOP, one new token at a time:", "rgba(156,120,255,0.7)", 12, "600"],
      ['   Step 1: feed <s>           -> predict "The"', "rgba(255,255,255,0.45)", 12, "400"],
      ['   Step 2: feed "The"         -> predict "cat"     (KV cache has <s>)', "rgba(255,255,255,0.45)", 12, "400"],
      ['   Step 3: feed "cat"         -> predict "sat"     (KV cache has <s>, "The")', "rgba(255,255,255,0.45)", 12, "400"],
      ['   Step 4: feed "sat"         -> predict "on"      (KV cache has <s>, "The", "cat")', "rgba(255,255,255,0.45)", 12, "400"],
      ["   ...until <end> token is produced.", "rgba(255,255,255,0.3)", 12, "400"],
      ["4. At each step, ONLY the new token runs through all layers. Previous tokens' K,V are read from cache.", "rgba(0,230,118,0.6)", 14, "700"],
    ], "rgba(255,152,0,0.6)", "rgba(255,152,0,0.04)");

    if (sub < 1) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 320)); return; }

    // ═══ sub 1: Encoder (runs once) ═══
    Y += 314;
    label(CX, Y + 30, "PHASE 1: ENCODER (runs ONCE, identical to training)", "#80deea", 19, "700");
    Y += 30;
    label(CX, Y + 30, '"The cat sat on the mat" -> 6 tokens flow through all encoder layers in parallel', "rgba(255,255,255,0.3)", 15, "400");
    Y += 30;
    label(CX, Y + 30, "Self-attention (bidirectional, no mask) -> Add&Norm -> FFN -> Add&Norm -> repeat x6", "rgba(255,255,255,0.25)", 12, "400");
    Y += 86;
    const encTokens = [
      { name: '"The"', cx: 80, color: "#f44336", light: "#ef9a9a", bg: "rgba(244,67,54," },
      { name: '"cat"', cx: 230, color: "#ffc107", light: "#ffe082", bg: "rgba(255,193,7," },
      { name: '"sat"', cx: 380, color: "#4caf50", light: "#80e8a5", bg: "rgba(76,175,80," },
      { name: '"on"', cx: 530, color: "#00bcd4", light: "#80deea", bg: "rgba(0,188,212," },
      { name: '"the"', cx: 680, color: "#9c27b0", light: "#ce93d8", bg: "rgba(156,39,176," },
      { name: '"mat"', cx: 830, color: "#ff9800", light: "#ffb74d", bg: "rgba(255,152,0," },
    ];
    const encOutY = Y;
    const encOutVecs = [[-0.8, -0.5, 1.3], [-0.7, -0.3, 1.0], [-0.5, -0.1, 0.6], [-0.4, 0.0, 0.4], [-0.7, -0.4, 1.1], [-0.3, -0.1, 0.4]];
    for (let t = 0; t < 6; t++) {
      label(encTokens[t].cx, encOutY - 26, encTokens[t].name, encTokens[t].light, 15, "700");
      DIMX.forEach((dx, i) => cachedNode(encTokens[t].cx + dx, encOutY, encTokens[t].bg + "0.15)", encTokens[t].color, encOutVecs[t][i], encTokens[t].light));
    }
    Y += 46;
    cacheBadge(CX, Y, "ENCODER OUTPUT CACHED - reused as cross-attention K,V for every decoder step");

    if (sub < 2) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 2: Decoder setup + tokens ═══
    Y += 81;
    el("rect", { x: 20, y: Y - 8, width: 860, height: 86, rx: 8, fill: "rgba(156,120,255,0.04)", stroke: "rgba(156,120,255,0.2)", "stroke-width": 1.5 });
    label(CX, Y + 28, 'PHASE 2: DECODER - showing Step 3: generating after "<s> The cat"', "#b8a9ff", 17, "700");
    Y += 30;
    label(CX, Y + 28, 'Already generated: "<s>", "The", "cat". Now predicting the next token.', "rgba(255,255,255,0.3)", 15, "400");
    Y += 59;
    explainBox(CX, Y, 840, [
      ["DECODER STATE AT STEP 3", "rgba(156,120,255,0.8)", 16, "700"],
      ["KV Cache (self-attention) contains K,V for: <s> (step 1), \"The\" (step 2). These were computed in earlier steps.", "rgba(255,152,0,0.6)", 12, "600"],
      ['NEW token entering now: "cat" (the token we just generated in step 2).', "rgba(0,230,118,0.6)", 12, "600"],
      ['Only "cat" flows through the full decoder. <s> and "The" are NOT recomputed.', "rgba(255,255,255,0.4)", 12, "400"],
    ], "rgba(156,120,255,0.3)", "rgba(156,120,255,0.02)");

    Y += 158;
    label(CX, Y + 30, 'DECODER STEP 3: Only "cat" flows through all layers', "#b8a9ff", 19, "700");
    Y += 73;
    const cacheCol = 250, newCol = 680;
    label(cacheCol, Y - 4, "FROM KV CACHE (not recomputed)", "rgba(255,152,0,0.6)", 15, "700");
    Y += 32;
    const cachedTokens = [
      { name: '"<s>"', cx: 200, color: "#78909c", light: "#b0bec5", bg: "rgba(120,144,156," },
      { name: '"The"', cx: 380, color: "#e91e63", light: "#f48fb1", bg: "rgba(233,30,99," },
    ];
    label(newCol, Y - 38, "NEW TOKEN (flows through network)", "rgba(0,230,118,0.6)", 15, "700");
    const newTok = { name: '"cat"', cx: 680, color: "#ffc107", light: "#ffe082", bg: "rgba(255,193,7," };
    const allDecY = Y;
    for (const tok of cachedTokens) {
      label(tok.cx, Y - 26, tok.name, tok.light + "0.4)", 15, "600");
      DIMX.forEach((dx) => cachedNode(tok.cx + dx, Y, tok.bg + "0.06)", tok.color + "0.3)", "", "", R));
    }
    cacheBadge(cacheCol, Y + 46, "K,V already in cache from steps 1-2");
    label(newTok.cx, Y - 26, newTok.name, newTok.light, 16, "700");
    const newTokVecs = [1.47, 0.34, -0.17];
    DIMX.forEach((dx, i) => node(newTok.cx + dx, Y, newTok.bg + "0.2)", newTok.color, newTokVecs[i], newTok.light));
    newBadge(newTok.cx, Y + 46, "Embedded + positional encoded");

    if (sub < 3) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 3: Masked Self-Attention with KV cache ═══
    Y += 95;
    label(CX, Y + 28, "Masked Self-Attention (with KV Cache)", "#f48fb1", 17, "700");
    Y += 30;
    label(CX, Y + 28, 'Only "cat" computes Q. K,V for <s> and "The" come from cache.', "rgba(255,255,255,0.25)", 12, "400");

    Y += 65;
    layerLabel(Y, 'x W_Q -> Query (ONLY for "cat")', "#f48fb1");
    Y += 52;
    const sqY = Y;
    const sqVecs = [0.4, 0.2, 0.6];
    fcEdges(tNodes(newTok.cx, allDecY), tNodes(newTok.cx, sqY), "rgba(233,30,99,0.1)", 0.6);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, sqY, "rgba(233,30,99,0.15)", "#e91e63", sqVecs[i], "#f48fb1"));
    newBadge(newTok.cx, sqY + 46, "Only 1 Q vector computed (not 3)");

    Y += 95;
    layerLabel(Y, 'x W_K -> Key (new "cat" K joins cached <s>, "The" K)', "#ffe082");
    Y += 52;
    const skY = Y;
    const cachedKVecs = [[0.4, 0.0, 0.3], [0.7, 0.2, 0.1]];
    for (let t = 0; t < 2; t++) {
      DIMX.forEach((dx, i) => cachedNode(cachedTokens[t].cx + dx, skY, cachedTokens[t].bg + "0.06)", cachedTokens[t].color + "0.3)", cachedKVecs[t][i], cachedTokens[t].light + "0.4)"));
    }
    cacheBadge(cacheCol, skY + 46, "K from cache (computed in steps 1-2)");
    const newKVecs = [0.3, 0.4, 0.5];
    fcEdges(tNodes(newTok.cx, allDecY), tNodes(newTok.cx, skY), "rgba(255,193,7,0.1)", 0.6);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, skY, "rgba(255,193,7,0.15)", "#ffc107", newKVecs[i], "#ffe082"));
    newBadge(newTok.cx, skY + 46, "New K computed, then ADDED to cache");

    Y += 95;
    layerLabel(Y, 'x W_V -> Value (new "cat" V joins cached <s>, "The" V)', "#80e8a5");
    Y += 52;
    const svY = Y;
    const cachedVVecs = [[0.5, -0.2, 0.6], [0.8, 0.1, 0.4]];
    for (let t = 0; t < 2; t++) {
      DIMX.forEach((dx, i) => cachedNode(cachedTokens[t].cx + dx, svY, cachedTokens[t].bg + "0.06)", cachedTokens[t].color + "0.3)", cachedVVecs[t][i], cachedTokens[t].light + "0.4)"));
    }
    cacheBadge(cacheCol, svY + 46, "V from cache (computed in steps 1-2)");
    const newVVecs = [0.6, 0.3, 0.7];
    fcEdges(tNodes(newTok.cx, allDecY), tNodes(newTok.cx, svY), "rgba(76,175,80,0.1)", 0.6);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, svY, "rgba(76,175,80,0.15)", "#4caf50", newVVecs[i], "#80e8a5"));
    newBadge(newTok.cx, svY + 46, "New V computed, then ADDED to cache");

    if (sub < 4) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 4: Attention computation + output + savings + Add & Norm ═══
    Y += 95;
    layerLabel(Y, '"cat" Q attends to ALL K (cached + new)', "rgba(255,255,255,0.5)");
    Y += 36;
    label(CX, Y, '"cat" Q dots with K_<s>, K_The, K_cat -> 3 attention scores -> softmax -> weighted V sum', "rgba(255,255,255,0.25)", 12, "400");
    Y += 14;
    for (const qn of tNodes(newTok.cx, sqY)) {
      for (const kn of tNodes(cachedTokens[0].cx, skY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.08)", 0.5);
      for (const kn of tNodes(cachedTokens[1].cx, skY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.12)", 0.6);
      for (const kn of tNodes(newTok.cx, skY)) edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.2)", 0.8);
    }
    Y += 42;
    layerLabel(Y, "Attention Output (1 vector, not 3)", "rgba(0,188,212,0.6)");
    Y += 52;
    const saOutY = Y;
    const saOutVecs = [0.6, 0.1, 0.6];
    for (let d = 0; d < 3; d++) {
      edge(cachedTokens[0].cx + DIMX[d], svY + R, newTok.cx + DIMX[d], saOutY - R, "rgba(255,193,7,0.05)", 0.3);
      edge(cachedTokens[1].cx + DIMX[d], svY + R, newTok.cx + DIMX[d], saOutY - R, "rgba(255,193,7,0.08)", 0.4);
      edge(newTok.cx + DIMX[d], svY + R, newTok.cx + DIMX[d], saOutY - R, "rgba(255,193,7,0.2)", 0.8);
    }
    DIMX.forEach((dx, i) => node(newTok.cx + dx, saOutY, "rgba(255,193,7,0.15)", "#ffc107", saOutVecs[i], "#ffe082"));
    newBadge(newTok.cx, saOutY + 46, 'Single output vector for "cat" only');
    Y += 84;
    explainBox(CX, Y, 840, [
      ["WHY IS THIS FASTER THAN RECOMPUTING?", "rgba(0,230,118,0.8)", 15, "700"],
      ["Without cache: compute Q,K,V for ALL 3 tokens, run attention on 3x3 matrix. O(n^2).", "rgba(255,255,255,0.4)", 12, "400"],
      ["With cache: compute Q,K,V for 1 token, read cached K,V, attention on 1x3. O(n).", "rgba(0,230,118,0.5)", 12, "600"],
      ["At 100K tokens, that is 100,000x cheaper per step. KV cache is essential for fast generation.", "rgba(255,255,255,0.45)", 12, "400"],
    ], "rgba(0,230,118,0.6)", "rgba(0,230,118,0.04)");
    Y += 158;
    layerLabel(Y, "Add & LayerNorm (just 1 vector)", "#ffb74d");
    Y += 52;
    const dan1Y = Y;
    const dan1Vec = [-0.3, 0.3, 0.0];
    o2oEdges(tNodes(newTok.cx, saOutY), tNodes(newTok.cx, dan1Y), "rgba(255,193,7,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dan1Y, "rgba(255,152,0,0.12)", "#ff9800", dan1Vec[i], "#ffb74d"));

    if (sub < 5) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 5: Cross-Attention ═══
    Y += 76;
    label(CX, Y + 28, "Cross-Attention (decoder Q, encoder K,V from cache)", "#80deea", 17, "700");
    Y += 30;
    label(CX, Y + 28, 'Only "cat" computes Q. K,V are the 6 encoder vectors (cached from Phase 1).', "rgba(255,255,255,0.25)", 12, "400");
    Y += 65;
    layerLabel(Y, 'Decoder x W_Q -> Cross Q (just 1 vector for "cat")', "#f48fb1");
    Y += 52;
    const cqY = Y;
    const cqVecs = [-0.2, 0.2, 0.0];
    fcEdges(tNodes(newTok.cx, dan1Y), tNodes(newTok.cx, cqY), "rgba(233,30,99,0.1)", 0.6);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, cqY, "rgba(233,30,99,0.15)", "#e91e63", cqVecs[i], "#f48fb1"));
    Y += 76;
    el("rect", { x: 20, y: Y - 10, width: 860, height: 110, rx: 8, fill: "rgba(0,188,212,0.03)", stroke: "rgba(0,188,212,0.2)", "stroke-width": 1 });
    label(CX, Y + 14, "Encoder K,V: 6 vectors from encoder output (cached, never recomputed)", "#80deea", 15, "700");
    const encCacheY = Y + 42;
    for (let t = 0; t < 6; t++) {
      const cx = 80 + t * 140;
      el("rect", { x: cx - 28, y: encCacheY - 8, width: 56, height: 20, rx: 4, fill: encTokens[t].bg + "0.2)", stroke: encTokens[t].color + "0.7)", "stroke-width": 0.8, "stroke-dasharray": "3,2" });
      label(cx, encCacheY + 5, encTokens[t].name, encTokens[t].light + "0.8)", 13, "600");
    }
    cacheBadge(CX, encCacheY + 28, "ENCODER OUTPUT - computed once in Phase 1, reused every step");
    Y += 150;
    layerLabel(Y, '"cat" Q dots ALL 6 encoder K -> weighted sum of 6 encoder V', "rgba(0,188,212,0.6)");
    Y += 52;
    const crossOutY = Y;
    const crossVecs = [0.5, 0.2, 0.3];
    o2oEdges(tNodes(newTok.cx, cqY), tNodes(newTok.cx, crossOutY), "rgba(0,188,212,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, crossOutY, "rgba(0,188,212,0.15)", "#00bcd4", crossVecs[i], "#80deea"));
    callout(CX, crossOutY + 46, '"cat" now incorporates information from ALL input words');
    Y += 95;
    layerLabel(Y, "Add & LayerNorm", "#ffb74d");
    Y += 52;
    const dan2Y = Y;
    const dan2Vec = [0.0, 0.1, -0.1];
    o2oEdges(tNodes(newTok.cx, crossOutY), tNodes(newTok.cx, dan2Y), "rgba(255,193,7,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dan2Y, "rgba(255,152,0,0.12)", "#ff9800", dan2Vec[i], "#ffb74d"));

    if (sub < 6) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 6: Decoder FFN ═══
    Y += 76;
    label(CX, Y + 28, 'Decoder FFN (just 1 vector through - "cat" only)', "#90caf9", 16, "700");
    Y += 30;
    label(CX, Y + 28, "FFN processes each vector independently, so only the new token needs to go through.", "rgba(255,255,255,0.25)", 12, "400");
    Y += 57;
    layerLabel(Y, "FFN Layer 1: 3 -> 6 + ReLU", "#90caf9");
    Y += 52;
    const dffn1Y = Y;
    const ffnDX = [-36, -22, -7, 7, 22, 36];
    const from = tNodes(newTok.cx, dan2Y);
    for (const fn of from) for (const dx of ffnDX) edge(fn.x, fn.y + R, newTok.cx + dx, dffn1Y - 8, "rgba(100,149,237,0.08)", 0.5);
    for (const dx of ffnDX) node(newTok.cx + dx, dffn1Y, "rgba(100,149,237,0.15)", "rgba(100,149,237,0.6)", "", "", 8);
    Y += 65;
    layerLabel(Y, "FFN Layer 2: 6 -> 3", "#90caf9");
    Y += 52;
    const dffn2Y = Y;
    const dffn2Vecs = [0.1, 0.1, 0.0];
    const to = tNodes(newTok.cx, dffn2Y);
    for (const dx of ffnDX) for (const tn of to) edge(newTok.cx + dx, dffn1Y + 8, tn.x, dffn2Y - R, "rgba(100,149,237,0.08)", 0.5);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dffn2Y, "rgba(100,149,237,0.15)", "rgba(100,149,237,0.7)", dffn2Vecs[i], "#90caf9"));
    Y += 24;
    explainBox(CX, Y + 28, 840, [
      ["WHY ONLY RUN FFN ON THE NEW TOKEN?", "rgba(0,230,118,0.8)", 15, "700"],
      ["FFN does NOT mix information between tokens. It applies the same function to each vector independently.", "rgba(255,255,255,0.4)", 12, "400"],
      ["Previous tokens' FFN outputs are already \"baked into\" the K,V vectors stored in the cache.", "rgba(255,255,255,0.4)", 12, "400"],
      ['So running FFN on <s> or "The" again would produce the EXACT same output. No point recomputing.', "rgba(0,230,118,0.5)", 12, "600"],
    ], "rgba(0,230,118,0.6)", "rgba(0,230,118,0.04)");
    Y += 190;
    layerLabel(Y, 'Add & LayerNorm (decoder block output for "cat")', "#ffb74d");
    Y += 52;
    const dan3Y = Y;
    const dan3Vec = [0.1, 0.2, -0.3];
    o2oEdges(tNodes(newTok.cx, dffn2Y), tNodes(newTok.cx, dan3Y), "rgba(255,193,7,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dan3Y, "rgba(255,152,0,0.12)", "#ff9800", dan3Vec[i], "#ffb74d"));

    if (sub < 7) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 7: Output Head ═══
    Y += 86;
    label(CX, Y + 16, 'Output Head ("cat" vector -> next word prediction)', "#b8a9ff", 17, "700");
    Y += 57;
    layerLabel(Y, "Linear Projection (3 -> vocab size)", "#b8a9ff");
    Y += 62;
    const outY = Y;
    const vocabWords = ['"sat"', '"is"', '"ran"', '"sees"', '"went"'];
    const vocabX = [270, 360, 450, 540, 630];
    const vocabScores = [3.5, 0.8, 1.2, -0.3, 0.5];
    for (const dx of DIMX) for (const vx of vocabX) edge(newTok.cx + dx, dan3Y + R, vx, outY - R, "rgba(156,120,255,0.12)", 0.6);
    vocabX.forEach((vx, i) => {
      node(vx, outY, "rgba(156,120,255,0.12)", "#9c78ff", vocabScores[i], "#b8a9ff");
      label(vx, outY - 26, vocabWords[i], "rgba(255,255,255,0.35)", 13, "600");
    });
    Y += 81;
    layerLabel(Y, "Softmax -> Probabilities", "rgba(255,255,255,0.5)");
    Y += 49;
    const smY = Y;
    const probs = ["72.1%", "4.8%", "7.2%", "1.6%", "3.6%"];
    vocabX.forEach((vx, i) => {
      edge(vx, outY + R, vx, smY - R, "rgba(255,255,255,0.1)", 0.8);
      const w = i === 0;
      node(vx, smY, w ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)", w ? "#4caf50" : "rgba(255,255,255,0.2)", probs[i], w ? "#80e8a5" : "rgba(255,255,255,0.3)");
    });
    Y += 68;
    el("rect", { x: 420, y: Y - 4, width: 60, height: 28, rx: 10, fill: "rgba(76,175,80,0.2)", stroke: "#4caf50", "stroke-width": 2 });
    label(CX, Y + 14, '"sat"', "#80e8a5", 19, "700");
    edge(CX, smY + R, CX, Y - 6, "rgba(76,175,80,0.4)", 1.5);
    Y += 57;
    label(CX, Y, 'Predicted next token: "sat"', "rgba(255,255,255,0.3)", 15, "600");
    label(CX, Y + 16, '"sat" feeds back as decoder input for Step 4.', "rgba(255,152,0,0.5)", 12, "600");
    Y += 59;
    explainBox(CX, Y, 840, [
      ["WHY ONLY THE LAST POSITION?", "rgba(255,152,0,0.8)", 16, "700"],
      ["During generation, there IS only one position flowing through - the new token.", "rgba(255,255,255,0.5)", 12, "400"],
      ['<s> and "The" were processed in Steps 1-2. Their predictions are done. We already used them.', "rgba(255,255,255,0.4)", 12, "400"],
      ['The single vector for "cat" at the output is all we need to predict the next word "sat".', "rgba(0,230,118,0.5)", 12, "600"],
    ], "rgba(255,152,0,0.6)", "rgba(255,152,0,0.04)");

    if (sub < 8) { svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160)); return; }

    // ═══ sub 8: What happens next + Memory cost ═══
    Y += 158;
    el("rect", { x: 20, y: Y, width: 860, height: 280, rx: 10, fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.2)", "stroke-width": 1.5 });
    label(CX, Y + 34, "What Happens Next", "rgba(255,255,255,0.5)", 19, "700");
    Y += 68;
    label(CX, Y, 'Step 4: "sat" enters the decoder. KV cache now has <s>, "The", "cat". Predicts "on".', "rgba(255,255,255,0.4)", 15, "400");
    Y += 34;
    label(CX, Y, 'Step 5: "on" enters. KV cache has <s>, "The", "cat", "sat". Predicts "the".', "rgba(255,255,255,0.4)", 15, "400");
    Y += 34;
    label(CX, Y, 'Step 6: "the" enters. KV cache has <s>, "The", "cat", "sat", "on". Predicts "mat".', "rgba(255,255,255,0.4)", 15, "400");
    Y += 34;
    label(CX, Y, 'Step 7: "mat" enters. Predicts <end>. Generation stops.', "rgba(255,255,255,0.4)", 15, "400");
    Y += 35;
    label(CX, Y, 'Final output: "The cat sat on the mat" (7 decoder steps, encoder ran once)', "rgba(0,230,118,0.6)", 16, "700");

    Y += 100;
    el("rect", { x: 20, y: Y, width: 860, height: 345, rx: 10, fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.2)", "stroke-width": 1.5 });
    label(CX, Y + 28, "KV Cache: Memory vs Speed Tradeoff", "rgba(255,255,255,0.5)", 19, "700");
    const mY = Y + 56;
    [
      ["What is stored:", "K and V vectors at every attention layer, for every past token.", "rgba(0,188,212,0.6)"],
      ["Self-attention cache:", "Grows by 1 entry per step. At step N, holds N-1 K,V pairs per layer.", "#f48fb1"],
      ["Cross-attention cache:", "Fixed size (6 vectors K + 6 vectors V). Set once from encoder output.", "#80deea"],
      ["Real scale (GPT-4):", "96 layers, 128 heads, 128 dims/head. Each token = 96*128*128 = 1.57M floats for K+V.", "rgba(255,255,255,0.5)"],
      ["At 100K context:", "100K * 1.57M * 2 bytes (fp16) = ~300 GB just for the KV cache.", "#ef9a9a"],
      ["Without cache:", "Each step would recompute ALL tokens. Step N costs O(N). Total: O(N^2). Impossibly slow.", "rgba(255,255,255,0.4)"],
      ["With cache:", "Each step costs O(1) for FFN + O(N) for attention lookup. Total: O(N). Much faster.", "rgba(0,230,118,0.6)"],
      ["Tradeoff:", "KV cache uses lots of GPU memory but makes generation feasible. No cache = no fast LLMs.", "rgba(255,152,0,0.6)"],
    ].forEach(([title, desc, color], i) => {
      label(40, mY + i * 38, title, color, 15, "700", "start");
      label(220, mY + i * 38, desc, "rgba(255,255,255,0.35)", 12, "400", "start");
    });
    svg.setAttribute("viewBox", "-10 0 900 " + (Y + 365));
  }, [sub]);

  const endRef = useRef(null);
  useEffect(() => { if (sub > 0 && endRef.current && endRef.current.scrollIntoView) endRef.current.scrollIntoView({ behavior: "smooth", block: "end" }); }, [sub]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center" }}>
      <svg ref={ref} style={{ width: "100%", maxWidth: 1100, display: "block" }} />
      {sub < 8 && <SubBtn onClick={() => setSub(sub + 1)} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
      <div ref={endRef} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════

export const EncoderDecoderTraining = (ctx) => <TrainingDiagram {...ctx} />;
export const EncoderDecoderInference = (ctx) => <InferenceDiagram {...ctx} />;
