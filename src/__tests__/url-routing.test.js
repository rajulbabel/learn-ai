import { describe, it, expect } from "vitest";
import { BASE_PATH } from "../url-routing.js";

describe("BASE_PATH", () => {
  it("ends with a slash", () => {
    expect(BASE_PATH.endsWith("/")).toBe(true);
  });

  it("is the Vite base URL", () => {
    expect(BASE_PATH).toBe(import.meta.env.BASE_URL);
  });
});
