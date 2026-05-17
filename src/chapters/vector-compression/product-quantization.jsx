import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function ProductQuantization(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Cut one fat vector into 96 small ones
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
              One 768-dim vector, banded into 96 slots
            </T>
            <svg
              viewBox="0 0 720 280"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                A 768-dim vector drawn as a long horizontal bar split into 96 colored segments (slots), with three
                stacked document rows below sharing the same slot boundaries to show that slot 0 covers the same dim
                range across every document.
              </desc>
              {/* Top vector with slot bands. 96 cells across the bar from x=20 to x=700. */}
              {Array.from({ length: 96 }).map((_, i) => {
                const cellW = 680 / 96;
                const x = 20 + i * cellW;
                let fill = `${C.cyan}22`;
                if (i < 4) fill = C.cyan;
                else if (i === 95) fill = `${C.cyan}cc`;
                return <rect key={i} x={x} y="40" width={cellW - 0.5} height="36" fill={fill} />;
              })}
              <text x="360" y="28" textAnchor="middle" fill={C.cyan} fontSize="13" fontWeight="bold">
                Vector v &middot; 768 dims
              </text>
              {/* Bracket beneath the 4 highlighted cells (slots 0-3) */}
              <line x1="20" y1="82" x2={20 + (680 / 96) * 4} y2="82" stroke={C.cyan} strokeWidth="1.5" />
              <line x1="20" y1="78" x2="20" y2="86" stroke={C.cyan} strokeWidth="1.5" />
              <line
                x1={20 + (680 / 96) * 4}
                y1="78"
                x2={20 + (680 / 96) * 4}
                y2="86"
                stroke={C.cyan}
                strokeWidth="1.5"
              />
              <text x={20 + (680 / 96) * 4 + 8} y="86" textAnchor="start" fill={C.cyan} fontSize="11" fontWeight="bold">
                Slots 0-3 (highlighted)
              </text>
              {/* "..." in the middle */}
              <text x="360" y="100" textAnchor="middle" fill={C.dim} fontSize="11">
                . . .
              </text>
              {/* Leader line and label for the last slot */}
              <line
                x1={20 + 680 - (680 / 96) * 0.5}
                y1="78"
                x2={20 + 680 - (680 / 96) * 0.5}
                y2="92"
                stroke={C.cyan}
                strokeWidth="1"
              />
              <text
                x={20 + 680 - (680 / 96) * 0.5 - 8}
                y="100"
                textAnchor="end"
                fill={C.bright}
                fontSize="11"
                fontWeight="bold"
              >
                Slot 95
              </text>
              {/* Central annotation: 1 slot = 8 dims */}
              <text x="360" y="125" textAnchor="middle" fill={C.cyan} fontSize="12">
                1 slot = 8 dims &middot; 96 slots cover all 768 dims
              </text>
              {/* Three document rows stacked */}
              {[0, 1, 2].map((row) => {
                const y = 145 + row * 38;
                const label = `doc ${row + 1}`;
                return (
                  <g key={row}>
                    <text x="10" y={y + 17} textAnchor="start" fill={C.dim} fontSize="11">
                      {label}
                    </text>
                    {Array.from({ length: 96 }).map((_, i) => {
                      const cellW = 620 / 96;
                      const x = 60 + i * cellW;
                      let fill = `${C.cyan}18`;
                      if (i < 4) fill = `${C.cyan}aa`;
                      else if (i === 95) fill = `${C.cyan}66`;
                      return <rect key={i} x={x} y={y} width={cellW - 0.5} height="22" fill={fill} />;
                    })}
                  </g>
                );
              })}
              {/* Dashed overlay marking the highlighted slots 0-3 column across all docs */}
              <rect
                x="60"
                y="143"
                width={(620 / 96) * 4}
                height="102"
                fill="none"
                stroke={`${C.cyan}88`}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              {/* Connector + single-line label in the clean gap between doc 1 and doc 2 */}
              <line x1={60 + (620 / 96) * 4} y1="175" x2="92" y2="175" stroke={C.cyan} strokeWidth="1" />
              <text x="98" y="178" textAnchor="start" fill={C.cyan} fontSize="11" fontWeight="bold">
                Slots 0-3 of every doc &middot; same dim range
              </text>
            </svg>
          </div>
          <T color="#80deea" style={{ marginTop: 12 }}>
            A 768-dim embedding is too fat to compress as a single thing. PQ&apos;s first move is to chop it into 96
            small pieces, 8 dims each. We call each piece a <strong>slot</strong>.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Why slots matter: every slot gets its own dictionary. Slot 0&apos;s dictionary only has to describe the
            patterns that appear in dims 0-7 across the whole corpus. That is a much easier job than describing all 768
            dims at once.
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
            d = 768 &middot; m = 96 &middot; <span style={{ color: C.cyan }}>d / m = 8 dims per slot</span>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One vector becomes 96 mini-problems. Each one is small enough to compress hard.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Each slot learns its own 256-word dictionary
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
              Slot 0 sub-vectors clustered by k-means (codebook = 256 centroids)
            </T>
            <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
              Slot 0 is 8-D &middot; drawn here as 2-D for clarity
            </T>
            <svg
              viewBox="0 0 720 360"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 6 }}
            >
              <desc>
                A 2-D scatter projection of slot-0 sub-vectors with 16 highlighted k-means centroid markers labeled c0
                to c255 representing the 256 codebook entries that snap each sub-vector to its nearest prototype.
              </desc>
              {/* Background panel */}
              <rect x="20" y="20" width="460" height="320" fill={`${C.yellow}05`} stroke={`${C.yellow}22`} />
              {/* Random-looking dots representing slot-0 sub-vectors. Use a deterministic set. */}
              {[
                [60, 90],
                [80, 110],
                [120, 80],
                [150, 70],
                [180, 100],
                [210, 130],
                [90, 160],
                [130, 175],
                [170, 200],
                [200, 230],
                [240, 90],
                [275, 120],
                [310, 100],
                [340, 70],
                [370, 110],
                [400, 95],
                [410, 140],
                [380, 175],
                [350, 200],
                [310, 230],
                [255, 215],
                [225, 260],
                [185, 280],
                [140, 250],
                [110, 230],
                [70, 250],
                [60, 290],
                [115, 305],
                [165, 315],
                [220, 305],
                [270, 295],
                [320, 280],
                [365, 270],
                [410, 255],
                [440, 220],
                [445, 175],
                [430, 100],
                [395, 65],
                [330, 50],
                [275, 65],
                [225, 55],
                [165, 50],
                [110, 65],
                [85, 195],
                [105, 145],
                [195, 165],
                [235, 145],
                [285, 175],
                [330, 165],
                [375, 200],
                [305, 130],
                [255, 100],
                [195, 95],
                [145, 110],
                [135, 220],
                [185, 230],
                [235, 195],
                [290, 220],
                [355, 230],
                [395, 215],
                [400, 290],
                [350, 305],
                [285, 320],
                [240, 320],
                [195, 320],
                [150, 320],
                [100, 320],
                [70, 220],
                [55, 170],
                [50, 130],
                [70, 60],
                [120, 50],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.yellow}88`} />
              ))}
              {/* Centroid markers (16 representing 256). Larger filled circles with id labels. */}
              {[
                { x: 95, y: 95, id: "c0" },
                { x: 175, y: 100, id: "c1" },
                { x: 260, y: 95, id: "c5" },
                { x: 355, y: 80, id: "c17" },
                { x: 415, y: 130, id: "c42" },
                { x: 90, y: 175, id: "c89" },
                { x: 195, y: 200, id: "c97" },
                { x: 290, y: 195, id: "c103" },
                { x: 370, y: 215, id: "c142" },
                { x: 130, y: 260, id: "c170" },
                { x: 230, y: 270, id: "c188" },
                { x: 320, y: 260, id: "c201" },
                { x: 405, y: 280, id: "c220" },
                { x: 60, y: 300, id: "c238" },
                { x: 175, y: 305, id: "c247" },
                { x: 270, y: 310, id: "c255" },
              ].map((c, i) => (
                <g key={i}>
                  <circle cx={c.x} cy={c.y} r="9" fill={C.yellow} stroke="#08080d" strokeWidth="1.5" />
                  <text x={c.x} y={c.y + 22} textAnchor="middle" fill={C.yellow} fontSize="10" fontWeight="bold">
                    {c.id}
                  </text>
                </g>
              ))}
              <text x="250" y="14" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                Slot 0 sub-vector cloud (corpus-wide)
              </text>
              {/* Side panel */}
              <rect x="510" y="40" width="190" height="280" fill={`${C.yellow}10`} stroke={`${C.yellow}22`} rx="6" />
              <text x="605" y="70" textAnchor="middle" fill={C.yellow} fontSize="13" fontWeight="bold">
                k-means on slot 0
              </text>
              <text x="605" y="100" textAnchor="middle" fill={C.bright} fontSize="11">
                Input: billions of 8-D points
              </text>
              <text x="605" y="120" textAnchor="middle" fill={C.bright} fontSize="11">
                Output: 256 centroids
              </text>
              <text x="605" y="155" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                = slot 0 codebook
              </text>
              <line x1="540" y1="180" x2="670" y2="180" stroke={`${C.yellow}44`} strokeWidth="1" />
              <text x="605" y="205" textAnchor="middle" fill={C.bright} fontSize="11">
                Why exactly 256?
              </text>
              <text x="605" y="225" textAnchor="middle" fill={C.bright} fontSize="11">
                2^8 = 256
              </text>
              <text x="605" y="245" textAnchor="middle" fill={C.bright} fontSize="11">
                Fits in a single byte
              </text>
              <text x="605" y="285" textAnchor="middle" fill={C.dim} fontSize="10">
                Repeat for slots 1..95
              </text>
              <text x="605" y="305" textAnchor="middle" fill={C.dim} fontSize="10">
                = 96 codebooks total
              </text>
            </svg>
          </div>
          <T color="#ffe082" style={{ marginTop: 12 }}>
            Pick one slot - say slot 0. Look at slot 0&apos;s sub-vector across every document in the corpus. That is
            billions of 8-D points. Run k-means on them with k = 256.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            k-means finds 256 prototype points - call them <strong>centroids</strong> - that summarize this cloud. These
            256 centroids are slot 0&apos;s <strong>codebook</strong>. Every future slot-0 sub-vector will be replaced
            by whichever of these 256 it is closest to.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Why exactly 256? Because 2^8 = 256, and that fits in a single byte. The whole PQ design is built around
            squeezing one slot into one byte.
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
            96 slots &middot; 256 centroids &middot; 8 dims &middot; 4 bytes ={" "}
            <span style={{ color: C.yellow }}>786 KB total codebook</span>
            <br />
            <span style={{ color: C.dim }}>(one-time cost &middot; fits in L2 cache)</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            256 prototypes per slot. 96 codebooks. The whole dictionary is L2-resident.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Encode = snap each slice to its nearest prototype
          </T>
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
              One sub-vector snaps to one centroid id (1 byte)
            </T>
            <svg
              viewBox="0 0 720 440"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Top half: a small scatter showing one query sub-vector as a green diamond with a thick arrow to its
                nearest centroid c17. Bottom half: a row of four input sub-vector bars snapping into a row of four byte
                boxes labeled with their assigned centroid ids, then a final assembled 96-byte code.
              </desc>
              <defs>
                <marker
                  id="snap-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L5,3 Z" fill={C.green} />
                </marker>
              </defs>
              {/* Top: small scatter (translated to center within 720 viewBox) */}
              <g transform="translate(120, 0)">
                <rect x="20" y="10" width="320" height="170" fill={`${C.green}05`} stroke={`${C.green}22`} />
                <text x="180" y="25" textAnchor="middle" fill={C.green} fontSize="11" fontWeight="bold">
                  Slot 0 cloud
                </text>
                {/* dim points */}
                {[
                  [60, 60],
                  [90, 80],
                  [130, 50],
                  [165, 90],
                  [210, 70],
                  [255, 110],
                  [300, 60],
                  [275, 145],
                  [220, 145],
                  [165, 145],
                  [100, 130],
                  [60, 110],
                  [240, 90],
                  [195, 105],
                  [110, 95],
                  [90, 155],
                  [310, 130],
                  [285, 90],
                  [180, 60],
                  [240, 160],
                  [125, 110],
                  [70, 145],
                  [305, 100],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="2" fill={`${C.yellow}66`} />
                ))}
                {/* centroids */}
                {[
                  { x: 95, y: 70, id: "c5" },
                  { x: 230, y: 90, id: "c17" },
                  { x: 290, y: 140, id: "c89" },
                  { x: 110, y: 145, id: "c142" },
                ].map((c, i) => (
                  <g key={i}>
                    <circle cx={c.x} cy={c.y} r="7" fill={C.yellow} stroke="#08080d" strokeWidth="1" />
                    <text x={c.x} y={c.y + 18} textAnchor="middle" fill={C.yellow} fontSize="9" fontWeight="bold">
                      {c.id}
                    </text>
                  </g>
                ))}
                {/* query sub-vector as green diamond */}
                <polygon points="200,80 215,95 200,110 185,95" fill={C.green} stroke="#08080d" strokeWidth="1" />
                <text x="170" y="78" textAnchor="end" fill={C.green} fontSize="10" fontWeight="bold">
                  q sub
                </text>
                {/* arrow to nearest centroid (c17) */}
                <line x1="208" y1="90" x2="225" y2="90" stroke={C.green} strokeWidth="2" markerEnd="url(#snap-arrow)" />
                <text x="225" y="78" textAnchor="middle" fill={C.green} fontSize="10">
                  Snap
                </text>
                {/* annotation: distances drawn dimly to other centroids */}
                <line x1="200" y1="95" x2="95" y2="70" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
                <line
                  x1="200"
                  y1="95"
                  x2="290"
                  y2="140"
                  stroke={`${C.green}33`}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <line
                  x1="200"
                  y1="95"
                  x2="110"
                  y2="145"
                  stroke={`${C.green}33`}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text x="180" y="195" textAnchor="middle" fill={C.dim} fontSize="10">
                  Closest of all 256 centroids = c17
                </text>
                {/* Right side: arrow + result */}
                <line x1="345" y1="90" x2="395" y2="90" stroke={C.green} strokeWidth="2" markerEnd="url(#snap-arrow)" />
                <rect
                  x="400"
                  y="68"
                  width="80"
                  height="46"
                  fill={`${C.green}22`}
                  stroke={C.green}
                  strokeWidth="1.5"
                  rx="4"
                />
                <text x="440" y="85" textAnchor="middle" fill={C.bright} fontSize="11">
                  Store
                </text>
                <text x="440" y="102" textAnchor="middle" fill={C.green} fontSize="14" fontWeight="bold">
                  id 17
                </text>
                <text x="440" y="128" textAnchor="middle" fill={C.dim} fontSize="10">
                  1 byte
                </text>
              </g>
              {/* Bottom: row of 4 sub-vectors snapping to 4 bytes (centered group) */}
              <g transform="translate(215, 0)">
                <text x="20" y="215" textAnchor="start" fill={C.green} fontSize="12" fontWeight="bold">
                  Doc 1: 4 of 96 slots
                </text>
                {[
                  { slot: 0, vals: [0.81, 0.12, 0.45, 0.22], id: 17 },
                  { slot: 1, vals: [0.63, 0.07, 0.38, 0.91], id: 203 },
                  { slot: 2, vals: [0.44, 0.28, 0.56, 0.19], id: 89 },
                  { slot: 3, vals: [0.72, 0.34, 0.15, 0.48], id: 142 },
                ].map((row, ri) => {
                  const y = 240 + ri * 32;
                  return (
                    <g key={ri}>
                      <text x="60" y={y + 14} textAnchor="end" fill={C.dim} fontSize="11">
                        Slot {row.slot}
                      </text>
                      {/* sub-vector visualized as 4 small cells */}
                      {row.vals.map((v, ci) => (
                        <g key={ci}>
                          <rect
                            x={75 + ci * 28}
                            y={y}
                            width="26"
                            height="22"
                            fill={`${C.green}${Math.floor(v * 99)
                              .toString(16)
                              .padStart(2, "0")}`}
                            stroke={`${C.green}55`}
                          />
                          <text
                            x={75 + ci * 28 + 13}
                            y={y + 14}
                            textAnchor="middle"
                            fill={C.bright}
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {v.toFixed(2)}
                          </text>
                        </g>
                      ))}
                      {/* arrow */}
                      <line
                        x1="195"
                        y1={y + 11}
                        x2="240"
                        y2={y + 11}
                        stroke={C.green}
                        strokeWidth="1.5"
                        markerEnd="url(#snap-arrow)"
                      />
                      <text x="218" y={y + 7} textAnchor="middle" fill={C.dim} fontSize="9">
                        Snap
                      </text>
                      {/* byte box */}
                      <rect
                        x="245"
                        y={y - 1}
                        width="60"
                        height="24"
                        fill={`${C.green}22`}
                        stroke={C.green}
                        strokeWidth="1.2"
                        rx="3"
                      />
                      <text
                        x="275"
                        y={y + 16}
                        textAnchor="middle"
                        fill={C.bright}
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        ID {row.id}
                      </text>
                    </g>
                  );
                })}
                <text x="345" y="280" textAnchor="start" fill={C.dim} fontSize="11">
                  ... 92 more slots ...
                </text>
              </g>
              {/* Assembled byte string (placed below row 3 with 25px clearance) */}
              <rect
                x="20"
                y="390"
                width="680"
                height="40"
                fill={`${C.green}10`}
                stroke={C.green}
                strokeWidth="1.5"
                rx="4"
              />
              <text x="360" y="415" textAnchor="middle" fill={C.bright} fontSize="14" fontFamily="monospace">
                Doc 1 PQ code = [17, 203, 89, 142, 88, 17, 250, 61, ..., 71]
                <tspan fill={C.green} fontWeight="bold">
                  {"   "}96 bytes
                </tspan>
              </text>
            </svg>
          </div>
          <T color="#80e8a5" style={{ marginTop: 12 }}>
            Now we have all 96 codebooks. Encoding a new document vector is just lookup.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            For each of its 96 slots, find the closest centroid in that slot&apos;s codebook. Write down that
            centroid&apos;s index - a number 0 to 255. That index fits in one byte.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Repeat 96 times. The whole 768-dim vector is now 96 bytes. The original floats are thrown away. The index
            stores only the byte codes.
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
            Doc 1 code = [17, 203, 89, 142, ..., 71]
            <br />
            <span style={{ color: C.green }}>96 centroid ids &middot; 1 byte each = 96 bytes total</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A vector becomes 96 byte-pointers into 96 tiny codebooks.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            3,072 bytes shrinks to 96 bytes per vector. 32x smaller.
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
              Same vector. Two storage formats. Drawn to scale.
            </T>
            <svg
              viewBox="0 0 720 200"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Two horizontal bars drawn to scale comparing storage size: a wide cyan bar of 3072 bytes for the float32
                vector and a narrow orange sliver of 96 bytes for the PQ code, with a 32x badge between them.
              </desc>
              {/* float32 bar (full width 640) */}
              <text x="20" y="40" textAnchor="start" fill={C.cyan} fontSize="13" fontWeight="bold">
                Float32
              </text>
              <rect x="20" y="50" width="640" height="44" fill={C.cyan} stroke="#08080d" strokeWidth="1" rx="3" />
              <text x="340" y="79" textAnchor="middle" fill="#08080d" fontSize="14" fontWeight="bold">
                3,072 bytes / vector (768 dims &times; 4 B)
              </text>
              {/* PQ bar (1/32 width = 20px) */}
              <text x="20" y="125" textAnchor="start" fill={C.orange} fontSize="13" fontWeight="bold">
                PQ (m=96)
              </text>
              <rect x="20" y="135" width="20" height="44" fill={C.orange} stroke="#08080d" strokeWidth="1" rx="3" />
              <text x="55" y="164" textAnchor="start" fill={C.orange} fontSize="14" fontWeight="bold">
                96 bytes / vector
              </text>
              {/* 32x badge */}
              <rect
                x="555"
                y="125"
                width="120"
                height="60"
                fill={`${C.green}22`}
                stroke={C.green}
                strokeWidth="1.5"
                rx="6"
              />
              <text x="615" y="150" textAnchor="middle" fill={C.green} fontSize="22" fontWeight="bold">
                32x
              </text>
              <text x="615" y="170" textAnchor="middle" fill={C.green} fontSize="11">
                Smaller
              </text>
            </svg>
          </div>
          <T color="#ffcc80" style={{ marginTop: 12 }}>
            One float32 vector at d = 768 takes 3,072 bytes. The PQ code at m = 96 takes 96 bytes. That is 32x smaller,
            per vector.
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            At billion-vector scale this changes the economics. Storage stops being the bottleneck. The whole corpus
            fits on one server with room for the graph index and a cache.
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
            float32: 768 &middot; 4 = <span style={{ color: C.cyan }}>3,072 bytes</span>
            <br />
            PQ (m=96): 96 &middot; 1 = <span style={{ color: C.orange }}>96 bytes</span>
            <br />
            <span style={{ color: C.green, fontWeight: "bold" }}>compression ratio = 32x</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { n: "1M", float: "3 GB", pq: "96 MB" },
              { n: "100M", float: "300 GB", pq: "9.6 GB" },
              { n: "1B", float: "3 TB", pq: "96 GB" },
            ].map((row) => (
              <div
                key={row.n}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}20`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={16}>
                  N = {row.n}
                </T>
                <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 14, color: C.dim, lineHeight: 1.7 }}>
                  float32: {row.float}
                  <br />
                  <span style={{ color: C.green, fontWeight: "bold" }}>PQ: {row.pq}</span>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A billion vectors in 96 GB. One server. That is why PQ exists.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Search at query time: 4-frame storyboard for ADC
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
            Query arrives as a float vector. Docs are stored only as 96-byte PQ codes (no floats kept). How do we score
            millions of docs without reconstructing? Walk through one full search below. Showing 8 of 96 slots for
            clarity.
          </T>

          {/* Frame A: setup */}
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={15}>
              Frame A - what we have at query time
            </T>
            <svg
              viewBox="0 0 720 270"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Setup frame. Top row: query vector q drawn as a banded bar of 8 sub-queries (8 of 96 shown), each
                holding a float sub-vector. Below: a stack of doc PQ codes - each row is one doc represented as 96 bytes
                (centroid IDs). The query stays as float; the docs are codes. No float doc vectors exist on disk.
              </desc>
              <text x="360" y="22" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                Query q (full float, 96 sub-queries; 8 shown)
              </text>
              {Array.from({ length: 8 }).map((_, i) => {
                const x = 70 + i * 81;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="32"
                      width="64"
                      height="34"
                      fill={`${C.red}22`}
                      stroke={C.red}
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x={x + 32}
                      y={48}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Q_{i}
                    </text>
                    <text x={x + 32} y={61} textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="monospace">
                      8 floats
                    </text>
                  </g>
                );
              })}
              <text x="360" y="100" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                Doc database: 5 of N docs as 96-byte codes
              </text>
              {[
                { id: 1, code: [17, 203, 89, 142, 88, 17, 250, 61] },
                { id: 2, code: [12, 200, 87, 140, 90, 18, 248, 60] },
                { id: 3, code: [4, 30, 99, 12, 200, 5, 7, 250] },
                { id: 4, code: [80, 90, 200, 30, 40, 100, 60, 70] },
                { id: 5, code: [11, 195, 90, 138, 95, 14, 245, 58] },
              ].map((doc, rowIdx) => {
                const y = 110 + rowIdx * 28;
                return (
                  <g key={doc.id}>
                    <text x="10" y={y + 18} fill={C.green} fontSize="11" fontFamily="monospace" fontWeight="bold">
                      Doc {doc.id}
                    </text>
                    {doc.code.map((b, i) => {
                      const x = 70 + i * 81;
                      return (
                        <g key={i}>
                          <rect x={x} y={y + 4} width="64" height="20" fill={`${C.green}18`} stroke={`${C.green}55`} />
                          <text
                            x={x + 32}
                            y={y + 18}
                            textAnchor="middle"
                            fill={C.bright}
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            {b}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
              <text x="360" y="265" textAnchor="middle" fill={C.dim} fontSize="11">
                No float doc vectors exist on disk - only 96 bytes per doc
              </text>
            </svg>
          </div>

          {/* Frame B: build LUT once per query */}
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={15}>
              Frame B - build the lookup table (LUT) once per query
            </T>
            <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
              LUT = lookup table. For each slot, pre-compute distance from sub-query to all 256 centroids. Store. Reuse
              across every doc.
            </T>
            <svg
              viewBox="0 0 720 320"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Build-LUT frame. Each sub-query q_s feeds into one column of the lookup table; the column has 256 rows,
                one per centroid in that slot's codebook. Each cell stores the squared distance from q_s to centroid c.
                The whole table is 96 columns by 256 rows, computed once per query.
              </desc>
              <text x="360" y="22" textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Step 1: 8 sub-queries (8 of 96)
              </text>
              {Array.from({ length: 8 }).map((_, i) => {
                const x = 30 + i * 82;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="32"
                      width="64"
                      height="26"
                      fill={`${C.red}22`}
                      stroke={C.red}
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x={x + 32}
                      y={49}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Q_{i}
                    </text>
                    <line x1={x + 32} y1="60" x2={x + 32} y2="78" stroke={C.red} strokeWidth="1.5" />
                    <polygon points={`${x + 28},78 ${x + 36},78 ${x + 32},85`} fill={C.red} />
                  </g>
                );
              })}
              <text x="360" y="100" textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Step 2: distance to all 256 centroids in that slot &rarr; one column of LUT
              </text>
              {Array.from({ length: 8 }).map((_, slotIdx) => {
                const tx = 30 + slotIdx * 82;
                const sample = [
                  [0.05, 0.21, 0.84, 0.42, 0.13, 0.71, 0.35, 0.18],
                  [0.42, 0.08, 0.31, 0.65, 0.27, 0.93, 0.14, 0.55],
                  [0.13, 0.74, 0.05, 0.22, 0.61, 0.18, 0.49, 0.33],
                  [0.61, 0.27, 0.42, 0.09, 0.35, 0.71, 0.18, 0.55],
                  [0.27, 0.13, 0.61, 0.49, 0.05, 0.84, 0.42, 0.18],
                  [0.05, 0.42, 0.21, 0.74, 0.13, 0.61, 0.35, 0.27],
                  [0.31, 0.18, 0.65, 0.27, 0.49, 0.05, 0.84, 0.13],
                  [0.18, 0.55, 0.27, 0.42, 0.71, 0.13, 0.05, 0.61],
                ][slotIdx];
                return (
                  <g key={slotIdx}>
                    {sample.map((d, r) => {
                      const ry = 110 + r * 20;
                      return (
                        <g key={r}>
                          <rect x={tx} y={ry} width="64" height="18" fill={`${C.red}10`} stroke={`${C.red}33`} />
                          <text
                            x={tx + 32}
                            y={ry + 13}
                            textAnchor="middle"
                            fill={C.dim}
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            d={d.toFixed(2)}
                          </text>
                        </g>
                      );
                    })}
                    <text x={tx + 32} y={285} textAnchor="middle" fill={C.bright} fontSize="10" fontFamily="monospace">
                      Slot {slotIdx}
                    </text>
                    <text x={tx + 32} y={300} textAnchor="middle" fill={C.dim} fontSize="9">
                      256 rows
                    </text>
                  </g>
                );
              })}
              <text x="360" y="318" textAnchor="middle" fill={C.bright} fontSize="11" fontFamily="monospace">
                LUT shape: 96 cols &times; 256 rows = 24,576 floats &asymp; 96 KB &middot; computed once per query
              </text>
            </svg>
          </div>

          {/* Frame C: score one doc */}
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={15}>
              Frame C - score one doc: 96 lookups, 96 adds
            </T>
            <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
              Each byte names a centroid in its slot. The LUT cell already holds the distance from that slot&apos;s
              sub-query to that centroid - one read per slot.
            </T>
            <svg
              viewBox="0 0 720 360"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Score-one-doc frame. Top row shows doc 1's PQ code bytes; each byte is annotated with the centroid id it
                names in its slot. A yellow dashed arrow drops from each byte into the matching LUT cell labelled dist
                of sub-query and centroid so the lookup semantics are explicit. Red arrows sum the eight cell values
                into doc 1's approximate distance.
              </desc>
              <text x="360" y="20" textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Step 1 - doc 1 PQ code (8 of 96 bytes)
              </text>
              {[17, 203, 89, 142, 88, 17, 250, 61].map((b, i) => {
                const x = 24 + i * 84;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="30"
                      width="78"
                      height="30"
                      fill={`${C.green}22`}
                      stroke={C.green}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    <text
                      x={x + 39}
                      y={50}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="13"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {b}
                    </text>
                    <text x={x + 39} y={76} textAnchor="middle" fill={C.dim} fontSize="10" fontFamily="monospace">
                      Means c{b}
                    </text>
                    <line
                      x1={x + 39}
                      y1="84"
                      x2={x + 39}
                      y2="106"
                      stroke={`${C.yellow}cc`}
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                    />
                    <polygon points={`${x + 35},106 ${x + 43},106 ${x + 39},112`} fill={C.yellow} />
                  </g>
                );
              })}
              <text x="360" y="130" textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Step 2 - read LUT cell at column = slot, row = centroid id
              </text>
              {[
                { byte: 17, d: 0.05 },
                { byte: 203, d: 0.12 },
                { byte: 89, d: 0.08 },
                { byte: 142, d: 0.21 },
                { byte: 88, d: 0.06 },
                { byte: 17, d: 0.05 },
                { byte: 250, d: 0.18 },
                { byte: 61, d: 0.19 },
              ].map((cell, i) => {
                const x = 24 + i * 84;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="142"
                      width="78"
                      height="56"
                      fill={`${C.yellow}aa`}
                      stroke={C.yellow}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    <text
                      x={x + 39}
                      y={161}
                      textAnchor="middle"
                      fill="#08080d"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Q_{i} &rarr; c{cell.byte}
                    </text>
                    <line x1={x + 8} y1={167} x2={x + 70} y2={167} stroke={`#08080d55`} strokeWidth="1" />
                    <text
                      x={x + 39}
                      y={188}
                      textAnchor="middle"
                      fill="#08080d"
                      fontSize="14"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {cell.d.toFixed(2)}
                    </text>
                    <text x={x + 39} y={213} textAnchor="middle" fill={C.dim} fontSize="10" fontFamily="monospace">
                      Slot {i}
                    </text>
                    <line x1={x + 39} y1="222" x2={x + 39} y2="244" stroke={C.red} strokeWidth="1.5" />
                    <polygon points={`${x + 35},244 ${x + 43},244 ${x + 39},250`} fill={C.red} />
                  </g>
                );
              })}
              <text x="360" y="270" textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Step 3 - sum the 8 (in real PQ: 96) cells
              </text>
              <rect
                x="30"
                y="280"
                width="660"
                height="40"
                fill={`${C.red}18`}
                stroke={C.red}
                strokeWidth="1.2"
                rx="4"
              />
              <text
                x="360"
                y="305"
                textAnchor="middle"
                fill={C.bright}
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                d(q, doc 1) &asymp; 0.05 + 0.12 + 0.08 + 0.21 + 0.06 + 0.05 + 0.18 + 0.19 = 0.94
              </text>
              <text x="360" y="345" textAnchor="middle" fill={C.dim} fontSize="11">
                No multiplies during the scan - just byte reads, table lookups, and adds
              </text>
            </svg>
          </div>

          {/* Frame D: score all docs, top-k */}
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={15}>
              Frame D - repeat for every doc, sort, return top-k
            </T>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <T color={C.dim} size={12} center style={{ marginBottom: 6, fontFamily: "monospace" }}>
                  Scan: distance for each doc
                </T>
                {[
                  { id: 1, sum: 0.94 },
                  { id: 2, sum: 0.42 },
                  { id: 3, sum: 1.21 },
                  { id: 4, sum: 0.87 },
                  { id: 5, sum: 0.58 },
                ].map((row) => (
                  <div
                    key={row.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 70px",
                      gap: 8,
                      alignItems: "center",
                      padding: "5px 10px",
                      borderRadius: 4,
                      background: `${C.green}10`,
                      border: `1px solid ${C.green}22`,
                      marginTop: 4,
                    }}
                  >
                    <T color={C.green} bold size={13} style={{ fontFamily: "monospace" }}>
                      Doc {row.id}
                    </T>
                    <div style={{ height: 10, background: "rgba(0,0,0,0.4)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(row.sum / 1.5) * 100}%`, height: "100%", background: C.green }} />
                    </div>
                    <T color={C.bright} size={12} style={{ fontFamily: "monospace", textAlign: "right" }}>
                      d={row.sum.toFixed(2)}
                    </T>
                  </div>
                ))}
              </div>
              <div>
                <T color={C.dim} size={12} center style={{ marginBottom: 6, fontFamily: "monospace" }}>
                  Sort ascending - top 3
                </T>
                {[
                  { id: 2, sum: 0.42, rank: 1 },
                  { id: 5, sum: 0.58, rank: 2 },
                  { id: 4, sum: 0.87, rank: 3 },
                ].map((row) => (
                  <div
                    key={row.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 60px 1fr 70px",
                      gap: 8,
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: 4,
                      background: `${C.red}18`,
                      border: `1px solid ${C.red}55`,
                      marginTop: 4,
                    }}
                  >
                    <T color={C.red} bold size={13} style={{ fontFamily: "monospace" }}>
                      #{row.rank}
                    </T>
                    <T color={C.red} bold size={13} style={{ fontFamily: "monospace" }}>
                      Doc {row.id}
                    </T>
                    <T color={C.bright} size={11}>
                      Nearest neighbor
                    </T>
                    <T color={C.bright} size={12} style={{ fontFamily: "monospace", textAlign: "right" }}>
                      d={row.sum.toFixed(2)}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <T color={C.dim} size={12} center style={{ marginTop: 10, fontFamily: "monospace" }}>
              For each doc: 96 lookups + 96 adds &middot; for N = 1M docs: 96M lookups + 96M adds (vs 1.5G float ops)
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
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.red }}>Asymmetric Distance Computation (ADC):</span>
            <br />
            Once per query: build LUT (96 &middot; 256 = 24,576 dists &asymp; 96 KB; fits L2)
            <br />
            Per doc: <span style={{ color: C.red }}>96 lookups + 96 adds</span> &middot; no multiplies
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={15}>
              How does the cost compare? Float32 vs Scalar Quantization vs PQ
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr 1fr 1fr",
                gap: 0,
                border: `1px solid ${C.red}33`,
                borderRadius: 6,
                overflow: "hidden",
                fontFamily: "monospace",
                fontSize: 12,
              }}
            >
              {[
                ["", "float32 brute", "SQ (int8)", "PQ + ADC"],
                ["bytes / vec", "3,072", "768 (4x ↓)", "96 (32x ↓)"],
                ["ops / doc", "768 mul + 768 add", "768 byte ops", "96 lookups + 96 adds"],
                ["multiplies?", "yes", "yes (int)", "no"],
                ["build cost", "none", "1 scan for min/max", "k-means + LUT per query"],
                ["scan speed", "1x baseline", "~3-4x faster", "~10x faster"],
                ["recall loss", "0%", "1-3%", "5-10%"],
              ].map((row, ri) => (
                <Fragment key={ri}>
                  {row.map((cell, ci) => {
                    const isHeader = ri === 0;
                    const isLabel = ci === 0;
                    const colColor = ci === 1 ? C.dim : ci === 2 ? C.cyan : ci === 3 ? C.red : C.bright;
                    return (
                      <div
                        key={ci}
                        style={{
                          padding: "8px 10px",
                          borderTop: ri > 0 ? `1px solid ${C.red}22` : "none",
                          borderLeft: ci > 0 ? `1px solid ${C.red}22` : "none",
                          background: isHeader ? `${C.red}18` : isLabel ? "rgba(0,0,0,0.25)" : "transparent",
                          color: isHeader ? C.bright : isLabel ? C.dim : colColor,
                          fontWeight: isHeader || isLabel ? 700 : 400,
                          textAlign: "center",
                        }}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
            <T color={C.dim} size={11} center style={{ marginTop: 8, fontFamily: "monospace" }}>
              SQ keeps every dim, just shrinks each from 4 B to 1 B. PQ throws away the floats entirely and stores
              centroid ids per slot.
            </T>
          </div>
          <T color="#ef9a9a" size={15} center style={{ marginTop: 10, fontStyle: "italic" }}>
            Asymmetric: query stays precise, docs stay approximate. PQ wins on both axes - 8x less memory than SQ and
            ~3x faster per scan.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            OPQ: rotate first, so the slots line up with the data
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
            <T color={C.purple} bold center size={16}>
              Same data. Different axes. Tighter clusters.
            </T>
            <svg
              viewBox="0 0 720 320"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Two side-by-side scatter plots illustrating OPQ. Left plot shows an elongated diagonal cluster of points
                with a vertical slot boundary cutting through it awkwardly. Right plot shows the same points after a
                learned rotation, now axis-aligned, with the slot boundary cleanly separating two tight sub-clusters.
              </desc>
              <defs>
                <marker
                  id="opq-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L5,3 Z" fill={C.purple} />
                </marker>
              </defs>
              {/* Left scatter - plain PQ */}
              <rect x="20" y="40" width="280" height="240" fill={`${C.red}05`} stroke={`${C.red}33`} />
              <text x="160" y="32" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                Plain PQ: correlated dims
              </text>
              {/* elongated diagonal cluster */}
              {[
                [55, 240],
                [70, 225],
                [85, 215],
                [100, 205],
                [115, 195],
                [130, 185],
                [145, 175],
                [160, 165],
                [175, 155],
                [190, 145],
                [205, 135],
                [220, 125],
                [235, 115],
                [250, 105],
                [265, 95],
                [280, 85],
                [55, 250],
                [80, 235],
                [105, 220],
                [130, 200],
                [155, 180],
                [180, 160],
                [205, 140],
                [230, 120],
                [255, 100],
                [265, 80],
                [70, 245],
                [95, 230],
                [120, 210],
                [145, 190],
                [170, 170],
                [195, 150],
                [220, 130],
                [245, 110],
                [270, 90],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.red}aa`} />
              ))}
              {/* slot boundary - dashed vertical */}
              <line x1="160" y1="40" x2="160" y2="280" stroke={C.yellow} strokeWidth="2" strokeDasharray="6,4" />
              <text x="160" y="298" textAnchor="middle" fill={C.yellow} fontSize="10">
                Slot boundary
              </text>
              <text x="160" y="312" textAnchor="middle" fill={C.dim} fontSize="9">
                Cluster crosses boundary &rarr; loose k-means
              </text>
              {/* Curved arrow between plots */}
              <path
                d="M 310 160 Q 360 100 410 160"
                stroke={C.purple}
                strokeWidth="2"
                fill="none"
                markerEnd="url(#opq-arrow)"
              />
              <text x="360" y="95" textAnchor="middle" fill={C.purple} fontSize="11" fontWeight="bold">
                &times; R (learned)
              </text>
              {/* Right scatter - OPQ + PQ */}
              <rect x="420" y="40" width="280" height="240" fill={`${C.green}05`} stroke={`${C.green}33`} />
              <text x="560" y="32" textAnchor="middle" fill={C.green} fontSize="13" fontWeight="bold">
                OPQ + PQ: rotated, decorrelated
              </text>
              {/* axis-aligned cluster: two tighter sub-blobs */}
              {[
                [475, 100],
                [485, 110],
                [495, 105],
                [505, 115],
                [490, 95],
                [500, 100],
                [515, 110],
                [480, 120],
                [510, 95],
                [520, 105],
                [495, 125],
                [475, 115],
                [505, 130],
                [485, 130],
                [515, 125],
                [525, 115],
                [495, 140],
                [475, 130],
                [505, 110],
                [485, 100],
                [605, 200],
                [615, 210],
                [625, 205],
                [635, 215],
                [620, 195],
                [630, 200],
                [645, 210],
                [610, 220],
                [640, 195],
                [650, 205],
                [625, 225],
                [605, 215],
                [635, 230],
                [615, 230],
                [645, 225],
                [655, 215],
                [625, 240],
                [605, 230],
                [635, 210],
                [615, 200],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.green}aa`} />
              ))}
              {/* slot boundary - dashed vertical */}
              <line x1="560" y1="40" x2="560" y2="280" stroke={C.yellow} strokeWidth="2" strokeDasharray="6,4" />
              <text x="560" y="298" textAnchor="middle" fill={C.yellow} fontSize="10">
                Slot boundary
              </text>
              <text x="560" y="312" textAnchor="middle" fill={C.dim} fontSize="9">
                Clean split &rarr; tight k-means clusters
              </text>
            </svg>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 12 }}>
            Real embedding dimensions are not independent. Dim 0 and dim 200 might be highly correlated. When PQ chops
            the vector by raw position, correlated information gets split across slots and each slot&apos;s k-means sees
            a stretched, awkward cloud.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            <strong>OPQ</strong> fixes this: learn an orthonormal rotation matrix R alongside the codebooks. Apply Rv to
            every vector before splitting. The rotation decorrelates the dimensions, the per-slot clusters become tight
            and round, k-means fits them better, and recall goes up.
          </T>
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
            Pipeline: v &rarr; <span style={{ color: C.purple }}>Rv</span> &rarr; split &rarr; encode
            <br />
            Recall@10 at m = 96: plain PQ <span style={{ color: C.red }}>0.89</span> &middot; OPQ + PQ{" "}
            <span style={{ color: C.green }}>0.94</span>
            <br />
            <span style={{ color: C.dim }}>R is 768 &times; 768 orthonormal &middot; learned alongside codebooks</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Free recall bump for one extra matrix multiply. FAISS, ScaNN, and Qdrant all default to OPQ.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            New vector arrives: insert / update / delete drift the codebooks
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { tag: "INSERT", caption: "Sub-vec far from every centroid; error 6x baseline" },
              { tag: "UPDATE", caption: "Re-encoded with stale codebooks; same error" },
              { tag: "DELETE", caption: "Orphan PQ code; residual distribution shifts" },
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
            viewBox="0 0 600 320"
            style={{ width: "100%", maxWidth: 640, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              2D scatter for slot 0 with a tight cluster of 32 representative gray X centroids (of 256 trained per slot) around the origin and gray
              training-vector dots inside the cluster; a red dot for the new sub-vector at (2.1, 1.9) sits far outside
              the cluster, with a dashed line to the nearest X labeled distance = 1.8, alongside an inset label
              training avg distance = 0.3. A few faded gray dots with strikethrough show deleted training entries.
            </desc>
            <line x1="50" y1="280" x2="560" y2="280" stroke="#555" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="280" stroke="#555" strokeWidth="1" />
            <text x="305" y="305" fontSize="11" fill="#999" textAnchor="middle">
              Slot 0 dim a
            </text>
            <text x="20" y="150" fontSize="11" fill="#999" textAnchor="middle" transform="rotate(-90 20 150)">
              Slot 0 dim b
            </text>
            {Array.from({ length: 32 }).map((_, i) => {
              const angle = (i / 32) * Math.PI * 2;
              const r = 18 + (i % 5) * 4;
              const cx = 180 + Math.cos(angle) * r;
              const cy = 180 + Math.sin(angle) * r;
              return (
                <g key={i}>
                  <line x1={cx - 3} y1={cy - 3} x2={cx + 3} y2={cy + 3} stroke="#888" strokeWidth="1" />
                  <line x1={cx - 3} y1={cy + 3} x2={cx + 3} y2={cy - 3} stroke="#888" strokeWidth="1" />
                </g>
              );
            })}
            {[
              [170, 175],
              [185, 180],
              [190, 170],
              [175, 190],
              [195, 185],
              [180, 195],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="#999" />
            ))}
            {[
              [160, 165],
              [205, 195],
            ].map(([cx, cy], i) => (
              <g key={i} opacity="0.4">
                <circle cx={cx} cy={cy} r="3" fill="#666" />
                <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} stroke="#aaa" strokeWidth="1" />
              </g>
            ))}
            <circle cx="450" cy="80" r="6" fill={C.red} />
            <text x="450" y="68" fontSize="11" fill={C.red} textAnchor="middle">
              New sub-vec [2.1, 1.9]
            </text>
            <line x1="450" y1="80" x2="200" y2="170" stroke={C.red} strokeWidth="1.5" strokeDasharray="5 4" />
            <text x="300" y="95" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">
              Distance = 1.8
            </text>
            <rect x="380" y="220" width="180" height="46" fill={`${C.cyan}10`} stroke={`${C.cyan}30`} rx="6" />
            <text x="470" y="240" fontSize="11" fill={C.cyan} textAnchor="middle">
              Training avg distance
            </text>
            <text x="470" y="258" fontSize="13" fill={C.cyan} textAnchor="middle" fontWeight="bold">
              = 0.3
            </text>
          </svg>
        </Box>
      </Reveal>
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Industry fix: oversample + tombstones + retrain when 95p error spikes
          </T>
          <svg
            viewBox="0 0 720 300"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Line chart of 95th-percentile reconstruction error over time from 0 to 50M vectors; the line is flat at
              baseline 0 to 10M, spikes between 10M and 20M, crosses a horizontal dashed retrain threshold at 15M, a
              vertical dashed line marks retrain triggered at 20M, then the line returns to baseline. Below the x-axis
              are colored ticks marking inserts, updates, and deletes.
            </desc>
            <line x1="60" y1="40" x2="60" y2="220" stroke="#666" strokeWidth="1" />
            <line x1="60" y1="220" x2="700" y2="220" stroke="#666" strokeWidth="1" />
            <text x="40" y="125" fontSize="11" fill="#999" textAnchor="middle" transform="rotate(-90 40 125)">95p recon error</text>
            <text x="60" y="240" fontSize="11" fill="#999">0</text>
            <text x="700" y="240" fontSize="11" fill="#999" textAnchor="end">50M vectors</text>
            <line x1="60" y1="120" x2="700" y2="120" stroke={C.yellow} strokeDasharray="4 4" strokeWidth="1" />
            <text x="700" y="115" fontSize="11" fill={C.yellow} textAnchor="end">Retrain threshold</text>
            <polyline
              points="60,200 220,200 280,150 320,90 360,200 700,200"
              fill="none"
              stroke={C.red}
              strokeWidth="2"
            />
            <line x1="360" y1="40" x2="360" y2="220" stroke={C.green} strokeDasharray="6 4" strokeWidth="1.5" />
            <text x="360" y="32" fontSize="11" fill={C.green} textAnchor="middle">Retrain triggered (20M)</text>
            <text x="60" y="262" fontSize="11" fill="#999">Ops:</text>
            {[
              { x: 110, c: C.cyan },
              { x: 150, c: C.cyan },
              { x: 190, c: C.yellow },
              { x: 240, c: C.cyan },
              { x: 290, c: C.red },
              { x: 340, c: C.yellow },
              { x: 410, c: C.cyan },
              { x: 470, c: C.red },
              { x: 540, c: C.cyan },
              { x: 620, c: C.yellow },
            ].map((t, i) => (
              <line key={i} x1={t.x} y1="252" x2={t.x} y2="262" stroke={t.c} strokeWidth="2" />
            ))}
            <text x="640" y="262" fontSize="10" fill={C.cyan}>Insert</text>
            <text x="640" y="278" fontSize="10" fill={C.yellow}>Update</text>
            <text x="640" y="294" fontSize="10" fill={C.red}>Delete</text>
          </svg>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {[
              { op: "INSERT / UPDATE", text: "Re-encode with current codebooks; track 95p recon error" },
              { op: "DELETE", text: "Tombstone in posting list; background compaction reclaims and reshapes residuals" },
              { op: "DRIFT", text: "95p error breach -> train new codebooks on fresh sample (~256 * k_per_slot rule of thumb), hot-swap" },
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
              { name: "FAISS", line: "ProductQuantizer.train(new_set) + index rebuild" },
              { name: "Vespa", line: "Background re-quantization with hot-swap" },
              { name: "Milvus", line: "Scheduled IVF_PQ retraining + segment compaction" },
              { name: "Qdrant", line: "PATCH /collections/{name} quantization_config + optimizers_config.deleted_threshold" },
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
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            M is the only knob: bytes-per-vector vs recall
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <T color={C.pink} bold center size={16}>
              Higher m: bigger codes, better recall. m = 96 is the sweet spot.
            </T>
            <svg
              viewBox="0 0 720 300"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Dual-axis line chart showing how m affects bytes-per-vector and recall@10. The orange bytes-per-vector
                line rises linearly from 8 at m=8 to 192 at m=192. The green recall@10 curve rises from 0.81 to 0.98 and
                flattens; a vertical highlight band at m=96 marks the production sweet spot.
              </desc>
              {/* Axis box */}
              <line x1="80" y1="50" x2="80" y2="240" stroke={C.dim} strokeWidth="1" />
              <line x1="80" y1="240" x2="640" y2="240" stroke={C.dim} strokeWidth="1" />
              <line x1="640" y1="50" x2="640" y2="240" stroke={C.dim} strokeWidth="1" />
              {/* X-axis ticks: m = 8, 48, 96, 192 spread along x=80..640 */}
              {[
                { m: 8, x: 80 },
                { m: 48, x: 220 },
                { m: 96, x: 360 },
                { m: 192, x: 640 },
              ].map((t) => (
                <g key={t.m}>
                  <line x1={t.x} y1="240" x2={t.x} y2="246" stroke={C.dim} strokeWidth="1" />
                  <text x={t.x} y="262" textAnchor="middle" fill={C.bright} fontSize="11" fontFamily="monospace">
                    m = {t.m}
                  </text>
                </g>
              ))}
              <text x="360" y="285" textAnchor="middle" fill={C.bright} fontSize="12" fontWeight="bold">
                m (number of slots)
              </text>
              {/* Highlight band at m=96 */}
              <rect x="335" y="50" width="50" height="190" fill={`${C.pink}18`} />
              <text x="360" y="46" textAnchor="middle" fill={C.pink} fontSize="11" fontWeight="bold">
                Production sweet spot
              </text>
              {/* Left y-axis label (recall) */}
              <text
                x="36"
                y="148"
                textAnchor="middle"
                fill={C.green}
                fontSize="12"
                fontWeight="bold"
                transform="rotate(-90 36 148)"
              >
                Recall@10
              </text>
              {/* Right y-axis label (bytes) */}
              <text
                x="688"
                y="148"
                textAnchor="middle"
                fill={C.orange}
                fontSize="12"
                fontWeight="bold"
                transform="rotate(90 688 148)"
              >
                Bytes / vec
              </text>
              {/* Recall y-axis ticks */}
              {[
                { v: 0.8, y: 230 },
                { v: 0.9, y: 150 },
                { v: 1.0, y: 70 },
              ].map((t, i) => (
                <g key={i}>
                  <line x1="74" y1={t.y} x2="80" y2={t.y} stroke={C.green} strokeWidth="1" />
                  <text x="68" y={t.y + 4} textAnchor="end" fill={C.green} fontSize="10" fontFamily="monospace">
                    {t.v.toFixed(1)}
                  </text>
                </g>
              ))}
              {/* Bytes y-axis ticks */}
              {[
                { v: 8, y: 232 },
                { v: 96, y: 150 },
                { v: 192, y: 70 },
              ].map((t, i) => (
                <g key={i}>
                  <line x1="640" y1={t.y} x2="646" y2={t.y} stroke={C.orange} strokeWidth="1" />
                  <text x="652" y={t.y + 4} textAnchor="start" fill={C.orange} fontSize="10" fontFamily="monospace">
                    {t.v}
                  </text>
                </g>
              ))}
              {/* Bytes line - linear from (80,232) m=8 to (640,70) m=192 */}
              <line x1="80" y1="232" x2="220" y2="200" stroke={C.orange} strokeWidth="2" />
              <line x1="220" y1="200" x2="360" y2="150" stroke={C.orange} strokeWidth="2" />
              <line x1="360" y1="150" x2="640" y2="70" stroke={C.orange} strokeWidth="2" />
              {/* Bytes points */}
              {[
                { x: 80, y: 232 },
                { x: 220, y: 200 },
                { x: 360, y: 150 },
                { x: 640, y: 70 },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.orange} stroke="#08080d" strokeWidth="1" />
              ))}
              {/* Recall curve - rising and flattening from 0.81 to 0.98 */}
              {/* recall axis: 0.8 -> y=230, 1.0 -> y=70; range 0.2 over 160 */}
              {/* values: 0.81 -> y=222, 0.91 -> y=142, 0.96 -> y=102, 0.98 -> y=86 */}
              <path
                d="M 80 222 Q 150 200 220 142 Q 290 110 360 102 Q 500 95 640 86"
                stroke={C.green}
                strokeWidth="2.5"
                fill="none"
              />
              {[
                { x: 80, y: 222, label: "0.81", lx: 0, ly: -10, anchor: "middle" },
                { x: 220, y: 142, label: "0.91", lx: 0, ly: -10, anchor: "middle" },
                { x: 360, y: 102, label: "0.96", lx: 0, ly: -10, anchor: "middle" },
                // last point's label sits well LEFT of the marker to avoid touching it and the "192" bytes tick
                { x: 640, y: 86, label: "0.98", lx: -16, ly: 4, anchor: "end" },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill={C.green} stroke="#08080d" strokeWidth="1" />
                  <text
                    x={p.x + p.lx}
                    y={p.y + p.ly}
                    textAnchor={p.anchor}
                    fill={C.green}
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
              {/* Legend - positioned in the top-left corner above the chart, clear of all data */}
              <rect x="95" y="10" width="220" height="30" fill="rgba(0,0,0,0.4)" stroke={`${C.pink}44`} rx="4" />
              <line x1="105" y1="22" x2="123" y2="22" stroke={C.green} strokeWidth="2.5" />
              <text x="129" y="26" textAnchor="start" fill={C.green} fontSize="10">
                Recall@10 (OPQ)
              </text>
              <line x1="217" y1="22" x2="235" y2="22" stroke={C.orange} strokeWidth="2" />
              <text x="241" y="26" textAnchor="start" fill={C.orange} fontSize="10">
                bytes per vector
              </text>
            </svg>
          </div>
          <T color="#f8aee0" style={{ marginTop: 12 }}>
            m controls everything. Higher m means smaller sub-vectors, simpler k-means, tighter approximation, higher
            recall. But it also means more bytes per encoded vector. Pick the smallest m that hits your recall target.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {["M", "Bytes/vec", "Compression", "Recall@10 (OPQ)", "Typical use"].map((h, i) => (
                <div
                  key={`h-${i}`}
                  style={{
                    padding: "8px 6px",
                    background: `${C.pink}14`,
                    color: C.pink,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: 4,
                  }}
                >
                  {h}
                </div>
              ))}
              {[
                { m: "8", bytes: "8", ratio: "384x", recall: "0.81", use: "Extreme scale" },
                { m: "48", bytes: "48", ratio: "64x", recall: "0.91", use: "Web-scale search" },
                { m: "96", bytes: "96", ratio: "32x", recall: "0.96", use: "The production sweet spot" },
                { m: "192", bytes: "192", ratio: "16x", recall: "0.98", use: "Recall-sensitive workloads" },
              ].map((row, i) => (
                <div key={`r-${i}`} style={{ display: "contents" }}>
                  {[row.m, row.bytes, row.ratio, row.recall, row.use].map((cell, ci) => (
                    <div
                      key={ci}
                      style={{
                        padding: "8px 6px",
                        textAlign: "center",
                        color: ci === 4 ? C.dim : C.bright,
                        background: i === 2 ? `${C.pink}08` : "transparent",
                        fontWeight: i === 2 && ci !== 4 ? "bold" : "normal",
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <T color="#f8aee0" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            m = 96 (32x compression, 0.96 recall) is the canonical setting in FAISS and Qdrant.
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
