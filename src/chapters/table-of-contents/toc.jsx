import { C, chapters, sectionNames, sectionColors, sections, superSections, sectionSuper } from "../../config.js";
import { Box, T } from "../../components.jsx";

export default function TOC(ctx) {
  const { goTo, expanded, setExpanded, currentChapter } = ctx;

  if (expanded == null && currentChapter && currentChapter.section > 0) {
    setExpanded({ super: sectionSuper[currentChapter.section], section: currentChapter.section });
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
    chapterCount: sg.sections.reduce((sum, s) => sum + sectionCounts[s], 0),
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
                borderRadius: 14,
                background: `linear-gradient(180deg, ${sg.color}12, ${sg.color}03)`,
                border: `1px solid ${isSuperOpen ? `${sg.color}40` : `${sg.color}1f`}`,
                boxShadow: isSuperOpen ? `0 8px 24px -12px ${sg.color}40` : "none",
                overflow: "hidden",
                transition: "all 0.25s",
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
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${sg.color}55, ${sg.color}1a)`,
                      color: sg.color,
                      fontWeight: 900,
                      fontSize: 22,
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 4px 14px -6px ${sg.color}80`,
                    }}
                  >
                    {sg.id}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <T color={sg.color} bold size={18}>
                      {sg.name}
                    </T>
                    {!isSuperOpen && sg.desc && (
                      <T color={C.dim} size={12} style={{ marginTop: 2, lineHeight: 1.35 }}>
                        {sg.desc}
                      </T>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: sg.color,
                      background: `${sg.color}14`,
                      border: `1px solid ${sg.color}30`,
                      padding: "5px 10px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {counts.sectionCount} Sections · {counts.chapterCount} Chapters
                  </span>
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
                  style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {sg.desc && (
                    <T color={C.dim} size={13} style={{ paddingLeft: 40, marginBottom: 4, lineHeight: 1.4 }}>
                      {sg.desc}
                    </T>
                  )}
                  {sg.sections.map((secNum) => {
                    const secColor = sectionColors[secNum];
                    const isSecOpen = openSection === secNum;
                    const secChapters = chaptersBySection[secNum];
                    return (
                      <div
                        key={secNum}
                        style={{
                          borderRadius: 10,
                          background: `linear-gradient(180deg, ${secColor}10, ${secColor}03)`,
                          border: `1px solid ${isSecOpen ? `${secColor}40` : `${secColor}1c`}`,
                          boxShadow: isSecOpen ? `0 4px 14px -8px ${secColor}45` : "none",
                          overflow: "hidden",
                          marginLeft: 30,
                          transition: "all 0.2s",
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
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <span
                              style={{
                                background: `linear-gradient(135deg, ${secColor}55, ${secColor}1a)`,
                                color: secColor,
                                fontWeight: 800,
                                fontSize: 14,
                                width: 28,
                                height: 28,
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: `0 3px 10px -5px ${secColor}80`,
                              }}
                            >
                              {secNum}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <T color={secColor} bold size={16}>
                                {sectionNames[secNum]}
                              </T>
                              {!isSecOpen && sections[secNum - 1].desc && (
                                <T color={C.dim} size={12} style={{ marginTop: 2, lineHeight: 1.35 }}>
                                  {sections[secNum - 1].desc}
                                </T>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: secColor,
                                background: `${secColor}14`,
                                border: `1px solid ${secColor}30`,
                                padding: "4px 9px",
                                borderRadius: 999,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {secChapters.length} Chapters
                            </span>
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
                            {sections[secNum - 1].desc && (
                              <T color={C.dim} size={12} style={{ paddingLeft: 34, marginBottom: 4, lineHeight: 1.4 }}>
                                {sections[secNum - 1].desc}
                              </T>
                            )}
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
