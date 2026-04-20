// Node 25 ships with an experimental built-in `localStorage` global that
// requires the --localstorage-file CLI flag. Without the flag, Node emits
// "localstorage-file was provided without a valid path" and exposes an empty
// plain object as globalThis.localStorage. That broken global wins over
// jsdom's Storage instance, so localStorage.clear, .getItem, .setItem are
// undefined and our nav-persistence tests fail.
//
// This setup runs before every test file and installs a working in-memory
// Storage shim on both `globalThis` and `window`, regardless of what Node or
// jsdom put there.

function makeMemoryStorage() {
  const data = new Map();
  return {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key) {
      return data.has(String(key)) ? data.get(String(key)) : null;
    },
    setItem(key, value) {
      data.set(String(key), String(value));
    },
    removeItem(key) {
      data.delete(String(key));
    },
    key(index) {
      return Array.from(data.keys())[index] ?? null;
    },
  };
}

const storage = makeMemoryStorage();
Object.defineProperty(globalThis, "localStorage", {
  value: storage,
  writable: true,
  configurable: true,
});
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: storage,
    writable: true,
    configurable: true,
  });
}
