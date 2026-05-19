export const BASE_PATH = import.meta.env.BASE_URL;

function stripBase(pathname) {
  // Normalise: BASE_PATH always ends in "/". Accept the bare base without trailing slash too.
  const base = BASE_PATH;
  if (pathname === base.slice(0, -1) || pathname === base) return "";
  if (pathname.startsWith(base)) return pathname.slice(base.length).replace(/\/$/, "");
  // Tests may pass a path with no base prefix
  if (pathname === "/" || pathname === "") return "";
  return pathname.replace(/^\//, "").replace(/\/$/, "");
}

export function parsePath(pathname, { chapters, sections, superSections }) {
  const rest = stripBase(pathname);
  if (!rest) return { kind: "toc", super: null, section: null };

  const segs = rest.split("/");

  // TOC: 1 segment = super
  if (segs.length === 1) {
    const sg = superSections.find((s) => s.slug === segs[0]);
    if (sg) return { kind: "toc", super: sg.id, section: null };
    return { kind: "invalid" };
  }

  // 2 segments: chapter first, then super+section
  if (segs.length === 2) {
    const slug = `${segs[0]}/${segs[1]}`;
    const chIdx = chapters.findIndex((c) => c.slug === slug);
    if (chIdx >= 0) return { kind: "chapter", ch: chIdx, sub: 0 };

    const sg = superSections.find((s) => s.slug === segs[0]);
    if (sg) {
      const sec = sections.find((x) => x.slug === segs[1] && sg.sections.includes(x.num));
      if (sec) return { kind: "toc", super: sg.id, section: sec.num };
    }
    return { kind: "invalid" };
  }

  // 3 segments: chapter + sub
  if (segs.length === 3) {
    const slug = `${segs[0]}/${segs[1]}`;
    const chIdx = chapters.findIndex((c) => c.slug === slug);
    if (chIdx < 0) return { kind: "invalid" };
    const sub = Number(segs[2]);
    if (!Number.isFinite(sub) || sub < 0 || !Number.isInteger(sub)) return { kind: "invalid" };
    return { kind: "chapter", ch: chIdx, sub };
  }

  return { kind: "invalid" };
}
