import { describe, expect, it } from "vitest";

import { parseServerEnv } from "./env.schema";

describe("parseServerEnv", () => {
  it("uses safe defaults when optional integrations are not configured", () => {
    const result = parseServerEnv({ NODE_ENV: "test" });

    expect(result.NODE_ENV).toBe("test");
    expect(result.MINE_ALBUM_SLUG).toBe("mine");
    expect(result.MINE_ALLOWED_EMAILS).toEqual([]);
  });

  it("normalizes and deduplicates allowlisted email addresses", () => {
    const result = parseServerEnv({
      NODE_ENV: "test",
      MINE_ALLOWED_EMAILS:
        " User-A@example.com, user-b@example.com,user-a@example.com ",
    });

    expect(result.MINE_ALLOWED_EMAILS).toEqual([
      "user-a@example.com",
      "user-b@example.com",
    ]);
  });

  it("rejects non-PostgreSQL database URLs", () => {
    expect(() =>
      parseServerEnv({
        NODE_ENV: "test",
        DATABASE_URL: "mysql://localhost/mine",
      }),
    ).toThrowError();
  });
});
