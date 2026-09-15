import { describe, expect, it } from "vitest";

import {
  canAccessPath,
  hasAlbumAccess,
  isAllowedEmail,
  verifiedGoogleEmail,
} from "./access-policy";

describe("Google access policy", () => {
  it("accepts a verified, allowlisted Google address", () => {
    const email = verifiedGoogleEmail("google", {
      email: " User-A@example.com ",
      email_verified: true,
    });

    expect(email).toBe("user-a@example.com");
    expect(isAllowedEmail(email ?? "", ["user-a@example.com"])).toBe(true);
  });

  it("rejects unverified or non-Google profiles", () => {
    expect(
      verifiedGoogleEmail("google", {
        email: "user-a@example.com",
        email_verified: false,
      }),
    ).toBeNull();
    expect(
      verifiedGoogleEmail("github", {
        email: "user-a@example.com",
        email_verified: true,
      }),
    ).toBeNull();
  });
});

describe("authentication guard", () => {
  it("allows public routes without a session", () => {
    expect(canAccessPath("/login", false)).toBe(true);
    expect(canAccessPath("/api/auth/signin", false)).toBe(true);
    expect(canAccessPath("/api/health", false)).toBe(true);
  });

  it("requires a session for application routes", () => {
    expect(canAccessPath("/", false)).toBe(false);
    expect(canAccessPath("/memories", false)).toBe(false);
    expect(canAccessPath("/", true)).toBe(true);
  });

  it("does not grant access across album boundaries", () => {
    expect(hasAlbumAccess("album-a", "album-a")).toBe(true);
    expect(hasAlbumAccess("album-a", "album-b")).toBe(false);
  });
});
