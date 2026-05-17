import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function ScalarQuantization(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  // 8-dim illustrative slice of the d=768 canonical vector, standing in for a full real vector.
  const floatVec = [0.81, 0.12, 0.45, 0.22, 0.63, 0.07, 0.38, 0.91];
  // Per-dimension min/max calibrated across the cat corpus.
  const perDimMin = [0.09, 0.1, 0.12, 0.19, 0.11, 0.05, 0.1, 0.62];
  const perDimMax = [0.83, 0.88, 0.74, 0.81, 0.95, 0.72, 0.7, 0.93];
  // Quantize each value into [0, 255] using the linear map q = round((v - min) / (max - min) * 255).
  const int8Vec = floatVec.map((v, i) => {
    const min = perDimMin[i];
    const max = perDimMax[i];
    return Math.round(((v - min) / (max - min)) * 255);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A float32 vector: 4 bytes per dimension
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Before compression, every dimension is a 32-bit float. A full 768-dim vector is 3 KB. The insight behind
            scalar quantization is simple: most embedding coordinates sit in a narrow range like [0.05, 0.95]. Spending
            a full float32 on that is wasteful - an 8-bit integer can carry enough precision for search.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Doc 1: first 8 dims of the float32 vector
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {floatVec.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 4px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              Each cell = 4 bytes (float32) &middot; total for this row = 32 bytes
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            1 dim = 4 bytes (float32)
            <br />
            768 dims &middot; 4 bytes = <span style={{ color: C.cyan }}>3,072 bytes</span>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The question is what we lose if we replace each 4-byte float with a single byte.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Scan the dataset for per-dimension min and max
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The calibration pass is a one-time cost at index build. Walk the entire corpus, and for each of the 768
            dimensions find the smallest and largest value seen. That range is what an 8-bit integer will cover for that
            dimension. Different dimensions have different ranges - dim 0 might live in [0.09, 0.83], dim 5 in [0.05,
            0.72] - so one global range would waste precision. Per-dimension calibration is the norm.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Calibration table (first 8 dims of the cat corpus)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "auto repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              <div style={{ color: C.yellow, padding: "4px 6px", textAlign: "right" }}>Dim</div>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div key={`dh-${d}`} style={{ color: C.yellow, padding: "4px 6px", textAlign: "center" }}>
                  {d}
                </div>
              ))}
              <div style={{ color: C.yellow, padding: "4px 6px", textAlign: "right" }}>min</div>
              {perDimMin.map((v, i) => (
                <div
                  key={`min-${i}`}
                  style={{
                    color: C.bright,
                    padding: "4px 6px",
                    background: `${C.yellow}08`,
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
              <div style={{ color: C.yellow, padding: "4px 6px", textAlign: "right" }}>max</div>
              {perDimMax.map((v, i) => (
                <div
                  key={`max-${i}`}
                  style={{
                    color: C.bright,
                    padding: "4px 6px",
                    background: `${C.yellow}08`,
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One scan, one pair of numbers per dimension. Tiny metadata cost; foundational for every subsequent
            quantize/dequantize operation.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Linear map: [min, max] to [0, 255]
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Each dimension&apos;s float range is stretched linearly onto the integer range 0 to 255. An 8-bit unsigned
            integer gives 256 discrete buckets; the linear scale makes the smallest value land at 0, the largest at 255,
            and everything else interpolated in between. The bucket size for dimension i is (max_i - min_i) / 255.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            <span style={{ color: C.green }}>quantize</span>(v, min, max) = round((v - min) / (max - min) &middot; 255)
            <br />
            <span style={{ color: C.green }}>dequantize</span>(q, min, max) = min + (q / 255) &middot; (max - min)
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              Worked example on dim 0
            </T>
            <div
              style={{
                marginTop: 8,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
                textAlign: "center",
                lineHeight: 1.9,
              }}
            >
              v = 0.81, min = 0.09, max = 0.83
              <br />
              q = round((0.81 - 0.09) / (0.83 - 0.09) &middot; 255)
              <br />= round(0.9730 &middot; 255) = round(248.1) ={" "}
              <span style={{ color: C.green, fontWeight: "bold" }}>248</span>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Round-to-nearest is the most common; some implementations use floor or stochastic rounding. 248 out of 255
            buckets = we lose about 0.2% of the representable precision of this dim.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Before and after: the same vector, quantized
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Apply the linear map to every dimension of the cat vector. The float32 array becomes an int8 byte array of
            the same length. From 32 bytes down to 8 for our 8-dim slice - or from 3,072 down to 768 for the full
            dimension 768 vector.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={16}>
              Before: float32 (4 bytes per cell)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {floatVec.map((v, i) => (
                <div
                  key={`bf-${i}`}
                  style={{
                    padding: "6px 4px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}20`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              total: 8 &middot; 4 = 32 bytes
            </T>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 22, color: C.orange }}>&darr;</div>
            <T color={C.orange} bold center size={16} style={{ marginTop: 4 }}>
              After: int8 (1 byte per cell)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 4,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {int8Vec.map((q, i) => (
                <div
                  key={`af-${i}`}
                  style={{
                    padding: "6px 4px",
                    background: `${C.orange}14`,
                    border: `1px solid ${C.orange}28`,
                    borderRadius: 4,
                    textAlign: "center",
                    color: C.bright,
                  }}
                >
                  {q}
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              total: 8 &middot; 1 = 8 bytes (4x smaller)
            </T>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            At d = 768, the row above becomes 768 bytes instead of 3,072. Same semantic content; a quarter of the
            footprint.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Int8 distances are SIMD-friendly and often faster
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Modern CPUs have dedicated int8 dot-product instructions. On AVX-512, VPDPBUSD processes 64 int8 multiplies
            and accumulates in one op. Equivalent float32 code with AVX-512 F processes 16 floats per op. Net result:
            int8 distance is 3-4x faster than float32 per vector, on top of the 4x memory win.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.cyan}08`,
                  border: `1px solid ${C.cyan}18`,
                  borderRadius: 6,
                }}
              >
                <T color={C.cyan} bold center size={16}>
                  Float32 path
                </T>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: C.bright,
                    textAlign: "center",
                    lineHeight: 1.8,
                  }}
                >
                  AVX-512 F: vfmadd132ps
                  <br />
                  16 floats per op
                  <br />
                  &asymp; 48 ops per 768-dim pair
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  background: `${C.purple}08`,
                  border: `1px solid ${C.purple}18`,
                  borderRadius: 6,
                }}
              >
                <T color={C.purple} bold center size={16}>
                  Int8 path
                </T>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: C.bright,
                    textAlign: "center",
                    lineHeight: 1.8,
                  }}
                >
                  AVX-512 VNNI: VPDPBUSD
                  <br />
                  64 int8 per op
                  <br />
                  &asymp; 12 ops per 768-dim pair
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            Int8 SIMD speedup: <span style={{ color: C.purple }}>~3-4x faster</span>
            <br />
            Stacked on 4x memory win = same hardware can serve 3-4x more QPS
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            FAISS, Qdrant, pgvector, and Milvus all use int8 SIMD kernels when the index is scalar-quantized. This is
            one of the reasons scalar quantization is the first compression step everyone reaches for.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            4x memory win for a 1-3% recall loss
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The tradeoff is lopsided: memory shrinks by a hard 4x, the graph index speeds up because distances are
            cheaper, and recall degrades by about 1-3% on typical embedding benchmarks. That is essentially free across
            every production workload, which is why virtually every vector DB turns it on by default or offers it as a
            one-line toggle.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            d = 768 vector
            <br />
            Before: <span style={{ color: C.cyan }}>3,072 bytes</span> (float32)
            <br />
            After: <span style={{ color: C.red }}>768 bytes</span> (int8) &middot; bytes per vector = d
            <br />
            <span style={{ color: C.green }}>compression: 4x</span> &middot;{" "}
            <span style={{ color: C.yellow }}>recall loss: 1-3%</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                What you get
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                4x less RAM. 3-4x faster distance. Simple to implement, one bound-range per dim.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={16}>
                What you pay
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                1-3% recall loss on BERT-style embeddings. Requires a calibration pass at build time.
              </T>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Scalar quantization is the easy win: tiny recall cost, simple to implement, hardware-native speed. It is
            almost always the first compression step a production system turns on.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            New vector arrives: insert / update / delete drift the calibrated range
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { tag: "INSERT", caption: "New value 1.8 outside [-1.2, 1.4]" },
              { tag: "UPDATE", caption: "Replaced value 1.8 still outside" },
              { tag: "DELETE", caption: "Stale int8 row stays; live min/max drifts" },
            ].map((op) => (
              <div
                key={op.tag}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {op.tag}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                  {op.caption}
                </T>
              </div>
            ))}
          </div>
          <svg
            viewBox="0 0 720 240"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Number line with calibrated band -1.2 to 1.4 shaded cyan and a 0 to 255 bucket scale below; a green
              training point at 0.5 maps to bucket 167, a red new-vector point at 1.8 sits outside the band with a bent
              arrow back to the clip point at 1.4 = bucket 255 and a red gap bar labeled error = 0.4; a faded tombstone
              marker shows a deleted entry whose int8 row still lives.
            </desc>
            <line x1="60" y1="100" x2="700" y2="100" stroke="#666" strokeWidth="1" />
            <rect x="140" y="80" width="380" height="40" fill={`${C.cyan}1a`} stroke={`${C.cyan}40`} />
            <text x="140" y="68" fontSize="11" fill={C.cyan} textAnchor="middle">
              Min = -1.2
            </text>
            <text x="520" y="68" fontSize="11" fill={C.cyan} textAnchor="middle">
              Max = 1.4
            </text>
            <text x="140" y="150" fontSize="11" fill="#999" textAnchor="middle">
              Bucket 0
            </text>
            <text x="520" y="150" fontSize="11" fill="#999" textAnchor="middle">
              Bucket 255
            </text>
            <circle cx="380" cy="100" r="6" fill={C.green} />
            <text x="380" y="68" fontSize="11" fill={C.green} textAnchor="middle">
              0.5 = bucket 167
            </text>
            <circle cx="620" cy="100" r="6" fill={C.red} />
            <text x="620" y="68" fontSize="11" fill={C.red} textAnchor="middle">
              New = 1.8
            </text>
            <path
              d="M 614 100 C 590 130, 545 100, 528 100"
              fill="none"
              stroke={C.red}
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <polygon points="520,100 528,96 528,104" fill={C.red} />
            <text x="570" y="180" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">
              Clipped to 1.4
            </text>
            <rect x="530" y="194" width="80" height="10" fill={`${C.red}66`} />
            <text x="570" y="222" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">
              Error = 0.4
            </text>
            <g opacity="0.45">
              <rect x="280" y="92" width="14" height="16" fill="none" stroke="#888" strokeWidth="1" />
              <line x1="280" y1="92" x2="294" y2="108" stroke="#888" strokeWidth="1" />
              <text x="287" y="130" fontSize="10" fill="#888" textAnchor="middle">
                Tombstone
              </text>
            </g>
          </svg>
        </Box>
      </Reveal>
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Industry fix: percentile bounds + tombstone vacuum + recalibration job
          </T>
          <svg
            viewBox="0 0 720 260"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Two stacked number lines comparing min/max calibration to p1/p99 plus 10 percent headroom; the top band
              spans -1.2 to 1.4 and the new value 1.8 clips with a red error bar of 0.4, while the bottom band spans
              -1.4 to 1.7 and the same new value clips with a red error bar of only 0.1.
            </desc>
            <text x="60" y="30" fontSize="12" fill="#aaa">
              Min/max calibration
            </text>
            <line x1="60" y1="70" x2="700" y2="70" stroke="#666" strokeWidth="1" />
            <rect x="160" y="55" width="320" height="30" fill={`${C.cyan}1a`} stroke={`${C.cyan}40`} />
            <text x="160" y="50" fontSize="10" fill={C.cyan} textAnchor="middle">
              -1.2
            </text>
            <text x="480" y="50" fontSize="10" fill={C.cyan} textAnchor="middle">
              1.4
            </text>
            <circle cx="560" cy="70" r="5" fill={C.red} />
            <text x="560" y="62" fontSize="10" fill={C.red} textAnchor="middle">
              1.8
            </text>
            <rect x="480" y="92" width="80" height="8" fill={`${C.red}66`} />
            <text x="520" y="112" fontSize="11" fill={C.red} textAnchor="middle" fontWeight="bold">
              Error = 0.4
            </text>
            <text x="60" y="148" fontSize="12" fill="#aaa">
              P1 / p99 + 10% headroom
            </text>
            <line x1="60" y1="190" x2="700" y2="190" stroke="#666" strokeWidth="1" />
            <rect x="140" y="175" width="400" height="30" fill={`${C.green}1a`} stroke={`${C.green}40`} />
            <text x="140" y="170" fontSize="10" fill={C.green} textAnchor="middle">
              -1.4
            </text>
            <text x="540" y="170" fontSize="10" fill={C.green} textAnchor="end">
              1.7
            </text>
            <circle cx="560" cy="190" r="5" fill={C.red} />
            <text x="572" y="194" fontSize="10" fill={C.red} textAnchor="start">
              1.8
            </text>
            <rect x="540" y="212" width="20" height="8" fill={`${C.red}66`} />
            <text x="550" y="232" fontSize="11" fill={C.red} textAnchor="middle" fontWeight="bold">
              Error = 0.1
            </text>
          </svg>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {[
              { op: "INSERT / UPDATE", text: "Clip rare; drift counter increments on clip" },
              { op: "DELETE", text: "Tombstone bit set; vacuum job rebuilds row store" },
              { op: "DRIFT", text: "Clipped > 0.5% triggers scheduled recalibration" },
            ].map((row) => (
              <div
                key={row.op}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.green} bold size={14} style={{ minWidth: 130 }}>
                  {row.op}
                </T>
                <T color={C.bright} size={14}>
                  {row.text}
                </T>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {[
              { name: "FAISS", line: "IndexScalarQuantizer(d, QT_8bit_uniform) + custom range" },
              {
                name: "Qdrant",
                line: "Quantization_config.scalar.quantile = 0.99 + optimizers_config.deleted_threshold",
              },
              { name: "Pinecone", line: "Managed re-quantization on shard rebalance" },
              { name: "Vespa", line: "Tensor int8 cell-type with explicit bounds + auto-compact" },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {s.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace", textAlign: "center" }}>
                  {s.line}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 8}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            SQ slots into any index: HNSW, IVF, or flat
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Scalar quantization is a drop-in replacement for the vector payload. The index structure - HNSW graph, IVF
            posting lists, or a flat scan - is unchanged; only the per-vector storage swaps from float32 to int8. No new
            distance algorithm, no rescore stage, no codebook training. The graph still navigates by neighbor distances;
            those distances are now computed with int8 SIMD instead of float32 SIMD.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                HNSW + SQ
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Same multi-layer graph</div>
                <div>&bull; Node payload: 768 int8 bytes</div>
                <div>&bull; Edges + traversal unchanged</div>
                <div>&bull; Distance: int8 dot product</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                IVF + SQ
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Same nlist centroids (float32)</div>
                <div>&bull; Posting list payload: int8</div>
                <div>&bull; Nprobe scan unchanged</div>
                <div>&bull; Distance: int8 dot product</div>
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={16}>
                Flat + SQ
              </T>
              <div style={{ marginTop: 8, fontSize: 14, color: C.bright, lineHeight: 1.7 }}>
                <div>&bull; Brute-force linear scan</div>
                <div>&bull; Row storage: int8</div>
                <div>&bull; 4x more vectors per cache line</div>
                <div>&bull; Distance: int8 dot product</div>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            pgvector: <span style={{ color: C.cyan }}>halfvec / vector(int8)</span> column type
            <br />
            Qdrant: <span style={{ color: C.cyan }}>quantization_config.scalar.type = int8</span>
            <br />
            FAISS: <span style={{ color: C.cyan }}>IndexHNSWSQ, IndexIVFScalarQuantizer</span>
            <br />
            Milvus: <span style={{ color: C.cyan }}>IVF_SQ8, HNSW_SQ8 index types</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Why no dedicated chapter pairing SQ with HNSW or IVF? Because there is nothing new to learn. The graph or
            posting list is the same; the payload is smaller. PQ has its own combo chapters because its asymmetric
            lookup table changes how distance is computed. SQ does not change distance, only its precision.
          </T>
        </Box>
      </Reveal>
      {sub < 8 && (
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
