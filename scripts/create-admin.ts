import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../shared/schema";
import pg from "pg";
import bcrypt from "bcrypt";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const { Pool } = pg;

async function createAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  const rl = readline.createInterface({ input, output });

  try {
    console.log("\n=== Create Admin User ===\n");

    const email = await rl.question("Enter admin email: ");
    const password = await rl.question("Enter admin password: ");

    if (!email || !password) {
      console.error("Email and password are required");
      process.exit(1);
    }

    if (password.length < 8) {
      console.error("Password must be at least 8 characters long");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.insert(users).values({
      email,
      password: hashedPassword,
      isApproved: true,
      role: "admin",
    }).returning();

    console.log("\n✓ Admin user created successfully!");
    console.log(`Email: ${result[0].email}`);
    console.log(`Role: ${result[0].role}`);
    console.log(`Approved: ${result[0].isApproved}\n`);

    await pool.end();
    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error("\n✗ Error creating admin user:");
    if (error.code === "23505") {
      console.error("This email already exists in the database");
    } else {
      console.error(error.message);
    }
    await pool.end();
    rl.close();
    process.exit(1);
  }
}

createAdmin();
