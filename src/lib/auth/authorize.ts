import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  findMembershipByUserId,
  membershipExists,
} from "@/features/auth/repositories/album-membership.repository";

export type AlbumContext = {
  userId: string;
  userName: string | null;
  albumId: string;
  albumSlug: string;
  albumName: string;
  role: "OWNER" | "MEMBER";
};

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
});

export const getCurrentAlbumContext = cache(async (): Promise<AlbumContext> => {
  const session = await verifySession();
  const membership = await findMembershipByUserId(session.user.id);

  if (!membership) {
    redirect("/login?error=AccessDenied");
  }

  return {
    userId: session.user.id,
    userName: session.user.name ?? null,
    albumId: membership.album.id,
    albumSlug: membership.album.slug,
    albumName: membership.album.name,
    role: membership.role,
  };
});

export async function requireAlbumMember(
  albumId?: string,
): Promise<AlbumContext> {
  const context = await getCurrentAlbumContext();

  if (albumId && !(await membershipExists(context.userId, albumId))) {
    notFound();
  }

  return context;
}
