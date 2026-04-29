/**
 * IndexedDB cache for the search-asset bundle:
 *   - embeddings.bin (as Uint8Array)
 *   - embeddings-manifest.json (object)
 *
 * Keyed by modelChecksum. Mismatch ⇒ download fresh; new entry overwrites old.
 */

const DB_NAME = "learn-ai-search";
const DB_VERSION = 1;
const STORE_NAME = "assets";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedSearchAssets(modelChecksum) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME);
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(modelChecksum);
      req.onsuccess = (e) => {
        db.close();
        const v = e.target.result;
        if (v && v.bin instanceof Uint8Array && v.manifest) resolve(v);
        else resolve(null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function cacheSearchAssets(modelChecksum, { bin, manifest }) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ bin, manifest }, modelChecksum);
      req.onsuccess = () => {
        db.close();
        resolve();
      };
      req.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // Silently fail
  }
}
