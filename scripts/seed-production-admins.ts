import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../shared/schema";
import pg from "pg";

const { Pool } = pg;

async function seedProductionAdmins() {
  // Check for command-line argument first, then fall back to environment variable
  const connectionString = process.argv[2] || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("\n✗ Error: No database connection string provided.");
    console.error("\nUsage:");
    console.error("  npx tsx scripts/seed-production-admins.ts <PRODUCTION_DATABASE_URL>");
    console.error("\nExample:");
    console.error('  npx tsx scripts/seed-production-admins.ts "postgresql://user:pass@host:5432/db"');
    console.error("\nYou can find your production DATABASE_URL in the Secrets tab under 'production' environment.");
    process.exit(1);
  }

  console.log("\n=== Seeding Production Admin Users ===");
  console.log(`Connecting to: ${connectionString.replace(/:[^:@]+@/, ":****@")}\n`);

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  try {
    const adminsToCreate = [
      {
        email: "craig@10000daysfund.com",
        password: "$2b$10$ldlILMzBSYTLzO9naqXPt.qZf1nq15AY.PcjLNcyWuItt4KASBpxW",
        role: "admin" as const,
        isApproved: true,
      },
      {
        email: "craigdelaune@gmail.com",
        password: "$2b$10$WH/kgUe21n9khw61x5t/cO6wg6W86KdEih7yAA.3JC7aTkUjO4kE6",
        role: "admin" as const,
        isApproved: true,
      },
    ];

    for (const admin of adminsToCreate) {
      try {
        const result = await db.insert(users).values(admin).returning();
        console.log(`✓ Created admin: ${result[0].email}`);
      } catch (error: any) {
        if (error.code === "23505") {
          console.log(`- Skipped (already exists): ${admin.email}`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n✓ Production admin seeding complete!\n");

    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error("\n✗ Error seeding admin users:");
    console.error(error.message);
    await pool.end();
    process.exit(1);
  }
}

seedProductionAdmins();
