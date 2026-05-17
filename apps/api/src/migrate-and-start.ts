import { spawnSync } from "node:child_process";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const migrator = postgres(databaseUrl, { max: 1 });

console.log("[boot] Ensuring Postgres extensions…");
await migrator.unsafe(`
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  CREATE EXTENSION IF NOT EXISTS "vector";
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";
`);
console.log("[boot] Extensions ready.");

console.log("[boot] Running migrations…");
await migrate(drizzle(migrator), {
  migrationsFolder: "./packages/db/drizzle",
});
console.log("[boot] Migrations applied.");

const rows = await migrator<{ count: string }[]>`
  SELECT COUNT(*)::text AS count FROM modules
`;
await migrator.end();

const moduleCount = Number(rows[0]?.count ?? "0");
if (moduleCount === 0) {
  console.log("[boot] DB empty, running seed…");
  const result = spawnSync("tsx", ["packages/db/src/seed/index.ts"], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    console.error("[boot] Seed failed (exit code", result.status, ")");
    process.exit(1);
  }
  console.log("[boot] Seed complete.");
} else {
  console.log(`[boot] DB already seeded (${moduleCount} modules), skipping seed.`);
}

console.log("[boot] Starting server…");
await import("./server.js");
