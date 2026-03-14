const KEY = "learn-ai-nav";

function fingerprint(chapters) {
  return chapters.map((c) => c.id).join(",");
}

export function saveNav(ch, sub, chapters) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ch, sub, fingerprint: fingerprint(chapters) }));
  } catch {
    // Private browsing or quota exceeded - silently skip
  }
}

export function loadNav(chapters) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.fingerprint !== fingerprint(chapters)) return null;
    const ch = Number(saved.ch);
    const sub = Number(saved.sub);
    if (!Number.isFinite(ch) || !Number.isFinite(sub) || ch < 0 || sub < 0) return null;
    return { ch, sub };
  } catch {
    return null;
  }
}
