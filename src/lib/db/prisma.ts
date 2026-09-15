import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  minePrisma?: PrismaClient;
};

function databaseUrl(): string {
  const configuredUrl = process.env.DATABASE_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production.");
  }

  return "postgresql://postgres:postgres@127.0.0.1:5432/mine";
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.minePrisma) {
    return globalForPrisma.minePrisma;
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl() });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.minePrisma = client;
  }

  return client;
}
