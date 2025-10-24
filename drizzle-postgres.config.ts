import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
  throw new Error('DATABASE_URL must be set to a valid PostgreSQL connection string');
}

export default defineConfig({
  schema: "./src/db/schema-postgres.ts",
  out: "./drizzle-postgres",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});