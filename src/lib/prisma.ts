import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://neondb_owner:npg_vgjCHR4csr9q@ep-noisy-bar-amgycurv.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: `${databaseUrl}&connection_limit=1&pool_timeout=20`,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
