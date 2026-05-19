import { C, chapters, sectionNames, sectionColors, superSections, sectionSuper } from "../../config.js";
import { Box, T } from "../../components.jsx";

export default function TOC(ctx) {
  const { goTo, expanded, setExpanded, currentChapter } = ctx;

  if (expanded == null && currentChapter && currentChapter.section > 0) {
    const sup = sectionSuper[currentChapter.section];
    if (sup) setExpanded({ super: sup, section: currentChapter.section });
  }

  const chaptersBySection = {};
  chapters.forEach((c, idx) => {
    if (c.section > 0) {
      if (!chaptersBySection[c.section]) chaptersBySection[c.section] = [];
      chaptersBySection[c.section].push({ ...c, idx });
    }
  });

  const sectionCounts = {};
  Object.entries(chaptersBySection).forEach(([s, list]) => {
    sectionCounts[s] = list.length;
  });
  const superCounts = superSections.map((sg) => ({
    id: sg.id,
    sectionCount: sg.sections.length,
    chapterCount: sg.sections.reduce((sum, s) => sum + (sectionCounts[s] || 0), 0),
  }));

  const openSuper = expanded && typeof expanded === "object" ? expanded.super : null;
  const openSection = expanded && typeof expanded === "object" ? expanded.section : null;

  const toggleSuper = (id) => {
    if (openSuper === id) setExpanded(null);
    else setExpanded({ super: id, section: null });
  };
  const toggleSection = (sgId, secNum) => {
    if (openSection === secNum) setExpanded({ super: sgId, section: null });
    else setExpanded({ super: sgId, section: secNum });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold size={21} center>
          Your roadmap to understanding AI from scratch.
        </T>
        <T color="#b8a9ff" center style={{ marginTop: 6 }}>
          {chapters.length - 1} chapters. Zero prerequisites. Every concept built on the one before it.
        </T>
      </Box>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {superSections.map((sg, sgIdx) => {
          const isSuperOpen = openSuper === sg.id;
          const counts = superCounts[sgIdx];
          return (
            <div
              key={sg.id}
              style={{
                borderRadius: 10,
                background: `${sg.color}06`,
                border: `1px solid ${isSuperOpen ? `${sg.color}35` : `${sg.color}15`}`,
                overflow: "hidden",
                transition: "all 0.3s",
              }}
            >
              <div
                data-toc-super={sg.id}
                onClick={() => toggleSuper(sg.id)}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      background: `${sg.color}20`,
                      color: sg.color,
                      fontWeight: 800,
                      fontSize: 21,
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {sg.id}
                  </span>
                  <T color={sg.color} bold size={18}>
                    {sg.name}
                  </T>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <T color={C.dim} size={12}>
                    {counts.sectionCount} Sections · {counts.chapterCount} Chapters
                  </T>
                  <span
                    style={{
                      color: C.dim,
                      fontSize: 14,
                      transition: "transform 0.3s",
                      transform: isSuperOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {isSuperOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {sg.sections.map((secNum) => {
                    const secColor = sectionColors[secNum];
                    const isSecOpen = openSection === secNum;
                    const secChapters = chaptersBySection[secNum] || [];
                    return (
                      <div
                        key={secNum}
                        style={{
                          borderRadius: 8,
                          background: `${secColor}06`,
                          border: `1px solid ${isSecOpen ? `${secColor}35` : `${secColor}15`}`,
                          overflow: "hidden",
                          marginLeft: 30,
                        }}
                      >
                        <div
                          data-toc-section={secNum}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(sg.id, secNum);
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                background: `${secColor}20`,
                                color: secColor,
                                fontWeight: 700,
                                fontSize: 14,
                                width: 26,
                                height: 26,
                                borderRadius: 6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {secNum}
                            </span>
                            <T color={secColor} bold size={16}>
                              {sectionNames[secNum]}
                            </T>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <T color={C.dim} size={12}>
                              {secChapters.length} Chapters
                            </T>
                            <span
                              style={{
                                color: C.dim,
                                fontSize: 13,
                                transition: "transform 0.3s",
                                transform: isSecOpen ? "rotate(180deg)" : "rotate(0)",
                              }}
                            >
                              ▼
                            </span>
                          </div>
                        </div>

                        {isSecOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 2 }}
                          >
                            {secChapters.map((c) => (
                              <div
                                key={c.id}
                                data-toc-chapter={c.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goTo(c.idx);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "6px 8px 6px 34px",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  background: "transparent",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = `${secColor}10`)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <span style={{ color: `${secColor}88`, fontSize: 13, fontWeight: 700, minWidth: 28 }}>
                                  {c.id}
                                </span>
                                <T color={C.mid} size={15}>
                                  {c.title}
                                </T>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <T color={C.dim} size={16} center style={{ marginTop: 4 }}>
        Tap a part to expand, tap a section to drill in, tap a chapter to jump.
      </T>
    </div>
  );
}
