import { defineConfig } from "drizzle-kit";
import { getUserDataPath } from "./src/paths/paths";
import path from "node:path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

// Use PostgreSQL if DATABASE_URL is set, otherwise fallback to SQLite
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: databaseUrl && databaseUrl.startsWith('postgresql://') ? "./drizzle-postgres" : "./drizzle",
  dialect: databaseUrl && databaseUrl.startsWith('postgresql://') ? "postgresql" : "sqlite",
  dbCredentials: databaseUrl && databaseUrl.startsWith('postgresql://') 
    ? { url: databaseUrl }
    : { url: path.join(getUserDataPath(), "sqlite.db") },
});
