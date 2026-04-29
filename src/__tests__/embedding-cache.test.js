import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function createMockIDB() {
  const data = {};
  const mockDB = {
    transaction: () => ({
      objectStore: () => ({
        get: (key) => {
          const req = { result: data[key] };
          setTimeout(() => req.onsuccess?.({ target: req }), 0);
          return req;
        },
        put: (value, key) => {
          data[key] = value;
          const req = {};
          setTimeout(() => req.onsuccess?.({ target: req }), 0);
          return req;
        },
      }),
    }),
    close: vi.fn(),
  };
  return { mockDB, data };
}

describe("embedding-cache (byte-array)", () => {
  let cache;
  let mockDB, data;

  beforeEach(async () => {
    ({ mockDB, data } = createMockIDB());
    globalThis.indexedDB = {
      open: vi.fn(() => {
        const req = {};
        setTimeout(() => {
          req.onupgradeneeded?.({
            target: {
              result: {
                ...mockDB,
                objectStoreNames: { contains: () => false },
                createObjectStore: () => {},
              },
            },
          });
          req.result = mockDB;
          req.onsuccess?.({ target: req });
        }, 0);
        return req;
      }),
    };
    vi.resetModules();
    cache = await import("../embedding-cache.js");
  });

  afterEach(() => {
    delete globalThis.indexedDB;
  });

  it("round-trips a Uint8Array bin payload + manifest", async () => {
    const bin = new Uint8Array([1, 2, 3, 4]);
    const manifest = { modelChecksum: "ck1", dim: 2, count: 2, vectors: [] };
    await cache.cacheSearchAssets("ck1", { bin, manifest });
    const got = await cache.getCachedSearchAssets("ck1");
    expect(got.manifest).toEqual(manifest);
    expect(Array.from(got.bin)).toEqual([1, 2, 3, 4]);
  });

  it("returns null on checksum miss", async () => {
    const bin = new Uint8Array([1, 2]);
    await cache.cacheSearchAssets("ck1", { bin, manifest: { modelChecksum: "ck1", dim: 1, count: 2, vectors: [] } });
    const got = await cache.getCachedSearchAssets("ck2");
    expect(got).toBeNull();
  });

  it("returns null when IndexedDB is unavailable", async () => {
    delete globalThis.indexedDB;
    vi.resetModules();
    const mod = await import("../embedding-cache.js");
    const got = await mod.getCachedSearchAssets("ck1");
    expect(got).toBeNull();
  });
});
