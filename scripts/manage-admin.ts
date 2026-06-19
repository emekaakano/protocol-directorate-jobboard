/**
 * Super-admin CLI for managing Protocol Directorate JobBoard admin accounts.
 * Requires DATABASE_URL and DATABASE_AUTH_TOKEN in .env — only the super admin holds these.
 *
 * Usage:  npm run manage-admin
 */

import * as readline from "readline";
import bcrypt from "bcryptjs";
import { createClient } from "@libsql/client";

// ── DB client ──────────────────────────────────────────────────────────────

const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// ── Prompts ────────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

/** Reads a password without echoing characters to the terminal. */
function askPassword(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let password = "";
    function onData(char: string) {
      if (char === "\r" || char === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "") {
        // Ctrl-C
        process.stdout.write("\n");
        process.exit();
      } else if (char === "" || char === "\b") {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        password += char;
        process.stdout.write("*");
      }
    }
    stdin.on("data", onData);
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────

function hr() {
  console.log("─".repeat(50));
}

function cuid(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `c${timestamp}${random}`;
}

// ── Actions ────────────────────────────────────────────────────────────────

async function listAdmins() {
  hr();
  const { rows } = await db.execute(
    'SELECT id, email, name, isActive, createdAt FROM "Admin" ORDER BY createdAt'
  );
  if (rows.length === 0) {
    console.log("  No admin accounts found.");
  } else {
    console.log(`  ${"NAME".padEnd(24)} ${"EMAIL".padEnd(32)} STATUS`);
    console.log(`  ${"─".repeat(24)} ${"─".repeat(32)} ──────`);
    for (const row of rows) {
      const status = row.isActive ? "active" : "INACTIVE";
      console.log(
        `  ${String(row.name).padEnd(24)} ${String(row.email).padEnd(32)} ${status}`
      );
    }
  }
  hr();
}

async function createAdmin() {
  hr();
  const name = (await ask("  Full name: ")).trim();
  const email = (await ask("  Email address: ")).trim().toLowerCase();

  // Check duplicate
  const { rows } = await db.execute({
    sql: 'SELECT id FROM "Admin" WHERE email = ?',
    args: [email],
  });
  if (rows.length > 0) {
    console.log("  ✗ An account with that email already exists.");
    return;
  }

  const password = await askPassword("  Password: ");
  const confirm = await askPassword("  Confirm password: ");
  if (password !== confirm) {
    console.log("  ✗ Passwords do not match.");
    return;
  }
  if (password.length < 8) {
    console.log("  ✗ Password must be at least 8 characters.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = cuid();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO "Admin" (id, email, passwordHash, name, isActive, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, 1, ?, ?)`,
    args: [id, email, passwordHash, name, now, now],
  });

  console.log(`  ✓ Admin account created for ${name} <${email}>.`);
  hr();
}

async function resetPassword() {
  hr();
  const email = (await ask("  Admin email: ")).trim().toLowerCase();

  const { rows } = await db.execute({
    sql: 'SELECT id, name FROM "Admin" WHERE email = ?',
    args: [email],
  });
  if (rows.length === 0) {
    console.log("  ✗ No admin found with that email.");
    return;
  }

  const admin = rows[0];
  const password = await askPassword(`  New password for ${admin.name}: `);
  const confirm = await askPassword("  Confirm new password: ");
  if (password !== confirm) {
    console.log("  ✗ Passwords do not match.");
    return;
  }
  if (password.length < 8) {
    console.log("  ✗ Password must be at least 8 characters.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();

  await db.execute({
    sql: 'UPDATE "Admin" SET passwordHash = ?, updatedAt = ? WHERE id = ?',
    args: [passwordHash, now, admin.id],
  });

  console.log(`  ✓ Password updated for ${admin.name}.`);
  hr();
}

async function setActiveState(activate: boolean) {
  hr();
  const verb = activate ? "Reactivate" : "Deactivate";
  const email = (await ask(`  ${verb} — admin email: `)).trim().toLowerCase();

  const { rows } = await db.execute({
    sql: 'SELECT id, name, isActive FROM "Admin" WHERE email = ?',
    args: [email],
  });
  if (rows.length === 0) {
    console.log("  ✗ No admin found with that email.");
    return;
  }

  const admin = rows[0];
  const alreadyInState = activate ? admin.isActive === 1 : admin.isActive === 0;
  if (alreadyInState) {
    console.log(`  ✗ ${admin.name} is already ${activate ? "active" : "inactive"}.`);
    return;
  }

  const now = new Date().toISOString();
  await db.execute({
    sql: 'UPDATE "Admin" SET isActive = ?, updatedAt = ? WHERE id = ?',
    args: [activate ? 1 : 0, now, admin.id],
  });

  console.log(`  ✓ ${admin.name} has been ${activate ? "reactivated" : "deactivated"}.`);
  hr();
}

// ── Main menu ──────────────────────────────────────────────────────────────

async function menu() {
  while (true) {
    console.log("\n  Protocol Directorate JobBoard — Admin Manager");
    hr();
    console.log("  1) List all admin accounts");
    console.log("  2) Create new admin account");
    console.log("  3) Reset an admin's password");
    console.log("  4) Deactivate an admin account");
    console.log("  5) Reactivate an admin account");
    console.log("  0) Exit");
    hr();

    const choice = (await ask("  Choice: ")).trim();

    switch (choice) {
      case "1":
        await listAdmins();
        break;
      case "2":
        await createAdmin();
        break;
      case "3":
        await resetPassword();
        break;
      case "4":
        await setActiveState(false);
        break;
      case "5":
        await setActiveState(true);
        break;
      case "0":
        console.log("\n  Goodbye.\n");
        rl.close();
        db.close();
        process.exit(0);
      default:
        console.log("  Invalid choice — enter 0–5.");
    }
  }
}

menu().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
