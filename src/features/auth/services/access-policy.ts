import { z } from "zod";

const googleProfileSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  email_verified: z.literal(true),
});

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function verifiedGoogleEmail(
  provider: string | undefined,
  profile: unknown,
): string | null {
  if (provider !== "google") {
    return null;
  }

  const result = googleProfileSchema.safeParse(profile);
  return result.success ? normalizeEmail(result.data.email) : null;
}

export function isAllowedEmail(
  email: string,
  allowedEmails: readonly string[],
): boolean {
  return allowedEmails.includes(normalizeEmail(email));
}

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/api/health" ||
    pathname.startsWith("/api/auth/")
  );
}

export function canAccessPath(
  pathname: string,
  isAuthenticated: boolean,
): boolean {
  return isPublicPath(pathname) || isAuthenticated;
}

export function hasAlbumAccess(
  memberAlbumId: string,
  requestedAlbumId: string,
): boolean {
  return memberAlbumId === requestedAlbumId;
}
