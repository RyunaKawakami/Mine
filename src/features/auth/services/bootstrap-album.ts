import "server-only";

import { AlbumRole } from "@/generated/prisma/enums";
import { env } from "@/config/env";
import {
  isAllowedEmail,
  normalizeEmail,
} from "@/features/auth/services/access-policy";
import { getPrisma } from "@/lib/db/prisma";

type BootstrapAlbumInput = {
  userId: string;
  email: string;
};

export async function bootstrapAlbumMembership({
  userId,
  email,
}: BootstrapAlbumInput): Promise<void> {
  const normalizedEmail = normalizeEmail(email);

  if (!isAllowedEmail(normalizedEmail, env.MINE_ALLOWED_EMAILS)) {
    throw new Error("This Google account is not allowed to access Mine.");
  }

  const role =
    env.MINE_ALLOWED_EMAILS[0] === normalizedEmail
      ? AlbumRole.OWNER
      : AlbumRole.MEMBER;

  await getPrisma().$transaction(async (transaction) => {
    const album = await transaction.album.upsert({
      where: { slug: env.MINE_ALBUM_SLUG },
      create: {
        slug: env.MINE_ALBUM_SLUG,
        name: "Mine",
      },
      update: {},
      select: { id: true },
    });

    await transaction.albumMember.upsert({
      where: {
        albumId_userId: {
          albumId: album.id,
          userId,
        },
      },
      create: {
        albumId: album.id,
        userId,
        role,
      },
      update: { role },
    });
  });
}
