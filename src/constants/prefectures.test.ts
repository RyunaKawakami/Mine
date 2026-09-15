import { describe, expect, it } from "vitest";

import { prefectures, prefectureRegions } from "./prefectures";

describe("prefectures", () => {
  it("contains every Japanese prefecture exactly once", () => {
    expect(prefectures).toHaveLength(47);
    expect(new Set(prefectures.map(({ id }) => id)).size).toBe(47);
    expect(new Set(prefectures.map(({ code }) => code)).size).toBe(47);
    expect(new Set(prefectures.map(({ name }) => name)).size).toBe(47);
    expect(prefectures.map(({ id }) => id)).toEqual(
      Array.from({ length: 47 }, (_, index) => index + 1),
    );
  });

  it("uses valid two-digit codes and supported regions", () => {
    const regions = new Set(prefectureRegions);

    for (const prefecture of prefectures) {
      expect(prefecture.code).toMatch(/^\d{2}$/);
      expect(regions.has(prefecture.region)).toBe(true);
    }
  });
});
