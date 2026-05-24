import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { chapters, sectionNames, sectionColors, sections, superSections, sectionSuper } from "../../../config.js";
import { makeCtx } from "../../chapter-test-helpers.js";
import TOC from "../../../chapters/table-of-contents/toc.jsx";

afterEach(() => cleanup());

describe("TOC (two-level)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TOC(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders all 6 super-section names by default", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    superSections.forEach((sg) => {
      expect(container.textContent).toContain(sg.name);
    });
  });

  it("does not render any section name when fully collapsed", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    expect(container.textContent).not.toContain(sectionNames[7]);
  });

  it("clicking a super-section expands to show its section list", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: null })));
    const headers = container.querySelectorAll("[data-toc-super]");
    expect(headers.length).toBe(6);
    fireEvent.click(headers[2]);
    expect(setExpanded).toHaveBeenCalledWith({ super: "C", section: null });
  });

  it("shows section rows under an expanded super-section", () => {
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: null } })));
    [7, 8, 9, 10, 11, 12, 13, 14].forEach((n) => {
      expect(container.textContent).toContain(sectionNames[n]);
    });
    expect(container.textContent).not.toContain(sectionNames[1]);
  });

  it("clicking a section row inside expanded super-section drills into its chapters", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: null } })));
    const sectionHeaders = container.querySelectorAll("[data-toc-section]");
    expect(sectionHeaders.length).toBe(8);
    fireEvent.click(sectionHeaders[0]);
    expect(setExpanded).toHaveBeenCalledWith({ super: "C", section: 7 });
  });

  it("renders chapters when a section is drilled into and navigates on click", () => {
    const goTo = vi.fn();
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: 7 }, goTo })));
    const chaptersInSec7 = chapters.filter((c) => c.section === 7);
    expect(chaptersInSec7.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(chaptersInSec7[0].title);

    const chapterLinks = container.querySelectorAll("[data-toc-chapter]");
    expect(chapterLinks.length).toBeGreaterThan(0);
    fireEvent.click(chapterLinks[0]);
    expect(goTo).toHaveBeenCalled();
  });

  it("collapses super-section when clicked while open", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: null } })));
    const headers = container.querySelectorAll("[data-toc-super]");
    fireEvent.click(headers[2]);
    expect(setExpanded).toHaveBeenCalledWith(null);
  });

  it("clicking a different super-section switches the open one (single-open behavior)", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: 7 } })));
    const headers = container.querySelectorAll("[data-toc-super]");
    fireEvent.click(headers[0]);
    expect(setExpanded).toHaveBeenCalledWith({ super: "A", section: null });
  });

  superSections.forEach((sg) => {
    sg.sections.forEach((secNum) => {
      it(`super-section ${sg.id} expands to section ${secNum}'s chapters`, () => {
        const { container } = render(TOC(makeCtx({ expanded: { super: sg.id, section: secNum } })));
        expect(container.textContent).toContain(sectionNames[secNum]);
        const chs = chapters.filter((c) => c.section === secNum);
        if (chs.length > 0) {
          expect(container.textContent).toContain(chs[0].title);
        }
      });
    });
  });

  superSections.forEach((sg) => {
    it(`super-section ${sg.id} uses its configured color`, () => {
      const { container } = render(TOC(makeCtx({ expanded: null })));
      const h = sg.color.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const rgb = `rgb(${r}, ${g}, ${b})`;
      expect(container.innerHTML.toLowerCase()).toContain(rgb);
    });
  });

  superSections.forEach((sg) => {
    it(`section colors are preserved inside super-section ${sg.id}`, () => {
      const { container } = render(TOC(makeCtx({ expanded: { super: sg.id, section: null } })));
      sg.sections.forEach((secNum) => {
        const hex = sectionColors[secNum];
        const h = hex.replace("#", "");
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        const rgb = `rgb(${r}, ${g}, ${b})`;
        expect(container.innerHTML.toLowerCase()).toContain(rgb);
      });
    });
  });

  it("shows super-section description on each collapsed super-section row", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    superSections.forEach((sg) => {
      expect(container.textContent).toContain(sg.desc);
    });
  });

  it("shows super-section description inside the expanded super-section", () => {
    const sgC = superSections.find((s) => s.id === "C");
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: null } })));
    expect(container.textContent).toContain(sgC.desc);
  });

  it("shows section description on each collapsed section row inside an expanded super-section", () => {
    const sgC = superSections.find((s) => s.id === "C");
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: null } })));
    sgC.sections.forEach((secNum) => {
      const sec = sections[secNum - 1];
      expect(container.textContent).toContain(sec.desc);
    });
  });

  it("shows section description inside a drilled-in section", () => {
    const sec7 = sections[6];
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: 7 } })));
    expect(container.textContent).toContain(sec7.desc);
  });

  it("auto-opens the super-section and section of the current chapter when expanded is null and currentChapter is given", () => {
    const setExpanded = vi.fn();
    const sampleCh = chapters.find((c) => c.section === 10);
    const ctx = makeCtx({
      expanded: null,
      setExpanded,
      currentChapter: sampleCh,
    });
    render(TOC(ctx));
    const expectedSuper = sectionSuper[10];
    expect(setExpanded).toHaveBeenCalledWith({ super: expectedSuper, section: 10 });
  });

  it("does not auto-open when expanded is already set", () => {
    const setExpanded = vi.fn();
    const sampleCh = chapters.find((c) => c.section === 10);
    const ctx = makeCtx({
      expanded: { super: "A", section: 1 },
      setExpanded,
      currentChapter: sampleCh,
    });
    render(TOC(ctx));
    expect(setExpanded).not.toHaveBeenCalled();
  });

  it("does not auto-open when no currentChapter is given", () => {
    const setExpanded = vi.fn();
    render(TOC(makeCtx({ expanded: null, setExpanded, currentChapter: null })));
    expect(setExpanded).not.toHaveBeenCalled();
  });

  it("click inside open super-section body does not toggle the super-section closed", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: null }, setExpanded })));
    // The expanded super-section body is the sibling div under the [data-toc-super] header.
    // Find it by walking from the description text node.
    const descText = "Architecture deep dive";
    const descEl = Array.from(container.querySelectorAll("div")).find(
      (d) => d.textContent.startsWith(descText) && d.children.length === 0,
    );
    expect(descEl).toBeTruthy();
    fireEvent.click(descEl);
    // setExpanded was NOT called with null (would mean super-section closed).
    expect(setExpanded).not.toHaveBeenCalled();
  });

  it("click inside drilled-in section body does not collapse the section", () => {
    const setExpanded = vi.fn();
    const sec7 = sections[6];
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: 7 }, setExpanded })));
    // The drilled-in section body renders the section desc as a non-interactive T.
    // Click on it: the section body's onClick has stopPropagation, so the section
    // header (which would toggle setExpanded) must NOT fire.
    const descEl = Array.from(container.querySelectorAll("div")).find(
      (d) => d.textContent === sec7.desc && d.children.length === 0,
    );
    expect(descEl).toBeTruthy();
    fireEvent.click(descEl);
    expect(setExpanded).not.toHaveBeenCalledWith({ super: "C", section: null });
  });

  it("collapses a drilled-in section when its header is clicked again", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: 7 } })));
    const sectionHeaders = container.querySelectorAll("[data-toc-section]");
    expect(sectionHeaders.length).toBeGreaterThan(0);
    fireEvent.click(sectionHeaders[0]); // section 7 (already open)
    expect(setExpanded).toHaveBeenCalledWith({ super: "C", section: null });
  });

  it("chapter row hover handlers fire without throwing", () => {
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: 7 } })));
    const chapterLinks = container.querySelectorAll("[data-toc-chapter]");
    expect(chapterLinks.length).toBeGreaterThan(0);
    fireEvent.mouseEnter(chapterLinks[0]);
    fireEvent.mouseLeave(chapterLinks[0]);
  });

  it("does not render the tap-instructions hint", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    expect(container.textContent).not.toContain("Tap a part to expand");
    expect(container.textContent).not.toContain("tap a chapter to jump");
  });

  it("roadmap box uses compact vertical padding", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    const roadmapBox = container.firstChild.children[0];
    expect(roadmapBox.style.padding).toBe("10px 22px");
  });

});
