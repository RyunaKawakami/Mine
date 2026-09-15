import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { seedPrefectures } from "../../prisma/seed-prefectures";
import { PrismaClient } from "../../src/generated/prisma/client";

const connectionString = process.env.TEST_DATABASE_URL;
const describeWithDatabase = connectionString ? describe : describe.skip;

describeWithDatabase("Prisma PostgreSQL integration", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    if (!connectionString) {
      throw new Error("TEST_DATABASE_URL is required for integration tests.");
    }

    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it("seeds all prefectures idempotently", async () => {
    await seedPrefectures(prisma);
    await seedPrefectures(prisma);

    await expect(prisma.prefecture.count()).resolves.toBe(47);
  });

  it("rolls back a failed transaction", async () => {
    const slug = `rollback-${crypto.randomUUID()}`;

    await expect(
      prisma.$transaction(async (transaction) => {
        await transaction.album.create({ data: { slug } });
        throw new Error("force rollback");
      }),
    ).rejects.toThrow("force rollback");

    await expect(
      prisma.album.findUnique({ where: { slug } }),
    ).resolves.toBeNull();
  });
});
