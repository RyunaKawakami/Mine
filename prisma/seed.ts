import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { prefectures } from "../src/constants/prefectures";
import { seedPrefectures } from "./seed-prefectures";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedPrefectures(prisma);
}

main()
  .then(() => {
    console.info(`Seeded ${prefectures.length} prefectures.`);
  })
  .catch((error: unknown) => {
    console.error("Failed to seed prefectures.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
