import type { PrismaClient } from "../src/generated/prisma/client";
import { prefectures } from "../src/constants/prefectures";

export async function seedPrefectures(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    for (const prefecture of prefectures) {
      await transaction.prefecture.upsert({
        where: { id: prefecture.id },
        create: prefecture,
        update: {
          code: prefecture.code,
          name: prefecture.name,
          nameEn: prefecture.nameEn,
          region: prefecture.region,
        },
      });
    }
  });
}
