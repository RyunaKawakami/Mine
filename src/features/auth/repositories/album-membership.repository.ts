import "server-only";

import { getPrisma } from "@/lib/db/prisma";

export async function findMembershipByUserId(userId: string) {
  return getPrisma().albumMember.findFirst({
    where: { userId },
    orderBy: { joinedAt: "asc" },
    select: {
      role: true,
      album: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });
}

export async function membershipExists(
  userId: string,
  albumId: string,
): Promise<boolean> {
  const membership = await getPrisma().albumMember.findUnique({
    where: {
      albumId_userId: { albumId, userId },
    },
    select: { albumId: true },
  });

  return membership !== null;
}
