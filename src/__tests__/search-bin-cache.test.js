import { describe, it, expect } from "vitest";
import { expectedBinBytes } from "../search.js";

// Regression: returning visitors saw "[search] semantic init failed: Invalid
// typed array length" because an IndexedDB-cached embeddings.bin from an older
// deploy lacked the trailing Uint16 chunkIdx region. The cache key
// (checksum:count-firstId-lastId) was unchanged across the format change, so
// the stale bin was reused forever. expectedBinBytes lets the loader reject a
// wrong-size cached bin and refetch, self-healing poisoned caches.
describe("expectedBinBytes (cache size validation)", () => {
  it("counts int8 vectors + float32 scale + trailing chunkIdx region", () => {
    // Deployed corpus: 32936 vectors at dim 256 => 32936*(256+4) trailing 32936*2.
    expect(expectedBinBytes(32936, 256)).toBe(8629232);
  });

  it("differs from the pre-format-change size that poisoned caches", () => {
    const count = 32936;
    const dim = 256;
    const oldFormat = count * (dim + 4); // 8,563,360 - no trailing chunkIdx region
    expect(oldFormat).toBe(8563360);
    expect(expectedBinBytes(count, dim)).not.toBe(oldFormat);
  });

  it("scales with count and dim", () => {
    // Each vector contributes (dim + 4) vector/scale bytes + 2 chunkIdx bytes.
    expect(expectedBinBytes(2, 2)).toBe(2 * (2 + 4) + 2 * 2);
    expect(expectedBinBytes(0, 256)).toBe(0);
  });
});
