import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const DEFAULT_URL = "file:./prisma/dev.db";

/// Postgres (Supabase) when DATABASE_URL points at a Postgres server, local
/// SQLite otherwise. Switching to Supabase also needs
/// `provider = "postgresql"` in prisma/schema.prisma — see the README.
function createClient() {
  const url = process.env.DATABASE_URL ?? DEFAULT_URL;
  const adapter = url.startsWith("postgres")
    ? new PrismaPg({ connectionString: url })
    : new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
