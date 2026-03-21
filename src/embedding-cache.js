/**
 * IndexedDB cache for pre-computed embeddings.
 *
 * Stores vectors keyed by a checksum. On repeat visits, if the checksum
 * matches, we skip the ~1.6MB embeddings.json download entirely.
 *
 * Uses IndexedDB (not localStorage) because vectors are too large for
 * localStorage's ~5MB limit.
 */

const DB_NAME = "learn-ai-embeddings";
const DB_VERSION = 1;
const STORE_NAME = "embeddings";
const KEY = "vectors";

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

/**
 * Retrieve cached vectors if the checksum matches.
 * Returns the vectors array or null (cache miss / error / no IndexedDB).
 */
export async function getCachedEmbeddings(checksum) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME);
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY);
      req.onsuccess = (e) => {
        db.close();
        const cached = e.target.result;
        if (cached && cached.checksum === checksum && Array.isArray(cached.vectors)) {
          resolve(cached.vectors);
        } else {
          resolve(null);
        }
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

/**
 * Store vectors in IndexedDB with their checksum.
 * Silently fails if IndexedDB is unavailable.
 */
export async function cacheEmbeddings(checksum, vectors) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ checksum, vectors }, KEY);
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
    // Silently fail - embeddings will just download next time
  }
}
