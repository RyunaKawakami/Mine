import { describe, expect, it } from "vitest";

import { demoTripSchema } from "./trip";

const validTrip = {
  title: "金沢旅行",
  startDate: "2026-08-08",
  endDate: "2026-08-10",
  comment: "楽しい旅",
  prefectureIds: [17],
};

describe("demoTripSchema", () => {
  it("accepts a valid trip", () => {
    expect(demoTripSchema.safeParse(validTrip).success).toBe(true);
  });

  it("requires at least one prefecture", () => {
    expect(
      demoTripSchema.safeParse({ ...validTrip, prefectureIds: [] }).success,
    ).toBe(false);
  });

  it("rejects an end date before the start date", () => {
    expect(
      demoTripSchema.safeParse({ ...validTrip, endDate: "2026-08-07" }).success,
    ).toBe(false);
  });
});
