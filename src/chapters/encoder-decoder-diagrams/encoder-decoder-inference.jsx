import { useRef, useEffect } from "react";
import { SubBtn } from "../../components.jsx";

const R = 16,
  DX = 42,
  DIMX = [-DX, 0, DX],
  CX = 450;

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
    if (lbl !== "")
      el("text", {
        x: cx,
        y: cy + 4,
        fill: lblColor,
        "font-size": 10,
        "text-anchor": "middle",
        "font-family": "monospace",
        "font-weight": "600",
      }).textContent = lbl;
  };
  const edge = (x1, y1, x2, y2, color, width = 1) => {
    el("line", { x1, y1, x2, y2, stroke: color, "stroke-width": width });
  };
  const label = (x, y, text, color, size = 17, weight = "600", anchor = "middle") => {
    el("text", {
      x,
      y,
      fill: color,
      "font-size": size,
      "text-anchor": anchor,
      "font-weight": weight,
      "font-family": "sans-serif",
    }).textContent = text;
  };
  const clabel = (x, y, text, color, size = 17, weight = "600", anchor = "middle") => {
    el("text", {
      x,
      y,
      fill: color,
      "font-size": size,
      "text-anchor": anchor,
      "font-weight": weight,
      "font-family": "sans-serif",
      "dominant-baseline": "central",
    }).textContent = text;
  };
  const layerLabel = (y, text, color) => {
    const w = Math.max(260, text.length * 10 + 40);
    const x = CX - w / 2;
    el("rect", {
      x,
      y: y - 17,
      width: w,
      height: 34,
      rx: 6,
      fill: "#08080d",
      stroke: color,
      "stroke-width": 1,
    });
    clabel(CX, y, text, color, 16, "700");
  };
  const tNodes = (cx, y) => DIMX.map((dx) => ({ x: cx + dx, y }));
  const fcEdges = (from, to, color, width = 0.8) => {
    for (const f of from) for (const t of to) edge(f.x, f.y + R, t.x, t.y - R, color, width);
  };
  const o2oEdges = (from, to, color, width = 1) => {
    for (let i = 0; i < from.length; i++) edge(from[i].x, from[i].y + R, to[i].x, to[i].y - R, color, width);
  };
  const callout = (x, y, text, color, bg) => {
    const w = text.length * 8.5 + 32;
    el("rect", { x: x - w / 2, y: y - 15, width: w, height: 30, rx: 10, fill: bg, stroke: color, "stroke-width": 0.8 });
    clabel(x, y, text, color, 15, "600");
  };
  const explainBox = (x, y, w, lines, bc = "rgba(255,152,0,0.6)", bg = "rgba(255,152,0,0.04)") => {
    const h = lines.length * 26 + 24;
    el("rect", { x: x - w / 2, y: y - 6, width: w, height: h, rx: 8, fill: bg, stroke: bc, "stroke-width": 2.5 });
    lines.forEach(([t, c, s, wt], i) => {
      label(x, y + 16 + i * 26, t, c, s, wt);
    });
    return h;
  };
  const cachedNode = (cx, cy, fill, stroke, lbl, lblColor, r = R) => {
    node(cx, cy, fill, stroke, lbl, lblColor, r);
    el("circle", {
      cx,
      cy,
      r: r + 3,
      fill: "none",
      stroke: "rgba(255,152,0,0.25)",
      "stroke-width": 0.8,
      "stroke-dasharray": "3,2",
    });
  };
  const cacheBadge = (x, y, text = "CACHED") => {
    const w = text.length * 9.5 + 12;
    el("rect", {
      x: x - w / 2,
      y: y - 12,
      width: w,
      height: 24,
      rx: 8,
      fill: "rgba(255,152,0,0.08)",
      stroke: "rgba(255,152,0,0.4)",
      "stroke-width": 0.8,
    });
    clabel(x, y, text, "rgba(255,152,0,0.7)", 12, "700");
  };
  const newBadge = (x, y, text = "NEW - flows through network") => {
    const w = text.length * 8.5 + 16;
    el("rect", {
      x: x - w / 2,
      y: y - 12,
      width: w,
      height: 24,
      rx: 8,
      fill: "rgba(0,230,118,0.06)",
      stroke: "rgba(0,230,118,0.4)",
      "stroke-width": 0.8,
    });
    clabel(x, y, text, "rgba(0,230,118,0.7)", 12, "700");
  };
  const desc = (text) => {
    const e = document.createElementNS(NS, "desc");
    e.textContent = text;
    svg.insertBefore(e, svg.firstChild);
  };
  return {
    el,
    node,
    edge,
    label,
    clabel,
    layerLabel,
    tNodes,
    fcEdges,
    o2oEdges,
    callout,
    explainBox,
    cachedNode,
    cacheBadge,
    newBadge,
    desc,
  };
}

function InferenceDiagram({ sub, setSub, subBtnRipple, setSubBtnRipple: _setSubBtnRipple, registerSubBtn }) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const {
      el,
      node,
      edge,
      label,
      clabel,
      layerLabel,
      tNodes,
      fcEdges,
      o2oEdges,
      callout,
      explainBox,
      cachedNode,
      cacheBadge,
      newBadge,
      desc,
    } = B(svg);
    desc(
      "Progressive encoder-decoder inference flow diagram showing autoregressive generation: encoder runs once, KV output is cached, decoder loops processing one new token at a time using KV cache",
    );

    let Y = 30;

    // ═══ sub 0: Title + Big Picture ═══
    el("rect", {
      x: 20,
      y: Y - 5,
      width: 860,
      height: 52,
      rx: 10,
      fill: "rgba(255,152,0,0.04)",
      stroke: "rgba(255,152,0,0.3)",
      "stroke-width": 1.5,
    });
    clabel(CX, Y + 12, "PRODUCTION / INFERENCE MODE (autoregressive generation)", "rgba(255,152,0,0.8)", 22, "700");
    clabel(
      CX,
      Y + 34,
      "Only ONE new token flows through the decoder at each step. Previous K,V are cached.",
      "rgba(255,152,0,0.5)",
      15,
      "600",
    );

    Y += 70;
    explainBox(
      CX,
      Y,
      840,
      [
        ["HOW INFERENCE WORKS - THE BIG PICTURE", "rgba(255,152,0,0.8)", 17, "700"],
        [
          '1. ENCODER runs ONCE on the full input "The cat sat on the mat" (6 tokens, all in parallel).',
          "rgba(0,188,212,0.6)",
          12,
          "600",
        ],
        [
          "2. Encoder output (6 vectors) becomes K,V for cross-attention. Cached permanently.",
          "rgba(0,188,212,0.5)",
          12,
          "400",
        ],
        ["3. DECODER runs in a LOOP, one new token at a time:", "rgba(156,120,255,0.7)", 12, "600"],
        ['   Step 1: feed <s>           -> predict "The"', "rgba(255,255,255,0.45)", 12, "400"],
        ['   Step 2: feed "The"         -> predict "cat"     (KV cache has <s>)', "rgba(255,255,255,0.45)", 12, "400"],
        [
          '   Step 3: feed "cat"         -> predict "sat"     (KV cache has <s>, "The")',
          "rgba(255,255,255,0.45)",
          12,
          "400",
        ],
        [
          '   Step 4: feed "sat"         -> predict "on"      (KV cache has <s>, "The", "cat")',
          "rgba(255,255,255,0.45)",
          12,
          "400",
        ],
        ["   ...until <end> token is produced.", "rgba(255,255,255,0.3)", 12, "400"],
        [
          "4. At each step, ONLY the new token runs through all layers. Previous tokens' K,V are read from cache.",
          "rgba(0,230,118,0.6)",
          14,
          "700",
        ],
      ],
      "rgba(255,152,0,0.6)",
      "rgba(255,152,0,0.04)",
    );

    if (sub < 1) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 320));
      return;
    }

    // ═══ sub 1: Encoder (runs once) ═══
    Y += 314;
    label(CX, Y + 30, "PHASE 1: ENCODER (runs ONCE, identical to training)", "#80deea", 19, "700");
    Y += 30;
    label(
      CX,
      Y + 30,
      '"The cat sat on the mat" -> 6 tokens flow through all encoder layers in parallel',
      "rgba(255,255,255,0.3)",
      15,
      "400",
    );
    Y += 30;
    label(
      CX,
      Y + 30,
      "Self-attention (bidirectional, no mask) -> Add&Norm -> FFN -> Add&Norm -> repeat x6",
      "rgba(255,255,255,0.25)",
      12,
      "400",
    );
    Y += 86;
    const encTokens = [
      { name: '"The"', cx: 80, color: "#f44336", light: "#ef9a9a", bg: "rgba(244,67,54," },
      { name: '"cat"', cx: 230, color: "#ffc107", light: "#ffe082", bg: "rgba(255,193,7," },
      { name: '"sat"', cx: 380, color: "#4caf50", light: "#80e8a5", bg: "rgba(76,175,80," },
      { name: '"on"', cx: 530, color: "#00bcd4", light: "#80deea", bg: "rgba(0,188,212," },
      { name: '"the"', cx: 680, color: "#9c27b0", light: "#ce93d8", bg: "rgba(156,39,176," },
      { name: '"mat"', cx: 830, color: "#ff9800", light: "#ffcc80", bg: "rgba(255,152,0," },
    ];
    const encOutY = Y;
    const encOutVecs = [
      [-0.8, -0.5, 1.3],
      [-0.7, -0.3, 1.0],
      [-0.5, -0.1, 0.6],
      [-0.4, 0.0, 0.4],
      [-0.7, -0.4, 1.1],
      [-0.3, -0.1, 0.4],
    ];
    for (let t = 0; t < 6; t++) {
      label(encTokens[t].cx, encOutY - 26, encTokens[t].name, encTokens[t].light, 15, "700");
      DIMX.forEach((dx, i) =>
        cachedNode(
          encTokens[t].cx + dx,
          encOutY,
          encTokens[t].bg + "0.15)",
          encTokens[t].color,
          encOutVecs[t][i],
          encTokens[t].light,
        ),
      );
    }
    Y += 46;
    cacheBadge(CX, Y, "ENCODER OUTPUT CACHED - reused as cross-attention K,V for every decoder step");

    if (sub < 2) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

    // ═══ sub 2: Decoder setup + tokens ═══
    Y += 81;
    el("rect", {
      x: 20,
      y: Y - 8,
      width: 860,
      height: 86,
      rx: 8,
      fill: "rgba(156,120,255,0.04)",
      stroke: "rgba(156,120,255,0.2)",
      "stroke-width": 1.5,
    });
    clabel(CX, Y + 22, 'PHASE 2: DECODER - showing Step 3: generating after "<s> The cat"', "#b8a9ff", 17, "700");
    clabel(
      CX,
      Y + 52,
      'Already generated: "<s>", "The", "cat". Now predicting the next token.',
      "rgba(255,255,255,0.3)",
      15,
      "400",
    );
    Y += 105;
    explainBox(
      CX,
      Y,
      840,
      [
        ["DECODER STATE AT STEP 3", "rgba(156,120,255,0.8)", 16, "700"],
        [
          'KV Cache (self-attention) contains K,V for: <s> (step 1), "The" (step 2). These were computed in earlier steps.',
          "rgba(255,152,0,0.6)",
          12,
          "600",
        ],
        ['NEW token entering now: "cat" (the token we just generated in step 2).', "rgba(0,230,118,0.6)", 12, "600"],
        [
          'Only "cat" flows through the full decoder. <s> and "The" are NOT recomputed.',
          "rgba(255,255,255,0.4)",
          12,
          "400",
        ],
      ],
      "rgba(156,120,255,0.3)",
      "rgba(156,120,255,0.02)",
    );

    Y += 158;
    label(CX, Y + 30, 'DECODER STEP 3: Only "cat" flows through all layers', "#b8a9ff", 19, "700");
    Y += 60;
    const cacheCol = 250,
      newCol = 680;
    label(cacheCol, Y, "FROM KV CACHE (not recomputed)", "rgba(255,152,0,0.6)", 15, "700");
    Y += 45;
    const cachedTokens = [
      { name: '"<s>"', cx: 200, color: "#78909c", light: "#b0bec5", bg: "rgba(120,144,156," },
      { name: '"The"', cx: 380, color: "#e91e63", light: "#f48fb1", bg: "rgba(233,30,99," },
    ];
    label(newCol, Y - 45, "NEW TOKEN (flows through network)", "rgba(0,230,118,0.6)", 15, "700");
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

    if (sub < 3) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

    // ═══ sub 3: Masked Self-Attention with KV cache ═══
    Y += 95;
    label(CX, Y + 28, "Masked Self-Attention (with KV Cache)", "#f48fb1", 17, "700");
    Y += 30;
    label(
      CX,
      Y + 28,
      'Only "cat" computes Q. K,V for <s> and "The" come from cache.',
      "rgba(255,255,255,0.25)",
      12,
      "400",
    );

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
    const cachedKVecs = [
      [0.4, 0.0, 0.3],
      [0.7, 0.2, 0.1],
    ];
    for (let t = 0; t < 2; t++) {
      DIMX.forEach((dx, i) =>
        cachedNode(
          cachedTokens[t].cx + dx,
          skY,
          cachedTokens[t].bg + "0.06)",
          cachedTokens[t].color + "0.3)",
          cachedKVecs[t][i],
          cachedTokens[t].light + "0.4)",
        ),
      );
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
    const cachedVVecs = [
      [0.5, -0.2, 0.6],
      [0.8, 0.1, 0.4],
    ];
    for (let t = 0; t < 2; t++) {
      DIMX.forEach((dx, i) =>
        cachedNode(
          cachedTokens[t].cx + dx,
          svY,
          cachedTokens[t].bg + "0.06)",
          cachedTokens[t].color + "0.3)",
          cachedVVecs[t][i],
          cachedTokens[t].light + "0.4)",
        ),
      );
    }
    cacheBadge(cacheCol, svY + 46, "V from cache (computed in steps 1-2)");
    const newVVecs = [0.6, 0.3, 0.7];
    fcEdges(tNodes(newTok.cx, allDecY), tNodes(newTok.cx, svY), "rgba(76,175,80,0.1)", 0.6);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, svY, "rgba(76,175,80,0.15)", "#4caf50", newVVecs[i], "#80e8a5"));
    newBadge(newTok.cx, svY + 46, "New V computed, then ADDED to cache");

    if (sub < 4) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

    // ═══ sub 4: Attention computation + output + savings + Add & Norm ═══
    Y += 95;
    layerLabel(Y, '"cat" Q attends to ALL K (cached + new)', "rgba(255,255,255,0.5)");
    Y += 36;
    label(
      CX,
      Y,
      '"cat" Q dots with K_<s>, K_The, K_cat -> 3 attention scores -> softmax -> weighted V sum',
      "rgba(255,255,255,0.25)",
      12,
      "400",
    );
    Y += 14;
    for (const qn of tNodes(newTok.cx, sqY)) {
      for (const kn of tNodes(cachedTokens[0].cx, skY))
        edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.08)", 0.5);
      for (const kn of tNodes(cachedTokens[1].cx, skY))
        edge(qn.x, qn.y + R, kn.x, kn.y - R, "rgba(255,193,7,0.12)", 0.6);
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
    explainBox(
      CX,
      Y,
      840,
      [
        ["WHY IS THIS FASTER THAN RECOMPUTING?", "rgba(0,230,118,0.8)", 15, "700"],
        [
          "Without cache: compute Q,K,V for ALL 3 tokens, run attention on 3x3 matrix. O(n^2).",
          "rgba(255,255,255,0.4)",
          12,
          "400",
        ],
        [
          "With cache: compute Q,K,V for 1 token, read cached K,V, attention on 1x3. O(n).",
          "rgba(0,230,118,0.5)",
          12,
          "600",
        ],
        [
          "At 100K tokens, that is 100,000x cheaper per step. KV cache is essential for fast generation.",
          "rgba(255,255,255,0.45)",
          12,
          "400",
        ],
      ],
      "rgba(0,230,118,0.6)",
      "rgba(0,230,118,0.04)",
    );
    Y += 158;
    layerLabel(Y, "Add & LayerNorm (just 1 vector)", "#ffcc80");
    Y += 52;
    const dan1Y = Y;
    const dan1Vec = [-0.3, 0.3, 0.0];
    o2oEdges(tNodes(newTok.cx, saOutY), tNodes(newTok.cx, dan1Y), "rgba(255,193,7,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dan1Y, "rgba(255,152,0,0.12)", "#ff9800", dan1Vec[i], "#ffcc80"));

    if (sub < 5) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

    // ═══ sub 5: Cross-Attention ═══
    Y += 76;
    label(CX, Y + 28, "Cross-Attention (decoder Q, encoder K,V from cache)", "#80deea", 17, "700");
    Y += 30;
    label(
      CX,
      Y + 28,
      'Only "cat" computes Q. K,V are the 6 encoder vectors (cached from Phase 1).',
      "rgba(255,255,255,0.25)",
      12,
      "400",
    );
    Y += 65;
    layerLabel(Y, 'Decoder x W_Q -> Cross Q (just 1 vector for "cat")', "#f48fb1");
    Y += 52;
    const cqY = Y;
    const cqVecs = [-0.2, 0.2, 0.0];
    fcEdges(tNodes(newTok.cx, dan1Y), tNodes(newTok.cx, cqY), "rgba(233,30,99,0.1)", 0.6);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, cqY, "rgba(233,30,99,0.15)", "#e91e63", cqVecs[i], "#f48fb1"));
    Y += 76;
    el("rect", {
      x: 20,
      y: Y - 10,
      width: 860,
      height: 110,
      rx: 8,
      fill: "rgba(0,188,212,0.03)",
      stroke: "rgba(0,188,212,0.2)",
      "stroke-width": 1,
    });
    label(CX, Y + 14, "Encoder K,V: 6 vectors from encoder output (cached, never recomputed)", "#80deea", 15, "700");
    const encCacheY = Y + 42;
    for (let t = 0; t < 6; t++) {
      const cx = 80 + t * 140;
      el("rect", {
        x: cx - 28,
        y: encCacheY - 8,
        width: 56,
        height: 20,
        rx: 4,
        fill: encTokens[t].bg + "0.2)",
        stroke: encTokens[t].color + "0.7)",
        "stroke-width": 0.8,
        "stroke-dasharray": "3,2",
      });
      clabel(cx, encCacheY + 2, encTokens[t].name, encTokens[t].light + "0.8)", 13, "600");
    }
    cacheBadge(CX, encCacheY + 28, "ENCODER OUTPUT - computed once in Phase 1, reused every step");
    Y += 150;
    layerLabel(Y, '"cat" Q dots ALL 6 encoder K -> weighted sum of 6 encoder V', "rgba(0,188,212,0.6)");
    Y += 52;
    const crossOutY = Y;
    const crossVecs = [0.5, 0.2, 0.3];
    o2oEdges(tNodes(newTok.cx, cqY), tNodes(newTok.cx, crossOutY), "rgba(0,188,212,0.2)", 1);
    DIMX.forEach((dx, i) =>
      node(newTok.cx + dx, crossOutY, "rgba(0,188,212,0.15)", "#00bcd4", crossVecs[i], "#80deea"),
    );
    callout(CX, crossOutY + 46, '"cat" now incorporates information from ALL input words');
    Y += 95;
    layerLabel(Y, "Add & LayerNorm", "#ffcc80");
    Y += 52;
    const dan2Y = Y;
    const dan2Vec = [0.0, 0.1, -0.1];
    o2oEdges(tNodes(newTok.cx, crossOutY), tNodes(newTok.cx, dan2Y), "rgba(255,193,7,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dan2Y, "rgba(255,152,0,0.12)", "#ff9800", dan2Vec[i], "#ffcc80"));

    if (sub < 6) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

    // ═══ sub 6: Decoder FFN ═══
    Y += 76;
    label(CX, Y + 28, 'Decoder FFN (just 1 vector through - "cat" only)', "#90caf9", 16, "700");
    Y += 30;
    label(
      CX,
      Y + 28,
      "FFN processes each vector independently, so only the new token needs to go through.",
      "rgba(255,255,255,0.25)",
      12,
      "400",
    );
    Y += 57;
    layerLabel(Y, "FFN Layer 1: 3 -> 6 + ReLU", "#90caf9");
    Y += 52;
    const dffn1Y = Y;
    const ffnDX = [-36, -22, -7, 7, 22, 36];
    const from = tNodes(newTok.cx, dan2Y);
    for (const fn of from)
      for (const dx of ffnDX) edge(fn.x, fn.y + R, newTok.cx + dx, dffn1Y - 8, "rgba(100,149,237,0.08)", 0.5);
    for (const dx of ffnDX) node(newTok.cx + dx, dffn1Y, "rgba(100,149,237,0.15)", "rgba(100,149,237,0.6)", "", "", 8);
    Y += 65;
    layerLabel(Y, "FFN Layer 2: 6 -> 3", "#90caf9");
    Y += 52;
    const dffn2Y = Y;
    const dffn2Vecs = [0.1, 0.1, 0.0];
    const to = tNodes(newTok.cx, dffn2Y);
    for (const dx of ffnDX)
      for (const tn of to) edge(newTok.cx + dx, dffn1Y + 8, tn.x, dffn2Y - R, "rgba(100,149,237,0.08)", 0.5);
    DIMX.forEach((dx, i) =>
      node(newTok.cx + dx, dffn2Y, "rgba(100,149,237,0.15)", "rgba(100,149,237,0.7)", dffn2Vecs[i], "#90caf9"),
    );
    Y += 24;
    explainBox(
      CX,
      Y + 28,
      840,
      [
        ["WHY ONLY RUN FFN ON THE NEW TOKEN?", "rgba(0,230,118,0.8)", 15, "700"],
        [
          "FFN does NOT mix information between tokens. It applies the same function to each vector independently.",
          "rgba(255,255,255,0.4)",
          12,
          "400",
        ],
        [
          'Previous tokens\' FFN outputs are already "baked into" the K,V vectors stored in the cache.',
          "rgba(255,255,255,0.4)",
          12,
          "400",
        ],
        [
          'So running FFN on <s> or "The" again would produce the EXACT same output. No point recomputing.',
          "rgba(0,230,118,0.5)",
          12,
          "600",
        ],
      ],
      "rgba(0,230,118,0.6)",
      "rgba(0,230,118,0.04)",
    );
    Y += 190;
    layerLabel(Y, 'Add & LayerNorm (decoder block output for "cat")', "#ffcc80");
    Y += 52;
    const dan3Y = Y;
    const dan3Vec = [0.1, 0.2, -0.3];
    o2oEdges(tNodes(newTok.cx, dffn2Y), tNodes(newTok.cx, dan3Y), "rgba(255,193,7,0.2)", 1);
    DIMX.forEach((dx, i) => node(newTok.cx + dx, dan3Y, "rgba(255,152,0,0.12)", "#ff9800", dan3Vec[i], "#ffcc80"));

    if (sub < 7) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

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
    for (const dx of DIMX)
      for (const vx of vocabX) edge(newTok.cx + dx, dan3Y + R, vx, outY - R, "rgba(156,120,255,0.12)", 0.6);
    vocabX.forEach((vx, i) => {
      node(vx, outY, "rgba(156,120,255,0.12)", "#9c78ff", vocabScores[i], "#b8a9ff");
      label(vx, outY - 26, vocabWords[i], "rgba(255,255,255,0.35)", 13, "600");
    });
    Y += 81;
    layerLabel(Y, "Softmax -> Probabilities", "rgba(255,255,255,0.5)");
    Y += 49;
    const smY = Y;
    const probs = ["80.7%", "5.4%", "8.1%", "1.8%", "4.0%"];
    vocabX.forEach((vx, i) => {
      edge(vx, outY + R, vx, smY - R, "rgba(255,255,255,0.1)", 0.8);
      const w = i === 0;
      node(
        vx,
        smY,
        w ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.05)",
        w ? "#4caf50" : "rgba(255,255,255,0.2)",
        probs[i],
        w ? "#80e8a5" : "rgba(255,255,255,0.3)",
      );
    });
    Y += 68;
    el("rect", {
      x: 420,
      y: Y - 4,
      width: 60,
      height: 28,
      rx: 10,
      fill: "rgba(76,175,80,0.2)",
      stroke: "#4caf50",
      "stroke-width": 2,
    });
    label(CX, Y + 14, '"sat"', "#80e8a5", 19, "700");
    edge(CX, smY + R, CX, Y - 6, "rgba(76,175,80,0.4)", 1.5);
    Y += 57;
    label(CX, Y, 'Predicted next token: "sat"', "rgba(255,255,255,0.3)", 15, "600");
    label(CX, Y + 16, '"sat" feeds back as decoder input for Step 4.', "rgba(255,152,0,0.5)", 12, "600");
    Y += 59;
    explainBox(
      CX,
      Y,
      840,
      [
        ["WHY ONLY THE LAST POSITION?", "rgba(255,152,0,0.8)", 16, "700"],
        [
          "During generation, there is only one position flowing through - the new token.",
          "rgba(255,255,255,0.5)",
          12,
          "400",
        ],
        [
          '<s> and "The" were processed in Steps 1-2. Their predictions are done. We already used them.',
          "rgba(255,255,255,0.4)",
          12,
          "400",
        ],
        [
          'The single vector for "cat" at the output is all we need to predict the next word "sat".',
          "rgba(0,230,118,0.5)",
          12,
          "600",
        ],
      ],
      "rgba(255,152,0,0.6)",
      "rgba(255,152,0,0.04)",
    );

    if (sub < 8) {
      svg.setAttribute("viewBox", "-10 0 900 " + (Y + 160));
      return;
    }

    // ═══ sub 8: What happens next + Memory cost ═══
    Y += 158;
    el("rect", {
      x: 20,
      y: Y,
      width: 860,
      height: 220,
      rx: 10,
      fill: "rgba(255,255,255,0.02)",
      stroke: "rgba(255,255,255,0.2)",
      "stroke-width": 1.5,
    });
    label(CX, Y + 34, "What Happens Next", "rgba(255,255,255,0.5)", 19, "700");
    Y += 68;
    label(
      CX,
      Y,
      'Step 4: "sat" enters the decoder. KV cache now has <s>, "The", "cat". Predicts "on".',
      "rgba(255,255,255,0.4)",
      15,
      "400",
    );
    Y += 34;
    label(
      CX,
      Y,
      'Step 5: "on" enters. KV cache has <s>, "The", "cat", "sat". Predicts "the".',
      "rgba(255,255,255,0.4)",
      15,
      "400",
    );
    Y += 34;
    label(
      CX,
      Y,
      'Step 6: "the" enters. KV cache has <s>, "The", "cat", "sat", "on". Predicts "mat".',
      "rgba(255,255,255,0.4)",
      15,
      "400",
    );
    Y += 34;
    label(CX, Y, 'Step 7: "mat" enters. Predicts <end>. Generation stops.', "rgba(255,255,255,0.4)", 15, "400");
    Y += 35;
    label(
      CX,
      Y,
      'Final output: "The cat sat on the mat" (7 decoder steps, encoder ran once)',
      "rgba(0,230,118,0.6)",
      16,
      "700",
    );

    Y += 50;
    el("rect", {
      x: 20,
      y: Y,
      width: 860,
      height: 345,
      rx: 10,
      fill: "rgba(255,255,255,0.02)",
      stroke: "rgba(255,255,255,0.2)",
      "stroke-width": 1.5,
    });
    label(CX, Y + 28, "KV Cache: Memory vs Speed Tradeoff", "rgba(255,255,255,0.5)", 19, "700");
    const mY = Y + 56;
    [
      ["What is stored:", "K and V vectors at every attention layer, for every past token.", "rgba(0,188,212,0.6)"],
      ["Self-attention cache:", "Grows by 1 entry per step. At step N, holds N-1 K,V pairs per layer.", "#f48fb1"],
      ["Cross-attention cache:", "Fixed size (6 vectors K + 6 vectors V). Set once from encoder output.", "#80deea"],
      [
        "Real scale (GPT-4):",
        "96 layers, 128 heads, 128 dims/head. Each token = 96*128*128 = 1.57M floats for K+V.",
        "rgba(255,255,255,0.5)",
      ],
      ["At 100K context:", "100K * 1.57M * 2 bytes (fp16) = ~300 GB just for the KV cache.", "#ef9a9a"],
      [
        "Without cache:",
        "Each step would recompute ALL tokens. Step N costs O(N). Total: O(N^2). Impossibly slow.",
        "rgba(255,255,255,0.4)",
      ],
      [
        "With cache:",
        "Each step costs O(1) for FFN + O(N) for attention lookup. Total: O(N). Much faster.",
        "rgba(0,230,118,0.6)",
      ],
      [
        "Tradeoff:",
        "KV cache uses lots of GPU memory but makes generation feasible. No cache = no fast LLMs.",
        "rgba(255,152,0,0.6)",
      ],
    ].forEach(([title, desc, color], i) => {
      label(40, mY + i * 38, title, color, 15, "700", "start");
      label(220, mY + i * 38, desc, "rgba(255,255,255,0.35)", 12, "400", "start");
    });
    svg.setAttribute("viewBox", "-10 0 900 " + (Y + 365));
  }, [sub]);

  const endRef = useRef(null);
  useEffect(() => {
    if (sub > 0 && endRef.current && endRef.current.scrollIntoView)
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [sub]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center" }}>
      <svg ref={ref} style={{ width: "100%", maxWidth: 1100, display: "block" }} />
      {sub < 8 && <SubBtn onClick={() => setSub(sub + 1)} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
      <div ref={endRef} />
    </div>
  );
}

export default function EncoderDecoderInference(ctx) {
  return <InferenceDiagram {...ctx} />;
}
