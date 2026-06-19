/**
 * One-time script: applies the initial migration SQL directly to a Turso database
 * via the libsql client. Use when `prisma migrate deploy` can't reach the libsql
 * scheme (Prisma's migration engine only understands file:// URLs natively).
 *
 * Usage:
 *   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... npx tsx scripts/turso-migrate.ts
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const client = createClient({ url, authToken });

const migrationSql = readFileSync(
  join(__dirname, "../prisma/migrations/20260618133735_init/migration.sql"),
  "utf-8"
);

// Split on semicolons, strip comment lines from each chunk, drop empties
const statements = migrationSql
  .split(";")
  .map((s) =>
    s
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim()
  )
  .filter((s) => s.length > 0);

async function main() {
  console.log(`Connecting to ${url}`);
  console.log(`Applying ${statements.length} statements…`);

  for (const stmt of statements) {
    await client.execute(stmt);
  }

  // Record the migration so Prisma knows it has already been applied
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id"                      TEXT PRIMARY KEY NOT NULL,
      "checksum"                TEXT NOT NULL,
      "finished_at"             DATETIME,
      "migration_name"          TEXT NOT NULL,
      "logs"                    TEXT,
      "rolled_back_at"          DATETIME,
      "started_at"              DATETIME NOT NULL DEFAULT current_timestamp,
      "applied_steps_count"     INTEGER NOT NULL DEFAULT 0
    )
  `);

  await client.execute({
    sql: `INSERT OR IGNORE INTO "_prisma_migrations"
          ("id","checksum","finished_at","migration_name","applied_steps_count")
          VALUES (?,?,datetime('now'),?,1)`,
    args: [
      "turso-migrate-init",
      "manual",
      "20260618133735_init",
    ],
  });

  console.log("Done — schema applied and migration recorded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
